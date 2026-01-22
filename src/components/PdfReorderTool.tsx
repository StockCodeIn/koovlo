"use client";

import { useState } from "react";
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
  const [message, setMessage] = useState("");

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.type !== "application/pdf") {
      alert("Please upload a valid PDF file.");
      return;
    }

    setFile(f);
    setLoading(true);
    setMessage("Generating page previews...");

    try {
      const bytes = await f.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
      const previewList: PagePreview[] = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 0.5 });
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d")!;
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: ctx, viewport, canvas }).promise;
        const img = canvas.toDataURL("image/png");
        previewList.push({ index: i - 1, image: img });
      }

      setPages(previewList);
      setMessage("✅ PDF loaded successfully!");
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to load PDF. Try another file.");
    } finally {
      setLoading(false);
    }
  };

  const deletePage = (index: number) => {
    setPages((prev) => prev.filter((_, i) => i !== index));
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
    setLoading(true);
    setMessage("Rebuilding PDF...");

    const bytes = await file.arrayBuffer();
    const originalPdf = await PDFDocument.load(bytes);
    const newPdf = await PDFDocument.create();

    const indices = pages.map((p) => p.index);
    const copied = await newPdf.copyPages(originalPdf, indices);
    copied.forEach((p) => newPdf.addPage(p));

    const newBytes = await newPdf.save();
    const blob = new Blob([newBytes as unknown as BlobPart], { type: "application/pdf" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = file.name.replace(".pdf", "-reordered.pdf");
    a.click();
    URL.revokeObjectURL(a.href);

    setMessage("✅ PDF exported successfully!");
    setLoading(false);
  };

  return (
    <section className={styles.box}>
      <h1 className={styles.pageTitle}>
        <span className={styles.icon}>🧩</span>
        <span className={styles.textGradient}>PDF Page Reorder / Delete</span>
      </h1>
      <p>Reorder or delete pages visually — fast, free, and 100% offline.</p>

      <input
        type="file"
        accept="application/pdf"
        onChange={handleFile}
        disabled={loading}
        className={styles.fileInput}
      />

      {pages.length > 0 && (
        <>
          <div className={styles.previewGrid}>
            {pages.map((p, i) => (
              <div key={i} className={styles.pageCard}>
                <img src={p.image} alt={`Page ${i + 1}`} />
                <div className={styles.pageActions}>
                  <button onClick={() => movePage(i, "left")} disabled={i === 0}>
                    ⬅
                  </button>
                  <span>{i + 1}</span>
                  <button onClick={() => movePage(i, "right")} disabled={i === pages.length - 1}>
                    ➡
                  </button>
                </div>
                <button className={styles.deleteBtn} onClick={() => deletePage(i)}>
                  ❌ Delete
                </button>
              </div>
            ))}
          </div>
          <button onClick={exportPdf} disabled={loading} className={styles.button}>
            {loading ? "Processing..." : "Export PDF"}
          </button>
        </>
      )}

      {message && <p className={styles.message}>{message}</p>}
    </section>
  );
}
