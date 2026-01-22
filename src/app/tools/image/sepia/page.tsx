'use client';

import React, { useState, useRef } from 'react';
import ToolInfo from '@/components/ToolInfo';
import styles from './sepia.module.css';

export default function SepiaFilterImage() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [sepiaIntensity, setSepiaIntensity] = useState(100);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const originalCanvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      setImageFile(selectedFile);

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
      setError('');
    }
  };

  const applySepiaFilter = (imageData: ImageData, intensity: number): ImageData => {
    const data = imageData.data;
    const sepiaStrength = intensity / 100;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // Sepia formula
      const sepiaR = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189));
      const sepiaG = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168));
      const sepiaB = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131));

      // Blend with original based on intensity
      data[i] = Math.round(r * (1 - sepiaStrength) + sepiaR * sepiaStrength);
      data[i + 1] = Math.round(g * (1 - sepiaStrength) + sepiaG * sepiaStrength);
      data[i + 2] = Math.round(b * (1 - sepiaStrength) + sepiaB * sepiaStrength);
      // Alpha channel remains unchanged
    }

    return imageData;
  };

  const updatePreview = () => {
    const canvas = canvasRef.current;
    const originalCanvas = originalCanvasRef.current;
    if (!canvas || !originalCanvas || !imagePreview) return;

    const ctx = canvas.getContext('2d');
    const originalCtx = originalCanvas.getContext('2d');
    if (!ctx || !originalCtx) return;

    const img = new Image();
    img.onload = () => {
      // Set canvas dimensions
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      originalCanvas.width = img.naturalWidth;
      originalCanvas.height = img.naturalHeight;

      // Draw original image
      originalCtx.drawImage(img, 0, 0);

      // Draw filtered image
      ctx.drawImage(img, 0, 0);

      // Apply sepia filter
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const filteredData = applySepiaFilter(imageData, sepiaIntensity);
      ctx.putImageData(filteredData, 0, 0);
    };
    img.src = imagePreview;
  };

  React.useEffect(() => {
    updatePreview();
  }, [imagePreview, sepiaIntensity]);

  const applySepia = async () => {
    if (!imageFile) {
      setError('Please select an image file');
      return;
    }

    setProcessing(true);
    setError('');

    try {
      // In a real implementation, this would process the canvas and download
      // For now, we'll show a placeholder
      setError('Sepia filter requires Canvas API processing. This feature is under development.');

      setTimeout(() => {
        setProcessing(false);
      }, 2000);

    } catch (err) {
      setError('Failed to apply sepia filter to image');
      setProcessing(false);
    }
  };

  const resetFilter = () => {
    setSepiaIntensity(0);
  };

  const setPreset = (intensity: number) => {
    setSepiaIntensity(intensity);
  };

  return (
    <main className={styles.container}>
      <h1>Sepia Filter</h1>
      <p>Apply vintage sepia tone effects to your images</p>

      <div className={styles.editor}>
        <div className={styles.controls}>
          <div className={styles.fileInput}>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className={styles.hiddenInput}
              id="image-file"
            />
            <label htmlFor="image-file" className={styles.fileLabel}>
              {imageFile ? imageFile.name : 'Choose Image File'}
            </label>
          </div>

          {imageFile && (
            <div className={styles.fileInfo}>
              <p><strong>File:</strong> {imageFile.name} ({(imageFile.size / 1024).toFixed(2)} KB)</p>
            </div>
          )}

          <div className={styles.filterControls}>
            <h3>Sepia Intensity</h3>

            <div className={styles.intensityControl}>
              <label htmlFor="intensity">Intensity: {sepiaIntensity}%</label>
              <input
                id="intensity"
                type="range"
                min="0"
                max="100"
                value={sepiaIntensity}
                onChange={(e) => setSepiaIntensity(parseInt(e.target.value))}
                className={styles.slider}
              />
            </div>

            <div className={styles.presets}>
              <h4>Quick Presets</h4>
              <div className={styles.presetButtons}>
                <button
                  className={styles.presetBtn}
                  onClick={() => setPreset(0)}
                >
                  None
                </button>
                <button
                  className={styles.presetBtn}
                  onClick={() => setPreset(25)}
                >
                  Light
                </button>
                <button
                  className={styles.presetBtn}
                  onClick={() => setPreset(50)}
                >
                  Medium
                </button>
                <button
                  className={styles.presetBtn}
                  onClick={() => setPreset(75)}
                >
                  Strong
                </button>
                <button
                  className={styles.presetBtn}
                  onClick={() => setPreset(100)}
                >
                  Vintage
                </button>
              </div>
            </div>

            <div className={styles.filterInfo}>
              <h4>Sepia Effect</h4>
              <div className={styles.infoContent}>
                <div className={styles.infoItem}>
                  <strong>Current Intensity:</strong> {sepiaIntensity}%
                </div>
                <div className={styles.infoItem}>
                  <strong>Effect:</strong> {sepiaIntensity === 0 ? 'None' : sepiaIntensity < 30 ? 'Subtle' : sepiaIntensity < 70 ? 'Moderate' : 'Strong'}
                </div>
                <div className={styles.infoItem}>
                  <strong>Style:</strong> Classic sepia toning
                </div>
              </div>
            </div>
          </div>

          <div className={styles.actionButtons}>
            <button
              onClick={resetFilter}
              className={styles.resetBtn}
              disabled={sepiaIntensity === 0}
            >
              Reset Filter
            </button>
            <button
              onClick={applySepia}
              disabled={!imageFile || processing}
              className={styles.applyBtn}
            >
              {processing ? 'Applying Filter...' : 'Apply Sepia Filter'}
            </button>
          </div>

          {error && <div className={styles.error}>{error}</div>}
        </div>

        <div className={styles.previewSection}>
          <h3>Preview</h3>

          <div className={styles.previewContainer}>
            {imagePreview ? (
              <>
                <div className={styles.canvasWrapper}>
                  <canvas
                    ref={originalCanvasRef}
                    className={styles.originalCanvas}
                    style={{ display: 'none' }}
                  />
                  <canvas
                    ref={canvasRef}
                    className={styles.canvas}
                  />
                </div>

                <div className={styles.previewLabels}>
                  <span className={styles.beforeLabel}>Original</span>
                  <span className={styles.afterLabel}>Sepia ({sepiaIntensity}%)</span>
                </div>
              </>
            ) : (
              <div className={styles.noImage}>
                <div className={styles.placeholderIcon}>🖼️</div>
                <p>Select an image to see preview</p>
              </div>
            )}
          </div>

          <div className={styles.filterGuide}>
            <h4>Sepia Filter Guide</h4>
            <div className={styles.guideContent}>
              <div className={styles.guideItem}>
                <strong>0%:</strong> Original image, no sepia effect
              </div>
              <div className={styles.guideItem}>
                <strong>25%:</strong> Subtle vintage warmth
              </div>
              <div className={styles.guideItem}>
                <strong>50%:</strong> Classic sepia tone
              </div>
              <div className={styles.guideItem}>
                <strong>75%:</strong> Strong vintage effect
              </div>
              <div className={styles.guideItem}>
                <strong>100%:</strong> Maximum sepia intensity
              </div>
            </div>
          </div>
        </div>
      </div>

      <ToolInfo
        howItWorks="Upload your image<br>Adjust the sepia intensity slider<br>Preview the effect in real-time<br>Choose from preset intensities<br>Download the sepia-toned image"
        faqs={[
          { title: "What is sepia toning?", content: "Sepia is a reddish-brown monochrome image that gives photos a vintage, aged appearance." },
          { title: "Will the original image quality be preserved?", content: "Yes, the sepia filter preserves image quality and only adjusts color tones." },
          { title: "Can I combine sepia with other effects?", content: "Currently sepia is applied alone. Multiple effects may be added in future updates." },
          { title: "What image formats are supported?", content: "JPG, PNG, WebP, GIF, and other common image formats." }
        ]}
        tips={["Start with 50% intensity for classic sepia look<br>Use lower intensities for subtle vintage effects<br>Sepia works best on photographs and portraits<br>Experiment with different intensities to find the right look"]}
      />
    </main>
  );
}