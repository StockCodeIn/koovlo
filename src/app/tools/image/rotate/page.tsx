"use client";

import { useState } from "react";
import styles from "./rotate.module.css";
import ToolInfo from "@/components/ToolInfo";

export default function ImageRotate() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [customAngle, setCustomAngle] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const img = e.target.files?.[0];
    if (!img) return;
    setFile(img);
    setPreview(URL.createObjectURL(img));
  };

  const rotateImage = async () => {
    if (!preview) return;
    setLoading(true);

    const img = new Image();
    img.src = preview;
    await img.decode();

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;

    const angle = rotation === 4 ? customAngle : rotation * 90;
    const rad = (angle * Math.PI) / 180;

    if (angle % 180 === 0) {
      canvas.width = img.width;
      canvas.height = img.height;
    } else {
      canvas.width = img.height;
      canvas.height = img.width;
    }

    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(rad);
    ctx.drawImage(img, -img.width / 2, -img.height / 2);

    const rotated = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = rotated;
    link.download = "koovlo-rotated.png";
    link.click();
    setLoading(false);
  };

  return (
    <main className={styles.container}>
      <section className={styles.box}>
        <h1 className={styles.pageTitle}>
          <span className={styles.icon}>🔄</span>
          <span className={styles.textGradient}>Image Rotate</span>
        </h1>
        <p>Rotate images by preset angles or custom degrees. 100% private.</p>

        <label className={styles.fileInput}>
          <input type="file" accept="image/*" onChange={handleFile} disabled={loading} />
          <span>Select Image</span>
        </label>

        {preview && (
          <>
            <div className={styles.controls}>
              <div className={styles.rotationOptions}>
                <label>
                  <input
                    type="radio"
                    name="rotation"
                    value="0"
                    checked={rotation === 0}
                    onChange={(e) => setRotation(+e.target.value)}
                  />
                  0°
                </label>
                <label>
                  <input
                    type="radio"
                    name="rotation"
                    value="1"
                    checked={rotation === 1}
                    onChange={(e) => setRotation(+e.target.value)}
                  />
                  90°
                </label>
                <label>
                  <input
                    type="radio"
                    name="rotation"
                    value="2"
                    checked={rotation === 2}
                    onChange={(e) => setRotation(+e.target.value)}
                  />
                  180°
                </label>
                <label>
                  <input
                    type="radio"
                    name="rotation"
                    value="3"
                    checked={rotation === 3}
                    onChange={(e) => setRotation(+e.target.value)}
                  />
                  270°
                </label>
                <label>
                  <input
                    type="radio"
                    name="rotation"
                    value="4"
                    checked={rotation === 4}
                    onChange={(e) => setRotation(+e.target.value)}
                  />
                  Custom
                </label>
              </div>
              {rotation === 4 && (
                <div className={styles.inputGroup}>
                  <label>Custom Angle (degrees):</label>
                  <input
                    type="number"
                    value={customAngle}
                    onChange={(e) => setCustomAngle(+e.target.value)}
                    min="-360"
                    max="360"
                  />
                </div>
              )}
            </div>
            <img src={preview} alt="preview" className={styles.preview} />
            <button onClick={rotateImage} disabled={loading} className={styles.button}>
              {loading ? "Rotating..." : "Rotate & Download"}
            </button>
          </>
        )}
      </section>

      <ToolInfo
        howItWorks="1. Select an image file.<br>2. Choose rotation angle (90°, 180°, 270°, or custom).<br>3. Click 'Rotate & Download'."
        faqs={[
          { title: "What formats are supported?", content: "All common image formats (JPEG, PNG, WebP, etc.)." },
          { title: "Does it change file size?", content: "No, rotation preserves original dimensions." }
        ]}
        tips={["For custom angles, use positive values for clockwise, negative for counter-clockwise."]}
      />
    </main>
  );
}