'use client';

import { useState } from 'react';
import styles from './jsonvalidator.module.css';

export default function JsonValidatorPage() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [options, setOptions] = useState({
    formatOutput: true,
    compactOutput: false,
    sortKeys: false,
  });
  const [stats, setStats] = useState({
    size: 0,
    lines: 0,
    keys: 0,
    depth: 0,
  });

  const validateJson = (jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);
      setIsValid(true);
      setErrorMessage('');

      let formatted = jsonString;
      if (options.formatOutput) {
        formatted = JSON.stringify(parsed, null, 2);
      } else if (options.compactOutput) {
        formatted = JSON.stringify(parsed);
      }

      if (options.sortKeys) {
        const sorted = sortObjectKeys(parsed);
        formatted = options.formatOutput ? JSON.stringify(sorted, null, 2) : JSON.stringify(sorted);
      }

      setOutputText(formatted);

      // Calculate statistics
      const stats = calculateStats(parsed);
      setStats(stats);

      return true;
    } catch (error) {
      setIsValid(false);
      setErrorMessage(error instanceof Error ? error.message : 'Invalid JSON');
      setOutputText('');
      setStats({ size: 0, lines: 0, keys: 0, depth: 0 });
      return false;
    }
  };

  const sortObjectKeys = (obj: any): any => {
    if (obj === null || typeof obj !== 'object') return obj;
    if (Array.isArray(obj)) return obj.map(sortObjectKeys);

    const sorted: any = {};
    Object.keys(obj).sort().forEach(key => {
      sorted[key] = sortObjectKeys(obj[key]);
    });
    return sorted;
  };

  const calculateStats = (obj: any): typeof stats => {
    const jsonString = JSON.stringify(obj);
    const lines = jsonString.split('\n').length;
    const keys = countKeys(obj);
    const depth = calculateDepth(obj);

    return {
      size: jsonString.length,
      lines,
      keys,
      depth,
    };
  };

  const countKeys = (obj: any): number => {
    if (obj === null || typeof obj !== 'object') return 0;
    if (Array.isArray(obj)) {
      return obj.reduce((sum, item) => sum + countKeys(item), 0);
    }

    let count = Object.keys(obj).length;
    for (const value of Object.values(obj)) {
      count += countKeys(value);
    }
    return count;
  };

  const calculateDepth = (obj: any, currentDepth = 0): number => {
    if (obj === null || typeof obj !== 'object') return currentDepth;
    if (Array.isArray(obj)) {
      if (obj.length === 0) return currentDepth + 1;
      return Math.max(...obj.map(item => calculateDepth(item, currentDepth + 1)));
    }

    const depths = Object.values(obj).map(value => calculateDepth(value, currentDepth + 1));
    return depths.length > 0 ? Math.max(...depths) : currentDepth + 1;
  };

  const handleInputChange = (value: string) => {
    setInputText(value);
    if (value.trim()) {
      validateJson(value);
    } else {
      setIsValid(null);
      setErrorMessage('');
      setOutputText('');
      setStats({ size: 0, lines: 0, keys: 0, depth: 0 });
    }
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
    setIsValid(null);
    setErrorMessage('');
    setStats({ size: 0, lines: 0, keys: 0, depth: 0 });
  };

  const loadSampleData = () => {
    const sampleJson = {
      name: "John Doe",
      age: 30,
      email: "john@example.com",
      address: {
        street: "123 Main St",
        city: "Anytown",
        zipCode: "12345"
      },
      hobbies: ["reading", "coding", "gaming"],
      active: true,
      metadata: {
        created: "2023-01-01",
        tags: ["user", "premium"]
      }
    };
    setInputText(JSON.stringify(sampleJson, null, 2));
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
    const blob = new Blob([outputText], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'validated-json.json';
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
            <h3>JSON Input</h3>
            <button onClick={loadSampleData} className={styles.sampleBtn}>
              Load Sample
            </button>
          </div>
          <textarea
            value={inputText}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="Paste your JSON here to validate and format..."
            className={styles.textarea}
          />
        </div>

        <div className={styles.validationStatus}>
          {isValid === true && (
            <div className={styles.valid}>
              ✅ Valid JSON
            </div>
          )}
          {isValid === false && (
            <div className={styles.invalid}>
              ❌ Invalid JSON: {errorMessage}
            </div>
          )}
        </div>

        <div className={styles.optionsSection}>
          <h3>Output Options</h3>
          <div className={styles.optionsGrid}>
            <label className={styles.checkboxOption}>
              <input
                type="checkbox"
                checked={options.formatOutput}
                onChange={(e) => setOptions(prev => ({ ...prev, formatOutput: e.target.checked }))}
                className={styles.checkbox}
              />
              <div className={styles.checkboxText}>
                <strong>Pretty Print</strong>
                <small>Format JSON with indentation</small>
              </div>
            </label>

            <label className={styles.checkboxOption}>
              <input
                type="checkbox"
                checked={options.compactOutput}
                onChange={(e) => setOptions(prev => ({ ...prev, compactOutput: e.target.checked }))}
                className={styles.checkbox}
              />
              <div className={styles.checkboxText}>
                <strong>Compact Output</strong>
                <small>Minify JSON (overrides pretty print)</small>
              </div>
            </label>

            <label className={styles.checkboxOption}>
              <input
                type="checkbox"
                checked={options.sortKeys}
                onChange={(e) => setOptions(prev => ({ ...prev, sortKeys: e.target.checked }))}
                className={styles.checkbox}
              />
              <div className={styles.checkboxText}>
                <strong>Sort Keys</strong>
                <small>Sort object keys alphabetically</small>
              </div>
            </label>
          </div>
        </div>

        <div className={styles.actions}>
          <button onClick={() => validateJson(inputText)} className={styles.validateBtn}>
            Validate & Format
          </button>
          <button onClick={handleClear} className={styles.clearBtn}>
            Clear All
          </button>
        </div>

        {outputText && (
          <div className={styles.outputSection}>
            <h3>Formatted Output</h3>
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
                Download as JSON
              </button>
            </div>
          </div>
        )}

        {isValid && stats.size > 0 && (
          <div className={styles.stats}>
            <h3>JSON Statistics</h3>
            <div className={styles.statsGrid}>
              <div className={styles.stat}>
                <span className={styles.statNumber}>{stats.size}</span>
                <span className={styles.statLabel}>Characters</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>{stats.lines}</span>
                <span className={styles.statLabel}>Lines</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>{stats.keys}</span>
                <span className={styles.statLabel}>Keys</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>{stats.depth}</span>
                <span className={styles.statLabel}>Max Depth</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}