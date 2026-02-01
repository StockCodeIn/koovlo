"use client";

import { useState, useCallback } from "react";
import { PDFDocument } from "pdf-lib";
import * as pdfjsLib from "pdfjs-dist";
import styles from "@/app/tools/pdf/reorder/reorder.module.css";

// Setup worker for PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

type PagePreview = { index: number; image: string };

export default function PdfReorderTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PagePreview[]>([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
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
    setLoading(true);
    setMessage("Generating page previews...");
    setProgress(10);

    try {
      const bytes = await selectedFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
      setTotalPages(pdf.numPages);
      const previewList: PagePreview[] = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 0.3 });
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d")!;
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: ctx, viewport, canvas }).promise;
        const img = canvas.toDataURL("image/png");
        previewList.push({ index: i - 1, image: img });
        setProgress(10 + Math.round((i / pdf.numPages) * 70));
      }

      setPages(previewList);
      setProgress(100);
      setMessage("✅ PDF loaded successfully!");
    } catch (err) {
      console.error(err);
      setError("❌ Failed to load PDF. Try another file.");
    } finally {
      setLoading(false);
      setTimeout(() => setProgress(0), 1000);
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

  const deletePage = (index: number) => {
    setPages((prev) => prev.filter((_, i) => i !== index));
    setSuccess(`Page ${index + 1} deleted successfully`);
    setTimeout(() => setSuccess(""), 3000);
  };

  const movePage = (index: number, direction: "left" | "right") => {
    setPages((prev) => {
      const newPages = [...prev];
      const newIndex = direction === "left" ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= newPages.length) return newPages;
      [newPages[index], newPages[newIndex]] = [newPages[newIndex], newPages[index]];
      return newPages;
    });
  };

  const exportPdf = async () => {
    if (!file || pages.length === 0) return;
    setProcessing(true);
    setError("");
    setSuccess("");
    setProgress(10);
    setMessage("Rebuilding PDF...");

    try {
      const bytes = await file.arrayBuffer();
      const originalPdf = await PDFDocument.load(bytes);
      const newPdf = await PDFDocument.create();

      setProgress(30);
      const indices = pages.map((p) => p.index);
      const copied = await newPdf.copyPages(originalPdf, indices);
      copied.forEach((p) => newPdf.addPage(p));

      setProgress(70);
      const newBytes = await newPdf.save();
      const blob = new Blob([newBytes as unknown as BlobPart], { type: "application/pdf" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = file.name.replace(".pdf", "-reordered.pdf");
      a.click();
      URL.revokeObjectURL(a.href);

      setProgress(100);
      setSuccess(`✅ PDF exported successfully! (${pages.length} pages)`);
    } catch (err) {
      setError("❌ Failed to export PDF. Please try again.");
    } finally {
      setProcessing(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  const clearFile = () => {
    setFile(null);
    setPages([]);
    setTotalPages(null);
    setMessage("");
    setError("");
    setSuccess("");
  };

  return (
    <section className={styles.box}>
      <h1 className={styles.pageTitle}>
        <span className={styles.icon}>↕️</span>
        <span className={styles.textGradient}>PDF Page Reorder / Delete</span>
      </h1>
      <p className={styles.description}>Reorder or delete pages visually — fast, free, and 100% offline.</p>

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
            disabled={loading || processing}
            className={styles.hiddenInput}
            id="pdf-file"
          />
          <label htmlFor="pdf-file" className={styles.fileLabel}>
            {file ? file.name : '📂 Choose PDF File'}
          </label>
        </div>
        <p className={styles.dropText}>or drag and drop your PDF here</p>
        {file && (
          <div className={styles.fileInfo}>
            <p><strong>File:</strong> {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</p>
            {totalPages && <p><strong>Total Pages:</strong> {totalPages}</p>}
            <button onClick={clearFile} className={styles.clearBtn}>Change File</button>
          </div>
        )}
      </div>

      {loading && (
        <div className={styles.progressContainer}>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }}></div>
          </div>
          <p>{progress}% complete</p>
        </div>
      )}

      {pages.length > 0 && (
        <>
          <div className={styles.stats}>
            <p><strong>Pages to export:</strong> {pages.length}</p>
            <p><strong>Original pages:</strong> {totalPages}</p>
          </div>

          <div className={styles.previewGrid}>
            {pages.map((p, i) => (
              <div key={i} className={styles.pageCard}>
                <div className={styles.pageNumber}>{i + 1}</div>
                <img src={p.image} alt={`Page ${i + 1}`} />
                <div className={styles.pageActions}>
                  <button
                    onClick={() => movePage(i, "left")}
                    disabled={i === 0}
                    className={styles.moveBtn}
                    title="Move left"
                  >
                    ⬅
                  </button>
                  <span className={styles.pageIndex}>{i + 1}</span>
                  <button
                    onClick={() => movePage(i, "right")}
                    disabled={i === pages.length - 1}
                    className={styles.moveBtn}
                    title="Move right"
                  >
                    ➡
                  </button>
                </div>
                <button
                  className={styles.deleteBtn}
                  onClick={() => deletePage(i)}
                  title="Delete page"
                >
                  🗑️ Delete
                </button>
              </div>
            ))}
          </div>

          {processing && (
            <div className={styles.progressContainer}>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${progress}%` }}></div>
              </div>
              <p>{progress}% complete</p>
            </div>
          )}

          <button
            onClick={exportPdf}
            disabled={processing || loading}
            className={styles.button}
          >
            {processing ? 'Processing...' : `Export PDF (${pages.length} pages)`}
          </button>
        </>
      )}

      {message && <div className={styles.message}>{message}</div>}
      {error && <div className={styles.error}>{error}</div>}
      {success && <div className={styles.success}>{success}</div>}

      <div className={styles.instructions}>
        <h3>How to use:</h3>
        <ul>
          <li>Upload a PDF file</li>
          <li>Use arrow buttons to reorder pages</li>
          <li>Click delete to remove unwanted pages</li>
          <li>Export your reordered PDF</li>
        </ul>
      </div>
    </section>
  );
}
