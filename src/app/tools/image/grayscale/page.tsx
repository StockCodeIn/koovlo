'use client';

import { useState, useRef } from 'react';
import ToolInfo from '@/components/ToolInfo';
import styles from './grayscale.module.css';

export default function ImageGrayscale() {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
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

  const convertToGrayscale = (file: File, previewUrl: string): Promise<Blob> => {
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

        // Draw the image
        ctx.drawImage(img, 0, 0);

        // Get image data and convert to grayscale
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Apply grayscale conversion using luminance formula
        for (let i = 0; i < data.length; i += 4) {
          const gray = Math.round(data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114);
          data[i] = gray;     // Red
          data[i + 1] = gray; // Green
          data[i + 2] = gray; // Blue
          // Alpha channel remains unchanged
        }

        ctx.putImageData(imageData, 0, 0);

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
      setError('Please select images to convert');
      return;
    }

    setProcessing(true);
    setProgress(0);
    setError('');
    setProcessedCount(0);

    try {
      const processedBlobs: Blob[] = [];

      for (let i = 0; i < files.length; i++) {
        const blob = await convertToGrayscale(files[i], previews[i]);
        processedBlobs.push(blob);
        setProcessedCount(i + 1);
        setProgress(((i + 1) / files.length) * 100);
      }

      // Download all processed images
      for (let i = 0; i < processedBlobs.length; i++) {
        const url = URL.createObjectURL(processedBlobs[i]);
        const a = document.createElement('a');
        a.href = url;
        a.download = `grayscale-${files[i].name}`;
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

  const getStats = () => {
    if (files.length === 0) return null;

    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    return {
      totalFiles: files.length,
      totalSize: (totalSize / 1024 / 1024).toFixed(2)
    };
  };

  const stats = getStats();

  return (
    <main className={styles.container}>
      <h1>Image Grayscale Converter</h1>
      <p>Convert color images to grayscale (black and white)</p>

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
              id="grayscale-files"
            />
            <label htmlFor="grayscale-files" className={styles.fileLabel}>
              {files.length > 0 ? `${files.length} images selected` : 'Choose Images to Convert'}
            </label>
          </div>

          {stats && (
            <div className={styles.fileInfo}>
              <p><strong>Images:</strong> {stats.totalFiles} files selected</p>
              <p><strong>Total Size:</strong> {stats.totalSize} MB</p>
            </div>
          )}

          <div className={styles.conversionInfo}>
            <h3>Grayscale Conversion</h3>
            <div className={styles.infoContent}>
              <div className={styles.infoItem}>
                <strong>Method:</strong> Luminance formula (Rec. 709)
              </div>
              <div className={styles.infoItem}>
                <strong>Formula:</strong> Gray = 0.299×R + 0.587×G + 0.114×B
              </div>
              <div className={styles.infoItem}>
                <strong>Quality:</strong> Preserves original dimensions and format
              </div>
              <div className={styles.infoItem}>
                <strong>Colors:</strong> Reduced to 256 shades of gray
              </div>
            </div>
          </div>

          <div className={styles.actions}>
            <button
              onClick={processImages}
              disabled={files.length === 0 || processing}
              className={styles.processBtn}
            >
              {processing ? `Converting... ${Math.round(progress)}%` : 'Convert to Grayscale & Download'}
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
            <p>Converting {processedCount} of {files.length} images to grayscale...</p>
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
                    style={{ filter: 'grayscale(100%)' }}
                  />
                  <div className={styles.previewOverlay}>
                    <span className={styles.previewLabel}>
                      {files[index]?.name}
                    </span>
                    <span className={styles.conversionIndicator}>
                      Grayscale
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.noPreviews}>
              <div className={styles.placeholderIcon}>⚫</div>
              <p>Select images to see grayscale previews</p>
              <p className={styles.hint}>Images will be converted using professional luminance formula</p>
            </div>
          )}
        </div>
      </div>

      <ToolInfo
        howItWorks="Select multiple images<br>Preview grayscale conversion in real-time<br>Click process to convert all images and download"
        faqs={[
          { title: "How does grayscale conversion work?", content: "Uses luminance formula to calculate brightness values, converting RGB colors to shades of gray." },
          { title: "Is the conversion reversible?", content: "No, color information is permanently removed. Always keep original copies." },
          { title: "Does file size change?", content: "File size remains similar, but some formats may compress better in grayscale." },
          { title: "What image formats are supported?", content: "All common formats: JPG, PNG, WebP, GIF, BMP, etc." }
        ]}
        tips={["Perfect for documents and text images", "Reduces file size for some formats", "Creates classic black and white effect", "Use for artistic or technical purposes"]}
      />
    </main>
  );
}