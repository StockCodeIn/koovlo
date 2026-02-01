"use client";

import { useState, useEffect } from "react";
import styles from "./text-summarizer.module.css";
import ToolInfo from "@/components/ToolInfo";

interface SummaryHistory {
  id: string;
  originalText: string;
  summary: string;
  mode: 'extractive' | 'bullet-points' | 'key-sentences';
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

export default function TextSummarizer() {
  const [inputText, setInputText] = useState("");
  const [summary, setSummary] = useState("");
  const [summaryLength, setSummaryLength] = useState(30); // percentage
  const [isLoading, setIsLoading] = useState(false);
  const [summaryMode, setSummaryMode] = useState<'extractive' | 'bullet-points' | 'key-sentences'>('extractive');
  const [history, setHistory] = useState<SummaryHistory[]>([]);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [lastSaved, setLastSaved] = useState("");

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("text-summarizer-data");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setHistory(data.history || []);
      } catch (e) {
        console.error("Error loading data:", e);
      }
    }
  }, []);

  // Save to localStorage whenever history changes
  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem("text-summarizer-data", JSON.stringify({ history }));
      setLastSaved(new Date().toLocaleTimeString());
    }
  }, [history]);

  const sampleTexts = [
    {
      title: "Science Article",
      content: `Climate change is one of the most pressing issues facing humanity today. The Earth's average temperature has risen by about 1.1 degrees Celsius since the pre-industrial era. This warming is primarily driven by human activities, particularly the emission of greenhouse gases like carbon dioxide and methane. These gases trap heat in the atmosphere, creating a greenhouse effect that warms the planet. The consequences of climate change are far-reaching and include rising sea levels, more frequent extreme weather events, and disruptions to ecosystems and agriculture. Scientists warn that without immediate action to reduce emissions, the planet could warm by 2-4 degrees Celsius by the end of the century, leading to catastrophic impacts. Solutions include transitioning to renewable energy sources, improving energy efficiency, and implementing carbon capture technologies. International cooperation is essential to address this global challenge effectively.`
    },
    {
      title: "History Excerpt",
      content: `The Industrial Revolution, which began in Britain in the late 18th century, marked a profound shift in human history. It transformed societies from agrarian economies to industrialized ones, fundamentally changing how people lived and worked. The invention of the steam engine by James Watt in 1769 revolutionized transportation and manufacturing. Factory systems emerged, concentrating workers in urban areas and creating new social classes. While the Industrial Revolution brought unprecedented economic growth and technological advancement, it also introduced significant social problems. Child labor, poor working conditions, and urban overcrowding became widespread issues. Environmental degradation from coal burning and factory waste also began during this period. The revolution spread from Britain to continental Europe and North America, reshaping global economic patterns. Its legacy continues to influence modern society, from urbanization trends to technological innovation.`
    },
    {
      title: "Technology Overview",
      content: `Artificial Intelligence (AI) represents a transformative technology that is reshaping industries and societies worldwide. AI systems can perform tasks that typically require human intelligence, such as visual perception, speech recognition, decision-making, and language translation. Machine learning, a subset of AI, enables computers to learn from data without being explicitly programmed. Deep learning, using neural networks with multiple layers, has achieved remarkable success in areas like image recognition and natural language processing. AI applications span healthcare, finance, transportation, and entertainment. In healthcare, AI assists in medical diagnosis and drug discovery. Self-driving cars use AI for navigation and safety. However, AI development raises important ethical concerns including job displacement, privacy issues, and the need for responsible AI governance. As AI continues to advance, society must address these challenges while harnessing its potential for human benefit.`
    }
  ];

  const loadSampleText = (content: string) => {
    setInputText(content);
    setSummary("");
  };

  const createBulletPointsSummary = (text: string): string => {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const targetPoints = Math.max(3, Math.min(7, Math.ceil(sentences.length * (summaryLength / 100))));
    
    const sentenceScores = sentences.map((sentence, index) => {
      const sentenceWords = sentence.split(/\s+/).filter(w => w.length > 0);
      let score = 0;
      
      if (sentenceWords.length > 5 && sentenceWords.length < 30) score += 1;
      if (index < sentences.length * 0.4) score += 1.5;
      
      const keywords = ['important', 'significant', 'key', 'main', 'primary', 'result', 'shows', 'demonstrates'];
      if (keywords.some(word => sentence.toLowerCase().includes(word))) score += 1.5;
      
      return { sentence: sentence.trim(), score, index };
    });
    
    sentenceScores.sort((a, b) => b.score - a.score);
    const selectedSentences = sentenceScores.slice(0, targetPoints);
    selectedSentences.sort((a, b) => a.index - b.index);
    
    return selectedSentences.map(s => `• ${s.sentence}`).join('\n');
  };

  const createKeySentencesSummary = (text: string): string => {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    if (sentences.length <= 2) return text;
    
    // Get first and last sentence + most important middle ones
    const firstSentence = sentences[0].trim();
    const lastSentence = sentences[sentences.length - 1].trim();
    const middleSentences = sentences.slice(1, -1);
    
    const targetMiddle = Math.max(1, Math.ceil(middleSentences.length * (summaryLength / 100)));
    
    const middleScores = middleSentences.map((sentence, index) => {
      const words = sentence.split(/\s+/).filter(w => w.length > 0);
      let score = words.length > 8 && words.length < 25 ? 1 : 0.5;
      
      const keywords = ['important', 'key', 'significant', 'main', 'essential', 'critical', 'however', 'therefore'];
      if (keywords.some(word => sentence.toLowerCase().includes(word))) score += 2;
      
      return { sentence: sentence.trim(), score };
    });
    
    middleScores.sort((a, b) => b.score - a.score);
    const selectedMiddle = middleScores.slice(0, targetMiddle).map(s => s.sentence);
    
    return [firstSentence, ...selectedMiddle, lastSentence].join('. ') + '.';
  };

  const summarizeText = () => {
    if (!inputText.trim()) {
      alert('Please enter some text to summarize.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      let summaryText = '';
      
      if (summaryMode === 'bullet-points') {
        summaryText = createBulletPointsSummary(inputText);
      } else if (summaryMode === 'key-sentences') {
        summaryText = createKeySentencesSummary(inputText);
      } else {
        // Extractive mode (original algorithm)
        const sentences = inputText.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const words = inputText.split(/\s+/).filter(w => w.length > 0);

        if (sentences.length <= 3) {
          summaryText = inputText;
        } else {
          const targetSentences = Math.max(2, Math.ceil(sentences.length * (summaryLength / 100)));

          const sentenceScores = sentences.map((sentence, index) => {
            const sentenceWords = sentence.split(/\s+/).filter(w => w.length > 0);
            let score = 0;

            const lengthScore = sentenceWords.length > 5 && sentenceWords.length < 30 ? 1 : 0.5;
            score += lengthScore;

            const positionScore = index === 0 || index === sentences.length - 1 ? 1.5 :
                                index < sentences.length * 0.3 ? 1.2 : 0.8;
            score += positionScore;

            const importantWords = ['important', 'significant', 'key', 'main', 'primary', 'major', 'essential', 'critical'];
            const keywordScore = importantWords.some(word =>
              sentence.toLowerCase().includes(word.toLowerCase())
            ) ? 1.5 : 1;
            score += keywordScore;

            return { sentence: sentence.trim(), score, index };
          });

          sentenceScores.sort((a, b) => b.score - a.score);
          const selectedSentences = sentenceScores.slice(0, targetSentences);
          selectedSentences.sort((a, b) => a.index - b.index);
          summaryText = selectedSentences.map(s => s.sentence).join('. ') + '.';
        }
      }

      setSummary(summaryText);
      
      // Save to history
      const originalWords = inputText.split(/\s+/).filter(w => w.length > 0).length;
      const summaryWords = summaryText.split(/\s+/).filter(w => w.length > 0).length;
      const compressionRatio = originalWords > 0 ? ((originalWords - summaryWords) / originalWords * 100) : 0;
      
      const newHistoryItem: SummaryHistory = {
        id: Date.now().toString(),
        originalText: inputText.substring(0, 200) + (inputText.length > 200 ? '...' : ''),
        summary: summaryText,
        mode: summaryMode,
        compressionRatio: parseFloat(compressionRatio.toFixed(1)),
        createdAt: new Date().toISOString(),
        summaryLength
      };
      
      setHistory([newHistoryItem, ...history].slice(0, 50)); // Keep last 50
      setIsLoading(false);
    }, 500);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(summary);
  };

  const getStats = () => {
    const originalWords = inputText.split(/\s+/).filter(w => w.length > 0).length;
    const originalSentences = inputText.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const summaryWords = summary.split(/\s+/).filter(w => w.length > 0).length;
    const summarySentences = summary.split(/[.!?]+/).filter(s => s.trim().length > 0).length;

    return {
      originalWords,
      originalSentences,
      summaryWords,
      summarySentences,
      compressionRatio: originalWords > 0 ? ((originalWords - summaryWords) / originalWords * 100).toFixed(1) : 0
    };
  };

  const getAnalytics = (): SummaryStats => {
    const totalSummaries = history.length;
    const totalWordsProcessed = history.reduce((sum, item) => {
      const words = item.originalText.split(/\s+/).filter(w => w.length > 0).length;
      return sum + words;
    }, 0);
    const totalWordsSaved = history.reduce((sum, item) => {
      const originalWords = item.originalText.split(/\s+/).filter(w => w.length > 0).length;
      const summaryWords = item.summary.split(/\s+/).filter(w => w.length > 0).length;
      return sum + (originalWords - summaryWords);
    }, 0);
    const averageCompression = history.length > 0 
      ? history.reduce((sum, item) => sum + item.compressionRatio, 0) / history.length 
      : 0;
    
    const modeCounts = history.reduce((acc, item) => {
      acc[item.mode] = (acc[item.mode] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const favoriteMode = Object.keys(modeCounts).length > 0
      ? Object.keys(modeCounts).reduce((a, b) => modeCounts[a] > modeCounts[b] ? a : b)
      : 'extractive';

    return {
      totalSummaries,
      totalWordsProcessed,
      totalWordsSaved,
      averageCompression: parseFloat(averageCompression.toFixed(1)),
      favoriteMode
    };
  };

  const deleteHistoryItem = (id: string) => {
    setHistory(history.filter(item => item.id !== id));
  };

  const clearAllHistory = () => {
    if (confirm('Are you sure you want to clear all summary history?')) {
      setHistory([]);
      localStorage.removeItem("text-summarizer-data");
    }
  };

  const stats = getStats();
  const analytics = getAnalytics();

  return (
    <main className={styles.container}>
      <section className={styles.tool}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            📝 Text Summarizer
          </h1>
          <p className={styles.subtitle}>
            Extract key points and create concise summaries with intelligent analytics
          </p>
          <div className={styles.dataInfo}>
            <span className={styles.infoItem}>
              💾 <strong>Auto-Save:</strong> All summaries are saved
            </span>
            <span className={styles.infoSeparator}>•</span>
            <span className={styles.infoItem}>
              {lastSaved && <><strong>Last saved:</strong> {lastSaved}</>}
            </span>
            <span className={styles.infoSeparator}>•</span>
            <span className={styles.infoItem}>
              📊 <strong>{history.length}</strong> summaries created
            </span>
          </div>
        </div>

        {/* Smart Analytics Dashboard */}
        {history.length > 0 && (
          <div className={styles.smartDashboard}>
            <div className={styles.dashboardSection}>
              <h3>📊 Summary Analytics</h3>
              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <span className={styles.statNumber}>{analytics.totalSummaries}</span>
                  <span className={styles.statName}>Total Summaries</span>
                </div>
                <div className={styles.statCard}>
                  <span className={styles.statNumber}>{analytics.totalWordsProcessed}</span>
                  <span className={styles.statName}>Words Processed</span>
                </div>
                <div className={styles.statCard}>
                  <span className={styles.statNumber}>{analytics.totalWordsSaved}</span>
                  <span className={styles.statName}>Words Saved</span>
                </div>
                <div className={styles.statCard}>
                  <span className={styles.statNumber}>{analytics.averageCompression}%</span>
                  <span className={styles.statName}>Avg Compression</span>
                </div>
              </div>
            </div>

            <div className={styles.dashboardSection}>
              <h3>💡 Smart Insights</h3>
              <div className={styles.insightCard}>
                <div className={styles.insightPositive}>
                  ✅ You've saved <strong>{analytics.totalWordsSaved} words</strong> of reading time across {analytics.totalSummaries} summaries!
                  Your favorite mode is <strong>{analytics.favoriteMode}</strong>.
                </div>
              </div>
            </div>
          </div>
        )}

        <div className={styles.summarizer}>
          <div className={styles.inputSection}>
            <div className={styles.textInput}>
              <label htmlFor="inputText">Enter text to summarize:</label>
              <textarea
                id="inputText"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste your text here..."
                rows={10}
              />
            </div>

            <div className={styles.controls}>
              <div className={styles.modeControl}>
                <label htmlFor="summaryMode">Summary Mode:</label>
                <select
                  id="summaryMode"
                  value={summaryMode}
                  onChange={(e) => setSummaryMode(e.target.value as any)}
                  className={styles.modeSelect}
                >
                  <option value="extractive">Extractive (Coherent Paragraphs)</option>
                  <option value="bullet-points">Bullet Points (Key Ideas)</option>
                  <option value="key-sentences">Key Sentences (First + Last + Important)</option>
                </select>
              </div>

              <div className={styles.lengthControl}>
                <label htmlFor="summaryLength">Summary Length: {summaryLength}%</label>
                <input
                  id="summaryLength"
                  type="range"
                  min="20"
                  max="80"
                  value={summaryLength}
                  onChange={(e) => setSummaryLength(parseInt(e.target.value))}
                />
              </div>

              <div className={styles.buttons}>
                <button
                  onClick={summarizeText}
                  className={styles.summarizeBtn}
                  disabled={!inputText.trim() || isLoading}
                >
                  {isLoading ? 'Summarizing...' : 'Summarize Text'}
                </button>
                <button onClick={() => setShowAnalytics(!showAnalytics)} className={styles.analyticsBtn}>
                  📈 Analytics
                </button>
                <button onClick={() => setShowHistory(!showHistory)} className={styles.historyBtn}>
                  📋 History
                </button>
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
          </div>

          {summary && (
            <div className={styles.outputSection}>
              <div className={styles.summaryHeader}>
                <h3>Summary</h3>
                <button onClick={copyToClipboard} className={styles.copyBtn}>
                  Copy
                </button>
              </div>

              <div className={styles.summary}>
                {summary}
              </div>

              <div className={styles.stats}>
                <div className={styles.statGrid}>
                  <div className={styles.stat}>
                    <span className={styles.statValue}>{stats.originalWords}</span>
                    <span className={styles.statLabel}>Original Words</span>
                  </div>
                  <div className={styles.stat}>
                    <span className={styles.statValue}>{stats.summaryWords}</span>
                    <span className={styles.statLabel}>Summary Words</span>
                  </div>
                  <div className={styles.stat}>
                    <span className={styles.statValue}>{stats.compressionRatio}%</span>
                    <span className={styles.statLabel}>Compression</span>
                  </div>
                  <div className={styles.stat}>
                    <span className={styles.statValue}>{stats.originalSentences} → {stats.summarySentences}</span>
                    <span className={styles.statLabel}>Sentences</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Detailed Analytics */}
        {showAnalytics && history.length > 0 && (
          <div className={styles.analyticsSection}>
            <h3>📊 Detailed Analytics</h3>
            <div className={styles.analyticsGrid}>
              <div className={styles.analyticsCard}>
                <h4>Summary Statistics</h4>
                <div className={styles.analyticsMetric}>
                  <span>Total Summaries Created</span>
                  <span className={styles.metricValue}>{analytics.totalSummaries}</span>
                </div>
                <div className={styles.analyticsMetric}>
                  <span>Total Words Processed</span>
                  <span className={styles.metricValue}>{analytics.totalWordsProcessed.toLocaleString()}</span>
                </div>
                <div className={styles.analyticsMetric}>
                  <span>Total Words Saved</span>
                  <span className={styles.metricValue}>{analytics.totalWordsSaved.toLocaleString()}</span>
                </div>
                <div className={styles.analyticsMetric}>
                  <span>Average Compression</span>
                  <span className={styles.metricValue}>{analytics.averageCompression}%</span>
                </div>
              </div>
              
              <div className={styles.analyticsCard}>
                <h4>Usage Patterns</h4>
                <div className={styles.analyticsMetric}>
                  <span>Favorite Mode</span>
                  <span className={styles.metricValue}>{analytics.favoriteMode}</span>
                </div>
                <div className={styles.analyticsMetric}>
                  <span>Estimated Reading Time Saved</span>
                  <span className={styles.metricValue}>{Math.ceil(analytics.totalWordsSaved / 200)} min</span>
                </div>
                <div className={styles.analyticsMetric}>
                  <span>Most Recent Summary</span>
                  <span className={styles.metricValue}>{history.length > 0 ? new Date(history[0].createdAt).toLocaleDateString() : 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* History Section */}
        {showHistory && history.length > 0 && (
          <div className={styles.historySection}>
            <div className={styles.historyHeader}>
              <h3>📋 Summary History</h3>
              <button onClick={clearAllHistory} className={styles.clearBtn}>
                Clear All
              </button>
            </div>
            <div className={styles.historyList}>
              {history.map(item => (
                <div key={item.id} className={styles.historyCard}>
                  <div className={styles.historyCardHeader}>
                    <div>
                      <span className={styles.historyMode}>{item.mode}</span>
                      <span className={styles.historyDate}>{new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                    <button onClick={() => deleteHistoryItem(item.id)} className={styles.deleteBtn}>
                      Delete
                    </button>
                  </div>
                  <div className={styles.historyText}>
                    <strong>Original:</strong> {item.originalText}
                  </div>
                  <div className={styles.historyStats}>
                    <span>Compression: {item.compressionRatio}%</span>
                    <span>Length: {item.summaryLength}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className={styles.info}>
          <h4>How It Works</h4>
          <p>
            This summarizer uses an extractive approach that identifies and extracts the most important sentences
            from your text. It considers factors like sentence length, position in the text, and the presence of
            important keywords to create a coherent and informative summary.
          </p>
          <div className={styles.tips}>
            <strong>Tips for best results:</strong>
            <ul>
              <li>Use well-structured text with clear sentences</li>
              <li>Longer texts (500+ words) work better for summarization</li>
              <li>Adjust the summary length based on your needs</li>
              <li>Review and edit the summary for your specific context</li>
            </ul>
          </div>
        </div>
      </section>

      <ToolInfo
        howItWorks="1. Paste or type the text you want to summarize.<br>2. Adjust the summary length slider (20-80% of original).<br>3. Click 'Summarize Text' to generate the summary.<br>4. Review the results and copy if needed."
        faqs={[
          {
            title: "What type of summarization does this use?",
            content: "This tool uses extractive summarization, which selects and rearranges the most important sentences from the original text."
          },
          {
            title: "How accurate are the summaries?",
            content: "The algorithm considers sentence importance, length, and position to create coherent summaries, but results may vary by text type."
          },
          {
            title: "What's the ideal text length?",
            content: "Best results with texts of 300-2000 words. Very short texts may not need summarization."
          }
        ]}
        tips={[
          "Use for studying, research, or quickly understanding long articles",
          "Combine with our Reading Time Calculator to estimate summary reading time",
          "Review AI-generated summaries critically - they may miss nuanced points",
          "Use different summary lengths for different purposes (short for quick overview, longer for detailed understanding)"
        ]}
      />
    </main>
  );
}