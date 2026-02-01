// src/app/tools/pdf/page-range-split/page.tsx
'use client';

import { useState, useCallback } from 'react';
import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';
import ToolInfo from '@/components/ToolInfo';
import styles from './page.module.css';

export default function PdfPageRangeSplitPage() {
  const [file, setFile] = useState<File | null>(null);
  const [ranges, setRanges] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [previewRanges, setPreviewRanges] = useState<string[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [progress, setProgress] = useState(0);
  const [totalPages, setTotalPages] = useState<number | null>(null);

  const handleFile = useCallback((selectedFile: File) => {
    if (selectedFile.type !== 'application/pdf') {
      setError('Please select a valid PDF file.');
      return;
    }
    setFile(selectedFile);
    setError('');
    // Get total pages
    selectedFile.arrayBuffer().then(bytes => {
      PDFDocument.load(bytes).then(pdf => {
        setTotalPages(pdf.getPageCount());
      });
    });
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
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

  const parseRanges = (rangeStr: string): number[][] => {
    const rangesArray: number[][] = [];
    const parts = rangeStr.split(',').map(p => p.trim());

    for (const part of parts) {
      if (part.includes('-')) {
        const [start, end] = part.split('-').map(n => parseInt(n.trim()));
        if (start && end && start <= end) {
          rangesArray.push(Array.from({ length: end - start + 1 }, (_, i) => start + i));
        }
      } else {
        const page = parseInt(part);
        if (page) {
          rangesArray.push([page]);
        }
      }
    }

    return rangesArray;
  };

  const handleRangesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRanges(e.target.value);
    const parsed = parseRanges(e.target.value);
    setPreviewRanges(
      parsed.map(
        (range, i) => `File ${i + 1}: Pages ${range.join(", ")}`
      )
    );
  };

  const splitPdf = async () => {
    if (!file || !ranges.trim()) {
      setError('Please select a file and enter page ranges.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    setProgress(0);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const totalPages = pdfDoc.getPageCount();

      const rangesArray = parseRanges(ranges);
      if (rangesArray.length === 0) {
        setError('No valid ranges found.');
        setLoading(false);
        return;
      }

      setProgress(10);
      const zip = new JSZip();

      for (let i = 0; i < rangesArray.length; i++) {
        const range = rangesArray[i];
        const newPdf = await PDFDocument.create();

        for (const pageNum of range) {
          const pageIndex = pageNum - 1;
          if (pageIndex >= 0 && pageIndex < totalPages) {
            const [copiedPage] = await newPdf.copyPages(pdfDoc, [pageIndex]);
            newPdf.addPage(copiedPage);
          }
        }

        const pdfBytes = await newPdf.save();
        zip.file(`split-${i + 1}.pdf`, pdfBytes);
        setProgress(10 + Math.round(((i + 1) / rangesArray.length) * 80));
      }

      setProgress(95);
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = "page-range-split-pdfs.zip";
      a.click();
      URL.revokeObjectURL(url);

      setProgress(100);
      setSuccess('PDF split successfully!');
    } catch (err) {
      setError('Failed to split PDF. Please try again.');
    }

    setLoading(false);
    setTimeout(() => setProgress(0), 1000);
  };

  const clearFile = () => {
    setFile(null);
    setRanges('');
    setPreviewRanges([]);
    setTotalPages(null);
    setError('');
    setSuccess('');
  };

  return (
    <main className={styles.container}>
      <h1 className={styles.pageTitle}>
        <span className={styles.icon}>📄</span>
        <span className={styles.textGradient}>Page Range Split</span>
      </h1>

      <p className={styles.description}>Split PDF into multiple files based on page ranges.</p>

      <div 
        className={`${styles.dropZone} ${dragOver ? styles.dragOver : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <label className={styles.fileInput}>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            disabled={loading}
          />
          <span>{file ? file.name : "📂 Choose PDF File"}</span>
        </label>
        <p className={styles.dropText}>or drag and drop your PDF here</p>
        {file && (
          <div className={styles.fileInfo}>
            <p><strong>Size:</strong> {(file.size / 1024 / 1024).toFixed(2)} MB</p>
            {totalPages && <p><strong>Total Pages:</strong> {totalPages}</p>}
            <button onClick={clearFile} className={styles.clearBtn}>Change File</button>
          </div>
        )}
      </div>

      {file && (
        <div className={styles.inputGroup}>
          <label>Page Ranges:</label>
          <input
            type="text"
            placeholder="e.g. 1-5,7,10-15"
            value={ranges}
            onChange={handleRangesChange}
            disabled={loading}
          />
          <div className={styles.inputHelp}>
            <p><strong>Examples:</strong></p>
            <ul>
              <li>Single range: <code>1-5</code></li>
              <li>Multiple ranges: <code>1-5,7,10-15</code></li>
              <li>Mixed: <code>1-3,5,7-10</code></li>
            </ul>
          </div>
        </div>
      )}

      {previewRanges.length > 0 && (
        <div className={styles.preview}>
          <h3>Split Preview:</h3>
          <div className={styles.previewList}>
            {previewRanges.map((range, index) => (
              <div key={index} className={styles.rangeItem}>
                {range}
              </div>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div className={styles.progressContainer}>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }}></div>
          </div>
          <p>{progress}% complete</p>
        </div>
      )}

      <button
        onClick={splitPdf}
        disabled={!file || loading || !ranges.trim()}
        className={styles.button}
      >
        {loading ? 'Splitting...' : 'Split PDF'}
      </button>

      {error && <div className={styles.error}>{error}</div>}
      {success && <div className={styles.success}>{success}</div>}

      <ToolInfo
        howItWorks="1. Upload PDF file<br>2. Specify page ranges (e.g., 1-5,7,10-15)<br>3. Download ZIP file with split PDFs"
        faqs={[
          { title: "How to specify ranges?", content: "Use formats like 1-5, 7, 10-15. Each range creates a separate PDF file." },
          { title: "What's the maximum pages?", content: "Depends on PDF size, typically up to 1000 pages." },
          { title: "What's in the ZIP file?", content: "Each split range becomes a separate PDF file (split-1.pdf, split-2.pdf, etc.)" }
        ]}
        tips={["Verify page ranges before splitting", "Each comma-separated range creates a new PDF", "Use for organizing large documents into chapters or sections"]}
      />
    </main>
  );
}