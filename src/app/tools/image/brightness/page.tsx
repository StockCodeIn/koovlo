'use client';

import { useState, useRef } from 'react';
import ToolInfo from '@/components/ToolInfo';
import styles from './brightness.module.css';

export default function ImageBrightness() {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [processedCount, setProcessedCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    if (selectedFiles.length === 0) return;

    // Filter for image files only
    const imageFiles = selectedFiles.filter(file =>
      file.type.startsWith('image/')
    );

    if (imageFiles.length !== selectedFiles.length) {
      setError('Some files were skipped because they are not images');
    }

    setFiles(imageFiles);
    setError('');

    // Create previews
    const newPreviews = imageFiles.map(file => URL.createObjectURL(file));
    setPreviews(newPreviews);
  };

  const adjustImage = (file: File, previewUrl: string): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('Canvas not supported'));
          return;
        }

        canvas.width = img.width;
        canvas.height = img.height;

        // Apply brightness, contrast, and saturation filters
        ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
        ctx.drawImage(img, 0, 0);

        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create blob'));
          }
        }, file.type);
      };

      img.onerror = () => reject(new Error('Image loading failed'));
      img.src = previewUrl;
    });
  };

  const processImages = async () => {
    if (files.length === 0) {
      setError('Please select images to adjust');
      return;
    }

    setProcessing(true);
    setProgress(0);
    setError('');
    setProcessedCount(0);

    try {
      const processedBlobs: Blob[] = [];

      for (let i = 0; i < files.length; i++) {
        const blob = await adjustImage(files[i], previews[i]);
        processedBlobs.push(blob);
        setProcessedCount(i + 1);
        setProgress(((i + 1) / files.length) * 100);
      }

      // Download all processed images
      for (let i = 0; i < processedBlobs.length; i++) {
        const url = URL.createObjectURL(processedBlobs[i]);
        const a = document.createElement('a');
        a.href = url;
        a.download = `adjusted-${files[i].name}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }

      setProgress(100);
    } catch (err) {
      setError('Failed to process images');
    } finally {
      setProcessing(false);
    }
  };

  const resetAdjustments = () => {
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
  };

  const clearAll = () => {
    setFiles([]);
    setPreviews([]);
    setProgress(0);
    setProcessedCount(0);
    setError('');
    resetAdjustments();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getAdjustmentDescription = () => {
    const changes = [];
    if (brightness !== 100) changes.push(`Brightness: ${brightness}%`);
    if (contrast !== 100) changes.push(`Contrast: ${contrast}%`);
    if (saturation !== 100) changes.push(`Saturation: ${saturation}%`);

    return changes.length > 0 ? changes.join(', ') : 'No adjustments applied';
  };

  return (
    <main className={styles.container}>
      <h1>Image Brightness & Contrast</h1>
      <p>Adjust brightness, contrast, and saturation of your images</p>

      <div className={styles.converter}>
        <div className={styles.controls}>
          <div className={styles.fileInput}>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className={styles.hiddenInput}
              ref={fileInputRef}
              id="brightness-files"
            />
            <label htmlFor="brightness-files" className={styles.fileLabel}>
              {files.length > 0 ? `${files.length} images selected` : 'Choose Images to Adjust'}
            </label>
          </div>

          {files.length > 0 && (
            <div className={styles.fileInfo}>
              <p><strong>Images:</strong> {files.length} files selected</p>
              <p><strong>Total Size:</strong> {(files.reduce((sum, file) => sum + file.size, 0) / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          )}

          <div className={styles.adjustmentSettings}>
            <h3>Adjustment Settings</h3>

            <div className={styles.sliderGroup}>
              <label htmlFor="brightness-slider">
                Brightness: <strong>{brightness}%</strong>
              </label>
              <input
                id="brightness-slider"
                type="range"
                min="0"
                max="200"
                value={brightness}
                onChange={(e) => setBrightness(parseInt(e.target.value))}
                className={styles.slider}
              />
              <div className={styles.sliderLabels}>
                <span>Dark</span>
                <span>Normal</span>
                <span>Bright</span>
              </div>
            </div>

            <div className={styles.sliderGroup}>
              <label htmlFor="contrast-slider">
                Contrast: <strong>{contrast}%</strong>
              </label>
              <input
                id="contrast-slider"
                type="range"
                min="0"
                max="200"
                value={contrast}
                onChange={(e) => setContrast(parseInt(e.target.value))}
                className={styles.slider}
              />
              <div className={styles.sliderLabels}>
                <span>Flat</span>
                <span>Normal</span>
                <span>Vivid</span>
              </div>
            </div>

            <div className={styles.sliderGroup}>
              <label htmlFor="saturation-slider">
                Saturation: <strong>{saturation}%</strong>
              </label>
              <input
                id="saturation-slider"
                type="range"
                min="0"
                max="200"
                value={saturation}
                onChange={(e) => setSaturation(parseInt(e.target.value))}
                className={styles.slider}
              />
              <div className={styles.sliderLabels}>
                <span>Gray</span>
                <span>Normal</span>
                <span>Vivid</span>
              </div>
            </div>

            <div className={styles.adjustmentInfo}>
              <p className={styles.adjustmentDescription}>{getAdjustmentDescription()}</p>
            </div>

            <div className={styles.presets}>
              <span className={styles.presetLabel}>Quick Presets:</span>
              <div className={styles.presetButtons}>
                <button
                  onClick={() => { setBrightness(120); setContrast(110); setSaturation(105); }}
                  className={styles.presetBtn}
                  disabled={processing}
                >
                  Bright & Vivid
                </button>
                <button
                  onClick={() => { setBrightness(90); setContrast(120); setSaturation(80); }}
                  className={styles.presetBtn}
                  disabled={processing}
                >
                  High Contrast
                </button>
                <button
                  onClick={() => { setBrightness(110); setContrast(90); setSaturation(120); }}
                  className={styles.presetBtn}
                  disabled={processing}
                >
                  Warm & Saturated
                </button>
                <button
                  onClick={resetAdjustments}
                  className={styles.resetBtn}
                  disabled={processing}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          <div className={styles.actions}>
            <button
              onClick={processImages}
              disabled={files.length === 0 || processing}
              className={styles.processBtn}
            >
              {processing ? `Processing... ${Math.round(progress)}%` : 'Apply Adjustments & Download'}
            </button>
            <button
              onClick={clearAll}
              disabled={processing}
              className={styles.clearBtn}
            >
              Clear All
            </button>
          </div>

          {error && <div className={styles.error}>{error}</div>}
        </div>

        {processing && (
          <div className={styles.processingStatus}>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p>Processing {processedCount} of {files.length} images...</p>
          </div>
        )}

        <div className={styles.previews}>
          <h3>Image Previews</h3>

          {previews.length > 0 ? (
            <div className={styles.previewGrid}>
              {previews.map((preview, index) => (
                <div key={index} className={styles.previewItem}>
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className={styles.previewImage}
                    style={{
                      filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`
                    }}
                  />
                  <div className={styles.previewOverlay}>
                    <span className={styles.previewLabel}>
                      {files[index]?.name}
                    </span>
                    <span className={styles.adjustmentIndicator}>
                      {brightness !== 100 || contrast !== 100 || saturation !== 100 ? 'Adjusted' : 'Original'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.noPreviews}>
              <div className={styles.placeholderIcon}>🖼️</div>
              <p>Select images to see previews with adjustments</p>
              <p className={styles.hint}>Adjust brightness, contrast, and saturation using the sliders above</p>
            </div>
          )}
        </div>
      </div>

      <ToolInfo
        howItWorks="Select multiple images<br>Adjust brightness, contrast, and saturation sliders<br>Preview changes in real-time<br>Click process to apply adjustments and download all images"
        faqs={[
          { title: "What do the percentages mean?", content: "100% = original level, 0% = minimum, 200% = maximum effect." },
          { title: "Can I reset adjustments?", content: "Use the Reset button or set all sliders to 100%." },
          { title: "Does this affect file size?", content: "No, adjustments maintain original file size and format." },
          { title: "What's the difference between brightness and contrast?", content: "Brightness affects overall light level, contrast affects difference between light and dark areas." }
        ]}
        tips={["Use presets for quick adjustments", "Increase contrast for more vivid colors", "Adjust brightness for better visibility", "Preview changes before processing"]}
      />
    </main>
  );
}