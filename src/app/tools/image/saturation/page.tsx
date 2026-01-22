"use client";

import { useState } from "react";
import styles from "./saturation.module.css";
import ToolInfo from "@/components/ToolInfo";

export default function ImageSaturation() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [saturation, setSaturation] = useState(100);
  const [loading, setLoading] = useState(false);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const img = e.target.files?.[0];
    if (!img) return;
    setFile(img);
    setPreview(URL.createObjectURL(img));
  };

  const adjustSaturation = async () => {
    if (!preview) return;
    setLoading(true);

    const img = new Image();
    img.src = preview;
    await img.decode();

    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    const ctx = canvas.getContext("2d")!;
    ctx.filter = `saturate(${saturation}%)`;
    ctx.drawImage(img, 0, 0);

    const adjusted = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = adjusted;
    link.download = "koovlo-saturation-adjusted.png";
    link.click();
    setLoading(false);
  };

  return (
    <main className={styles.container}>
      <section className={styles.box}>
        <h1 className={styles.pageTitle}>
          <span className={styles.icon}>🌈</span>
          <span className={styles.textGradient}>Image Saturation</span>
        </h1>
        <p>Adjust color saturation of images. 100% private.</p>

        <label className={styles.fileInput}>
          <input type="file" accept="image/*" onChange={handleFile} disabled={loading} />
          <span>Select Image</span>
        </label>

        {preview && (
          <>
            <div className={styles.inputGroup}>
              <label>Saturation ({saturation}%):</label>
              <input
                type="range"
                min="0"
                max="200"
                value={saturation}
                onChange={(e) => setSaturation(+e.target.value)}
              />
            </div>
            <img src={preview} alt="preview" className={styles.preview} />
            <button onClick={adjustSaturation} disabled={loading} className={styles.button}>
              {loading ? "Adjusting..." : "Adjust & Download"}
            </button>
          </>
        )}
      </section>

      <ToolInfo
        howItWorks="1. Select an image file.<br>2. Adjust saturation slider.<br>3. Click 'Adjust & Download'."
        faqs={[
          { title: "What does saturation do?", content: "Controls color intensity. 0% = grayscale, 200% = vivid colors." },
          { title: "Can I oversaturate?", content: "Yes, values above 100% increase color intensity." }
        ]}
        tips={["Reduce saturation for muted looks, increase for vibrant, eye-catching images."]}
      />
    </main>
  );
}