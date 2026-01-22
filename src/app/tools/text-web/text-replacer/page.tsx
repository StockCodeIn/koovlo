'use client';

import { useState } from 'react';
import styles from './textreplacer.module.css';

export default function TextReplacerPage() {
  const [inputText, setInputText] = useState('');
  const [searchText, setSearchText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [options, setOptions] = useState({
    caseSensitive: false,
    useRegex: false,
    replaceAll: true,
    wholeWord: false,
  });
  const [stats, setStats] = useState({
    replacements: 0,
    originalLength: 0,
    newLength: 0,
  });

  const handleReplace = () => {
    if (!inputText || !searchText) return;

    let text = inputText;
    let flags = options.caseSensitive ? 'g' : 'gi';

    if (!options.replaceAll) {
      flags = flags.replace('g', '');
    }

    let searchPattern;
    try {
      if (options.useRegex) {
        searchPattern = new RegExp(searchText, flags);
      } else {
        let escapedSearch = searchText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        if (options.wholeWord) {
          escapedSearch = `\\b${escapedSearch}\\b`;
        }
        searchPattern = new RegExp(escapedSearch, flags);
      }

      const matches = text.match(searchPattern);
      const replacementCount = matches ? matches.length : 0;

      const newText = text.replace(searchPattern, replaceText);

      setOutputText(newText);
      setStats({
        replacements: replacementCount,
        originalLength: text.length,
        newLength: newText.length,
      });
    } catch (error) {
      alert('Invalid regex pattern. Please check your search text.');
    }
  };

  const handleClear = () => {
    setInputText('');
    setSearchText('');
    setReplaceText('');
    setOutputText('');
    setStats({ replacements: 0, originalLength: 0, newLength: 0 });
  };

  const loadSampleData = () => {
    setInputText(`Hello world, hello universe!
This is a sample text for replacement.
Hello again, and hello once more.`);
    setSearchText('hello');
    setReplaceText('hi');
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(outputText);
      alert('Output copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const downloadOutput = () => {
    const blob = new Blob([outputText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'replaced-text.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={styles.container}>
      <div className={styles.tool}>
        <div className={styles.inputSection}>
          <div className={styles.inputHeader}>
            <h3>Input Text</h3>
            <button onClick={loadSampleData} className={styles.sampleBtn}>
              Load Sample
            </button>
          </div>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter the text you want to search and replace in..."
            className={styles.textarea}
          />
        </div>

        <div className={styles.searchReplaceSection}>
          <div className={styles.searchReplaceGrid}>
            <div className={styles.field}>
              <label className={styles.label}>Search for:</label>
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Text to find..."
                className={styles.input}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Replace with:</label>
              <input
                type="text"
                value={replaceText}
                onChange={(e) => setReplaceText(e.target.value)}
                placeholder="Replacement text..."
                className={styles.input}
              />
            </div>
          </div>
        </div>

        <div className={styles.optionsSection}>
          <h3>Options</h3>
          <div className={styles.optionsGrid}>
            <label className={styles.checkboxOption}>
              <input
                type="checkbox"
                checked={options.caseSensitive}
                onChange={(e) => setOptions(prev => ({ ...prev, caseSensitive: e.target.checked }))}
                className={styles.checkbox}
              />
              <div className={styles.checkboxText}>
                <strong>Case Sensitive</strong>
                <small>Match exact case of search text</small>
              </div>
            </label>

            <label className={styles.checkboxOption}>
              <input
                type="checkbox"
                checked={options.useRegex}
                onChange={(e) => setOptions(prev => ({ ...prev, useRegex: e.target.checked }))}
                className={styles.checkbox}
              />
              <div className={styles.checkboxText}>
                <strong>Use Regex</strong>
                <small>Use regular expressions for advanced search</small>
              </div>
            </label>

            <label className={styles.checkboxOption}>
              <input
                type="checkbox"
                checked={options.replaceAll}
                onChange={(e) => setOptions(prev => ({ ...prev, replaceAll: e.target.checked }))}
                className={styles.checkbox}
              />
              <div className={styles.checkboxText}>
                <strong>Replace All</strong>
                <small>Replace all occurrences, not just first</small>
              </div>
            </label>

            <label className={styles.checkboxOption}>
              <input
                type="checkbox"
                checked={options.wholeWord}
                onChange={(e) => setOptions(prev => ({ ...prev, wholeWord: e.target.checked }))}
                className={styles.checkbox}
              />
              <div className={styles.checkboxText}>
                <strong>Whole Word</strong>
                <small>Match whole words only</small>
              </div>
            </label>
          </div>
        </div>

        <div className={styles.actions}>
          <button onClick={handleReplace} className={styles.replaceBtn}>
            Replace Text
          </button>
          <button onClick={handleClear} className={styles.clearBtn}>
            Clear All
          </button>
        </div>

        {outputText && (
          <div className={styles.outputSection}>
            <h3>Output</h3>
            <textarea
              value={outputText}
              readOnly
              className={styles.textarea}
            />
            <div className={styles.outputActions}>
              <button onClick={copyToClipboard} className={styles.copyBtn}>
                Copy Output
              </button>
              <button onClick={downloadOutput} className={styles.downloadBtn}>
                Download as File
              </button>
            </div>
          </div>
        )}

        {stats.replacements > 0 && (
          <div className={styles.stats}>
            <h3>Replacement Statistics</h3>
            <div className={styles.statsGrid}>
              <div className={styles.stat}>
                <span className={styles.statNumber}>{stats.replacements}</span>
                <span className={styles.statLabel}>Replacements Made</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>{stats.originalLength}</span>
                <span className={styles.statLabel}>Original Length</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>{stats.newLength}</span>
                <span className={styles.statLabel}>New Length</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}