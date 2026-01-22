"use client";

import { useState } from "react";
import styles from "./text-summarizer.module.css";
import ToolInfo from "@/components/ToolInfo";

export default function TextSummarizer() {
  const [inputText, setInputText] = useState("");
  const [summary, setSummary] = useState("");
  const [summaryLength, setSummaryLength] = useState(30); // percentage
  const [isLoading, setIsLoading] = useState(false);

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

  const summarizeText = () => {
    if (!inputText.trim()) return;

    setIsLoading(true);

    // Simple extractive summarization algorithm
    setTimeout(() => {
      const sentences = inputText.split(/[.!?]+/).filter(s => s.trim().length > 0);
      const words = inputText.split(/\s+/).filter(w => w.length > 0);

      if (sentences.length <= 3) {
        setSummary(inputText);
        setIsLoading(false);
        return;
      }

      // Calculate target number of sentences for summary
      const targetSentences = Math.max(2, Math.ceil(sentences.length * (summaryLength / 100)));

      // Score sentences based on various factors
      const sentenceScores = sentences.map((sentence, index) => {
        const sentenceWords = sentence.split(/\s+/).filter(w => w.length > 0);
        let score = 0;

        // Length score (prefer medium-length sentences)
        const lengthScore = sentenceWords.length > 5 && sentenceWords.length < 30 ? 1 : 0.5;
        score += lengthScore;

        // Position score (prefer sentences at the beginning and end)
        const positionScore = index === 0 || index === sentences.length - 1 ? 1.5 :
                            index < sentences.length * 0.3 ? 1.2 : 0.8;
        score += positionScore;

        // Keyword score (sentences with important words)
        const importantWords = ['important', 'significant', 'key', 'main', 'primary', 'major', 'essential', 'critical'];
        const keywordScore = importantWords.some(word =>
          sentence.toLowerCase().includes(word.toLowerCase())
        ) ? 1.5 : 1;
        score += keywordScore;

        return { sentence: sentence.trim(), score, index };
      });

      // Sort by score and select top sentences
      sentenceScores.sort((a, b) => b.score - a.score);
      const selectedSentences = sentenceScores.slice(0, targetSentences);

      // Sort back to original order for coherent summary
      selectedSentences.sort((a, b) => a.index - b.index);

      const summaryText = selectedSentences.map(s => s.sentence).join('. ') + '.';
      setSummary(summaryText);
      setIsLoading(false);
    }, 500); // Simulate processing time
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

  const stats = getStats();

  return (
    <main className={styles.container}>
      <section className={styles.tool}>
        <h1 className={styles.title}>
          <span className={styles.icon}>📝</span>
          Text Summarizer
        </h1>
        <p>Extract key points and create concise summaries from longer texts.</p>

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