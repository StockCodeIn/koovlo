"use client";

import { useState, useRef } from "react";
import styles from "./resize.module.css";
import ToolInfo from "@/components/ToolInfo";

type ImageItem = {
  id: string;
  file: File;
  preview: string;
  originalWidth: number;
  originalHeight: number;
  newWidth: number;
  newHeight: number;
  resizedBlob: Blob | null;
  status: "pending" | "resizing" | "done" | "error";
};

type ResizeMode = "exact" | "percentage" | "preset";
type PresetSize = "thumbnail" | "small" | "medium" | "large" | "hd" | "fullhd" | "4k";

export default function ImageResize() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [resizeMode, setResizeMode] = useState<ResizeMode>("preset");
  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(1080);
  const [percentage, setPercentage] = useState(50);
  const [preset, setPreset] = useState<PresetSize>("hd");
  const [maintainAspect, setMaintainAspect] = useState(true);
  const [format, setFormat] = useState<"jpeg" | "png" | "webp">("jpeg");
  const [quality, setQuality] = useState(90);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const presetSizes: Record<PresetSize, { width: number; height: number; label: string }> = {
    thumbnail: { width: 150, height: 150, label: "Thumbnail (150×150)" },
    small: { width: 640, height: 480, label: "Small (640×480)" },
    medium: { width: 1024, height: 768, label: "Medium (1024×768)" },
    large: { width: 1280, height: 720, label: "Large (1280×720)" },
    hd: { width: 1920, height: 1080, label: "HD (1920×1080)" },
    fullhd: { width: 2560, height: 1440, label: "Full HD (2560×1440)" },
    "4k": { width: 3840, height: 2160, label: "4K (3840×2160)" }
  };

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
          const { width: targetWidth, height: targetHeight } = calculateNewSize(img.width, img.height);
          
          newImages.push({
            id: Math.random().toString(36),
            file,
            preview,
            originalWidth: img.width,
            originalHeight: img.height,
            newWidth: targetWidth,
            newHeight: targetHeight,
            resizedBlob: null,
            status: "pending",
          });
          resolve(null);
        };
      });
    }
    
    setImages((prev) => [...prev, ...newImages]);
  };

  const calculateNewSize = (origWidth: number, origHeight: number) => {
    let targetWidth = origWidth;
    let targetHeight = origHeight;

    if (resizeMode === "percentage") {
      targetWidth = Math.round(origWidth * (percentage / 100));
      targetHeight = Math.round(origHeight * (percentage / 100));
    } else if (resizeMode === "preset") {
      const size = presetSizes[preset];
      if (maintainAspect) {
        const ratio = Math.min(size.width / origWidth, size.height / origHeight);
        targetWidth = Math.round(origWidth * ratio);
        targetHeight = Math.round(origHeight * ratio);
      } else {
        targetWidth = size.width;
        targetHeight = size.height;
      }
    } else if (resizeMode === "exact") {
      if (maintainAspect) {
        const ratio = Math.min(width / origWidth, height / origHeight);
        targetWidth = Math.round(origWidth * ratio);
        targetHeight = Math.round(origHeight * ratio);
      } else {
        targetWidth = width;
        targetHeight = height;
      }
    }

    return { width: targetWidth, height: targetHeight };
  };

  const resizeImage = async (img: ImageItem): Promise<ImageItem> => {
    return new Promise((resolve) => {
      const image = new Image();
      image.src = img.preview;
      
      image.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.newWidth;
        canvas.height = img.newHeight;
        
        const ctx = canvas.getContext("2d")!;
        
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        
        if (format === "jpeg") {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        
        ctx.drawImage(image, 0, 0, img.newWidth, img.newHeight);
        
        const mimeType = format === "jpeg" ? "image/jpeg" : format === "png" ? "image/png" : "image/webp";
        const qualityValue = format === "png" ? 1 : quality / 100;
        
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve({ ...img, status: "error" });
              return;
            }
            
            resolve({
              ...img,
              resizedBlob: blob,
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

  const recalculateAllSizes = () => {
    setImages((prev) =>
      prev.map((img) => {
        const { width: newWidth, height: newHeight } = calculateNewSize(img.originalWidth, img.originalHeight);
        return { ...img, newWidth, newHeight, status: "pending", resizedBlob: null };
      })
    );
  };

  const resizeAll = async () => {
    const pending = images.filter((img) => img.status === "pending");
    
    for (const img of pending) {
      setImages((prev) =>
        prev.map((i) => (i.id === img.id ? { ...i, status: "resizing" } : i))
      );
      
      const resized = await resizeImage(img);
      
      setImages((prev) =>
        prev.map((i) => (i.id === resized.id ? resized : i))
      );
    }
  };

  const downloadImage = (img: ImageItem) => {
    if (!img.resizedBlob) return;
    
    const link = document.createElement("a");
    link.href = URL.createObjectURL(img.resizedBlob);
    const ext = format;
    link.download = `resized-${img.file.name.split(".")[0]}.${ext}`;
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

  return (
    <main className={styles.container}>
      <section className={styles.header}>
        <h1 className={styles.pageTitle}>
          <span className={styles.icon}>📏</span>
          <span className={styles.textGradient}>Image Resizer</span>
        </h1>
        <p className={styles.subtitle}>Resize multiple images with presets, percentage, or exact dimensions.</p>
      </section>

      <section className={styles.controls}>
        <div className={styles.controlGroup}>
          <label>Resize Mode</label>
          <div className={styles.radioGroup}>
            <button onClick={() => setResizeMode("preset")} className={resizeMode === "preset" ? styles.active : ""}>
              📐 Presets
            </button>
            <button onClick={() => setResizeMode("percentage")} className={resizeMode === "percentage" ? styles.active : ""}>
              📊 Percentage
            </button>
            <button onClick={() => setResizeMode("exact")} className={resizeMode === "exact" ? styles.active : ""}>
              🎯 Exact Size
            </button>
          </div>
        </div>

        {resizeMode === "preset" && (
          <div className={styles.controlGroup}>
            <label>Select Preset</label>
            <div className={styles.radioGroup}>
              {(Object.keys(presetSizes) as PresetSize[]).map((key) => (
                <button
                  key={key}
                  onClick={() => { setPreset(key); recalculateAllSizes(); }}
                  className={preset === key ? styles.active : ""}
                >
                  {presetSizes[key].label}
                </button>
              ))}
            </div>
          </div>
        )}

        {resizeMode === "percentage" && (
          <div className={styles.controlGroup}>
            <label>Scale: {percentage}%</label>
            <input
              type="range"
              min="10"
              max="200"
              value={percentage}
              onChange={(e) => { setPercentage(+e.target.value); recalculateAllSizes(); }}
              className={styles.slider}
            />
            <small>{percentage < 50 ? "Shrink significantly" : percentage < 100 ? "Reduce size" : percentage === 100 ? "Keep original" : "Enlarge"}</small>
          </div>
        )}

        {resizeMode === "exact" && (
          <div className={styles.controlGroup}>
            <label>Dimensions</label>
            <div className={styles.sizeInputs}>
              <input
                type="number"
                value={width}
                onChange={(e) => { setWidth(+e.target.value); recalculateAllSizes(); }}
                placeholder="Width"
              />
              <span>×</span>
              <input
                type="number"
                value={height}
                onChange={(e) => { setHeight(+e.target.value); recalculateAllSizes(); }}
                placeholder="Height"
              />
              <span className={styles.unit}>px</span>
            </div>
          </div>
        )}

        <div className={styles.controlGroup}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={maintainAspect}
              onChange={(e) => { setMaintainAspect(e.target.checked); recalculateAllSizes(); }}
            />
            <span>🔒 Maintain Aspect Ratio</span>
          </label>
        </div>

        <div className={styles.controlGroup}>
          <label>Output Format</label>
          <div className={styles.radioGroup}>
            <button onClick={() => setFormat("jpeg")} className={format === "jpeg" ? styles.active : ""}>JPEG</button>
            <button onClick={() => setFormat("png")} className={format === "png" ? styles.active : ""}>PNG</button>
            <button onClick={() => setFormat("webp")} className={format === "webp" ? styles.active : ""}>WebP</button>
          </div>
        </div>

        {(format === "jpeg" || format === "webp") && (
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
          </div>
        )}
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
              <span className={styles.statLabel}>Completed</span>
              <span className={styles.statValue} style={{color: "#22c55e"}}>{images.filter(i => i.status === "done").length}</span>
            </div>
          </section>

          <section className={styles.actions}>
            <button onClick={resizeAll} className={styles.btnPrimary} disabled={images.every(i => i.status !== "pending")}>
              ⚡ Resize All ({images.filter(i => i.status === "pending").length})
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
                    {img.status === "resizing" && <span className={`${styles.badge} ${styles.badgeProcessing}`}>Resizing...</span>}
                    {img.status === "done" && <span className={`${styles.badge} ${styles.badgeSuccess}`}>✓ Done</span>}
                    {img.status === "error" && <span className={`${styles.badge} ${styles.badgeError}`}>Error</span>}
                  </div>
                </div>
                <div className={styles.cardBody}>
                  <h4 className={styles.cardTitle}>{img.file.name}</h4>
                  <div className={styles.cardInfo}>
                    <span className={styles.dimension}>
                      {img.originalWidth} × {img.originalHeight}
                    </span>
                    <span>→</span>
                    <span className={styles.dimension} style={{color: "#6366f1", fontWeight: 700}}>
                      {img.newWidth} × {img.newHeight}
                    </span>
                  </div>
                  <div className={styles.cardInfo}>
                    <span style={{fontSize: "0.75rem", color: "#6b7280"}}>
                      {formatSize(img.file.size)}
                    </span>
                    {img.resizedBlob && (
                      <>
                        <span>→</span>
                        <span style={{fontSize: "0.75rem", color: "#22c55e", fontWeight: 600}}>
                          {formatSize(img.resizedBlob.size)}
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
        howItWorks="1. Drag & drop or select images<br>2. Choose resize mode (Preset/Percentage/Exact)<br>3. Adjust settings and format<br>4. Click 'Resize All'<br>5. Download individually or all at once"
        faqs={[
          { title: "What's the difference between modes?", content: "Presets: Quick standard sizes. Percentage: Scale by %. Exact: Specific dimensions." },
          { title: "What is aspect ratio?", content: "When enabled, images maintain their proportions. Disable to stretch to exact size." },
          { title: "Best format for web?", content: "WebP for smallest size, JPEG for compatibility, PNG for transparency." },
          { title: "Can I enlarge images?", content: "Yes! Use percentage mode above 100% or exact dimensions larger than original." }
        ]}
        tips={[
          "Use presets for common sizes like thumbnails or HD displays",
          "Maintain aspect ratio to avoid distortion",
          "Percentage mode is great for batch downsizing",
          "WebP format provides best compression with quality"
        ]}
      />
    </main>
  );
}
