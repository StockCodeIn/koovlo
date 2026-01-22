"use client";

import { useState } from "react";
import styles from "./resize.module.css";
import ToolInfo from "@/components/ToolInfo";

export default function ImageResize() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [width, setWidth] = useState(300);
  const [height, setHeight] = useState(300);
  const [loading, setLoading] = useState(false);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const img = e.target.files?.[0];
    if (!img) return;
    setFile(img);
    setPreview(URL.createObjectURL(img));
  };

  const resizeImage = async () => {
    if (!preview) return;
    setLoading(true);

    const img = new Image();
    img.src = preview;
    await img.decode();

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0, width, height);

    const resized = canvas.toDataURL("image/jpeg", 0.9);
    const link = document.createElement("a");
    link.href = resized;
    link.download = "koovlo-resized.jpg";
    link.click();
    setLoading(false);
  };

  return (
    <main className={styles.container}>
      <section className={styles.box}>
        <h1 className={styles.pageTitle}>
          <span className={styles.icon}>📏</span>
          <span className={styles.textGradient}>Image Resize</span>
        </h1>
        <p>Resize images to custom dimensions. 100% private — no uploads.</p>

        <label className={styles.fileInput}>
          <input type="file" accept="image/*" onChange={handleFile} disabled={loading} />
          <span>Select Image</span>
        </label>

        {preview && (
          <>
            <div className={styles.inputGroup}>
              <label>Width (px):</label>
              <input
                type="number"
                value={width}
                onChange={(e) => setWidth(+e.target.value)}
                min="1"
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Height (px):</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(+e.target.value)}
                min="1"
              />
            </div>
            <img src={preview} alt="preview" className={styles.preview} />
            <button onClick={resizeImage} disabled={loading} className={styles.button}>
              {loading ? "Resizing..." : "Resize & Download"}
            </button>
          </>
        )}
      </section>

      <ToolInfo
        howItWorks="1. Select an image file.<br>2. Enter desired width and height.<br>3. Click 'Resize & Download'."
        faqs={[
          { title: "Supported formats?", content: "JPG, PNG, WebP, etc." },
          { title: "Quality?", content: "Output is JPEG at 90% quality." }
        ]}
        tips={["For best results, maintain aspect ratio. Large images may take time."]}
      />
    </main>
  );
}
