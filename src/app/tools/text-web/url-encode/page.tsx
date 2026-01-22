'use client';

import { useState } from 'react';
import styles from './urlencode.module.css';

export default function UrlEncodePage() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [options, setOptions] = useState({
    encodeSpaces: true,
    encodeSpecialChars: true,
    encodeUnicode: false,
  });
  const [stats, setStats] = useState({
    originalLength: 0,
    encodedLength: 0,
    changePercent: 0,
  });

  const handleProcess = () => {
    if (!inputText) return;

    let result = '';
    const originalLength = inputText.length;

    if (mode === 'encode') {
      result = encodeURIComponent(inputText);

      // Apply custom options
      if (!options.encodeSpaces) {
        result = result.replace(/%20/g, ' ');
      }

      if (!options.encodeSpecialChars) {
        // Decode common special characters
        result = result.replace(/%21/g, '!').replace(/%27/g, "'").replace(/%28/g, '(').replace(/%29/g, ')');
      }

      if (options.encodeUnicode) {
        // Ensure Unicode characters are encoded
        result = encodeURI(result);
      }
    } else {
      try {
        result = decodeURIComponent(inputText);
      } catch (error) {
        alert('Invalid URL encoding. Please check your input.');
        return;
      }
    }

    const encodedLength = result.length;
    const changePercent = originalLength > 0 ? ((encodedLength - originalLength) / originalLength * 100) : 0;

    setOutputText(result);
    setStats({
      originalLength,
      encodedLength,
      changePercent: Math.round(changePercent * 100) / 100,
    });
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
    setStats({ originalLength: 0, encodedLength: 0, changePercent: 0 });
  };

  const loadSampleData = () => {
    if (mode === 'encode') {
      setInputText('Hello World! This is a test URL with spaces & special chars: café@example.com?query=value#fragment');
    } else {
      setInputText('Hello%20World%21%20This%20is%20a%20test%20URL%20with%20spaces%20%26%20special%20chars%3A%20caf%C3%A9%40example.com%3Fquery%3Dvalue%23fragment');
    }
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
    const blob = new Blob([outputText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = mode === 'encode' ? 'encoded-url.txt' : 'decoded-url.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={styles.container}>
      <div className={styles.tool}>
        <div className={styles.modeSection}>
          <h3>Mode</h3>
          <div className={styles.modeButtons}>
            <button
              onClick={() => setMode('encode')}
              className={`${styles.modeBtn} ${mode === 'encode' ? styles.active : ''}`}
            >
              Encode URL
            </button>
            <button
              onClick={() => setMode('decode')}
              className={`${styles.modeBtn} ${mode === 'decode' ? styles.active : ''}`}
            >
              Decode URL
            </button>
          </div>
        </div>

        <div className={styles.inputSection}>
          <div className={styles.inputHeader}>
            <h3>Input {mode === 'encode' ? 'Text' : 'URL'}</h3>
            <button onClick={loadSampleData} className={styles.sampleBtn}>
              Load Sample
            </button>
          </div>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter URL to decode...'}
            className={styles.textarea}
          />
        </div>

        {mode === 'encode' && (
          <div className={styles.optionsSection}>
            <h3>Encoding Options</h3>
            <div className={styles.optionsGrid}>
              <label className={styles.checkboxOption}>
                <input
                  type="checkbox"
                  checked={options.encodeSpaces}
                  onChange={(e) => setOptions(prev => ({ ...prev, encodeSpaces: e.target.checked }))}
                  className={styles.checkbox}
                />
                <div className={styles.checkboxText}>
                  <strong>Encode Spaces</strong>
                  <small>Convert spaces to %20</small>
                </div>
              </label>

              <label className={styles.checkboxOption}>
                <input
                  type="checkbox"
                  checked={options.encodeSpecialChars}
                  onChange={(e) => setOptions(prev => ({ ...prev, encodeSpecialChars: e.target.checked }))}
                  className={styles.checkbox}
                />
                <div className={styles.checkboxText}>
                  <strong>Encode Special Chars</strong>
                  <small>Encode ! ' ( ) etc.</small>
                </div>
              </label>

              <label className={styles.checkboxOption}>
                <input
                  type="checkbox"
                  checked={options.encodeUnicode}
                  onChange={(e) => setOptions(prev => ({ ...prev, encodeUnicode: e.target.checked }))}
                  className={styles.checkbox}
                />
                <div className={styles.checkboxText}>
                  <strong>Encode Unicode</strong>
                  <small>Encode non-ASCII characters</small>
                </div>
              </label>
            </div>
          </div>
        )}

        <div className={styles.actions}>
          <button onClick={handleProcess} className={styles.processBtn}>
            {mode === 'encode' ? 'Encode URL' : 'Decode URL'}
          </button>
          <button onClick={handleClear} className={styles.clearBtn}>
            Clear All
          </button>
        </div>

        {outputText && (
          <div className={styles.outputSection}>
            <h3>Output</h3>
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
                Download as File
              </button>
            </div>
          </div>
        )}

        {stats.originalLength > 0 && (
          <div className={styles.stats}>
            <h3>Processing Statistics</h3>
            <div className={styles.statsGrid}>
              <div className={styles.stat}>
                <span className={styles.statNumber}>{stats.originalLength}</span>
                <span className={styles.statLabel}>Original Length</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>{stats.encodedLength}</span>
                <span className={styles.statLabel}>Processed Length</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>{stats.changePercent}%</span>
                <span className={styles.statLabel}>Length Change</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}