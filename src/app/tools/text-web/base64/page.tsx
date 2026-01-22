'use client';

import { useState } from 'react';
import ToolInfo from '@/components/ToolInfo';
import styles from './base64.module.css';

export default function Base64Tool() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [error, setError] = useState('');

  const encodeToBase64 = () => {
    try {
      const encoded = btoa(inputText);
      setOutputText(encoded);
      setError('');
    } catch (err) {
      setError('Failed to encode: ' + (err as Error).message);
    }
  };

  const decodeFromBase64 = () => {
    try {
      const decoded = atob(inputText);
      setOutputText(decoded);
      setError('');
    } catch (err) {
      setError('Invalid Base64 string: ' + (err as Error).message);
    }
  };

  const handleConvert = () => {
    if (mode === 'encode') {
      encodeToBase64();
    } else {
      decodeFromBase64();
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
    if (mode === 'encode') {
      setInputText('Hello, World!');
    } else {
      setInputText('SGVsbG8sIFdvcmxkIQ==');
    }
  };

  return (
    <main className={styles.container}>
      <h1>Base64 Encoder/Decoder</h1>
      <p>Encode text to Base64 or decode Base64 back to text.</p>

      <div className={styles.converter}>
        <div className={styles.inputSection}>
          <div className={styles.inputHeader}>
            <h2>Input {mode === 'encode' ? 'Text' : 'Base64'}</h2>
            <button onClick={loadSample} className={styles.sampleBtn}>
              Load Sample
            </button>
          </div>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={mode === 'encode' ? "Enter text to encode..." : "Enter Base64 to decode..."}
            className={styles.textarea}
          />
        </div>

        <div className={styles.controls}>
          <h2>Mode</h2>
          <div className={styles.modeSelector}>
            <button
              onClick={() => setMode('encode')}
              className={`${styles.modeBtn} ${mode === 'encode' ? styles.active : ''}`}
            >
              Encode to Base64
            </button>
            <button
              onClick={() => setMode('decode')}
              className={`${styles.modeBtn} ${mode === 'decode' ? styles.active : ''}`}
            >
              Decode from Base64
            </button>
          </div>

          <button onClick={handleConvert} className={styles.convertBtn} disabled={!inputText}>
            {mode === 'encode' ? 'Encode' : 'Decode'}
          </button>
        </div>

        <div className={styles.outputSection}>
          <h2>Output {mode === 'encode' ? 'Base64' : 'Text'}</h2>
          {error && <div className={styles.error}>{error}</div>}
          <textarea
            value={outputText}
            readOnly
            placeholder={mode === 'encode' ? "Base64 will appear here..." : "Decoded text will appear here..."}
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
        howItWorks="Choose encode or decode mode<br>Enter your text or Base64 string<br>Click the convert button<br>Copy the result or clear to start over"
        faqs={[
          { title: "What is Base64?", content: "Base64 is a binary-to-text encoding scheme that represents binary data in an ASCII string format" },
          { title: "When to use Base64?", content: "For encoding binary data in text formats like JSON, XML, or email attachments" },
          { title: "Is Base64 secure?", content: "No, Base64 is encoding, not encryption. Anyone can decode it." },
          { title: "What characters are used?", content: "A-Z, a-z, 0-9, +, /, and = for padding" }
        ]}
        tips={["Use for embedding images in HTML/CSS", "Useful for API data transmission", "Base64 increases data size by ~33%", "Always validate input before decoding"]}
      />
    </main>
  );
}