"use client";

import { useState } from "react";
import { PDFDocument, rgb, degrees } from "pdf-lib";
import styles from "@/app/tools/pdf/watermark/watermark.module.css";

export default function PdfWatermarkPro() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("Koovlo Confidential");
  const [image, setImage] = useState<File | null>(null);
  const [position, setPosition] = useState("center");
  const [opacity, setOpacity] = useState(0.3);
  const [size, setSize] = useState(40);
  const [rotation, setRotation] = useState(-30);
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

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const img = e.target.files?.[0];
    if (img) setImage(img);
  };

  const addWatermark = async () => {
    if (!file) return alert("Please upload a PDF first.");
    setLoading(true);
    setMessage("Adding watermark...");

    try {
      const bytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(bytes);
      const pages = pdfDoc.getPages();
      const font = await pdfDoc.embedFont("Helvetica");

      let imageEmbed;
      if (image) {
        const imgBytes = await image.arrayBuffer();
        if (image.type.includes("png")) {
          imageEmbed = await pdfDoc.embedPng(imgBytes);
        } else {
          imageEmbed = await pdfDoc.embedJpg(imgBytes);
        }
      }

      for (const page of pages) {
        const { width, height } = page.getSize();

        let x = width / 2;
        let y = height / 2;

        switch (position) {
          case "top-left": x = 50; y = height - 80; break;
          case "top-right": x = width - 200; y = height - 80; break;
          case "bottom-left": x = 50; y = 80; break;
          case "bottom-right": x = width - 200; y = 80; break;
        }

        if (imageEmbed) {
          page.drawImage(imageEmbed, {
            x,
            y,
            width: size * 8,
            height: size * 3,
            opacity,
            rotate: degrees(rotation),
          });
        } else {
          page.drawText(text, {
            x,
            y,
            size,
            font,
            color: rgb(0.6, 0.6, 0.6),
            opacity,
            rotate: degrees(rotation),
          });
        }
      }

      const newBytes = await pdfDoc.save();
      const blob = new Blob([newBytes as unknown as BlobPart ], { type: "application/pdf" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = file.name.replace(".pdf", "-watermarked.pdf");
      a.click();
      URL.revokeObjectURL(a.href);

      setMessage("✅ Watermark added successfully!");
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to add watermark. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.box}>
      <h1 className={styles.pageTitle}>
        <span className={styles.icon}>💧</span>
        <span className={styles.textGradient}>PDF Watermark (Pro)</span>
      </h1>
      <p>Add text or image watermark — customize position, size, and opacity.</p>

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
          {file ? file.name : "Choose PDF File"}
        </label>
      </div>

      <div className={styles.controls}>
        <label>Watermark Type:</label>
        <div className={styles.switchRow}>
          <button
            className={!image ? styles.active : ""}
            onClick={() => setImage(null)}
          >
            Text
          </button>
          <label className={styles.uploadBtn}>
            Image
            <input type="file" accept="image/*" onChange={handleImage} hidden />
          </label>
        </div>

        {!image && (
          <>
            <label>Text</label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter watermark text"
            />
          </>
        )}

        <label>Position</label>
        <select
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          className={styles.select}
        >
          <option value="center">Center</option>
          <option value="top-left">Top Left</option>
          <option value="top-right">Top Right</option>
          <option value="bottom-left">Bottom Left</option>
          <option value="bottom-right">Bottom Right</option>
        </select>

        <label>Opacity: {opacity}</label>
        <input
          type="range"
          min="0.1"
          max="1"
          step="0.1"
          value={opacity}
          onChange={(e) => setOpacity(parseFloat(e.target.value))}
        />

        <label>Size: {size}px</label>
        <input
          type="range"
          min="16"
          max="100"
          step="2"
          value={size}
          onChange={(e) => setSize(parseInt(e.target.value))}
        />

        <label>Rotation: {rotation}°</label>
        <input
          type="range"
          min="-90"
          max="90"
          step="5"
          value={rotation}
          onChange={(e) => setRotation(parseInt(e.target.value))}
        />
      </div>

      <button
        onClick={addWatermark}
        disabled={loading || !file}
        className={styles.button}
      >
        {loading ? "Applying..." : "Add Watermark"}
      </button>

      {message && <p className={styles.message}>{message}</p>}
    </section>
  );
}
