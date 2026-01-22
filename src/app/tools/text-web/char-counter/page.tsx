'use client';

import { useState, useEffect } from 'react';
import ToolInfo from '@/components/ToolInfo';
import styles from './charcounter.module.css';

export default function CharacterCounter() {
  const [text, setText] = useState('');
  const [stats, setStats] = useState({
    characters: 0,
    charactersNoSpaces: 0,
    words: 0,
    sentences: 0,
    paragraphs: 0,
    lines: 0
  });

  useEffect(() => {
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
    const lines = text.split('\n').length;

    setStats({
      characters,
      charactersNoSpaces,
      words,
      sentences,
      paragraphs,
      lines
    });
  }, [text]);

  const clearText = () => {
    setText('');
  };

  const copyStats = async () => {
    const statsText = `Characters: ${stats.characters}
Characters (no spaces): ${stats.charactersNoSpaces}
Words: ${stats.words}
Sentences: ${stats.sentences}
Paragraphs: ${stats.paragraphs}
Lines: ${stats.lines}`;

    try {
      await navigator.clipboard.writeText(statsText);
      alert('Statistics copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <main className={styles.container}>
      <h1>Character Counter</h1>
      <p>Count characters, words, sentences, and more in your text</p>

      <div className={styles.counter}>
        <div className={styles.inputSection}>
          <div className={styles.inputHeader}>
            <h2>Enter Your Text</h2>
            <div className={styles.inputActions}>
              <button onClick={clearText} className={styles.clearBtn}>
                Clear
              </button>
              <button onClick={copyStats} className={styles.copyBtn} disabled={!text}>
                Copy Stats
              </button>
            </div>
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Start typing or paste your text here..."
            className={styles.textarea}
          />
        </div>

        <div className={styles.statsSection}>
          <h2>Text Statistics</h2>

          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>{stats.characters}</div>
              <div className={styles.statLabel}>Characters</div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statNumber}>{stats.charactersNoSpaces}</div>
              <div className={styles.statLabel}>Characters (no spaces)</div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statNumber}>{stats.words}</div>
              <div className={styles.statLabel}>Words</div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statNumber}>{stats.sentences}</div>
              <div className={styles.statLabel}>Sentences</div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statNumber}>{stats.paragraphs}</div>
              <div className={styles.statLabel}>Paragraphs</div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statNumber}>{stats.lines}</div>
              <div className={styles.statLabel}>Lines</div>
            </div>
          </div>

          {text && (
            <div className={styles.densityInfo}>
              <h3>Text Density</h3>
              <div className={styles.densityStats}>
                <p><strong>Average words per sentence:</strong> {stats.sentences > 0 ? (stats.words / stats.sentences).toFixed(1) : 0}</p>
                <p><strong>Average characters per word:</strong> {stats.words > 0 ? (stats.characters / stats.words).toFixed(1) : 0}</p>
                <p><strong>Spaces:</strong> {stats.characters - stats.charactersNoSpaces}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <ToolInfo
        howItWorks="Type or paste text in the input area<br>View real-time statistics as you type<br>Use clear button to reset<br>Copy statistics to clipboard"
        faqs={[
          { title: "How are words counted?", content: "Words are separated by spaces, tabs, or line breaks." },
          { title: "How are sentences counted?", content: "Sentences are separated by periods, exclamation marks, or question marks." },
          { title: "How are paragraphs counted?", content: "Paragraphs are separated by blank lines (double line breaks)." },
          { title: "Does it count spaces?", content: "Yes, both with and without spaces statistics are provided." }
        ]}
        tips={["Useful for essays, social media posts, or content writing<br>Monitor character limits for various platforms<br>Check reading level with sentence complexity<br>All counting happens in real-time"]}
      />
    </main>
  );
}