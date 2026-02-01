"use client";

import { useState, useCallback } from "react";
import { PDFDocument, degrees } from "pdf-lib";
import styles from "./rotate.module.css";

export default function PdfRotatePage() {
  const [file, setFile] = useState<File | null>(null);
  const [angle, setAngle] = useState(90);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [progress, setProgress] = useState(0);
  const [totalPages, setTotalPages] = useState<number | null>(null);

  const handleFile = useCallback(async (selectedFile: File) => {
    if (selectedFile.type !== "application/pdf") {
      setError("Please select a valid PDF file.");
      return;
    }

    setFile(selectedFile);
    setError("");
    setSuccess("");
    setMessage("Analyzing PDF...");

    try {
      const bytes = await selectedFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(bytes);
      setTotalPages(pdfDoc.getPageCount());
      setMessage(`✅ PDF loaded successfully! (${pdfDoc.getPageCount()} pages)`);
    } catch (err) {
      setError("❌ Failed to load PDF. Please try another file.");
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) handleFile(selectedFile);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFile(droppedFile);
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOver(false);
  }, []);

  const rotatePdf = async () => {
    if (!file) {
      setError("Please select a PDF file first.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");
    setProgress(10);
    setMessage("Rotating PDF pages...");

    try {
      const bytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(bytes);

      setProgress(30);
      const pages = pdfDoc.getPages();

      setProgress(60);
      pages.forEach((page, index) => {
        const current = page.getRotation().angle;
        page.setRotation(degrees(current + angle));
        // Update progress for each page
        setProgress(60 + Math.round(((index + 1) / pages.length) * 30));
      });

      setProgress(95);
      const rotatedBytes = await pdfDoc.save();
      const blob = new Blob([rotatedBytes as unknown as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${file.name.replace('.pdf', '')}-rotated-${angle}deg.pdf`;
      a.click();
      URL.revokeObjectURL(url);

      setProgress(100);
      setSuccess(`✅ PDF rotated successfully! All ${pages.length} pages rotated by ${angle}°`);
    } catch (err) {
      console.error("Rotate PDF Error:", err);
      setError("❌ Error rotating PDF. Please try again.");
    } finally {
      setLoading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  const clearFile = () => {
    setFile(null);
    setTotalPages(null);
    setMessage("");
    setError("");
    setSuccess("");
  };

  const getRotationDescription = () => {
    switch (angle) {
      case 90: return "90° Clockwise (→ ↓)";
      case 180: return "180° Upside Down (↕)";
      case 270: return "270° Counterclockwise (← ↑)";
      default: return `${angle}°`;
    }
  };

  return (
    <main className={styles.container}>
      <section className={styles.box}>
        <h1 className={styles.pageTitle}>
          <span className={styles.icon}>🔄</span>
          <span className={styles.textGradient}>Rotate PDF</span>
        </h1>
        <p className={styles.description}>Rotate all pages in your PDF by 90°, 180°, or 270° instantly.</p>

        <div
          className={`${styles.dropZone} ${dragOver ? styles.dragOver : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div className={styles.fileInput}>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileSelect}
              disabled={loading}
              id="pdf-upload"
            />
            <label htmlFor="pdf-upload" className={styles.uploadLabel}>
              {file ? file.name : '📂 Choose PDF File'}
            </label>
          </div>
          <p className={styles.dropText}>or drag and drop your PDF here</p>
        </div>

        {file && (
          <div className={styles.fileInfo}>
            <p><strong>File:</strong> {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</p>
            {totalPages && <p><strong>Pages:</strong> {totalPages}</p>}
            <button onClick={clearFile} className={styles.clearBtn}>Change File</button>
          </div>
        )}

        {file && (
          <div className={styles.angleSelect}>
            <label>Rotation Angle:</label>
            <select
              value={angle}
              onChange={(e) => setAngle(Number(e.target.value))}
              disabled={loading}
            >
              <option value={90}>90° Clockwise (→ ↓)</option>
              <option value={180}>180° Upside Down (↕)</option>
              <option value={270}>270° Counterclockwise (← ↑)</option>
            </select>
            <div className={styles.rotationPreview}>
              <p><strong>Preview:</strong> {getRotationDescription()}</p>
            </div>
          </div>
        )}

        {loading && (
          <div className={styles.progressContainer}>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: `${progress}%` }}></div>
            </div>
            <p>{progress}% complete</p>
          </div>
        )}

        <button
          onClick={rotatePdf}
          disabled={loading || !file}
          className={styles.button}
        >
          {loading ? 'Rotating...' : `Rotate PDF (${angle}°)`}
        </button>

        {message && <div className={styles.message}>{message}</div>}
        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}

        <div className={styles.instructions}>
          <h3>How it works:</h3>
          <ul>
            <li>Upload your PDF file</li>
            <li>Select rotation angle (90°, 180°, or 270°)</li>
            <li>All pages will be rotated by the same amount</li>
            <li>Download your rotated PDF instantly</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
