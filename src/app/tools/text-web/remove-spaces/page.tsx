'use client';

import { useState } from 'react';
import ToolInfo from '@/components/ToolInfo';
import styles from './removespaces.module.css';

export default function RemoveSpaces() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [options, setOptions] = useState({
    removeLeadingTrailing: true,
    removeExtraSpaces: true,
    removeAllSpaces: false,
    removeTabs: true,
    removeNewlines: false,
  });
  const [stats, setStats] = useState({
    originalLength: 0,
    newLength: 0,
    spacesRemoved: 0,
  });

  const processText = () => {
    if (!inputText.trim()) {
      setOutputText('');
      setStats({ originalLength: 0, newLength: 0, spacesRemoved: 0 });
      return;
    }

    let processed = inputText;
    let originalLength = inputText.length;

    if (options.removeAllSpaces) {
      processed = processed.replace(/\s/g, '');
    } else {
      if (options.removeLeadingTrailing) {
        processed = processed.trim();
      }
      if (options.removeExtraSpaces) {
        processed = processed.replace(/[ \t]+/g, ' ');
      }
      if (options.removeTabs) {
        processed = processed.replace(/\t/g, ' ');
      }
      if (options.removeNewlines) {
        processed = processed.replace(/\n/g, ' ');
      }
    }

    const newLength = processed.length;
    const spacesRemoved = originalLength - newLength;

    setOutputText(processed);
    setStats({
      originalLength,
      newLength,
      spacesRemoved,
    });
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(outputText);
      // Could show a success message
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const clearAll = () => {
    setInputText('');
    setOutputText('');
    setStats({ originalLength: 0, newLength: 0, spacesRemoved: 0 });
  };

  const handleOptionChange = (option: keyof typeof options) => {
    setOptions(prev => ({ ...prev, [option]: !prev[option] }));
  };

  return (
    <main className={styles.container}>
      <h1>Remove Spaces Tool</h1>
      <p>Clean up text by removing unwanted spaces, tabs, and whitespace</p>

      <div className={styles.tool}>
        <div className={styles.inputSection}>
          <h3>Input Text</h3>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste your text here..."
            className={styles.textarea}
            rows={8}
          />
        </div>

        <div className={styles.optionsSection}>
          <h3>Cleaning Options</h3>

          <div className={styles.optionsGrid}>
            <label className={styles.option}>
              <input
                type="checkbox"
                checked={options.removeLeadingTrailing}
                onChange={() => handleOptionChange('removeLeadingTrailing')}
                className={styles.checkbox}
              />
              <span className={styles.optionText}>
                <strong>Leading/Trailing Spaces</strong>
                <small>Remove spaces at start and end</small>
              </span>
            </label>

            <label className={styles.option}>
              <input
                type="checkbox"
                checked={options.removeExtraSpaces}
                onChange={() => handleOptionChange('removeExtraSpaces')}
                className={styles.checkbox}
              />
              <span className={styles.optionText}>
                <strong>Extra Spaces</strong>
                <small>Replace multiple spaces with single space</small>
              </span>
            </label>

            <label className={styles.option}>
              <input
                type="checkbox"
                checked={options.removeAllSpaces}
                onChange={() => handleOptionChange('removeAllSpaces')}
                className={styles.checkbox}
              />
              <span className={styles.optionText}>
                <strong>Remove All Spaces</strong>
                <small>Remove every space character</small>
              </span>
            </label>

            <label className={styles.option}>
              <input
                type="checkbox"
                checked={options.removeTabs}
                onChange={() => handleOptionChange('removeTabs')}
                className={styles.checkbox}
              />
              <span className={styles.optionText}>
                <strong>Tabs to Spaces</strong>
                <small>Convert tabs to single spaces</small>
              </span>
            </label>

            <label className={styles.option}>
              <input
                type="checkbox"
                checked={options.removeNewlines}
                onChange={() => handleOptionChange('removeNewlines')}
                className={styles.checkbox}
              />
              <span className={styles.optionText}>
                <strong>Remove Line Breaks</strong>
                <small>Convert newlines to spaces</small>
              </span>
            </label>
          </div>

          <div className={styles.actions}>
            <button onClick={processText} className={styles.processBtn}>
              Clean Text
            </button>
            <button onClick={clearAll} className={styles.clearBtn}>
              Clear All
            </button>
          </div>
        </div>

        <div className={styles.outputSection}>
          <h3>Output Text</h3>
          <textarea
            value={outputText}
            readOnly
            placeholder="Processed text will appear here..."
            className={styles.textarea}
            rows={8}
          />

          {outputText && (
            <div className={styles.outputActions}>
              <button onClick={copyToClipboard} className={styles.copyBtn}>
                📋 Copy Result
              </button>
              <button
                onClick={() => navigator.clipboard.writeText(outputText)}
                className={styles.downloadBtn}
              >
                💾 Download as Text
              </button>
            </div>
          )}
        </div>

        {stats.spacesRemoved > 0 && (
          <div className={styles.stats}>
            <h3>Cleaning Results</h3>
            <div className={styles.statsGrid}>
              <div className={styles.stat}>
                <span className={styles.statNumber}>{stats.originalLength}</span>
                <span className={styles.statLabel}>Original Characters</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>{stats.newLength}</span>
                <span className={styles.statLabel}>Clean Characters</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>{stats.spacesRemoved}</span>
                <span className={styles.statLabel}>Characters Removed</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>
                  {stats.originalLength > 0 ? ((stats.spacesRemoved / stats.originalLength) * 100).toFixed(1) : 0}%
                </span>
                <span className={styles.statLabel}>Reduction</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <ToolInfo
        howItWorks="Enter or paste text in the input area<br>Select cleaning options you want to apply<br>Click 'Clean Text' to process<br>Copy or download the cleaned result"
        faqs={[
          { title: "What's the difference between 'Extra Spaces' and 'Remove All Spaces'?", content: "'Extra Spaces' keeps single spaces between words but removes multiples. 'Remove All Spaces' removes every space." },
          { title: "Does this tool preserve formatting?", content: "It depends on your options. You can choose to keep or remove line breaks and tabs." },
          { title: "Can I undo the changes?", content: "No, but you can always paste the original text again and try different options." },
          { title: "What characters are considered 'spaces'?", content: "Regular spaces, tabs, and other whitespace characters like non-breaking spaces." }
        ]}
        tips={["Use 'Remove All Spaces' for creating compact text<br>Keep line breaks for multi-line content<br>Perfect for cleaning copied text from websites<br>Great for preparing text for databases or APIs"]}
      />
    </main>
  );
}