'use client';

import { useEffect, useMemo, useState } from 'react';
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

interface StoredState {
  inputText?: string;
  outputText?: string;
  history?: HistoryItem[];
}

const STORAGE_KEY = 'json-formatter-data';

const createId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const getInitialState = (): StoredState => {
  if (typeof window === 'undefined') {
    return { inputText: '', outputText: '', history: [] };
  }

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      return { inputText: '', outputText: '', history: [] };
    }

    const parsed = JSON.parse(saved) as StoredState;
    return {
      inputText: parsed.inputText || '',
      outputText: parsed.outputText || '',
      history: parsed.history || [],
    };
  } catch (error) {
    console.error('Error loading JSON formatter data:', error);
    return { inputText: '', outputText: '', history: [] };
  }
};

const getByteSize = (value: string) => new Blob([value]).size;

export default function JSONFormatter() {
  const initialState = getInitialState();
  const [inputText, setInputText] = useState(initialState.inputText || '');
  const [outputText, setOutputText] = useState(initialState.outputText || '');
  const [error, setError] = useState('');
  const [indentSize, setIndentSize] = useState(2);
  const [history, setHistory] = useState<HistoryItem[]>(initialState.history || []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ inputText, outputText, history }));
  }, [history, inputText, outputText]);

  const analytics = useMemo(() => {
    const totalFormats = history.filter((item) => item.action === 'format').length;
    const totalMinifies = history.filter((item) => item.action === 'minify').length;
    const totalOperations = history.length;
    const avgCompression = history.length
      ? Math.round(
          (history.reduce((sum, item) => {
            if (item.inputSize === 0) return sum;
            return sum + ((item.inputSize - item.outputSize) / item.inputSize) * 100;
          }, 0) /
            history.length) *
            10
        ) / 10
      : 0;

    return { totalFormats, totalMinifies, totalOperations, avgCompression };
  }, [history]);

  const saveHistoryItem = (result: string, action: 'format' | 'minify') => {
    const nextItem: HistoryItem = {
      id: createId(),
      inputPreview: inputText.trim().slice(0, 100),
      outputPreview: result.slice(0, 100),
      action,
      timestamp: Date.now(),
      inputSize: getByteSize(inputText),
      outputSize: getByteSize(result),
    };

    setHistory((previous) => [nextItem, ...previous].slice(0, 50));
  };

  const processJSON = (action: 'format' | 'minify') => {
    try {
      const parsed = JSON.parse(inputText);
      const result = action === 'format'
        ? JSON.stringify(parsed, null, indentSize)
        : JSON.stringify(parsed);

      setOutputText(result);
      setError('');
      saveHistoryItem(result, action);
    } catch (caughtError) {
      setError(`Invalid JSON: ${(caughtError as Error).message}`);
      setOutputText('');
    }
  };

  const validateJSON = () => {
    try {
      JSON.parse(inputText);
      setError('');
      alert('Valid JSON.');
    } catch (caughtError) {
      setError(`Invalid JSON: ${(caughtError as Error).message}`);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(outputText);
      alert('Copied to clipboard.');
    } catch (caughtError) {
      console.error('Failed to copy:', caughtError);
    }
  };

  const clearAll = () => {
    setInputText('');
    setOutputText('');
    setError('');
  };

  const loadSample = () => {
    setInputText(
      JSON.stringify(
        {
          name: 'John Doe',
          age: 30,
          email: 'john@example.com',
          address: {
            street: '123 Main St',
            city: 'Anytown',
            zipCode: '12345',
          },
          hobbies: ['reading', 'coding', 'gaming'],
          active: true,
        },
        null,
        2
      )
    );
  };

  const swapTexts = () => {
    setInputText(outputText);
    setOutputText(inputText);
    setError('');
  };

  const deleteHistoryItem = (id: string) => {
    setHistory((previous) => previous.filter((item) => item.id !== id));
  };

  const clearHistory = () => {
    if (confirm('Clear all history?')) {
      setHistory([]);
    }
  };

  const loadFromHistory = (item: HistoryItem) => {
    setInputText(item.inputPreview);
    setOutputText(item.outputPreview);
    setError('');
  };

  const downloadJSON = () => {
    if (!outputText) return;

    const blob = new Blob([outputText], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'formatted.json';
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className={styles.container}>
      <h1 className={styles.pageTitle}>
        <span className={styles.icon}>JSON</span>
        <span className={styles.textGradient}>JSON Formatter</span>
      </h1>
      <p>Format, validate, and minify JSON data with browser-side processing.</p>

      <div className={styles.formatter}>
        <div className={styles.inputSection}>
          <div className={styles.inputHeader}>
            <h2>Input JSON</h2>
            <button onClick={loadSample} className={styles.sampleBtn}>Load Sample</button>
          </div>
          <textarea
            id="json-input"
            name="json-input"
            value={inputText}
            onChange={(event) => setInputText(event.target.value)}
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
              onChange={(event) => setIndentSize(Number(event.target.value))}
              className={styles.indentSelect}
            >
              <option value={2}>2 spaces</option>
              <option value={4}>4 spaces</option>
              <option value={1}>1 tab width</option>
            </select>
          </div>

          <div className={styles.buttonGroup}>
            <button onClick={() => processJSON('format')} className={styles.actionBtn} disabled={!inputText.trim()}>Format JSON</button>
            <button onClick={() => processJSON('minify')} className={styles.actionBtn} disabled={!inputText.trim()}>Minify JSON</button>
            <button onClick={validateJSON} className={styles.actionBtn} disabled={!inputText.trim()}>Validate JSON</button>
            <button onClick={swapTexts} className={styles.swapBtn} disabled={!inputText || !outputText}>Swap</button>
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
            <button onClick={copyToClipboard} className={styles.actionBtn} disabled={!outputText}>Copy</button>
            <button onClick={downloadJSON} className={styles.actionBtn} disabled={!outputText}>Download</button>
            <button onClick={clearAll} className={styles.actionBtn}>Clear</button>
          </div>
        </div>
      </div>

      {history.length > 0 && (
        <>
          <div className={styles.smartDashboard}>
            <h3>Analytics</h3>
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
              <h3>History</h3>
              <button onClick={clearHistory} className={styles.clearBtn}>Clear All</button>
            </div>
            <div className={styles.historyList}>
              {history.map((item) => (
                <div key={item.id} className={styles.historyItem}>
                  <div className={styles.historyText}>
                    <div className={styles.historyMeta}>
                      <span className={styles.historyAction}>{item.action === 'format' ? 'Format' : 'Minify'}</span>
                      <span className={styles.historyTime}>{new Date(item.timestamp).toLocaleTimeString()}</span>
                      <span className={styles.historySize}>{item.inputSize}B to {item.outputSize}B</span>
                    </div>
                    <div className={styles.historyContent}>
                      {item.inputPreview.slice(0, 80)}{item.inputPreview.length > 80 ? '...' : ''}
                    </div>
                  </div>
                  <div className={styles.historyActions}>
                    <button onClick={() => loadFromHistory(item)} className={styles.historyBtn} title="Load this">Load</button>
                    <button onClick={() => deleteHistoryItem(item.id)} className={styles.historyBtn} title="Delete">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <ToolInfo
        howItWorks="Paste or type your JSON in the input area<br>Choose indent size for formatted output<br>Use Format JSON, Minify JSON, or Validate JSON as needed<br>Copy or download the processed result"
        faqs={[
          { title: 'What is JSON?', content: 'JSON stands for JavaScript Object Notation, a common text format for storing and exchanging structured data.' },
          { title: 'Why format JSON?', content: 'Formatted JSON is easier to read, debug, and review in APIs or config files.' },
          { title: 'Why minify JSON?', content: 'Minified JSON removes extra spacing to reduce file size for production use.' },
          { title: 'What happens if my JSON is invalid?', content: 'The tool shows the parsing error so you can fix the syntax quickly.' },
        ]}
        tips={[
          'Use formatting while debugging API payloads and minifying before shipping assets.',
          'Validation helps catch missing commas, unmatched braces, and quoted keys issues.',
          'All processing happens in your browser, so your JSON stays local.',
        ]}
      />
    </main>
  );
}
