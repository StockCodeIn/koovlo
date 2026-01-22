'use client';

import { useState, useRef } from 'react';
import ToolInfo from '@/components/ToolInfo';
import styles from './tobase64.module.css';

export default function ImageToBase64() {
  const [files, setFiles] = useState<File[]>([]);
  const [base64Results, setBase64Results] = useState<any[]>([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [includeDataUrl, setIncludeDataUrl] = useState(true);
  const [format, setFormat] = useState<'auto' | 'jpeg' | 'png' | 'webp'>('auto');
  const [quality, setQuality] = useState(90);
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
    setBase64Results([]);
  };

  const convertToBase64 = async () => {
    if (files.length === 0) {
      setError('Please select images to convert');
      return;
    }

    setProcessing(true);
    setProgress(0);
    setError('');

    try {
      const results: any[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const result = await processImage(file);
        results.push(result);
        setProgress(((i + 1) / files.length) * 100);
      }

      setBase64Results(results);
      setProgress(100);
    } catch (err) {
      setError('Failed to convert images');
    } finally {
      setProcessing(false);
    }
  };

  const processImage = (file: File): Promise<any> => {
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

        // Determine output format
        let outputFormat = format;
        if (format === 'auto') {
          // Auto-detect based on original format and transparency
          const hasAlpha = hasTransparency(img, ctx);
          outputFormat = hasAlpha ? 'png' : 'jpeg';
        }

        // Convert to base64
        const mimeType = `image/${outputFormat}`;
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const reader = new FileReader();
              reader.onload = () => {
                const base64String = reader.result as string;
                const cleanBase64 = base64String.split(',')[1];

                resolve({
                  filename: file.name,
                  originalSize: file.size,
                  dimensions: { width: img.width, height: img.height },
                  format: outputFormat.toUpperCase(),
                  base64: includeDataUrl ? base64String : cleanBase64,
                  base64Only: cleanBase64,
                  dataUrl: base64String,
                  size: cleanBase64.length,
                  compressionRatio: ((file.size - cleanBase64.length * 0.75) / file.size * 100).toFixed(1)
                });
              };
              reader.readAsDataURL(blob);
            } else {
              reject(new Error('Conversion failed'));
            }
          },
          mimeType,
          outputFormat === 'jpeg' ? quality / 100 : undefined
        );
      };
      img.onerror = () => reject(new Error('Image loading failed'));
      img.src = URL.createObjectURL(file);
    });
  };

  const hasTransparency = (img: HTMLImageElement, ctx: CanvasRenderingContext2D): boolean => {
    const imageData = ctx.getImageData(0, 0, img.width, img.height);
    const data = imageData.data;

    // Check for alpha values less than 255
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] < 255) {
        return true;
      }
    }
    return false;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      // Could show a toast notification here
    }).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    });
  };

  const downloadAllBase64 = () => {
    if (base64Results.length === 0) return;

    const content = base64Results.map(result =>
      `// ${result.filename}\n${result.base64}\n`
    ).join('\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'images-base64.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setFiles([]);
    setBase64Results([]);
    setProgress(0);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getTotalStats = () => {
    if (base64Results.length === 0) return null;

    const totalOriginal = base64Results.reduce((sum, r) => sum + r.originalSize, 0);
    const totalBase64 = base64Results.reduce((sum, r) => sum + r.size, 0);
    const avgCompression = base64Results.reduce((sum, r) => sum + parseFloat(r.compressionRatio), 0) / base64Results.length;

    return {
      totalFiles: base64Results.length,
      totalOriginal: (totalOriginal / 1024).toFixed(1),
      totalBase64: (totalBase64 / 1024).toFixed(1),
      avgCompression: avgCompression.toFixed(1)
    };
  };

  const stats = getTotalStats();

  return (
    <main className={styles.container}>
      <h1>Image to Base64 Converter</h1>
      <p>Convert images to base64 encoded strings for embedding in code</p>

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
              id="to-base64-files"
            />
            <label htmlFor="to-base64-files" className={styles.fileLabel}>
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
              <label htmlFor="format">Output Format:</label>
              <select
                id="format"
                value={format}
                onChange={(e) => setFormat(e.target.value as any)}
                className={styles.selectInput}
              >
                <option value="auto">Auto (JPEG/PNG based on transparency)</option>
                <option value="jpeg">JPEG (smaller, no transparency)</option>
                <option value="png">PNG (supports transparency)</option>
                <option value="webp">WebP (modern, smaller)</option>
              </select>
            </div>

            {(format === 'jpeg' || format === 'auto') && (
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

            <div className={styles.settingGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={includeDataUrl}
                  onChange={(e) => setIncludeDataUrl(e.target.checked)}
                  className={styles.checkbox}
                />
                Include data URL prefix (data:image/...)
              </label>
            </div>
          </div>

          <div className={styles.actions}>
            <button
              onClick={convertToBase64}
              disabled={files.length === 0 || processing}
              className={styles.convertBtn}
            >
              {processing ? `Converting... ${Math.round(progress)}%` : 'Convert to Base64'}
            </button>
            <button
              onClick={downloadAllBase64}
              disabled={base64Results.length === 0}
              className={styles.downloadAllBtn}
            >
              Download All as Text
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

        {stats && (
          <div className={styles.summary}>
            <h3>Conversion Summary</h3>
            <div className={styles.statsGrid}>
              <div className={styles.stat}>
                <span className={styles.statNumber}>{stats.totalFiles}</span>
                <span className={styles.statLabel}>Images Converted</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>{stats.totalOriginal} KB</span>
                <span className={styles.statLabel}>Original Size</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>{stats.totalBase64} KB</span>
                <span className={styles.statLabel}>Base64 Size</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>{stats.avgCompression}%</span>
                <span className={styles.statLabel}>Avg Expansion</span>
              </div>
            </div>
          </div>
        )}

        <div className={styles.results}>
          <h3>Base64 Results</h3>

          {processing ? (
            <div className={styles.processing}>
              <div className={styles.spinner}></div>
              <p>Converting images to base64...</p>
            </div>
          ) : base64Results.length > 0 ? (
            <div className={styles.resultsList}>
              {base64Results.map((result, index) => (
                <div key={index} className={styles.resultItem}>
                  <div className={styles.resultHeader}>
                    <h4 className={styles.filename}>{result.filename}</h4>
                    <div className={styles.resultStats}>
                      <span className={styles.stat}>
                        {result.dimensions.width}×{result.dimensions.height}
                      </span>
                      <span className={styles.stat}>
                        {(result.originalSize / 1024).toFixed(1)} KB → {(result.size / 1024).toFixed(1)} KB
                      </span>
                      <span className={styles.stat}>
                        {result.format}
                      </span>
                    </div>
                  </div>

                  <div className={styles.base64Container}>
                    <div className={styles.base64Header}>
                      <span>Base64 String:</span>
                      <button
                        onClick={() => copyToClipboard(result.base64)}
                        className={styles.copyBtn}
                        title="Copy to clipboard"
                      >
                        📋 Copy
                      </button>
                    </div>
                    <textarea
                      value={result.base64}
                      readOnly
                      className={styles.base64Textarea}
                      rows={4}
                    />
                  </div>

                  <div className={styles.usageExamples}>
                    <h5>Usage Examples:</h5>
                    <div className={styles.codeExamples}>
                      <div className={styles.codeBlock}>
                        <strong>HTML:</strong>
                        <code>&lt;img src="{result.base64.substring(0, 50)}..."&gt;</code>
                      </div>
                      <div className={styles.codeBlock}>
                        <strong>CSS:</strong>
                        <code>background-image: url({result.base64.substring(0, 50)}...);</code>
                      </div>
                      <div className={styles.codeBlock}>
                        <strong>JavaScript:</strong>
                        <code>const img = "{result.base64Only.substring(0, 30)}...";</code>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.noResults}>
              <div className={styles.placeholderIcon}>🔄</div>
              <p>Select images and click convert to generate base64 strings</p>
              <p className={styles.hint}>Base64 strings can be embedded directly in HTML, CSS, or JavaScript</p>
            </div>
          )}
        </div>
      </div>

      <ToolInfo
        howItWorks="Select multiple images<br>Choose output format and quality settings<br>Click convert to generate base64 strings<br>Copy individual strings or download all as text file"
        faqs={[
          { title: "What is base64 encoding?", content: "Base64 converts binary data to text format using 64 characters (A-Z, a-z, 0-9, +, /)." },
          { title: "When should I use base64 images?", content: "For small images, icons, or when you need to embed images directly in code without external files." },
          { title: "Does base64 make files smaller?", content: "No, base64 encoding increases file size by about 33%. It's for embedding, not compression." },
          { title: "Which format should I choose?", content: "Use JPEG for photos, PNG for graphics with transparency, WebP for modern browsers." }
        ]}
        tips={["Use for small images and icons<br>Perfect for data URIs in CSS/HTML<br>Consider file size impact on page load<br>Auto format detects transparency automatically"]}
      />
    </main>
  );
}