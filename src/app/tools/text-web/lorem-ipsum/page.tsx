"use client";

import { useEffect, useMemo, useState } from "react";
import ToolInfo from "@/components/ToolInfo";
import styles from "./loremipsum.module.css";

interface HistoryItem {
  id: string;
  paragraphs: number;
  wordsPerParagraph: number;
  wordCount: number;
  timestamp: number;
  preview: string;
}

interface StoredState {
  generatedText?: string;
  history?: HistoryItem[];
}

const loremWords = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
  "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
  "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud",
  "exercitation", "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo",
  "consequat", "duis", "aute", "irure", "reprehenderit", "voluptate", "velit",
  "esse", "cillum", "fugiat", "nulla", "pariatur", "excepteur", "sint", "occaecat",
  "cupidatat", "non", "proident", "sunt", "culpa", "qui", "officia", "deserunt",
  "mollit", "anim", "id", "est", "laborum",
];

const STORAGE_KEY = "lorem-ipsum-data";
const createId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const getInitialState = (): StoredState => {
  if (typeof window === "undefined") {
    return { generatedText: "", history: [] };
  }

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      return { generatedText: "", history: [] };
    }

    const parsed = JSON.parse(saved) as StoredState;
    return {
      generatedText: parsed.generatedText || "",
      history: parsed.history || [],
    };
  } catch (error) {
    console.error("Error loading lorem ipsum data:", error);
    return { generatedText: "", history: [] };
  }
};

export default function LoremIpsumGenerator() {
  const initialState = getInitialState();
  const [paragraphs, setParagraphs] = useState(3);
  const [wordsPerParagraph, setWordsPerParagraph] = useState(50);
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [generatedText, setGeneratedText] = useState(initialState.generatedText || "");
  const [history, setHistory] = useState<HistoryItem[]>(initialState.history || []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ generatedText, history }));
  }, [generatedText, history]);

  const analytics = useMemo(() => {
    const totalGenerations = history.length;
    const totalParagraphs = history.reduce((sum, item) => sum + item.paragraphs, 0);
    const totalWords = history.reduce((sum, item) => sum + item.wordCount, 0);
    const avgWordsPerGeneration = totalGenerations > 0 ? Math.round((totalWords / totalGenerations) * 10) / 10 : 0;
    return { totalGenerations, totalParagraphs, totalWords, avgWordsPerGeneration };
  }, [history]);

  const generateLoremIpsum = () => {
    const blocks = Array.from({ length: paragraphs }, (_, paragraphIndex) => {
      const words = Array.from({ length: wordsPerParagraph }, (_, wordIndex) => {
        if (startWithLorem && paragraphIndex === 0 && wordIndex === 0) return "Lorem";
        if (startWithLorem && paragraphIndex === 0 && wordIndex === 1) return "ipsum";
        const word = loremWords[Math.floor(Math.random() * loremWords.length)];
        return wordIndex === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word;
      });

      return `${words.join(" ")}.`;
    });

    const result = blocks.join("\n\n");
    setGeneratedText(result);

    const wordCount = result.split(/\s+/).filter(Boolean).length;
    const nextItem: HistoryItem = {
      id: createId(),
      paragraphs,
      wordsPerParagraph,
      wordCount,
      timestamp: Date.now(),
      preview: result.slice(0, 80),
    };

    setHistory((previous) => [nextItem, ...previous].slice(0, 50));
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedText);
      alert("Copied to clipboard.");
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const clearText = () => {
    setGeneratedText("");
  };

  const downloadText = () => {
    if (!generatedText) return;

    const blob = new Blob([generatedText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "lorem-ipsum.txt";
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  };

  const deleteHistoryItem = (id: string) => {
    setHistory((previous) => previous.filter((item) => item.id !== id));
  };

  const clearHistory = () => {
    if (confirm("Clear all history?")) {
      setHistory([]);
    }
  };

  const loadFromHistory = (item: HistoryItem) => {
    setParagraphs(item.paragraphs);
    setWordsPerParagraph(item.wordsPerParagraph);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>
        <span className={styles.icon}>Text</span>
        <span className={styles.textGradient}>Lorem Ipsum Generator</span>
      </h1>
      <p className={styles.subtitle}>Generate placeholder text for layouts, wireframes, and content mockups.</p>

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
                onChange={(event) => setParagraphs(parseInt(event.target.value, 10) || 1)}
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
                onChange={(event) => setWordsPerParagraph(parseInt(event.target.value, 10) || 10)}
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
                onChange={(event) => setStartWithLorem(event.target.checked)}
                className={styles.checkbox}
              />
              Start with traditional lorem ipsum opening
            </label>
          </div>

          <button onClick={generateLoremIpsum} className={styles.generateBtn}>Generate Lorem Ipsum</button>
        </div>

        <div className={styles.output}>
          <div className={styles.outputHeader}>
            <h2>Generated Text</h2>
            <div className={styles.outputActions}>
              <button onClick={copyToClipboard} className={styles.actionBtn} disabled={!generatedText}>Copy</button>
              <button onClick={downloadText} className={styles.actionBtn} disabled={!generatedText}>Download</button>
              <button onClick={clearText} className={styles.actionBtn}>Clear</button>
            </div>
          </div>

          <textarea
            id="lorem-output"
            value={generatedText}
            readOnly
            placeholder="Your lorem ipsum text will appear here..."
            className={styles.textarea}
            aria-label="Generated lorem ipsum text"
          />
        </div>
      </div>

      {history.length > 0 && (
        <div className={styles.smartDashboard}>
          <h3>Analytics</h3>
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
            <h3>Generation History</h3>
            <button onClick={clearHistory} className={styles.clearBtn}>Clear History</button>
          </div>
          <div className={styles.historyList}>
            {history.map((item) => (
              <div key={item.id} className={styles.historyItem}>
                <div className={styles.historyText}>
                  <div className={styles.historyMeta}>
                    <span className={styles.historyConfig}>{item.paragraphs} paragraphs x {item.wordsPerParagraph} words</span>
                    <span className={styles.historyWords}>{item.wordCount} total words</span>
                    <span className={styles.historyTime}>{new Date(item.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <div className={styles.historyContent}>{item.preview}...</div>
                </div>
                <div className={styles.historyActions}>
                  <button onClick={() => loadFromHistory(item)} className={styles.historyBtn} title="Load this config">Load</button>
                  <button onClick={() => deleteHistoryItem(item.id)} className={styles.historyBtn} title="Delete">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <ToolInfo
        howItWorks="Choose the number of paragraphs and words per paragraph<br>Pick whether to begin with the classic lorem ipsum opening<br>Click Generate Lorem Ipsum<br>Copy or download the generated text for your project"
        faqs={[
          { title: 'What is lorem ipsum?', content: 'Lorem ipsum is placeholder text used in design, publishing, and prototypes to preview layouts before final copy is ready.' },
          { title: 'Why use placeholder text?', content: 'It helps you test spacing, alignment, and visual balance without waiting on real content.' },
          { title: 'Can I change the amount?', content: 'Yes, you can control both paragraph count and words per paragraph.' },
          { title: 'Is the text unique?', content: 'The paragraphs are generated randomly from a lorem ipsum word set, so each output varies.' },
        ]}
        tips={[
          'Shorter paragraphs work well for cards and mobile mockups.',
          'Longer paragraphs are useful for article previews and editorial layouts.',
          'Everything is generated locally in your browser, so nothing is uploaded.',
        ]}
      />
    </div>
  );
}
