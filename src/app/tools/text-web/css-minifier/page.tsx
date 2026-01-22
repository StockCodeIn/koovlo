'use client';

import { useState } from 'react';
import styles from './cssminifier.module.css';

export default function CssMinifierPage() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [options, setOptions] = useState({
    removeComments: true,
    removeWhitespace: true,
    shortenColors: true,
    combineRules: false,
  });
  const [stats, setStats] = useState({
    originalSize: 0,
    minifiedSize: 0,
    savedBytes: 0,
    savedPercent: 0,
  });

  const minifyCss = () => {
    if (!inputText) return;

    let css = inputText;
    const originalSize = css.length;

    // Remove comments
    if (options.removeComments) {
      css = css.replace(/\/\*[\s\S]*?\*\//g, '');
    }

    // Remove whitespace
    if (options.removeWhitespace) {
      css = css
        .replace(/\s+/g, ' ') // Replace multiple whitespace with single space
        .replace(/\s*{\s*/g, '{') // Remove spaces around {
        .replace(/\s*}\s*/g, '}') // Remove spaces around }
        .replace(/\s*;\s*/g, ';') // Remove spaces around ;
        .replace(/\s*:\s*/g, ':') // Remove spaces around :
        .replace(/;\s*}/g, '}') // Remove ; before }
        .replace(/,\s*/g, ',') // Remove spaces after ,
        .trim(); // Trim leading/trailing whitespace
    }

    // Shorten colors
    if (options.shortenColors) {
      css = css
        .replace(/#([a-fA-F0-9])\1([a-fA-F0-9])\2([a-fA-F0-9])\3/g, '#$1$2$3') // #RRGGBB to #RGB
        .replace(/#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/g, '#$1$2$3'); // Ensure lowercase
    }

    // Combine rules (basic implementation)
    if (options.combineRules) {
      // This is a simplified version - a full implementation would be more complex
      const rules: { [key: string]: string[] } = {};

      // Split by }
      const ruleBlocks = css.split('}');
      ruleBlocks.forEach(block => {
        if (block.trim()) {
          const parts = block.split('{');
          if (parts.length === 2) {
            const selector = parts[0].trim();
            const declarations = parts[1].trim();

            if (!rules[selector]) {
              rules[selector] = [];
            }
            rules[selector].push(declarations);
          }
        }
      });

      // Reconstruct CSS
      css = '';
      for (const [selector, declarations] of Object.entries(rules)) {
        css += `${selector}{${declarations.join(';')}}`;
      }
    }

    const minifiedSize = css.length;
    const savedBytes = originalSize - minifiedSize;
    const savedPercent = originalSize > 0 ? (savedBytes / originalSize * 100) : 0;

    setOutputText(css);
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
    const sampleCss = `/* Header Styles */
.header {
  background-color: #ffffff;
  border: 1px solid #cccccc;
  padding: 10px 20px;
  margin-bottom: 15px;
}

/* Navigation */
.nav {
  background-color: #f8f9fa;
  padding: 0;
  margin: 0;
}

.nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav li {
  display: inline-block;
  margin-right: 10px;
}

/* Button Styles */
.btn {
  background-color: #007bff;
  color: #ffffff;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.btn:hover {
  background-color: #0056b3;
}`;
    setInputText(sampleCss);
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
    const blob = new Blob([outputText], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'minified.css';
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
            <h3>CSS Input</h3>
            <button onClick={loadSampleData} className={styles.sampleBtn}>
              Load Sample
            </button>
          </div>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste your CSS code here to minify..."
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
                <small>Strip /* */ comments</small>
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
                checked={options.shortenColors}
                onChange={(e) => setOptions(prev => ({ ...prev, shortenColors: e.target.checked }))}
                className={styles.checkbox}
              />
              <div className={styles.checkboxText}>
                <strong>Shorten Colors</strong>
                <small>#ffffff → #fff</small>
              </div>
            </label>

            <label className={styles.checkboxOption}>
              <input
                type="checkbox"
                checked={options.combineRules}
                onChange={(e) => setOptions(prev => ({ ...prev, combineRules: e.target.checked }))}
                className={styles.checkbox}
              />
              <div className={styles.checkboxText}>
                <strong>Combine Rules</strong>
                <small>Merge duplicate selectors</small>
              </div>
            </label>
          </div>
        </div>

        <div className={styles.actions}>
          <button onClick={minifyCss} className={styles.minifyBtn}>
            Minify CSS
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
                Download as CSS
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