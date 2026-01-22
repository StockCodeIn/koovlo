"use client";

import { useState } from "react";
import styles from "./convert.module.css";
import ToolInfo from "@/components/ToolInfo";

export default function ImageConvert() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [format, setFormat] = useState("jpeg");
  const [quality, setQuality] = useState(90);
  const [loading, setLoading] = useState(false);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const img = e.target.files?.[0];
    if (!img) return;
    setFile(img);
    setPreview(URL.createObjectURL(img));
  };

  const convertImage = async () => {
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

    const mimeType = `image/${format}`;
    const converted = canvas.toDataURL(mimeType, quality / 100);
    const link = document.createElement("a");
    link.href = converted;
    link.download = `koovlo-converted.${format}`;
    link.click();
    setLoading(false);
  };

  return (
    <main className={styles.container}>
      <section className={styles.box}>
        <h1 className={styles.pageTitle}>
          <span className={styles.icon}>🔄</span>
          <span className={styles.textGradient}>Image Convert</span>
        </h1>
        <p>Convert images between different formats. 100% private.</p>

        <label className={styles.fileInput}>
          <input type="file" accept="image/*" onChange={handleFile} disabled={loading} />
          <span>Select Image</span>
        </label>

        {preview && (
          <>
            <div className={styles.controls}>
              <div className={styles.inputGroup}>
                <label>Output Format:</label>
                <select value={format} onChange={(e) => setFormat(e.target.value)}>
                  <option value="jpeg">JPEG</option>
                  <option value="png">PNG</option>
                  <option value="webp">WebP</option>
                </select>
              </div>
              {(format === "jpeg" || format === "webp") && (
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
              )}
            </div>
            <img src={preview} alt="preview" className={styles.preview} />
            <button onClick={convertImage} disabled={loading} className={styles.button}>
              {loading ? "Converting..." : "Convert & Download"}
            </button>
          </>
        )}
      </section>

      <ToolInfo
        howItWorks="1. Select an image file.<br>2. Choose output format and quality.<br>3. Click 'Convert & Download'."
        faqs={[
          { title: "What formats are supported?", content: "Convert to JPEG, PNG, or WebP." },
          { title: "Does PNG support quality?", content: "No, PNG is lossless. Quality slider only affects JPEG/WebP." }
        ]}
        tips={["WebP offers best compression. PNG for transparency, JPEG for photos."]}
      />
    </main>
  );
}