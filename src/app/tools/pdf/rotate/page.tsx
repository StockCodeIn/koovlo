"use client";

import { useState } from "react";
import { PDFDocument, degrees } from "pdf-lib";
import styles from "./rotate.module.css";

export default function PdfRotatePage() {
  const [file, setFile] = useState<File | null>(null);
  const [angle, setAngle] = useState(90);
  const [loading, setLoading] = useState(false);
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

  const rotatePdf = async () => {
    if (!file) return alert("Please upload a PDF first.");
    setLoading(true);
    setMessage("Rotating PDF pages...");

    try {
      const bytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(bytes);

      const pages = pdfDoc.getPages();
      pages.forEach((page) => {
        const current = page.getRotation().angle;
        page.setRotation(degrees(current + angle));
      });

      const rotatedBytes = await pdfDoc.save();
      const blob = new Blob([rotatedBytes as unknown as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "koovlo-rotated.pdf";
      a.click();
      URL.revokeObjectURL(url);

      setMessage("✅ PDF rotated successfully!");
    } catch (err) {
      console.error("Rotate PDF Error:", err);
      setMessage("❌ Error rotating PDF. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.container}>
      <section className={styles.box}>
        <h1 className={styles.pageTitle}>
          <span className={styles.icon}>🔄</span>
          <span className={styles.textGradient}>Rotate PDF</span>
        </h1>
        <p>Rotate all pages in your PDF by 90°, 180°, or 270° instantly.</p>

        <div className={styles.fileInput}>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFile}
            disabled={loading}
            style={{ display: "none" }}
            id="pdf-upload"
          />
          <label htmlFor="pdf-upload" className={styles.uploadLabel}>
            {file ? file.name : "Click to Choose PDF File"}
          </label>
        </div>

        <div className={styles.angleSelect}>
          <label>Rotation Angle:</label>
          <select
            value={angle}
            onChange={(e) => setAngle(Number(e.target.value))}
            disabled={loading}
          >
            <option value={90}>90° Clockwise</option>
            <option value={180}>180°</option>
            <option value={270}>270° Counterclockwise</option>
          </select>
        </div>

        <button
          onClick={rotatePdf}
          disabled={loading || !file}
          className={styles.button}
        >
          {loading ? "Rotating..." : "Rotate PDF"}
        </button>

        {message && <p className={styles.message}>{message}</p>}
      </section>
    </main>
  );
}
