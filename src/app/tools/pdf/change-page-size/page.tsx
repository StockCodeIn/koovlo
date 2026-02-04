"use client";

import { useState, useRef } from "react";
import { PDFDocument } from "pdf-lib";
import styles from "./changepagesize.module.css";

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default function ChangePageSize() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pageSize, setPageSize] = useState('A4');
  const [customWidth, setCustomWidth] = useState(595);
  const [customHeight, setCustomHeight] = useState(842);
  const [unit, setUnit] = useState<'points' | 'mm' | 'inches'>('points');
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "info">("info");
  const [progress, setProgress] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const pageSizes = {
    A4: { width: 595, height: 842, desc: '210 × 297 mm' },
    A3: { width: 842, height: 1191, desc: '297 × 420 mm' },
    A5: { width: 420, height: 595, desc: '148 × 210 mm' },
    Letter: { width: 612, height: 792, desc: '8.5 × 11 inches' },
    Legal: { width: 612, height: 1008, desc: '8.5 × 14 inches' },
    Tabloid: { width: 792, height: 1224, desc: '11 × 17 inches' }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        setMessage('❌ Please select a valid PDF file');
        setMessageType('error');
        return;
      }
      setPdfFile(selectedFile);
      setMessage(`✅ File selected: ${selectedFile.name}`);
      setMessageType('success');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const selectedFile = files[0];
      if (selectedFile.type !== 'application/pdf') {
        setMessage('❌ Please upload a valid PDF file');
        setMessageType('error');
        return;
      }
      setPdfFile(selectedFile);
      setMessage(`✅ File selected: ${selectedFile.name}`);
      setMessageType('success');
    }
  };

  const clearFile = () => {
    setPdfFile(null);
    setMessage("");
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const convertToPoints = (value: number, fromUnit: string): number => {
    switch (fromUnit) {
      case 'mm': return value * 2.83465;
      case 'inches': return value * 72;
      default: return value;
    }
  };

  const getCurrentSize = () => {
    if (pageSize === 'custom') {
      return {
        width: convertToPoints(customWidth, unit),
        height: convertToPoints(customHeight, unit)
      };
    }
    return pageSizes[pageSize as keyof typeof pageSizes];
  };

  const changePageSize = async () => {
    if (!pdfFile) {
      setMessage('Please select a PDF file first');
      setMessageType('error');
      return;
    }

    setProcessing(true);
    setMessage('Preparing to change page size...');
    setMessageType('info');
    setProgress(0);

    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();

      const targetSize = getCurrentSize();

      setProgress(25);
      setMessage(`Processing ${pages.length} page${pages.length > 1 ? 's' : ''}...`);

      // Change page size for each page
      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        page.setSize(targetSize.width, targetSize.height);

        setProgress(25 + (i / pages.length) * 50);
        setMessage(`Resizing page ${i + 1} of ${pages.length}...`);
      }

      setProgress(80);
      setMessage('Finalizing PDF...');

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${pdfFile.name.replace('.pdf', '')}-resized-${pageSize}.pdf`;
      a.click();
      URL.revokeObjectURL(url);

      setProgress(100);
      setMessage('✅ Page size changed successfully!');
      setMessageType('success');
    } catch (err) {
      console.error('Page size change error:', err);
      setMessage('❌ Failed to change page size. Please try again.');
      setMessageType('error');
    } finally {
      setProcessing(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  const currentSize = getCurrentSize();

  return (
    <main className={styles.container}>
      <h1 className={styles.pageTitle}>
        <span className={styles.icon}>📏</span>
        <span className={styles.textGradient}>Change PDF Page Size</span>
      </h1>
      <p className={styles.description}>
        Instantly resize all pages in your PDF to standard sizes (A4, A3, Letter, Legal) or custom dimensions. Perfect for printing, formatting, and document standardization.
      </p>

      <div className={styles.converter}>
        <div className={styles.inputSection}>
          <div
            className={`${styles.dropZone} ${isDragOver ? styles.dragOver : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <label className={styles.fileLabel}>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                onChange={handleFileSelect}
                className={styles.hiddenInput}
                disabled={processing}
              />
              📄 {pdfFile ? pdfFile.name : "Choose PDF File"}
            </label>
            <p className={styles.dropText}>Or drag and drop a PDF file here</p>
          </div>

          {pdfFile && (
            <div className={styles.fileInfo}>
              <p><strong>File:</strong> {pdfFile.name}</p>
              <p><strong>Size:</strong> {formatFileSize(pdfFile.size)}</p>
              <p><strong>Type:</strong> PDF Document</p>
              <button onClick={clearFile} className={styles.clearBtn}>
                Clear File
              </button>
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
              <p>Processing PDF...</p>
            </div>
          )}

          <div className={styles.sizeSelector}>
            <h3>Target Page Size</h3>
            <div className={styles.sizeOptions}>
              {Object.entries(pageSizes).map(([key, size]) => (
                <button
                  key={key}
                  className={`${styles.sizeBtn} ${pageSize === key ? styles.active : ''}`}
                  onClick={() => setPageSize(key)}
                  disabled={processing}
                >
                  <div className={styles.sizeName}>{key}</div>
                  <div className={styles.sizeDesc}>{size.desc}</div>
                  <div className={styles.sizePoints}>{size.width} × {size.height} pts</div>
                </button>
              ))}

              <button
                className={`${styles.sizeBtn} ${pageSize === 'custom' ? styles.active : ''}`}
                onClick={() => setPageSize('custom')}
                disabled={processing}
              >
                <div className={styles.sizeName}>Custom</div>
                <div className={styles.sizeDesc}>Define your own size</div>
                <div className={styles.sizePoints}>Custom dimensions</div>
              </button>
            </div>
          </div>

          {pageSize === 'custom' && (
            <div className={styles.customSize}>
              <h3>Custom Dimensions</h3>
              <div className={styles.dimensionInputs}>
                <div className={styles.unitSelector}>
                  <label>Unit:</label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value as typeof unit)}
                    className={styles.unitSelect}
                    disabled={processing}
                  >
                    <option value="points">Points</option>
                    <option value="mm">Millimeters</option>
                    <option value="inches">Inches</option>
                  </select>
                </div>

                <div className={styles.dimensionGroup}>
                  <label htmlFor="width">Width:</label>
                  <input
                    id="width"
                    type="number"
                    min="1"
                    value={customWidth}
                    onChange={(e) => setCustomWidth(parseInt(e.target.value) || 1)}
                    className={styles.dimensionInput}
                    disabled={processing}
                  />
                </div>

                <div className={styles.dimensionGroup}>
                  <label htmlFor="height">Height:</label>
                  <input
                    id="height"
                    type="number"
                    min="1"
                    value={customHeight}
                    onChange={(e) => setCustomHeight(parseInt(e.target.value) || 1)}
                    className={styles.dimensionInput}
                    disabled={processing}
                  />
                </div>
              </div>
            </div>
          )}

          <button
            onClick={changePageSize}
            disabled={!pdfFile || processing}
            className={styles.convertBtn}
          >
            {processing ? "🔄 Changing Page Size..." : "🚀 Change Page Size"}
          </button>

          {message && (
            <p className={`${styles.message} ${styles[messageType]}`}>
              {message}
            </p>
          )}
        </div>

        <div className={styles.previewSection}>
          <h3>Size Preview</h3>

          <div className={styles.pagePreview}>
            <div className={styles.pageCanvas}>
              <div className={styles.pageContent}>
                <div className={styles.sizeIndicator}>
                  <div className={styles.pageDimensions}>
                    {Math.round(currentSize.width)} × {Math.round(currentSize.height)} points
                  </div>
                  <div className={styles.pageAspect}>
                    {pageSize === 'custom' ? 'Custom Size' : pageSize}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.sizeGuide}>
            <h4>Size Guide</h4>
            <div className={styles.guideContent}>
              <div className={styles.guideItem}>
                <strong>Points:</strong> PDF standard unit (72 points = 1 inch)
              </div>
              <div className={styles.guideItem}>
                <strong>A4:</strong> 595 × 842 points (210 × 297 mm)
              </div>
              <div className={styles.guideItem}>
                <strong>Letter:</strong> 612 × 792 points (8.5 × 11 inches)
              </div>
              <div className={styles.guideItem}>
                <strong>Content Scaling:</strong> Content may be scaled to fit new size
              </div>
            </div>
          </div>

          <div className={styles.aspectRatios}>
            <h4>Common Aspect Ratios</h4>
            <div className={styles.ratios}>
              <div className={styles.ratio}>
                <strong>A4:</strong> 1:1.414 (√2)
              </div>
              <div className={styles.ratio}>
                <strong>Letter:</strong> 1:1.294
              </div>
              <div className={styles.ratio}>
                <strong>Square:</strong> 1:1
              </div>
              <div className={styles.ratio}>
                <strong>Widescreen:</strong> 16:9
              </div>
            </div>
          </div>

          <div className={styles.warning}>
            <h4>⚠️ Important Notes</h4>
            <ul>
              <li>Content may be scaled to fit the new page size</li>
              <li>Margins and layout may change</li>
              <li>Images may be resized or cropped</li>
              <li>Backup your original PDF</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}