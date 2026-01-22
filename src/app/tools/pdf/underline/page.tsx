'use client';

import { useState } from 'react';
import ToolInfo from '@/components/ToolInfo';
import styles from './underline.module.css';

export default function UnderlineText() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [underlineText, setUnderlineText] = useState('');
  const [underlineColor, setUnderlineColor] = useState('#0000ff');
  const [underlineThickness, setUnderlineThickness] = useState(1);
  const [underlineStyle, setUnderlineStyle] = useState<'solid' | 'dashed' | 'dotted'>('solid');
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

  const underlineTextInPDF = async () => {
    if (!pdfFile) {
      setError('Please select a PDF file');
      return;
    }

    if (!underlineText.trim()) {
      setError('Please enter text to underline');
      return;
    }

    setProcessing(true);
    setError('');

    try {
      // In a real implementation, this would use pdf-lib and text extraction
      // For now, we'll show a placeholder
      setError('PDF text underlining requires advanced PDF processing libraries. This feature is under development.');

      setTimeout(() => {
        setProcessing(false);
      }, 2000);

    } catch (err) {
      setError('Failed to underline text in PDF');
      setProcessing(false);
    }
  };

  const presetColors = [
    { name: 'Blue', value: '#0000ff' },
    { name: 'Black', value: '#000000' },
    { name: 'Red', value: '#ff0000' },
    { name: 'Green', value: '#008000' },
    { name: 'Purple', value: '#800080' },
    { name: 'Orange', value: '#ff6600' }
  ];

  const getUnderlineStyle = () => {
    switch (underlineStyle) {
      case 'dashed': return 'underline';
      case 'dotted': return 'underline';
      default: return 'underline';
    }
  };

  return (
    <main className={styles.container}>
      <h1>Underline Text in PDF</h1>
      <p>Add underlines to specific text in your PDF document</p>

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
            <label htmlFor="underline-text">Text to Underline:</label>
            <textarea
              id="underline-text"
              value={underlineText}
              onChange={(e) => setUnderlineText(e.target.value)}
              placeholder="Enter the text you want to underline..."
              className={styles.textTextarea}
              rows={3}
            />
            <div className={styles.inputHelp}>
              <p><strong>Tips:</strong> You can enter multiple words or phrases. Each will be underlined separately.</p>
            </div>
          </div>

          <div className={styles.underlineOptions}>
            <div className={styles.colorSelector}>
              <h3>Underline Color</h3>
              <div className={styles.colorOptions}>
                {presetColors.map((color) => (
                  <button
                    key={color.value}
                    className={`${styles.colorBtn} ${underlineColor === color.value ? styles.active : ''}`}
                    onClick={() => setUnderlineColor(color.value)}
                    style={{ backgroundColor: color.value }}
                  >
                    {color.name}
                  </button>
                ))}
                <div className={styles.customColor}>
                  <input
                    type="color"
                    value={underlineColor}
                    onChange={(e) => setUnderlineColor(e.target.value)}
                    className={styles.colorPicker}
                    title="Custom color"
                  />
                  <span>Custom</span>
                </div>
              </div>
            </div>

            <div className={styles.styleOptions}>
              <div className={styles.thicknessSelector}>
                <label htmlFor="thickness">Line Thickness:</label>
                <select
                  id="thickness"
                  value={underlineThickness}
                  onChange={(e) => setUnderlineThickness(parseInt(e.target.value))}
                  className={styles.thicknessSelect}
                >
                  <option value={1}>Thin (1pt)</option>
                  <option value={2}>Medium (2pt)</option>
                  <option value={3}>Thick (3pt)</option>
                  <option value={4}>Extra Thick (4pt)</option>
                </select>
              </div>

              <div className={styles.styleSelector}>
                <label>Line Style:</label>
                <div className={styles.styleButtons}>
                  <button
                    className={`${styles.styleBtn} ${underlineStyle === 'solid' ? styles.active : ''}`}
                    onClick={() => setUnderlineStyle('solid')}
                  >
                    Solid
                  </button>
                  <button
                    className={`${styles.styleBtn} ${underlineStyle === 'dashed' ? styles.active : ''}`}
                    onClick={() => setUnderlineStyle('dashed')}
                  >
                    Dashed
                  </button>
                  <button
                    className={`${styles.styleBtn} ${underlineStyle === 'dotted' ? styles.active : ''}`}
                    onClick={() => setUnderlineStyle('dotted')}
                  >
                    Dotted
                  </button>
                </div>
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
            onClick={underlineTextInPDF}
            disabled={!pdfFile || !underlineText.trim() || processing}
            className={styles.convertBtn}
          >
            {processing ? 'Underlining Text...' : 'Underline Text'}
          </button>

          {error && <div className={styles.error}>{error}</div>}
        </div>

        <div className={styles.previewSection}>
          <h3>Underline Preview</h3>

          <div className={styles.previewBox}>
            <div className={styles.sampleText}>
              <p style={{
                textDecoration: getUnderlineStyle(),
                textDecorationColor: underlineColor,
                textDecorationThickness: `${underlineThickness}px`,
                textDecorationStyle: underlineStyle
              }}>
                This is <span>sample text</span> to show how underlining will look.
              </p>
              <p style={{
                textDecoration: getUnderlineStyle(),
                textDecorationColor: underlineColor,
                textDecorationThickness: `${underlineThickness}px`,
                textDecorationStyle: underlineStyle
              }}>
                You can underline <span>multiple words</span> or <span>phrases</span> in your document.
              </p>
            </div>
          </div>

          <div className={styles.underlineGuide}>
            <h4>How Underlining Works</h4>
            <div className={styles.guideContent}>
              <div className={styles.guideItem}>
                <strong>Text Search:</strong> Searches through all text content in the PDF
              </div>
              <div className={styles.guideItem}>
                <strong>Multiple Matches:</strong> Underlines all occurrences of the specified text
              </div>
              <div className={styles.guideItem}>
                <strong>Visual Effect:</strong> Adds horizontal line below the text
              </div>
              <div className={styles.guideItem}>
                <strong>Customization:</strong> Choose color, thickness, and line style
              </div>
            </div>
          </div>

          <div className={styles.searchTips}>
            <h4>Search Tips</h4>
            <ul>
              <li>Use exact phrases for better results</li>
              <li>Check "Whole words only" for precise matches</li>
              <li>Enable "Case sensitive" for proper nouns</li>
              <li>Multiple words will be underlined separately</li>
            </ul>
          </div>
        </div>
      </div>

      <ToolInfo
        howItWorks="Upload your PDF file<br>Enter the text you want to underline<br>Choose underline color, thickness, and style<br>Click 'Underline Text' to download modified PDF"
        faqs={[
          { title: "Can I underline multiple different texts?", content: "Currently supports underlining one text/phrase at a time. Use multiple operations for different underlines." },
          { title: "Does it work with scanned PDFs?", content: "No, this tool only works with text-based PDFs. Scanned documents need OCR first." },
          { title: "Will the original text be preserved?", content: "Yes, underlining is added as a visual effect and doesn't modify the original text." },
          { title: "What line styles are available?", content: "Solid, dashed, and dotted line styles are supported." }
        ]}
        tips={["Use blue for links or references<br>Test with a single page first<br>Check case sensitivity for proper nouns<br>Whole words option prevents partial matches"]}
      />
    </main>
  );
}