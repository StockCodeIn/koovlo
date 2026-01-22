'use client';

import { useState, useRef } from 'react';
import ToolInfo from '@/components/ToolInfo';
import styles from './blur.module.css';

export default function ImageBlur() {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [blurAmount, setBlurAmount] = useState(5);
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

  const applyBlurToImage = (file: File, previewUrl: string): Promise<Blob> => {
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

        // Apply blur filter
        ctx.filter = `blur(${blurAmount}px)`;
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
      setError('Please select images to blur');
      return;
    }

    setProcessing(true);
    setProgress(0);
    setError('');
    setProcessedCount(0);

    try {
      const processedBlobs: Blob[] = [];

      for (let i = 0; i < files.length; i++) {
        const blob = await applyBlurToImage(files[i], previews[i]);
        processedBlobs.push(blob);
        setProcessedCount(i + 1);
        setProgress(((i + 1) / files.length) * 100);
      }

      // Download all processed images
      for (let i = 0; i < processedBlobs.length; i++) {
        const url = URL.createObjectURL(processedBlobs[i]);
        const a = document.createElement('a');
        a.href = url;
        a.download = `blurred-${files[i].name}`;
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

  const clearAll = () => {
    setFiles([]);
    setPreviews([]);
    setProgress(0);
    setProcessedCount(0);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getBlurDescription = () => {
    if (blurAmount <= 2) return 'Subtle blur for softening edges';
    if (blurAmount <= 5) return 'Moderate blur for artistic effects';
    if (blurAmount <= 10) return 'Strong blur for background effects';
    if (blurAmount <= 20) return 'Heavy blur for privacy protection';
    return 'Extreme blur for maximum privacy';
  };

  return (
    <main className={styles.container}>
      <h1>Image Blur Tool</h1>
      <p>Add blur effects to your images with adjustable intensity</p>

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
              id="blur-files"
            />
            <label htmlFor="blur-files" className={styles.fileLabel}>
              {files.length > 0 ? `${files.length} images selected` : 'Choose Images to Blur'}
            </label>
          </div>

          {files.length > 0 && (
            <div className={styles.fileInfo}>
              <p><strong>Images:</strong> {files.length} files selected</p>
              <p><strong>Total Size:</strong> {(files.reduce((sum, file) => sum + file.size, 0) / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          )}

          <div className={styles.blurSettings}>
            <h3>Blur Settings</h3>

            <div className={styles.sliderGroup}>
              <label htmlFor="blur-amount">
                Blur Amount: <strong>{blurAmount}px</strong>
              </label>
              <input
                id="blur-amount"
                type="range"
                min="1"
                max="50"
                value={blurAmount}
                onChange={(e) => setBlurAmount(parseInt(e.target.value))}
                className={styles.slider}
              />
              <div className={styles.sliderLabels}>
                <span>Subtle</span>
                <span>Extreme</span>
              </div>
              <p className={styles.blurDescription}>{getBlurDescription()}</p>
            </div>

            <div className={styles.presets}>
              <span className={styles.presetLabel}>Quick Presets:</span>
              <div className={styles.presetButtons}>
                <button
                  onClick={() => setBlurAmount(2)}
                  className={styles.presetBtn}
                  disabled={processing}
                >
                  Subtle
                </button>
                <button
                  onClick={() => setBlurAmount(5)}
                  className={styles.presetBtn}
                  disabled={processing}
                >
                  Moderate
                </button>
                <button
                  onClick={() => setBlurAmount(15)}
                  className={styles.presetBtn}
                  disabled={processing}
                >
                  Strong
                </button>
                <button
                  onClick={() => setBlurAmount(30)}
                  className={styles.presetBtn}
                  disabled={processing}
                >
                  Heavy
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
              {processing ? `Processing... ${Math.round(progress)}%` : 'Apply Blur & Download'}
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
                  />
                  <div className={styles.previewOverlay}>
                    <span className={styles.previewLabel}>
                      {files[index]?.name}
                    </span>
                    <span className={styles.blurIndicator}>
                      {blurAmount}px blur
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.noPreviews}>
              <div className={styles.placeholderIcon}>🖼️</div>
              <p>Select images to see previews with blur effect</p>
            </div>
          )}
        </div>
      </div>

      <ToolInfo
        howItWorks="Select multiple images<br>Adjust blur intensity with slider or presets<br>Click process to apply blur and download all images"
        faqs={[
          { title: "What is blur measured in?", content: "Pixels (px). Higher values create more blur effect." },
          { title: "Can I undo blur effects?", content: "No, blur is a destructive effect. Always keep original copies." },
          { title: "What's the maximum blur?", content: "50px, which creates extreme blur for privacy protection." },
          { title: "Does blur reduce file size?", content: "No, blur maintains original file size and format." }
        ]}
        tips={["Use 1-2px for subtle softening", "5-10px for artistic background blur", "15-30px for privacy protection", "Always backup original images"]}
      />
    </main>
  );
}