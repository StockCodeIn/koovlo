'use client';

import { useState, useRef } from 'react';
import ToolInfo from '@/components/ToolInfo';
import styles from './bulkresize.module.css';

export default function BulkResizeImages() {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [resizeMode, setResizeMode] = useState<'dimensions' | 'percentage' | 'fit' | 'fill'>('dimensions');
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [percentage, setPercentage] = useState(50);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resizeModes = [
    { value: 'dimensions', label: 'Fixed Dimensions', description: 'Set exact width and height' },
    { value: 'percentage', label: 'Percentage', description: 'Resize by percentage' },
    { value: 'fit', label: 'Fit to Size', description: 'Fit within dimensions, maintain aspect ratio' },
    { value: 'fill', label: 'Fill to Size', description: 'Fill dimensions, may crop' }
  ];

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
    const newPreviews: string[] = [];
    imageFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        newPreviews.push(e.target?.result as string);
        if (newPreviews.length === imageFiles.length) {
          setPreviews(newPreviews);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const resizeImage = (file: File, mode: string, options: any): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas not supported'));
        return;
      }

      const img = new Image();
      img.onload = () => {
        let newWidth = img.width;
        let newHeight = img.height;

        switch (mode) {
          case 'dimensions':
            newWidth = options.width;
            newHeight = options.height;
            break;
          case 'percentage':
            newWidth = Math.round(img.width * options.percentage / 100);
            newHeight = Math.round(img.height * options.percentage / 100);
            break;
          case 'fit':
            const ratio = Math.min(options.width / img.width, options.height / img.height);
            newWidth = Math.round(img.width * ratio);
            newHeight = Math.round(img.height * ratio);
            break;
          case 'fill':
            newWidth = options.width;
            newHeight = options.height;
            break;
        }

        canvas.width = newWidth;
        canvas.height = newHeight;

        // For fill mode, center the image
        if (mode === 'fill') {
          const scaleX = newWidth / img.width;
          const scaleY = newHeight / img.height;
          const scale = Math.max(scaleX, scaleY);

          const scaledWidth = img.width * scale;
          const scaledHeight = img.height * scale;

          const x = (newWidth - scaledWidth) / 2;
          const y = (newHeight - scaledHeight) / 2;

          ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
        } else {
          ctx.drawImage(img, 0, 0, newWidth, newHeight);
        }

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Resize failed'));
            }
          },
          file.type,
          0.95
        );
      };
      img.onerror = () => reject(new Error('Image loading failed'));
      img.src = URL.createObjectURL(file);
    });
  };

  const downloadFile = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const resizeAllImages = async () => {
    if (files.length === 0) {
      setError('Please select images to resize');
      return;
    }

    setProcessing(true);
    setProgress(0);
    setError('');

    try {
      const resizedFiles: Blob[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const options = resizeMode === 'percentage'
          ? { percentage }
          : { width, height };

        const resized = await resizeImage(file, resizeMode, options);
        resizedFiles.push(resized);
        setProgress(((i + 1) / files.length) * 100);
      }

      // Download all resized images
      for (let i = 0; i < resizedFiles.length; i++) {
        const originalName = files[i].name;
        const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.'));
        const extension = originalName.substring(originalName.lastIndexOf('.'));
        const newFilename = `${nameWithoutExt}_resized${extension}`;
        downloadFile(resizedFiles[i], newFilename);
      }

      setProgress(100);
    } catch (err) {
      setError('Failed to resize images');
    } finally {
      setProcessing(false);
    }
  };

  const clearAll = () => {
    setFiles([]);
    setPreviews([]);
    setProgress(0);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setFiles(newFiles);
    setPreviews(newPreviews);
  };

  const getResizeModeInfo = (mode: string) => {
    return resizeModes.find(m => m.value === mode);
  };

  return (
    <main className={styles.container}>
      <h1>Bulk Image Resizer</h1>
      <p>Resize multiple images to specific dimensions or percentages</p>

      <div className={styles.resizer}>
        <div className={styles.controls}>
          <div className={styles.fileInput}>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className={styles.hiddenInput}
              ref={fileInputRef}
              id="bulk-resize-files"
            />
            <label htmlFor="bulk-resize-files" className={styles.fileLabel}>
              {files.length > 0 ? `${files.length} files selected` : 'Choose Images'}
            </label>
          </div>

          {files.length > 0 && (
            <div className={styles.fileInfo}>
              <p><strong>Files:</strong> {files.length} images selected</p>
              <p><strong>Total Size:</strong> {(files.reduce((sum, file) => sum + file.size, 0) / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          )}

          <div className={styles.settings}>
            <h3>Resize Settings</h3>

            <div className={styles.settingGroup}>
              <label htmlFor="resizeMode">Resize Mode:</label>
              <select
                id="resizeMode"
                value={resizeMode}
                onChange={(e) => setResizeMode(e.target.value as any)}
                className={styles.selectInput}
              >
                {resizeModes.map((mode) => (
                  <option key={mode.value} value={mode.value}>
                    {mode.label} - {mode.description}
                  </option>
                ))}
              </select>
            </div>

            {resizeMode === 'dimensions' && (
              <div className={styles.dimensionsGroup}>
                <div className={styles.dimensionInput}>
                  <label htmlFor="width">Width (px):</label>
                  <input
                    id="width"
                    type="number"
                    min="1"
                    max="5000"
                    value={width}
                    onChange={(e) => setWidth(parseInt(e.target.value) || 1)}
                    className={styles.numberInput}
                  />
                </div>
                <div className={styles.dimensionInput}>
                  <label htmlFor="height">Height (px):</label>
                  <input
                    id="height"
                    type="number"
                    min="1"
                    max="5000"
                    value={height}
                    onChange={(e) => setHeight(parseInt(e.target.value) || 1)}
                    className={styles.numberInput}
                  />
                </div>
              </div>
            )}

            {resizeMode === 'percentage' && (
              <div className={styles.settingGroup}>
                <label htmlFor="percentage">Size: {percentage}%</label>
                <input
                  id="percentage"
                  type="range"
                  min="1"
                  max="200"
                  value={percentage}
                  onChange={(e) => setPercentage(parseInt(e.target.value))}
                  className={styles.slider}
                />
                <div className={styles.percentageHints}>
                  <span>Smaller</span>
                  <span>Larger</span>
                </div>
              </div>
            )}

            {(resizeMode === 'fit' || resizeMode === 'fill') && (
              <div className={styles.dimensionsGroup}>
                <div className={styles.dimensionInput}>
                  <label htmlFor="fitWidth">Max Width (px):</label>
                  <input
                    id="fitWidth"
                    type="number"
                    min="1"
                    max="5000"
                    value={width}
                    onChange={(e) => setWidth(parseInt(e.target.value) || 1)}
                    className={styles.numberInput}
                  />
                </div>
                <div className={styles.dimensionInput}>
                  <label htmlFor="fitHeight">Max Height (px):</label>
                  <input
                    id="fitHeight"
                    type="number"
                    min="1"
                    max="5000"
                    value={height}
                    onChange={(e) => setHeight(parseInt(e.target.value) || 1)}
                    className={styles.numberInput}
                  />
                </div>
              </div>
            )}

            <div className={styles.resizeInfo}>
              <h4>Resize Information</h4>
              <div className={styles.infoContent}>
                <div className={styles.infoItem}>
                  <strong>Mode:</strong> {getResizeModeInfo(resizeMode)?.label}
                </div>
                <div className={styles.infoItem}>
                  <strong>Description:</strong> {getResizeModeInfo(resizeMode)?.description}
                </div>
                <div className={styles.infoItem}>
                  <strong>Output Size:</strong> {
                    resizeMode === 'percentage'
                      ? `${percentage}% of original`
                      : resizeMode === 'dimensions'
                      ? `${width} × ${height} px`
                      : `Fit within ${width} × ${height} px`
                  }
                </div>
              </div>
            </div>
          </div>

          <div className={styles.actions}>
            <button
              onClick={resizeAllImages}
              disabled={files.length === 0 || processing}
              className={styles.resizeBtn}
            >
              {processing ? `Resizing... ${Math.round(progress)}%` : 'Resize All Images'}
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

        <div className={styles.previewSection}>
          <h3>Selected Images ({files.length})</h3>

          {previews.length > 0 ? (
            <div className={styles.imageGrid}>
              {previews.map((preview, index) => (
                <div key={index} className={styles.imageItem}>
                  <div className={styles.imageWrapper}>
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className={styles.previewImage}
                    />
                    <button
                      onClick={() => removeFile(index)}
                      className={styles.removeBtn}
                      title="Remove image"
                    >
                      ✕
                    </button>
                  </div>
                  <div className={styles.imageInfo}>
                    <p className={styles.fileName}>{files[index]?.name}</p>
                    <p className={styles.fileSize}>
                      {(files[index]?.size / 1024).toFixed(1)} KB
                    </p>
                    <p className={styles.newSize}>
                      New: {
                        resizeMode === 'percentage'
                          ? `${percentage}%`
                          : resizeMode === 'dimensions'
                          ? `${width}×${height}px`
                          : `Fit ${width}×${height}px`
                      }
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.noImages}>
              <div className={styles.placeholderIcon}>📐</div>
              <p>Select multiple images to resize</p>
              <p className={styles.hint}>Choose resize mode and dimensions</p>
            </div>
          )}

          {processing && (
            <div className={styles.progressContainer}>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className={styles.progressText}>
                Resizing images... {Math.round(progress)}%
              </p>
            </div>
          )}
        </div>
      </div>

      <ToolInfo
        howItWorks="Select multiple images<br>Choose resize mode and settings<br>Click resize to process all images<br>Download resized versions automatically"
        faqs={[
          { title: "What's the difference between resize modes?", content: "Fixed Dimensions sets exact size, Percentage scales proportionally, Fit maintains aspect ratio within bounds, Fill may crop to fit exactly." },
          { title: "Will aspect ratio be maintained?", content: "Yes for Percentage and Fit modes. Fixed Dimensions and Fill modes may change aspect ratio." },
          { title: "What's the maximum image size?", content: "Up to 5000x5000 pixels. Larger images may cause performance issues." },
          { title: "Can I resize to make images larger?", content: "Yes, use Percentage mode with values over 100% or larger dimensions." }
        ]}
        tips={["Use Fit mode for thumbnails<br>Percentage mode preserves aspect ratio<br>Check results before using in production<br>Consider file size vs quality trade-off"]}
      />
    </main>
  );
}