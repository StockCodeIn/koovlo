'use client';

import { useState } from 'react';
import ToolInfo from '@/components/ToolInfo';
import styles from './caseconverter.module.css';

export default function CaseConverter() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');

  const convertCase = (type: string) => {
    let result = '';
    switch (type) {
      case 'uppercase':
        result = inputText.toUpperCase();
        break;
      case 'lowercase':
        result = inputText.toLowerCase();
        break;
      case 'titlecase':
        result = inputText.replace(/\w\S*/g, (txt) =>
          txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        );
        break;
      case 'sentencecase':
        result = inputText.charAt(0).toUpperCase() + inputText.slice(1).toLowerCase();
        break;
      case 'camelcase':
        result = inputText
          .toLowerCase()
          .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
        break;
      case 'snakecase':
        result = inputText
          .replace(/\W+/g, ' ')
          .split(/ |\B(?=[A-Z])/)
          .map(word => word.toLowerCase())
          .join('_');
        break;
      case 'kebabcase':
        result = inputText
          .replace(/\W+/g, ' ')
          .split(/ |\B(?=[A-Z])/)
          .map(word => word.toLowerCase())
          .join('-');
        break;
      case 'alternating':
        result = inputText
          .split('')
          .map((char, index) =>
            index % 2 === 0 ? char.toUpperCase() : char.toLowerCase()
          )
          .join('');
        break;
      case 'inverse':
        result = inputText
          .split('')
          .map(char =>
            char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase()
          )
          .join('');
        break;
      default:
        result = inputText;
    }
    setOutputText(result);
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
  };

  return (
    <main className={styles.container}>
      <h1>Case Converter</h1>
      <p>Convert text between different case styles instantly.</p>

      <div className={styles.converter}>
        <div className={styles.inputSection}>
          <h2>Input Text</h2>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter your text here..."
            className={styles.textarea}
          />
        </div>

        <div className={styles.controls}>
          <h2>Convert To</h2>
          <div className={styles.buttonGrid}>
            <button onClick={() => convertCase('uppercase')} className={styles.convertBtn}>
              UPPERCASE
            </button>
            <button onClick={() => convertCase('lowercase')} className={styles.convertBtn}>
              lowercase
            </button>
            <button onClick={() => convertCase('titlecase')} className={styles.convertBtn}>
              Title Case
            </button>
            <button onClick={() => convertCase('sentencecase')} className={styles.convertBtn}>
              Sentence case
            </button>
            <button onClick={() => convertCase('camelcase')} className={styles.convertBtn}>
              camelCase
            </button>
            <button onClick={() => convertCase('snakecase')} className={styles.convertBtn}>
              snake_case
            </button>
            <button onClick={() => convertCase('kebabcase')} className={styles.convertBtn}>
              kebab-case
            </button>
            <button onClick={() => convertCase('alternating')} className={styles.convertBtn}>
              AlTeRnAtInG
            </button>
            <button onClick={() => convertCase('inverse')} className={styles.convertBtn}>
              iNvErSe
            </button>
          </div>
        </div>

        <div className={styles.outputSection}>
          <h2>Output Text</h2>
          <textarea
            value={outputText}
            readOnly
            placeholder="Converted text will appear here..."
            className={styles.textarea}
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
        howItWorks="Enter or paste your text in the input area<br>Choose the desired case conversion from the options<br>View the converted text in the output area<br>Copy the result or clear to start over"
        faqs={[
          { title: "What is Title Case?", content: "First letter of each word is capitalized" },
          { title: "What is camelCase?", content: "Used in programming, first word lowercase, subsequent words capitalized" },
          { title: "What is snake_case?", content: "Words separated by underscores, all lowercase" },
          { title: "What is kebab-case?", content: "Words separated by hyphens, all lowercase" }
        ]}
        tips={["Useful for formatting code, titles, or following style guides", "Alternating case can be used for emphasis or fun text", "Inverse case flips uppercase to lowercase and vice versa"]}
      />
    </main>
  );
}