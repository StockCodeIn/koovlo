'use client';

import { useEffect, useMemo, useState } from 'react';
import ToolInfo from '@/components/ToolInfo';
import styles from './caseconverter.module.css';

interface HistoryItem {
  id: string;
  inputPreview: string;
  outputPreview: string;
  caseType: string;
  words: number;
  characters: number;
  createdAt: string;
}

interface StoredState {
  inputText?: string;
  outputText?: string;
  history?: HistoryItem[];
}

const STORAGE_KEY = 'case-converter-data';
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
    console.error('Error loading case converter data:', error);
    return { inputText: '', outputText: '', history: [] };
  }
};

const toTitleCase = (value: string) =>
  value.replace(/\w\S*/g, (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());

const toSentenceCase = (value: string) =>
  value
    .toLowerCase()
    .replace(/(^\s*[a-z])|([.!?]\s+[a-z])/g, (match) => match.toUpperCase());

const convertTextCase = (value: string, type: string) => {
  switch (type) {
    case 'uppercase':
      return value.toUpperCase();
    case 'lowercase':
      return value.toLowerCase();
    case 'titlecase':
      return toTitleCase(value);
    case 'sentencecase':
      return toSentenceCase(value);
    case 'camelcase': {
      const words = value
        .trim()
        .split(/[^a-zA-Z0-9]+/)
        .filter(Boolean)
        .map((word) => word.toLowerCase());
      return words
        .map((word, index) => (index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)))
        .join('');
    }
    case 'snakecase':
      return value
        .trim()
        .split(/[^a-zA-Z0-9]+|(?=[A-Z])/)
        .filter(Boolean)
        .map((word) => word.toLowerCase())
        .join('_');
    case 'kebabcase':
      return value
        .trim()
        .split(/[^a-zA-Z0-9]+|(?=[A-Z])/)
        .filter(Boolean)
        .map((word) => word.toLowerCase())
        .join('-');
    case 'alternating':
      return value
        .split('')
        .map((char, index) => (index % 2 === 0 ? char.toUpperCase() : char.toLowerCase()))
        .join('');
    case 'inverse':
      return value
        .split('')
        .map((char) =>
          char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase()
        )
        .join('');
    default:
      return value;
  }
};

