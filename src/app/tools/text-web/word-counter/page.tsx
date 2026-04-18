"use client";

import { useEffect, useMemo, useState } from "react";
import ToolInfo from "@/components/ToolInfo";
import styles from "./wordcounter.module.css";

interface HistoryItem {
  id: string;
  textPreview: string;
  words: number;
  characters: number;
  charactersNoSpaces: number;
  lines: number;
  sentences: number;
  paragraphs: number;
  readingTime: number;
  createdAt: string;
}

const STORAGE_KEY = "word-counter-data";

function createId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getInitialData(): { text: string; history: HistoryItem[] } {
  if (typeof window === "undefined") {
    return { text: "", history: [] };
  }

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      return { text: "", history: [] };
    }

    const parsed = JSON.parse(saved) as { text?: string; history?: HistoryItem[] };
    return { text: parsed.text || "", history: parsed.history || [] };
  } catch {
    return { text: "", history: [] };
  }
}

export default function WordCounter() {
  const initialData = useMemo(() => getInitialData(), []);
  const [text, setText] = useState(initialData.text);
  const [history, setHistory] = useState<HistoryItem[]>(initialData.history);
  const [lastSaved, setLastSaved] = useState("");
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const stats = useMemo(() => {
    const trimmed = text.trim();
    const wordList = trimmed ? trimmed.split(/\s+/) : [];
    const words = wordList.length;
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, "").length;
    const lines = text ? text.split("\n").length : 0;
    const sentences = trimmed ? text.split(/[.!?]+/).filter((item) => item.trim().length > 0).length : 0;
    const paragraphs = trimmed ? text.split(/\n\s*\n/).filter((item) => item.trim().length > 0).length : 0;
    const readingTime = words > 0 ? Number((words / 200).toFixed(1)) : 0;
    const speakingTime = words > 0 ? Number((words / 130).toFixed(1)) : 0;
    const averageWordLength = words > 0
      ? Number((wordList.reduce((sum, word) => sum + word.length, 0) / words).toFixed(1))
      : 0;
    const longestWord = words > 0
      ? wordList.reduce((longest, word) => (word.length > longest.length ? word : longest), wordList[0])
      : "-";

    return {
      words,
      characters,
      charactersNoSpaces,
      lines,
      sentences,
      paragraphs,
      readingTime,
      speakingTime,
      averageWordLength,
      longestWord,
    };
  }, [text]);

  const analytics = useMemo(() => {
    const totalEntries = history.length;
    const totalWords = history.reduce((sum, item) => sum + item.words, 0);
    const totalCharacters = history.reduce((sum, item) => sum + item.characters, 0);
    const totalReadingTime = history.reduce((sum, item) => sum + item.readingTime, 0);
    const averageWords = totalEntries > 0 ? Math.round(totalWords / totalEntries) : 0;

    return { totalEntries, totalWords, totalCharacters, totalReadingTime, averageWords };
  }, [history]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ text, history }));
  }, [text, history]);

  const updateSavedTime = () => setLastSaved(new Date().toLocaleTimeString());

  const saveSnapshot = () => {
    if (!text.trim()) {
      alert("Please enter some text before saving a snapshot.");
      return;
    }

    const newItem: HistoryItem = {
      id: createId(),
      textPreview: text.trim().slice(0, 200) + (text.trim().length > 200 ? "..." : ""),
      words: stats.words,
      characters: stats.characters,
      charactersNoSpaces: stats.charactersNoSpaces,
      lines: stats.lines,
      sentences: stats.sentences,
      paragraphs: stats.paragraphs,
      readingTime: stats.readingTime,
      createdAt: new Date().toISOString(),
    };

    setHistory((current) => [newItem, ...current].slice(0, 50));
    updateSavedTime();
  };

  const clearHistory = () => {
    if (confirm("Are you sure you want to clear all history?")) {
      setHistory([]);
      updateSavedTime();
    }
  };

  return (
    <main className={styles.container}>
      <section className={styles.box}>
        <div className={styles.header}>
          <h1 className={styles.pageTitle}>
            <span className={styles.icon}>Words</span>
            <span className={styles.textGradient}>Word Counter</span>
          </h1>
          <p className={styles.subtitle}>Count words, characters, reading time, and writing stats instantly.</p>
          <div className={styles.dataInfo}>
            <span className={styles.infoItem}><strong>Auto-save:</strong> Your text stays in the browser</span>
            <span className={styles.infoSeparator}>|</span>
            <span className={styles.infoItem}>{lastSaved ? <><strong>Last saved:</strong> {lastSaved}</> : "Start typing to save"}</span>
            <span className={styles.infoSeparator}>|</span>
            <span className={styles.infoItem}><strong>{history.length}</strong> snapshots</span>
          </div>
        </div>

        {(stats.words > 0 || history.length > 0) && (
          <div className={styles.smartDashboard}>
            <div className={styles.dashboardSection}>
              <h3>Live stats</h3>
              <div className={styles.statsGrid}>
                <div className={styles.statCard}><span className={styles.statNumber}>{stats.words}</span><span className={styles.statName}>Words</span></div>
                <div className={styles.statCard}><span className={styles.statNumber}>{stats.characters}</span><span className={styles.statName}>Characters</span></div>
                <div className={styles.statCard}><span className={styles.statNumber}>{stats.readingTime}m</span><span className={styles.statName}>Read Time</span></div>
                <div className={styles.statCard}><span className={styles.statNumber}>{stats.sentences}</span><span className={styles.statName}>Sentences</span></div>
              </div>
            </div>
          </div>
        )}

        <textarea
          id="word-counter-input"
          className={styles.textarea}
          placeholder="Paste or type your text here..."
          value={text}
          onChange={(event) => {
            setText(event.target.value);
            updateSavedTime();
          }}
          aria-label="Text input for word counting"
        />

        <div className={styles.controls}>
          <button type="button" onClick={saveSnapshot} className={styles.primaryBtn}>Save Snapshot</button>
          <button type="button" onClick={() => { setText(""); updateSavedTime(); }} className={styles.secondaryBtn}>Clear Text</button>
          <button type="button" onClick={() => setShowAnalytics((current) => !current)} className={styles.analyticsBtn}>Analytics</button>
          <button type="button" onClick={() => setShowHistory((current) => !current)} className={styles.historyBtn}>History</button>
        </div>

        <div className={styles.stats}>
          <div className={styles.stat}><span className={styles.number}>{stats.words}</span><span>Words</span></div>
          <div className={styles.stat}><span className={styles.number}>{stats.characters}</span><span>Characters</span></div>
          <div className={styles.stat}><span className={styles.number}>{stats.charactersNoSpaces}</span><span>Characters (no spaces)</span></div>
          <div className={styles.stat}><span className={styles.number}>{stats.lines}</span><span>Lines</span></div>
          <div className={styles.stat}><span className={styles.number}>{stats.paragraphs}</span><span>Paragraphs</span></div>
          <div className={styles.stat}><span className={styles.number}>{stats.readingTime} min</span><span>Reading Time</span></div>
          <div className={styles.stat}><span className={styles.number}>{stats.speakingTime} min</span><span>Speaking Time</span></div>
          <div className={styles.stat}><span className={styles.number}>{stats.averageWordLength}</span><span>Avg Word Length</span></div>
          <div className={styles.stat}><span className={styles.number}>{stats.longestWord}</span><span>Longest Word</span></div>
        </div>

        {showAnalytics && history.length > 0 && (
          <div className={styles.analyticsSection}>
            <h3>Detailed Analytics</h3>
            <div className={styles.analyticsGrid}>
              <div className={styles.analyticsCard}>
                <h4>Usage Summary</h4>
                <div className={styles.analyticsMetric}><span>Total Snapshots</span><span className={styles.metricValue}>{analytics.totalEntries}</span></div>
                <div className={styles.analyticsMetric}><span>Total Words</span><span className={styles.metricValue}>{analytics.totalWords}</span></div>
                <div className={styles.analyticsMetric}><span>Total Characters</span><span className={styles.metricValue}>{analytics.totalCharacters}</span></div>
                <div className={styles.analyticsMetric}><span>Total Reading Time</span><span className={styles.metricValue}>{analytics.totalReadingTime} min</span></div>
                <div className={styles.analyticsMetric}><span>Avg Words/Snapshot</span><span className={styles.metricValue}>{analytics.averageWords}</span></div>
              </div>
            </div>
          </div>
        )}

        {showHistory && history.length > 0 && (
          <div className={styles.historySection}>
            <div className={styles.historyHeader}>
              <h3>Snapshot History</h3>
              <button type="button" onClick={clearHistory} className={styles.clearBtn}>Clear All</button>
            </div>
            <div className={styles.historyList}>
              {history.map((item) => (
                <div key={item.id} className={styles.historyCard}>
                  <div className={styles.historyCardHeader}>
                    <span className={styles.historyDate}>{new Date(item.createdAt).toLocaleString()}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setHistory((current) => current.filter((entry) => entry.id !== item.id));
                        updateSavedTime();
                      }}
                      className={styles.deleteBtn}
                    >
                      Delete
                    </button>
                  </div>
                  <p className={styles.historyText}>{item.textPreview}</p>
                  <div className={styles.historyStats}>
                    <span>{item.words} words</span>
                    <span>{item.readingTime} min read</span>
                    <span>{item.sentences} sentences</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      <ToolInfo
        howItWorks="1. Enter or paste text in the box.<br>2. Review live counts for words, characters, paragraphs, and reading time.<br>3. Save snapshots when you want to compare drafts or preserve stats."
        faqs={[
          { title: "How are words counted?", content: "Words are counted by splitting text on spaces, tabs, and line breaks." },
          { title: "How is reading time calculated?", content: "Reading time is estimated using roughly 200 words per minute." },
        ]}
        tips={[
          "Useful for essays, blog posts, job descriptions, and social content.",
          "Save snapshots to compare multiple versions of the same draft.",
        ]}
      />
    </main>
  );
}
