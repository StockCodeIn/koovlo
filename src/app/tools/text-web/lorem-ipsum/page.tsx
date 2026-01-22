'use client';

import { useState } from 'react';
import ToolInfo from '@/components/ToolInfo';
import styles from './loremipsum.module.css';

const loremWords = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
  "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
  "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud",
  "exercitation", "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo",
  "consequat", "duis", "aute", "irure", "reprehenderit", "voluptate", "velit",
  "esse", "cillum", "fugiat", "nulla", "pariatur", "excepteur", "sint", "occaecat",
  "cupidatat", "non", "proident", "sunt", "culpa", "qui", "officia", "deserunt",
  "mollit", "anim", "id", "est", "laborum"
];

export default function LoremIpsumGenerator() {
  const [paragraphs, setParagraphs] = useState(3);
  const [wordsPerParagraph, setWordsPerParagraph] = useState(50);
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [generatedText, setGeneratedText] = useState('');

  const generateLoremIpsum = () => {
    let result = '';

    for (let p = 0; p < paragraphs; p++) {
      let paragraph = '';
      const wordsNeeded = wordsPerParagraph;

      for (let i = 0; i < wordsNeeded; i++) {
        let word = loremWords[Math.floor(Math.random() * loremWords.length)];

        if (i === 0 && startWithLorem) {
          word = word.charAt(0).toUpperCase() + word.slice(1);
        } else if (i === 0) {
          word = word.charAt(0).toUpperCase() + word.slice(1);
        }

        paragraph += word;

        if (i < wordsNeeded - 1) {
          paragraph += ' ';
        } else {
          paragraph += '.';
        }
      }

      result += paragraph;
      if (p < paragraphs - 1) {
        result += '\n\n';
      }
    }

    setGeneratedText(result);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedText);
      alert('Copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const clearText = () => {
    setGeneratedText('');
  };

  return (
    <main className={styles.container}>
      <h1>Lorem Ipsum Generator</h1>
      <p>Generate placeholder text for your designs and layouts.</p>

      <div className={styles.generator}>
        <div className={styles.controls}>
          <h2>Settings</h2>

          <div className={styles.controlGroup}>
            <label>
              Number of Paragraphs:
              <input
                type="number"
                min="1"
                max="20"
                value={paragraphs}
                onChange={(e) => setParagraphs(parseInt(e.target.value) || 1)}
                className={styles.numberInput}
              />
            </label>
          </div>

          <div className={styles.controlGroup}>
            <label>
              Words per Paragraph:
              <input
                type="number"
                min="10"
                max="200"
                value={wordsPerParagraph}
                onChange={(e) => setWordsPerParagraph(parseInt(e.target.value) || 10)}
                className={styles.numberInput}
              />
            </label>
          </div>

          <div className={styles.controlGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={startWithLorem}
                onChange={(e) => setStartWithLorem(e.target.checked)}
                className={styles.checkbox}
              />
              Start with "Lorem ipsum dolor sit amet..."
            </label>
          </div>

          <button onClick={generateLoremIpsum} className={styles.generateBtn}>
            Generate Lorem Ipsum
          </button>
        </div>

        <div className={styles.output}>
          <div className={styles.outputHeader}>
            <h2>Generated Text</h2>
            <div className={styles.outputActions}>
              <button onClick={copyToClipboard} className={styles.actionBtn} disabled={!generatedText}>
                Copy
              </button>
              <button onClick={clearText} className={styles.actionBtn}>
                Clear
              </button>
            </div>
          </div>

          <textarea
            value={generatedText}
            readOnly
            placeholder="Your lorem ipsum text will appear here..."
            className={styles.textarea}
          />
        </div>
      </div>

      <ToolInfo
        howItWorks="Set the number of paragraphs and words per paragraph<br>Choose whether to start with traditional lorem ipsum<br>Click 'Generate Lorem Ipsum'<br>Copy the generated text for your use"
        faqs={[
          { title: "What is Lorem Ipsum?", content: "Lorem Ipsum is placeholder text derived from Cicero's writings, used in design and publishing." },
          { title: "Why use Lorem Ipsum?", content: "It allows designers to focus on layout without being distracted by readable content." },
          { title: "Is it free to use?", content: "Yes, Lorem Ipsum has been the industry's standard dummy text for centuries." },
          { title: "Can I customize it?", content: "Yes, adjust paragraphs, word count, and starting text to fit your needs." }
        ]}
        tips={["Use for website mockups and print layouts<br>Adjust word count based on your content needs<br>Traditional lorem ipsum starts with 'Lorem ipsum dolor sit amet'<br>Generated text is random but readable"]}
      />
    </main>
  );
}