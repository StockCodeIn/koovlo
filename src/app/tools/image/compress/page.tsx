"use client";

import { useState, useRef } from "react";
import styles from "./compress.module.css";
import ToolInfo from "@/components/ToolInfo";

type ImageItem = {
  id: string;
  file: File;
  preview: string;
  originalSize: number;
  compressedSize: number | null;
  compressedBlob: Blob | null;
  status: "pending" | "compressing" | "done" | "error";
};

export default function ImageCompress() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [quality, setQuality] = useState(80);
  const [format, setFormat] = useState<"jpeg" | "webp">("jpeg");
  const [maxWidth, setMaxWidth] = useState<number | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    
    const newImages: ImageItem[] = [];
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) return;
      
      newImages.push({
        id: Math.random().toString(36),
        file,
        preview: URL.createObjectURL(file),
        originalSize: file.size,
        compressedSize: null,
        compressedBlob: null,
        status: "pending",
      });
    });
    
    setImages((prev) => [...prev, ...newImages]);
  };

  const compressImage = async (img: ImageItem): Promise<ImageItem> => {
    return new Promise((resolve) => {
      const image = new Image();
      image.src = img.preview;
      
      image.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = image;
        
        // Resize if maxWidth is set
        if (maxWidth && width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext("2d")!;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(image, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve({ ...img, status: "error" });
              return;
            }
            
            resolve({
              ...img,
              compressedSize: blob.size,
              compressedBlob: blob,
              status: "done",
            });
          },
          format === "jpeg" ? "image/jpeg" : "image/webp",
          quality / 100
        );
      };
      
      image.onerror = () => {
        resolve({ ...img, status: "error" });
      };
    });
  };

  const compressAll = async () => {
    const pending = images.filter((img) => img.status === "pending");
    
    for (const img of pending) {
      setImages((prev) =>
        prev.map((i) => (i.id === img.id ? { ...i, status: "compressing" } : i))
      );
      
      const compressed = await compressImage(img);
      
      setImages((prev) =>
        prev.map((i) => (i.id === compressed.id ? compressed : i))
      );
    }
  };

  const downloadImage = (img: ImageItem) => {
    if (!img.compressedBlob) return;
    
    const link = document.createElement("a");
    link.href = URL.createObjectURL(img.compressedBlob);
    const ext = format === "jpeg" ? "jpg" : "webp";
    link.download = `${img.file.name.split(".")[0]}-compressed.${ext}`;
    link.click();
  };

  const downloadAll = () => {
    images.forEach((img) => {
      if (img.status === "done") {
        setTimeout(() => downloadImage(img), 100);
      }
    });
  };

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const clearAll = () => {
    images.forEach((img) => URL.revokeObjectURL(img.preview));
    setImages([]);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const totalOriginal = images.reduce((sum, img) => sum + img.originalSize, 0);
  const totalCompressed = images.reduce((sum, img) => sum + (img.compressedSize || 0), 0);
  const savings = totalOriginal > 0 ? ((totalOriginal - totalCompressed) / totalOriginal * 100) : 0;

  return (
    <main className={styles.container}>
      <section className={styles.header}>
        <h1 className={styles.pageTitle}>
          <span className={styles.icon}>🗜️</span>
          <span className={styles.textGradient}>Image Compressor</span>
        </h1>
        <p className={styles.subtitle}>Compress multiple images at once. Fast, private, and free.</p>
      </section>

      <section className={styles.controls}>
        <div className={styles.controlGroup}>
          <label>Quality: {quality}%</label>
          <input
            type="range"
            min="10"
            max="100"
            value={quality}
            onChange={(e) => setQuality(+e.target.value)}
            className={styles.slider}
          />
          <small>{quality < 60 ? "Low quality, small size" : quality < 85 ? "Good balance" : "High quality, larger size"}</small>
        </div>

        <div className={styles.controlGroup}>
          <label>Format</label>
          <div className={styles.radioGroup}>
            <label className={styles.radio}>
              <input type="radio" id="format-jpeg" name="format" checked={format === "jpeg"} onChange={() => setFormat("jpeg")} />
              <span>JPEG</span>
            </label>
            <label className={styles.radio}>
              <input type="radio" id="format-webp" name="format" checked={format === "webp"} onChange={() => setFormat("webp")} />
              <span>WebP (Better)</span>
            </label>
          </div>
        </div>

        <div className={styles.controlGroup}>
          <label>Max Width (optional)</label>
          <div className={styles.radioGroup}>
            <label className={styles.radio}>
              <input type="radio" id="width-original" name="maxWidth" checked={maxWidth === null} onChange={() => setMaxWidth(null)} />
              <span>Original</span>
            </label>
            <label className={styles.radio}>
              <input type="radio" id="width-1920" name="maxWidth" checked={maxWidth === 1920} onChange={() => setMaxWidth(1920)} />
              <span>1920px</span>
            </label>
            <label className={styles.radio}>
              <input type="radio" id="width-1280" name="maxWidth" checked={maxWidth === 1280} onChange={() => setMaxWidth(1280)} />
              <span>1280px</span>
            </label>
          </div>
        </div>
      </section>

      <section 
        className={`${styles.dropzone} ${dragActive ? styles.dragActive : ""}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          style={{ display: "none" }}
        />
        <div className={styles.dropzoneContent}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
          </svg>
          <h3>Drop images here or click to browse</h3>
          <p>Support: JPG, PNG, WebP, GIF • Multiple files allowed</p>
        </div>
      </section>

      {images.length > 0 && (
        <>
          <section className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Images</span>
              <span className={styles.statValue}>{images.length}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Original Size</span>
              <span className={styles.statValue}>{formatSize(totalOriginal)}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Compressed Size</span>
              <span className={styles.statValue}>{formatSize(totalCompressed)}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Savings</span>
              <span className={styles.statValue} style={{color: savings > 0 ? "#22c55e" : "#6b7280"}}>
                {savings.toFixed(1)}%
              </span>
            </div>
          </section>

          <section className={styles.actions}>
            <button onClick={compressAll} className={styles.btnPrimary} disabled={images.every(i => i.status !== "pending")}>
              ⚡ Compress All ({images.filter(i => i.status === "pending").length})
            </button>
            <button onClick={downloadAll} className={styles.btnSecondary} disabled={images.every(i => i.status !== "done")}>
              ⬇️ Download All ({images.filter(i => i.status === "done").length})
            </button>
            <button onClick={clearAll} className={styles.btnDanger}>
              🗑️ Clear All
            </button>
          </section>

          <section className={styles.grid}>
            {images.map((img) => (
              <div key={img.id} className={styles.card}>
                <div className={styles.cardImage}>
                  <img src={img.preview} alt={img.file.name} />
                  <div className={styles.cardStatus}>
                    {img.status === "pending" && <span className={styles.badge}>Pending</span>}
                    {img.status === "compressing" && <span className={`${styles.badge} ${styles.badgeProcessing}`}>Processing...</span>}
                    {img.status === "done" && <span className={`${styles.badge} ${styles.badgeSuccess}`}>✓ Done</span>}
                    {img.status === "error" && <span className={`${styles.badge} ${styles.badgeError}`}>Error</span>}
                  </div>
                </div>
                <div className={styles.cardBody}>
                  <h4 className={styles.cardTitle}>{img.file.name}</h4>
                  <div className={styles.cardInfo}>
                    <span>Original: {formatSize(img.originalSize)}</span>
                    {img.compressedSize && (
                      <>
                        <span>→</span>
                        <span style={{color: "#22c55e", fontWeight: 600}}>
                          {formatSize(img.compressedSize)}
                        </span>
                        <span className={styles.savings}>
                          -{((img.originalSize - img.compressedSize) / img.originalSize * 100).toFixed(0)}%
                        </span>
                      </>
                    )}
                  </div>
                  <div className={styles.cardActions}>
                    {img.status === "done" && (
                      <button onClick={() => downloadImage(img)} className={styles.btnSmall}>
                        ⬇️ Download
                      </button>
                    )}
                    <button onClick={() => removeImage(img.id)} className={styles.btnSmallDanger}>
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </section>
        </>
      )}

      <ToolInfo
        howItWorks="1. Drag & drop or click to select images<br>2. Adjust quality and format settings<br>3. Click 'Compress All' to process<br>4. Download individually or all at once"
        faqs={[
          { title: "What formats are supported?", content: "Input: JPG, PNG, WebP, GIF. Output: JPEG or WebP" },
          { title: "Is there a file limit?", content: "No limit. All processing happens in your browser." },
          { title: "JPEG vs WebP?", content: "WebP provides better compression with same quality. Use JPEG for maximum compatibility." }
        ]}
        tips={[
          "For web use, 70-80% quality with WebP is recommended",
          "Use max width 1920px for full HD displays",
          "Process images in batches for better performance"
        ]}
      />
    </main>
  );
}
