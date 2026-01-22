'use client';

import { useState, useRef } from 'react';
import ToolInfo from '@/components/ToolInfo';
import styles from './bulkcompress.module.css';

export default function BulkCompressImages() {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [compressionLevel, setCompressionLevel] = useState(70);
  const [format, setFormat] = useState<'jpeg' | 'png' | 'webp'>('jpeg');
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
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

  const compressImage = (file: File, quality: number): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas not supported'));
        return;
      }

      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Compression failed'));
            }
          },
          `image/${format}`,
          quality / 100
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

  const compressAllImages = async () => {
    if (files.length === 0) {
      setError('Please select images to compress');
      return;
    }

    setProcessing(true);
    setProgress(0);
    setError('');

    try {
      const compressedFiles: Blob[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const compressed = await compressImage(file, compressionLevel);
        compressedFiles.push(compressed);
        setProgress(((i + 1) / files.length) * 100);
      }

      // Download all compressed images
      for (let i = 0; i < compressedFiles.length; i++) {
        const originalName = files[i].name;
        const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.'));
        const newFilename = `${nameWithoutExt}_compressed.${format}`;
        downloadFile(compressedFiles[i], newFilename);
      }

      setProgress(100);
    } catch (err) {
      setError('Failed to compress images');
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

  return (
    <main className={styles.container}>
      <h1>Bulk Image Compression</h1>
      <p>Compress multiple images at once with custom quality settings</p>

      <div className={styles.compressor}>
        <div className={styles.controls}>
          <div className={styles.fileInput}>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className={styles.hiddenInput}
              ref={fileInputRef}
              id="bulk-files"
            />
            <label htmlFor="bulk-files" className={styles.fileLabel}>
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
            <h3>Compression Settings</h3>

            <div className={styles.settingGroup}>
              <label htmlFor="quality">Quality: {compressionLevel}%</label>
              <input
                id="quality"
                type="range"
                min="10"
                max="100"
                value={compressionLevel}
                onChange={(e) => setCompressionLevel(parseInt(e.target.value))}
                className={styles.slider}
              />
              <div className={styles.qualityHints}>
                <span>Smaller file</span>
                <span>Better quality</span>
              </div>
            </div>

            <div className={styles.settingGroup}>
              <label htmlFor="format">Output Format:</label>
              <select
                id="format"
                value={format}
                onChange={(e) => setFormat(e.target.value as any)}
                className={styles.selectInput}
              >
                <option value="jpeg">JPEG (Best for photos)</option>
                <option value="png">PNG (Best for graphics)</option>
                <option value="webp">WebP (Modern format)</option>
              </select>
            </div>
          </div>

          <div className={styles.actions}>
            <button
              onClick={compressAllImages}
              disabled={files.length === 0 || processing}
              className={styles.compressBtn}
            >
              {processing ? `Compressing... ${Math.round(progress)}%` : 'Compress All Images'}
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
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.noImages}>
              <div className={styles.placeholderIcon}>🖼️</div>
              <p>Select multiple images to compress</p>
              <p className={styles.hint}>You can select multiple files at once</p>
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
                Processing images... {Math.round(progress)}%
              </p>
            </div>
          )}
        </div>
      </div>

      <ToolInfo
        howItWorks="Select multiple images<br>Choose compression quality and output format<br>Click compress to process all images<br>Download compressed versions automatically"
        faqs={[
          { title: "How much compression can I achieve?", content: "Depends on quality setting and image type. Lower quality = smaller files but may lose detail." },
          { title: "Which format should I choose?", content: "JPEG for photos, PNG for graphics with transparency, WebP for modern browsers." },
          { title: "Is there a file size limit?", content: "No limit, but very large files may take longer to process." },
          { title: "Will image dimensions change?", content: "No, compression only affects file size, not image dimensions." }
        ]}
        tips={["Start with 70-80% quality for good balance<br>Use WebP for smallest file sizes<br>Process similar images together<br>Check results before using in production"]}
      />
    </main>
  );
}