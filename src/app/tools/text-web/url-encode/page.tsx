'use client';

import { useState, useEffect } from 'react';
import styles from './urlencode.module.css';
import ToolInfo from '@/components/ToolInfo';

interface HistoryItem {
  id: string;
  inputPreview: string;
  outputPreview: string;
  mode: 'encode' | 'decode';
  timestamp: number;
  inputSize: number;
  outputSize: number;
}

export default function UrlEncodePage() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [options, setOptions] = useState({
    encodeSpaces: true,
    encodeSpecialChars: true,
    encodeUnicode: false,
  });

  useEffect(() => {
    const saved = localStorage.getItem('url-encoder-data');
    if (saved) {
      const { inputText: savedInput, outputText: savedOutput, history: savedHistory } = JSON.parse(saved);
      setInputText(savedInput || '');
      setOutputText(savedOutput || '');
      setHistory(savedHistory || []);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('url-encoder-data', JSON.stringify({ inputText, outputText, history }));
  }, [inputText, outputText, history]);

  const handleProcess = () => {
    if (!inputText) return;
    let result = '';

    if (mode === 'encode') {
      result = encodeURIComponent(inputText);
      if (!options.encodeSpaces) {
        result = result.replace(/%20/g, ' ');
      }
      if (!options.encodeSpecialChars) {
        result = result.replace(/%21/g, '!').replace(/%27/g, "'").replace(/%28/g, '(').replace(/%29/g, ')');
      }
      if (options.encodeUnicode) {
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

    const newItem: HistoryItem = {
      id: Date.now().toString(),
      inputPreview: inputText.slice(0, 100),
      outputPreview: result.slice(0, 100),
      mode: mode,
      timestamp: Date.now(),
      inputSize: new Blob([inputText]).size,
      outputSize: new Blob([result]).size
    };
    setHistory(prev => [newItem, ...prev].slice(0, 50));
    setOutputText(result);
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
  };

  const loadSampleData = () => {
    if (mode === 'encode') {
      setInputText('Hello World! This is a test URL with spaces & special chars: café@example.com?query=value#fragment');
    } else {
      setInputText('Hello%20World%21%20This%20is%20a%20test%20URL%20with%20spaces%20%26%20special%20chars%3A%20caf%C3%A9%40example.com%3Fquery%3Dvalue%23fragment');
    }
  };

  const swapTexts = () => {
    setInputText(outputText);
    setOutputText(inputText);
    setMode(mode === 'encode' ? 'decode' : 'encode');
  };

  const deleteHistoryItem = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  const clearHistory = () => {
    if (confirm('Clear all history?')) {
      setHistory([]);
    }
  };

  const loadFromHistory = (item: HistoryItem) => {
    setInputText(item.inputPreview);
    setOutputText(item.outputPreview);
    setMode(item.mode);
  };

  const getAnalytics = () => {
    const totalEncodes = history.filter(h => h.mode === 'encode').length;
    const totalDecodes = history.filter(h => h.mode === 'decode').length;
    const totalOperations = history.length;
    const avgSizeChange = history.length > 0
      ? Math.round((history.reduce((sum, item) => sum + ((item.outputSize - item.inputSize) / item.inputSize * 100), 0) / history.length) * 10) / 10
      : 0;
    return { totalEncodes, totalDecodes, totalOperations, avgSizeChange };
  };

  const analytics = getAnalytics();

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
      <h1 className={styles.pageTitle}>
        <span className={styles.icon}>🔗</span>
        <span className={styles.textGradient}>URL Encoder/Decoder</span>
      </h1>
      <p className={styles.subtitle}>Encode and decode URLs with smart tracking and analytics.</p>

      <div className={styles.tool}>
        <div className={styles.modeSection}>
          <h3>Mode</h3>
          <div className={styles.modeButtons}>
            <button
              onClick={() => setMode('encode')}
              className={`${styles.modeBtn} ${mode === 'encode' ? styles.active : ''}`}
            >
              🔗 Encode URL
            </button>
            <button
              onClick={() => setMode('decode')}
              className={`${styles.modeBtn} ${mode === 'decode' ? styles.active : ''}`}
            >
              🔓 Decode URL
            </button>
          </div>
        </div>

        <div className={styles.inputSection}>
          <div className={styles.inputHeader}>
            <h3>Input {mode === 'encode' ? 'Text' : 'URL'}</h3>
            <button onClick={loadSampleData} className={styles.sampleBtn}>
              📝 Load Sample
            </button>
          </div>
          <textarea
            id="url-input"
            name="url-input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter URL to decode...'}
            className={styles.textarea}
          />
        </div>

        <div className={styles.optionsSection}>
          <h3>🛠️ Encoding Options</h3>
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
                <small>Encode ! &apos; ( ) etc.</small>
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

        <div className={styles.actions}>
          <button onClick={handleProcess} className={styles.processBtn} disabled={!inputText}>
            {mode === 'encode' ? '🔗 Encode URL' : '🔓 Decode URL'}
          </button>
          <button onClick={swapTexts} className={styles.swapBtn} disabled={!inputText || !outputText}>
            🔄 Swap
          </button>
          <button onClick={handleClear} className={styles.clearBtn}>
            🗑️ Clear All
          </button>
        </div>

        {outputText && (
          <div className={styles.outputSection}>
            <h3>Output</h3>
            <textarea
              id="url-output"
              name="url-output"
              value={outputText}
              readOnly
              className={styles.textarea}
            />
            <div className={styles.outputActions}>
              <button onClick={copyToClipboard} className={styles.copyBtn}>
                📋 Copy Output
              </button>
              <button onClick={downloadOutput} className={styles.downloadBtn}>
                📥 Download
              </button>
            </div>
          </div>
        )}

        {history.length > 0 && (
          <div className={styles.smartDashboard}>
            <h3>📊 Analytics</h3>
            <div className={styles.analyticsGrid}>
              <div className={styles.statCard}>
                <span className={styles.statValue}>{analytics.totalOperations}</span>
                <span className={styles.statLabel}>Total Operations</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statValue}>{analytics.totalEncodes}</span>
                <span className={styles.statLabel}>Times Encoded</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statValue}>{analytics.totalDecodes}</span>
                <span className={styles.statLabel}>Times Decoded</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statValue}>{analytics.avgSizeChange}%</span>
                <span className={styles.statLabel}>Avg Size Change</span>
              </div>
            </div>
          </div>
        )}

        {history.length > 0 && (
          <div className={styles.historySection}>
            <div className={styles.historyHeader}>
              <h3>📜 History</h3>
              <button onClick={clearHistory} className={styles.clearBtn}>
                🗑️ Clear History
              </button>
            </div>
            <div className={styles.historyList}>
              {history.map((item) => (
                <div key={item.id} className={styles.historyItem}>
                  <div className={styles.historyText}>
                    <div className={styles.historyMeta}>
                      <span className={styles.historyMode}>
                        {item.mode === 'encode' ? '🔗 Encode' : '🔓 Decode'}
                      </span>
                      <span className={styles.historyTime}>
                        {new Date(item.timestamp).toLocaleTimeString()}
                      </span>
                      <span className={styles.historySize}>
                        {item.inputSize}B → {item.outputSize}B
                      </span>
                    </div>
                    <div className={styles.historyContent}>
                      {item.inputPreview.slice(0, 80)}{item.inputPreview.length > 80 ? '...' : ''}
                    </div>
                  </div>
                  <div className={styles.historyActions}>
                    <button
                      onClick={() => loadFromHistory(item)}
                      className={styles.historyBtn}
                      title="Load this"
                    >
                      🔄
                    </button>
                    <button
                      onClick={() => deleteHistoryItem(item.id)}
                      className={styles.historyBtn}
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <ToolInfo
        howItWorks="1. Choose encode or decode mode<br>2. Enter your text or URL<br>3. Adjust options for encoding (spaces, special chars, unicode)<br>4. Click the button to process<br>5. Copy output or download as file<br>6. View history and analytics of operations"
        faqs={[
          { title: "What is URL encoding?", content: "URL encoding converts special characters into a format that can be safely transmitted over the internet using the % symbol followed by hexadecimal digits." },
          { title: "When to use URL encoding?", content: "Use when passing parameters in URLs, API requests, or form data that contain special characters like spaces, & symbols, etc." },
          { title: "What do the options mean?", content: "Encode Spaces converts spaces to %20. Encode Special Chars converts !()' etc. Encode Unicode encodes non-ASCII characters." },
          { title: "Is there a file size limit?", content: "No, but very large URLs may cause issues with some servers (typically limit is 2000-4000 characters)." }
        ]}
        tips={[
          "Always use URL encoding when building query parameters with user input.",
          "Most programming languages have built-in URL encoding functions.",
          "URL encoding increases data size, typically by 2-3x for special characters.",
          "Use 'Swap' to quickly test encoding and decoding of the same text."
        ]}
      />
    </div>
  );
}
