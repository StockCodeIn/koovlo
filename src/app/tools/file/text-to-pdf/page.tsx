'use client';

import { useState } from 'react';
import ToolInfo from '@/components/ToolInfo';
import styles from './texttopdf.module.css';

export default function TextToPDF() {
  const [text, setText] = useState('');
  const [fontSize, setFontSize] = useState(12);
  const [fontFamily, setFontFamily] = useState('Arial');
  const [pageSize, setPageSize] = useState('A4');
  const [orientation, setOrientation] = useState('portrait');
  const [converting, setConverting] = useState(false);
  const [error, setError] = useState('');

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const convertToPDF = async () => {
    if (!text.trim()) {
      setError('Please enter some text to convert');
      return;
    }

    setConverting(true);
    setError('');

    try {
      // In a real implementation, this would use pdf-lib or jsPDF
      // For now, we'll show a placeholder
      setError('PDF generation requires client-side PDF library. This feature is under development.');

      setTimeout(() => {
        setConverting(false);
      }, 2000);

    } catch (err) {
      setError('Failed to convert text to PDF');
      setConverting(false);
    }
  };

  const clearText = () => {
    setText('');
    setError('');
  };

  const loadSample = () => {
    setText(`Sample Document

This is a sample text document that can be converted to PDF.

Features:
• Custom font size and family
• Different page sizes (A4, Letter, etc.)
• Portrait and landscape orientation
• Clean, professional output

You can type or paste your own text here and convert it to a PDF file.`);
  };

  return (
    <main className={styles.container}>
      <h1>Text to PDF Converter</h1>
      <p>Convert plain text to PDF with custom formatting options</p>

      <div className={styles.converter}>
        <div className={styles.inputSection}>
          <div className={styles.inputHeader}>
            <h2>Enter Your Text</h2>
            <div className={styles.inputActions}>
              <button onClick={loadSample} className={styles.sampleBtn}>
                Load Sample
              </button>
              <button onClick={clearText} className={styles.clearBtn}>
                Clear
              </button>
            </div>
          </div>

          <textarea
            value={text}
            onChange={handleTextChange}
            placeholder="Type or paste your text here..."
            className={styles.textarea}
          />

          <div className={styles.options}>
            <div className={styles.optionGroup}>
              <label>Font Size:</label>
              <select
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className={styles.select}
              >
                <option value={8}>8pt</option>
                <option value={10}>10pt</option>
                <option value={12}>12pt</option>
                <option value={14}>14pt</option>
                <option value={16}>16pt</option>
                <option value={18}>18pt</option>
                <option value={20}>20pt</option>
                <option value={24}>24pt</option>
              </select>
            </div>

            <div className={styles.optionGroup}>
              <label>Font Family:</label>
              <select
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
                className={styles.select}
              >
                <option value="Arial">Arial</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Courier New">Courier New</option>
                <option value="Georgia">Georgia</option>
                <option value="Verdana">Verdana</option>
              </select>
            </div>

            <div className={styles.optionGroup}>
              <label>Page Size:</label>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(e.target.value)}
                className={styles.select}
              >
                <option value="A4">A4</option>
                <option value="Letter">Letter</option>
                <option value="Legal">Legal</option>
                <option value="A3">A3</option>
              </select>
            </div>

            <div className={styles.optionGroup}>
              <label>Orientation:</label>
              <select
                value={orientation}
                onChange={(e) => setOrientation(e.target.value)}
                className={styles.select}
              >
                <option value="portrait">Portrait</option>
                <option value="landscape">Landscape</option>
              </select>
            </div>
          </div>

          <button
            onClick={convertToPDF}
            disabled={!text.trim() || converting}
            className={styles.convertBtn}
          >
            {converting ? 'Converting...' : 'Convert to PDF'}
          </button>

          {error && <div className={styles.error}>{error}</div>}
        </div>

        <div className={styles.previewSection}>
          <h2>Preview & Stats</h2>

          <div className={styles.preview}>
            <div
              className={styles.previewContent}
              style={{
                fontSize: `${fontSize}px`,
                fontFamily: fontFamily,
              }}
            >
              {text || 'Your text preview will appear here...'}
            </div>
          </div>

          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Characters:</span>
              <span className={styles.statValue}>{text.length}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Words:</span>
              <span className={styles.statValue}>{text.trim() ? text.trim().split(/\s+/).length : 0}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Lines:</span>
              <span className={styles.statValue}>{text.split('\n').length}</span>
            </div>
          </div>
        </div>
      </div>

      <ToolInfo
        howItWorks="Enter or paste your text in the input area<br>Customize font, size, and page settings<br>Click 'Convert to PDF' to download<br>PDF will be generated with your formatting"
        faqs={[
          { title: "What formatting is preserved?", content: "Basic text formatting. Line breaks and paragraphs are maintained." },
          { title: "Can I add images or colors?", content: "Currently supports plain text only. Rich formatting requires additional libraries." },
          { title: "What page sizes are supported?", content: "A4, Letter, Legal, and A3 page sizes." },
          { title: "Is the PDF editable?", content: "Generated PDFs contain text that can be selected and copied." }
        ]}
        tips={["Use for creating simple documents from text<br>Choose appropriate font size for readability<br>Portrait works best for most documents<br>All processing happens locally for privacy"]}
      />
    </main>
  );
}