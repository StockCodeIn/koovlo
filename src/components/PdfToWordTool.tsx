"use client";

import { useState, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist";
import Tesseract from "tesseract.js";
import { Document, Packer, Paragraph, TextRun } from "docx";
import styles from "@/app/tools/pdf/to-word/toword.module.css";

// ✅ Configure PDF.js Worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

interface ExtractionResult {
  text: string;
  pages: number;
  confidence: number;
}

export default function PdfToWordOCR() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState("eng");
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState(0);
  const [extractedData, setExtractedData] = useState<ExtractionResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.type !== "application/pdf") {
      setMessage("❌ Please upload a valid PDF file.");
      return;
    }
    setFile(f);
    setMessage("");
    setExtractedData(null);
    setProgress(0);
  };

  const extractText = async () => {
    if (!file) return;
    setLoading(true);
    setMessage("Extracting text with OCR...");
    setProgress(0);

    try {
      const bytes = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
      let allText = "";
      let totalConfidence = 0;
      const numPages = pdf.numPages;

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2.5 });
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d")!;
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: ctx, viewport, canvas }).promise;
        const imageData = canvas.toDataURL("image/png");

        const currentProgress = Math.round((i / numPages) * 100);
        setProgress(currentProgress);
        setMessage(`🔍 Reading page ${i} / ${numPages}... (${currentProgress}%)`);

        // ✅ OCR Text Extraction
        const result = await Tesseract.recognize(imageData, lang, {
          logger: (info) => {
            if (info.status === "recognizing text") {
              setProgress(Math.round(((i - 1 + info.progress) / numPages) * 100));
            }
          },
        });

        allText += `\n--- Page ${i} ---\n${result.data.text}\n`;
        totalConfidence += result.data.confidence || 0;
      }

      if (!allText.trim()) {
        setMessage("⚠️ No readable text found. Try adjusting PDF quality.");
        setLoading(false);
        setProgress(0);
        return;
      }

      const avgConfidence = Math.round((totalConfidence / numPages) * 100);
      setExtractedData({
        text: allText,
        pages: numPages,
        confidence: avgConfidence,
      });
      setMessage(`✅ Text extracted! Confidence: ${avgConfidence}%`);
      setProgress(100);
    } catch (err) {
      console.error(err);
      setMessage("❌ OCR failed. Try another PDF.");
      setProgress(0);
    } finally {
      setLoading(false);
    }
  };

  const exportToWord = async () => {
    if (!extractedData) return;

    try {
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Document: ${file?.name || "untitled"}`,
                    bold: true,
                    size: 48,
                  }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Pages: ${extractedData.pages} | OCR Confidence: ${extractedData.confidence}%`,
                    italics: true,
                    size: 24,
                  }),
                ],
              }),
              new Paragraph({ text: "" }),
              new Paragraph({
                children: [new TextRun(extractedData.text)],
              }),
            ],
          },
        ],
      });

      const blob = await Packer.toBlob(doc);
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = file?.name?.replace(".pdf", "-extracted.docx") || "document.docx";
      a.click();
      URL.revokeObjectURL(a.href);

      setMessage("✅ Word document exported successfully!");
      setTimeout(() => resetForm(), 2000);
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to export Word document.");
    }
  };

  const exportToCSV = async () => {
    if (!extractedData) return;

    try {
      const csvContent = [
        `"PDF to Text Extraction"`,
        `"Document","${file?.name || "untitled"}"`,
        `"Pages",${extractedData.pages}`,
        `"OCR Confidence","${extractedData.confidence}%"`,
        `"Language","${lang.toUpperCase()}"`,
        `""`,
        `"Extracted Text"`,
        `"${extractedData.text.replace(/"/g, '""')}"`,
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = file?.name?.replace(".pdf", "-extracted.csv") || "document.csv";
      a.click();
      URL.revokeObjectURL(a.href);

      setMessage("✅ CSV file exported successfully!");
      setTimeout(() => resetForm(), 2000);
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to export CSV file.");
    }
  };

  const resetForm = () => {
    setFile(null);
    setExtractedData(null);
    setMessage("");
    setProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <main className={styles.container}>
      <section className={styles.box}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.pageTitle}>
            <span className={styles.icon}>🧠</span>
            <span className={styles.textGradient}>PDF to Document Converter</span>
          </h1>
          <p className={styles.subtitle}>
            Extract text from scanned or image-based PDFs with AI-powered OCR. Support for multiple languages.
          </p>
        </div>

        {/* Main Content */}
        <div className={styles.content}>
          {/* Step 1: Upload */}
          <div className={styles.stepSection}>
            <p className={styles.stepLabel}>Step 1 · Upload PDF</p>
            <label className={styles.fileInputBox}>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                onChange={handleFile}
                disabled={loading}
              />
              <div className={styles.fileInputContent}>
                <span className={styles.fileIcon}>📄</span>
                <span className={styles.fileName}>
                  {file ? file.name : "Choose a PDF file or drag & drop"}
                </span>
                {file && (
                  <span className={styles.fileSize}>
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                )}
              </div>
            </label>
          </div>

          {/* Step 2: Language & Extract */}
          {file && !extractedData && (
            <div className={styles.stepSection}>
              <p className={styles.stepLabel}>Step 2 · Select Language & Extract</p>
              <div className={styles.controlGrid}>
                <div className={styles.controlGroup}>
                  <label htmlFor="lang" className={styles.label}>
                    OCR Language:
                  </label>
                  <select
                    id="lang"
                    value={lang}
                    onChange={(e) => setLang(e.target.value)}
                    disabled={loading}
                    className={styles.select}
                  >
                    <option value="eng">🇬🇧 English</option>
                    <option value="hin">🇮🇳 Hindi</option>
                    <option value="tam">Tamil</option>
                    <option value="ben">Bengali</option>
                    <option value="urd">Urdu</option>
                    <option value="mar">Marathi</option>
                    <option value="tel">Telugu</option>
                    <option value="kan">Kannada</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Progress Bar */}
          {loading && progress > 0 && (
            <div className={styles.progressContainer}>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className={styles.progressText}>{progress}%</span>
            </div>
          )}

          {/* Message */}
          {message && (
            <div className={`${styles.message} ${message.includes("✅") ? styles.success : message.includes("❌") ? styles.error : styles.info}`}>
              {message}
            </div>
          )}

          {/* Step 3: Export Options */}
          {extractedData && (
            <div className={styles.stepSection}>
              <p className={styles.stepLabel}>Step 3 · Export Document</p>
              <div className={styles.exportInfo}>
                <div className={styles.statBadge}>
                  <span className={styles.statLabel}>Pages</span>
                  <span className={styles.statValue}>{extractedData.pages}</span>
                </div>
                <div className={styles.statBadge}>
                  <span className={styles.statLabel}>Confidence</span>
                  <span className={styles.statValue}>{extractedData.confidence}%</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Bar */}
        <div className={styles.actionBar}>
          {extractedData && (
            <button onClick={resetForm} className={styles.secondaryBtn}>
              Start Over
            </button>
          )}

          {!extractedData && file ? (
            <button
              onClick={extractText}
              disabled={loading}
              className={styles.primaryBtn}
            >
              {loading ? `Extracting... ${progress}%` : "Extract Text"}
            </button>
          ) : null}

          {extractedData && (
            <>
              <button onClick={exportToWord} className={styles.primaryBtn}>
                📝 Export to Word
              </button>
              <button onClick={exportToCSV} className={styles.primaryBtn}>
                📊 Export to CSV
              </button>
            </>
          )}
        </div>
      </section>
    </main>
  );
}

