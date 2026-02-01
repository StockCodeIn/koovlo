'use client';

import { useState, useEffect } from 'react';
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

export default function CaseConverter() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [lastSaved, setLastSaved] = useState('');
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('case-converter-data');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setInputText(data.inputText || '');
        setOutputText(data.outputText || '');
        setHistory(data.history || []);
      } catch (e) {
        console.error('Error loading data:', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      'case-converter-data',
      JSON.stringify({ inputText, outputText, history })
    );
    setLastSaved(new Date().toLocaleTimeString());
  }, [inputText, outputText, history]);

  const convertCase = (type: string) => {
    let result = '';
    switch (type) {
      case 'uppercase':
        result = inputText.toUpperCase();
        break;
      case 'lowercase':
        result = inputText.toLowerCase();
        break;
      case 'titlecase':
        result = inputText.replace(/\w\S*/g, (txt) =>
          txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        );
        break;
      case 'sentencecase':
        result = inputText.charAt(0).toUpperCase() + inputText.slice(1).toLowerCase();
        break;
      case 'camelcase':
        result = inputText
          .toLowerCase()
          .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
        break;
      case 'snakecase':
        result = inputText
          .replace(/\W+/g, ' ')
          .split(/ |\B(?=[A-Z])/)
          .map(word => word.toLowerCase())
          .join('_');
        break;
      case 'kebabcase':
        result = inputText
          .replace(/\W+/g, ' ')
          .split(/ |\B(?=[A-Z])/)
          .map(word => word.toLowerCase())
          .join('-');
        break;
      case 'alternating':
        result = inputText
          .split('')
          .map((char, index) =>
            index % 2 === 0 ? char.toUpperCase() : char.toLowerCase()
          )
          .join('');
        break;
      case 'inverse':
        result = inputText
          .split('')
          .map(char =>
            char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase()
          )
          .join('');
        break;
      default:
        result = inputText;
    }
    setOutputText(result);

    if (inputText.trim()) {
      const words = inputText.trim().split(/\s+/).length;
      const characters = inputText.length;
      const newItem: HistoryItem = {
        id: Date.now().toString(),
        inputPreview: inputText.trim().slice(0, 160) + (inputText.trim().length > 160 ? '...' : ''),
        outputPreview: result.trim().slice(0, 160) + (result.trim().length > 160 ? '...' : ''),
        caseType: type,
        words,
        characters,
        createdAt: new Date().toISOString()
      };
      setHistory([newItem, ...history].slice(0, 50));
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
  };

  const swapTexts = () => {
    if (!outputText) return;
    setInputText(outputText);
    setOutputText(inputText);
  };

  const deleteHistoryItem = (id: string) => {
    setHistory(history.filter(item => item.id !== id));
  };

  const clearHistory = () => {
    if (confirm('Are you sure you want to clear all history?')) {
      setHistory([]);
    }
  };

  const getAnalytics = () => {
    const totalConversions = history.length;
    const totalWords = history.reduce((sum, item) => sum + item.words, 0);
    const totalCharacters = history.reduce((sum, item) => sum + item.characters, 0);
    const averageWords = totalConversions > 0 ? Math.round(totalWords / totalConversions) : 0;

    return { totalConversions, totalWords, totalCharacters, averageWords };
  };

  const analytics = getAnalytics();

  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>🔄 Case Converter</h1>
        <p className={styles.subtitle}>Convert text between different case styles instantly.</p>
        <div className={styles.dataInfo}>
          <span className={styles.infoItem}>💾 <strong>Auto-Save:</strong> Your text is saved</span>
          <span className={styles.infoSeparator}>•</span>
          <span className={styles.infoItem}>{lastSaved && <><strong>Last saved:</strong> {lastSaved}</>}</span>
          <span className={styles.infoSeparator}>•</span>
          <span className={styles.infoItem}>📈 <strong>{history.length}</strong> conversions</span>
        </div>
      </div>

      {(inputText.trim() || history.length > 0) && (
        <div className={styles.smartDashboard}>
          <div className={styles.dashboardSection}>
            <h3>📊 Live Stats</h3>
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <span className={styles.statNumber}>{inputText.trim() ? inputText.trim().split(/\s+/).length : 0}</span>
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
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter your text here..."
            className={styles.textarea}
          />
        </div>

        <div className={styles.controls}>
          <h2>Convert To</h2>
          <div className={styles.buttonGrid}>
            <button onClick={() => convertCase('uppercase')} className={styles.convertBtn}>
              UPPERCASE
            </button>
            <button onClick={() => convertCase('lowercase')} className={styles.convertBtn}>
              lowercase
            </button>
            <button onClick={() => convertCase('titlecase')} className={styles.convertBtn}>
              Title Case
            </button>
            <button onClick={() => convertCase('sentencecase')} className={styles.convertBtn}>
              Sentence case
            </button>
            <button onClick={() => convertCase('camelcase')} className={styles.convertBtn}>
              camelCase
            </button>
            <button onClick={() => convertCase('snakecase')} className={styles.convertBtn}>
              snake_case
            </button>
            <button onClick={() => convertCase('kebabcase')} className={styles.convertBtn}>
              kebab-case
            </button>
            <button onClick={() => convertCase('alternating')} className={styles.convertBtn}>
              AlTeRnAtInG
            </button>
            <button onClick={() => convertCase('inverse')} className={styles.convertBtn}>
              iNvErSe
            </button>
          </div>
          <div className={styles.quickActions}>
            <button onClick={swapTexts} className={styles.quickBtn} disabled={!outputText}>
              ↕️ Swap
            </button>
            <button onClick={() => setShowAnalytics(!showAnalytics)} className={styles.quickBtn}>
              📈 Analytics
            </button>
            <button onClick={() => setShowHistory(!showHistory)} className={styles.quickBtn}>
              📋 History
            </button>
          </div>
        </div>

        <div className={styles.outputSection}>
          <h2>Output Text</h2>
          <textarea
            value={outputText}
            readOnly
            placeholder="Converted text will appear here..."
            className={styles.textarea}
          />
          <div className={styles.outputActions}>
            <button onClick={copyToClipboard} className={styles.actionBtn} disabled={!outputText}>
              Copy to Clipboard
            </button>
            <button onClick={clearAll} className={styles.actionBtn}>
              Clear All
            </button>
          </div>
        </div>
      </div>

      {showAnalytics && history.length > 0 && (
        <div className={styles.analyticsSection}>
          <h3>📊 Detailed Analytics</h3>
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
            <h3>📋 Conversion History</h3>
            <button onClick={clearHistory} className={styles.clearBtn}>Clear All</button>
          </div>
          <div className={styles.historyList}>
            {history.map(item => (
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
        howItWorks="Enter or paste your text in the input area<br>Choose the desired case conversion from the options<br>View the converted text in the output area<br>Copy the result or clear to start over"
        faqs={[
          { title: "What is Title Case?", content: "First letter of each word is capitalized" },
          { title: "What is camelCase?", content: "Used in programming, first word lowercase, subsequent words capitalized" },
          { title: "What is snake_case?", content: "Words separated by underscores, all lowercase" },
          { title: "What is kebab-case?", content: "Words separated by hyphens, all lowercase" }
        ]}
        tips={["Useful for formatting code, titles, or following style guides", "Alternating case can be used for emphasis or fun text", "Inverse case flips uppercase to lowercase and vice versa"]}
      />
    </main>
  );
}