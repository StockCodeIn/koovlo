"use client";

import { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { PDFDocument } from "pdf-lib";
import styles from "@/app/tools/pdf/grayscale/grayscale.module.css";

// ✅ Set worker (client-safe)
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

export default function PdfGrayscaleClient() {
  const [file, setFile] = useState<File | null>(null);
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

  const convertToGrayscale = async () => {
    if (!file) return alert("Select a PDF first!");
    setLoading(true);
    setMessage("Converting pages to grayscale...");

    try {
      const bytes = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
      const newPdf = await PDFDocument.create();

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d")!;
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: ctx, viewport, canvas }).promise;

        // ✅ Convert to grayscale
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imgData.data;
        for (let j = 0; j < pixels.length; j += 4) {
          const avg = (pixels[j] + pixels[j + 1] + pixels[j + 2]) / 3;
          pixels[j] = pixels[j + 1] = pixels[j + 2] = avg;
        }
        ctx.putImageData(imgData, 0, 0);

        const grayImg = await canvas.toDataURL("image/jpeg", 0.9);
        const pageBytes = await fetch(grayImg).then((r) => r.arrayBuffer());
        const imageEmbed = await newPdf.embedJpg(pageBytes);
        const newPage = newPdf.addPage([canvas.width, canvas.height]);
        newPage.drawImage(imageEmbed, {
          x: 0,
          y: 0,
          width: canvas.width,
          height: canvas.height,
        });

        setMessage(`Processed page ${i} of ${pdf.numPages}...`);
      }

      const grayBytes = await newPdf.save();
      const blob = new Blob([grayBytes as unknown as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = file.name.replace(".pdf", "-grayscale.pdf");
      a.click();

      URL.revokeObjectURL(url);
      setMessage("✅ Grayscale PDF created successfully!");
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to convert. Try another file.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.box}>
      <h1 className={styles.pageTitle}>
        <span className={styles.icon}>🖤</span>
        <span className={styles.textGradient}>Grayscale PDF (Ink Saver)</span>
      </h1>
      <p>Convert colorful PDFs into clean black-and-white versions for ink-saving prints.</p>

      <label className={styles.fileInput}>
        <input type="file" accept="application/pdf" onChange={handleFile} />
        <span>{file ? file.name : "Choose PDF File"}</span>
      </label>

      <button onClick={convertToGrayscale} disabled={loading || !file} className={styles.button}>
        {loading ? "Converting..." : "Convert to Grayscale"}
      </button>

      {message && <p className={styles.message}>{message}</p>}
    </section>
  );
}
