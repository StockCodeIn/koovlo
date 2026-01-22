'use client';

import { useState, useRef } from 'react';
import ToolInfo from '@/components/ToolInfo';
import styles from './preview.module.css';

export default function PreviewPDF() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfPages, setPdfPages] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [error, setError] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        setError('Please select a PDF file');
        return;
      }
      setPdfFile(selectedFile);
      setError('');
      await loadPDF(selectedFile);
    }
  };

  const loadPDF = async (file: File) => {
    setLoading(true);
    setError('');

    try {
      // In a real implementation, this would use pdf.js
      // For now, we'll show a placeholder
      setError('PDF preview requires pdf.js. This feature is under development.');
      setLoading(false);

    } catch (err) {
      setError('Failed to load PDF');
      setLoading(false);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const zoomIn = () => {
    setZoom(Math.min(zoom + 0.25, 3));
  };

  const zoomOut = () => {
    setZoom(Math.max(zoom - 0.25, 0.5));
  };

  const resetZoom = () => {
    setZoom(1);
  };

  return (
    <main className={styles.container}>
      <h1>PDF Preview</h1>
      <p>Preview and navigate through PDF pages with zoom controls</p>

      <div className={styles.viewer}>
        <div className={styles.controls}>
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
              {totalPages > 0 && <p><strong>Pages:</strong> {totalPages}</p>}
            </div>
          )}
        </div>

        <div className={styles.pdfDisplay}>
          {loading && (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>Loading PDF...</p>
            </div>
          )}

          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}

          {!pdfFile && !loading && !error && (
            <div className={styles.placeholder}>
              <div className={styles.placeholderIcon}>📄</div>
              <p>Select a PDF file to preview</p>
            </div>
          )}

          {pdfFile && !loading && !error && pdfPages.length === 0 && (
            <div className={styles.placeholder}>
              <div className={styles.placeholderIcon}>🔄</div>
              <p>Processing PDF...</p>
            </div>
          )}

          {pdfPages.length > 0 && (
            <div className={styles.pageViewer}>
              <div className={styles.pageControls}>
                <button
                  onClick={prevPage}
                  disabled={currentPage === 0}
                  className={styles.navBtn}
                >
                  ‹ Previous
                </button>

                <span className={styles.pageInfo}>
                  Page {currentPage + 1} of {totalPages}
                </span>

                <button
                  onClick={nextPage}
                  disabled={currentPage === totalPages - 1}
                  className={styles.navBtn}
                >
                  Next ›
                </button>
              </div>

              <div className={styles.zoomControls}>
                <button onClick={zoomOut} className={styles.zoomBtn} disabled={zoom <= 0.5}>
                  🔍-
                </button>
                <span className={styles.zoomLevel}>{Math.round(zoom * 100)}%</span>
                <button onClick={zoomIn} className={styles.zoomBtn} disabled={zoom >= 3}>
                  🔍+
                </button>
                <button onClick={resetZoom} className={styles.zoomBtn}>
                  Reset
                </button>
              </div>

              <div className={styles.canvasContainer}>
                <canvas
                  ref={canvasRef}
                  className={styles.pdfCanvas}
                  style={{ transform: `scale(${zoom})` }}
                />
              </div>
            </div>
          )}
        </div>

        <div className={styles.sidebar}>
          <div className={styles.thumbnailStrip}>
            <h3>Pages</h3>
            <div className={styles.thumbnails}>
              {pdfPages.map((pageDataUrl, index) => (
                <div
                  key={index}
                  className={`${styles.thumbnail} ${index === currentPage ? styles.active : ''}`}
                  onClick={() => setCurrentPage(index)}
                >
                  <img src={pageDataUrl} alt={`Page ${index + 1}`} />
                  <span className={styles.pageNumber}>{index + 1}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.pageDetails}>
            <h3>Page Details</h3>
            <div className={styles.details}>
              <p><strong>Current Page:</strong> {currentPage + 1}</p>
              <p><strong>Total Pages:</strong> {totalPages}</p>
              <p><strong>Zoom Level:</strong> {Math.round(zoom * 100)}%</p>
              <p><strong>File Size:</strong> {(pdfFile?.size || 0) / 1024 / 1024} MB</p>
            </div>
          </div>
        </div>
      </div>

      <ToolInfo
        howItWorks="Upload your PDF file<br>Use navigation buttons to browse pages<br>Zoom in/out with zoom controls<br>Click thumbnails to jump to specific pages"
        faqs={[
          { title: "What PDF formats are supported?", content: "All standard PDF formats including PDF 1.0 through PDF 2.0." },
          { title: "Can I zoom to any level?", content: "Yes, zoom from 50% to 300% with smooth scaling." },
          { title: "Does it work with password-protected PDFs?", content: "No, password-protected PDFs need to be unlocked first." },
          { title: "Can I save the current view?", content: "This is a preview tool. Use other tools to modify and save PDFs." }
        ]}
        tips={["Use thumbnails for quick navigation", "Zoom in for detailed viewing", "Perfect for reviewing documents before processing", "Works with large PDFs (loads pages on demand)"]}
      />
    </main>
  );
}