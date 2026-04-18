"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./texttospeech.module.css";
import ToolInfo from "@/components/ToolInfo";

interface HistoryItem {
  id: string;
  text: string;
  language: string;
  voiceName: string;
  voiceURI: string;
  timestamp: number;
  charCount: number;
}

interface StoredState {
  text?: string;
  history?: HistoryItem[];
}

const STORAGE_KEY = "text-to-speech-data";
const createId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const getInitialState = (): StoredState => {
  if (typeof window === "undefined") {
    return { text: "", history: [] };
  }

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      return { text: "", history: [] };
    }

    const parsed = JSON.parse(saved) as StoredState;
    return {
      text: parsed.text || "",
      history: parsed.history || [],
    };
  } catch (error) {
    console.error("Error loading text-to-speech data:", error);
    return { text: "", history: [] };
  }
};

const getVoiceTestText = (language: string) => {
  if (language.startsWith("hi")) return "Namaste, yah ek parikshan hai.";
  if (language.startsWith("es")) return "Hola, esta es una prueba.";
  if (language.startsWith("fr")) return "Bonjour, ceci est un test.";
  if (language.startsWith("de")) return "Hallo, das ist ein Test.";
  if (language.startsWith("ja")) return "Konnichiwa, kore wa tesuto desu.";
  if (language.startsWith("zh")) return "Ni hao, zhe shi yi ge ceshi.";
  return "Hello, this is a test.";
};

