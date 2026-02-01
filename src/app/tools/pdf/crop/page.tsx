'use client';

import { useState, useRef } from 'react';
import { PDFDocument } from 'pdf-lib';
import ToolInfo from '@/components/ToolInfo';
import styles from './crop.module.css';

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default function CropPDF() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [cropMode, setCropMode] = useState<'margins' | 'coordinates'>('margins');
  const [margins, setMargins] = useState({ top: 50, bottom: 50, left: 50, right: 50 });
  const [coordinates, setCoordinates] = useState({ x: 50, y: 50, width: 495, height: 742 });
  const [pageRange, setPageRange] = useState('all');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        setError('Please upload a valid PDF file');
        return;
      }
      setPdfFile(selectedFile);
      setError('');
    }
  };

  const clearFile = () => {
    setPdfFile(null);
    setError('');
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        setError('Please select a PDF file');
        return;
      }
      setPdfFile(selectedFile);
      setError('');
    }
  };

  const handleMarginChange = (side: keyof typeof margins, value: number) => {
    setMargins(prev => ({ ...prev, [side]: Math.max(0, value) }));
  };

  const handleCoordinateChange = (field: keyof typeof coordinates, value: number) => {
    setCoordinates(prev => ({ ...prev, [field]: Math.max(0, value) }));
  };

  const cropPDF = async () => {
    if (!pdfFile) {
      setError('Please select a PDF file');
      return;
    }

    setProcessing(true);
    setError('');
    setProgress(0);

    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();

      // Determine which pages to crop
      let pagesToCrop: number[] = [];
      switch (pageRange) {
        case 'all':
          pagesToCrop = pages.map((_, i) => i);
          break;
        case 'first':
          pagesToCrop = [0];
          break;
        case 'last':
          pagesToCrop = [pages.length - 1];
          break;
        default:
          pagesToCrop = pages.map((_, i) => i); // Default to all
      }

      setProgress(25);

      // Process each page
      for (let i = 0; i < pagesToCrop.length; i++) {
        const pageIndex = pagesToCrop[i];
        const page = pages[pageIndex];
        const { width, height } = page.getSize();

        let cropBox: { x: number; y: number; width: number; height: number };

        if (cropMode === 'margins') {
          // Calculate crop box from margins
          cropBox = {
            x: margins.left,
            y: margins.bottom,
            width: Math.max(1, width - margins.left - margins.right),
            height: Math.max(1, height - margins.top - margins.bottom)
          };
        } else {
          // Use direct coordinates
          cropBox = {
            x: coordinates.x,
            y: coordinates.y,
            width: Math.max(1, coordinates.width),
            height: Math.max(1, coordinates.height)
          };
        }

        // Ensure crop box doesn't exceed page boundaries
        cropBox.x = Math.max(0, Math.min(cropBox.x, width - 1));
        cropBox.y = Math.max(0, Math.min(cropBox.y, height - 1));
        cropBox.width = Math.max(1, Math.min(cropBox.width, width - cropBox.x));
        cropBox.height = Math.max(1, Math.min(cropBox.height, height - cropBox.y));

        // Set the crop box
        page.setCropBox(cropBox.x, cropBox.y, cropBox.width, cropBox.height);

        setProgress(25 + (i / pagesToCrop.length) * 50);
      }

      setProgress(80);

      // Save and download the cropped PDF
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${pdfFile.name.replace('.pdf', '')}-cropped.pdf`;
      a.click();
      URL.revokeObjectURL(url);

      setProgress(100);
      setError('PDF cropped successfully!');

    } catch (err) {
      console.error('Crop PDF error:', err);
      setError('Failed to crop PDF. Please try again.');
    } finally {
      setProcessing(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  return (
    <main className={styles.container}>
      <h1 className={styles.pageTitle}>
        <span className={styles.icon}>✂️</span>
        <span className={styles.textGradient}>Crop PDF</span>
      </h1>
      <p className={styles.description}>
        Remove unwanted margins or crop specific areas from your PDF pages — perfect for cleaning up documents.
      </p>

      <div className={styles.converter}>
        <div className={styles.inputSection}>
          <div
            className={`${styles.fileInput} ${isDragOver ? styles.dragOver : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileSelect}
              className={styles.hiddenInput}
              id="pdf-file"
              disabled={processing}
            />
            <label htmlFor="pdf-file" className={styles.fileLabel}>
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

          <div className={styles.cropMode}>
            <h3>Crop Mode</h3>
            <div className={styles.modeButtons}>
              <button
                className={`${styles.modeBtn} ${cropMode === 'margins' ? styles.active : ''}`}
                onClick={() => setCropMode('margins')}
                disabled={processing}
              >
                Remove Margins
              </button>
              <button
                className={`${styles.modeBtn} ${cropMode === 'coordinates' ? styles.active : ''}`}
                onClick={() => setCropMode('coordinates')}
                disabled={processing}
              >
                Custom Coordinates
              </button>
            </div>
          </div>

          {cropMode === 'margins' && (
            <div className={styles.marginsSection}>
              <h3>Margin Removal</h3>
              <div className={styles.marginInputs}>
                <div className={styles.marginGroup}>
                  <label htmlFor="top">Top Margin (points):</label>
                  <input
                    id="top"
                    type="number"
                    min="0"
                    value={margins.top}
                    onChange={(e) => handleMarginChange('top', parseInt(e.target.value) || 0)}
                    className={styles.numberInput}
                    disabled={processing}
                  />
                </div>
                <div className={styles.marginGroup}>
                  <label htmlFor="bottom">Bottom Margin (points):</label>
                  <input
                    id="bottom"
                    type="number"
                    min="0"
                    value={margins.bottom}
                    onChange={(e) => handleMarginChange('bottom', parseInt(e.target.value) || 0)}
                    className={styles.numberInput}
                    disabled={processing}
                  />
                </div>
                <div className={styles.marginGroup}>
                  <label htmlFor="left">Left Margin (points):</label>
                  <input
                    id="left"
                    type="number"
                    min="0"
                    value={margins.left}
                    onChange={(e) => handleMarginChange('left', parseInt(e.target.value) || 0)}
                    className={styles.numberInput}
                    disabled={processing}
                  />
                </div>
                <div className={styles.marginGroup}>
                  <label htmlFor="right">Right Margin (points):</label>
                  <input
                    id="right"
                    type="number"
                    min="0"
                    value={margins.right}
                    onChange={(e) => handleMarginChange('right', parseInt(e.target.value) || 0)}
                    className={styles.numberInput}
                    disabled={processing}
                  />
                </div>
              </div>
            </div>
          )}

          {cropMode === 'coordinates' && (
            <div className={styles.coordinatesSection}>
              <h3>Custom Coordinates</h3>
              <div className={styles.coordinateInputs}>
                <div className={styles.coordGroup}>
                  <label htmlFor="x">X Position (points):</label>
                  <input
                    id="x"
                    type="number"
                    min="0"
                    value={coordinates.x}
                    onChange={(e) => handleCoordinateChange('x', parseInt(e.target.value) || 0)}
                    className={styles.numberInput}
                    disabled={processing}
                  />
                </div>
                <div className={styles.coordGroup}>
                  <label htmlFor="y">Y Position (points):</label>
                  <input
                    id="y"
                    type="number"
                    min="0"
                    value={coordinates.y}
                    onChange={(e) => handleCoordinateChange('y', parseInt(e.target.value) || 0)}
                    className={styles.numberInput}
                    disabled={processing}
                  />
                </div>
                <div className={styles.coordGroup}>
                  <label htmlFor="width">Width (points):</label>
                  <input
                    id="width"
                    type="number"
                    min="1"
                    value={coordinates.width}
                    onChange={(e) => handleCoordinateChange('width', parseInt(e.target.value) || 595)}
                    className={styles.numberInput}
                    disabled={processing}
                  />
                </div>
                <div className={styles.coordGroup}>
                  <label htmlFor="height">Height (points):</label>
                  <input
                    id="height"
                    type="number"
                    min="1"
                    value={coordinates.height}
                    onChange={(e) => handleCoordinateChange('height', parseInt(e.target.value) || 842)}
                    className={styles.numberInput}
                    disabled={processing}
                  />
                </div>
              </div>
            </div>
          )}

          <div className={styles.pageRange}>
            <label htmlFor="pages">Pages to Crop:</label>
            <select
              id="pages"
              value={pageRange}
              onChange={(e) => setPageRange(e.target.value)}
              className={styles.selectInput}
              disabled={processing}
            >
              <option value="all">All Pages</option>
              <option value="first">First Page Only</option>
              <option value="last">Last Page Only</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          <button
            onClick={cropPDF}
            disabled={!pdfFile || processing}
            className={styles.convertBtn}
          >
            {processing ? '🔄 Cropping PDF...' : '✂️ Crop PDF'}
          </button>

          {error && (
            <div className={`${styles.message} ${error.includes('successfully') ? styles.success : styles.error}`}>
              {error}
            </div>
          )}
        </div>

        <div className={styles.previewSection}>
          <h3>Preview & Guide</h3>

          <div className={styles.pagePreview}>
            <div className={styles.pageCanvas}>
              <div className={styles.pageContent}>
                <div className={styles.cropOverlay}>
                  {cropMode === 'margins' && (
                    <div
                      className={styles.marginCrop}
                      style={{
                        top: `${margins.top}px`,
                        bottom: `${margins.bottom}px`,
                        left: `${margins.left}px`,
                        right: `${margins.right}px`
                      }}
                    />
                  )}
                  {cropMode === 'coordinates' && (
                    <div
                      className={styles.coordCrop}
                      style={{
                        left: `${coordinates.x}px`,
                        top: `${coordinates.y}px`,
                        width: `${coordinates.width}px`,
                        height: `${coordinates.height}px`
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.cropGuide}>
            <h4>Cropping Guide</h4>
            <div className={styles.guideContent}>
              <div className={styles.guideItem}>
                <strong>Margin Removal:</strong> Removes specified margins from all edges
              </div>
              <div className={styles.guideItem}>
                <strong>Custom Coordinates:</strong> Crops to exact rectangle (X,Y,Width,Height)
              </div>
              <div className={styles.guideItem}>
                <strong>Units:</strong> Points (72 points = 1 inch)
              </div>
              <div className={styles.guideItem}>
                <strong>A4 Size:</strong> 595 × 842 points
              </div>
              <div className={styles.guideItem}>
                <strong>Origin:</strong> Bottom-left corner (0,0)
              </div>
            </div>
          </div>
        </div>
      </div>

      <ToolInfo
        howItWorks="Upload your PDF file<br>Choose crop mode (margins or coordinates)<br>Set cropping parameters<br>Select pages to crop<br>Click 'Crop PDF' to download"
        faqs={[
          { title: "What's the difference between margin removal and coordinates?", content: "Margin removal trims equal amounts from edges. Coordinates let you specify exact crop rectangle." },
          { title: "What units are used?", content: "Points (72 points = 1 inch). Standard PDF measurement unit." },
          { title: "Can I crop multiple pages differently?", content: "Currently crops all selected pages with same settings. Use split tool first for different crops." },
          { title: "Will text be preserved?", content: "Yes, cropping only changes page dimensions, content remains intact." }
        ]}
        tips={["Preview your crop area before processing<br>Use margin removal for consistent borders<br>Coordinates give precise control<br>Test with single page first"]}
      />
    </main>
  );
}