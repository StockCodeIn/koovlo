"use client";

import { useState } from "react";
import styles from "./flip.module.css";
import ToolInfo from "@/components/ToolInfo";

export default function ImageFlip() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [flipHorizontal, setFlipHorizontal] = useState(false);
  const [flipVertical, setFlipVertical] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const img = e.target.files?.[0];
    if (!img) return;
    setFile(img);
    setPreview(URL.createObjectURL(img));
  };

  const flipImage = async () => {
    if (!preview) return;
    setLoading(true);

    const img = new Image();
    img.src = preview;
    await img.decode();

    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    const ctx = canvas.getContext("2d")!;

    ctx.translate(
      flipHorizontal ? canvas.width : 0,
      flipVertical ? canvas.height : 0
    );
    ctx.scale(
      flipHorizontal ? -1 : 1,
      flipVertical ? -1 : 1
    );

    ctx.drawImage(img, 0, 0);

    const flipped = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = flipped;
    link.download = "koovlo-flipped.png";
    link.click();
    setLoading(false);
  };

  return (
    <main className={styles.container}>
      <section className={styles.box}>
        <h1 className={styles.pageTitle}>
          <span className={styles.icon}>🔄</span>
          <span className={styles.textGradient}>Image Flip</span>
        </h1>
        <p>Flip images horizontally or vertically. 100% private.</p>

        <label className={styles.fileInput}>
          <input type="file" accept="image/*" onChange={handleFile} disabled={loading} />
          <span>Select Image</span>
        </label>

        {preview && (
          <>
            <div className={styles.controls}>
              <label>
                <input
                  type="checkbox"
                  checked={flipHorizontal}
                  onChange={(e) => setFlipHorizontal(e.target.checked)}
                />
                Flip Horizontal
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={flipVertical}
                  onChange={(e) => setFlipVertical(e.target.checked)}
                />
                Flip Vertical
              </label>
            </div>
            <img src={preview} alt="preview" className={styles.preview} />
            <button onClick={flipImage} disabled={loading || (!flipHorizontal && !flipVertical)} className={styles.button}>
              {loading ? "Flipping..." : "Flip & Download"}
            </button>
          </>
        )}
      </section>

      <ToolInfo
        howItWorks="1. Select an image file.<br>2. Choose flip direction(s).<br>3. Click 'Flip & Download'."
        faqs={[
          { title: "Can I flip both ways?", content: "Yes, check both horizontal and vertical for 180° rotation effect." },
          { title: "Does it change file size?", content: "No, flipping preserves original dimensions." }
        ]}
        tips={["Horizontal flip mirrors left-right, vertical flip mirrors top-bottom."]}
      />
    </main>
  );
}