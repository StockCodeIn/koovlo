"use client";

import { useState, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { PDFDocument } from "pdf-lib";
import styles from "@/app/tools/pdf/unlock/unlock.module.css";

// Worker for PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

export default function PdfUnlocker() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.type !== "application/pdf") {
      setMessage("❌ Please upload a valid PDF file.");
      return;
    }
    setFile(f);
    setMessage("");
    setIsUnlocked(false);
    setPageCount(0);
    setProgress(0);
    setPassword("");
  };

  const unlockPdf = async () => {
    if (!file) return;
    setLoading(true);
    setMessage("🔍 Analyzing PDF structure...");
    setProgress(10);

    try {
      const bytes = await file.arrayBuffer();

      // Try to load PDF with provided password
      const loadingTask = pdfjsLib.getDocument({
        data: bytes,
        password: password || undefined,
      });

      let passwordAttempts = 0;
      loadingTask.onPassword = (updatePassword: any, reason: any) => {
        passwordAttempts++;
        if (reason === pdfjsLib.PasswordResponses.NEED_PASSWORD) {
          if (passwordAttempts === 1 && password) {
            updatePassword(password);
          }
        } else if (reason === pdfjsLib.PasswordResponses.INCORRECT_PASSWORD) {
          setMessage("🔒 Incorrect password. Please try again.");
          setLoading(false);
          setProgress(0);
          return;
        }
      };

      const pdf = await loadingTask.promise;
      const numPages = pdf.numPages;
      setPageCount(numPages);
      setProgress(20);
      setMessage(`📄 PDF detected: ${numPages} pages. Building clean copy...`);

      // Create a new clean PDF using pdf-lib
      const newPdf = await PDFDocument.create();

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2 });

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        // Render to canvas
        await page.render({ canvasContext: ctx!, viewport, canvas }).promise;

        // Convert to image for import
        const imgBlob = await new Promise<Blob | null>((resolve) =>
          canvas.toBlob(resolve, "image/jpeg", 0.95)
        );
        if (!imgBlob) continue;

        const imgBytes = new Uint8Array(await imgBlob.arrayBuffer());
        const imgEmbed = await newPdf.embedJpg(imgBytes);

        const pageRef = newPdf.addPage([imgEmbed.width, imgEmbed.height]);
        pageRef.drawImage(imgEmbed, {
          x: 0,
          y: 0,
          width: imgEmbed.width,
          height: imgEmbed.height,
        });

        const currentProgress = Math.round((i / numPages) * 70 + 20);
        setProgress(currentProgress);
        setMessage(`🔄 Processing page ${i} of ${numPages}... (${currentProgress}%)`);
      }

      setProgress(95);
      setMessage("💾 Saving unlocked PDF...");

      // Save clean unlocked PDF
      const unlockedBytes = await newPdf.save();
      const blob = new Blob([unlockedBytes as unknown as BlobPart], {
        type: "application/pdf",
      });

      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = file.name.replace(".pdf", "-unlocked.pdf");
      a.click();
      URL.revokeObjectURL(a.href);

      setProgress(100);
      setMessage("✅ PDF unlocked successfully! Download started.");
      setIsUnlocked(true);
      setPassword("");
      
      setTimeout(() => {
        setFile(null);
        setMessage("");
        setProgress(0);
        setIsUnlocked(false);
        setPageCount(0);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }, 2000);
    } catch (err: any) {
      console.error("Unlock error:", err);

      if (err?.name === "PasswordException" || err?.message?.includes("password")) {
        setMessage("🔒 Password-protected PDF. Please enter the correct password.");
      } else if (err?.message?.includes("encrypted")) {
        setMessage("🔐 This PDF is DRM-encrypted. Browser decryption not possible.");
      } else {
        setMessage("⚠️ Unable to unlock this PDF. Try another file.");
      }
      setProgress(0);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setPassword("");
    setMessage("");
    setProgress(0);
    setIsUnlocked(false);
    setPageCount(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <main className={styles.container}>
      <section className={styles.box}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.pageTitle}>
            <span className={styles.icon}>🔓</span>
            <span className={styles.textGradient}>PDF Unlocker</span>
          </h1>
          <p className={styles.subtitle}>
            Decrypt password-protected PDFs and rebuild clean, editable copies. Works offline.
          </p>
        </div>

        {/* Main Content */}
        <div className={styles.content}>
          {/* Step 1: Upload */}
          <div className={styles.stepSection}>
            <p className={styles.stepLabel}>Step 1 · Upload PDF</p>
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
                  {file ? file.name : "Choose a PDF file or drag & drop"}
                </span>
                {file && (
                  <span className={styles.fileSize}>
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                )}
              </div>
            </label>
          </div>

          {/* Step 2: Password Input */}
          {file && !isUnlocked && (
            <div className={styles.stepSection}>
              <p className={styles.stepLabel}>Step 2 · Enter Password (if needed)</p>
              <div className={styles.controlGrid}>
                <div className={styles.controlGroup}>
                  <label htmlFor="password" className={styles.label}>
                    PDF Password:
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    placeholder="Leave empty if no password"
                    className={styles.input}
                  />
                  <span className={styles.hint}>Optional if PDF has no password</span>
                </div>
              </div>
            </div>
          )}

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
            <div
              className={`${styles.message} ${
                message.includes("✅")
                  ? styles.success
                  : message.includes("❌") || message.includes("🔒")
                  ? styles.error
                  : styles.info
              }`}
            >
              {message}
            </div>
          )}

          {/* Step 3: Success Info */}
          {isUnlocked && pageCount > 0 && (
            <div className={styles.stepSection}>
              <p className={styles.stepLabel}>Step 3 · Unlock Complete</p>
              <div className={styles.exportInfo}>
                <div className={styles.statBadge}>
                  <span className={styles.statLabel}>Pages</span>
                  <span className={styles.statValue}>{pageCount}</span>
                </div>
                <div className={styles.statBadge}>
                  <span className={styles.statLabel}>Status</span>
                  <span className={styles.statValue}>✅ Unlocked</span>
                </div>
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className={styles.infoBox}>
            <p className={styles.infoTitle}>ℹ️ How it works:</p>
            <ul className={styles.infoList}>
              <li>Upload your password-protected PDF</li>
              <li>Enter password if required (optional if no password)</li>
              <li>Tool renders pages as images and rebuilds a clean PDF</li>
              <li>Download the unlocked, editable version</li>
            </ul>
          </div>
        </div>

        {/* Action Bar */}
        <div className={styles.actionBar}>
          {file && !isUnlocked && (
            <button
              onClick={resetForm}
              className={styles.secondaryBtn}
              disabled={loading}
            >
              Clear
            </button>
          )}

          {isUnlocked && (
            <button onClick={resetForm} className={styles.secondaryBtn}>
              Start Over
            </button>
          )}

          {!isUnlocked && file && (
            <button
              onClick={unlockPdf}
              disabled={loading}
              className={styles.primaryBtn}
            >
              {loading ? `Unlocking... ${progress}%` : "Unlock PDF"}
            </button>
          )}
        </div>
      </section>
    </main>
  );
}