export default function TextToSpeech() {
  const initialState = getInitialState();
  const [text, setText] = useState(initialState.text || "");
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>(initialState.history || []);
  const [languageFilter, setLanguageFilter] = useState("all");

  const synth = typeof window !== "undefined" ? window.speechSynthesis : null;

  useEffect(() => {
    if (!synth) return;

    const loadVoices = () => {
      const availableVoices = synth.getVoices();
      setVoices(availableVoices);
      setVoice((currentVoice) => currentVoice || availableVoices[0] || null);
    };

    loadVoices();
    synth.onvoiceschanged = loadVoices;

    return () => {
      synth.onvoiceschanged = null;
    };
  }, [synth]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ text, history }));
  }, [history, text]);

  const uniqueVoices = useMemo(() => {
    return voices.reduce<SpeechSynthesisVoice[]>((accumulator, currentVoice) => {
      if (!accumulator.find((voiceItem) => voiceItem.voiceURI === currentVoice.voiceURI)) {
        accumulator.push(currentVoice);
      }
      return accumulator;
    }, []);
  }, [voices]);

  const localVoices = useMemo(
    () => uniqueVoices.filter((voiceItem) => voiceItem.localService === true),
    [uniqueVoices]
  );

  const availableLanguages = useMemo(
    () => [...new Set(uniqueVoices.map((voiceItem) => voiceItem.lang))].sort(),
    [uniqueVoices]
  );

  const filteredVoices = useMemo(() => {
    if (languageFilter === "all") return uniqueVoices;
    return uniqueVoices.filter((voiceItem) => voiceItem.lang.startsWith(languageFilter));
  }, [languageFilter, uniqueVoices]);

  const localLanguages = useMemo(
    () => [...new Set(localVoices.map((voiceItem) => voiceItem.lang))],
    [localVoices]
  );

  const analytics = useMemo(() => {
    const totalSpeeches = history.length;
    const totalChars = history.reduce((sum, item) => sum + item.charCount, 0);
    const languages = new Set(history.map((item) => item.language)).size;
    const avgChars = totalSpeeches > 0 ? Math.round(totalChars / totalSpeeches) : 0;
    return { totalSpeeches, totalChars, languages, avgChars };
  }, [history]);

  const speakText = (content: string) => {
    if (!synth || !voice || !content.trim()) return;

    synth.cancel();
    setIsSpeaking(true);

    const utterance = new SpeechSynthesisUtterance(content);
    utterance.voice = voice;
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => {
      setIsSpeaking(false);
      alert(`Voice \"${voice.name}\" may not be available on your system. Try another voice.`);
    };

    synth.speak(utterance);
  };

  const speak = () => {
    if (!text.trim()) return;

    speakText(text);
    const nextItem: HistoryItem = {
      id: createId(),
      text: text.trim(),
      language: voice?.lang || "unknown",
      voiceName: voice?.name || "Default",
      voiceURI: voice?.voiceURI || "",
      timestamp: Date.now(),
      charCount: text.trim().length,
    };
    setHistory((previous) => [nextItem, ...previous].slice(0, 50));
  };

  const stop = () => {
    if (synth) {
      synth.cancel();
      setIsSpeaking(false);
    }
  };

  const deleteHistoryItem = (id: string) => {
    setHistory((previous) => previous.filter((item) => item.id !== id));
  };

  const clearHistory = () => {
    if (confirm("Clear all history?")) {
      setHistory([]);
    }
  };

  const replayFromHistory = (item: HistoryItem) => {
    setText(item.text);
    const matchingVoice = uniqueVoices.find(
      (voiceItem) => voiceItem.voiceURI === item.voiceURI || voiceItem.name === item.voiceName
    );
    if (matchingVoice) {
      setVoice(matchingVoice);
    }
  };

  const testVoice = () => {
    if (!voice) return;
    speakText(getVoiceTestText(voice.lang));
  };

  return (
    <main className={styles.container}>
      <section className={styles.box}>
        <h1 className={styles.pageTitle}>
          <span className={styles.icon}>TTS</span>
          <span className={styles.textGradient}>Text to Speech</span>
        </h1>
        <p>Convert text to speech with local browser voices, saved history, and device-friendly controls.</p>

        {uniqueVoices.length > 0 && (
          <div className={styles.warningBox}>
            <strong>Important:</strong> This tool can only use voices available on your device. If a language is missing, install the related voice pack in your operating system settings first.
          </div>
        )}

        <textarea
          id="speech-text"
          name="speech-text"
          className={styles.textarea}
          placeholder="Enter text to speak..."
          value={text}
          onChange={(event) => setText(event.target.value)}
        />

        {localVoices.length > 0 && localVoices.length < voices.length && (
          <div className={styles.infoBox}>
            <strong>Note:</strong> Your system has {localVoices.length} local voices installed. These are usually the most reliable options.
          </div>
        )}

        <div className={styles.controls}>
          <div className={styles.controlGroup}>
            <label htmlFor="language-filter">Language Filter:</label>
            <select
              id="language-filter"
              name="language-filter"
              value={languageFilter}
              onChange={(event) => {
                const nextFilter = event.target.value;
                setLanguageFilter(nextFilter);
                if (voice && nextFilter !== "all" && !voice.lang.startsWith(nextFilter)) {
                  const firstMatch = uniqueVoices.find((voiceItem) => voiceItem.lang.startsWith(nextFilter));
                  if (firstMatch) setVoice(firstMatch);
                }
              }}
            >
              <option value="all">All Languages ({uniqueVoices.length} voices)</option>
              {availableLanguages.map((language) => {
                const count = uniqueVoices.filter((voiceItem) => voiceItem.lang === language).length;
                const isLocal = localLanguages.includes(language);
                return (
                  <option key={language} value={language}>
                    {language} ({count}){isLocal ? ' local' : ''}
                  </option>
                );
              })}
            </select>
          </div>

          <div className={styles.controlGroup}>
            <label htmlFor="voice-select">Voice: {voice?.localService ? 'Local' : 'Cloud/System'}</label>
            <select
              id="voice-select"
              name="voice-select"
              value={voice?.voiceURI || ""}
              onChange={(event) => {
                const selectedVoice = filteredVoices.find((voiceItem) => voiceItem.voiceURI === event.target.value);
                setVoice(selectedVoice || null);
              }}
            >
              {filteredVoices.map((voiceItem) => (
                <option key={voiceItem.voiceURI} value={voiceItem.voiceURI}>
                  {voiceItem.name} {voiceItem.localService ? '(Local)' : ''}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.controlGroup}>
            <label htmlFor="speech-rate">Rate: {rate}x</label>
            <input id="speech-rate" name="speech-rate" type="range" min="0.5" max="2" step="0.1" value={rate} onChange={(event) => setRate(+event.target.value)} />
          </div>

          <div className={styles.controlGroup}>
            <label htmlFor="speech-pitch">Pitch: {pitch}</label>
            <input id="speech-pitch" name="speech-pitch" type="range" min="0" max="2" step="0.1" value={pitch} onChange={(event) => setPitch(+event.target.value)} />
          </div>
        </div>

        <div className={styles.buttons}>
          <button onClick={speak} disabled={isSpeaking || !text.trim() || !voice} className={styles.button}>{isSpeaking ? "Speaking..." : "Speak"}</button>
          <button onClick={testVoice} disabled={isSpeaking || !voice} className={styles.buttonTest}>Test Voice</button>
          <button onClick={stop} disabled={!isSpeaking} className={styles.buttonSecondary}>Stop</button>
        </div>

        {history.length > 0 && (
          <>
            <div className={styles.smartDashboard}>
              <h3>Analytics</h3>
              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <div className={styles.statValue}>{analytics.totalSpeeches}</div>
                  <div className={styles.statLabel}>Total Speeches</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statValue}>{analytics.totalChars.toLocaleString()}</div>
                  <div className={styles.statLabel}>Characters Spoken</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statValue}>{analytics.languages}</div>
                  <div className={styles.statLabel}>Languages Used</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statValue}>{analytics.avgChars}</div>
                  <div className={styles.statLabel}>Avg. Chars/Speech</div>
                </div>
              </div>
            </div>

            <div className={styles.historySection}>
              <div className={styles.historyHeader}>
                <h3>Speech History</h3>
                <button onClick={clearHistory} className={styles.clearBtn}>Clear All</button>
              </div>
              <div className={styles.historyList}>
                {history.map((item) => (
                  <div key={item.id} className={styles.historyItem}>
                    <div className={styles.historyText}>
                      <div className={styles.historyMeta}>
                        <span className={styles.historyLang}>{item.language}</span>
                        <span className={styles.historyVoice}>{item.voiceName}</span>
                        <span className={styles.historyTime}>{new Date(item.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <div className={styles.historyContent}>{item.text.slice(0, 100)}{item.text.length > 100 ? "..." : ""}</div>
                      <div className={styles.historyStats}>{item.charCount} characters</div>
                    </div>
                    <div className={styles.historyActions}>
                      <button onClick={() => replayFromHistory(item)} className={styles.historyBtn} title="Load this text">Load</button>
                      <button onClick={() => deleteHistoryItem(item.id)} className={styles.historyBtn} title="Delete">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </section>

      <ToolInfo
        howItWorks="Enter text in the box<br>Select a language and voice available on your device<br>Adjust speech rate and pitch<br>Click Speak to start playback or Test Voice to preview a voice"
        faqs={[
          { title: 'Which browsers support this tool?', content: 'Modern versions of Chrome, Edge, Safari, and some Firefox builds support browser speech synthesis.' },
          { title: 'Why are some languages missing?', content: 'Text-to-speech relies on voices installed on your device, so missing languages usually need an operating system language pack.' },
          { title: 'Why do only some voices work well?', content: 'Locally installed voices are usually more stable than cloud or placeholder voices exposed by the browser.' },
          { title: 'Is history saved?', content: 'Yes, the text and recent speech history are stored only in your browser for convenience.' },
        ]}
        tips={[
          'Use Test Voice before reading long passages with a new voice.',
          'Lower rates can sound clearer for study notes and longer content.',
          'If Hindi or another language is unavailable, install it in your operating system settings first.',
        ]}
      />
    </main>
  );
}
