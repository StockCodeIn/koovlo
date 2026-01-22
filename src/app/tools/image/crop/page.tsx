"use client";

import { useState, useRef } from "react";
import styles from "./crop.module.css";
import ToolInfo from "@/components/ToolInfo";

export default function ImageCrop() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [cropArea, setCropArea] = useState({ x: 0, y: 0, width: 200, height: 200 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [loading, setLoading] = useState(false);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const img = e.target.files?.[0];
    if (!img) return;
    setFile(img);
    setPreview(URL.createObjectURL(img));
  };

  const cropImage = () => {
    if (!imgRef.current || !canvasRef.current) return;
    setLoading(true);

    const img = imgRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d")!;

    canvas.width = cropArea.width;
    canvas.height = cropArea.height;

    ctx.drawImage(
      img,
      cropArea.x,
      cropArea.y,
      cropArea.width,
      cropArea.height,
      0,
      0,
      cropArea.width,
      cropArea.height
    );

    const cropped = canvas.toDataURL("image/jpeg", 0.9);
    const link = document.createElement("a");
    link.href = cropped;
    link.download = "koovlo-cropped.jpg";
    link.click();
    setLoading(false);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLImageElement>) => {
    const rect = imgRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCropArea({ ...cropArea, x, y });
  };

  return (
    <main className={styles.container}>
      <section className={styles.box}>
        <h1 className={styles.pageTitle}>
          <span className={styles.icon}>✂️</span>
          <span className={styles.textGradient}>Image Crop</span>
        </h1>
        <p>Crop images to desired size. Click and drag to select area.</p>

        <label className={styles.fileInput}>
          <input type="file" accept="image/*" onChange={handleFile} disabled={loading} />
          <span>Select Image</span>
        </label>

        {preview && (
          <>
            <div className={styles.cropContainer}>
              <img
                ref={imgRef}
                src={preview}
                alt="preview"
                className={styles.preview}
                onMouseDown={handleMouseDown}
                style={{ cursor: "crosshair" }}
              />
              <div
                className={styles.cropBox}
                style={{
                  left: cropArea.x,
                  top: cropArea.y,
                  width: cropArea.width,
                  height: cropArea.height,
                }}
              />
            </div>
            <div className={styles.controls}>
              <label>Width: <input type="number" value={cropArea.width} onChange={(e) => setCropArea({ ...cropArea, width: +e.target.value })} /></label>
              <label>Height: <input type="number" value={cropArea.height} onChange={(e) => setCropArea({ ...cropArea, height: +e.target.value })} /></label>
            </div>
            <button onClick={cropImage} disabled={loading} className={styles.button}>
              {loading ? "Cropping..." : "Crop & Download"}
            </button>
          </>
        )}
        <canvas ref={canvasRef} style={{ display: "none" }} />
      </section>

      <ToolInfo
        howItWorks="1. Select an image.<br>2. Click to set crop start, adjust size.<br>3. Click 'Crop & Download'."
        faqs={[
          { title: "How to select area?", content: "Click on image to set top-left, adjust width/height inputs." }
        ]}
        tips={["For precise cropping, use the input fields to set exact dimensions."]}
      />
    </main>
  );
}