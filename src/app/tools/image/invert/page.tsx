'use client';

import React, { useState, useRef } from 'react';
import ToolInfo from '@/components/ToolInfo';
import styles from './invert.module.css';

export default function InvertColorsImage() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [invertIntensity, setInvertIntensity] = useState(100);
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

  const applyInvertFilter = (imageData: ImageData, intensity: number): ImageData => {
    const data = imageData.data;
    const invertStrength = intensity / 100;

    for (let i = 0; i < data.length; i += 4) {
      // Invert RGB channels
      data[i] = Math.round(data[i] * (1 - invertStrength) + (255 - data[i]) * invertStrength);     // Red
      data[i + 1] = Math.round(data[i + 1] * (1 - invertStrength) + (255 - data[i + 1]) * invertStrength); // Green
      data[i + 2] = Math.round(data[i + 2] * (1 - invertStrength) + (255 - data[i + 2]) * invertStrength); // Blue
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

      // Apply invert filter
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const filteredData = applyInvertFilter(imageData, invertIntensity);
      ctx.putImageData(filteredData, 0, 0);
    };
    img.src = imagePreview;
  };

  React.useEffect(() => {
    updatePreview();
  }, [imagePreview, invertIntensity]);

  const applyInvert = async () => {
    if (!imageFile) {
      setError('Please select an image file');
      return;
    }

    setProcessing(true);
    setError('');

    try {
      // In a real implementation, this would process the canvas and download
      // For now, we'll show a placeholder
      setError('Color inversion requires Canvas API processing. This feature is under development.');

      setTimeout(() => {
        setProcessing(false);
      }, 2000);

    } catch (err) {
      setError('Failed to invert colors in image');
      setProcessing(false);
    }
  };

  const resetFilter = () => {
    setInvertIntensity(0);
  };

  const setPreset = (intensity: number) => {
    setInvertIntensity(intensity);
  };

  return (
    <main className={styles.container}>
      <h1>Invert Colors</h1>
      <p>Create negative or partially inverted color effects</p>

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
            <h3>Invert Intensity</h3>

            <div className={styles.intensityControl}>
              <label htmlFor="intensity">Intensity: {invertIntensity}%</label>
              <input
                id="intensity"
                type="range"
                min="0"
                max="100"
                value={invertIntensity}
                onChange={(e) => setInvertIntensity(parseInt(e.target.value))}
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
                  Subtle
                </button>
                <button
                  className={styles.presetBtn}
                  onClick={() => setPreset(50)}
                >
                  Half
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
                  Full Invert
                </button>
              </div>
            </div>

            <div className={styles.filterInfo}>
              <h4>Invert Effect</h4>
              <div className={styles.infoContent}>
                <div className={styles.infoItem}>
                  <strong>Current Intensity:</strong> {invertIntensity}%
                </div>
                <div className={styles.infoItem}>
                  <strong>Effect:</strong> {invertIntensity === 0 ? 'None' : invertIntensity === 100 ? 'Full Negative' : 'Partial Invert'}
                </div>
                <div className={styles.infoItem}>
                  <strong>Colors:</strong> RGB channels inverted
                </div>
              </div>
            </div>
          </div>

          <div className={styles.actionButtons}>
            <button
              onClick={resetFilter}
              className={styles.resetBtn}
              disabled={invertIntensity === 0}
            >
              Reset Filter
            </button>
            <button
              onClick={applyInvert}
              disabled={!imageFile || processing}
              className={styles.applyBtn}
            >
              {processing ? 'Inverting Colors...' : 'Invert Colors'}
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
                  <span className={styles.afterLabel}>Inverted ({invertIntensity}%)</span>
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
            <h4>Invert Colors Guide</h4>
            <div className={styles.guideContent}>
              <div className={styles.guideItem}>
                <strong>0%:</strong> Original colors, no inversion
              </div>
              <div className={styles.guideItem}>
                <strong>25%:</strong> Subtle color shift
              </div>
              <div className={styles.guideItem}>
                <strong>50%:</strong> Halfway between original and negative
              </div>
              <div className={styles.guideItem}>
                <strong>75%:</strong> Mostly inverted colors
              </div>
              <div className={styles.guideItem}>
                <strong>100%:</strong> Complete color negative effect
              </div>
            </div>
          </div>
        </div>
      </div>

      <ToolInfo
        howItWorks="Upload your image<br>Adjust the invert intensity slider<br>Preview the negative effect in real-time<br>Choose from preset intensities<br>Download the color-inverted image"
        faqs={[
          { title: "What is color inversion?", content: "Color inversion creates a negative effect by flipping RGB values (255-R, 255-G, 255-B)." },
          { title: "Will the original image quality be preserved?", content: "Yes, color inversion preserves image quality and only adjusts color values." },
          { title: "Can I combine inversion with other effects?", content: "Currently inversion is applied alone. Multiple effects may be added in future updates." },
          { title: "What image formats are supported?", content: "JPG, PNG, WebP, GIF, and other common image formats." }
        ]}
        tips={["Use 100% for classic negative film effect<br>Try 50% for a surreal, otherworldly look<br>Works well with high-contrast images<br>Experiment with different intensities for artistic effects"]}
      />
    </main>
  );
}