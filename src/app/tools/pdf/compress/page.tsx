// src/app/tools/pdf/compress/page.tsx
"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import styles from "./compress.module.css";

export default function PdfCompress() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.type !== "application/pdf") {
      alert("Please upload a valid PDF file.");
      return;
    }
    setFile(f);
    setFileName(f.name);
  };

  const compressPdf = async () => {
    if (!file) return;
    setLoading(true);

    try {
      const bytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(bytes);

      // Optimization flags
      const compressedPdf = await pdfDoc.save({
        useObjectStreams: true,
        addDefaultPage: false,
        objectsPerTick: 50,
      });
      const blob = new Blob([compressedPdf as unknown as BlobPart], { type: "application/pdf", });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `koovlo-compressed.pdf`;
      a.click();
    } catch (err) {
      console.error("Compression failed:", err);
      alert("Sorry, something went wrong while compressing.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.container}>
      <section className={styles.box}>
        <h1 className={styles.pageTitle}>
          <span className={styles.icon}>🗜️</span>
          <span className={styles.textGradient}>Compress PDF</span>
        </h1>
        <p>
          Reduce PDF size instantly. Works fully offline — files never leave your
          device.
        </p>

        <label className={styles.fileInput}>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFile}
            disabled={loading}
          />
          <span>{fileName || "Choose PDF File"}</span>
        </label>

        {file && !loading && (
          <button onClick={compressPdf} className={styles.button}>
            Compress & Download
          </button>
        )}

        {loading && <div className={styles.loader}>Compressing...</div>}
      </section>
    </main>
  );
}
