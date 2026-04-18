'use client';

import { useEffect, useMemo, useState } from 'react';
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

interface StoredState {
  inputText?: string;
  outputText?: string;
  history?: HistoryItem[];
}

const STORAGE_KEY = 'base64-data';
const createId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const getByteSize = (value: string) => new Blob([value]).size;

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
    console.error('Error loading Base64 data:', error);
    return { inputText: '', outputText: '', history: [] };
  }
};

export default function Base64Tool() {
  const initialState = getInitialState();
  const [inputText, setInputText] = useState(initialState.inputText || '');
  const [outputText, setOutputText] = useState(initialState.outputText || '');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [error, setError] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>(initialState.history || []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ inputText, outputText, history }));
  }, [history, inputText, outputText]);

  const analytics = useMemo(() => {
    const totalEncodes = history.filter((item) => item.mode === 'encode').length;
    const totalDecodes = history.filter((item) => item.mode === 'decode').length;
    const totalOperations = history.length;
    const encodeHistory = history.filter((item) => item.mode === 'encode');
    const avgSizeIncrease = encodeHistory.length
      ? Math.round(
          (encodeHistory.reduce((sum, item) => {
            if (item.inputSize === 0) return sum;
            return sum + ((item.outputSize - item.inputSize) / item.inputSize) * 100;
          }, 0) /
            encodeHistory.length) *
            10
        ) / 10
      : 0;

    return { totalEncodes, totalDecodes, totalOperations, avgSizeIncrease };
  }, [history]);

  const saveHistory = (result: string, nextMode: 'encode' | 'decode') => {
    const nextItem: HistoryItem = {
      id: createId(),
      inputPreview: inputText.slice(0, 100),
      outputPreview: result.slice(0, 100),
      mode: nextMode,
      timestamp: Date.now(),
      inputSize: getByteSize(inputText),
      outputSize: getByteSize(result),
    };

    setHistory((previous) => [nextItem, ...previous].slice(0, 50));
  };

  const encodeToBase64 = () => {
    try {
      const encoded = btoa(inputText);
      setOutputText(encoded);
      setError('');
      saveHistory(encoded, 'encode');
    } catch (caughtError) {
      setError(`Failed to encode: ${(caughtError as Error).message}`);
    }
  };

  const decodeFromBase64 = () => {
    try {
      const decoded = atob(inputText);
      setOutputText(decoded);
      setError('');
      saveHistory(decoded, 'decode');
    } catch (caughtError) {
      setError(`Invalid Base64 string: ${(caughtError as Error).message}`);
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
    if (mode === 'encode') {
      setInputText('Hello, World!');
    } else {
      setInputText('SGVsbG8sIFdvcmxkIQ==');
    }
  };

  const swapTexts = () => {
    setInputText(outputText);
    setOutputText(inputText);
    setMode((currentMode) => (currentMode === 'encode' ? 'decode' : 'encode'));
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
    setMode(item.mode);
  };

  return (
    <main className={styles.container}>
      <h1 className={styles.pageTitle}>
        <span className={styles.icon}>Base64</span>
        <span className={styles.textGradient}>Base64 Encoder and Decoder</span>
      </h1>
      <p>Encode text to Base64 or decode Base64 back to text with saved local history.</p>

      <div className={styles.converter}>
        <div className={styles.inputSection}>
          <div className={styles.inputHeader}>
            <h2>Input {mode === 'encode' ? 'Text' : 'Base64'}</h2>
            <button onClick={loadSample} className={styles.sampleBtn}>Load Sample</button>
          </div>
          <textarea id="base64-input" name="base64-input" value={inputText} onChange={(event) => setInputText(event.target.value)} placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter Base64 to decode...'} className={styles.textarea} />
        </div>

        <div className={styles.controls}>
          <h2>Mode</h2>
          <div className={styles.modeSelector}>
            <button onClick={() => setMode('encode')} className={`${styles.modeBtn} ${mode === 'encode' ? styles.active : ''}`}>Encode to Base64</button>
            <button onClick={() => setMode('decode')} className={`${styles.modeBtn} ${mode === 'decode' ? styles.active : ''}`}>Decode from Base64</button>
          </div>

          <button onClick={handleConvert} className={styles.convertBtn} disabled={!inputText}>{mode === 'encode' ? 'Encode' : 'Decode'}</button>
          <button onClick={swapTexts} className={styles.swapBtn} disabled={!inputText || !outputText}>Swap</button>
        </div>

        <div className={styles.outputSection}>
          <h2>Output {mode === 'encode' ? 'Base64' : 'Text'}</h2>
          {error && <div className={styles.error}>{error}</div>}
          <textarea id="base64-output" name="base64-output" value={outputText} readOnly placeholder={mode === 'encode' ? 'Base64 will appear here...' : 'Decoded text will appear here...'} className={`${styles.textarea} ${error ? styles.errorTextarea : ''}`} />
          <div className={styles.outputActions}>
            <button onClick={copyToClipboard} className={styles.actionBtn} disabled={!outputText}>Copy</button>
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
              <h3>History</h3>
              <button onClick={clearHistory} className={styles.clearBtn}>Clear All</button>
            </div>
            <div className={styles.historyList}>
              {history.map((item) => (
                <div key={item.id} className={styles.historyItem}>
                  <div className={styles.historyText}>
                    <div className={styles.historyMeta}>
                      <span className={styles.historyMode}>{item.mode === 'encode' ? 'Encode' : 'Decode'}</span>
                      <span className={styles.historyTime}>{new Date(item.timestamp).toLocaleTimeString()}</span>
                      <span className={styles.historySize}>{item.inputSize}B to {item.outputSize}B</span>
                    </div>
                    <div className={styles.historyContent}>{item.inputPreview.slice(0, 80)}{item.inputPreview.length > 80 ? '...' : ''}</div>
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
        howItWorks="Choose encode or decode mode<br>Enter your text or Base64 string<br>Click the convert button<br>Copy the result or clear to start over"
        faqs={[
          { title: 'What is Base64?', content: 'Base64 is a binary-to-text encoding format that represents data using only ASCII-safe characters.' },
          { title: 'When should I use Base64?', content: 'It is useful for embedding binary data inside text-based formats such as JSON, HTML, or email content.' },
          { title: 'Is Base64 secure?', content: 'No. Base64 is only encoding, not encryption, so anyone can decode it.' },
          { title: 'What characters are used?', content: 'Standard Base64 uses A-Z, a-z, 0-9, plus, slash, and equals for padding.' },
        ]}
        tips={[
          'Use Base64 for compact transport of text-safe payloads, not for security.',
          'Encoded output is usually larger than the original by about one third.',
          'If decoding fails, check for invalid characters or missing padding.',
        ]}
      />
    </main>
  );
}
