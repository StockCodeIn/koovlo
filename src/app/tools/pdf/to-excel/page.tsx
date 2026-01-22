'use client';

import { useState } from 'react';
import ToolInfo from '@/components/ToolInfo';
import styles from '../pdf-layout.module.css';

export default function PDFToExcel() {
  const [file, setFile] = useState<File | null>(null);
  const [converting, setConverting] = useState(false);
  const [error, setError] = useState('');

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        setError('Please select a PDF file');
        return;
      }
      setFile(selectedFile);
      setError('');
    }
  };

  const convertToExcel = async () => {
    if (!file) return;

    setConverting(true);
    setError('');

    try {
      // In a real implementation, this would use a PDF parsing library
      // For now, we'll show a placeholder implementation
      setError('PDF to Excel conversion requires server-side processing. This tool is under development.');
    } catch (err) {
      setError('Failed to convert PDF to Excel');
    } finally {
      setConverting(false);
    }
  };

  return (
    <main className={styles.container}>
      <h1>PDF to Excel Converter</h1>
      <p>Convert PDF files to Excel spreadsheets (.xlsx format)</p>

      <div className={styles.converter}>
        <div className={styles.uploadSection}>
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
              <p>File: {file.name}</p>
              <p>Size: {(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          )}

          <button
            onClick={convertToExcel}
            disabled={!file || converting}
            className={styles.convertBtn}
          >
            {converting ? 'Converting...' : 'Convert to Excel'}
          </button>

          {error && <div className={styles.error}>{error}</div>}
        </div>

        <div className={styles.preview}>
          <h3>Conversion Preview</h3>
          <div className={styles.previewContent}>
            <p>📊 Excel conversion will extract tables and data from your PDF</p>
            <p>📋 Supports multiple sheets if your PDF has multiple tables</p>
            <p>⚠️ Note: Complex layouts may require manual adjustment</p>
          </div>
        </div>
      </div>

      <ToolInfo
        howItWorks="Upload your PDF file<br>Click 'Convert to Excel'<br>Download the generated Excel file<br>Review and adjust formatting if needed"
        faqs={[
          { title: "What types of PDFs work best?", content: "PDFs with clear tables and structured data convert best. Scanned documents may not convert accurately." },
          { title: "Does it preserve formatting?", content: "Basic table structure is preserved, but complex formatting may need manual adjustment." },
          { title: "Can I convert multiple PDFs?", content: "Currently supports one PDF at a time. Use our PDF merge tool first if needed." },
          { title: "What if my PDF has images?", content: "Images in PDFs cannot be converted to Excel format." }
        ]}
        tips={["Ensure your PDF has clear, structured tables", "Use high-quality PDFs for better results", "Review the Excel output before using", "Complex layouts may need manual cleanup"]}
      />
    </main>
  );
}