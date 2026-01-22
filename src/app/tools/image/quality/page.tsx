"use client";

import { useState } from "react";
import styles from "./quality.module.css";
import ToolInfo from "@/components/ToolInfo";

export default function ImageQuality() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [quality, setQuality] = useState(90);
  const [loading, setLoading] = useState(false);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const img = e.target.files?.[0];
    if (!img) return;
    setFile(img);
    setPreview(URL.createObjectURL(img));
  };

  const adjustQuality = async () => {
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

    const adjusted = canvas.toDataURL("image/jpeg", quality / 100);
    const link = document.createElement("a");
    link.href = adjusted;
    link.download = "koovlo-quality-adjusted.jpg";
    link.click();
    setLoading(false);
  };

  return (
    <main className={styles.container}>
      <section className={styles.box}>
        <h1 className={styles.pageTitle}>
          <span className={styles.icon}>⚙️</span>
          <span className={styles.textGradient}>Image Quality</span>
        </h1>
        <p>Adjust image quality percentage. 100% private.</p>

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
            <button onClick={adjustQuality} disabled={loading} className={styles.button}>
              {loading ? "Adjusting..." : "Adjust & Download"}
            </button>
          </>
        )}
      </section>

      <ToolInfo
        howItWorks="1. Select an image file.<br>2. Adjust quality slider.<br>3. Click 'Adjust & Download'."
        faqs={[
          { title: "What does quality affect?", content: "File size and image clarity. Lower quality = smaller file." },
          { title: "Is it lossless?", content: "No, adjusting quality recompresses the image." }
        ]}
        tips={["For web use, 70-90% quality is usually sufficient."]}
      />
    </main>
  );
}