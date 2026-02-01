"use client";

import { useState, useRef, useEffect } from "react";
import { PDFDocument, rgb, degrees, StandardFonts } from "pdf-lib";
import styles from "@/app/tools/pdf/watermark/watermark.module.css";

interface Watermark {
  id: string;
  type: "text" | "image";
  content: string;
  position: string;
  opacity: number;
  size: number;
  rotation: number;
}

export default function PdfWatermarkPro() {
  const [file, setFile] = useState<File | null>(null);
  const [watermarks, setWatermarks] = useState<Watermark[]>([
    {
      id: "1",
      type: "text",
      content: "Koovlo Confidential",
      position: "center",
      opacity: 0.3,
      size: 40,
      rotation: -30,
    },
  ]);
  const [selectedWatermarkId, setSelectedWatermarkId] = useState("1");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "info">("info");
  const [progress, setProgress] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [isMobile, setIsMobile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const imageInputId = "watermark-image-upload";

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const base64ToUint8Array = (base64: string): Uint8Array => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  const getCurrentWatermark = () => {
    return watermarks.find((w) => w.id === selectedWatermarkId) || watermarks[0];
  };

  const updateWatermark = (updates: Partial<Watermark>) => {
    setWatermarks(
      watermarks.map((w) => (w.id === selectedWatermarkId ? { ...w, ...updates } : w))
    );
  };

  const addWatermark = () => {
    const newId = Date.now().toString();
    setWatermarks([
      ...watermarks,
      {
        id: newId,
        type: "text",
        content: "New Watermark",
        position: "center",
        opacity: 0.3,
        size: 40,
        rotation: -30,
      },
    ]);
    setSelectedWatermarkId(newId);
  };

  const removeWatermark = (id: string) => {
    if (watermarks.length > 1) {
      const filtered = watermarks.filter((w) => w.id !== id);
      setWatermarks(filtered);
      setSelectedWatermarkId(filtered[0].id);
    }
  };

  const generatePreview = async () => {
    if (!file) return;

    try {
      const bytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(bytes);
      const firstPage = pdfDoc.getPages()[0];
      const { width, height } = firstPage.getSize();

      const canvas = document.createElement("canvas");
      canvas.width = 400;
      canvas.height = (400 / width) * height;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        ctx.fillStyle = "#f0f0f0";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = "#ddd";
        ctx.lineWidth = 1;
        ctx.strokeRect(0, 0, canvas.width, canvas.height);

        const wmList = isMobile
          ? ([getCurrentWatermark()].filter(Boolean) as Watermark[])
          : watermarks;
        wmList.forEach((wm) => {
          const scaleX = canvas.width / width;
          const scaleY = canvas.height / height;

          let x = (width / 2) * scaleX;
          let y = (height / 2) * scaleY;

          switch (wm.position) {
            case "top-left":
              x = 50 * scaleX;
              y = (height - 80) * scaleY;
              break;
            case "top-right":
              x = (width - 200) * scaleX;
              y = (height - 80) * scaleY;
              break;
            case "bottom-left":
              x = 50 * scaleX;
              y = 80 * scaleY;
              break;
            case "bottom-right":
              x = (width - 200) * scaleX;
              y = 80 * scaleY;
              break;
            default:
              x = (width / 2) * scaleX;
              y = (height / 2) * scaleY;
          }

          ctx.save();
          ctx.globalAlpha = wm.opacity;
          ctx.translate(x, y);
          ctx.rotate((wm.rotation * Math.PI) / 180);

          if (wm.type === "text") {
            ctx.font = `bold ${wm.size * 0.5}px Arial`;
            ctx.fillStyle = "#999";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(wm.content, 0, 0);
          }

          ctx.restore();
        });

        setPreviewImage(canvas.toDataURL());
      }
    } catch (err) {
      console.error("Preview generation failed:", err);
    }
  };

  useEffect(() => {
    generatePreview();
  }, [file, watermarks, isMobile]);

  useEffect(() => {
    const updateIsMobile = () => setIsMobile(window.innerWidth <= 768);
    updateIsMobile();
    window.addEventListener("resize", updateIsMobile);
    return () => window.removeEventListener("resize", updateIsMobile);
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) processFile(f);
  };

  const processFile = (f: File) => {
    if (f.type !== "application/pdf") {
      setMessage("Please select a PDF file");
      setMessageType("error");
      return;
    }
    if (f.size > 50 * 1024 * 1024) {
      setMessage("File size too large. Maximum 50MB allowed.");
      setMessageType("error");
      return;
    }
    setFile(f);
    setMessage("");
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const img = e.target.files?.[0];
    if (img) {
      if (!img.type.includes("image")) {
        setMessage("Please select a valid image file");
        setMessageType("error");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        updateWatermark({ content: result, type: "image" });
      };
      reader.readAsDataURL(img);
      setMessage("");
    }
  };

  const applyWatermark = async () => {
    if (!file) {
      setMessage("Please upload a PDF file");
      setMessageType("error");
      return;
    }

    if (watermarks.length === 0) {
      setMessage("Please add at least one watermark");
      setMessageType("error");
      return;
    }

    setLoading(true);
    setProgress(10);
    setMessage("Processing PDF...");
    setMessageType("info");

    try {
      const bytes = await file.arrayBuffer();
      setProgress(30);

      const pdfDoc = await PDFDocument.load(bytes);
      const pages = pdfDoc.getPages();
      setProgress(40);

      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      setProgress(50);

      const imageMap = new Map<string, any>();
      const wmToApply = isMobile ? ([getCurrentWatermark()].filter(Boolean) as Watermark[]) : watermarks;
      for (const wm of wmToApply) {
        if (wm.type === "image" && wm.content.startsWith("data:")) {
          try {
            const base64 = wm.content.split(",")[1];
            const imgBytes = base64ToUint8Array(base64);
            let img;
            if (wm.content.includes("png")) {
              img = await pdfDoc.embedPng(imgBytes);
            } else {
              img = await pdfDoc.embedJpg(imgBytes);
            }
            imageMap.set(wm.id, img);
          } catch (e) {
            console.warn(`Could not load image for watermark ${wm.id}`);
          }
        }
      }

      setProgress(60);

      for (let pageIdx = 0; pageIdx < pages.length; pageIdx++) {
        const page = pages[pageIdx];
        const { width, height } = page.getSize();

        wmToApply.forEach((wm) => {
          let x = width / 2;
          let y = height / 2;

          switch (wm.position) {
            case "top-left":
              x = 50;
              y = height - 80;
              break;
            case "top-right":
              x = width - 200;
              y = height - 80;
              break;
            case "bottom-left":
              x = 50;
              y = 80;
              break;
            case "bottom-right":
              x = width - 200;
              y = 80;
              break;
            default:
              x = width / 2;
              y = height / 2;
          }

          try {
            if (wm.type === "image" && imageMap.has(wm.id)) {
              const img = imageMap.get(wm.id);
              page.drawImage(img, {
                x,
                y,
                width: wm.size * 8,
                height: wm.size * 3,
                opacity: wm.opacity,
                rotate: degrees(wm.rotation),
              });
            } else if (wm.type === "text") {
              page.drawText(wm.content, {
                x,
                y,
                size: wm.size,
                font,
                color: rgb(0.6, 0.6, 0.6),
                opacity: wm.opacity,
                rotate: degrees(wm.rotation),
              });
            }
          } catch (e) {
            console.warn(`Could not apply watermark ${wm.id}:`, e);
          }
        });

        setProgress(60 + (pageIdx / pages.length) * 30);
      }

      const newBytes = await pdfDoc.save();
      setProgress(95);

      const blob = new Blob([new Uint8Array(newBytes)], { type: "application/pdf" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = file.name.replace(".pdf", "-watermarked.pdf");
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(a.href);

      setProgress(100);
      setMessage(`Watermark applied to all pages! PDF downloaded.`);
      setMessageType("success");
    } catch (err) {
      console.error(err);
      setMessage("Failed to add watermark. Please try again.");
      setMessageType("error");
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  return (
    <section className={styles.container}>
      <h1 className={styles.pageTitle}>
        <span className={styles.icon}>💧</span>
        <span className={styles.textGradient}>Add Watermark</span>
      </h1>
      <p className={styles.description}>Add text or image watermarks to pdf</p>

      <div className={styles.modeNote}>
        <span className={styles.modePill}>{isMobile ? "Mobile" : "Desktop"} flow</span>
        <span>
          {isMobile
            ? "Single watermark for faster experience. For multi-watermark editing, use desktop."
            : "Add multiple watermarks, tweak settings, then preview and download."}
        </span>
      </div>

      <div className={styles.converter}>
        <div className={styles.inputSection}>
          <div
            className={`${styles.dropZone} ${isDragOver ? styles.dragOver : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFile}
              className={styles.hiddenInput}
            />
            <div className={styles.dropZoneContent}>
              <div className={styles.uploadIcon}>📄</div>
              <div className={styles.uploadText}>
                {file ? (
                  <>
                    <strong>{file.name}</strong>
                    <span className={styles.fileSize}>{formatFileSize(file.size)}</span>
                  </>
                ) : (
                  <>
                    <strong>Drop PDF here or click to browse</strong>
                    <span>Supports PDF files up to 50MB</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {loading && (
            <div className={styles.progressContainer}>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className={styles.progressText}>{progress}%</div>
            </div>
          )}

          {message && (
            <div className={`${styles.message} ${styles[messageType]}`}>
              {message}
            </div>
          )}

          {file && (
            <>
              <div className={styles.watermarksList}>
                <div className={styles.watermarksHeader}>
                  <h3>Watermarks ({watermarks.length})</h3>
                  <span className={styles.watermarkHint}>
                    {isMobile ? "Single watermark on mobile" : "Multi-watermark supported"}
                  </span>
                  <button
                    onClick={addWatermark}
                    className={styles.addBtn}
                    disabled={loading || isMobile}
                    title={isMobile ? "Use desktop to add multiple watermarks" : "Add a new watermark"}
                  >
                    + Add Watermark
                  </button>
                </div>

                {watermarks.map((wm) => (
                  <div
                    key={wm.id}
                    className={`${styles.watermarkTab} ${selectedWatermarkId === wm.id ? styles.active : ''}`}
                  >
                    <div
                      role="button"
                      onClick={() => setSelectedWatermarkId(wm.id)}
                      className={styles.watermarkTabBtn}
                      aria-disabled={loading}
                    >
                      <span className={styles.wmType}>{wm.type === 'text' ? '📝' : '🖼️'}</span>
                      <span className={styles.wmContent}>
                        {wm.type === 'text'
                          ? (wm.content || 'Text watermark').slice(0, 40)
                          : 'Image watermark'}
                      </span>
                      {watermarks.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeWatermark(wm.id);
                          }}
                          className={styles.removeBtn}
                          disabled={loading}
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {file && getCurrentWatermark() && (
                <div className={styles.controlsContainer}>
                  <div className={styles.controlsHeader}>
                    <div>
                      <p className={styles.sectionLabel}>Step 2 · Tweak watermark</p>
                      <p className={styles.sectionNote}>
                        {isMobile
                          ? "Edit the single watermark below. Multi-watermark editing is available on desktop."
                          : "Switch between watermarks and adjust their style, position, and opacity."}
                      </p>
                    </div>
                  </div>

                  <div className={styles.controlsGrid}>
                    <div className={styles.controlGroup}>
                      <label className={styles.controlLabel}>Type</label>
                      <div className={styles.typeButtons}>
                        <button
                          className={`${styles.typeBtn} ${getCurrentWatermark().type === 'text' ? styles.active : ''}`}
                          onClick={() => updateWatermark({ type: 'text', content: 'Watermark' })}
                          disabled={loading}
                        >
                          Text
                        </button>
                        <label className={`${styles.typeBtn} ${getCurrentWatermark().type === 'image' ? styles.active : ''}`}>
                          Image
                          <input
                            id={imageInputId}
                            ref={imageInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImage}
                            hidden
                          />
                        </label>
                      </div>
                    </div>

                    {getCurrentWatermark().type === 'text' && (
                      <div className={styles.controlGroup}>
                        <label className={styles.controlLabel}>Text Content</label>
                        <input
                          type="text"
                          value={getCurrentWatermark().content}
                          onChange={(e) => updateWatermark({ content: e.target.value })}
                          placeholder="Enter watermark text"
                          className={styles.textInput}
                          disabled={loading}
                        />
                      </div>
                    )}

                    <div className={styles.controlGroup}>
                      <label className={styles.controlLabel}>Position</label>
                      <select
                        value={getCurrentWatermark().position}
                        onChange={(e) => updateWatermark({ position: e.target.value })}
                        className={styles.select}
                        disabled={loading}
                      >
                        <option value="center">Center</option>
                        <option value="top-left">Top Left</option>
                        <option value="top-right">Top Right</option>
                        <option value="bottom-left">Bottom Left</option>
                        <option value="bottom-right">Bottom Right</option>
                      </select>
                    </div>

                    <div className={styles.controlGroup}>
                      <div className={styles.sliderHeader}>
                        <label className={styles.controlLabel}>Opacity</label>
                        <span className={styles.sliderValue}>{(getCurrentWatermark().opacity * 100).toFixed(0)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0.1"
                        max="1"
                        step="0.1"
                        value={getCurrentWatermark().opacity}
                        onChange={(e) => updateWatermark({ opacity: parseFloat(e.target.value) })}
                        className={styles.slider}
                        disabled={loading}
                      />
                    </div>

                    <div className={styles.controlGroup}>
                      <div className={styles.sliderHeader}>
                        <label className={styles.controlLabel}>Size</label>
                        <span className={styles.sliderValue}>{getCurrentWatermark().size}px</span>
                      </div>
                      <input
                        type="range"
                        min="16"
                        max="100"
                        step="2"
                        value={getCurrentWatermark().size}
                        onChange={(e) => updateWatermark({ size: parseInt(e.target.value) })}
                        className={styles.slider}
                        disabled={loading}
                      />
                    </div>

                    <div className={styles.controlGroup}>
                      <div className={styles.sliderHeader}>
                        <label className={styles.controlLabel}>Rotation</label>
                        <span className={styles.sliderValue}>{getCurrentWatermark().rotation}°</span>
                      </div>
                      <input
                        type="range"
                        min="-90"
                        max="90"
                        step="5"
                        value={getCurrentWatermark().rotation}
                        onChange={(e) => updateWatermark({ rotation: parseInt(e.target.value) })}
                        className={styles.slider}
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          <div className={styles.actionBar}>
            <div className={styles.actionHint}>
              {file ? "Ready to apply watermark to all pages" : "Upload a PDF to start"}
            </div>
            <button
              onClick={applyWatermark}
              disabled={loading || !file || watermarks.length === 0}
              className={styles.button}
            >
              {loading ? "Processing..." : "Apply & Download"}
            </button>
          </div>
        </div>

        <div className={styles.previewSection}>
          <h3>Preview</h3>
          <div className={styles.previewBox}>
            {!file || !previewImage ? (
              <div className={styles.emptyPreview}>
                <div className={styles.previewIcon}>📄</div>
                <p>Upload a PDF to see watermark preview</p>
              </div>
            ) : (
              <div className={styles.previewWrapper}>
                <img
                  src={previewImage}
                  alt="PDF Preview with Watermark"
                  className={styles.previewImage}
                />
              </div>
            )}
          </div>

          <div className={styles.tips}>
            <h4>💡 Tips</h4>
            <ul>
              <li>Add multiple watermarks for different protection levels</li>
              <li>Use lower opacity (20-40%) for subtle watermarks</li>
              <li>Position watermarks diagonally for better visibility</li>
              <li>Text watermarks are best for confidential documents</li>
              <li>Image watermarks work great for logos and branding</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
 