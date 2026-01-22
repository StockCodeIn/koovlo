"use client";

import { useState } from "react";
import styles from "./reading-time.module.css";
import ToolInfo from "@/components/ToolInfo";

export default function ReadingTimeCalculator() {
  const [text, setText] = useState("");
  const [wpm, setWpm] = useState(200);
  const [result, setResult] = useState<{
    wordCount: number;
    readingTime: number;
    speakingTime: number;
    characters: number;
    sentences: number;
  } | null>(null);

  const calculateReadingTime = () => {
    if (!text.trim()) {
      setResult(null);
      return;
    }

    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    const wordCount = words.length;

    // Count characters (excluding spaces)
    const characters = text.replace(/\s/g, '').length;

    // Count sentences (rough estimate)
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;

    // Calculate reading time in minutes
    const readingTime = wordCount / wpm;

    // Speaking time (typically slower than reading, about 150 wpm)
    const speakingTime = wordCount / 150;

    setResult({
      wordCount,
      readingTime,
      speakingTime,
      characters,
      sentences
    });
  };

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    const secs = Math.floor((minutes % 1) * 60);

    if (hours > 0) {
      return `${hours}h ${mins}m ${secs}s`;
    } else if (mins > 0) {
      return `${mins}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const getReadingLevel = (wpm: number): string => {
    if (wpm >= 300) return "Very Fast (Speed Reader)";
    if (wpm >= 250) return "Fast (Advanced Reader)";
    if (wpm >= 200) return "Average Adult";
    if (wpm >= 150) return "Slow Reader";
    return "Very Slow (Beginner)";
  };

  const sampleTexts = [
    {
      title: "Short Paragraph",
      content: "Reading is a complex cognitive process of decoding symbols to derive meaning. It involves recognizing words, understanding context, and making connections between ideas. The average adult reads at about 200-250 words per minute, though this varies greatly depending on the material and individual skill level."
    },
    {
      title: "Medium Article",
      content: "The history of reading dates back thousands of years. Ancient civilizations developed various writing systems, from cuneiform to hieroglyphics. The invention of the printing press by Johannes Gutenberg in the 15th century revolutionized the spread of knowledge. Today, digital reading has become increasingly common, with e-books and online articles changing how we consume written content. Reading speed and comprehension are skills that can be improved with practice and proper techniques."
    },
    {
      title: "Long Excerpt",
      content: "Reading comprehension involves not just recognizing words but understanding their meaning in context. Good readers employ various strategies including predicting, questioning, clarifying, and summarizing. They make connections between what they read and their prior knowledge. Reading speed can be increased through techniques like minimizing subvocalization (the internal pronunciation of words) and expanding peripheral vision to capture more words at once. However, speed should not come at the expense of comprehension. The goal is to read efficiently while maintaining understanding of the material."
    }
  ];

  const loadSampleText = (content: string) => {
    setText(content);
  };

  const clearText = () => {
    setText("");
    setResult(null);
  };

  return (
    <main className={styles.container}>
      <section className={styles.tool}>
        <h1 className={styles.title}>
          <span className={styles.icon}>📖</span>
          Reading Time Calculator
        </h1>
        <p>Calculate how long it takes to read text based on your reading speed.</p>

        <div className={styles.calculator}>
          <div className={styles.inputSection}>
            <div className={styles.textInput}>
              <label htmlFor="text">Enter your text:</label>
              <textarea
                id="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste or type your text here..."
                rows={8}
              />
            </div>

            <div className={styles.settings}>
              <div className={styles.wpmInput}>
                <label htmlFor="wpm">Reading Speed (WPM):</label>
                <input
                  id="wpm"
                  type="number"
                  value={wpm}
                  onChange={(e) => setWpm(parseInt(e.target.value) || 200)}
                  min="50"
                  max="500"
                  step="10"
                />
                <span className={styles.level}>{getReadingLevel(wpm)}</span>
              </div>

              <div className={styles.controls}>
                <button onClick={calculateReadingTime} className={styles.calculateBtn}>
                  Calculate Time
                </button>
                <button onClick={clearText} className={styles.clearBtn}>
                  Clear Text
                </button>
              </div>
            </div>
          </div>

          <div className={styles.samples}>
            <h4>Sample Texts:</h4>
            <div className={styles.sampleButtons}>
              {sampleTexts.map((sample, index) => (
                <button
                  key={index}
                  onClick={() => loadSampleText(sample.content)}
                  className={styles.sampleBtn}
                >
                  {sample.title}
                </button>
              ))}
            </div>
          </div>

          {result && (
            <div className={styles.results}>
              <h3>Reading Analysis</h3>
              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <div className={styles.statValue}>{result.wordCount}</div>
                  <div className={styles.statLabel}>Words</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statValue}>{result.characters}</div>
                  <div className={styles.statLabel}>Characters</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statValue}>{result.sentences}</div>
                  <div className={styles.statLabel}>Sentences</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statValue}>{formatTime(result.readingTime)}</div>
                  <div className={styles.statLabel}>Reading Time</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statValue}>{formatTime(result.speakingTime)}</div>
                  <div className={styles.statLabel}>Speaking Time</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statValue}>{Math.round(result.wordCount / result.readingTime)}</div>
                  <div className={styles.statLabel}>Actual WPM</div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className={styles.tips}>
          <h4>Reading Speed Guidelines</h4>
          <div className={styles.speedGuide}>
            <div className={styles.speedRange}>
              <span className={styles.range}>50-100 WPM</span>
              <span>Beginner/Struggling Reader</span>
            </div>
            <div className={styles.speedRange}>
              <span className={styles.range}>100-150 WPM</span>
              <span>Average Child/Teen</span>
            </div>
            <div className={styles.speedRange}>
              <span className={styles.range}>150-200 WPM</span>
              <span>Average Adult</span>
            </div>
            <div className={styles.speedRange}>
              <span className={styles.range}>200-250 WPM</span>
              <span>Good Reader</span>
            </div>
            <div className={styles.speedRange}>
              <span className={styles.range}>250-300 WPM</span>
              <span>Advanced Reader</span>
            </div>
            <div className={styles.speedRange}>
              <span className={styles.range}>300+ WPM</span>
              <span>Speed Reader</span>
            </div>
          </div>
        </div>
      </section>

      <ToolInfo
        howItWorks="1. Enter or paste your text in the input area.<br>2. Adjust your reading speed in words per minute (WPM).<br>3. Click 'Calculate Time' to see reading statistics.<br>4. Use sample texts to test different reading speeds."
        faqs={[
          {
            title: "What is WPM?",
            content: "Words Per Minute - the standard measure of reading speed. Average adult reading speed is 200-250 WPM."
          },
          {
            title: "How accurate is this calculator?",
            content: "Very accurate for plain text. Complex material with tables, images, or technical terms may vary."
          },
          {
            title: "What's the difference between reading and speaking time?",
            content: "Speaking is typically slower (150 WPM) than silent reading due to pronunciation and pacing."
          }
        ]}
        tips={[
          "Reading speed varies by material - technical content is slower than fiction",
          "Practice can increase reading speed while maintaining comprehension",
          "Use this tool to estimate study time or presentation duration",
          "For academic reading, aim for 150-200 WPM with good comprehension"
        ]}
      />
    </main>
  );
}