"use client";

import { useEffect, useMemo, useState } from "react";
import ToolInfo from "@/components/ToolInfo";
import styles from "./text-summarizer.module.css";

interface SummaryHistory {
  id: string;
  originalText: string;
  summary: string;
  mode: "extractive" | "bullet-points" | "key-sentences";
  compressionRatio: number;
  createdAt: string;
  summaryLength: number;
}

interface SummaryStats {
  totalSummaries: number;
  totalWordsProcessed: number;
  totalWordsSaved: number;
  averageCompression: number;
  favoriteMode: string;
}

const STORAGE_KEY = "text-summarizer-data";

function createId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getInitialHistory(): SummaryHistory[] {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];
    const parsed = JSON.parse(saved) as { history?: SummaryHistory[] };
    return parsed.history || [];
  } catch {
    return [];
  }
}

function splitSentences(text: string) {
  return text.split(/[.!?]+/).map((item) => item.trim()).filter(Boolean);
}

export default function TextSummarizer() {
  const [inputText, setInputText] = useState("");
  const [summary, setSummary] = useState("");
  const [summaryLength, setSummaryLength] = useState(30);
  const [isLoading, setIsLoading] = useState(false);
  const [summaryMode, setSummaryMode] = useState<"extractive" | "bullet-points" | "key-sentences">("extractive");
  const [history, setHistory] = useState<SummaryHistory[]>(() => getInitialHistory());
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [lastSaved, setLastSaved] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ history }));
  }, [history]);

  const sampleTexts = [
    {
      title: "Science Article",
      content:
        "Climate change is one of the most pressing issues facing humanity today. The Earth's average temperature has risen by about 1.1 degrees Celsius since the pre-industrial era. This warming is primarily driven by human activities, particularly greenhouse gas emissions. The consequences include rising sea levels, more frequent extreme weather events, and disruptions to agriculture. Scientists warn that without rapid action, the planet could warm by 2 to 4 degrees Celsius by the end of the century. Solutions include renewable energy, energy efficiency, and global cooperation.",
    },
    {
      title: "History Excerpt",
      content:
        "The Industrial Revolution began in Britain in the late 18th century and transformed society from agrarian economies to industrialized ones. The steam engine changed transportation and manufacturing. Factory systems created new jobs but also produced child labor, unsafe conditions, and overcrowded cities. The revolution spread across Europe and North America and reshaped global trade. Its legacy still influences modern technology and urban life.",
    },
    {
      title: "Technology Overview",
      content:
        "Artificial Intelligence is reshaping industries across healthcare, finance, transportation, and education. Machine learning allows systems to improve through data, while deep learning has accelerated breakthroughs in image recognition and language processing. AI can increase efficiency and unlock new services, but it also raises concerns about privacy, bias, and job displacement. Responsible governance is essential if society wants to benefit from AI while limiting harm.",
    },
  ];

  const buildSummary = (text: string) => {
    const sentences = splitSentences(text);
    if (sentences.length <= 2) return text.trim();

    if (summaryMode === "bullet-points") {
      const targetPoints = Math.max(3, Math.min(7, Math.ceil(sentences.length * (summaryLength / 100))));
      return sentences.slice(0, targetPoints).map((sentence) => `- ${sentence}`).join("\n");
    }

    if (summaryMode === "key-sentences") {
      const middle = sentences.slice(1, -1);
      const targetMiddle = Math.max(1, Math.ceil(middle.length * (summaryLength / 100)));
      return [sentences[0], ...middle.slice(0, targetMiddle), sentences[sentences.length - 1]].join(". ") + ".";
    }

    const targetSentences = Math.max(2, Math.ceil(sentences.length * (summaryLength / 100)));
    return `${sentences.slice(0, targetSentences).join(". ")}.`;
  };

  const stats = useMemo(() => {
    const originalWords = inputText.split(/\s+/).filter(Boolean).length;
    const originalSentences = splitSentences(inputText).length;
    const summaryWords = summary.split(/\s+/).filter(Boolean).length;
    const summarySentences = splitSentences(summary).length;
    const compressionRatio = originalWords > 0 ? ((originalWords - summaryWords) / originalWords) * 100 : 0;

    return {
      originalWords,
      originalSentences,
      summaryWords,
      summarySentences,
      compressionRatio: compressionRatio.toFixed(1),
    };
  }, [inputText, summary]);

  const analytics = useMemo<SummaryStats>(() => {
    const totalSummaries = history.length;
    const totalWordsProcessed = history.reduce((sum, item) => sum + item.originalText.split(/\s+/).filter(Boolean).length, 0);
    const totalWordsSaved = history.reduce((sum, item) => {
      const originalWords = item.originalText.split(/\s+/).filter(Boolean).length;
      const summaryWords = item.summary.split(/\s+/).filter(Boolean).length;
      return sum + (originalWords - summaryWords);
    }, 0);
    const averageCompression = totalSummaries > 0
      ? Number((history.reduce((sum, item) => sum + item.compressionRatio, 0) / totalSummaries).toFixed(1))
      : 0;
    const modeCounts = history.reduce<Record<string, number>>((acc, item) => {
      acc[item.mode] = (acc[item.mode] || 0) + 1;
      return acc;
    }, {});
    const favoriteMode = Object.keys(modeCounts).length > 0
      ? Object.keys(modeCounts).reduce((a, b) => (modeCounts[a] > modeCounts[b] ? a : b))
      : "extractive";

    return {
      totalSummaries,
      totalWordsProcessed,
      totalWordsSaved,
      averageCompression,
      favoriteMode,
    };
  }, [history]);

  const summarizeText = () => {
    if (!inputText.trim()) {
      alert("Please enter some text to summarize.");
      return;
    }

    setIsLoading(true);

    window.setTimeout(() => {
      const summaryText = buildSummary(inputText);
      setSummary(summaryText);

      const originalWords = inputText.split(/\s+/).filter(Boolean).length;
      const summaryWords = summaryText.split(/\s+/).filter(Boolean).length;
      const compressionRatio = originalWords > 0 ? ((originalWords - summaryWords) / originalWords) * 100 : 0;

      const newHistoryItem: SummaryHistory = {
        id: createId(),
        originalText: inputText.slice(0, 200) + (inputText.length > 200 ? "..." : ""),
        summary: summaryText,
        mode: summaryMode,
        compressionRatio: Number(compressionRatio.toFixed(1)),
        createdAt: new Date().toISOString(),
        summaryLength,
      };

      setHistory((current) => [newHistoryItem, ...current].slice(0, 50));
      setIsLoading(false);
    }, 350);
  };

  return (
    <main className={styles.container}>
      <section className={styles.tool}>
        <div className={styles.header}>
          <h1 className={styles.title}>Text Summarizer</h1>
          <p className={styles.subtitle}>Create shorter summaries, key sentences, or bullet-point takeaways.</p>
          <div className={styles.dataInfo}>
            <span className={styles.infoItem}><strong>Auto-save:</strong> Summary history is stored in your browser</span>
            <span className={styles.infoSeparator}>|</span>
            <span className={styles.infoItem}>{lastSaved ? <><strong>Last saved:</strong> {lastSaved}</> : "Create a summary to save history"}</span>
            <span className={styles.infoSeparator}>|</span>
            <span className={styles.infoItem}><strong>{history.length}</strong> summaries created</span>
          </div>
        </div>

        {history.length > 0 && (
          <div className={styles.smartDashboard}>
            <div className={styles.dashboardSection}>
              <h3>Summary analytics</h3>
              <div className={styles.statsGrid}>
                <div className={styles.statCard}><span className={styles.statNumber}>{analytics.totalSummaries}</span><span className={styles.statName}>Total Summaries</span></div>
                <div className={styles.statCard}><span className={styles.statNumber}>{analytics.totalWordsProcessed}</span><span className={styles.statName}>Words Processed</span></div>
                <div className={styles.statCard}><span className={styles.statNumber}>{analytics.totalWordsSaved}</span><span className={styles.statName}>Words Saved</span></div>
                <div className={styles.statCard}><span className={styles.statNumber}>{analytics.averageCompression}%</span><span className={styles.statName}>Avg Compression</span></div>
              </div>
            </div>
          </div>
        )}

        <div className={styles.summarizer}>
          <div className={styles.inputSection}>
            <div className={styles.textInput}>
              <label htmlFor="inputText">Enter text to summarize:</label>
              <textarea id="inputText" value={inputText} onChange={(event) => setInputText(event.target.value)} placeholder="Paste your text here..." rows={10} />
            </div>

            <div className={styles.controls}>
              <div className={styles.modeControl}>
                <label htmlFor="summaryMode">Summary Mode:</label>
                <select id="summaryMode" value={summaryMode} onChange={(event) => setSummaryMode(event.target.value as "extractive" | "bullet-points" | "key-sentences")} className={styles.modeSelect}>
                  <option value="extractive">Extractive</option>
                  <option value="bullet-points">Bullet Points</option>
                  <option value="key-sentences">Key Sentences</option>
                </select>
              </div>

              <div className={styles.lengthControl}>
                <label htmlFor="summaryLength">Summary Length: {summaryLength}%</label>
                <input id="summaryLength" type="range" min="20" max="80" value={summaryLength} onChange={(event) => setSummaryLength(Number.parseInt(event.target.value, 10))} />
              </div>

              <div className={styles.buttons}>
                <button type="button" onClick={summarizeText} className={styles.summarizeBtn} disabled={!inputText.trim() || isLoading}>
                  {isLoading ? "Summarizing..." : "Summarize Text"}
                </button>
                <button type="button" onClick={() => setShowAnalytics((current) => !current)} className={styles.analyticsBtn}>Analytics</button>
                <button type="button" onClick={() => setShowHistory((current) => !current)} className={styles.historyBtn}>History</button>
              </div>
            </div>

            <div className={styles.samples}>
              <h4>Sample Texts:</h4>
              <div className={styles.sampleButtons}>
                {sampleTexts.map((sample) => (
                  <button key={sample.title} type="button" onClick={() => { setInputText(sample.content); setSummary(""); }} className={styles.sampleBtn}>
                    {sample.title}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {summary && (
            <div className={styles.outputSection}>
              <div className={styles.summaryHeader}>
                <h3>Summary</h3>
                <button type="button" onClick={() => navigator.clipboard.writeText(summary)} className={styles.copyBtn}>Copy</button>
              </div>

              <div className={styles.summary}>{summary}</div>

              <div className={styles.stats}>
                <div className={styles.statGrid}>
                  <div className={styles.stat}><span className={styles.statValue}>{stats.originalWords}</span><span className={styles.statLabel}>Original Words</span></div>
                  <div className={styles.stat}><span className={styles.statValue}>{stats.summaryWords}</span><span className={styles.statLabel}>Summary Words</span></div>
                  <div className={styles.stat}><span className={styles.statValue}>{stats.compressionRatio}%</span><span className={styles.statLabel}>Compression</span></div>
                  <div className={styles.stat}><span className={styles.statValue}>{stats.originalSentences} to {stats.summarySentences}</span><span className={styles.statLabel}>Sentences</span></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {showAnalytics && history.length > 0 && (
          <div className={styles.analyticsSection}>
            <h3>Detailed Analytics</h3>
            <div className={styles.analyticsGrid}>
              <div className={styles.analyticsCard}>
                <h4>Summary Statistics</h4>
                <div className={styles.analyticsMetric}><span>Total Summaries Created</span><span className={styles.metricValue}>{analytics.totalSummaries}</span></div>
                <div className={styles.analyticsMetric}><span>Total Words Processed</span><span className={styles.metricValue}>{analytics.totalWordsProcessed.toLocaleString()}</span></div>
                <div className={styles.analyticsMetric}><span>Total Words Saved</span><span className={styles.metricValue}>{analytics.totalWordsSaved.toLocaleString()}</span></div>
                <div className={styles.analyticsMetric}><span>Average Compression</span><span className={styles.metricValue}>{analytics.averageCompression}%</span></div>
              </div>

              <div className={styles.analyticsCard}>
                <h4>Usage Patterns</h4>
                <div className={styles.analyticsMetric}><span>Favorite Mode</span><span className={styles.metricValue}>{analytics.favoriteMode}</span></div>
                <div className={styles.analyticsMetric}><span>Estimated Reading Time Saved</span><span className={styles.metricValue}>{Math.ceil(analytics.totalWordsSaved / 200)} min</span></div>
                <div className={styles.analyticsMetric}><span>Most Recent Summary</span><span className={styles.metricValue}>{history.length > 0 ? new Date(history[0].createdAt).toLocaleDateString() : "N/A"}</span></div>
              </div>
            </div>
          </div>
        )}

        {showHistory && history.length > 0 && (
          <div className={styles.historySection}>
            <div className={styles.historyHeader}>
              <h3>Summary History</h3>
              <button type="button" onClick={() => { if (confirm("Are you sure you want to clear all summary history?")) { setHistory([]); setLastSaved(new Date().toLocaleTimeString()); } }} className={styles.clearBtn}>Clear All</button>
            </div>
            <div className={styles.historyList}>
              {history.map((item) => (
                <div key={item.id} className={styles.historyCard}>
                  <div className={styles.historyCardHeader}>
                    <div>
                      <span className={styles.historyMode}>{item.mode}</span>
                      <span className={styles.historyDate}>{new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                    <button type="button" onClick={() => { setHistory((current) => current.filter((entry) => entry.id !== item.id)); setLastSaved(new Date().toLocaleTimeString()); }} className={styles.deleteBtn}>Delete</button>
                  </div>
                  <div className={styles.historyText}><strong>Original:</strong> {item.originalText}</div>
                  <div className={styles.historyStats}>
                    <span>Compression: {item.compressionRatio}%</span>
                    <span>Length: {item.summaryLength}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      <ToolInfo
        howItWorks="1. Paste or type the text you want to summarize.<br>2. Choose a summary mode and adjust the summary length.<br>3. Click Summarize Text to generate a shorter version.<br>4. Copy the result or review your saved history later."
        faqs={[
          { title: "What type of summarization does this use?", content: "This tool uses lightweight extractive rules and sentence selection inside the browser." },
          { title: "How accurate are the summaries?", content: "They are useful for quick overviews, but you should still review important details before relying on them." },
          { title: "What text length works best?", content: "Medium and long articles usually produce the clearest summaries because there is more structure to compress." },
        ]}
        tips={[
          "Use bullet-point mode for notes and study material.",
          "Use key-sentences mode when you want a quick high-level overview.",
          "Always review summaries if the source text contains nuance or legal detail.",
        ]}
      />
    </main>
  );
}




