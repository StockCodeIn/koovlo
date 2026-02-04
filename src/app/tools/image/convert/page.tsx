"use client";

import { useState, useRef } from "react";
import styles from "./convert.module.css";
import ToolInfo from "@/components/ToolInfo";

type ImageItem = {
  id: string;
  file: File;
  preview: string;
  originalFormat: string;
  convertedBlob: Blob | null;
  status: "pending" | "converting" | "done" | "error";
};

export default function ImageConvert() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [format, setFormat] = useState<"jpeg" | "jpg" | "png" | "webp">("webp");
  const [quality, setQuality] = useState(90);
  const [dragActive, setDragActive] = useState(false);
  const [maintainSize, setMaintainSize] = useState(true);
  const [customWidth, setCustomWidth] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    
    const newImages: ImageItem[] = [];
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) return;
      
      const originalFormat = file.type.split("/")[1] || "unknown";
      newImages.push({
        id: Math.random().toString(36),
        file,
        preview: URL.createObjectURL(file),
        originalFormat,
        convertedBlob: null,
        status: "pending",
      });
    });
    
    setImages((prev) => [...prev, ...newImages]);
  };

  const convertImage = async (img: ImageItem): Promise<ImageItem> => {
    return new Promise((resolve) => {
      const image = new Image();
      image.src = img.preview;
      
      image.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = image;
        
        // Resize if custom width is set
        if (!maintainSize && customWidth && width > customWidth) {
          height = (height * customWidth) / width;
          width = customWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext("2d")!;
        
        // Fill white background for JPEG (no transparency)
        if (format === "jpeg" || format === "jpg") {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, width, height);
        }
        
        ctx.drawImage(image, 0, 0, width, height);
        
        const mimeType = (format === "jpeg" || format === "jpg") ? "image/jpeg" : format === "png" ? "image/png" : "image/webp";
        const qualityValue = format === "png" ? 1 : quality / 100;
        
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve({ ...img, status: "error" });
              return;
            }
            
            resolve({
              ...img,
              convertedBlob: blob,
              status: "done",
            });
          },
          mimeType,
          qualityValue
        );
      };
      
      image.onerror = () => {
        resolve({ ...img, status: "error" });
      };
    });
  };

  const convertAll = async () => {
    const pending = images.filter((img) => img.status === "pending");
    
    for (const img of pending) {
      setImages((prev) =>
        prev.map((i) => (i.id === img.id ? { ...i, status: "converting" } : i))
      );
      
      const converted = await convertImage(img);
      
      setImages((prev) =>
        prev.map((i) => (i.id === converted.id ? converted : i))
      );
    }
  };

  const downloadImage = (img: ImageItem) => {
    if (!img.convertedBlob) return;
    
    const link = document.createElement("a");
    link.href = URL.createObjectURL(img.convertedBlob);
    const ext = format;
    link.download = `${img.file.name.split(".")[0]}.${ext}`;
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

  const getFormatIcon = (format: string) => {
    switch (format.toLowerCase()) {
      case "jpeg":
      case "jpg":
        return "📷";
      case "png":
        return "🖼️";
      case "webp":
        return "🌐";
      case "gif":
        return "🎞️";
      default:
        return "🖼️";
    }
  };

  return (
    <main className={styles.container}>
      <section className={styles.header}>
        <h1 className={styles.pageTitle}>
          <span className={styles.icon}>🔄</span>
          <span className={styles.textGradient}>Batch Image Converter</span>
        </h1>
        <p className={styles.subtitle}>Convert multiple images between formats. Fast, private, and free.</p>
      </section>

      <section className={styles.controls}>
        <div className={styles.controlGroup}>
          <label>Output Format</label>
          <div className={styles.radioGroup}>
            <label className={styles.radio}>
              <input type="radio" id="format-jpeg-convert" name="format" checked={format === "jpeg"} onChange={() => setFormat("jpeg")} />
              <span>📷 JPEG</span>
            </label>
            <label className={styles.radio}>
              <input type="radio" id="format-jpg-convert" name="format" checked={format === "jpg"} onChange={() => setFormat("jpg")} />
              <span>📸 JPG</span>
            </label>
            <label className={styles.radio}>
              <input type="radio" id="format-png-convert" name="format" checked={format === "png"} onChange={() => setFormat("png")} />
              <span>🖼️ PNG</span>
            </label>
            <label className={styles.radio}>
              <input type="radio" id="format-webp-convert" name="format" checked={format === "webp"} onChange={() => setFormat("webp")} />
              <span>🌐 WebP</span>
            </label>
          </div>
        </div>

        {(format === "jpeg" || format === "jpg" || format === "webp") && (
          <div className={styles.controlGroup}>
            <label htmlFor="quality-slider">Quality: {quality}%</label>
            <input
              id="quality-slider"
              type="range"
              min="10"
              max="100"
              value={quality}
              onChange={(e) => setQuality(+e.target.value)}
              className={styles.slider}
            />
            <small>{quality < 60 ? "Lower quality" : quality < 85 ? "Good balance" : "High quality"}</small>
          </div>
        )}

        {format === "png" && (
          <div className={styles.controlGroup}>
            <label>PNG Settings</label>
            <small style={{color: "#6b7280"}}>PNG is lossless - no quality loss</small>
          </div>
        )}

        <div className={styles.controlGroup}>
          <label>Resize Options</label>
          <div className={styles.radioGroup}>
            <label className={styles.radio}>
              <input type="radio" id="resize-original" name="resize" checked={maintainSize} onChange={() => setMaintainSize(true)} />
              <span>Keep Original Size</span>
            </label>
            <label className={styles.radio}>
              <input type="radio" id="resize-1920" name="resize" checked={!maintainSize && customWidth === 1920} onChange={() => { setMaintainSize(false); setCustomWidth(1920); }} />
              <span>Max 1920px</span>
            </label>
            <label className={styles.radio}>
              <input type="radio" id="resize-1280" name="resize" checked={!maintainSize && customWidth === 1280} onChange={() => { setMaintainSize(false); setCustomWidth(1280); }} />
              <span>Max 1280px</span>
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
              <span className={styles.statLabel}>Total Images</span>
              <span className={styles.statValue}>{images.length}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Pending</span>
              <span className={styles.statValue}>{images.filter(i => i.status === "pending").length}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Completed</span>
              <span className={styles.statValue} style={{color: "#22c55e"}}>{images.filter(i => i.status === "done").length}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Output Format</span>
              <span className={styles.statValue}>{format.toUpperCase()}</span>
            </div>
          </section>

          <section className={styles.actions}>
            <button onClick={convertAll} className={styles.btnPrimary} disabled={images.every(i => i.status !== "pending")}>
              ⚡ Convert All ({images.filter(i => i.status === "pending").length})
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
                    {img.status === "converting" && <span className={`${styles.badge} ${styles.badgeProcessing}`}>Converting...</span>}
                    {img.status === "done" && <span className={`${styles.badge} ${styles.badgeSuccess}`}>✓ Done</span>}
                    {img.status === "error" && <span className={`${styles.badge} ${styles.badgeError}`}>Error</span>}
                  </div>
                </div>
                <div className={styles.cardBody}>
                  <h4 className={styles.cardTitle}>{img.file.name}</h4>
                  <div className={styles.cardInfo}>
                    <span className={styles.formatBadge}>
                      {getFormatIcon(img.originalFormat)} {img.originalFormat.toUpperCase()}
                    </span>
                    <span>→</span>
                    <span className={styles.formatBadge} style={{background: "#dcfce7", color: "#166534"}}>
                      {getFormatIcon(format)} {format.toUpperCase()}
                    </span>
                  </div>
                  <div className={styles.cardInfo}>
                    <span style={{fontSize: "0.75rem", color: "#6b7280"}}>
                      Size: {formatSize(img.file.size)}
                    </span>
                    {img.convertedBlob && (
                      <>
                        <span>→</span>
                        <span style={{fontSize: "0.75rem", color: "#22c55e", fontWeight: 600}}>
                          {formatSize(img.convertedBlob.size)}
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
        howItWorks="1. Drag & drop or click to select images<br>2. Choose output format (JPEG/PNG/WebP)<br>3. Adjust quality settings if needed<br>4. Click 'Convert All' to process<br>5. Download individually or all at once"
        faqs={[
          { title: "What formats are supported?", content: "Input: JPG, PNG, WebP, GIF, BMP. Output: JPEG, PNG, or WebP" },
          { title: "Which format should I use?", content: "WebP: Best compression & quality. PNG: For transparency. JPEG: Universal compatibility." },
          { title: "Does PNG have quality loss?", content: "No, PNG is lossless. Quality slider only affects JPEG and WebP." },
          { title: "Can I batch convert?", content: "Yes! Upload multiple images and convert them all at once." }
        ]}
        tips={[
          "WebP provides 25-35% better compression than JPEG with same quality",
          "Use PNG for images with transparency or text",
          "JPEG is best for photographs and complex images",
          "Batch convert for faster workflow with multiple images"
        ]}
      />
    </main>
  );
}