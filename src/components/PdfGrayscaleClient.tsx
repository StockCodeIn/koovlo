"use client";

import { useState, useEffect, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { PDFDocument } from "pdf-lib";
import styles from "@/app/tools/pdf/grayscale/grayscale.module.css";

// ✅ Set worker (client-safe)
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

export default function PdfGrayscaleClient() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [preview, setPreview] = useState<string>("");
  const [isMobile, setIsMobile] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.type !== "application/pdf") {
      setMessage("❌ Please upload a valid PDF file.");
      return;
    }
    setFile(f);
    setMessage("");
    setPreview("");
    setProgress(0);
    generatePreview(f);
  };

  const generatePreview = async (pdfFile: File) => {
    try {
      const bytes = await pdfFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 1.5 });
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({ canvasContext: ctx, viewport, canvas }).promise;
      setPreview(canvas.toDataURL("image/png"));
    } catch (err) {
      console.error("Preview error:", err);
    }
  };

  const convertToGrayscale = async () => {
    if (!file) return;
    setLoading(true);
    setMessage("Converting pages to grayscale...");
    setProgress(0);

    try {
      const bytes = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
      const newPdf = await PDFDocument.create();
      const totalPages = pdf.numPages;

      for (let i = 1; i <= totalPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d")!;
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: ctx, viewport, canvas }).promise;

        // ✅ Convert to grayscale
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imgData.data;
        for (let j = 0; j < pixels.length; j += 4) {
          const avg = (pixels[j] + pixels[j + 1] + pixels[j + 2]) / 3;
          pixels[j] = pixels[j + 1] = pixels[j + 2] = avg;
        }
        ctx.putImageData(imgData, 0, 0);

        const grayImg = await canvas.toDataURL("image/jpeg", 0.9);
        const pageBytes = await fetch(grayImg).then((r) => r.arrayBuffer());
        const imageEmbed = await newPdf.embedJpg(pageBytes);
        const newPage = newPdf.addPage([canvas.width, canvas.height]);
        newPage.drawImage(imageEmbed, {
          x: 0,
          y: 0,
          width: canvas.width,
          height: canvas.height,
        });

        const currentProgress = Math.round((i / totalPages) * 100);
        setProgress(currentProgress);
        setMessage(`Processing page ${i} of ${totalPages}... (${currentProgress}%)`);
      }

      const grayBytes = await newPdf.save();
      const blob = new Blob([grayBytes as unknown as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = file.name.replace(".pdf", "-grayscale.pdf");
      a.click();

      URL.revokeObjectURL(url);
      setMessage("✅ Grayscale PDF created successfully! Download started.");
      setProgress(100);
      setTimeout(() => {
        setFile(null);
        setPreview("");
        setMessage("");
        setProgress(0);
      }, 2000);
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to convert. Try another file.");
      setProgress(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.container}>
      <div className={styles.box}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.pageTitle}>
            <span className={styles.icon}>🖤</span>
            <span className={styles.textGradient}>Grayscale PDF Converter</span>
          </h1>
          <p className={styles.description}>
            Convert colorful PDFs into clean black-and-white versions for ink-saving prints.
          </p>
          <div className={styles.modeNote}>
            <span className={styles.modePill}>{isMobile ? "📱 Mobile" : "🖥️ Desktop"}</span>
            <span className={styles.modeText}>
              {isMobile
                ? "Upload PDF and preview first page to get started"
                : "Preview first page, then convert entire PDF to grayscale"}
            </span>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className={styles.contentGrid}>
          {/* Upload Section */}
          <div className={styles.uploadSection}>
            <p className={styles.stepLabel}>Step 1 · Choose PDF</p>
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
                  {file ? file.name : "Choose a PDF file"}
                </span>
                {file && (
                  <span className={styles.fileSize}>
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                )}
              </div>
            </label>
          </div>

          {/* Preview Section */}
          {preview && (
            <div className={styles.previewSection}>
              <p className={styles.stepLabel}>Preview · First Page</p>
              <div className={styles.previewBox}>
                <img src={preview} alt="PDF Preview" className={styles.previewImage} />
              </div>
            </div>
          )}
        </div>

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
          <div className={`${styles.message} ${message.includes("✅") ? styles.success : message.includes("❌") ? styles.error : ""}`}>
            {message}
          </div>
        )}

        {/* Action Bar */}
        <div className={styles.actionBar}>
          {file && !loading && (
            <button
              onClick={() => {
                setFile(null);
                setPreview("");
                setMessage("");
                setProgress(0);
              }}
              className={styles.secondaryBtn}
            >
              Clear
            </button>
          )}
          <button
            onClick={convertToGrayscale}
            disabled={loading || !file}
            className={styles.primaryBtn}
          >
            {loading ? `Converting... ${progress}%` : "Convert to Grayscale"}
          </button>
        </div>
      </div>
    </section>
  );
}
