"use client";

import { useState } from "react";
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

  const unlockPdf = async () => {
    if (!file) return alert("Please upload a PDF first.");
    setLoading(true);
    setMessage("🔍 Attempting to unlock PDF...");

    try {
      const bytes = await file.arrayBuffer();

      const loadingTask = pdfjsLib.getDocument({
        data: bytes,
        password: password || undefined,
      });

      // Password handler for smooth UX
      loadingTask.onPassword = (updatePassword: any, reason: any) => {
        if (reason === pdfjsLib.PasswordResponses.NEED_PASSWORD) {
          setMessage("🔐 This PDF is password protected.");
          updatePassword(password);
        } else if (reason === pdfjsLib.PasswordResponses.INCORRECT_PASSWORD) {
          setMessage("🔒 Incorrect password. Please try again.");
          setLoading(false); // ✅ Unfreeze so user can retry
        }
      };

      const pdf = await loadingTask.promise;
      const pageCount = pdf.numPages;
      setMessage(`✅ PDF unlocked successfully (${pageCount} pages detected).`);

      // 🧠 Create a new clean PDF using pdf-lib
      const newPdf = await PDFDocument.create();

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.5 });

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

        const pageRef = newPdf.addPage([
          imgEmbed.width,
          imgEmbed.height,
        ]);
        pageRef.drawImage(imgEmbed, {
          x: 0,
          y: 0,
          width: imgEmbed.width,
          height: imgEmbed.height,
        });
      }

      // Save clean unlocked PDF
      const unlockedBytes = await newPdf.save();
      const blob = new Blob([unlockedBytes as unknown as BlobPart], { type: "application/pdf" });

      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = file.name.replace(".pdf", "-unlocked.pdf");
      a.click();
      URL.revokeObjectURL(a.href);

      setMessage("✅ Unlocked PDF downloaded successfully!");
    } catch (err: any) {
      console.error("Unlock error:", err);

      if (err?.name === "PasswordException" || err?.message?.includes("Incorrect Password")) {
        setMessage("🔒 Incorrect password. Please try again.");
      } else if (err?.message?.includes("encrypted")) {
        setMessage("❌ This PDF is encrypted beyond browser decryption.");
      } else {
        setMessage("⚠️ Unable to unlock this PDF.");
      }
    } finally {
      setLoading(false); // ✅ Always reset so UI doesn’t freeze
    }
  };

  return (
    <section className={styles.box}>
      <h1 className={styles.pageTitle}>
        <span className={styles.icon}>🔓</span>
        <span className={styles.textGradient}>PDF Unlock</span>
      </h1>
      <p>Decrypt PDFs using password and rebuild a clean copy — fully offline.</p>

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

      <div className={styles.passwordBox}>
        <label htmlFor="password">Enter Password:</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          placeholder="Enter PDF password"
        />
      </div>

      <button
        onClick={unlockPdf}
        disabled={loading || !file}
        className={styles.button}
      >
        {loading ? "Unlocking..." : "Unlock PDF"}
      </button>

      {message && <p className={styles.message}>{message}</p>}

      <div className={styles.notice}>
        ⚠️ <strong>Note:</strong> Works for password-protected PDFs.
        DRM or permission-locked files can be viewed but not modified.
      </div>
    </section>
  );
}
