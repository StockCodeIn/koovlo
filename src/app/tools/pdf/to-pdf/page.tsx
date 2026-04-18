"use client";

import { useState, useRef } from "react";
import { PDFDocument, rgb } from "pdf-lib";
import styles from "./to-pdf.module.css";

type PageSize = "A4" | "Letter" | "auto";
type PageOrientation = "portrait" | "landscape" | "auto";

const PAGE_SIZES: Record<string, [number, number]> = {
  A4: [595.28, 841.89],
  Letter: [612, 792],
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default function ImageToPdfPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "info">("info");
  const [progress, setProgress] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const [pageSize, setPageSize] = useState<PageSize>("A4");
  const [pageOrientation, setPageOrientation] = useState<PageOrientation>("auto");
  const [margin, setMargin] = useState(20);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const validFiles: File[] = [];
    const invalidFiles: string[] = [];

    Array.from(selectedFiles).forEach(file => {
      if (file.type === "image/jpeg" || file.type === "image/png") {
        validFiles.push(file);
      } else {
        invalidFiles.push(file.name);
      }
    });

    if (invalidFiles.length > 0) {
      setMessage(`❌ Skipped unsupported files: ${invalidFiles.join(", ")}`);
      setMessageType("error");
    } else {
      setMessage("");
    }

    setFiles(prev => [...prev, ...validFiles]);

    if (validFiles.length > 0 && invalidFiles.length === 0) {
      setMessage(`✅ Added ${validFiles.length} image${validFiles.length > 1 ? "s" : ""}`);
      setMessageType("success");
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
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
    handleFiles(e.dataTransfer.files);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setMessage("");
  };

  const clearAllFiles = () => {
    setFiles([]);
    setMessage("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const createPdf = async () => {
    if (files.length === 0) {
      setMessage("Please select at least one image.");
      setMessageType("error");
      return;
    }

    setLoading(true);
    setMessage("Preparing to create PDF...");
    setMessageType("info");
    setProgress(0);

    try {
      const pdfDoc = await PDFDocument.create();

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setMessage(`Processing ${file.name}...`);
        setProgress(((i + 1) / files.length) * 90);

        const imageBytes = await file.arrayBuffer();
        let img;

        // Auto-detect image format
        if (file.type === "image/jpeg") {
          img = await pdfDoc.embedJpg(imageBytes);
        } else if (file.type === "image/png") {
          img = await pdfDoc.embedPng(imageBytes);
        } else {
          continue;
        }

        const imgWidth = img.width;
        const imgHeight = img.height;
        const imgAspectRatio = imgWidth / imgHeight;

        // Determine page size and orientation
        let [baseWidth, baseHeight] = PAGE_SIZES[pageSize === "auto" ? "A4" : pageSize];
        let orientation = pageOrientation;

        if (orientation === "auto") {
          orientation = imgAspectRatio > 1 ? "landscape" : "portrait";
        }

        if (orientation === "landscape") {
          [baseWidth, baseHeight] = [baseHeight, baseWidth];
        }

        const availableWidth = baseWidth - margin * 2;
        const availableHeight = baseHeight - margin * 2;

        let drawWidth = availableWidth;
        let drawHeight = (availableWidth / imgWidth) * imgHeight;

        // If height exceeds available height, scale to fit height instead
        if (drawHeight > availableHeight) {
          drawHeight = availableHeight;
          drawWidth = (availableHeight / imgHeight) * imgWidth;
        }

        // Center image on page
        const x = margin + (availableWidth - drawWidth) / 2;
        const y = baseHeight - margin - drawHeight - (availableHeight - drawHeight) / 2;

        // Create page with white background
        const page = pdfDoc.addPage([baseWidth, baseHeight]);
        page.drawRectangle({
          x: 0,
          y: 0,
          width: baseWidth,
          height: baseHeight,
          color: rgb(1, 1, 1),
        });

        page.drawImage(img, {
          x,
          y,
          width: drawWidth,
          height: drawHeight,
        });
      }

      setProgress(95);
      setMessage("Finalizing PDF...");

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `koovlo-images-${Date.now()}.pdf`;
      a.click();
      URL.revokeObjectURL(url);

      setProgress(100);
      setMessage("✅ PDF created successfully!");
      setMessageType("success");
    } catch (err) {
      console.error(err);
      setMessage("❌ Error creating PDF. Please try again.");
      setMessageType("error");
    } finally {
      setLoading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  return (
    <main className={styles.container}>
      <div className={styles.converter}>
        <h1 className={styles.pageTitle}>
          <span className={styles.icon}>🖼️</span>
          <span className={styles.textGradient}>Image to PDF Converter</span>
        </h1>
        <p className={styles.description}>
          Combine multiple images into a single PDF — fast, offline, and secure.
        </p>

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
                accept="image/png,image/jpeg,image/jpg"
                multiple
                onChange={handleFileInput}
                className={styles.hiddenInput}
                disabled={loading}
              />
              📸 {files.length > 0 ? `Add More Images` : "Choose Images"}
            </label>
            <p className={styles.dropText}>Or drag and drop images here</p>
            <p className={styles.supportedFormats}>Supports: PNG, JPG, JPEG</p>
          </div>

          {files.length > 0 && (
            <div className={styles.fileList}>
              <div className={styles.fileListHeader}>
                <h3>Selected Images ({files.length})</h3>
                <button onClick={clearAllFiles} className={styles.clearAllBtn}>
                  Clear All
                </button>
              </div>
              <div className={styles.fileItems}>
                {files.map((file, index) => (
                  <div key={index} className={styles.fileItem}>
                    <div className={styles.fileInfo}>
                      <span className={styles.fileName}>{file.name}</span>
                      <span className={styles.fileSize}>{formatFileSize(file.size)}</span>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className={styles.removeBtn}
                      disabled={loading}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
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
              <p>Creating PDF...</p>
            </div>
          )}
        </div>

        <div className={styles.settingsSection}>
          <div className={styles.settingGroup}>
            <label htmlFor="page-size">Page Size:</label>
            <select
              id="page-size"
              value={pageSize}
              onChange={(e) => setPageSize(e.target.value as PageSize)}
              disabled={loading}
              className={styles.select}
            >
              <option value="A4">A4 (210×297 mm)</option>
              <option value="Letter">Letter (8.5×11 in)</option>
              <option value="auto">Auto-fit to image</option>
            </select>
          </div>

          <div className={styles.settingGroup}>
            <label htmlFor="orientation">Orientation:</label>
            <select
              id="orientation"
              value={pageOrientation}
              onChange={(e) => setPageOrientation(e.target.value as PageOrientation)}
              disabled={loading}
              className={styles.select}
            >
              <option value="auto">Auto-detect</option>
              <option value="portrait">Portrait</option>
              <option value="landscape">Landscape</option>
            </select>
          </div>

          <div className={styles.settingGroup}>
            <label htmlFor="margin">Margin: {margin}px</label>
            <input
              id="margin"
              type="range"
              min="0"
              max="50"
              value={margin}
              onChange={(e) => setMargin(parseInt(e.target.value))}
              disabled={loading}
              className={styles.slider}
            />
          </div>
        </div>

        <div className={styles.actionSection}>
          <button
            onClick={createPdf}
            disabled={loading || files.length === 0}
            className={styles.convertBtn}
          >
            {loading ? "🔄 Creating PDF..." : "🚀 Create PDF"}
          </button>
        </div>

        {message && (
          <p className={`${styles.message} ${styles[messageType]}`}>
            {message}
          </p>
        )}
      </div>
    </main>
  );
}
