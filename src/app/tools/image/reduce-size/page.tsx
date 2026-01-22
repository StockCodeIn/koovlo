'use client';

import { useState, useRef } from 'react';
import ToolInfo from '@/components/ToolInfo';
import styles from './reducesize.module.css';

export default function ReduceImageSize() {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [targetSize, setTargetSize] = useState(500); // KB
  const [maxWidth, setMaxWidth] = useState(1920);
  const [maxHeight, setMaxHeight] = useState(1080);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeOptions = [
    { value: 100, label: '100 KB', description: 'Very small, good for thumbnails' },
    { value: 500, label: '500 KB', description: 'Small, good for web images' },
    { value: 1000, label: '1 MB', description: 'Medium, good for social media' },
    { value: 2000, label: '2 MB', description: 'Large, good for high quality' },
    { value: 5000, label: '5 MB', description: 'Very large, minimal compression' }
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

  const reduceImageSize = async (file: File, targetSizeKB: number, maxW: number, maxH: number): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas not supported'));
        return;
      }

      const img = new Image();
      img.onload = () => {
        // Calculate new dimensions while maintaining aspect ratio
        let { width, height } = img;

        // First, resize if larger than max dimensions
        if (width > maxW || height > maxH) {
          const ratio = Math.min(maxW / width, maxH / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        // Binary search for quality that achieves target size
        const targetBytes = targetSizeKB * 1024;
        let minQuality = 0.1;
        let maxQuality = 1.0;
        let bestBlob: Blob | null = null;
        let bestSize = Infinity;

        const tryQuality = (quality: number): Promise<Blob> => {
          return new Promise((res) => {
            canvas.toBlob((blob) => {
              res(blob!);
            }, 'image/jpeg', quality);
          });
        };

        const findOptimalQuality = async (): Promise<Blob> => {
          for (let i = 0; i < 8; i++) { // 8 iterations for good precision
            const quality = (minQuality + maxQuality) / 2;
            const blob = await tryQuality(quality);

            if (blob.size <= targetBytes) {
              minQuality = quality;
              if (blob.size < bestSize) {
                bestSize = blob.size;
                bestBlob = blob;
              }
            } else {
              maxQuality = quality;
            }
          }

          // If we couldn't reach target size, return the smallest we got
          if (!bestBlob) {
            return await tryQuality(minQuality);
          }

          return bestBlob;
        };

        findOptimalQuality().then(resolve).catch(reject);
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

  const reduceAllImages = async () => {
    if (files.length === 0) {
      setError('Please select images to reduce');
      return;
    }

    setProcessing(true);
    setProgress(0);
    setError('');

    try {
      const reducedFiles: Blob[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reduced = await reduceImageSize(file, targetSize, maxWidth, maxHeight);
        reducedFiles.push(reduced);
        setProgress(((i + 1) / files.length) * 100);
      }

      // Download all reduced images
      for (let i = 0; i < reducedFiles.length; i++) {
        const originalName = files[i].name;
        const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.'));
        const newFilename = `${nameWithoutExt}_reduced.jpg`;
        downloadFile(reducedFiles[i], newFilename);
      }

      setProgress(100);
    } catch (err) {
      setError('Failed to reduce image sizes');
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

  const getSizeOptionInfo = (size: number) => {
    return sizeOptions.find(option => option.value === size);
  };

  const estimateReduction = (originalSize: number, targetSize: number) => {
    const reduction = Math.max(0, ((originalSize - targetSize) / originalSize) * 100);
    return Math.round(reduction);
  };

  return (
    <main className={styles.container}>
      <h1>Reduce Image Size</h1>
      <p>Compress images to target file sizes while maintaining quality</p>

      <div className={styles.reducer}>
        <div className={styles.controls}>
          <div className={styles.fileInput}>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className={styles.hiddenInput}
              ref={fileInputRef}
              id="reduce-size-files"
            />
            <label htmlFor="reduce-size-files" className={styles.fileLabel}>
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
            <h3>Size Reduction Settings</h3>

            <div className={styles.settingGroup}>
              <label htmlFor="targetSize">Target Size:</label>
              <select
                id="targetSize"
                value={targetSize}
                onChange={(e) => setTargetSize(parseInt(e.target.value))}
                className={styles.selectInput}
              >
                {sizeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label} - {option.description}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.dimensionsGroup}>
              <div className={styles.dimensionInput}>
                <label htmlFor="maxWidth">Max Width (px):</label>
                <input
                  id="maxWidth"
                  type="number"
                  min="100"
                  max="5000"
                  value={maxWidth}
                  onChange={(e) => setMaxWidth(parseInt(e.target.value) || 1920)}
                  className={styles.numberInput}
                />
              </div>
              <div className={styles.dimensionInput}>
                <label htmlFor="maxHeight">Max Height (px):</label>
                <input
                  id="maxHeight"
                  type="number"
                  min="100"
                  max="5000"
                  value={maxHeight}
                  onChange={(e) => setMaxHeight(parseInt(e.target.value) || 1080)}
                  className={styles.numberInput}
                />
              </div>
            </div>

            <div className={styles.sizeInfo}>
              <h4>Size Information</h4>
              <div className={styles.infoContent}>
                <div className={styles.infoItem}>
                  <strong>Target:</strong> {getSizeOptionInfo(targetSize)?.label}
                </div>
                <div className={styles.infoItem}>
                  <strong>Max Dimensions:</strong> {maxWidth} × {maxHeight}px
                </div>
                <div className={styles.infoItem}>
                  <strong>Format:</strong> JPEG (optimized)
                </div>
                <div className={styles.infoItem}>
                  <strong>Method:</strong> Quality optimization
                </div>
              </div>
            </div>

            <div className={styles.tips}>
              <h4>💡 Tips for Best Results:</h4>
              <ul>
                <li>Larger target sizes preserve more quality</li>
                <li>Photos compress better than graphics</li>
                <li>Very small targets may lose significant quality</li>
                <li>Check results before using in production</li>
              </ul>
            </div>
          </div>

          <div className={styles.actions}>
            <button
              onClick={reduceAllImages}
              disabled={files.length === 0 || processing}
              className={styles.reduceBtn}
            >
              {processing ? `Reducing... ${Math.round(progress)}%` : 'Reduce Image Sizes'}
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
                    <p className={styles.originalSize}>
                      Original: {(files[index]?.size / 1024).toFixed(1)} KB
                    </p>
                    <p className={styles.targetSize}>
                      Target: ≤ {targetSize} KB
                    </p>
                    <p className={styles.estimatedReduction}>
                      Est. reduction: {estimateReduction(files[index]?.size / 1024, targetSize)}%
                    </p>
                    <p className={styles.outputName}>
                      {files[index]?.name.replace(/\.[^/.]+$/, '')}_reduced.jpg
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.noImages}>
              <div className={styles.placeholderIcon}>🗜️</div>
              <p>Select images to reduce file sizes</p>
              <p className={styles.hint}>Choose target size and maximum dimensions</p>
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
                Reducing image sizes... {Math.round(progress)}%
              </p>
            </div>
          )}
        </div>
      </div>

      <ToolInfo
        howItWorks="Select multiple images<br>Set target file size and max dimensions<br>Click reduce to optimize all images<br>Download compressed versions automatically"
        faqs={[
          { title: "How does size reduction work?", content: "Images are resized if too large, then JPEG quality is optimized to meet target file size while preserving maximum quality." },
          { title: "Will image dimensions change?", content: "Only if the image exceeds maximum dimensions. Otherwise, dimensions are preserved and only compression is applied." },
          { title: "What's the best target size?", content: "500KB-1MB for web images, 100KB for thumbnails, 2MB+ for high-quality images." },
          { title: "Can I reduce PNG or other formats?", content: "Images are converted to JPEG for optimal compression. Original format is lost but quality is preserved." }
        ]}
        tips={["Start with larger target sizes<br>Photos compress better than graphics<br>Test different sizes for your use case<br>Always check final quality"]}
      />
    </main>
  );
}