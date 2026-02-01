"use client";

import { useState, useRef } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import styles from "./pagenumber.module.css";

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default function PdfPageNumberTool() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "info">("info");
  const [position, setPosition] = useState("bottom-right");
  const [fontSize, setFontSize] = useState(12);
  const [color, setColor] = useState("#000000");
  const [startPage, setStartPage] = useState(1);
  const [progress, setProgress] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      const selectedFile = files[0];
      if (selectedFile.type !== 'application/pdf') {
        setMessage('❌ Please upload a valid PDF file');
        setMessageType('error');
        return;
      }
      setFile(selectedFile);
      setMessage(`✅ File selected: ${selectedFile.name}`);
      setMessageType('success');
    }
  };

  const clearFile = () => {
    setFile(null);
    setMessage("");
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.type !== "application/pdf") {
      setMessage('❌ Please select a valid PDF file');
      setMessageType('error');
      return;
    }
    setFile(f);
    setMessage(`✅ File selected: ${f.name}`);
    setMessageType('success');
  };

  const addPageNumbers = async () => {
    if (!file) {
      setMessage('Please upload a PDF first.');
      setMessageType('error');
      return;
    }

    setLoading(true);
    setMessage('Preparing to add page numbers...');
    setMessageType('info');
    setProgress(0);

    try {
      const bytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(bytes);
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

      const pages = pdfDoc.getPages();
      setProgress(25);
      setMessage(`Processing ${pages.length} page${pages.length > 1 ? 's' : ''}...`);

      pages.forEach((page, i) => {
        const { width, height } = page.getSize();
        const pageNumber = i + startPage;

        let x = 50;
        let y = 50;

        // ✅ Position mapping
        switch (position) {
          case "top-left":
            x = 50;
            y = height - 40;
            break;
          case "top-right":
            x = width - 80;
            y = height - 40;
            break;
          case "bottom-left":
            x = 50;
            y = 40;
            break;
          case "bottom-right":
            x = width - 80;
            y = 40;
            break;
          case "center-bottom":
            x = width / 2 - 15;
            y = 40;
            break;
        }

        page.drawText(`${pageNumber}`, {
          x,
          y,
          size: fontSize,
          font,
          color: rgb(
            parseInt(color.slice(1, 3), 16) / 255,
            parseInt(color.slice(3, 5), 16) / 255,
            parseInt(color.slice(5, 7), 16) / 255
          ),
        });

        setProgress(25 + (i / pages.length) * 50);
      });

      setProgress(80);
      setMessage('Finalizing PDF...');

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${file.name.replace('.pdf', '')}-numbered.pdf`;
      a.click();
      URL.revokeObjectURL(url);

      setProgress(100);
      setMessage('✅ Page numbers added successfully!');
      setMessageType('success');

    } catch (err) {
      console.error('Page numbering error:', err);
      setMessage('❌ Failed to process PDF. Please try again.');
      setMessageType('error');
    } finally {
      setLoading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  return (
    <main className={styles.container}>
      <section className={styles.box}>
        <h1 className={styles.pageTitle}>
          <span className={styles.icon}>🔢</span>
          <span className={styles.textGradient}>PDF Page Numbering</span>
        </h1>
        <p className={styles.description}>
          Add customizable page numbers to your PDF easily and offline.
        </p>

        <div
          className={`${styles.dropZone} ${isDragOver ? styles.dragOver : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <label className={styles.fileInput}>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              onChange={handleFile}
              disabled={loading}
            />
            <span>📄 {file ? file.name : "Choose PDF File"}</span>
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

        <div className={styles.settings}>
          <div className={styles.settingGroup}>
            <label>Position:</label>
            <select
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              disabled={loading}
              className={styles.selectInput}
            >
              <option value="bottom-right">Bottom Right</option>
              <option value="bottom-left">Bottom Left</option>
              <option value="center-bottom">Center Bottom</option>
              <option value="top-left">Top Left</option>
              <option value="top-right">Top Right</option>
            </select>
          </div>

          <div className={styles.settingGroup}>
            <label>Font Size:</label>
            <input
              type="number"
              value={fontSize}
              min={8}
              max={36}
              onChange={(e) => setFontSize(Number(e.target.value))}
              disabled={loading}
              className={styles.numberInput}
            />
          </div>

          <div className={styles.settingGroup}>
            <label>Color:</label>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              disabled={loading}
              className={styles.colorInput}
            />
          </div>

          <div className={styles.settingGroup}>
            <label>Start From:</label>
            <input
              type="number"
              value={startPage}
              min={1}
              onChange={(e) => setStartPage(Number(e.target.value))}
              disabled={loading}
              className={styles.numberInput}
            />
          </div>
        </div>

        <button
          onClick={addPageNumbers}
          disabled={loading || !file}
          className={styles.button}
        >
          {loading ? "🔄 Processing..." : "🚀 Add Page Numbers"}
        </button>

        {message && (
          <p className={`${styles.message} ${styles[messageType]}`}>
            {message}
          </p>
        )}
      </section>
    </main>
  );
}
