'use client';

import React, { useState, useRef } from 'react';
import ToolInfo from '@/components/ToolInfo';
import styles from './dimensions.module.css';

export default function ImageDimensions() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [fileSize, setFileSize] = useState(0);
  const [fileType, setFileType] = useState('');
  const [aspectRatio, setAspectRatio] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      setImageFile(selectedFile);
      setFileSize(selectedFile.size);
      setFileType(selectedFile.type);

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
      setError('');
    }
  };

  const analyzeImage = () => {
    if (!imagePreview) return;

    const img = new Image();
    img.onload = () => {
      const width = img.naturalWidth;
      const height = img.naturalHeight;

      setDimensions({ width, height });

      // Calculate aspect ratio
      const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
      const divisor = gcd(width, height);
      const ratio = `${width / divisor}:${height / divisor}`;
      setAspectRatio(ratio);

      // Draw to canvas for additional analysis
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0);
        }
      }
    };
    img.src = imagePreview;
  };

  React.useEffect(() => {
    if (imagePreview) {
      analyzeImage();
    }
  }, [imagePreview]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getImageCategory = (width: number, height: number): string => {
    const min = Math.min(width, height);
    const max = Math.max(width, height);

    if (max >= 4000) return 'Large';
    if (max >= 2000) return 'Medium';
    if (max >= 1000) return 'Small';
    return 'Thumbnail';
  };

  const getResolutionCategory = (width: number, height: number): string => {
    const pixels = width * height;

    if (pixels >= 20000000) return '8K+';
    if (pixels >= 8000000) return '4K';
    if (pixels >= 2000000) return '1080p';
    if (pixels >= 1000000) return '720p';
    if (pixels >= 500000) return '480p';
    return 'Low Resolution';
  };

  const downloadReport = () => {
    if (!imageFile || dimensions.width === 0) return;

    const report = `
Image Analysis Report
=====================

File Information:
- Name: ${imageFile.name}
- Size: ${formatFileSize(fileSize)}
- Type: ${fileType}

Dimensions:
- Width: ${dimensions.width} pixels
- Height: ${dimensions.height} pixels
- Total Pixels: ${(dimensions.width * dimensions.height).toLocaleString()}
- Aspect Ratio: ${aspectRatio}

Categories:
- Size Category: ${getImageCategory(dimensions.width, dimensions.height)}
- Resolution: ${getResolutionCategory(dimensions.width, dimensions.height)}

Analysis Date: ${new Date().toLocaleString()}
    `.trim();

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${imageFile.name.replace(/\.[^/.]+$/, '')}_dimensions.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <main className={styles.container}>
      <h1>Image Dimensions</h1>
      <p>Analyze and get detailed information about your image dimensions</p>

      <div className={styles.analyzer}>
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
              <h3>File Information</h3>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <strong>Name:</strong> {imageFile.name}
                </div>
                <div className={styles.infoItem}>
                  <strong>Size:</strong> {formatFileSize(fileSize)}
                </div>
                <div className={styles.infoItem}>
                  <strong>Type:</strong> {fileType}
                </div>
                <div className={styles.infoItem}>
                  <strong>Modified:</strong> {new Date(imageFile.lastModified).toLocaleDateString()}
                </div>
              </div>
            </div>
          )}

          {dimensions.width > 0 && (
            <div className={styles.dimensionsInfo}>
              <h3>Dimensions Analysis</h3>
              <div className={styles.dimensionsGrid}>
                <div className={styles.dimensionCard}>
                  <div className={styles.dimensionValue}>{dimensions.width}</div>
                  <div className={styles.dimensionLabel}>Width (px)</div>
                </div>
                <div className={styles.dimensionCard}>
                  <div className={styles.dimensionValue}>{dimensions.height}</div>
                  <div className={styles.dimensionLabel}>Height (px)</div>
                </div>
                <div className={styles.dimensionCard}>
                  <div className={styles.dimensionValue}>{(dimensions.width * dimensions.height).toLocaleString()}</div>
                  <div className={styles.dimensionLabel}>Total Pixels</div>
                </div>
                <div className={styles.dimensionCard}>
                  <div className={styles.dimensionValue}>{aspectRatio}</div>
                  <div className={styles.dimensionLabel}>Aspect Ratio</div>
                </div>
              </div>

              <div className={styles.categories}>
                <div className={styles.categoryItem}>
                  <strong>Size Category:</strong> {getImageCategory(dimensions.width, dimensions.height)}
                </div>
                <div className={styles.categoryItem}>
                  <strong>Resolution:</strong> {getResolutionCategory(dimensions.width, dimensions.height)}
                </div>
                <div className={styles.categoryItem}>
                  <strong>Orientation:</strong> {dimensions.width > dimensions.height ? 'Landscape' : dimensions.width < dimensions.height ? 'Portrait' : 'Square'}
                </div>
              </div>
            </div>
          )}

          <div className={styles.actions}>
            <button
              onClick={downloadReport}
              disabled={!imageFile || dimensions.width === 0}
              className={styles.downloadBtn}
            >
              Download Analysis Report
            </button>
          </div>

          {error && <div className={styles.error}>{error}</div>}
        </div>

        <div className={styles.previewSection}>
          <h3>Image Preview</h3>

          <div className={styles.previewContainer}>
            {imagePreview ? (
              <>
                <div className={styles.imageWrapper}>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className={styles.previewImage}
                  />
                  {dimensions.width > 0 && (
                    <div className={styles.dimensionOverlay}>
                      <div className={styles.dimensionBadge}>
                        {dimensions.width} × {dimensions.height}
                      </div>
                    </div>
                  )}
                </div>

                <canvas
                  ref={canvasRef}
                  className={styles.hiddenCanvas}
                />
              </>
            ) : (
              <div className={styles.noImage}>
                <div className={styles.placeholderIcon}>📏</div>
                <p>Select an image to analyze dimensions</p>
              </div>
            )}
          </div>

          <div className={styles.analysisGuide}>
            <h4>Dimensions Guide</h4>
            <div className={styles.guideContent}>
              <div className={styles.guideItem}>
                <strong>Thumbnail:</strong> &lt; 1000px max dimension
              </div>
              <div className={styles.guideItem}>
                <strong>Small:</strong> 1000-1999px max dimension
              </div>
              <div className={styles.guideItem}>
                <strong>Medium:</strong> 2000-3999px max dimension
              </div>
              <div className={styles.guideItem}>
                <strong>Large:</strong> 4000px+ max dimension
              </div>
              <div className={styles.guideItem}>
                <strong>HD Ready:</strong> 720p (1280×720)
              </div>
              <div className={styles.guideItem}>
                <strong>Full HD:</strong> 1080p (1920×1080)
              </div>
              <div className={styles.guideItem}>
                <strong>4K:</strong> 3840×2160 or higher
              </div>
            </div>
          </div>
        </div>
      </div>

      <ToolInfo
        howItWorks="Upload your image<br>Automatic dimension analysis begins<br>View detailed size, resolution, and aspect ratio information<br>Download a comprehensive analysis report<br>Use the information for resizing or optimization decisions"
        faqs={[
          { title: "What information does the analysis provide?", content: "Width, height, total pixels, aspect ratio, file size, resolution category, and orientation." },
          { title: "Can I analyze any image format?", content: "Yes, supports all common image formats including JPG, PNG, WebP, GIF, BMP, and more." },
          { title: "Is the analysis done locally?", content: "Yes, all analysis happens in your browser. Images are not uploaded to any server." },
          { title: "What are the resolution categories?", content: "Low (<500K pixels), 480p (500K-1M), 720p (1M-2M), 1080p (2M-8M), 4K (8M-20M), 8K+ (20M+)." }
        ]}
        tips={["Use for determining optimal resize dimensions<br>Check if images meet website requirements<br>Analyze aspect ratios for cropping decisions<br>Download reports for documentation purposes"]}
      />
    </main>
  );
}