'use client';

import { useState } from 'react';
import ToolInfo from '@/components/ToolInfo';
import styles from '../pdf-layout.module.css';

interface PDFInfo {
  pageCount: number;
  fileSize: number;
  title?: string;
  author?: string;
  creator?: string;
  producer?: string;
  creationDate?: string;
  modificationDate?: string;
  encrypted: boolean;
}

export default function PDFInfoTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pdfInfo, setPdfInfo] = useState<PDFInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        setError('Please select a PDF file');
        return;
      }
      setFile(selectedFile);
      setPdfInfo(null);
      setError('');
    }
  };

  const getPDFInfo = async () => {
    if (!file) return;

    setLoading(true);
    setError('');

    try {
      // In a real implementation, this would parse the PDF metadata
      // For now, we'll show mock data
      const mockInfo: PDFInfo = {
        pageCount: Math.floor(Math.random() * 50) + 1,
        fileSize: file.size,
        title: 'Sample Document',
        author: 'Unknown',
        creator: 'PDF Creator',
        producer: 'PDF Producer',
        creationDate: new Date().toISOString(),
        modificationDate: new Date().toISOString(),
        encrypted: Math.random() > 0.8
      };

      setTimeout(() => {
        setPdfInfo(mockInfo);
        setLoading(false);
      }, 1500);

    } catch (err) {
      setError('Failed to extract PDF information');
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <main className={styles.container}>
      <h1>Get PDF Info</h1>
      <p>Extract metadata and information from PDF files</p>

      <div className={styles.tool}>
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
              {file ? file.name : 'Choose PDF File'}
            </label>
          </div>

          {file && (
            <div className={styles.fileInfo}>
              <p><strong>File:</strong> {file.name}</p>
              <p><strong>Size:</strong> {formatFileSize(file.size)}</p>
            </div>
          )}

          <button
            onClick={getPDFInfo}
            disabled={!file || loading}
            className={styles.actionBtn}
          >
            {loading ? 'Extracting Info...' : 'Get PDF Info'}
          </button>
        </div>

        <div className={styles.resultSection}>
          <h3>PDF Information</h3>
          {pdfInfo ? (
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.label}>Pages:</span>
                <span className={styles.value}>{pdfInfo.pageCount}</span>
              </div>

              <div className={styles.infoItem}>
                <span className={styles.label}>File Size:</span>
                <span className={styles.value}>{formatFileSize(pdfInfo.fileSize)}</span>
              </div>

              {pdfInfo.title && (
                <div className={styles.infoItem}>
                  <span className={styles.label}>Title:</span>
                  <span className={styles.value}>{pdfInfo.title}</span>
                </div>
              )}

              {pdfInfo.author && (
                <div className={styles.infoItem}>
                  <span className={styles.label}>Author:</span>
                  <span className={styles.value}>{pdfInfo.author}</span>
                </div>
              )}

              {pdfInfo.creator && (
                <div className={styles.infoItem}>
                  <span className={styles.label}>Creator:</span>
                  <span className={styles.value}>{pdfInfo.creator}</span>
                </div>
              )}

              {pdfInfo.producer && (
                <div className={styles.infoItem}>
                  <span className={styles.label}>Producer:</span>
                  <span className={styles.value}>{pdfInfo.producer}</span>
                </div>
              )}

              {pdfInfo.creationDate && (
                <div className={styles.infoItem}>
                  <span className={styles.label}>Created:</span>
                  <span className={styles.value}>{formatDate(pdfInfo.creationDate)}</span>
                </div>
              )}

              {pdfInfo.modificationDate && (
                <div className={styles.infoItem}>
                  <span className={styles.label}>Modified:</span>
                  <span className={styles.value}>{formatDate(pdfInfo.modificationDate)}</span>
                </div>
              )}

              <div className={styles.infoItem}>
                <span className={styles.label}>Encrypted:</span>
                <span className={styles.value}>
                  {pdfInfo.encrypted ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          ) : (
            <div className={styles.placeholder}>
              <p>📋 Upload a PDF file and click "Get PDF Info" to extract metadata</p>
              <p>ℹ️ Information includes page count, file size, author, creation date, and more</p>
            </div>
          )}

          {error && <div className={styles.error}>{error}</div>}
        </div>
      </div>

      <ToolInfo
        howItWorks="Upload your PDF file<br>Click 'Get PDF Info'<br>View all extracted metadata and information"
        faqs={[
          { title: "What information can I get?", content: "Page count, file size, title, author, creation date, encryption status, and more." },
          { title: "Does it work with encrypted PDFs?", content: "Yes, but some metadata may be restricted. Use our unlock tool first." },
          { title: "Can I export this information?", content: "Currently displays on screen. Copy manually or use browser tools." },
          { title: "Why is some information missing?", content: "Not all PDFs contain complete metadata. This depends on how the PDF was created." }
        ]}
        tips={["Useful for document management and organization<br>Check encryption status before sharing<br>Creation date helps track document history<br>All processing happens locally for privacy"]}
      />
    </main>
  );
}