export default function CaseConverter() {
  const initialState = getInitialState();
  const [inputText, setInputText] = useState(initialState.inputText || '');
  const [outputText, setOutputText] = useState(initialState.outputText || '');
  const [history, setHistory] = useState<HistoryItem[]>(initialState.history || []);
  const [lastSaved, setLastSaved] = useState('');
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ inputText, outputText, history })
    );
  }, [history, inputText, outputText]);

  const inputWordCount = useMemo(() => {
    const trimmed = inputText.trim();
    return trimmed ? trimmed.split(/\s+/).length : 0;
  }, [inputText]);

  const analytics = useMemo(() => {
    const totalConversions = history.length;
    const totalWords = history.reduce((sum, item) => sum + item.words, 0);
    const totalCharacters = history.reduce((sum, item) => sum + item.characters, 0);
    const averageWords = totalConversions > 0 ? Math.round(totalWords / totalConversions) : 0;

    return { totalConversions, totalWords, totalCharacters, averageWords };
  }, [history]);

  const convertCase = (type: string) => {
    const result = convertTextCase(inputText, type);
    setOutputText(result);
    setLastSaved(new Date().toLocaleTimeString());

    if (!inputText.trim()) {
      return;
    }

    const trimmedInput = inputText.trim();
    const trimmedOutput = result.trim();
    const nextItem: HistoryItem = {
      id: createId(),
      inputPreview: trimmedInput.slice(0, 160) + (trimmedInput.length > 160 ? '...' : ''),
      outputPreview: trimmedOutput.slice(0, 160) + (trimmedOutput.length > 160 ? '...' : ''),
      caseType: type,
      words: trimmedInput.split(/\s+/).length,
      characters: inputText.length,
      createdAt: new Date().toISOString(),
    };

    setHistory((previous) => [nextItem, ...previous].slice(0, 50));
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(outputText);
      alert('Copied to clipboard.');
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const clearAll = () => {
    setInputText('');
    setOutputText('');
    setLastSaved(new Date().toLocaleTimeString());
  };

  const swapTexts = () => {
    if (!outputText) return;
    setInputText(outputText);
    setOutputText(inputText);
    setLastSaved(new Date().toLocaleTimeString());
  };

  const deleteHistoryItem = (id: string) => {
    setHistory((previous) => previous.filter((item) => item.id !== id));
    setLastSaved(new Date().toLocaleTimeString());
  };

  const clearHistory = () => {
    if (confirm('Are you sure you want to clear all history?')) {
      setHistory([]);
      setLastSaved(new Date().toLocaleTimeString());
    }
  };

  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Case Converter</h1>
        <p className={styles.subtitle}>Convert text between common writing and coding case styles instantly.</p>
        <div className={styles.dataInfo}>
          <span className={styles.infoItem}><strong>Auto-save:</strong> Stored in your browser</span>
          <span className={styles.infoSeparator}>•</span>
          <span className={styles.infoItem}>{lastSaved ? <><strong>Last update:</strong> {lastSaved}</> : 'Ready to convert'}</span>
          <span className={styles.infoSeparator}>•</span>
          <span className={styles.infoItem}><strong>{history.length}</strong> conversions</span>
        </div>
      </div>

      {(inputText.trim() || history.length > 0) && (
        <div className={styles.smartDashboard}>
          <div className={styles.dashboardSection}>
            <h3>Live Stats</h3>
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <span className={styles.statNumber}>{inputWordCount}</span>
                <span className={styles.statName}>Words</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statNumber}>{inputText.length}</span>
                <span className={styles.statName}>Characters</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statNumber}>{outputText.length}</span>
                <span className={styles.statName}>Output Length</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statNumber}>{history.length}</span>
                <span className={styles.statName}>Conversions</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={styles.converter}>
        <div className={styles.inputSection}>
          <h2>Input Text</h2>
          <textarea
            id="case-input"
            value={inputText}
            onChange={(event) => setInputText(event.target.value)}
            placeholder="Enter your text here..."
            className={styles.textarea}
            aria-label="Text input for case conversion"
          />
        </div>

        <div className={styles.controls}>
          <h2>Convert To</h2>
          <div className={styles.buttonGrid}>
            <button onClick={() => convertCase('uppercase')} className={styles.convertBtn}>UPPERCASE</button>
            <button onClick={() => convertCase('lowercase')} className={styles.convertBtn}>lowercase</button>
            <button onClick={() => convertCase('titlecase')} className={styles.convertBtn}>Title Case</button>
            <button onClick={() => convertCase('sentencecase')} className={styles.convertBtn}>Sentence case</button>
            <button onClick={() => convertCase('camelcase')} className={styles.convertBtn}>camelCase</button>
            <button onClick={() => convertCase('snakecase')} className={styles.convertBtn}>snake_case</button>
            <button onClick={() => convertCase('kebabcase')} className={styles.convertBtn}>kebab-case</button>
            <button onClick={() => convertCase('alternating')} className={styles.convertBtn}>AlTeRnAtInG</button>
            <button onClick={() => convertCase('inverse')} className={styles.convertBtn}>iNvErSe</button>
          </div>
          <div className={styles.quickActions}>
            <button onClick={swapTexts} className={styles.quickBtn} disabled={!outputText}>Swap</button>
            <button onClick={() => setShowAnalytics((value) => !value)} className={styles.quickBtn}>Analytics</button>
            <button onClick={() => setShowHistory((value) => !value)} className={styles.quickBtn}>History</button>
          </div>
        </div>

        <div className={styles.outputSection}>
          <h2>Output Text</h2>
          <textarea
            id="case-output"
            value={outputText}
            readOnly
            placeholder="Converted text will appear here..."
            className={styles.textarea}
            aria-label="Text output from case conversion"
          />
          <div className={styles.outputActions}>
            <button onClick={copyToClipboard} className={styles.actionBtn} disabled={!outputText}>Copy to Clipboard</button>
            <button onClick={clearAll} className={styles.actionBtn}>Clear All</button>
          </div>
        </div>
      </div>

      {showAnalytics && history.length > 0 && (
        <div className={styles.analyticsSection}>
          <h3>Detailed Analytics</h3>
          <div className={styles.analyticsGrid}>
            <div className={styles.analyticsCard}>
              <h4>Usage Summary</h4>
              <div className={styles.analyticsMetric}>
                <span>Total Conversions</span>
                <span className={styles.metricValue}>{analytics.totalConversions}</span>
              </div>
              <div className={styles.analyticsMetric}>
                <span>Total Words</span>
                <span className={styles.metricValue}>{analytics.totalWords}</span>
              </div>
              <div className={styles.analyticsMetric}>
                <span>Total Characters</span>
                <span className={styles.metricValue}>{analytics.totalCharacters}</span>
              </div>
              <div className={styles.analyticsMetric}>
                <span>Avg Words/Conversion</span>
                <span className={styles.metricValue}>{analytics.averageWords}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {showHistory && history.length > 0 && (
        <div className={styles.historySection}>
          <div className={styles.historyHeader}>
            <h3>Conversion History</h3>
            <button onClick={clearHistory} className={styles.clearBtn}>Clear All</button>
          </div>
          <div className={styles.historyList}>
            {history.map((item) => (
              <div key={item.id} className={styles.historyCard}>
                <div className={styles.historyCardHeader}>
                  <span className={styles.historyDate}>{new Date(item.createdAt).toLocaleString()}</span>
                  <button onClick={() => deleteHistoryItem(item.id)} className={styles.deleteBtn}>Delete</button>
                </div>
                <div className={styles.historyMeta}>Type: {item.caseType}</div>
                <p className={styles.historyText}><strong>Input:</strong> {item.inputPreview}</p>
                <p className={styles.historyText}><strong>Output:</strong> {item.outputPreview}</p>
                <div className={styles.historyStats}>
                  <span>{item.words} words</span>
                  <span>{item.characters} chars</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <ToolInfo
        howItWorks="Enter or paste your text in the input area<br>Choose the desired case conversion from the options<br>Review the converted text in the output area<br>Copy the result or clear to start over"
        faqs={[
          { title: 'What is Title Case?', content: 'The first letter of each main word is capitalized.' },
          { title: 'What is camelCase?', content: 'It is common in programming where the first word is lowercase and the next words start with capitals.' },
          { title: 'What is snake_case?', content: 'Words are lowercase and joined with underscores.' },
          { title: 'What is kebab-case?', content: 'Words are lowercase and joined with hyphens.' },
        ]}
        tips={[
          'Useful for content formatting, coding conventions, and headline cleanup.',
          'Swap lets you continue editing the converted output without retyping.',
          'Sentence case works best on normal prose with punctuation.',
        ]}
      />
    </main>
  );
}
