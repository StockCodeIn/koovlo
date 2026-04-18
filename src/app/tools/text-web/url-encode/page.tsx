"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./urlencode.module.css";
import ToolInfo from "@/components/ToolInfo";

interface HistoryItem {
  id: string;
  inputPreview: string;
  outputPreview: string;
  mode: "encode" | "decode";
  timestamp: number;
  inputSize: number;
  outputSize: number;
}

interface StoredState {
  inputText?: string;
  outputText?: string;
  history?: HistoryItem[];
}

const STORAGE_KEY = "url-encoder-data";
const createId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const getInitialState = (): StoredState => {
  if (typeof window === "undefined") {
    return { inputText: "", outputText: "", history: [] };
  }

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      return { inputText: "", outputText: "", history: [] };
    }

    const parsed = JSON.parse(saved) as StoredState;
    return {
      inputText: parsed.inputText || "",
      outputText: parsed.outputText || "",
      history: parsed.history || [],
    };
  } catch (error) {
    console.error("Error loading URL encoder data:", error);
    return { inputText: "", outputText: "", history: [] };
  }
};

const getByteSize = (value: string) => new Blob([value]).size;

export default function UrlEncodePage() {
  const initialState = getInitialState();
  const [inputText, setInputText] = useState(initialState.inputText || "");
  const [outputText, setOutputText] = useState(initialState.outputText || "");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [history, setHistory] = useState<HistoryItem[]>(initialState.history || []);
  const [options, setOptions] = useState({
    encodeSpaces: true,
    encodeSpecialChars: true,
    encodeUnicode: false,
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ inputText, outputText, history }));
  }, [history, inputText, outputText]);

  const analytics = useMemo(() => {
    const totalEncodes = history.filter((item) => item.mode === "encode").length;
    const totalDecodes = history.filter((item) => item.mode === "decode").length;
    const totalOperations = history.length;
    const avgSizeChange = history.length
      ? Math.round(
          (history.reduce((sum, item) => {
            if (item.inputSize === 0) return sum;
            return sum + ((item.outputSize - item.inputSize) / item.inputSize) * 100;
          }, 0) /
            history.length) *
            10
        ) / 10
      : 0;

    return { totalEncodes, totalDecodes, totalOperations, avgSizeChange };
  }, [history]);

  const handleProcess = () => {
    if (!inputText) return;

    let result = "";

    if (mode === "encode") {
      result = encodeURIComponent(inputText);
      if (!options.encodeSpaces) {
        result = result.replace(/%20/g, " ");
      }
      if (!options.encodeSpecialChars) {
        result = result.replace(/%21/g, "!").replace(/%27/g, "'").replace(/%28/g, "(").replace(/%29/g, ")");
      }
      if (options.encodeUnicode) {
        result = encodeURI(result);
      }
    } else {
      try {
        result = decodeURIComponent(inputText);
      } catch {
        alert("Invalid URL encoding. Please check your input.");
        return;
      }
    }

    const nextItem: HistoryItem = {
      id: createId(),
      inputPreview: inputText.slice(0, 100),
      outputPreview: result.slice(0, 100),
      mode,
      timestamp: Date.now(),
      inputSize: getByteSize(inputText),
      outputSize: getByteSize(result),
    };

    setHistory((previous) => [nextItem, ...previous].slice(0, 50));
    setOutputText(result);
  };

  const handleClear = () => {
    setInputText("");
    setOutputText("");
  };

  const loadSampleData = () => {
    if (mode === "encode") {
      setInputText("Hello World! This is a test URL with spaces and special chars: cafe@example.com?query=value#fragment");
    } else {
      setInputText("Hello%20World%21%20This%20is%20a%20test%20URL%20with%20spaces%20and%20special%20chars%3A%20cafe%40example.com%3Fquery%3Dvalue%23fragment");
    }
  };

  const swapTexts = () => {
    setInputText(outputText);
    setOutputText(inputText);
    setMode((currentMode) => (currentMode === "encode" ? "decode" : "encode"));
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
    setInputText(item.inputPreview);
    setOutputText(item.outputPreview);
    setMode(item.mode);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(outputText);
      alert("Output copied to clipboard.");
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const downloadOutput = () => {
    if (!outputText) return;

    const blob = new Blob([outputText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = mode === "encode" ? "encoded-url.txt" : "decoded-url.txt";
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>
        <span className={styles.icon}>URL</span>
        <span className={styles.textGradient}>URL Encoder and Decoder</span>
      </h1>
      <p className={styles.subtitle}>Encode and decode URL strings with browser-side processing and saved history.</p>

      <div className={styles.tool}>
        <div className={styles.modeSection}>
          <h3>Mode</h3>
          <div className={styles.modeButtons}>
            <button onClick={() => setMode("encode")} className={`${styles.modeBtn} ${mode === "encode" ? styles.active : ""}`}>Encode URL</button>
            <button onClick={() => setMode("decode")} className={`${styles.modeBtn} ${mode === "decode" ? styles.active : ""}`}>Decode URL</button>
          </div>
        </div>

        <div className={styles.inputSection}>
          <div className={styles.inputHeader}>
            <h3>Input {mode === "encode" ? "Text" : "URL"}</h3>
            <button onClick={loadSampleData} className={styles.sampleBtn}>Load Sample</button>
          </div>
          <textarea
            id="url-input"
            name="url-input"
            value={inputText}
            onChange={(event) => setInputText(event.target.value)}
            placeholder={mode === "encode" ? "Enter text to encode..." : "Enter URL to decode..."}
            className={styles.textarea}
          />
        </div>

        <div className={styles.optionsSection}>
          <h3>Encoding Options</h3>
          <div className={styles.optionsGrid}>
            <label className={styles.checkboxOption}>
              <input
                type="checkbox"
                checked={options.encodeSpaces}
                onChange={(event) => setOptions((previous) => ({ ...previous, encodeSpaces: event.target.checked }))}
                className={styles.checkbox}
              />
              <div className={styles.checkboxText}>
                <strong>Encode Spaces</strong>
                <small>Convert spaces to %20</small>
              </div>
            </label>

            <label className={styles.checkboxOption}>
              <input
                type="checkbox"
                checked={options.encodeSpecialChars}
                onChange={(event) => setOptions((previous) => ({ ...previous, encodeSpecialChars: event.target.checked }))}
                className={styles.checkbox}
              />
              <div className={styles.checkboxText}>
                <strong>Encode Special Chars</strong>
                <small>Encode punctuation like ! &apos; ( )</small>
              </div>
            </label>

            <label className={styles.checkboxOption}>
              <input
                type="checkbox"
                checked={options.encodeUnicode}
                onChange={(event) => setOptions((previous) => ({ ...previous, encodeUnicode: event.target.checked }))}
                className={styles.checkbox}
              />
              <div className={styles.checkboxText}>
                <strong>Encode Unicode</strong>
                <small>Encode non-ASCII characters</small>
              </div>
            </label>
          </div>
        </div>

        <div className={styles.actions}>
          <button onClick={handleProcess} className={styles.processBtn} disabled={!inputText}>{mode === "encode" ? "Encode URL" : "Decode URL"}</button>
          <button onClick={swapTexts} className={styles.swapBtn} disabled={!inputText || !outputText}>Swap</button>
          <button onClick={handleClear} className={styles.clearBtn}>Clear All</button>
        </div>

        {outputText && (
          <div className={styles.outputSection}>
            <h3>Output</h3>
            <textarea id="url-output" name="url-output" value={outputText} readOnly className={styles.textarea} />
            <div className={styles.outputActions}>
              <button onClick={copyToClipboard} className={styles.copyBtn}>Copy Output</button>
              <button onClick={downloadOutput} className={styles.downloadBtn}>Download</button>
            </div>
          </div>
        )}

        {history.length > 0 && (
          <div className={styles.smartDashboard}>
            <h3>Analytics</h3>
            <div className={styles.analyticsGrid}>
              <div className={styles.statCard}>
                <span className={styles.statValue}>{analytics.totalOperations}</span>
                <span className={styles.statLabel}>Total Operations</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statValue}>{analytics.totalEncodes}</span>
                <span className={styles.statLabel}>Times Encoded</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statValue}>{analytics.totalDecodes}</span>
                <span className={styles.statLabel}>Times Decoded</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statValue}>{analytics.avgSizeChange}%</span>
                <span className={styles.statLabel}>Avg Size Change</span>
              </div>
            </div>
          </div>
        )}

        {history.length > 0 && (
          <div className={styles.historySection}>
            <div className={styles.historyHeader}>
              <h3>History</h3>
              <button onClick={clearHistory} className={styles.clearBtn}>Clear History</button>
            </div>
            <div className={styles.historyList}>
              {history.map((item) => (
                <div key={item.id} className={styles.historyItem}>
                  <div className={styles.historyText}>
                    <div className={styles.historyMeta}>
                      <span className={styles.historyMode}>{item.mode === "encode" ? "Encode" : "Decode"}</span>
                      <span className={styles.historyTime}>{new Date(item.timestamp).toLocaleTimeString()}</span>
                      <span className={styles.historySize}>{item.inputSize}B to {item.outputSize}B</span>
                    </div>
                    <div className={styles.historyContent}>{item.inputPreview.slice(0, 80)}{item.inputPreview.length > 80 ? "..." : ""}</div>
                  </div>
                  <div className={styles.historyActions}>
                    <button onClick={() => loadFromHistory(item)} className={styles.historyBtn} title="Load this">Load</button>
                    <button onClick={() => deleteHistoryItem(item.id)} className={styles.historyBtn} title="Delete">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <ToolInfo
        howItWorks="Choose encode or decode mode<br>Enter your text or URL<br>Adjust encoding options if needed<br>Click the action button to process the value<br>Copy the output or download it as a text file"
        faqs={[
          { title: 'What is URL encoding?', content: 'URL encoding converts reserved or unsafe characters into a web-safe format using percent-based codes.' },
          { title: 'When should I encode a URL?', content: 'Encode values when adding user input to query strings, API requests, or links that include spaces and symbols.' },
          { title: 'What does decode do?', content: 'Decode reverses percent-encoded values back into readable text.' },
          { title: 'Does this upload data?', content: 'No. The tool processes your text in the browser and stores only local history on your device.' },
        ]}
        tips={[
          'Encode query parameters before appending them to URLs in forms or scripts.',
          'Decoding helps debug links copied from logs, emails, or browser redirects.',
          'Use Swap to quickly test the reverse transformation on the same value.',
        ]}
      />
    </div>
  );
}

