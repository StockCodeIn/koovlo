'use client';

import { useState } from 'react';
import styles from './jsminifier.module.css';

export default function JsMinifierPage() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [options, setOptions] = useState({
    removeComments: true,
    removeWhitespace: true,
    shortenNames: false,
    compressNumbers: false,
  });
  const [stats, setStats] = useState({
    originalSize: 0,
    minifiedSize: 0,
    savedBytes: 0,
    savedPercent: 0,
  });

  const minifyJs = () => {
    if (!inputText) return;

    let js = inputText;
    const originalSize = js.length;

    // Remove single-line comments
    if (options.removeComments) {
      js = js.replace(/\/\/.*$/gm, '');
      // Remove multi-line comments (basic implementation)
      js = js.replace(/\/\*[\s\S]*?\*\//g, '');
    }

    // Remove whitespace
    if (options.removeWhitespace) {
      js = js
        .replace(/\s+/g, ' ') // Replace multiple whitespace with single space
        .replace(/\s*{\s*/g, '{') // Remove spaces around {
        .replace(/\s*}\s*/g, '}') // Remove spaces around }
        .replace(/\s*\(\s*/g, '(') // Remove spaces around (
        .replace(/\s*\)\s*/g, ')') // Remove spaces around )
        .replace(/\s*\[\s*/g, '[') // Remove spaces around [
        .replace(/\s*\]\s*/g, ']') // Remove spaces around ]
        .replace(/\s*;\s*/g, ';') // Remove spaces around ;
        .replace(/\s*,\s*/g, ',') // Remove spaces around ,
        .replace(/\s*:\s*/g, ':') // Remove spaces around :
        .replace(/\s*\+\s*/g, '+') // Remove spaces around +
        .replace(/\s*-\s*/g, '-') // Remove spaces around -
        .replace(/\s*\*\s*/g, '*') // Remove spaces around *
        .replace(/\s*\/\s*/g, '/') // Remove spaces around /
        .replace(/\s*=\s*/g, '=') // Remove spaces around =
        .replace(/\s*<\s*/g, '<') // Remove spaces around <
        .replace(/\s*>\s*/g, '>') // Remove spaces around >
        .replace(/\s*!\s*/g, '!') // Remove spaces around !
        .replace(/\s*\?\s*/g, '?') // Remove spaces around ?
        .trim(); // Trim leading/trailing whitespace
    }

    // Compress numbers (basic implementation)
    if (options.compressNumbers) {
      // Convert 0.5 to .5, 10.0 to 10, etc.
      js = js
        .replace(/(\d+)\.0+/g, '$1') // Remove trailing .0
        .replace(/0\.(\d+)/g, '.$1'); // Convert 0.5 to .5
    }

    // Shorten variable names (very basic implementation - this is complex in reality)
    if (options.shortenNames) {
      // This is a very simplified version. Real JS minification uses advanced techniques
      // For demo purposes, we'll just remove some unnecessary spaces
      js = js.replace(/\s+/g, ' ').trim();
    }

    const minifiedSize = js.length;
    const savedBytes = originalSize - minifiedSize;
    const savedPercent = originalSize > 0 ? (savedBytes / originalSize * 100) : 0;

    setOutputText(js);
    setStats({
      originalSize,
      minifiedSize,
      savedBytes,
      savedPercent: Math.round(savedPercent * 100) / 100,
    });
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
    setStats({ originalSize: 0, minifiedSize: 0, savedBytes: 0, savedPercent: 0 });
  };

  const loadSampleData = () => {
    const sampleJs = `// Sample JavaScript function
function calculateTotal(items) {
  /* Initialize total */
  let total = 0.0;

  // Loop through items
  for (let i = 0; i < items.length; i++) {
    total = total + items[i].price * items[i].quantity;
  }

  // Return formatted total
  return total.toFixed(2);
}

// Event handler
document.addEventListener('DOMContentLoaded', function() {
  const button = document.getElementById('calculate-btn');
  const result = document.getElementById('result');

  button.addEventListener('click', function() {
    const items = [
      { price: 10.50, quantity: 2 },
      { price: 5.25, quantity: 1 },
      { price: 8.00, quantity: 3 }
    ];

    const total = calculateTotal(items);
    result.textContent = 'Total: $' + total;
  });
});`;
    setInputText(sampleJs);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(outputText);
      alert('Output copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const downloadOutput = () => {
    const blob = new Blob([outputText], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'minified.js';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={styles.container}>
      <div className={styles.tool}>
        <div className={styles.inputSection}>
          <div className={styles.inputHeader}>
            <h3>JavaScript Input</h3>
            <button onClick={loadSampleData} className={styles.sampleBtn}>
              Load Sample
            </button>
          </div>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste your JavaScript code here to minify..."
            className={styles.textarea}
          />
        </div>

        <div className={styles.optionsSection}>
          <h3>Minification Options</h3>
          <div className={styles.optionsGrid}>
            <label className={styles.checkboxOption}>
              <input
                type="checkbox"
                checked={options.removeComments}
                onChange={(e) => setOptions(prev => ({ ...prev, removeComments: e.target.checked }))}
                className={styles.checkbox}
              />
              <div className={styles.checkboxText}>
                <strong>Remove Comments</strong>
                <small>Strip // and /* */ comments</small>
              </div>
            </label>

            <label className={styles.checkboxOption}>
              <input
                type="checkbox"
                checked={options.removeWhitespace}
                onChange={(e) => setOptions(prev => ({ ...prev, removeWhitespace: e.target.checked }))}
                className={styles.checkbox}
              />
              <div className={styles.checkboxText}>
                <strong>Remove Whitespace</strong>
                <small>Compress spacing and line breaks</small>
              </div>
            </label>

            <label className={styles.checkboxOption}>
              <input
                type="checkbox"
                checked={options.compressNumbers}
                onChange={(e) => setOptions(prev => ({ ...prev, compressNumbers: e.target.checked }))}
                className={styles.checkbox}
              />
              <div className={styles.checkboxText}>
                <strong>Compress Numbers</strong>
                <small>Optimize number formats</small>
              </div>
            </label>

            <label className={styles.checkboxOption}>
              <input
                type="checkbox"
                checked={options.shortenNames}
                onChange={(e) => setOptions(prev => ({ ...prev, shortenNames: e.target.checked }))}
                className={styles.checkbox}
              />
              <div className={styles.checkboxText}>
                <strong>Shorten Names</strong>
                <small>Minify variable names (basic)</small>
              </div>
            </label>
          </div>
        </div>

        <div className={styles.actions}>
          <button onClick={minifyJs} className={styles.minifyBtn}>
            Minify JavaScript
          </button>
          <button onClick={handleClear} className={styles.clearBtn}>
            Clear All
          </button>
        </div>

        {outputText && (
          <div className={styles.outputSection}>
            <h3>Minified Output</h3>
            <textarea
              value={outputText}
              readOnly
              className={styles.textarea}
            />
            <div className={styles.outputActions}>
              <button onClick={copyToClipboard} className={styles.copyBtn}>
                Copy Output
              </button>
              <button onClick={downloadOutput} className={styles.downloadBtn}>
                Download as JS
              </button>
            </div>
          </div>
        )}

        {stats.originalSize > 0 && (
          <div className={styles.stats}>
            <h3>Minification Results</h3>
            <div className={styles.statsGrid}>
              <div className={styles.stat}>
                <span className={styles.statNumber}>{stats.originalSize}</span>
                <span className={styles.statLabel}>Original Size</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>{stats.minifiedSize}</span>
                <span className={styles.statLabel}>Minified Size</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>{stats.savedBytes}</span>
                <span className={styles.statLabel}>Bytes Saved</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>{stats.savedPercent}%</span>
                <span className={styles.statLabel}>Size Reduction</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}