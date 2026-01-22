'use client';

import { useState } from 'react';
import ToolInfo from '@/components/ToolInfo';
import styles from './changepagesize.module.css';

export default function ChangePageSize() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pageSize, setPageSize] = useState('A4');
  const [customWidth, setCustomWidth] = useState(595);
  const [customHeight, setCustomHeight] = useState(842);
  const [unit, setUnit] = useState<'points' | 'mm' | 'inches'>('points');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

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
        setError('Please select a PDF file');
        return;
      }
      setPdfFile(selectedFile);
      setError('');
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
      setError('Please select a PDF file');
      return;
    }

    setProcessing(true);
    setError('');

    try {
      // In a real implementation, this would use pdf-lib
      // For now, we'll show a placeholder
      setError('PDF page size changing requires pdf-lib. This feature is under development.');

      setTimeout(() => {
        setProcessing(false);
      }, 2000);

    } catch (err) {
      setError('Failed to change page size');
      setProcessing(false);
    }
  };

  const currentSize = getCurrentSize();

  return (
    <main className={styles.container}>
      <h1>Change PDF Page Size</h1>
      <p>Resize all pages in your PDF to a different page size</p>

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

          <div className={styles.sizeSelector}>
            <h3>Page Size</h3>
            <div className={styles.sizeOptions}>
              {Object.entries(pageSizes).map(([key, size]) => (
                <button
                  key={key}
                  className={`${styles.sizeBtn} ${pageSize === key ? styles.active : ''}`}
                  onClick={() => setPageSize(key)}
                >
                  <div className={styles.sizeName}>{key}</div>
                  <div className={styles.sizeDesc}>{size.desc}</div>
                  <div className={styles.sizePoints}>{size.width} × {size.height} pts</div>
                </button>
              ))}

              <button
                className={`${styles.sizeBtn} ${pageSize === 'custom' ? styles.active : ''}`}
                onClick={() => setPageSize('custom')}
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
            {processing ? 'Changing Page Size...' : 'Change Page Size'}
          </button>

          {error && <div className={styles.error}>{error}</div>}
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

      <ToolInfo
        howItWorks="Upload your PDF file<br>Select a standard page size or enter custom dimensions<br>Choose your preferred unit (points, mm, or inches)<br>Click 'Change Page Size' to download resized PDF"
        faqs={[
          { title: "What happens to the content when changing page size?", content: "Content is scaled to fit the new dimensions while maintaining aspect ratio." },
          { title: "Can I specify exact dimensions?", content: "Yes, use the Custom option and enter width and height in your preferred unit." },
          { title: "What units can I use?", content: "Points (PDF standard), millimeters, or inches." },
          { title: "Will images be affected?", content: "Images will be scaled along with the rest of the content." }
        ]}
        tips={["Choose standard sizes for printing<br>Use points for precise PDF dimensions<br>Preview the aspect ratio before processing<br>Always keep a backup of the original"]}
      />
    </main>
  );
}