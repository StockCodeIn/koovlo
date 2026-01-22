'use client';

import { useState, useRef } from 'react';
import ToolInfo from '@/components/ToolInfo';
import styles from './bulkconvert.module.css';

export default function BulkConvertImages() {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [targetFormat, setTargetFormat] = useState<'jpeg' | 'png' | 'webp' | 'bmp' | 'tiff'>('jpeg');
  const [quality, setQuality] = useState(90);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formats = [
    { value: 'jpeg', label: 'JPEG', description: 'Best for photos' },
    { value: 'png', label: 'PNG', description: 'Best for graphics, supports transparency' },
    { value: 'webp', label: 'WebP', description: 'Modern format, smaller files' },
    { value: 'bmp', label: 'BMP', description: 'Uncompressed, large files' },
    { value: 'tiff', label: 'TIFF', description: 'High quality, large files' }
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

  const convertImage = (file: File, format: string, quality: number): Promise<Blob> => {
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
              reject(new Error('Conversion failed'));
            }
          },
          `image/${format}`,
          format === 'png' || format === 'bmp' || format === 'tiff' ? undefined : quality / 100
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

  const convertAllImages = async () => {
    if (files.length === 0) {
      setError('Please select images to convert');
      return;
    }

    setProcessing(true);
    setProgress(0);
    setError('');

    try {
      const convertedFiles: Blob[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const converted = await convertImage(file, targetFormat, quality);
        convertedFiles.push(converted);
        setProgress(((i + 1) / files.length) * 100);
      }

      // Download all converted images
      for (let i = 0; i < convertedFiles.length; i++) {
        const originalName = files[i].name;
        const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.'));
        const newFilename = `${nameWithoutExt}_converted.${targetFormat}`;
        downloadFile(convertedFiles[i], newFilename);
      }

      setProgress(100);
    } catch (err) {
      setError('Failed to convert images');
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

  const getFormatInfo = (format: string) => {
    return formats.find(f => f.value === format);
  };

  return (
    <main className={styles.container}>
      <h1>Bulk Image Converter</h1>
      <p>Convert multiple images to different formats at once</p>

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
              id="bulk-convert-files"
            />
            <label htmlFor="bulk-convert-files" className={styles.fileLabel}>
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
            <h3>Conversion Settings</h3>

            <div className={styles.settingGroup}>
              <label htmlFor="format">Target Format:</label>
              <select
                id="format"
                value={targetFormat}
                onChange={(e) => setTargetFormat(e.target.value as any)}
                className={styles.selectInput}
              >
                {formats.map((format) => (
                  <option key={format.value} value={format.value}>
                    {format.label} - {format.description}
                  </option>
                ))}
              </select>
            </div>

            {(targetFormat === 'jpeg' || targetFormat === 'webp') && (
              <div className={styles.settingGroup}>
                <label htmlFor="quality">Quality: {quality}%</label>
                <input
                  id="quality"
                  type="range"
                  min="10"
                  max="100"
                  value={quality}
                  onChange={(e) => setQuality(parseInt(e.target.value))}
                  className={styles.slider}
                />
                <div className={styles.qualityHints}>
                  <span>Smaller file</span>
                  <span>Better quality</span>
                </div>
              </div>
            )}

            <div className={styles.formatInfo}>
              <h4>Format Information</h4>
              <div className={styles.infoContent}>
                <div className={styles.infoItem}>
                  <strong>Selected:</strong> {getFormatInfo(targetFormat)?.label}
                </div>
                <div className={styles.infoItem}>
                  <strong>Use Case:</strong> {getFormatInfo(targetFormat)?.description}
                </div>
                <div className={styles.infoItem}>
                  <strong>Compression:</strong> {
                    targetFormat === 'png' || targetFormat === 'bmp' || targetFormat === 'tiff'
                      ? 'Lossless' : 'Lossy'
                  }
                </div>
              </div>
            </div>
          </div>

          <div className={styles.actions}>
            <button
              onClick={convertAllImages}
              disabled={files.length === 0 || processing}
              className={styles.convertBtn}
            >
              {processing ? `Converting... ${Math.round(progress)}%` : 'Convert All Images'}
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
                    <p className={styles.conversion}>
                      → {files[index]?.name.replace(/\.[^/.]+$/, '')}_converted.{targetFormat}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.noImages}>
              <div className={styles.placeholderIcon}>🔄</div>
              <p>Select multiple images to convert</p>
              <p className={styles.hint}>Choose target format and quality settings</p>
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
                Converting images... {Math.round(progress)}%
              </p>
            </div>
          )}
        </div>
      </div>

      <ToolInfo
        howItWorks="Select multiple images<br>Choose target format and quality settings<br>Click convert to process all images<br>Download converted versions automatically"
        faqs={[
          { title: "Which format should I choose?", content: "JPEG for photos, PNG for graphics/transparency, WebP for web optimization." },
          { title: "Do I lose quality when converting?", content: "Lossy formats (JPEG/WebP) may lose quality, lossless formats (PNG/BMP/TIFF) preserve quality." },
          { title: "Can I convert to the same format?", content: "Yes, useful for recompressing with different quality settings." },
          { title: "What's the best quality setting?", content: "80-90% for good balance of quality and file size." }
        ]}
        tips={["Use WebP for smallest file sizes<br>PNG preserves transparency<br>JPEG best for photographs<br>Check results before using in production"]}
      />
    </main>
  );
}