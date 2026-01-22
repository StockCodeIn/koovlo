'use client';

import React, { useState, useRef } from 'react';
import ToolInfo from '@/components/ToolInfo';
import styles from './dpi-checker.module.css';

export default function DPIChecker() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [dpi, setDpi] = useState({ x: 72, y: 72 });
  const [printSizes, setPrintSizes] = useState<any[]>([]);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const commonDPIs = [72, 96, 150, 200, 300, 600];
  const printSizesData = [
    { name: 'Business Card', width: 3.5, height: 2 },
    { name: 'Postcard', width: 4, height: 6 },
    { name: 'Letter', width: 8.5, height: 11 },
    { name: 'A4', width: 8.27, height: 11.69 },
    { name: 'Legal', width: 8.5, height: 14 },
    { name: 'Tabloid', width: 11, height: 17 },
    { name: 'Poster (24x36)', width: 24, height: 36 }
  ];

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

  const analyzeDPI = () => {
    if (!imagePreview) return;

    const img = new Image();
    img.onload = () => {
      const width = img.naturalWidth;
      const height = img.naturalHeight;

      setDimensions({ width, height });

      // Calculate print sizes for different DPIs
      const sizes = printSizesData.map(size => {
        const pixelsWidth = size.width * 300; // 300 DPI for print
        const pixelsHeight = size.height * 300;

        return {
          ...size,
          pixelsWidth: Math.round(pixelsWidth),
          pixelsHeight: Math.round(pixelsHeight),
          fits300: width >= pixelsWidth && height >= pixelsHeight,
          fits150: width >= (pixelsWidth / 2) && height >= (pixelsHeight / 2),
          fits72: width >= (pixelsWidth * 72 / 300) && height >= (pixelsHeight * 72 / 300)
        };
      });

      setPrintSizes(sizes);

      // Draw to canvas for analysis
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
      analyzeDPI();
    }
  }, [imagePreview]);

  const calculatePrintSize = (pixelWidth: number, pixelHeight: number, dpi: number) => {
    const inchesWidth = pixelWidth / dpi;
    const inchesHeight = pixelHeight / dpi;
    const cmWidth = inchesWidth * 2.54;
    const cmHeight = inchesHeight * 2.54;

    return {
      inches: `${inchesWidth.toFixed(2)}" × ${inchesHeight.toFixed(2)}"`,
      cm: `${cmWidth.toFixed(2)}cm × ${cmHeight.toFixed(2)}cm`
    };
  };

  const getDPIQuality = (dpi: number): { label: string; color: string } => {
    if (dpi >= 300) return { label: 'Print Quality', color: '#28a745' };
    if (dpi >= 150) return { label: 'Good Quality', color: '#ffc107' };
    if (dpi >= 96) return { label: 'Web Quality', color: '#17a2b8' };
    return { label: 'Low Quality', color: '#dc3545' };
  };

  const getPrintReadiness = (fits300: boolean, fits150: boolean): string => {
    if (fits300) return 'Ready for high-quality printing';
    if (fits150) return 'Suitable for most printing';
    return 'May appear pixelated when printed';
  };

  const downloadDPIRaport = () => {
    if (!imageFile || dimensions.width === 0) return;

    const report = `
DPI Analysis Report
===================

Image: ${imageFile.name}
Dimensions: ${dimensions.width} × ${dimensions.height} pixels

Calculated Print Sizes:
${printSizes.map(size => `
${size.name} (${size.width}" × ${size.height}"):
  Required at 300 DPI: ${size.pixelsWidth} × ${size.pixelsHeight} pixels
  Your image fits: ${size.fits300 ? 'Yes' : 'No'}
  At 150 DPI: ${size.fits150 ? 'Yes' : 'No'}
  At 72 DPI: ${size.fits72 ? 'Yes' : 'No'}
`).join('')}

Current Print Size at Different DPIs:
${commonDPIs.map(dpi => {
  const size = calculatePrintSize(dimensions.width, dimensions.height, dpi);
  return `${dpi} DPI: ${size.inches} (${size.cm})`;
}).join('\n')}

Analysis Date: ${new Date().toLocaleString()}
    `.trim();

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${imageFile.name.replace(/\.[^/.]+$/, '')}_dpi_analysis.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <main className={styles.container}>
      <h1>DPI Checker</h1>
      <p>Check image DPI and print suitability for different print sizes</p>

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
              <h3>Image Information</h3>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <strong>Name:</strong> {imageFile.name}
                </div>
                <div className={styles.infoItem}>
                  <strong>Dimensions:</strong> {dimensions.width} × {dimensions.height} pixels
                </div>
                <div className={styles.infoItem}>
                  <strong>Total Pixels:</strong> {(dimensions.width * dimensions.height).toLocaleString()}
                </div>
              </div>
            </div>
          )}

          {dimensions.width > 0 && (
            <div className={styles.dpiAnalysis}>
              <h3>Print Size Calculator</h3>
              <div className={styles.dpiGrid}>
                {commonDPIs.map(dpiValue => {
                  const size = calculatePrintSize(dimensions.width, dimensions.height, dpiValue);
                  const quality = getDPIQuality(dpiValue);

                  return (
                    <div key={dpiValue} className={styles.dpiCard}>
                      <div className={styles.dpiValue}>{dpiValue} DPI</div>
                      <div className={styles.dpiQuality} style={{ color: quality.color }}>
                        {quality.label}
                      </div>
                      <div className={styles.dpiSize}>
                        {size.inches}<br/>
                        <small>{size.cm}</small>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className={styles.printSizes}>
            <h3>Print Size Compatibility</h3>
            <div className={styles.sizesList}>
              {printSizes.map((size, index) => (
                <div key={index} className={styles.sizeItem}>
                  <div className={styles.sizeName}>
                    {size.name}
                    <small>{size.width}" × {size.height}"</small>
                  </div>
                  <div className={styles.sizeStatus}>
                    <div className={`${styles.statusIndicator} ${size.fits300 ? styles.good : size.fits150 ? styles.okay : styles.poor}`}>
                      {size.fits300 ? '✓ 300 DPI' : size.fits150 ? '~ 150 DPI' : '✗ Too small'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.actions}>
            <button
              onClick={downloadDPIRaport}
              disabled={!imageFile || dimensions.width === 0}
              className={styles.downloadBtn}
            >
              Download DPI Report
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
                    <div className={styles.dpiOverlay}>
                      <div className={styles.dpiBadge}>
                        {dimensions.width} × {dimensions.height}
                      </div>
                      <div className={styles.qualityBadge}>
                        {getPrintReadiness(
                          printSizes.some(s => s.fits300),
                          printSizes.some(s => s.fits150)
                        )}
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
                <div className={styles.placeholderIcon}>📐</div>
                <p>Select an image to check DPI</p>
              </div>
            )}
          </div>

          <div className={styles.dpiGuide}>
            <h4>DPI Guide</h4>
            <div className={styles.guideContent}>
              <div className={styles.guideItem}>
                <strong>72 DPI:</strong> Web images, screen display
              </div>
              <div className={styles.guideItem}>
                <strong>96 DPI:</strong> Basic printing, draft quality
              </div>
              <div className={styles.guideItem}>
                <strong>150 DPI:</strong> Good quality printing
              </div>
              <div className={styles.guideItem}>
                <strong>200 DPI:</strong> Photo quality printing
              </div>
              <div className={styles.guideItem}>
                <strong>300 DPI:</strong> Professional print quality
              </div>
              <div className={styles.guideItem}>
                <strong>600 DPI:</strong> High-end printing, magazines
              </div>
            </div>
          </div>
        </div>
      </div>

      <ToolInfo
        howItWorks="Upload your image<br>Automatic DPI analysis and calculations<br>View print size compatibility for common formats<br>See quality ratings for different DPI levels<br>Download detailed DPI analysis report"
        faqs={[
          { title: "What is DPI?", content: "DPI (Dots Per Inch) measures print resolution. Higher DPI means sharper prints but larger file sizes." },
          { title: "Why is 300 DPI recommended for printing?", content: "300 DPI provides professional print quality. Most printers and print shops require this minimum." },
          { title: "Can I increase DPI of my image?", content: "DPI is calculated from pixel dimensions. To increase effective DPI, you need more pixels (higher resolution)." },
          { title: "What's the difference between DPI and PPI?", content: "DPI is for printing, PPI (Pixels Per Inch) is for digital displays. They're often used interchangeably." }
        ]}
        tips={["300 DPI minimum for professional printing<br>Check print size requirements before ordering<br>Larger images can be printed bigger at same DPI<br>Web images (72 DPI) are fine for digital use only"]}
      />
    </main>
  );
}