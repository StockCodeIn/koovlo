'use client';

import { useState } from 'react';
import ToolInfo from '@/components/ToolInfo';
import styles from './highlight.module.css';

export default function HighlightText() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [highlightText, setHighlightText] = useState('');
  const [highlightColor, setHighlightColor] = useState('#ffff00');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [wholeWords, setWholeWords] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

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

  const highlightTextInPDF = async () => {
    if (!pdfFile) {
      setError('Please select a PDF file');
      return;
    }

    if (!highlightText.trim()) {
      setError('Please enter text to highlight');
      return;
    }

    setProcessing(true);
    setError('');

    try {
      // In a real implementation, this would use pdf-lib and text extraction
      // For now, we'll show a placeholder
      setError('PDF text highlighting requires advanced PDF processing libraries. This feature is under development.');

      setTimeout(() => {
        setProcessing(false);
      }, 2000);

    } catch (err) {
      setError('Failed to highlight text in PDF');
      setProcessing(false);
    }
  };

  const presetColors = [
    { name: 'Yellow', value: '#ffff00' },
    { name: 'Green', value: '#90ee90' },
    { name: 'Blue', value: '#87ceeb' },
    { name: 'Pink', value: '#ffb6c1' },
    { name: 'Orange', value: '#ffa500' },
    { name: 'Purple', value: '#dda0dd' }
  ];

  return (
    <main className={styles.container}>
      <h1>Highlight Text in PDF</h1>
      <p>Find and highlight specific text in your PDF document</p>

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

          <div className={styles.textInput}>
            <label htmlFor="highlight-text">Text to Highlight:</label>
            <textarea
              id="highlight-text"
              value={highlightText}
              onChange={(e) => setHighlightText(e.target.value)}
              placeholder="Enter the text you want to highlight..."
              className={styles.textTextarea}
              rows={3}
            />
            <div className={styles.inputHelp}>
              <p><strong>Tips:</strong> You can enter multiple words or phrases. Each will be highlighted separately.</p>
            </div>
          </div>

          <div className={styles.colorSelector}>
            <h3>Highlight Color</h3>
            <div className={styles.colorOptions}>
              {presetColors.map((color) => (
                <button
                  key={color.value}
                  className={`${styles.colorBtn} ${highlightColor === color.value ? styles.active : ''}`}
                  onClick={() => setHighlightColor(color.value)}
                  style={{ backgroundColor: color.value }}
                >
                  {color.name}
                </button>
              ))}
              <div className={styles.customColor}>
                <input
                  type="color"
                  value={highlightColor}
                  onChange={(e) => setHighlightColor(e.target.value)}
                  className={styles.colorPicker}
                  title="Custom color"
                />
                <span>Custom</span>
              </div>
            </div>
          </div>

          <div className={styles.options}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={caseSensitive}
                onChange={(e) => setCaseSensitive(e.target.checked)}
                className={styles.checkbox}
              />
              Case sensitive
            </label>

            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={wholeWords}
                onChange={(e) => setWholeWords(e.target.checked)}
                className={styles.checkbox}
              />
              Whole words only
            </label>
          </div>

          <button
            onClick={highlightTextInPDF}
            disabled={!pdfFile || !highlightText.trim() || processing}
            className={styles.convertBtn}
          >
            {processing ? 'Highlighting Text...' : 'Highlight Text'}
          </button>

          {error && <div className={styles.error}>{error}</div>}
        </div>

        <div className={styles.previewSection}>
          <h3>Highlight Preview</h3>

          <div className={styles.previewBox}>
            <div className={styles.sampleText}>
              <p>This is a <span style={{ backgroundColor: highlightColor, padding: '2px 4px', borderRadius: '2px' }}>sample text</span> to show how highlighting will look.</p>
              <p>You can highlight <span style={{ backgroundColor: highlightColor, padding: '2px 4px', borderRadius: '2px' }}>multiple words</span> or <span style={{ backgroundColor: highlightColor, padding: '2px 4px', borderRadius: '2px' }}>phrases</span> in your document.</p>
            </div>
          </div>

          <div className={styles.highlightGuide}>
            <h4>How Highlighting Works</h4>
            <div className={styles.guideContent}>
              <div className={styles.guideItem}>
                <strong>Text Search:</strong> Searches through all text content in the PDF
              </div>
              <div className={styles.guideItem}>
                <strong>Multiple Matches:</strong> Highlights all occurrences of the specified text
              </div>
              <div className={styles.guideItem}>
                <strong>Color Options:</strong> Choose from presets or custom colors
              </div>
              <div className={styles.guideItem}>
                <strong>Search Options:</strong> Case sensitive and whole word matching
              </div>
            </div>
          </div>

          <div className={styles.searchTips}>
            <h4>Search Tips</h4>
            <ul>
              <li>Use exact phrases for better results</li>
              <li>Check "Whole words only" for precise matches</li>
              <li>Enable "Case sensitive" for proper nouns</li>
              <li>Multiple words will be highlighted separately</li>
            </ul>
          </div>
        </div>
      </div>

      <ToolInfo
        howItWorks="Upload your PDF file<br>Enter the text you want to highlight<br>Choose highlight color and search options<br>Click 'Highlight Text' to download highlighted PDF"
        faqs={[
          { title: "Can I highlight multiple different texts?", content: "Currently supports highlighting one text/phrase at a time. Use multiple operations for different highlights." },
          { title: "Does it work with scanned PDFs?", content: "No, this tool only works with text-based PDFs. Scanned documents need OCR first." },
          { title: "Can I change highlight opacity?", content: "Currently uses solid colors. Semi-transparent highlighting may be added in future updates." },
          { title: "Will the original text be preserved?", content: "Yes, highlighting is added as an overlay and doesn't modify the original text." }
        ]}
        tips={["Use bright colors for better visibility<br>Test with a single page first<br>Check case sensitivity for proper nouns<br>Whole words option prevents partial matches"]}
      />
    </main>
  );
}