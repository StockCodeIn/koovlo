"use client";

import { useState, useEffect } from "react";
import styles from "./wordcounter.module.css";
import ToolInfo from "@/components/ToolInfo";

export default function WordCounter() {
  const [text, setText] = useState("");
  const [stats, setStats] = useState({ words: 0, characters: 0, charactersNoSpaces: 0, lines: 0 });

  useEffect(() => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, "").length;
    const lines = text.split("\n").length;
    setStats({ words, characters, charactersNoSpaces, lines });
  }, [text]);

  return (
    <main className={styles.container}>
      <section className={styles.box}>
        <h1 className={styles.pageTitle}>
          <span className={styles.icon}>📊</span>
          <span className={styles.textGradient}>Word Counter</span>
        </h1>
        <p>Count words, characters, and more in your text.</p>

        <textarea
          className={styles.textarea}
          placeholder="Paste or type your text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

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
        </div>
      </section>

      <ToolInfo
        howItWorks="1. Enter or paste text in the box.<br>2. View real-time statistics below."
        faqs={[
          { title: "How are words counted?", content: "Words are separated by spaces, tabs, or newlines." }
        ]}
        tips={["Useful for essays, articles, or social media posts."]}
      />
    </main>
  );
}