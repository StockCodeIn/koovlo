'use client';

import { useState, useEffect } from 'react';
import ToolInfo from '@/components/ToolInfo';
import styles from './jsonformatter.module.css';

interface HistoryItem {
  id: string;
  inputPreview: string;
  outputPreview: string;
  action: 'format' | 'minify';
  timestamp: number;
  inputSize: number;
  outputSize: number;
}

export default function JSONFormatter() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [error, setError] = useState('');
  const [indentSize, setIndentSize] = useState(2);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('json-formatter-data');
    if (saved) {
      const { inputText: savedInput, outputText: savedOutput, history: savedHistory } = JSON.parse(saved);
      setInputText(savedInput || '');
      setOutputText(savedOutput || '');
      setHistory(savedHistory || []);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('json-formatter-data', JSON.stringify({ inputText, outputText, history }));
  }, [inputText, outputText, history]);

  const formatJSON = () => {
    try {
      const parsed = JSON.parse(inputText);
      const formatted = JSON.stringify(parsed, null, indentSize);
      setOutputText(formatted);
      setError('');
      
      const newItem: HistoryItem = {
        id: Date.now().toString(),
        inputPreview: inputText.trim().slice(0, 100),
        outputPreview: formatted.slice(0, 100),
        action: 'format',
        timestamp: Date.now(),
        inputSize: new Blob([inputText]).size,
        outputSize: new Blob([formatted]).size
      };
      setHistory(prev => [newItem, ...prev].slice(0, 50));
    } catch (err) {
      setError('Invalid JSON: ' + (err as Error).message);
      setOutputText('');
    }
  };

  const minifyJSON = () => {
    try {
      const parsed = JSON.parse(inputText);
      const minified = JSON.stringify(parsed);
      setOutputText(minified);
      setError('');
      
      const newItem: HistoryItem = {
        id: Date.now().toString(),
        inputPreview: inputText.trim().slice(0, 100),
        outputPreview: minified.slice(0, 100),
        action: 'minify',
        timestamp: Date.now(),
        inputSize: new Blob([inputText]).size,
        outputSize: new Blob([minified]).size
      };
      setHistory(prev => [newItem, ...prev].slice(0, 50));
    } catch (err) {
      setError('Invalid JSON: ' + (err as Error).message);
      setOutputText('');
    }
  };

  const validateJSON = () => {
    try {
      JSON.parse(inputText);
      setError('');
      alert('Valid JSON!');
    } catch (err) {
      setError('Invalid JSON: ' + (err as Error).message);
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
    const sample = {
      name: "John Doe",
      age: 30,
      email: "john@example.com",
      address: {
        street: "123 Main St",
        city: "Anytown",
        zipCode: "12345"
      },
      hobbies: ["reading", "coding", "gaming"],
      active: true
    };
    setInputText(JSON.stringify(sample, null, 2));
  };

  const swapTexts = () => {
    setInputText(outputText);
    setOutputText(inputText);
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
  };

  const downloadJSON = () => {
    if (!outputText) return;
    const blob = new Blob([outputText], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const getAnalytics = () => {
    const totalFormats = history.filter(h => h.action === 'format').length;
    const totalMinifies = history.filter(h => h.action === 'minify').length;
    const totalOperations = history.length;
    const avgCompression = history.length > 0
      ? Math.round((history.reduce((sum, item) => sum + ((item.inputSize - item.outputSize) / item.inputSize * 100), 0) / history.length) * 10) / 10
      : 0;
    return { totalFormats, totalMinifies, totalOperations, avgCompression };
  };

  const analytics = getAnalytics();

  return (
    <main className={styles.container}>
      <h1 className={styles.pageTitle}>
        <span className={styles.icon}>📋</span>
        <span className={styles.textGradient}>JSON Formatter</span>
      </h1>
      <p>Format, validate, and minify JSON data with smart tracking and analytics.</p>

      <div className={styles.formatter}>
        <div className={styles.inputSection}>
          <div className={styles.inputHeader}>
            <h2>Input JSON</h2>
            <button onClick={loadSample} className={styles.sampleBtn}>
              Load Sample
            </button>
          </div>
          <textarea
            id="json-input"
            name="json-input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste your JSON here..."
            className={styles.textarea}
          />
        </div>

        <div className={styles.controls}>
          <h2>Actions</h2>
          <div className={styles.controlGroup}>
            <label htmlFor="indent-size">Indent Size:</label>
            <select
              id="indent-size"
              name="indent-size"
              value={indentSize}
              onChange={(e) => setIndentSize(Number(e.target.value))}
              className={styles.indentSelect}
            >
              <option value={2}>2 spaces</option>
              <option value={4}>4 spaces</option>
              <option value={1}>1 tab</option>
            </select>
          </div>

          <div className={styles.buttonGroup}>
            <button onClick={formatJSON} className={styles.actionBtn} disabled={!inputText.trim()}>
              📝 Format JSON
            </button>
            <button onClick={minifyJSON} className={styles.actionBtn} disabled={!inputText.trim()}>
              🗜️ Minify JSON
            </button>
            <button onClick={validateJSON} className={styles.actionBtn} disabled={!inputText.trim()}>
              ✅ Validate JSON
            </button>
            <button onClick={swapTexts} className={styles.swapBtn} disabled={!inputText || !outputText}>
              🔄 Swap
            </button>
          </div>
        </div>

        <div className={styles.outputSection}>
          <h2>Output</h2>
          {error && <div className={styles.error}>{error}</div>}
          <textarea
            id="json-output"
            name="json-output"
            value={outputText}
            readOnly
            placeholder="Formatted JSON will appear here..."
            className={`${styles.textarea} ${error ? styles.errorTextarea : ''}`}
          />
          <div className={styles.outputActions}>
            <button onClick={copyToClipboard} className={styles.actionBtn} disabled={!outputText}>
              📋 Copy
            </button>
            <button onClick={downloadJSON} className={styles.actionBtn} disabled={!outputText}>
              💾 Download
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
                <div className={styles.statValue}>{analytics.totalFormats}</div>
                <div className={styles.statLabel}>Times Formatted</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statValue}>{analytics.totalMinifies}</div>
                <div className={styles.statLabel}>Times Minified</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statValue}>{analytics.avgCompression}%</div>
                <div className={styles.statLabel}>Avg. Size Change</div>
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
                      <span className={styles.historyAction}>
                        {item.action === 'format' ? '📝 Format' : '🗜️ Minify'}
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
        howItWorks="Paste or type your JSON in the input area<br>Choose indent size (2 spaces, 4 spaces, or tab)<br>Click 'Format JSON' to pretty-print with indentation<br>Click 'Minify JSON' to compress to single line<br>Click 'Validate JSON' to check syntax<br>Copy the result or clear to start over"
        faqs={[
          { title: "What is JSON?", content: "JavaScript Object Notation - a lightweight data format" },
          { title: "Why format JSON?", content: "Makes it human-readable with proper indentation" },
          { title: "Why minify JSON?", content: "Reduces file size for production use" },
          { title: "What if JSON is invalid?", content: "Error message will show the specific issue" }
        ]}
        tips={["Use for API responses, configuration files, or data exchange", "2 spaces is most common for web development", "Minified JSON loads faster but is harder to read", "Always validate before using formatted JSON"]}
      />
    </main>
  );
}