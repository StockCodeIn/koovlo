'use client';

import { useState } from 'react';
import ToolInfo from '@/components/ToolInfo';
import styles from './textsorter.module.css';

export default function TextSorter() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [sortOptions, setSortOptions] = useState({
    sortBy: 'alphabetical' as 'alphabetical' | 'length' | 'numerical',
    order: 'ascending' as 'ascending' | 'descending',
    caseSensitive: false,
    removeDuplicates: false,
    ignoreEmptyLines: true,
  });
  const [stats, setStats] = useState({
    originalLines: 0,
    sortedLines: 0,
    duplicatesRemoved: 0,
  });

  const sortText = () => {
    if (!inputText.trim()) {
      setOutputText('');
      setStats({ originalLines: 0, sortedLines: 0, duplicatesRemoved: 0 });
      return;
    }

    let lines = inputText.split('\n');

    // Remove empty lines if option is selected
    if (sortOptions.ignoreEmptyLines) {
      lines = lines.filter(line => line.trim().length > 0);
    }

    const originalLines = lines.length;

    // Remove duplicates if option is selected
    if (sortOptions.removeDuplicates) {
      const uniqueLines = new Set(lines);
      lines = Array.from(uniqueLines);
    }

    const duplicatesRemoved = originalLines - lines.length;

    // Sort the lines
    lines.sort((a, b) => {
      let comparison = 0;

      switch (sortOptions.sortBy) {
        case 'alphabetical':
          if (!sortOptions.caseSensitive) {
            a = a.toLowerCase();
            b = b.toLowerCase();
          }
          comparison = a.localeCompare(b);
          break;

        case 'length':
          comparison = a.length - b.length;
          break;

        case 'numerical':
          const numA = parseFloat(a.replace(/[^\d.-]/g, '')) || 0;
          const numB = parseFloat(b.replace(/[^\d.-]/g, '')) || 0;
          comparison = numA - numB;
          break;
      }

      return sortOptions.order === 'ascending' ? comparison : -comparison;
    });

    const sortedText = lines.join('\n');

    setOutputText(sortedText);
    setStats({
      originalLines,
      sortedLines: lines.length,
      duplicatesRemoved,
    });
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(outputText);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const clearAll = () => {
    setInputText('');
    setOutputText('');
    setStats({ originalLines: 0, sortedLines: 0, duplicatesRemoved: 0 });
  };

  const handleOptionChange = (key: keyof typeof sortOptions, value: any) => {
    setSortOptions(prev => ({ ...prev, [key]: value }));
  };

  const loadSampleData = () => {
    const sample = `Apple
Banana
Cherry
Date
Elderberry
Fig
Grape
Honeydew
Kiwi
Lemon
Mango
Orange
Pear
Quince
Strawberry
Tomato
Ugli fruit
Vanilla bean
Watermelon
Xigua
Yam
Zucchini`;
    setInputText(sample);
  };

  return (
    <main className={styles.container}>
      <h1>Text Sorter Tool</h1>
      <p>Sort lines of text alphabetically, by length, or numerically</p>

      <div className={styles.tool}>
        <div className={styles.inputSection}>
          <div className={styles.inputHeader}>
            <h3>Input Text</h3>
            <button onClick={loadSampleData} className={styles.sampleBtn}>
              Load Sample Data
            </button>
          </div>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter text with one item per line..."
            className={styles.textarea}
            rows={10}
          />
        </div>

        <div className={styles.optionsSection}>
          <h3>Sorting Options</h3>

          <div className={styles.optionsGrid}>
            <div className={styles.optionGroup}>
              <label className={styles.label}>Sort By:</label>
              <select
                value={sortOptions.sortBy}
                onChange={(e) => handleOptionChange('sortBy', e.target.value)}
                className={styles.select}
              >
                <option value="alphabetical">Alphabetical</option>
                <option value="length">Length</option>
                <option value="numerical">Numerical</option>
              </select>
            </div>

            <div className={styles.optionGroup}>
              <label className={styles.label}>Order:</label>
              <select
                value={sortOptions.order}
                onChange={(e) => handleOptionChange('order', e.target.value)}
                className={styles.select}
              >
                <option value="ascending">Ascending (A-Z, 1-9)</option>
                <option value="descending">Descending (Z-A, 9-1)</option>
              </select>
            </div>

            <label className={styles.checkboxOption}>
              <input
                type="checkbox"
                checked={sortOptions.caseSensitive}
                onChange={(e) => handleOptionChange('caseSensitive', e.target.checked)}
                className={styles.checkbox}
              />
              <span className={styles.checkboxText}>
                <strong>Case Sensitive</strong>
                <small>Distinguish between uppercase and lowercase</small>
              </span>
            </label>

            <label className={styles.checkboxOption}>
              <input
                type="checkbox"
                checked={sortOptions.removeDuplicates}
                onChange={(e) => handleOptionChange('removeDuplicates', e.target.checked)}
                className={styles.checkbox}
              />
              <span className={styles.checkboxText}>
                <strong>Remove Duplicates</strong>
                <small>Keep only unique lines</small>
              </span>
            </label>

            <label className={styles.checkboxOption}>
              <input
                type="checkbox"
                checked={sortOptions.ignoreEmptyLines}
                onChange={(e) => handleOptionChange('ignoreEmptyLines', e.target.checked)}
                className={styles.checkbox}
              />
              <span className={styles.checkboxText}>
                <strong>Ignore Empty Lines</strong>
                <small>Skip blank lines in sorting</small>
              </span>
            </label>
          </div>

          <div className={styles.actions}>
            <button onClick={sortText} className={styles.sortBtn}>
              Sort Text
            </button>
            <button onClick={clearAll} className={styles.clearBtn}>
              Clear All
            </button>
          </div>
        </div>

        <div className={styles.outputSection}>
          <h3>Sorted Output</h3>
          <textarea
            value={outputText}
            readOnly
            placeholder="Sorted text will appear here..."
            className={styles.textarea}
            rows={10}
          />

          {outputText && (
            <div className={styles.outputActions}>
              <button onClick={copyToClipboard} className={styles.copyBtn}>
                📋 Copy Result
              </button>
              <button
                onClick={() => {
                  const blob = new Blob([outputText], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'sorted-text.txt';
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className={styles.downloadBtn}
              >
                💾 Download as File
              </button>
            </div>
          )}
        </div>

        {stats.sortedLines > 0 && (
          <div className={styles.stats}>
            <h3>Sorting Results</h3>
            <div className={styles.statsGrid}>
              <div className={styles.stat}>
                <span className={styles.statNumber}>{stats.originalLines}</span>
                <span className={styles.statLabel}>Original Lines</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>{stats.sortedLines}</span>
                <span className={styles.statLabel}>Sorted Lines</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>{stats.duplicatesRemoved}</span>
                <span className={styles.statLabel}>Duplicates Removed</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>
                  {sortOptions.sortBy === 'alphabetical' ? 'A-Z' :
                   sortOptions.sortBy === 'length' ? 'Length' : 'Numerical'}
                </span>
                <span className={styles.statLabel}>Sort Method</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <ToolInfo
        howItWorks="Enter text with one item per line<br>Choose sorting method and options<br>Click 'Sort Text' to process<br>Copy or download the sorted result"
        faqs={[
          { title: "What does 'numerical' sorting do?", content: "It extracts numbers from each line and sorts based on those numbers. Useful for lists with numbers." },
          { title: "Are duplicates case-sensitive?", content: "Duplicate removal respects the case-sensitive setting you choose." },
          { title: "What happens to empty lines?", content: "You can choose to ignore them (recommended) or include them in the sorting." },
          { title: "Can I sort by custom criteria?", content: "Currently supports alphabetical, length, and numerical sorting. More options may be added later." }
        ]}
        tips={["Use alphabetical sorting for lists and names<br>Numerical sorting works great for numbered lists<br>Remove duplicates for cleaning data<br>Case-sensitive sorting for programming identifiers"]}
      />
    </main>
  );
}