'use client';

import { useState } from 'react';
import styles from './htmlminifier.module.css';

export default function HtmlMinifierPage() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [options, setOptions] = useState({
    removeComments: true,
    removeWhitespace: true,
    collapseWhitespace: true,
    removeEmptyAttributes: false,
    removeOptionalTags: false,
  });
  const [stats, setStats] = useState({
    originalSize: 0,
    minifiedSize: 0,
    savedBytes: 0,
    savedPercent: 0,
  });

  const minifyHtml = () => {
    if (!inputText) return;

    let html = inputText;
    const originalSize = html.length;

    // Remove HTML comments
    if (options.removeComments) {
      html = html.replace(/<!--[\s\S]*?-->/g, '');
    }

    // Remove whitespace between tags
    if (options.removeWhitespace) {
      html = html.replace(/>\s+</g, '><');
    }

    // Collapse multiple whitespace
    if (options.collapseWhitespace) {
      html = html.replace(/\s+/g, ' ');
      // Preserve single spaces in text content
      html = html.replace(/>\s/g, '>').replace(/\s</g, '<');
    }

    // Remove empty attributes (basic implementation)
    if (options.removeEmptyAttributes) {
      html = html.replace(/\s+\w+=""/g, '');
      html = html.replace(/\s+\w+=''/g, '');
    }

    // Remove optional tags (very basic implementation)
    if (options.removeOptionalTags) {
      // Remove optional closing tags for some elements
      html = html.replace(/<\/html>|<\/head>|<\/body>|<\/p>|<\/li>|<\/dt>|<\/dd>/gi, '');
      // Remove optional opening tags (this is complex, so we'll skip for now)
    }

    // Trim whitespace
    html = html.trim();

    const minifiedSize = html.length;
    const savedBytes = originalSize - minifiedSize;
    const savedPercent = originalSize > 0 ? (savedBytes / originalSize * 100) : 0;

    setOutputText(html);
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
    const sampleHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sample Page</title>
    <!-- This is a comment -->
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <!-- Navigation -->
    <nav class="navbar">
        <ul class="nav-list">
            <li class="nav-item">
                <a href="#home" class="nav-link">Home</a>
            </li>
            <li class="nav-item">
                <a href="#about" class="nav-link">About</a>
            </li>
            <li class="nav-item">
                <a href="#contact" class="nav-link">Contact</a>
            </li>
        </ul>
    </nav>

    <!-- Main content -->
    <main class="main-content">
        <h1>Welcome to our website</h1>
        <p>This is a sample paragraph with some text content.</p>

        <div class="content-section">
            <h2>About Us</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            <p>Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        </div>
    </main>

    <!-- Footer -->
    <footer class="footer">
        <p>&copy; 2023 Sample Company. All rights reserved.</p>
    </footer>

    <script src="script.js"></script>
</body>
</html>`;
    setInputText(sampleHtml);
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
    const blob = new Blob([outputText], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'minified.html';
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
            <h3>HTML Input</h3>
            <button onClick={loadSampleData} className={styles.sampleBtn}>
              Load Sample
            </button>
          </div>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste your HTML code here to minify..."
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
                <small>Strip HTML comments</small>
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
                <small>Remove spaces between tags</small>
              </div>
            </label>

            <label className={styles.checkboxOption}>
              <input
                type="checkbox"
                checked={options.collapseWhitespace}
                onChange={(e) => setOptions(prev => ({ ...prev, collapseWhitespace: e.target.checked }))}
                className={styles.checkbox}
              />
              <div className={styles.checkboxText}>
                <strong>Collapse Whitespace</strong>
                <small>Collapse multiple spaces</small>
              </div>
            </label>

            <label className={styles.checkboxOption}>
              <input
                type="checkbox"
                checked={options.removeEmptyAttributes}
                onChange={(e) => setOptions(prev => ({ ...prev, removeEmptyAttributes: e.target.checked }))}
                className={styles.checkbox}
              />
              <div className={styles.checkboxText}>
                <strong>Remove Empty Attributes</strong>
                <small>Remove attributes with empty values</small>
              </div>
            </label>

            <label className={styles.checkboxOption}>
              <input
                type="checkbox"
                checked={options.removeOptionalTags}
                onChange={(e) => setOptions(prev => ({ ...prev, removeOptionalTags: e.target.checked }))}
                className={styles.checkbox}
              />
              <div className={styles.checkboxText}>
                <strong>Remove Optional Tags</strong>
                <small>Remove optional closing tags</small>
              </div>
            </label>
          </div>
        </div>

        <div className={styles.actions}>
          <button onClick={minifyHtml} className={styles.minifyBtn}>
            Minify HTML
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
                Download as HTML
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