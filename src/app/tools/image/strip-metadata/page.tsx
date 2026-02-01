"use client";

import { useState, useRef } from "react";
import styles from "./stripmetadata.module.css";
import ToolInfo from "@/components/ToolInfo";

type ImageItem = {
  id: string;
  file: File;
  preview: string;
  originalSize: number;
  strippedSize: number | null;
  strippedBlob: Blob | null;
  status: "pending" | "processing" | "done" | "error";
};

export default function StripImageMetadata() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;

    const newImages: ImageItem[] = [];

    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) continue;

      const preview = URL.createObjectURL(file);
      const img = new Image();
      img.src = preview;

      await new Promise((resolve) => {
        img.onload = () => {
          newImages.push({
            id: Math.random().toString(36),
            file,
            preview,
            originalSize: file.size,
            strippedSize: null,
            strippedBlob: null,
            status: "pending",
          });
          resolve(null);
        };
        img.onerror = () => {
          resolve(null);
        };
      });
    }

    setImages((prev) => [...prev, ...newImages]);
  };

  const stripMetadata = async (img: ImageItem): Promise<ImageItem> => {
    return new Promise((resolve) => {
      const image = new Image();
      image.src = img.preview;

      image.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve({ ...img, status: "error" });
          return;
        }

        ctx.drawImage(image, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve({ ...img, status: "error" });
              return;
            }

            resolve({
              ...img,
              strippedBlob: blob,
              strippedSize: blob.size,
              status: "done",
            });
          },
          img.file.type,
          0.95
        );
      };

      image.onerror = () => {
        resolve({ ...img, status: "error" });
      };
    });
  };

  const stripAll = async () => {
    const pending = images.filter((img) => img.status === "pending");

    for (const img of pending) {
      setImages((prev) =>
        prev.map((i) => (i.id === img.id ? { ...i, status: "processing" } : i))
      );

      const stripped = await stripMetadata(img);

      setImages((prev) =>
        prev.map((i) => (i.id === stripped.id ? stripped : i))
      );
    }
  };

  const downloadImage = (img: ImageItem) => {
    if (!img.strippedBlob) return;

    const link = document.createElement("a");
    link.href = URL.createObjectURL(img.strippedBlob);
    const nameWithoutExt = img.file.name.split(".")[0];
    const ext = img.file.name.substring(img.file.name.lastIndexOf("."));
    link.download = `${nameWithoutExt}-clean${ext}`;
    link.click();
  };

  const downloadAll = () => {
    images.forEach((img, index) => {
      if (img.status === "done") {
        setTimeout(() => downloadImage(img), index * 100);
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
  const totalStripped = images.reduce((sum, img) => sum + (img.strippedSize || 0), 0);
  const totalSaved = totalOriginal - totalStripped;
  const percentSaved = totalOriginal > 0 ? ((totalSaved / totalOriginal) * 100).toFixed(1) : "0";

  return (
    <main className={styles.container}>
      <section className={styles.header}>
        <h1 className={styles.pageTitle}>
          <span className={styles.icon}>🛡️</span>
          <span className={styles.textGradient}>Strip Metadata</span>
        </h1>
        <p className={styles.subtitle}>Remove EXIF, GPS, and embedded data from images for privacy.</p>
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
              <span className={styles.statLabel}>Total Images</span>
              <span className={styles.statValue}>{images.length}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Ready</span>
              <span className={styles.statValue}>{images.filter(i => i.status === "pending").length}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Cleaned</span>
              <span className={styles.statValue} style={{color: "#dc2626"}}>{images.filter(i => i.status === "done").length}</span>
            </div>
            {totalStripped > 0 && (
              <div className={styles.stat}>
                <span className={styles.statLabel}>Space Saved</span>
                <span className={styles.statValue} style={{color: "#22c55e"}}>
                  {formatSize(totalSaved)} ({percentSaved}%)
                </span>
              </div>
            )}
          </section>

          <section className={styles.actions}>
            <button onClick={stripAll} className={styles.btnPrimary} disabled={images.every(i => i.status !== "pending")}>
              🛡️ Strip All ({images.filter(i => i.status === "pending").length})
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
                    {img.status === "processing" && <span className={`${styles.badge} ${styles.badgeProcessing}`}>Processing...</span>}
                    {img.status === "done" && <span className={`${styles.badge} ${styles.badgeSuccess}`}>✓ Clean</span>}
                    {img.status === "error" && <span className={`${styles.badge} ${styles.badgeError}`}>Error</span>}
                  </div>
                </div>
                <div className={styles.cardBody}>
                  <h4 className={styles.cardTitle}>{img.file.name}</h4>
                  <div className={styles.cardInfo}>
                    <span style={{fontSize: "0.75rem", color: "#6b7280"}}>
                      {formatSize(img.originalSize)}
                    </span>
                    {img.strippedBlob && (
                      <>
                        <span>→</span>
                        <span style={{fontSize: "0.75rem", color: "#22c55e", fontWeight: 600}}>
                          {formatSize(img.strippedSize!)}
                        </span>
                      </>
                    )}
                  </div>
                  {img.strippedSize && (
                    <div className={styles.savedBadge}>
                      Saved: {formatSize(img.originalSize - img.strippedSize)}
                    </div>
                  )}
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
        howItWorks="1. Drag & drop or select images<br>2. Tool removes all embedded metadata<br>3. Click 'Strip All' to process<br>4. Download cleaned images individually or all at once"
        faqs={[
          { title: "What metadata gets removed?", content: "EXIF data (camera settings, GPS coordinates), IPTC data (keywords, copyright), XMP data, and other embedded information." },
          { title: "Does this affect image quality?", content: "No, only metadata is removed. The image pixels and visual quality remain exactly the same." },
          { title: "Why is this important?", content: "Protects your privacy by removing location data, camera info, timestamps, and personal information before sharing photos." },
          { title: "Can I recover stripped metadata?", content: "No, once metadata is stripped and saved, it cannot be recovered from the processed image." }
        ]}
        tips={[
          "Always strip metadata before sharing photos on social media",
          "Especially important for photos containing location data or sensitive information",
          "Batch process multiple images at once to save time",
          "Downloaded images have '-clean' suffix for easy identification"
        ]}
      />
    </main>
  );
}
