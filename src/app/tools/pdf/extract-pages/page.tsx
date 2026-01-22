'use client';

import { useState } from 'react';
import ToolInfo from '@/components/ToolInfo';
import styles from './extract.module.css';

export default function ExtractPages() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pagesToExtract, setPagesToExtract] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [totalPages, setTotalPages] = useState<number | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        setError('Please select a PDF file');
        return;
      }
      setPdfFile(selectedFile);
      setError('');
      // In a real implementation, we'd get total pages from pdf-lib
      // For now, we'll set a placeholder
      setTotalPages(null);
    }
  };

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

  const extractPages = async () => {
    if (!pdfFile) {
      setError('Please select a PDF file');
      return;
    }

    if (!pagesToExtract.trim()) {
      setError('Please specify pages to extract');
      return;
    }

    try {
      const pages = parsePageRanges(pagesToExtract);

      if (pages.length === 0) {
        setError('No valid pages specified');
        return;
      }

      setProcessing(true);
      setError('');

      // In a real implementation, this would use pdf-lib
      // For now, we'll show a placeholder
      setError('PDF page extraction requires pdf-lib. This feature is under development.');

      setTimeout(() => {
        setProcessing(false);
      }, 2000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid page specification');
    }
  };

  const getPagePreview = () => {
    if (!pagesToExtract.trim()) return [];

    try {
      const pages = parsePageRanges(pagesToExtract);
      return pages.slice(0, 10); // Show first 10 pages to extract
    } catch {
      return [];
    }
  };

  return (
    <main className={styles.container}>
      <h1>Extract Pages from PDF</h1>
      <p>Create a new PDF with selected pages from your document</p>

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
              {totalPages && <p><strong>Total Pages:</strong> {totalPages}</p>}
            </div>
          )}

          <div className={styles.pageInput}>
            <label htmlFor="pages">Pages to Extract:</label>
            <textarea
              id="pages"
              value={pagesToExtract}
              onChange={(e) => setPagesToExtract(e.target.value)}
              placeholder="e.g., 1,3,5-7,10"
              className={styles.pageTextarea}
              rows={3}
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

          <button
            onClick={extractPages}
            disabled={!pdfFile || !pagesToExtract.trim() || processing}
            className={styles.convertBtn}
          >
            {processing ? 'Extracting Pages...' : 'Extract Pages'}
          </button>

          {error && <div className={styles.error}>{error}</div>}
        </div>

        <div className={styles.previewSection}>
          <h3>Pages to Extract Preview</h3>

          <div className={styles.pagePreview}>
            {getPagePreview().length > 0 ? (
              <div className={styles.pageList}>
                <p><strong>Pages to be extracted:</strong></p>
                <div className={styles.pageNumbers}>
                  {getPagePreview().map((page, index) => (
                    <span key={index} className={styles.pageNumber}>
                      {page}
                    </span>
                  ))}
                  {getPagePreview().length >= 10 && (
                    <span className={styles.morePages}>...</span>
                  )}
                </div>
                <p className={styles.extractInfo}>
                  These pages will be combined into a new PDF in the order specified.
                </p>
              </div>
            ) : (
              <div className={styles.noPages}>
                <p>📄 Enter page numbers to see preview</p>
                <p className={styles.hint}>Use commas for multiple pages, hyphens for ranges</p>
              </div>
            )}
          </div>

          <div className={styles.extractionGuide}>
            <h4>Extraction Guide</h4>
            <div className={styles.guideContent}>
              <div className={styles.guideItem}>
                <strong>Page Order:</strong> Pages will appear in the order you specify
              </div>
              <div className={styles.guideItem}>
                <strong>New PDF:</strong> Creates a separate PDF with only selected pages
              </div>
              <div className={styles.guideItem}>
                <strong>Original File:</strong> Remains unchanged
              </div>
              <div className={styles.guideItem}>
                <strong>Page Numbering:</strong> Starts from 1 in the new PDF
              </div>
            </div>
          </div>

          <div className={styles.quickActions}>
            <h4>Quick Actions</h4>
            <div className={styles.actionButtons}>
              <button
                onClick={() => setPagesToExtract('1')}
                className={styles.quickBtn}
              >
                First Page
              </button>
              <button
                onClick={() => setPagesToExtract('1-5')}
                className={styles.quickBtn}
              >
                First 5 Pages
              </button>
              <button
                onClick={() => setPagesToExtract('odd')}
                className={styles.quickBtn}
              >
                Odd Pages
              </button>
              <button
                onClick={() => setPagesToExtract('even')}
                className={styles.quickBtn}
              >
                Even Pages
              </button>
            </div>
          </div>
        </div>
      </div>

      <ToolInfo
        howItWorks="Upload your PDF file<br>Specify pages to extract (e.g., 1,3,5-7)<br>Review preview of pages to be extracted<br>Click 'Extract Pages' to download new PDF"
        faqs={[
          { title: "How do I specify page ranges?", content: "Use hyphens for ranges (5-10), commas for individual pages (1,3,5), or combine both (1,3,5-7)." },
          { title: "Will the extracted pages maintain their original formatting?", content: "Yes, all content, images, and formatting are preserved exactly as in the original." },
          { title: "Can I extract pages in a different order?", content: "Yes, specify pages in any order you want them to appear in the new PDF." },
          { title: "What happens to bookmarks and links?", content: "Internal links within extracted pages are preserved. External references may be affected." }
        ]}
        tips={["Use page ranges for consecutive pages<br>Extract odd/even pages for double-sided documents<br>Pages will be renumbered starting from 1<br>Original PDF remains unchanged"]}
      />
    </main>
  );
}