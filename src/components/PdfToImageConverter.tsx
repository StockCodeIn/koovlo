"use client";

import { useState, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist";
import JSZip from "jszip";
import styles from "@/app/tools/pdf/to-image/toimage.module.css";

// ✅ Worker setup using CDN (safe for local + production)
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default function PdfToImageConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "info">("info");
  const [quality, setQuality] = useState<"high" | "medium" | "low">("high");
  const [progress, setProgress] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.type !== "application/pdf") {
      setMessage("❌ Please upload a valid PDF file.");
      setMessageType("error");
      return;
    }
    setFile(f);
    setMessage(`✅ File selected: ${f.name}`);
    setMessageType("success");
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const f = files[0];
      if (f.type !== "application/pdf") {
        setMessage("❌ Please upload a valid PDF file.");
        setMessageType("error");
        return;
      }
      setFile(f);
      setMessage(`✅ File selected: ${f.name}`);
      setMessageType("success");
    }
  };

  const clearFile = () => {
    setFile(null);
    setMessage("");
    setMessageType("info");
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const convertPdfToImages = async () => {
    if (!file) return setMessage("Please upload a PDF first."), setMessageType("error");

    setLoading(true);
    setMessage("Preparing to convert...");
    setMessageType("info");
    setProgress(0);

    try {
      // ✅ Quality presets
      const settings = {
        high: { scale: 3, jpegQuality: 1.0 },
        medium: { scale: 2, jpegQuality: 0.9 },
        low: { scale: 1.3, jpegQuality: 0.8 },
      }[quality];

      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      const zip = new JSZip();

      for (let i = 1; i <= pdf.numPages; i++) {
        setMessage(`Rendering page ${i} of ${pdf.numPages}...`);
        setProgress((i - 1) / pdf.numPages * 100);

        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: settings.scale });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d", { alpha: false });
        if (!context) continue;

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: context, viewport, canvas }).promise;

        const blob = await new Promise<Blob | null>((resolve) =>
          canvas.toBlob(resolve, "image/jpeg", settings.jpegQuality)
        );
        if (blob) zip.file(`page-${i}.jpg`, blob);
      }

      setProgress(90);
      setMessage("Packaging images...");
      const zipBlob = await zip.generateAsync({ type: "blob" });
      setProgress(100);

      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${file.name.replace(".pdf", "")}-${quality}-images.zip`;
      a.click();
      URL.revokeObjectURL(url);

      setMessage("✅ Conversion complete! Download ready.");
      setMessageType("success");
    } catch (err) {
      console.error("PDF Conversion Error:", err);
      setMessage("❌ Error converting PDF. Please try again.");
      setMessageType("error");
    } finally {
      setLoading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  return (
    <div className={styles.converter}>
      <div className={styles.inputSection}>
        <div
          className={`${styles.dropZone} ${isDragOver ? styles.dragOver : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <label className={styles.fileLabel}>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              onChange={handleFile}
              className={styles.hiddenInput}
            />
            📄 {file ? file.name : "Choose PDF File"}
          </label>
          <p className={styles.dropText}>Or drag and drop a PDF file here</p>
        </div>

        {file && (
          <div className={styles.fileInfo}>
            <p><strong>File:</strong> {file.name}</p>
            <p><strong>Size:</strong> {formatFileSize(file.size)}</p>
            <p><strong>Type:</strong> PDF Document</p>
            <button onClick={clearFile} className={styles.clearBtn}>
              Clear File
            </button>
          </div>
        )}

        {loading && (
          <div className={styles.progressContainer}>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p>Processing PDF...</p>
          </div>
        )}
      </div>

      <div className={styles.optionsSection}>
        <div className={styles.qualitySelect}>
          <label>Output Quality:</label>
          <select
            value={quality}
            onChange={(e) => setQuality(e.target.value as any)}
            disabled={loading}
            className={styles.select}
          >
            <option value="high">High (Sharp, Large Size)</option>
            <option value="medium">Medium (Balanced)</option>
            <option value="low">Low (Fast, Small Size)</option>
          </select>
        </div>

        <button
          onClick={convertPdfToImages}
          disabled={loading || !file}
          className={styles.convertBtn}
        >
          {loading ? "🔄 Converting..." : "🚀 Convert to Images"}
        </button>
      </div>

      {message && (
        <p className={`${styles.message} ${styles[messageType]}`}>
          {message}
        </p>
      )}
    </div>
  );
}