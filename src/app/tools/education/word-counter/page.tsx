'use client';

import { useState, useEffect } from 'react';
import styles from './wordcounter.module.css';

export default function WordCounterPage() {
  const [inputText, setInputText] = useState('');
  const [stats, setStats] = useState({
    characters: 0,
    charactersNoSpaces: 0,
    words: 0,
    sentences: 0,
    paragraphs: 0,
    lines: 0,
    readingTime: 0,
    speakingTime: 0,
  });

  const calculateStats = (text: string) => {
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;

    // Count words (split by whitespace and filter out empty strings)
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;

    // Count sentences (split by . ! ? and filter out empty strings)
    const sentences = text.trim() ? text.split(/[.!?]+/).filter(s => s.trim().length > 0).length : 0;

    // Count paragraphs (split by double newlines)
    const paragraphs = text.trim() ? text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length : 0;

    // Count lines
    const lines = text.split('\n').length;

    // Estimate reading time (average 200-250 words per minute)
    const readingTime = words / 200; // minutes

    // Estimate speaking time (average 150 words per minute)
    const speakingTime = words / 150; // minutes

    setStats({
      characters,
      charactersNoSpaces,
      words,
      sentences,
      paragraphs,
      lines,
      readingTime: Math.max(0.1, readingTime), // minimum 0.1 minutes
      speakingTime: Math.max(0.1, speakingTime), // minimum 0.1 minutes
    });
  };

  useEffect(() => {
    calculateStats(inputText);
  }, [inputText]);

  const handleClear = () => {
    setInputText('');
  };

  const loadSampleText = () => {
    const sampleText = `The quick brown fox jumps over the lazy dog. This is a sample text for word counting.

It contains multiple paragraphs and sentences. You can use this tool to analyze any text content.

The word counter provides detailed statistics including character count, word count, sentence count, and estimated reading time. This can be very useful for writers, students, and content creators who need to meet specific word count requirements.

Try typing your own text or paste content from documents, articles, or essays to see the statistics update in real-time!`;
    setInputText(sampleText);
  };

  const copyStats = async () => {
    const statsText = `Text Statistics:
- Characters: ${stats.characters}
- Characters (no spaces): ${stats.charactersNoSpaces}
- Words: ${stats.words}
- Sentences: ${stats.sentences}
- Paragraphs: ${stats.paragraphs}
- Lines: ${stats.lines}
- Estimated reading time: ${stats.readingTime.toFixed(1)} minutes
- Estimated speaking time: ${stats.speakingTime.toFixed(1)} minutes`;

    try {
      await navigator.clipboard.writeText(statsText);
      alert('Statistics copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const formatTime = (minutes: number) => {
    if (minutes < 1) {
      return `${Math.round(minutes * 60)} seconds`;
    } else if (minutes < 60) {
      return `${minutes.toFixed(1)} minutes`;
    } else {
      const hours = Math.floor(minutes / 60);
      const mins = Math.round(minutes % 60);
      return `${hours}h ${mins}m`;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.tool}>
        <div className={styles.inputSection}>
          <div className={styles.inputHeader}>
            <h3>Enter Your Text</h3>
            <button onClick={loadSampleText} className={styles.sampleBtn}>
              Load Sample
            </button>
          </div>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type or paste your text here to get detailed statistics..."
            className={styles.textarea}
          />
          <div className={styles.inputActions}>
            <button onClick={handleClear} className={styles.clearBtn}>
              Clear Text
            </button>
          </div>
        </div>

        <div className={styles.statsSection}>
          <div className={styles.statsHeader}>
            <h3>Text Statistics</h3>
            <button onClick={copyStats} className={styles.copyStatsBtn}>
              Copy Stats
            </button>
          </div>

          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{stats.characters.toLocaleString()}</div>
              <div className={styles.statLabel}>Characters</div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statValue}>{stats.charactersNoSpaces.toLocaleString()}</div>
              <div className={styles.statLabel}>Characters (no spaces)</div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statValue}>{stats.words.toLocaleString()}</div>
              <div className={styles.statLabel}>Words</div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statValue}>{stats.sentences.toLocaleString()}</div>
              <div className={styles.statLabel}>Sentences</div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statValue}>{stats.paragraphs.toLocaleString()}</div>
              <div className={styles.statLabel}>Paragraphs</div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statValue}>{stats.lines.toLocaleString()}</div>
              <div className={styles.statLabel}>Lines</div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statValue}>{formatTime(stats.readingTime)}</div>
              <div className={styles.statLabel}>Reading Time</div>
              <div className={styles.statSubtext}>(200 words/min)</div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statValue}>{formatTime(stats.speakingTime)}</div>
              <div className={styles.statLabel}>Speaking Time</div>
              <div className={styles.statSubtext}>(150 words/min)</div>
            </div>
          </div>
        </div>

        <div className={styles.infoSection}>
          <h4>About Word Counter</h4>
          <p>This tool provides comprehensive text analysis including:</p>
          <ul>
            <li><strong>Character Count:</strong> Total characters with and without spaces</li>
            <li><strong>Word Count:</strong> Total number of words in the text</li>
            <li><strong>Sentence & Paragraph Count:</strong> Structural analysis of your content</li>
            <li><strong>Reading & Speaking Time:</strong> Estimated time based on average reading/speaking speeds</li>
          </ul>
          <p>Perfect for students, writers, content creators, and anyone who needs to analyze text statistics!</p>
        </div>
      </div>
    </div>
  );
}