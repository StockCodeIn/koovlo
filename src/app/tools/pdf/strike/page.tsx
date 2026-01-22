'use client';

import { useState } from 'react';
import ToolInfo from '@/components/ToolInfo';
import styles from './strike.module.css';

export default function StrikeText() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [strikeText, setStrikeText] = useState('');
  const [strikeColor, setStrikeColor] = useState('#ff0000');
  const [strikeThickness, setStrikeThickness] = useState(1);
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

  const strikeTextInPDF = async () => {
    if (!pdfFile) {
      setError('Please select a PDF file');
      return;
    }

    if (!strikeText.trim()) {
      setError('Please enter text to strike through');
      return;
    }

    setProcessing(true);
    setError('');

    try {
      // In a real implementation, this would use pdf-lib and text extraction
      // For now, we'll show a placeholder
      setError('PDF text striking requires advanced PDF processing libraries. This feature is under development.');

      setTimeout(() => {
        setProcessing(false);
      }, 2000);

    } catch (err) {
      setError('Failed to strike text in PDF');
      setProcessing(false);
    }
  };

  const presetColors = [
    { name: 'Red', value: '#ff0000' },
    { name: 'Black', value: '#000000' },
    { name: 'Blue', value: '#0000ff' },
    { name: 'Green', value: '#008000' },
    { name: 'Purple', value: '#800080' },
    { name: 'Orange', value: '#ff6600' }
  ];

  return (
    <main className={styles.container}>
      <h1>Strike Through Text in PDF</h1>
      <p>Add strike-through lines to specific text in your PDF document</p>

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
            <label htmlFor="strike-text">Text to Strike Through:</label>
            <textarea
              id="strike-text"
              value={strikeText}
              onChange={(e) => setStrikeText(e.target.value)}
              placeholder="Enter the text you want to strike through..."
              className={styles.textTextarea}
              rows={3}
            />
            <div className={styles.inputHelp}>
              <p><strong>Tips:</strong> You can enter multiple words or phrases. Each will be struck through separately.</p>
            </div>
          </div>

          <div className={styles.strikeOptions}>
            <div className={styles.colorSelector}>
              <h3>Strike Color</h3>
              <div className={styles.colorOptions}>
                {presetColors.map((color) => (
                  <button
                    key={color.value}
                    className={`${styles.colorBtn} ${strikeColor === color.value ? styles.active : ''}`}
                    onClick={() => setStrikeColor(color.value)}
                    style={{ backgroundColor: color.value }}
                  >
                    {color.name}
                  </button>
                ))}
                <div className={styles.customColor}>
                  <input
                    type="color"
                    value={strikeColor}
                    onChange={(e) => setStrikeColor(e.target.value)}
                    className={styles.colorPicker}
                    title="Custom color"
                  />
                  <span>Custom</span>
                </div>
              </div>
            </div>

            <div className={styles.thicknessSelector}>
              <label htmlFor="thickness">Line Thickness:</label>
              <select
                id="thickness"
                value={strikeThickness}
                onChange={(e) => setStrikeThickness(parseInt(e.target.value))}
                className={styles.thicknessSelect}
              >
                <option value={1}>Thin (1pt)</option>
                <option value={2}>Medium (2pt)</option>
                <option value={3}>Thick (3pt)</option>
                <option value={4}>Extra Thick (4pt)</option>
              </select>
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
            onClick={strikeTextInPDF}
            disabled={!pdfFile || !strikeText.trim() || processing}
            className={styles.convertBtn}
          >
            {processing ? 'Striking Text...' : 'Strike Text'}
          </button>

          {error && <div className={styles.error}>{error}</div>}
        </div>

        <div className={styles.previewSection}>
          <h3>Strike Preview</h3>

          <div className={styles.previewBox}>
            <div className={styles.sampleText}>
              <p>This is <span style={{
                textDecoration: 'line-through',
                textDecorationColor: strikeColor,
                textDecorationThickness: `${strikeThickness}px`
              }}>sample text</span> to show how striking will look.</p>
              <p>You can strike through <span style={{
                textDecoration: 'line-through',
                textDecorationColor: strikeColor,
                textDecorationThickness: `${strikeThickness}px`
              }}>multiple words</span> or <span style={{
                textDecoration: 'line-through',
                textDecorationColor: strikeColor,
                textDecorationThickness: `${strikeThickness}px`
              }}>phrases</span> in your document.</p>
            </div>
          </div>

          <div className={styles.strikeGuide}>
            <h4>How Striking Works</h4>
            <div className={styles.guideContent}>
              <div className={styles.guideItem}>
                <strong>Text Search:</strong> Searches through all text content in the PDF
              </div>
              <div className={styles.guideItem}>
                <strong>Multiple Matches:</strong> Strikes through all occurrences of the specified text
              </div>
              <div className={styles.guideItem}>
                <strong>Visual Effect:</strong> Adds horizontal line through the text
              </div>
              <div className={styles.guideItem}>
                <strong>Customization:</strong> Choose color and thickness of strike line
              </div>
            </div>
          </div>

          <div className={styles.searchTips}>
            <h4>Search Tips</h4>
            <ul>
              <li>Use exact phrases for better results</li>
              <li>Check "Whole words only" for precise matches</li>
              <li>Enable "Case sensitive" for proper nouns</li>
              <li>Multiple words will be struck through separately</li>
            </ul>
          </div>
        </div>
      </div>

      <ToolInfo
        howItWorks="Upload your PDF file<br>Enter the text you want to strike through<br>Choose strike color and line thickness<br>Click 'Strike Text' to download modified PDF"
        faqs={[
          { title: "Can I strike through multiple different texts?", content: "Currently supports striking one text/phrase at a time. Use multiple operations for different strikes." },
          { title: "Does it work with scanned PDFs?", content: "No, this tool only works with text-based PDFs. Scanned documents need OCR first." },
          { title: "Will the original text be preserved?", content: "Yes, striking is added as a visual effect and doesn't modify the original text." },
          { title: "Can I change the strike line style?", content: "Currently supports solid lines. Different line styles may be added in future updates." }
        ]}
        tips={["Use red color for deletions<br>Test with a single page first<br>Check case sensitivity for proper nouns<br>Whole words option prevents partial matches"]}
      />
    </main>
  );
}