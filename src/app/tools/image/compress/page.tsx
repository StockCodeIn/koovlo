"use client";

import { useState } from "react";
import styles from "./compress.module.css";
import ToolInfo from "@/components/ToolInfo";

export default function ImageCompress() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [quality, setQuality] = useState(70);
  const [loading, setLoading] = useState(false);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const img = e.target.files?.[0];
    if (!img) return;
    setFile(img);
    setPreview(URL.createObjectURL(img));
  };

  const compressImage = async () => {
    if (!preview) return;
    setLoading(true);

    const img = new Image();
    img.src = preview;
    await img.decode();

    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0);

    const compressed = canvas.toDataURL("image/jpeg", quality / 100);
    const link = document.createElement("a");
    link.href = compressed;
    link.download = "koovlo-compressed.jpg";
    link.click();
    setLoading(false);
  };

  return (
    <main className={styles.container}>
      <section className={styles.box}>
        <h1 className={styles.pageTitle}>
          <span className={styles.icon}>📉</span>
          <span className={styles.textGradient}>Image Compress</span>
        </h1>
        <p>Reduce image file size while maintaining quality. 100% private.</p>

        <label className={styles.fileInput}>
          <input type="file" accept="image/*" onChange={handleFile} disabled={loading} />
          <span>Select Image</span>
        </label>

        {preview && (
          <>
            <div className={styles.inputGroup}>
              <label>Quality ({quality}%):</label>
              <input
                type="range"
                min="10"
                max="100"
                value={quality}
                onChange={(e) => setQuality(+e.target.value)}
              />
            </div>
            <img src={preview} alt="preview" className={styles.preview} />
            <button onClick={compressImage} disabled={loading} className={styles.button}>
              {loading ? "Compressing..." : "Compress & Download"}
            </button>
          </>
        )}
      </section>

      <ToolInfo
        howItWorks="1. Select an image file.<br>2. Adjust quality slider.<br>3. Click 'Compress & Download'."
        faqs={[
          { title: "What formats are supported?", content: "JPEG, PNG, WebP, etc." },
          { title: "Is quality loss?", content: "Yes, adjustable via quality slider." }
        ]}
        tips={["Lower quality = smaller file. For web, 70-80% is good."]}
      />
    </main>
  );
}
