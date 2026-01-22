"use client";

import { useState } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import styles from "./pagenumber.module.css";

export default function PdfPageNumberTool() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [position, setPosition] = useState("bottom-right");
  const [fontSize, setFontSize] = useState(12);
  const [color, setColor] = useState("#000000");
  const [startPage, setStartPage] = useState(1);

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

  const addPageNumbers = async () => {
    if (!file) return alert("Please upload a PDF first.");
    setLoading(true);
    setMessage("Adding page numbers...");

    try {
      const bytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(bytes);
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

      const pages = pdfDoc.getPages();
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
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "koovlo-pagenumbered.pdf";
      a.click();
      URL.revokeObjectURL(url);

      setMessage("✅ Page numbers added successfully!");
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to process PDF. Try another file.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.container}>
      <section className={styles.box}>
        <h1 className={styles.pageTitle}>
          <span className={styles.icon}>🔢</span>
          <span className={styles.textGradient}>PDF Page Numbering</span>
        </h1>
        <p>Add customizable page numbers to your PDF easily and offline.</p>

        <label className={styles.fileInput}>
          <input type="file" accept="application/pdf" onChange={handleFile} />
          <span>{file ? file.name : "Choose PDF File"}</span>
        </label>

        <div className={styles.settings}>
          <div>
            <label>Position:</label>
            <select value={position} onChange={(e) => setPosition(e.target.value)}>
              <option value="bottom-right">Bottom Right</option>
              <option value="bottom-left">Bottom Left</option>
              <option value="center-bottom">Center Bottom</option>
              <option value="top-left">Top Left</option>
              <option value="top-right">Top Right</option>
            </select>
          </div>

          <div>
            <label>Font Size:</label>
            <input
              type="number"
              value={fontSize}
              min={8}
              max={36}
              onChange={(e) => setFontSize(Number(e.target.value))}
            />
          </div>

          <div>
            <label>Color:</label>
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
          </div>

          <div>
            <label>Start From:</label>
            <input
              type="number"
              value={startPage}
              min={1}
              onChange={(e) => setStartPage(Number(e.target.value))}
            />
          </div>
        </div>

        <button onClick={addPageNumbers} disabled={loading || !file} className={styles.button}>
          {loading ? "Processing..." : "Add Page Numbers"}
        </button>

        {message && <p className={styles.message}>{message}</p>}
      </section>
    </main>
  );
}
