"use client";

import { useState, useEffect } from "react";
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

export default function TextToSpeech() {
  const [text, setText] = useState("");
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [languageFilter, setLanguageFilter] = useState("all");

  const synth = typeof window !== "undefined" ? window.speechSynthesis : null;

  useEffect(() => {
    const saved = localStorage.getItem("text-to-speech-data");
    if (saved) {
      const { text: savedText, history: savedHistory } = JSON.parse(saved);
      setText(savedText || "");
      setHistory(savedHistory || []);
    }
  }, []);

  useEffect(() => {
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
  }, [synth, voice]);

  useEffect(() => {
    localStorage.setItem("text-to-speech-data", JSON.stringify({ text, history }));
  }, [text, history]);

  const speak = () => {
    if (!synth || !text.trim()) return;
    setIsSpeaking(true);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voice;
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.onend = () => setIsSpeaking(false);

    synth.speak(utterance);

    const newItem: HistoryItem = {
      id: Date.now().toString(),
      text: text.trim(),
      language: voice?.lang || "unknown",
      voiceName: voice?.name || "Default",
      voiceURI: voice?.voiceURI || "",
      timestamp: Date.now(),
      charCount: text.trim().length
    };
    setHistory(prev => [newItem, ...prev].slice(0, 50));
  };

  const stop = () => {
    if (synth) {
      synth.cancel();
      setIsSpeaking(false);
    }
  };

  const deleteHistoryItem = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  const clearHistory = () => {
    if (confirm("Clear all history?")) {
      setHistory([]);
    }
  };

  const replayFromHistory = (item: HistoryItem) => {
    setText(item.text);
    const matchingVoice = voices.find(v => v.voiceURI === item.voiceURI || v.name === item.voiceName);
    if (matchingVoice) setVoice(matchingVoice);
  };

  const testVoice = () => {
    if (!synth || !voice) return;
    setIsSpeaking(true);
    const testText = voice.lang.startsWith('hi') 
      ? "नमस्ते, यह एक परीक्षण है"
      : voice.lang.startsWith('es')
      ? "Hola, esta es una prueba"
      : voice.lang.startsWith('fr')
      ? "Bonjour, ceci est un test"
      : voice.lang.startsWith('de')
      ? "Hallo, das ist ein Test"
      : voice.lang.startsWith('ja')
      ? "こんにちは、これはテストです"
      : voice.lang.startsWith('zh')
      ? "你好，这是一个测试"
      : "Hello, this is a test";
    
    const utterance = new SpeechSynthesisUtterance(testText);
    utterance.voice = voice;
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => {
      setIsSpeaking(false);
      alert(`Voice "${voice.name}" may not be available on your system. Try selecting a different voice.`);
    };
    synth.speak(utterance);
  };

  const getAnalytics = () => {
    const totalSpeeches = history.length;
    const totalChars = history.reduce((sum, item) => sum + item.charCount, 0);
    const languages = [...new Set(history.map(item => item.language))].length;
    const avgChars = totalSpeeches > 0 ? Math.round(totalChars / totalSpeeches) : 0;
    return { totalSpeeches, totalChars, languages, avgChars };
  };

  const analytics = getAnalytics();
  
  // Deduplicate voices by voiceURI to prevent duplicate key errors
  const uniqueVoices = voices.reduce((acc, voice) => {
    if (!acc.find(v => v.voiceURI === voice.voiceURI)) {
      acc.push(voice);
    }
    return acc;
  }, [] as SpeechSynthesisVoice[]);
  
  // Prioritize local voices as they're more reliable
  const localVoices = uniqueVoices.filter(v => v.localService === true);
  const availableLanguages = [...new Set(uniqueVoices.map(v => v.lang))].sort();
  const filteredVoices = languageFilter === "all" 
    ? uniqueVoices 
    : uniqueVoices.filter(v => v.lang.startsWith(languageFilter));
  
  const localLanguages = [...new Set(localVoices.map(v => v.lang))];

  return (
    <main className={styles.container}>
      <section className={styles.box}>
        <h1 className={styles.pageTitle}>
          <span className={styles.icon}>🔊</span>
          <span className={styles.textGradient}>Text to Speech</span>
        </h1>
        <p>Convert text to speech with multi-language support and smart tracking.</p>

        {uniqueVoices.length > 0 && (
          <div className={styles.warningBox}>
            <strong>⚠️ Important:</strong> This tool can only speak languages that are <strong>installed on your computer</strong>. 
            If Japanese, Spanish, or other languages don&apos;t work, you need to install those language packs from your operating system settings first. 
            Browser cannot generate voices for languages not installed on your PC.
          </div>
        )}

        <textarea
          id="speech-text"
          name="speech-text"
          className={styles.textarea}
          placeholder="Enter text to speak..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        {localVoices.length > 0 && localVoices.length < voices.length && (
          <div className={styles.infoBox}>
            <strong>💡 Note:</strong> Your system has {localVoices.length} local voices installed. 
            Other voices in the list may not work properly. Local languages available: 
          </div>
        )}

        <div className={styles.controls}>
          <div className={styles.controlGroup}>
            <label htmlFor="language-filter">Language Filter:</label>
            <select
              id="language-filter"
              name="language-filter"
              value={languageFilter}
              onChange={(e) => {
                setLanguageFilter(e.target.value);
                if (voice && !voice.lang.startsWith(e.target.value) && e.target.value !== "all") {
                  const firstMatch = voices.find(v => v.lang.startsWith(e.target.value));
                  if (firstMatch) setVoice(firstMatch);
                }
              }}
            >
              <option value="all">All Languages ({uniqueVoices.length} voices)</option>
              {availableLanguages.map((lang, index) => {
                const count = uniqueVoices.filter(v => v.lang === lang).length;
                const isLocal = localLanguages.includes(lang);
                return <option key={`${lang}-${index}`} value={lang}>{lang} ({count}){isLocal ? ' ✓' : ''}</option>;
              })}
            </select>
          </div>

          <div className={styles.controlGroup}>
            <label htmlFor="voice-select">Voice: {voice?.localService && '✓ Local'}</label>
            <select
              id="voice-select"
              name="voice-select"
              value={voice?.voiceURI || ""}
              onChange={(e) => {
                const selectedVoice = filteredVoices.find(v => v.voiceURI === e.target.value);
                setVoice(selectedVoice || null);
              }}
            >
              {filteredVoices.map(v => (
                <option key={v.voiceURI} value={v.voiceURI}>
                  {v.name} {v.localService ? '✓' : ''}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.controlGroup}>
            <label htmlFor="speech-rate">Rate: {rate}x</label>
            <input
              id="speech-rate"
              name="speech-rate"
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={rate}
              onChange={(e) => setRate(+e.target.value)}
            />
          </div>

          <div className={styles.controlGroup}>
            <label htmlFor="speech-pitch">Pitch: {pitch}</label>
            <input
              id="speech-pitch"
              name="speech-pitch"
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
            {isSpeaking ? "🔊 Speaking..." : "🔊 Speak"}
          </button>
          <button onClick={testVoice} disabled={isSpeaking || !voice} className={styles.buttonTest}>
            🎤 Test Voice
          </button>
          <button onClick={stop} disabled={!isSpeaking} className={styles.buttonSecondary}>
            ⏹️ Stop
          </button>
        </div>

        {history.length > 0 && (
          <>
            <div className={styles.smartDashboard}>
              <h3>📊 Analytics</h3>
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
                <h3>📜 Speech History</h3>
                <button onClick={clearHistory} className={styles.clearBtn}>Clear All</button>
              </div>
              <div className={styles.historyList}>
                {history.map(item => (
                  <div key={item.id} className={styles.historyItem}>
                    <div className={styles.historyText}>
                      <div className={styles.historyMeta}>
                        <span className={styles.historyLang}>{item.language}</span>
                        <span className={styles.historyVoice}>{item.voiceName}</span>
                        <span className={styles.historyTime}>
                          {new Date(item.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className={styles.historyContent}>
                        {item.text.slice(0, 100)}{item.text.length > 100 ? "..." : ""}
                      </div>
                      <div className={styles.historyStats}>
                        {item.charCount} characters
                      </div>
                    </div>
                    <div className={styles.historyActions}>
                      <button
                        onClick={() => replayFromHistory(item)}
                        className={styles.historyBtn}
                        title="Load this text"
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
          </>
        )}
      </section>

      <ToolInfo
        howItWorks="1. Enter text in the box.<br>2. Select language and voice.<br>3. Adjust rate and pitch.<br>4. Click 'Speak'.<br>5. View history and analytics of your speeches."
        faqs={[
          { title: "Which browsers support this?", content: "Chrome, Firefox, Safari, Edge - all modern browsers support Web Speech API." },
          { title: "Why doesn't Japanese/Spanish/French work?", content: "<strong>Critical:</strong> Text-to-speech requires language packs installed on YOUR COMPUTER (Windows/Mac). If you type Japanese text (元気ですか) but only have English voices installed, it will NOT work. You must:<br>1. Install the language pack from OS settings<br>2. Select that language's voice<br>3. Then it will work. The browser cannot create voices from nothing." },
          { title: "Why do only some voices work?", content: "Text-to-speech voices must be installed on your operating system. Voices marked with ✓ are locally installed and will work reliably. To add more languages, install language packs in your OS settings (Windows: Settings > Time & Language > Language, Mac: System Preferences > Accessibility > Speech)." },
          { title: "How to get more voices?", content: "Install additional language packs from your operating system. Windows users can add languages from Settings > Language. Mac users can download voices from System Preferences > Accessibility > Speech." },
          { title: "Is history saved?", content: "Yes, your speech history is saved in browser storage and persists across sessions." }
        ]}
        tips={[
          "Use 'Test Voice' button to check if a voice works before typing long text.",
          "Voices marked with ✓ are installed locally and work reliably.",
          "To get Hindi voices: Install Hindi language pack in Windows/Mac settings.",
          "Rate controls speed (0.5x = slow, 2x = fast). Pitch adjusts voice tone.",
          "Click 🔄 on history items to quickly replay previous texts."
        ]}
      />
    </main>
  );
}