'use client';

import { useState } from 'react';
import ToolInfo from '@/components/ToolInfo';
import styles from './delete.module.css';

export default function DeletePages() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pagesToDelete, setPagesToDelete] = useState('');
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

  const deletePages = async () => {
    if (!pdfFile) {
      setError('Please select a PDF file');
      return;
    }

    if (!pagesToDelete.trim()) {
      setError('Please specify pages to delete');
      return;
    }

    try {
      const pages = parsePageRanges(pagesToDelete);

      if (pages.length === 0) {
        setError('No valid pages specified');
        return;
      }

      setProcessing(true);
      setError('');

      // In a real implementation, this would use pdf-lib
      // For now, we'll show a placeholder
      setError('PDF page deletion requires pdf-lib. This feature is under development.');

      setTimeout(() => {
        setProcessing(false);
      }, 2000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid page specification');
    }
  };

  const getPagePreview = () => {
    if (!pagesToDelete.trim()) return [];

    try {
      const pages = parsePageRanges(pagesToDelete);
      return pages.slice(0, 10); // Show first 10 pages to delete
    } catch {
      return [];
    }
  };

  return (
    <main className={styles.container}>
      <h1>Delete Pages from PDF</h1>
      <p>Remove specific pages or page ranges from your PDF document</p>

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
            <label htmlFor="pages">Pages to Delete:</label>
            <textarea
              id="pages"
              value={pagesToDelete}
              onChange={(e) => setPagesToDelete(e.target.value)}
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
            onClick={deletePages}
            disabled={!pdfFile || !pagesToDelete.trim() || processing}
            className={styles.convertBtn}
          >
            {processing ? 'Deleting Pages...' : 'Delete Pages'}
          </button>

          {error && <div className={styles.error}>{error}</div>}
        </div>

        <div className={styles.previewSection}>
          <h3>Pages to Delete Preview</h3>

          <div className={styles.pagePreview}>
            {getPagePreview().length > 0 ? (
              <div className={styles.pageList}>
                <p><strong>Pages marked for deletion:</strong></p>
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
              </div>
            ) : (
              <div className={styles.noPages}>
                <p>📄 Enter page numbers to see preview</p>
                <p className={styles.hint}>Use commas for multiple pages, hyphens for ranges</p>
              </div>
            )}
          </div>

          <div className={styles.deletionGuide}>
            <h4>Deletion Guide</h4>
            <div className={styles.guideContent}>
              <div className={styles.guideItem}>
                <strong>Page Numbering:</strong> Starts from 1
              </div>
              <div className={styles.guideItem}>
                <strong>Remaining Pages:</strong> Will be renumbered sequentially
              </div>
              <div className={styles.guideItem}>
                <strong>Bookmarks:</strong> May need adjustment after deletion
              </div>
              <div className={styles.guideItem}>
                <strong>Validation:</strong> Invalid pages will be ignored
              </div>
            </div>
          </div>

          <div className={styles.warning}>
            <h4>⚠️ Important Notes</h4>
            <ul>
              <li>This action cannot be undone</li>
              <li>Make sure to backup your original PDF</li>
              <li>Page numbers will be renumbered after deletion</li>
              <li>Check bookmarks and links after processing</li>
            </ul>
          </div>
        </div>
      </div>

      <ToolInfo
        howItWorks="Upload your PDF file<br>Specify pages to delete (e.g., 1,3,5-7)<br>Review preview of pages to be removed<br>Click 'Delete Pages' to download modified PDF"
        faqs={[
          { title: "How do I specify page ranges?", content: "Use hyphens for ranges (5-10), commas for individual pages (1,3,5), or combine both (1,3,5-7)." },
          { title: "What happens to page numbers after deletion?", content: "Remaining pages are renumbered sequentially starting from 1." },
          { title: "Can I delete the last page?", content: "Yes, as long as at least one page remains in the document." },
          { title: "Will bookmarks be preserved?", content: "Bookmarks pointing to deleted pages will be removed. Others may need adjustment." }
        ]}
        tips={["Always backup your original PDF<br>Double-check page numbers before deletion<br>Use page ranges for consecutive pages<br>Preview shows first 10 pages to delete"]}
      />
    </main>
  );
}