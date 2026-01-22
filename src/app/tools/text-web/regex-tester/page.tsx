'use client';

import { useState, useEffect } from 'react';
import styles from './regextester.module.css';

export default function RegexTesterPage() {
  const [regex, setRegex] = useState('');
  const [testText, setTestText] = useState('');
  const [flags, setFlags] = useState({
    global: true,
    caseInsensitive: false,
    multiline: false,
    dotAll: false,
  });
  const [matches, setMatches] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [highlightedText, setHighlightedText] = useState('');

  const testRegex = () => {
    if (!regex) {
      setMatches([]);
      setError('');
      setHighlightedText(testText);
      return;
    }

    try {
      const flagString = (flags.global ? 'g' : '') +
                        (flags.caseInsensitive ? 'i' : '') +
                        (flags.multiline ? 'm' : '') +
                        (flags.dotAll ? 's' : '');

      const regexObj = new RegExp(regex, flagString);
      const foundMatches = [];
      let match;

      // Reset lastIndex for global regex
      regexObj.lastIndex = 0;

      while ((match = regexObj.exec(testText)) !== null) {
        foundMatches.push({
          match: match[0],
          index: match.index,
          groups: match.slice(1),
          fullMatch: match,
        });

        // Prevent infinite loop for non-global regex
        if (!flags.global) break;
      }

      setMatches(foundMatches);
      setError('');

      // Create highlighted text
      if (foundMatches.length > 0) {
        let highlighted = testText;
        let offset = 0;

        foundMatches.forEach((m, idx) => {
          const start = m.index + offset;
          const end = start + m.match.length;
          const before = highlighted.slice(0, start);
          const matchText = highlighted.slice(start, end);
          const after = highlighted.slice(end);

          highlighted = `${before}<mark class="${styles.highlight}">${matchText}</mark>${after}`;
          offset += `<mark class="${styles.highlight}"></mark>`.length;
        });

        setHighlightedText(highlighted);
      } else {
        setHighlightedText(testText);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid regex pattern');
      setMatches([]);
      setHighlightedText(testText);
    }
  };

  useEffect(() => {
    testRegex();
  }, [regex, testText, flags]);

  const handleClear = () => {
    setRegex('');
    setTestText('');
    setMatches([]);
    setError('');
    setHighlightedText('');
  };

  const loadSampleData = () => {
    setRegex('\\b\\w+@\\w+\\.\\w+\\b');
    setTestText(`Contact us at:
support@example.com
john.doe@gmail.com
invalid-email
admin@company.co.uk

Phone: (123) 456-7890
Another email: test@test-domain.org`);
    setFlags({
      global: true,
      caseInsensitive: true,
      multiline: true,
      dotAll: false,
    });
  };

  const copyRegex = async () => {
    try {
      await navigator.clipboard.writeText(regex);
      alert('Regex pattern copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const copyMatches = async () => {
    const matchesText = matches.map((m, idx) =>
      `Match ${idx + 1}: "${m.match}" at position ${m.index}`
    ).join('\n');
    try {
      await navigator.clipboard.writeText(matchesText);
      alert('Matches copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.tool}>
        <div className={styles.regexSection}>
          <div className={styles.regexHeader}>
            <h3>Regular Expression</h3>
            <button onClick={loadSampleData} className={styles.sampleBtn}>
              Load Sample
            </button>
          </div>

          <div className={styles.regexInput}>
            <input
              type="text"
              value={regex}
              onChange={(e) => setRegex(e.target.value)}
              placeholder="Enter regex pattern (e.g., \b\w+@\w+\.\w+\b)"
              className={styles.regexField}
            />
            <button onClick={copyRegex} className={styles.copyRegexBtn}>
              Copy
            </button>
          </div>

          {error && (
            <div className={styles.error}>
              ❌ {error}
            </div>
          )}

          <div className={styles.flagsSection}>
            <h4>Flags</h4>
            <div className={styles.flagsGrid}>
              <label className={styles.flagOption}>
                <input
                  type="checkbox"
                  checked={flags.global}
                  onChange={(e) => setFlags(prev => ({ ...prev, global: e.target.checked }))}
                  className={styles.checkbox}
                />
                <div className={styles.flagText}>
                  <strong>Global (g)</strong>
                  <small>Find all matches</small>
                </div>
              </label>

              <label className={styles.flagOption}>
                <input
                  type="checkbox"
                  checked={flags.caseInsensitive}
                  onChange={(e) => setFlags(prev => ({ ...prev, caseInsensitive: e.target.checked }))}
                  className={styles.checkbox}
                />
                <div className={styles.flagText}>
                  <strong>Case Insensitive (i)</strong>
                  <small>Ignore case</small>
                </div>
              </label>

              <label className={styles.flagOption}>
                <input
                  type="checkbox"
                  checked={flags.multiline}
                  onChange={(e) => setFlags(prev => ({ ...prev, multiline: e.target.checked }))}
                  className={styles.checkbox}
                />
                <div className={styles.flagText}>
                  <strong>Multiline (m)</strong>
                  <small>^ and $ match line starts/ends</small>
                </div>
              </label>

              <label className={styles.flagOption}>
                <input
                  type="checkbox"
                  checked={flags.dotAll}
                  onChange={(e) => setFlags(prev => ({ ...prev, dotAll: e.target.checked }))}
                  className={styles.checkbox}
                />
                <div className={styles.flagText}>
                  <strong>Dot All (s)</strong>
                  <small>. matches newlines</small>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className={styles.testSection}>
          <h3>Test Text</h3>
          <textarea
            value={testText}
            onChange={(e) => setTestText(e.target.value)}
            placeholder="Enter text to test regex against..."
            className={styles.testTextarea}
          />
        </div>

        <div className={styles.actions}>
          <button onClick={handleClear} className={styles.clearBtn}>
            Clear All
          </button>
        </div>

        <div className={styles.resultsSection}>
          <div className={styles.highlightedText}>
            <h3>Highlighted Matches</h3>
            <div
              className={styles.textDisplay}
              dangerouslySetInnerHTML={{ __html: highlightedText || testText || 'Enter text above to see matches...' }}
            />
          </div>

          <div className={styles.matchesList}>
            <div className={styles.matchesHeader}>
              <h3>Matches ({matches.length})</h3>
              {matches.length > 0 && (
                <button onClick={copyMatches} className={styles.copyMatchesBtn}>
                  Copy Matches
                </button>
              )}
            </div>

            {matches.length > 0 ? (
              <div className={styles.matches}>
                {matches.map((match, idx) => (
                  <div key={idx} className={styles.match}>
                    <div className={styles.matchHeader}>
                      <strong>Match {idx + 1}</strong>
                      <span className={styles.matchPosition}>Position: {match.index}</span>
                    </div>
                    <div className={styles.matchContent}>
                      <code>"{match.match}"</code>
                    </div>
                    {match.groups.length > 0 && (
                      <div className={styles.matchGroups}>
                        <small>Groups: {match.groups.map((g: string, i: number) => `$${i + 1}="${g}"`).join(', ')}</small>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.noMatches}>
                No matches found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}