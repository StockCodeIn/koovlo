"use client";

import { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import Tesseract from "tesseract.js";
import { Document, Packer, Paragraph, TextRun } from "docx";
import styles from "@/app/tools/pdf/to-word/toword.module.css";

// ✅ Configure PDF.js Worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

export default function PdfToWordOCR() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState("eng");
  const [message, setMessage] = useState("");

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.type !== "application/pdf") {
      alert("Please upload a valid PDF file.");
      return;
    }
    setFile(f);
    setMessage("");
  };

  const convertToWord = async () => {
    if (!file) return alert("Select a PDF first.");
    setLoading(true);
    setMessage("Processing pages...");

    try {
      const bytes = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
      let allText = "";

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d")!;
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: ctx, viewport, canvas }).promise;
        const imageData = canvas.toDataURL("image/png");

        setMessage(`🔍 Reading page ${i} / ${pdf.numPages} ...`);

        // ✅ OCR Text Extraction
        const result = await Tesseract.recognize(imageData, lang, {
          logger: (info) => console.log(info),
        });

        allText += result.data.text + "\n\n";
      }

      if (!allText.trim()) {
        setMessage("⚠️ No readable text found.");
        setLoading(false);
        return;
      }

      // ✅ Build Word document
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [
              new Paragraph({
                children: [new TextRun(allText)],
              }),
            ],
          },
        ],
      });

      const blob = await Packer.toBlob(doc);
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = file.name.replace(".pdf", "-ocr.docx");
      a.click();

      setMessage("✅ Conversion complete!");
    } catch (err) {
      console.error(err);
      setMessage("❌ OCR failed. Try another PDF.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.container}>
      <section className={styles.box}>
        <h1 className={styles.pageTitle}>
          <span className={styles.icon}>🧠</span>
          <span className={styles.textGradient}>PDF to Word (OCR Pro)</span>
        </h1>
        <p className={styles.subtitle}>
          Convert scanned PDFs or multilingual text (Hindi, English & more) into editable Word documents.
        </p>

        <label className={styles.fileInput}>
          <input type="file" accept="application/pdf" onChange={handleFile} disabled={loading} />
          <span>{file ? file.name : "Click to Choose PDF File"}</span>
        </label>

        <div className={styles.langBox}>
          <label htmlFor="lang">Select Language:</label>
          <select id="lang" value={lang} onChange={(e) => setLang(e.target.value)} disabled={loading}>
            <option value="eng">English</option>
            <option value="hin">Hindi</option>
            <option value="tam">Tamil</option>
            <option value="ben">Bengali</option>
            <option value="urd">Urdu</option>
          </select>
        </div>

        <button
          onClick={convertToWord}
          disabled={loading || !file}
          className={styles.button}
        >
          {loading ? "Extracting..." : "Convert to Word"}
        </button>

        {message && <p className={styles.message}>{message}</p>}
      </section>
    </main>
  );
}
