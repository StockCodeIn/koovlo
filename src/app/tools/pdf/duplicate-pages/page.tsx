'use client';

import { useState, useCallback } from 'react';
import { PDFDocument } from 'pdf-lib';
import ToolInfo from '@/components/ToolInfo';
import styles from './duplicate.module.css';

export default function DuplicatePages() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pagesToDuplicate, setPagesToDuplicate] = useState('');
  const [duplicateCount, setDuplicateCount] = useState(1);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFile = useCallback((selectedFile: File) => {
    if (selectedFile.type !== 'application/pdf') {
      setError('Please select a valid PDF file.');
      return;
    }
    setPdfFile(selectedFile);
    setError('');
    setSuccess('');
    // Get total pages
    selectedFile.arrayBuffer().then(bytes => {
      PDFDocument.load(bytes).then(pdf => {
        setTotalPages(pdf.getPageCount());
      }).catch(() => {
        setTotalPages(null);
      });
    });
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) handleFile(selectedFile);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFile(droppedFile);
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOver(false);
  }, []);

  const parsePageRanges = (input: string): number[] => {
    if (!input.trim()) return [];

    const pages: number[] = [];
    const ranges = input.split(',').map(r => r.trim());

    for (const range of ranges) {
      if (range.includes('-')) {
        const [start, end] = range.split('-').map(n => parseInt(n.trim()));
        if (isNaN(start) || isNaN(end) || start > end || start < 1) {
          throw new Error(`Invalid range: ${range}`);
        }
        for (let i = start; i <= end; i++) {
          if (!pages.includes(i)) pages.push(i);
        }
      } else {
        const page = parseInt(range);
        if (isNaN(page) || page < 1) {
          throw new Error(`Invalid page number: ${range}`);
        }
        if (!pages.includes(page)) pages.push(page);
      }
    }

    return pages.sort((a, b) => a - b);
  };

  const duplicatePages = async () => {
    if (!pdfFile) {
      setError('Please select a PDF file');
      return;
    }

    if (!pagesToDuplicate.trim()) {
      setError('Please specify pages to duplicate');
      return;
    }

    try {
      const pages = parsePageRanges(pagesToDuplicate);

      if (pages.length === 0) {
        setError('No valid pages specified');
        return;
      }

      if (duplicateCount < 1 || duplicateCount > 10) {
        setError('Duplicate count must be between 1 and 10');
        return;
      }

      setProcessing(true);
      setError('');
      setSuccess('');
      setProgress(10);

      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const originalPageCount = pdfDoc.getPageCount();

      // Validate pages exist
      const invalidPages = pages.filter(p => p > originalPageCount);
      if (invalidPages.length > 0) {
        setError(`Invalid page numbers: ${invalidPages.join(', ')}`);
        setProcessing(false);
        return;
      }

      setProgress(30);

      const newPdf = await PDFDocument.create();
      const originalPages = pdfDoc.getPages();

      // Add pages in order, duplicating specified pages
      for (let i = 0; i < originalPages.length; i++) {
        const pageIndex = i;
        const pageNumber = i + 1;

        // Add the original page
        const [copiedPage] = await newPdf.copyPages(pdfDoc, [pageIndex]);
        newPdf.addPage(copiedPage);

        // Add duplicates if this page is selected
        if (pages.includes(pageNumber)) {
          for (let dup = 0; dup < duplicateCount; dup++) {
            const [duplicatedPage] = await newPdf.copyPages(pdfDoc, [pageIndex]);
            newPdf.addPage(duplicatedPage);
          }
        }

        setProgress(30 + Math.round(((i + 1) / originalPages.length) * 60));
      }

      setProgress(95);

      const pdfBytes = await newPdf.save();
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${pdfFile.name.replace('.pdf', '')}-duplicated.pdf`;
      a.click();
      URL.revokeObjectURL(url);

      const finalPageCount = newPdf.getPageCount();
      setProgress(100);
      setSuccess(`Successfully duplicated ${pages.length} page(s) ${duplicateCount} time(s) each. Final PDF has ${finalPageCount} pages (was ${originalPageCount}).`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to duplicate pages');
    }

    setProcessing(false);
    setTimeout(() => setProgress(0), 1000);
  };

  const getPagePreview = () => {
    if (!pagesToDuplicate.trim()) return [];

    try {
      const pages = parsePageRanges(pagesToDuplicate);
      return pages.slice(0, 8); // Show first 8 pages to duplicate
    } catch {
      return [];
    }
  };

  const clearFile = () => {
    setPdfFile(null);
    setPagesToDuplicate('');
    setTotalPages(null);
    setError('');
    setSuccess('');
  };

  const handleQuickAction = (action: string) => {
    if (!totalPages) return;

    switch (action) {
      case 'first':
        setPagesToDuplicate('1');
        break;
      case 'last':
        setPagesToDuplicate(totalPages.toString());
        break;
      case 'first-two':
        setPagesToDuplicate('1,2');
        break;
      case 'all':
        setPagesToDuplicate(`1-${totalPages}`);
        break;
    }
  };

  return (
    <main className={styles.container}>
      <h1 className={styles.pageTitle}>
        <span className={styles.icon}>📋</span>
        <span className={styles.textGradient}>Duplicate PDF Pages</span>
      </h1>
      <p className={styles.description}>Create copies of specific pages within your PDF document</p>

      <div className={styles.converter}>
        <div className={styles.inputSection}>
          <div
            className={`${styles.dropZone} ${dragOver ? styles.dragOver : ''}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <div className={styles.fileInput}>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                className={styles.hiddenInput}
                id="pdf-file"
              />
              <label htmlFor="pdf-file" className={styles.fileLabel}>
                {pdfFile ? pdfFile.name : '📂 Choose PDF File'}
              </label>
            </div>
            <p className={styles.dropText}>or drag and drop your PDF here</p>
          </div>

          {pdfFile && (
            <div className={styles.fileInfo}>
              <p><strong>File:</strong> {pdfFile.name} ({(pdfFile.size / 1024 / 1024).toFixed(2)} MB)</p>
              {totalPages && <p><strong>Total Pages:</strong> {totalPages}</p>}
              <button onClick={clearFile} className={styles.clearBtn}>Change File</button>
            </div>
          )}

          {pdfFile && (
            <div className={styles.pageInput}>
              <label htmlFor="pages">Pages to Duplicate:</label>
              <textarea
                id="pages"
                value={pagesToDuplicate}
                onChange={(e) => setPagesToDuplicate(e.target.value)}
                placeholder="e.g., 1,3,5-7,10"
                className={styles.pageTextarea}
                rows={3}
                disabled={processing}
              />
              <div className={styles.inputHelp}>
                <p><strong>Examples:</strong></p>
                <ul>
                  <li>Single page: <code>5</code></li>
                  <li>Multiple pages: <code>1,3,5</code></li>
                  <li>Page range: <code>5-10</code></li>
                  <li>Mixed: <code>1,3,5-7,10</code></li>
                </ul>
              </div>
            </div>
          )}

          {pdfFile && (
            <div className={styles.duplicateOptions}>
              <label htmlFor="count">Number of Copies per Page:</label>
              <select
                id="count"
                value={duplicateCount}
                onChange={(e) => setDuplicateCount(parseInt(e.target.value))}
                className={styles.countSelect}
                disabled={processing}
              >
                <option value={1}>1 copy</option>
                <option value={2}>2 copies</option>
                <option value={3}>3 copies</option>
                <option value={4}>4 copies</option>
                <option value={5}>5 copies</option>
              </select>
            </div>
          )}

          {processing && (
            <div className={styles.progressContainer}>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${progress}%` }}></div>
              </div>
              <p>{progress}% complete</p>
            </div>
          )}

          <button
            onClick={duplicatePages}
            disabled={!pdfFile || !pagesToDuplicate.trim() || processing}
            className={styles.convertBtn}
          >
            {processing ? 'Duplicating Pages...' : 'Duplicate Pages'}
          </button>

          {error && <div className={styles.error}>{error}</div>}
          {success && <div className={styles.success}>{success}</div>}
        </div>

        <div className={styles.previewSection}>
          <h3>Pages to Duplicate Preview</h3>

          <div className={styles.pagePreview}>
            {getPagePreview().length > 0 ? (
              <div className={styles.pageList}>
                <p><strong>Pages marked for duplication:</strong></p>
                <div className={styles.pageNumbers}>
                  {getPagePreview().map((page, index) => (
                    <span key={index} className={styles.pageNumber}>
                      {page}
                    </span>
                  ))}
                  {getPagePreview().length >= 8 && (
                    <span className={styles.morePages}>...</span>
                  )}
                </div>
                <p className={styles.duplicateInfo}>
                  Each selected page will be duplicated {duplicateCount} time{duplicateCount > 1 ? 's' : ''}.
                </p>
              </div>
            ) : (
              <div className={styles.noPages}>
                <p>📄 Enter page numbers to see preview</p>
                <p className={styles.hint}>Use commas for multiple pages, hyphens for ranges</p>
              </div>
            )}
          </div>

          <div className={styles.duplicationGuide}>
            <h4>Duplication Guide</h4>
            <div className={styles.guideContent}>
              <div className={styles.guideItem}>
                <strong>Page Order:</strong> Duplicates are inserted immediately after original pages
              </div>
              <div className={styles.guideItem}>
                <strong>Page Numbering:</strong> All pages after duplicates are renumbered
              </div>
              <div className={styles.guideItem}>
                <strong>File Size:</strong> PDF size will increase proportionally
              </div>
              <div className={styles.guideItem}>
                <strong>Bookmarks:</strong> May need adjustment after duplication
              </div>
            </div>
          </div>

          {totalPages && (
            <div className={styles.quickActions}>
              <h4>Quick Actions</h4>
              <div className={styles.actionButtons}>
                <button
                  onClick={() => handleQuickAction('first')}
                  className={styles.quickBtn}
                >
                  Duplicate First Page
                </button>
                <button
                  onClick={() => handleQuickAction('last')}
                  className={styles.quickBtn}
                >
                  Duplicate Last Page
                </button>
                <button
                  onClick={() => handleQuickAction('first-two')}
                  className={styles.quickBtn}
                >
                  Duplicate First Two
                </button>
                <button
                  onClick={() => handleQuickAction('all')}
                  className={styles.quickBtn}
                >
                  Duplicate All Pages
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <ToolInfo
        howItWorks="Upload your PDF file<br>Specify pages to duplicate (e.g., 1,3,5-7)<br>Set number of copies per page<br>Click 'Duplicate Pages' to download modified PDF"
        faqs={[
          { title: "Where are duplicated pages inserted?", content: "Duplicates are inserted immediately after their original pages in the PDF." },
          { title: "Does page numbering change?", content: "Yes, all pages after the duplicated pages will be renumbered sequentially." },
          { title: "Can I duplicate the same page multiple times?", content: "Yes, each selected page will be duplicated the specified number of times." },
          { title: "Will bookmarks be preserved?", content: "Bookmarks pointing to pages after duplicates will be automatically adjusted." }
        ]}
        tips={["Use for creating templates or forms<br>Duplicate title pages for sections<br>Perfect for creating practice worksheets<br>Check page count after duplication"]}
      />
    </main>
  );
}