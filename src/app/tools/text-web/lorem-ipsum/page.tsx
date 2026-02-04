'use client';

import { useState, useEffect } from 'react';
import ToolInfo from '@/components/ToolInfo';
import styles from './loremipsum.module.css';

interface HistoryItem {
  id: string;
  paragraphs: number;
  wordsPerParagraph: number;
  wordCount: number;
  timestamp: number;
  preview: string;
}

const loremWords = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
  "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
  "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud",
  "exercitation", "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo",
  "consequat", "duis", "aute", "irure", "reprehenderit", "voluptate", "velit",
  "esse", "cillum", "fugiat", "nulla", "pariatur", "excepteur", "sint", "occaecat",
  "cupidatat", "non", "proident", "sunt", "culpa", "qui", "officia", "deserunt",
  "mollit", "anim", "id", "est", "laborum"
];

export default function LoremIpsumGenerator() {
  const [paragraphs, setParagraphs] = useState(3);
  const [wordsPerParagraph, setWordsPerParagraph] = useState(50);
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [generatedText, setGeneratedText] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('lorem-ipsum-data');
    if (saved) {
      const { generatedText: savedText, history: savedHistory } = JSON.parse(saved);
      setGeneratedText(savedText || '');
      setHistory(savedHistory || []);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('lorem-ipsum-data', JSON.stringify({ generatedText, history }));
  }, [generatedText, history]);

  const generateLoremIpsum = () => {
    let result = '';

    for (let p = 0; p < paragraphs; p++) {
      let paragraph = '';
      const wordsNeeded = wordsPerParagraph;

      for (let i = 0; i < wordsNeeded; i++) {
        let word = loremWords[Math.floor(Math.random() * loremWords.length)];

        if (i === 0 && startWithLorem) {
          word = word.charAt(0).toUpperCase() + word.slice(1);
        } else if (i === 0) {
          word = word.charAt(0).toUpperCase() + word.slice(1);
        }

        paragraph += word;

        if (i < wordsNeeded - 1) {
          paragraph += ' ';
        } else {
          paragraph += '.';
        }
      }

      result += paragraph;
      if (p < paragraphs - 1) {
        result += '\n\n';
      }
    }

    setGeneratedText(result);

    // Track in history
    const wordCount = result.split(/\s+/).filter(w => w.length > 0).length;
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      paragraphs,
      wordsPerParagraph,
      wordCount,
      timestamp: Date.now(),
      preview: result.slice(0, 80)
    };
    setHistory(prev => [newItem, ...prev].slice(0, 50));
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedText);
      alert('Copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const clearText = () => {
    setGeneratedText('');
  };

  const downloadText = () => {
    const blob = new Blob([generatedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lorem-ipsum.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
    setParagraphs(item.paragraphs);
    setWordsPerParagraph(item.wordsPerParagraph);
  };

  const getAnalytics = () => {
    const totalGenerations = history.length;
    const totalParagraphs = history.reduce((sum, item) => sum + item.paragraphs, 0);
    const totalWords = history.reduce((sum, item) => sum + item.wordCount, 0);
    const avgWordsPerGeneration = totalGenerations > 0 ? Math.round((totalWords / totalGenerations) * 10) / 10 : 0;
    return { totalGenerations, totalParagraphs, totalWords, avgWordsPerGeneration };
  };

  const analytics = getAnalytics();

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>
        <span className={styles.icon}>📝</span>
        <span className={styles.textGradient}>Lorem Ipsum Generator</span>
      </h1>
      <p className={styles.subtitle}>Generate smart placeholder text for designs with analytics and history.</p>

      <div className={styles.generator}>
        <div className={styles.controls}>
          <h2>Settings</h2>

          <div className={styles.controlGroup}>
            <label htmlFor="paragraphs-count">
              Number of Paragraphs:
              <input
                id="paragraphs-count"
                type="number"
                min="1"
                max="20"
                value={paragraphs}
                onChange={(e) => setParagraphs(parseInt(e.target.value) || 1)}
                className={styles.numberInput}
              />
            </label>
          </div>

          <div className={styles.controlGroup}>
            <label htmlFor="words-per-para">
              Words per Paragraph:
              <input
                id="words-per-para"
                type="number"
                min="10"
                max="200"
                value={wordsPerParagraph}
                onChange={(e) => setWordsPerParagraph(parseInt(e.target.value) || 10)}
                className={styles.numberInput}
              />
            </label>
          </div>

          <div className={styles.controlGroup}>
            <label htmlFor="lorem-checkbox" className={styles.checkboxLabel}>
              <input
                id="lorem-checkbox"
                type="checkbox"
                checked={startWithLorem}
                onChange={(e) => setStartWithLorem(e.target.checked)}
                className={styles.checkbox}
              />
              Start with "Lorem ipsum dolor sit amet..."
            </label>
          </div>

          <button onClick={generateLoremIpsum} className={styles.generateBtn}>
            Generate Lorem Ipsum
          </button>
        </div>

        <div className={styles.output}>
          <div className={styles.outputHeader}>
            <h2>Generated Text</h2>
            <div className={styles.outputActions}>
              <button onClick={copyToClipboard} className={styles.actionBtn} disabled={!generatedText}>
                📋 Copy
              </button>
              <button onClick={downloadText} className={styles.actionBtn} disabled={!generatedText}>
                📥 Download
              </button>
              <button onClick={clearText} className={styles.actionBtn}>
                🗑️ Clear
              </button>
            </div>
          </div>

          <textarea
            id="lorem-output"
            value={generatedText}
            readOnly
            placeholder="Your lorem ipsum text will appear here..."
            className={styles.textarea}
            aria-label="Generated Lorem Ipsum text"
          />
        </div>
      </div>

      {history.length > 0 && (
        <div className={styles.smartDashboard}>
          <h3>📊 Analytics</h3>
          <div className={styles.analyticsGrid}>
            <div className={styles.statCard}>
              <span className={styles.statValue}>{analytics.totalGenerations}</span>
              <span className={styles.statLabel}>Generations</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statValue}>{analytics.totalParagraphs}</span>
              <span className={styles.statLabel}>Total Paragraphs</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statValue}>{analytics.totalWords}</span>
              <span className={styles.statLabel}>Total Words</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statValue}>{analytics.avgWordsPerGeneration}</span>
              <span className={styles.statLabel}>Avg Words/Gen</span>
            </div>
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div className={styles.historySection}>
          <div className={styles.historyHeader}>
            <h3>📜 Generation History</h3>
            <button onClick={clearHistory} className={styles.clearBtn}>
              🗑️ Clear History
            </button>
          </div>
          <div className={styles.historyList}>
            {history.map((item) => (
              <div key={item.id} className={styles.historyItem}>
                <div className={styles.historyText}>
                  <div className={styles.historyMeta}>
                    <span className={styles.historyConfig}>
                      {item.paragraphs} paragraphs × {item.wordsPerParagraph} words
                    </span>
                    <span className={styles.historyWords}>
                      {item.wordCount} total words
                    </span>
                    <span className={styles.historyTime}>
                      {new Date(item.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className={styles.historyContent}>
                    {item.preview}...
                  </div>
                </div>
                <div className={styles.historyActions}>
                  <button
                    onClick={() => loadFromHistory(item)}
                    className={styles.historyBtn}
                    title="Load this config"
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

      <ToolInfo
        howItWorks="Set the number of paragraphs and words per paragraph<br>Choose whether to start with traditional lorem ipsum<br>Click 'Generate Lorem Ipsum'<br>Copy the generated text for your use"
        faqs={[
          { title: "What is Lorem Ipsum?", content: "Lorem Ipsum is placeholder text derived from Cicero's writings, used in design and publishing." },
          { title: "Why use Lorem Ipsum?", content: "It allows designers to focus on layout without being distracted by readable content." },
          { title: "Is it free to use?", content: "Yes, Lorem Ipsum has been the industry's standard dummy text for centuries." },
          { title: "Can I customize it?", content: "Yes, adjust paragraphs, word count, and starting text to fit your needs." }
        ]}
        tips={["Use for website mockups and print layouts<br>Adjust word count based on your content needs<br>Traditional lorem ipsum starts with 'Lorem ipsum dolor sit amet'<br>Generated text is random but readable"]}
      />
    </div>
  );
}