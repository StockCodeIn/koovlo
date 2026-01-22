'use client';

import { useState } from 'react';
import ToolInfo from '@/components/ToolInfo';
import styles from './jsonformatter.module.css';

export default function JSONFormatter() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [error, setError] = useState('');
  const [indentSize, setIndentSize] = useState(2);

  const formatJSON = () => {
    try {
      const parsed = JSON.parse(inputText);
      const formatted = JSON.stringify(parsed, null, indentSize);
      setOutputText(formatted);
      setError('');
    } catch (err) {
      setError('Invalid JSON: ' + (err as Error).message);
      setOutputText('');
    }
  };

  const minifyJSON = () => {
    try {
      const parsed = JSON.parse(inputText);
      const minified = JSON.stringify(parsed);
      setOutputText(minified);
      setError('');
    } catch (err) {
      setError('Invalid JSON: ' + (err as Error).message);
      setOutputText('');
    }
  };

  const validateJSON = () => {
    try {
      JSON.parse(inputText);
      setError('');
      alert('Valid JSON!');
    } catch (err) {
      setError('Invalid JSON: ' + (err as Error).message);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(outputText);
      alert('Copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const clearAll = () => {
    setInputText('');
    setOutputText('');
    setError('');
  };

  const loadSample = () => {
    const sample = {
      name: "John Doe",
      age: 30,
      email: "john@example.com",
      address: {
        street: "123 Main St",
        city: "Anytown",
        zipCode: "12345"
      },
      hobbies: ["reading", "coding", "gaming"],
      active: true
    };
    setInputText(JSON.stringify(sample, null, 2));
  };

  return (
    <main className={styles.container}>
      <h1>JSON Formatter</h1>
      <p>Format, validate, and minify JSON data with ease.</p>

      <div className={styles.formatter}>
        <div className={styles.inputSection}>
          <div className={styles.inputHeader}>
            <h2>Input JSON</h2>
            <button onClick={loadSample} className={styles.sampleBtn}>
              Load Sample
            </button>
          </div>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste your JSON here..."
            className={styles.textarea}
          />
        </div>

        <div className={styles.controls}>
          <h2>Actions</h2>
          <div className={styles.controlGroup}>
            <label>
              Indent Size:
              <select
                value={indentSize}
                onChange={(e) => setIndentSize(Number(e.target.value))}
                className={styles.indentSelect}
              >
                <option value={2}>2 spaces</option>
                <option value={4}>4 spaces</option>
                <option value={1}>1 tab</option>
              </select>
            </label>
          </div>

          <div className={styles.buttonGroup}>
            <button onClick={formatJSON} className={styles.actionBtn}>
              Format JSON
            </button>
            <button onClick={minifyJSON} className={styles.actionBtn}>
              Minify JSON
            </button>
            <button onClick={validateJSON} className={styles.actionBtn}>
              Validate JSON
            </button>
          </div>
        </div>

        <div className={styles.outputSection}>
          <h2>Output</h2>
          {error && <div className={styles.error}>{error}</div>}
          <textarea
            value={outputText}
            readOnly
            placeholder="Formatted JSON will appear here..."
            className={`${styles.textarea} ${error ? styles.errorTextarea : ''}`}
          />
          <div className={styles.outputActions}>
            <button onClick={copyToClipboard} className={styles.actionBtn} disabled={!outputText}>
              Copy to Clipboard
            </button>
            <button onClick={clearAll} className={styles.actionBtn}>
              Clear All
            </button>
          </div>
        </div>
      </div>

      <ToolInfo
        howItWorks="Paste or type your JSON in the input area<br>Choose indent size (2 spaces, 4 spaces, or tab)<br>Click 'Format JSON' to pretty-print with indentation<br>Click 'Minify JSON' to compress to single line<br>Click 'Validate JSON' to check syntax<br>Copy the result or clear to start over"
        faqs={[
          { title: "What is JSON?", content: "JavaScript Object Notation - a lightweight data format" },
          { title: "Why format JSON?", content: "Makes it human-readable with proper indentation" },
          { title: "Why minify JSON?", content: "Reduces file size for production use" },
          { title: "What if JSON is invalid?", content: "Error message will show the specific issue" }
        ]}
        tips={["Use for API responses, configuration files, or data exchange", "2 spaces is most common for web development", "Minified JSON loads faster but is harder to read", "Always validate before using formatted JSON"]}
      />
    </main>
  );
}