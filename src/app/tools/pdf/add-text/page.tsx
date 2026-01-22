'use client';

import { useState } from 'react';
import ToolInfo from '@/components/ToolInfo';
import styles from '../pdf-layout.module.css';

export default function AddTextToPDF() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState('');
  const [x, setX] = useState(100);
  const [y, setY] = useState(100);
  const [fontSize, setFontSize] = useState(12);
  const [color, setColor] = useState('#000000');
  const [page, setPage] = useState(1);
  const [processing, setProcessing] = useState(false);
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

  const addTextToPDF = async () => {
    if (!file || !text.trim()) {
      setError('Please select a PDF file and enter text');
      return;
    }

    setProcessing(true);
    setError('');

    try {
      // In a real implementation, this would use pdf-lib
      // For now, we'll show a placeholder
      setError('PDF text addition requires pdf-lib. This feature is under development.');

      setTimeout(() => {
        setProcessing(false);
      }, 2000);

    } catch (err) {
      setError('Failed to add text to PDF');
      setProcessing(false);
    }
  };

  return (
    <main className={styles.container}>
      <h1>Add Text to PDF</h1>
      <p>Add custom text to any page of your PDF document</p>

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
              {file ? file.name : 'Choose PDF File'}
            </label>
          </div>

          {file && (
            <div className={styles.fileInfo}>
              <p><strong>File:</strong> {file.name}</p>
              <p><strong>Size:</strong> {(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          )}

          <div className={styles.textInput}>
            <label htmlFor="text">Text to Add:</label>
            <textarea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter the text you want to add..."
              className={styles.textarea}
              rows={3}
            />
          </div>

          <div className={styles.options}>
            <div className={styles.optionGroup}>
              <label htmlFor="page">Page Number:</label>
              <input
                id="page"
                type="number"
                min="1"
                value={page}
                onChange={(e) => setPage(parseInt(e.target.value) || 1)}
                className={styles.numberInput}
              />
            </div>

            <div className={styles.optionGroup}>
              <label htmlFor="x">X Position:</label>
              <input
                id="x"
                type="number"
                min="0"
                value={x}
                onChange={(e) => setX(parseInt(e.target.value) || 0)}
                className={styles.numberInput}
              />
            </div>

            <div className={styles.optionGroup}>
              <label htmlFor="y">Y Position:</label>
              <input
                id="y"
                type="number"
                min="0"
                value={y}
                onChange={(e) => setY(parseInt(e.target.value) || 0)}
                className={styles.numberInput}
              />
            </div>

            <div className={styles.optionGroup}>
              <label htmlFor="fontSize">Font Size:</label>
              <input
                id="fontSize"
                type="number"
                min="6"
                max="72"
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value) || 12)}
                className={styles.numberInput}
              />
            </div>

            <div className={styles.optionGroup}>
              <label htmlFor="color">Text Color:</label>
              <input
                id="color"
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className={styles.colorInput}
              />
            </div>
          </div>

          <button
            onClick={addTextToPDF}
            disabled={!file || !text.trim() || processing}
            className={styles.convertBtn}
          >
            {processing ? 'Adding Text...' : 'Add Text to PDF'}
          </button>

          {error && <div className={styles.error}>{error}</div>}
        </div>

        <div className={styles.previewSection}>
          <h3>Position Preview</h3>
          <div className={styles.preview}>
            <div className={styles.pagePreview}>
              <div
                className={styles.textPreview}
                style={{
                  left: `${Math.min(x, 350)}px`,
                  top: `${Math.min(y, 500)}px`,
                  fontSize: `${fontSize}px`,
                  color: color
                }}
              >
                {text || 'Your text here'}
              </div>
            </div>
          </div>

          <div className={styles.positionGuide}>
            <h4>Position Guide</h4>
            <p><strong>X Position:</strong> Horizontal position from left edge (0-595 for A4)</p>
            <p><strong>Y Position:</strong> Vertical position from bottom edge (0-842 for A4)</p>
            <p><strong>Page:</strong> Page number where text will be added</p>
            <p><strong>Font Size:</strong> Text size in points</p>
          </div>
        </div>
      </div>

      <ToolInfo
        howItWorks="Upload your PDF file<br>Enter the text you want to add<br>Set position (X, Y coordinates) and page number<br>Customize font size and color<br>Click 'Add Text to PDF' to download"
        faqs={[
          { title: "What coordinate system is used?", content: "X,Y coordinates in points (72 points = 1 inch). Origin (0,0) is bottom-left corner." },
          { title: "Can I add text to multiple pages?", content: "Currently supports one page at a time. Use multiple times for different pages." },
          { title: "What if my text is too long?", content: "Long text will wrap. Consider breaking into multiple additions for better control." },
          { title: "Can I change font style?", content: "Currently supports standard fonts. Font selection may be added in future updates." }
        ]}
        tips={["Use the preview to position your text accurately<br>Start with small font sizes and increase as needed<br>Consider PDF page size when setting coordinates<br>Test with sample text before final positioning"]}
      />
    </main>
  );
}