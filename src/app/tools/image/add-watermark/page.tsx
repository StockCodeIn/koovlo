"use client";

import { useState, useRef } from "react";
import React from "react";
import styles from "./addwatermark.module.css";
import ToolInfo from "@/components/ToolInfo";

type ImageItem = {
  id: string;
  file: File;
  preview: string;
  watermarkedBlob: Blob | null;
  status: "pending" | "processing" | "done" | "error";
};

type WatermarkMode = "text" | "image";

export default function AddWatermark() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [watermarkMode, setWatermarkMode] = useState<WatermarkMode>("text");
  const [watermarkText, setWatermarkText] = useState("© My Brand");
  const [watermarkImage, setWatermarkImage] = useState<string | null>(null);
  const [watermarkFile, setWatermarkFile] = useState<File | null>(null);
  const [position, setPosition] = useState<"top-left" | "top-right" | "bottom-left" | "bottom-right" | "center">("bottom-right");
  const [opacity, setOpacity] = useState(70);
  const [fontSize, setFontSize] = useState(32);
  const [fontColor, setFontColor] = useState("#000000");
  const [scale, setScale] = useState(30);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const watermarkInputRef = useRef<HTMLInputElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  const positions = [
    { value: "top-left", label: "🔷 Top Left" },
    { value: "top-right", label: "🔶 Top Right" },
    { value: "bottom-left", label: "🔹 Bottom Left" },
    { value: "bottom-right", label: "🔸 Bottom Right" },
    { value: "center", label: "⭕ Center" },
  ];

  const colors = ["#ffffff", "#000000", "#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff", "#ffa500"];

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
            watermarkedBlob: null,
            status: "pending",
          });
          resolve(null);
        };
        img.onerror = () => resolve(null);
      });
    }

    setImages((prev) => [...prev, ...newImages]);
  };

  const handleWatermarkFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setWatermarkFile(file);
      const reader = new FileReader();
      reader.onload = (evt) => {
        setWatermarkImage(evt.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Live preview update
  const updatePreview = () => {
    if (images.length === 0 || !previewCanvasRef.current) return;

    const canvas = previewCanvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const firstImage = new Image();
    firstImage.src = images[0].preview;

    firstImage.onload = () => {
      // Set canvas to image size (with max width for performance)
      const maxWidth = 800;
      const imageScale = Math.min(1, maxWidth / firstImage.width);
      canvas.width = firstImage.width * imageScale;
      canvas.height = firstImage.height * imageScale;

      ctx.drawImage(firstImage, 0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = opacity / 100;

      if (watermarkMode === "text") {
        const scaledFontSize = fontSize * imageScale;
        ctx.font = `bold ${scaledFontSize}px Arial`;
        ctx.fillStyle = fontColor;
        ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
        ctx.shadowBlur = 6 * imageScale;
        ctx.shadowOffsetX = 2 * imageScale;
        ctx.shadowOffsetY = 2 * imageScale;

        const textWidth = ctx.measureText(watermarkText).width;
        const textHeight = scaledFontSize;

        let x = 0, y = 0;
        const padding = 30 * imageScale;

        switch (position) {
          case "top-left":
            x = padding;
            y = textHeight + padding;
            break;
          case "top-right":
            x = canvas.width - textWidth - padding;
            y = textHeight + padding;
            break;
          case "bottom-left":
            x = padding;
            y = canvas.height - padding;
            break;
          case "bottom-right":
            x = canvas.width - textWidth - padding;
            y = canvas.height - padding;
            break;
          case "center":
            x = (canvas.width - textWidth) / 2;
            y = (canvas.height + textHeight) / 2;
            break;
        }

        ctx.fillText(watermarkText, x, y);
      } else if (watermarkMode === "image" && watermarkImage) {
        const watermark = new Image();
        watermark.src = watermarkImage;

        watermark.onload = () => {
          const maxWidth = (canvas.width * scale) / 100;
          const scaledHeight = (watermark.height / watermark.width) * maxWidth;

          let x = 0, y = 0;
          const padding = 30 * imageScale;

          switch (position) {
            case "top-left":
              x = padding;
              y = padding;
              break;
            case "top-right":
              x = canvas.width - maxWidth - padding;
              y = padding;
              break;
            case "bottom-left":
              x = padding;
              y = canvas.height - scaledHeight - padding;
              break;
            case "bottom-right":
              x = canvas.width - maxWidth - padding;
              y = canvas.height - scaledHeight - padding;
              break;
            case "center":
              x = (canvas.width - maxWidth) / 2;
              y = (canvas.height - scaledHeight) / 2;
              break;
          }

          ctx.drawImage(watermark, x, y, maxWidth, scaledHeight);
        };
      }

      ctx.globalAlpha = 1;
    };
  };

  // Update preview when settings or images change
  React.useEffect(() => {
    updatePreview();
  }, [images, watermarkMode, watermarkText, watermarkImage, position, opacity, fontSize, fontColor, scale]);

  const applyWatermark = async (img: ImageItem): Promise<ImageItem> => {
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
        ctx.globalAlpha = opacity / 100;

        if (watermarkMode === "text") {
          ctx.font = `bold ${fontSize}px Arial`;
          ctx.fillStyle = fontColor;
          ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
          ctx.shadowBlur = 6;
          ctx.shadowOffsetX = 2;
          ctx.shadowOffsetY = 2;

          const textWidth = ctx.measureText(watermarkText).width;
          const textHeight = fontSize;

          let x = 0, y = 0;
          const padding = 30;

          switch (position) {
            case "top-left":
              x = padding;
              y = textHeight + padding;
              break;
            case "top-right":
              x = canvas.width - textWidth - padding;
              y = textHeight + padding;
              break;
            case "bottom-left":
              x = padding;
              y = canvas.height - padding;
              break;
            case "bottom-right":
              x = canvas.width - textWidth - padding;
              y = canvas.height - padding;
              break;
            case "center":
              x = (canvas.width - textWidth) / 2;
              y = (canvas.height + textHeight) / 2;
              break;
          }

          ctx.fillText(watermarkText, x, y);
          ctx.globalAlpha = 1;

          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve({ ...img, watermarkedBlob: blob, status: "done" });
              } else {
                resolve({ ...img, status: "error" });
              }
            },
            "image/jpeg",
            0.95
          );
        } else if (watermarkMode === "image" && watermarkImage) {
          const watermark = new Image();
          watermark.src = watermarkImage;

          watermark.onload = () => {
            const maxWidth = (canvas.width * scale) / 100;
            const scaledHeight = (watermark.height / watermark.width) * maxWidth;

            let x = 0, y = 0;
            const padding = 30;

            switch (position) {
              case "top-left":
                x = padding;
                y = padding;
                break;
              case "top-right":
                x = canvas.width - maxWidth - padding;
                y = padding;
                break;
              case "bottom-left":
                x = padding;
                y = canvas.height - scaledHeight - padding;
                break;
              case "bottom-right":
                x = canvas.width - maxWidth - padding;
                y = canvas.height - scaledHeight - padding;
                break;
              case "center":
                x = (canvas.width - maxWidth) / 2;
                y = (canvas.height - scaledHeight) / 2;
                break;
            }

            ctx.drawImage(watermark, x, y, maxWidth, scaledHeight);
            ctx.globalAlpha = 1;

            canvas.toBlob(
              (blob) => {
                if (blob) {
                  resolve({ ...img, watermarkedBlob: blob, status: "done" });
                } else {
                  resolve({ ...img, status: "error" });
                }
              },
              "image/jpeg",
              0.95
            );
          };

          watermark.onerror = () => {
            // If watermark image fails to load, apply without watermark
            ctx.globalAlpha = 1;
            canvas.toBlob(
              (blob) => {
                if (blob) {
                  resolve({ ...img, watermarkedBlob: blob, status: "done" });
                } else {
                  resolve({ ...img, status: "error" });
                }
              },
              "image/jpeg",
              0.95
            );
          };
        } else {
          // No watermark (either text mode with no text, or image mode with no image)
          ctx.globalAlpha = 1;
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve({ ...img, watermarkedBlob: blob, status: "done" });
              } else {
                resolve({ ...img, status: "error" });
              }
            },
            "image/jpeg",
            0.95
          );
        }
      };

      image.onerror = () => resolve({ ...img, status: "error" });
    });
  };

  const applyToAll = async () => {
    const pending = images.filter((i) => i.status === "pending");

    for (const img of pending) {
      setImages((prev) =>
        prev.map((i) => (i.id === img.id ? { ...i, status: "processing" } : i))
      );

      const result = await applyWatermark(img);

      setImages((prev) =>
        prev.map((i) => (i.id === result.id ? result : i))
      );
    }
  };

  const downloadImage = (img: ImageItem) => {
    if (!img.watermarkedBlob) return;

    const link = document.createElement("a");
    link.href = URL.createObjectURL(img.watermarkedBlob);
    const nameWithoutExt = img.file.name.split(".")[0];
    link.download = `${nameWithoutExt}-watermarked.jpg`;
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
    setImages((prev) => prev.filter((i) => i.id !== id));
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

  return (
    <main className={styles.container}>
      <section className={styles.header}>
        <h1 className={styles.pageTitle}>
          <span className={styles.icon}>💧</span>
          <span className={styles.textGradient}>Add Watermark</span>
        </h1>
        <p className={styles.subtitle}>Protect your images with text or logo watermarks in batch.</p>
      </section>

      <section className={styles.controls}>
        <div className={styles.controlGroup}>
          <label>Watermark Type</label>
          <div className={styles.radioGroup}>
            <button
              onClick={() => setWatermarkMode("text")}
              className={watermarkMode === "text" ? styles.active : ""}
            >
              📝 Text
            </button>
            <button
              onClick={() => setWatermarkMode("image")}
              className={watermarkMode === "image" ? styles.active : ""}
            >
              🖼️ Image
            </button>
          </div>
        </div>

        {watermarkMode === "text" ? (
          <>
            <div className={styles.controlGroup}>
              <label>Text</label>
              <input
                type="text"
                value={watermarkText}
                onChange={(e) => setWatermarkText(e.target.value)}
                placeholder="Enter watermark text"
                className={styles.textInput}
              />
            </div>

            <div className={styles.controlGroup}>
              <label>Font Size: {fontSize}px</label>
              <input
                type="range"
                min="12"
                max="72"
                value={fontSize}
                onChange={(e) => setFontSize(+e.target.value)}
                className={styles.slider}
              />
            </div>

            <div className={styles.controlGroup}>
              <label>Color</label>
              <div className={styles.colorGrid}>
                {colors.map((color) => (
                  <button
                    key={color}
                    className={fontColor === color ? styles.colorActive : ""}
                    style={{
                      backgroundColor: color,
                      border: "2px solid #e5e7eb",
                      borderRadius: "8px",
                      width: "40px",
                      height: "40px",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    onClick={() => setFontColor(color)}
                  />
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className={styles.controlGroup}>
            <label>Upload Watermark Image</label>
            <button
              onClick={() => watermarkInputRef.current?.click()}
              className={styles.uploadBtn}
            >
              {watermarkFile ? `✓ ${watermarkFile.name}` : "📤 Choose File"}
            </button>
            <input
              ref={watermarkInputRef}
              type="file"
              accept="image/*"
              onChange={handleWatermarkFile}
              style={{ display: "none" }}
            />
          </div>
        )}

        <div className={styles.controlGroup}>
          <label>Position</label>
          <div className={styles.radioGroup}>
            {positions.map((pos) => (
              <button
                key={pos.value}
                onClick={() => setPosition(pos.value as any)}
                className={position === pos.value ? styles.active : ""}
              >
                {pos.label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.controlGroup}>
          <label>Opacity: {opacity}%</label>
          <input
            type="range"
            min="10"
            max="100"
            value={opacity}
            onChange={(e) => setOpacity(+e.target.value)}
            className={styles.slider}
          />
        </div>

        {watermarkMode === "image" && (
          <div className={styles.controlGroup}>
            <label>Scale: {scale}%</label>
            <input
              type="range"
              min="10"
              max="50"
              value={scale}
              onChange={(e) => setScale(+e.target.value)}
              className={styles.slider}
            />
          </div>
        )}
      </section>

      {images.length > 0 && (
        <section className={styles.previewSection}>
          <h3 className={styles.previewTitle}>🔍 Live Preview</h3>
          <p className={styles.previewSubtitle}>Adjust settings above and see real-time changes • {images.length} image{images.length > 1 ? 's' : ''} selected</p>
          <div className={styles.previewContainer}>
            <canvas ref={previewCanvasRef} className={styles.previewCanvas} />
          </div>
          
          <div className={styles.previewActions}>
            <button
              onClick={async () => {
                await applyToAll();
              }}
              className={styles.btnPreviewPrimary}
              disabled={images.every((i) => i.status === "done")}
            >
              💧 Apply Watermark to All {images.length} Image{images.length > 1 ? 's' : ''}
            </button>
            <button
              onClick={downloadAll}
              className={styles.btnPreviewSecondary}
              disabled={images.every((i) => i.status !== "done")}
            >
              ⬇️ Download All ({images.filter((i) => i.status === "done").length})
            </button>
            <button onClick={clearAll} className={styles.btnPreviewDanger}>
              🗑️ Clear & Start Over
            </button>
          </div>
        </section>
      )}

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
          <section className={styles.statusSection}>
            <div className={styles.statusHeader}>
              <h4>📋 Processing Status</h4>
              <div className={styles.statusCounts}>
                <span className={styles.statusPending}>⏳ Pending: {images.filter((i) => i.status === "pending").length}</span>
                <span className={styles.statusProcessing}>⚙️ Processing: {images.filter((i) => i.status === "processing").length}</span>
                <span className={styles.statusDone}>✅ Done: {images.filter((i) => i.status === "done").length}</span>
              </div>
            </div>
            <div className={styles.imageList}>
              {images.map((img) => (
                <div key={img.id} className={styles.imageRow}>
                  <img src={img.preview} alt={img.file.name} className={styles.imageThumbnail} />
                  <span className={styles.imageName}>{img.file.name}</span>
                  <span className={`${styles.imageStatus} ${styles['status' + img.status.charAt(0).toUpperCase() + img.status.slice(1)]}`}>
                    {img.status === "pending" && "⏳ Waiting"}
                    {img.status === "processing" && "⚙️ Processing..."}
                    {img.status === "done" && "✅ Ready"}
                    {img.status === "error" && "❌ Error"}
                  </span>
                  {img.status === "done" && (
                    <button onClick={() => downloadImage(img)} className={styles.btnDownloadSmall}>
                      ⬇️
                    </button>
                  )}
                  <button onClick={() => removeImage(img.id)} className={styles.btnRemoveSmall}>
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      <ToolInfo
        howItWorks="1. Choose watermark type (text or image)<br>2. Configure watermark settings (text, position, opacity)<br>3. Drag & drop or select multiple images<br>4. Click 'Watermark All' to apply<br>5. Download watermarked images individually or all at once"
        faqs={[
          {
            title: "Can I use both text and image watermarks?",
            content: "Currently, you can use one type at a time. Choose either text or image watermark.",
          },
          {
            title: "What image formats are supported?",
            content: "JPG, PNG, WebP, GIF, and other common formats. Output is always JPEG for compatibility.",
          },
          {
            title: "Will this affect image quality?",
            content: "Minimal quality loss with 95% JPEG compression. Watermarks are applied without significant degradation.",
          },
          {
            title: "Can I batch process with different settings?",
            content: "All images in a batch will receive the same watermark settings. For different settings, process in separate batches.",
          },
        ]}
        tips={[
          "Use semi-transparent watermarks for better visibility of content",
          "Position watermarks in corners to minimize coverage of important areas",
          "Smaller font sizes work better for images with fine details",
          "Test with 2-3 images first before processing your entire batch",
        ]}
      />
    </main>
  );
}
