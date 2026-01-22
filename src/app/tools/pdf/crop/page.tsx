'use client';

import { useState } from 'react';
import ToolInfo from '@/components/ToolInfo';
import styles from './crop.module.css';

export default function CropPDF() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [cropMode, setCropMode] = useState<'margins' | 'coordinates'>('margins');
  const [margins, setMargins] = useState({ top: 0, bottom: 0, left: 0, right: 0 });
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0, width: 595, height: 842 });
  const [pageRange, setPageRange] = useState('all');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

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

    try {
      // In a real implementation, this would use pdf-lib
      // For now, we'll show a placeholder
      setError('PDF cropping requires pdf-lib. This feature is under development.');

      setTimeout(() => {
        setProcessing(false);
      }, 2000);

    } catch (err) {
      setError('Failed to crop PDF');
      setProcessing(false);
    }
  };

  return (
    <main className={styles.container}>
      <h1>Crop PDF</h1>
      <p>Remove unwanted margins or crop specific areas from your PDF pages</p>

      <div className={styles.converter}>
        <div className={styles.inputSection}>
          <div className={styles.fileInput}>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileSelect}
              className={styles.hiddenInput}
              id="pdf-file"
            />
            <label htmlFor="pdf-file" className={styles.fileLabel}>
              {pdfFile ? pdfFile.name : 'Choose PDF File'}
            </label>
          </div>

          {pdfFile && (
            <div className={styles.fileInfo}>
              <p><strong>File:</strong> {pdfFile.name} ({(pdfFile.size / 1024 / 1024).toFixed(2)} MB)</p>
            </div>
          )}

          <div className={styles.cropMode}>
            <h3>Crop Mode</h3>
            <div className={styles.modeButtons}>
              <button
                className={`${styles.modeBtn} ${cropMode === 'margins' ? styles.active : ''}`}
                onClick={() => setCropMode('margins')}
              >
                Remove Margins
              </button>
              <button
                className={`${styles.modeBtn} ${cropMode === 'coordinates' ? styles.active : ''}`}
                onClick={() => setCropMode('coordinates')}
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
            {processing ? 'Cropping PDF...' : 'Crop PDF'}
          </button>

          {error && <div className={styles.error}>{error}</div>}
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