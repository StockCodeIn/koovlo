"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import styles from "./to-pdf.module.css";

export default function ImageToPdfPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setFiles(Array.from(e.target.files));
    setMessage("");
  };

  const createPdf = async () => {
    if (files.length === 0) return alert("Please select at least one image.");
    setLoading(true);
    setMessage("Converting images to PDF...");

    try {
      const pdfDoc = await PDFDocument.create();

      for (const file of files) {
        const imageBytes = await file.arrayBuffer();
        let img;

        // Auto-detect image format
        if (file.type === "image/jpeg") {
          img = await pdfDoc.embedJpg(imageBytes);
        } else if (file.type === "image/png") {
          img = await pdfDoc.embedPng(imageBytes);
        } else {
          continue; // skip unsupported formats
        }

        const page = pdfDoc.addPage([img.width, img.height]);
        page.drawImage(img, {
          x: 0,
          y: 0,
          width: img.width,
          height: img.height,
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "koovlo-images.pdf";
      a.click();
      URL.revokeObjectURL(url);

      setMessage("✅ PDF created successfully!");
    } catch (err) {
      console.error(err);
      setMessage("❌ Error creating PDF. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.container}>
      <section className={styles.box}>
        <h1 className={styles.pageTitle}>
          <span className={styles.icon}>🖼️</span>
          <span className={styles.textGradient}>Image to PDF</span>
        </h1>
        <p>
          Combine multiple images into a single PDF — fast, offline, and secure.
        </p>

        <div className={styles.fileInput}>
          <input
            type="file"
            accept="image/png, image/jpeg"
            multiple
            onChange={handleFiles}
            disabled={loading}
            id="image-upload"
            style={{ display: "none" }}
          />
          <label htmlFor="image-upload" className={styles.uploadLabel}>
            {files.length > 0
              ? `${files.length} image${files.length > 1 ? "s" : ""} selected`
              : "Click to Select Images"}
          </label>
        </div>

        {files.length > 0 && (
          <ul className={styles.fileList}>
            {files.map((f, i) => (
              <li key={i}>{f.name}</li>
            ))}
          </ul>
        )}

        <button
          onClick={createPdf}
          disabled={loading || files.length === 0}
          className={styles.button}
        >
          {loading ? "Converting..." : "Create PDF"}
        </button>

        {message && <p className={styles.message}>{message}</p>}
      </section>
    </main>
  );
}
