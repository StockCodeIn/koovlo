"use client";

import { useState, useEffect } from "react";
import styles from "./wordcounter.module.css";
import ToolInfo from "@/components/ToolInfo";

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

export default function WordCounter() {
  const [text, setText] = useState("");
  const [stats, setStats] = useState({
    words: 0,
    characters: 0,
    charactersNoSpaces: 0,
    lines: 0,
    sentences: 0,
    paragraphs: 0,
    readingTime: 0,
    speakingTime: 0,
    averageWordLength: 0,
    longestWord: "-"
  });
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [lastSaved, setLastSaved] = useState("");
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("word-counter-data");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setText(data.text || "");
        setHistory(data.history || []);
      } catch (e) {
        console.error("Error loading data:", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "word-counter-data",
      JSON.stringify({ text, history })
    );
    setLastSaved(new Date().toLocaleTimeString());
  }, [text, history]);

  useEffect(() => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, "").length;
    const lines = text.length > 0 ? text.split("\n").length : 0;
    const sentences = text.trim() ? text.split(/[.!?]+/).filter(s => s.trim().length > 0).length : 0;
    const paragraphs = text.trim() ? text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length : 0;
    const readingTime = words > 0 ? parseFloat((words / 200).toFixed(1)) : 0; // 200 wpm
    const speakingTime = words > 0 ? parseFloat((words / 130).toFixed(1)) : 0; // 130 wpm
    const wordList = text.trim() ? text.trim().split(/\s+/) : [];
    const averageWordLength = wordList.length > 0
      ? parseFloat((wordList.reduce((sum, w) => sum + w.length, 0) / wordList.length).toFixed(1))
      : 0;
    const longestWord = wordList.length > 0
      ? wordList.reduce((longest, w) => (w.length > longest.length ? w : longest), wordList[0])
      : "-";

    setStats({
      words,
      characters,
      charactersNoSpaces,
      lines,
      sentences,
      paragraphs,
      readingTime,
      speakingTime,
      averageWordLength,
      longestWord
    });
  }, [text]);

  const saveSnapshot = () => {
    if (!text.trim()) {
      alert("Please enter some text before saving a snapshot.");
      return;
    }

    const newItem: HistoryItem = {
      id: Date.now().toString(),
      textPreview: text.trim().slice(0, 200) + (text.trim().length > 200 ? "..." : ""),
      words: stats.words,
      characters: stats.characters,
      charactersNoSpaces: stats.charactersNoSpaces,
      lines: stats.lines,
      sentences: stats.sentences,
      paragraphs: stats.paragraphs,
      readingTime: stats.readingTime,
      createdAt: new Date().toISOString()
    };

    setHistory([newItem, ...history].slice(0, 50));
  };

  const clearText = () => {
    setText("");
  };

  const deleteHistoryItem = (id: string) => {
    setHistory(history.filter(item => item.id !== id));
  };

  const clearHistory = () => {
    if (confirm("Are you sure you want to clear all history?")) {
      setHistory([]);
    }
  };

  const getAnalytics = () => {
    const totalEntries = history.length;
    const totalWords = history.reduce((sum, item) => sum + item.words, 0);
    const totalCharacters = history.reduce((sum, item) => sum + item.characters, 0);
    const totalReadingTime = history.reduce((sum, item) => sum + item.readingTime, 0);
    const averageWords = totalEntries > 0 ? Math.round(totalWords / totalEntries) : 0;

    return { totalEntries, totalWords, totalCharacters, totalReadingTime, averageWords };
  };

  const analytics = getAnalytics();

  return (
    <main className={styles.container}>
      <section className={styles.box}>
        <div className={styles.header}>
          <h1 className={styles.pageTitle}>
            <span className={styles.icon}>📊</span>
            <span className={styles.textGradient}>Word Counter</span>
          </h1>
          <p className={styles.subtitle}>Count words, characters, and analyze reading time instantly.</p>
          <div className={styles.dataInfo}>
            <span className={styles.infoItem}>
              💾 <strong>Auto-Save:</strong> Your text is saved
            </span>
            <span className={styles.infoSeparator}>•</span>
            <span className={styles.infoItem}>
              {lastSaved && <><strong>Last saved:</strong> {lastSaved}</>}
            </span>
            <span className={styles.infoSeparator}>•</span>
            <span className={styles.infoItem}>
              📈 <strong>{history.length}</strong> snapshots
            </span>
          </div>
        </div>

        {(stats.words > 0 || history.length > 0) && (
          <div className={styles.smartDashboard}>
            <div className={styles.dashboardSection}>
              <h3>📊 Live Stats</h3>
              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <span className={styles.statNumber}>{stats.words}</span>
                  <span className={styles.statName}>Words</span>
                </div>
                <div className={styles.statCard}>
                  <span className={styles.statNumber}>{stats.characters}</span>
                  <span className={styles.statName}>Characters</span>
                </div>
                <div className={styles.statCard}>
                  <span className={styles.statNumber}>{stats.readingTime}m</span>
                  <span className={styles.statName}>Reading Time</span>
                </div>
                <div className={styles.statCard}>
                  <span className={styles.statNumber}>{stats.sentences}</span>
                  <span className={styles.statName}>Sentences</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <textarea
          className={styles.textarea}
          placeholder="Paste or type your text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className={styles.controls}>
          <button onClick={saveSnapshot} className={styles.primaryBtn}>
            Save Snapshot
          </button>
          <button onClick={clearText} className={styles.secondaryBtn}>
            Clear Text
          </button>
          <button onClick={() => setShowAnalytics(!showAnalytics)} className={styles.analyticsBtn}>
            📈 Analytics
          </button>
          <button onClick={() => setShowHistory(!showHistory)} className={styles.historyBtn}>
            📋 History
          </button>
        </div>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.number}>{stats.words}</span>
            <span>Words</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.number}>{stats.characters}</span>
            <span>Characters</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.number}>{stats.charactersNoSpaces}</span>
            <span>Characters (no spaces)</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.number}>{stats.lines}</span>
            <span>Lines</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.number}>{stats.paragraphs}</span>
            <span>Paragraphs</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.number}>{stats.readingTime} min</span>
            <span>Reading Time</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.number}>{stats.speakingTime} min</span>
            <span>Speaking Time</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.number}>{stats.averageWordLength}</span>
            <span>Avg Word Length</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.number}>{stats.longestWord}</span>
            <span>Longest Word</span>
          </div>
        </div>

        {showAnalytics && history.length > 0 && (
          <div className={styles.analyticsSection}>
            <h3>📊 Detailed Analytics</h3>
            <div className={styles.analyticsGrid}>
              <div className={styles.analyticsCard}>
                <h4>Usage Summary</h4>
                <div className={styles.analyticsMetric}>
                  <span>Total Snapshots</span>
                  <span className={styles.metricValue}>{analytics.totalEntries}</span>
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
                  <span>Total Reading Time</span>
                  <span className={styles.metricValue}>{analytics.totalReadingTime} min</span>
                </div>
                <div className={styles.analyticsMetric}>
                  <span>Avg Words/Snapshot</span>
                  <span className={styles.metricValue}>{analytics.averageWords}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {showHistory && history.length > 0 && (
          <div className={styles.historySection}>
            <div className={styles.historyHeader}>
              <h3>📋 Snapshot History</h3>
              <button onClick={clearHistory} className={styles.clearBtn}>Clear All</button>
            </div>
            <div className={styles.historyList}>
              {history.map(item => (
                <div key={item.id} className={styles.historyCard}>
                  <div className={styles.historyCardHeader}>
                    <span className={styles.historyDate}>{new Date(item.createdAt).toLocaleString()}</span>
                    <button onClick={() => deleteHistoryItem(item.id)} className={styles.deleteBtn}>Delete</button>
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
        howItWorks="1. Enter or paste text in the box.<br>2. View real-time statistics and reading time.<br>3. Save snapshots to track progress and compare drafts."
        faqs={[
          { title: "How are words counted?", content: "Words are separated by spaces, tabs, or newlines." },
          { title: "How is reading time calculated?", content: "Reading time is estimated at 200 words per minute for average readers." }
        ]}
        tips={["Useful for essays, articles, or social media posts.", "Save snapshots to compare different versions of your text."]}
      />
    </main>
  );
}