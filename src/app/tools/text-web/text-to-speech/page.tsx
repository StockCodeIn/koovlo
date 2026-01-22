"use client";

import { useState } from "react";
import styles from "./texttospeech.module.css";
import ToolInfo from "@/components/ToolInfo";

export default function TextToSpeech() {
  const [text, setText] = useState("");
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  const synth = typeof window !== "undefined" ? window.speechSynthesis : null;

  useState(() => {
    if (synth) {
      const loadVoices = () => {
        const availableVoices = synth.getVoices();
        setVoices(availableVoices);
        if (availableVoices.length > 0 && !voice) {
          setVoice(availableVoices[0]);
        }
      };
      loadVoices();
      synth.onvoiceschanged = loadVoices;
    }
  });

  const speak = () => {
    if (!synth || !text.trim()) return;
    setIsSpeaking(true);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voice;
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.onend = () => setIsSpeaking(false);

    synth.speak(utterance);
  };

  const stop = () => {
    if (synth) {
      synth.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <main className={styles.container}>
      <section className={styles.box}>
        <h1 className={styles.pageTitle}>
          <span className={styles.icon}>🔊</span>
          <span className={styles.textGradient}>Text to Speech</span>
        </h1>
        <p>Convert text to speech using browser's speech synthesis.</p>

        <textarea
          className={styles.textarea}
          placeholder="Enter text to speak..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className={styles.controls}>
          <div className={styles.controlGroup}>
            <label>Voice:</label>
            <select
              value={voice?.name || ""}
              onChange={(e) => {
                const selectedVoice = voices.find(v => v.name === e.target.value);
                setVoice(selectedVoice || null);
              }}
            >
              {voices.map(v => (
                <option key={v.name} value={v.name}>{v.name} ({v.lang})</option>
              ))}
            </select>
          </div>

          <div className={styles.controlGroup}>
            <label>Rate: {rate}</label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={rate}
              onChange={(e) => setRate(+e.target.value)}
            />
          </div>

          <div className={styles.controlGroup}>
            <label>Pitch: {pitch}</label>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={pitch}
              onChange={(e) => setPitch(+e.target.value)}
            />
          </div>
        </div>

        <div className={styles.buttons}>
          <button onClick={speak} disabled={isSpeaking || !text.trim()} className={styles.button}>
            {isSpeaking ? "Speaking..." : "Speak"}
          </button>
          <button onClick={stop} disabled={!isSpeaking} className={styles.buttonSecondary}>
            Stop
          </button>
        </div>
      </section>

      <ToolInfo
        howItWorks="1. Enter text in the box.<br>2. Select voice, adjust rate and pitch.<br>3. Click 'Speak'."
        faqs={[
          { title: "Which browsers support this?", content: "Chrome, Firefox, Safari, Edge." },
          { title: "Is it offline?", content: "Yes, uses browser's built-in speech synthesis." }
        ]}
        tips={["Different voices are available based on your system language settings."]}
      />
    </main>
  );
}