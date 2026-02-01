'use client';

import { useState, useEffect } from 'react';
import ToolInfo from '@/components/ToolInfo';
import styles from './base64.module.css';

interface HistoryItem {
  id: string;
  inputPreview: string;
  outputPreview: string;
  mode: 'encode' | 'decode';
  timestamp: number;
  inputSize: number;
  outputSize: number;
}

export default function Base64Tool() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [error, setError] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('base64-data');
    if (saved) {
      const { inputText: savedInput, outputText: savedOutput, history: savedHistory } = JSON.parse(saved);
      setInputText(savedInput || '');
      setOutputText(savedOutput || '');
      setHistory(savedHistory || []);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('base64-data', JSON.stringify({ inputText, outputText, history }));
  }, [inputText, outputText, history]);

  const encodeToBase64 = () => {
    try {
      const encoded = btoa(inputText);
      setOutputText(encoded);
      setError('');
      
      const newItem: HistoryItem = {
        id: Date.now().toString(),
        inputPreview: inputText.slice(0, 100),
        outputPreview: encoded.slice(0, 100),
        mode: 'encode',
        timestamp: Date.now(),
        inputSize: new Blob([inputText]).size,
        outputSize: new Blob([encoded]).size
      };
      setHistory(prev => [newItem, ...prev].slice(0, 50));
    } catch (err) {
      setError('Failed to encode: ' + (err as Error).message);
    }
  };

  const decodeFromBase64 = () => {
    try {
      const decoded = atob(inputText);
      setOutputText(decoded);
      setError('');
      
      const newItem: HistoryItem = {
        id: Date.now().toString(),
        inputPreview: inputText.slice(0, 100),
        outputPreview: decoded.slice(0, 100),
        mode: 'decode',
        timestamp: Date.now(),
        inputSize: new Blob([inputText]).size,
        outputSize: new Blob([decoded]).size
      };
      setHistory(prev => [newItem, ...prev].slice(0, 50));
    } catch (err) {
      setError('Invalid Base64 string: ' + (err as Error).message);
    }
  };

  const handleConvert = () => {
    if (mode === 'encode') {
      encodeToBase64();
    } else {
      decodeFromBase64();
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(outputText);
      alert('Copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const clearAll = () => {
    setInputText('');
    setOutputText('');
    setError('');
  };

  const loadSample = () => {
    if (mode === 'encode') {
      setInputText('Hello, World!');
    } else {
      setInputText('SGVsbG8sIFdvcmxkIQ==');
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
    const avgSizeIncrease = history.filter(h => h.mode === 'encode').length > 0
      ? Math.round((history.filter(h => h.mode === 'encode').reduce((sum, item) => sum + ((item.outputSize - item.inputSize) / item.inputSize * 100), 0) / history.filter(h => h.mode === 'encode').length) * 10) / 10
      : 0;
    return { totalEncodes, totalDecodes, totalOperations, avgSizeIncrease };
  };

  const analytics = getAnalytics();

  return (
    <main className={styles.container}>
      <h1 className={styles.pageTitle}>
        <span className={styles.icon}>🔐</span>
        <span className={styles.textGradient}>Base64 Encoder/Decoder</span>
      </h1>
      <p>Encode text to Base64 or decode Base64 back to text with smart tracking.</p>

      <div className={styles.converter}>
        <div className={styles.inputSection}>
          <div className={styles.inputHeader}>
            <h2>Input {mode === 'encode' ? 'Text' : 'Base64'}</h2>
            <button onClick={loadSample} className={styles.sampleBtn}>
              Load Sample
            </button>
          </div>
          <textarea
            id="base64-input"
            name="base64-input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={mode === 'encode' ? "Enter text to encode..." : "Enter Base64 to decode..."}
            className={styles.textarea}
          />
        </div>

        <div className={styles.controls}>
          <h2>Mode</h2>
          <div className={styles.modeSelector}>
            <button
              onClick={() => setMode('encode')}
              className={`${styles.modeBtn} ${mode === 'encode' ? styles.active : ''}`}
            >
              🔒 Encode to Base64
            </button>
            <button
              onClick={() => setMode('decode')}
              className={`${styles.modeBtn} ${mode === 'decode' ? styles.active : ''}`}
            >
              🔓 Decode from Base64
            </button>
          </div>

          <button onClick={handleConvert} className={styles.convertBtn} disabled={!inputText}>
            {mode === 'encode' ? '🔒 Encode' : '🔓 Decode'}
          </button>

          <button onClick={swapTexts} className={styles.swapBtn} disabled={!inputText || !outputText}>
            🔄 Swap
          </button>
        </div>

        <div className={styles.outputSection}>
          <h2>Output {mode === 'encode' ? 'Base64' : 'Text'}</h2>
          {error && <div className={styles.error}>{error}</div>}
          <textarea
            id="base64-output"
            name="base64-output"
            value={outputText}
            readOnly
            placeholder={mode === 'encode' ? "Base64 will appear here..." : "Decoded text will appear here..."}
            className={`${styles.textarea} ${error ? styles.errorTextarea : ''}`}
          />
          <div className={styles.outputActions}>
            <button onClick={copyToClipboard} className={styles.actionBtn} disabled={!outputText}>
              📋 Copy
            </button>
            <button onClick={clearAll} className={styles.actionBtn}>
              🗑️ Clear
            </button>
          </div>
        </div>
      </div>

      {history.length > 0 && (
        <>
          <div className={styles.smartDashboard}>
            <h3>📊 Analytics</h3>
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statValue}>{analytics.totalOperations}</div>
                <div className={styles.statLabel}>Total Operations</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statValue}>{analytics.totalEncodes}</div>
                <div className={styles.statLabel}>Times Encoded</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statValue}>{analytics.totalDecodes}</div>
                <div className={styles.statLabel}>Times Decoded</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statValue}>{analytics.avgSizeIncrease}%</div>
                <div className={styles.statLabel}>Avg. Size Increase</div>
              </div>
            </div>
          </div>

          <div className={styles.historySection}>
            <div className={styles.historyHeader}>
              <h3>📜 History</h3>
              <button onClick={clearHistory} className={styles.clearBtn}>Clear All</button>
            </div>
            <div className={styles.historyList}>
              {history.map(item => (
                <div key={item.id} className={styles.historyItem}>
                  <div className={styles.historyText}>
                    <div className={styles.historyMeta}>
                      <span className={styles.historyMode}>
                        {item.mode === 'encode' ? '🔒 Encode' : '🔓 Decode'}
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
        </>
      )}

      <ToolInfo
        howItWorks="Choose encode or decode mode<br>Enter your text or Base64 string<br>Click the convert button<br>Copy the result or clear to start over"
        faqs={[
          { title: "What is Base64?", content: "Base64 is a binary-to-text encoding scheme that represents binary data in an ASCII string format" },
          { title: "When to use Base64?", content: "For encoding binary data in text formats like JSON, XML, or email attachments" },
          { title: "Is Base64 secure?", content: "No, Base64 is encoding, not encryption. Anyone can decode it." },
          { title: "What characters are used?", content: "A-Z, a-z, 0-9, +, /, and = for padding" }
        ]}
        tips={["Use for embedding images in HTML/CSS", "Useful for API data transmission", "Base64 increases data size by ~33%", "Always validate input before decoding"]}
      />
    </main>
  );
}