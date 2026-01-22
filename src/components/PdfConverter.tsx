"use client";

import { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import JSZip from "jszip";
import styles from "@/app/tools/pdf/to-image/toimage.module.css";

// ✅ Worker setup using CDN (safe for local + production)
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

export default function PdfConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [quality, setQuality] = useState<"high" | "medium" | "low">("high");

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

  const convertPdfToImages = async () => {
    if (!file) return setMessage("Please upload a PDF first.");
    setLoading(true);
    setMessage("Preparing to convert...");

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

      setMessage("Packaging images...");
      const zipBlob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${file.name.replace(".pdf", "")}-${quality}-images.zip`;
      a.click();
      URL.revokeObjectURL(url);

      setMessage("✅ Conversion complete! Download ready.");
    } catch (err) {
      console.error("PDF Conversion Error:", err);
      setMessage("❌ Error converting PDF. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.box}>
      <h1 className={styles.pageTitle}>
        <span className={styles.icon}>📸</span>
        <span className={styles.textGradient}>PDF to Image</span>
      </h1>
      <p>
        Convert your PDF into high-quality images — choose the right balance between clarity and file size.
      </p>

      {/* File Upload */}
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
          {file ? <strong>{file.name}</strong> : "Click to Choose PDF File"}
        </label>
      </div>

      {/* Quality Selector */}
      <div className={styles.qualitySelect}>
        <label>Output Quality:</label>
        <select
          value={quality}
          onChange={(e) => setQuality(e.target.value as any)}
          disabled={loading}
        >
          <option value="high">High (Sharp, Large Size)</option>
          <option value="medium">Medium (Balanced)</option>
          <option value="low">Low (Fast, Small Size)</option>
        </select>
      </div>

      {/* Convert Button */}
      <button
        onClick={convertPdfToImages}
        disabled={loading || !file}
        className={styles.button}
      >
        {loading ? "Converting..." : "Convert to Images"}
      </button>

      {message && <p className={styles.message}>{message}</p>}
    </section>
  );
}
