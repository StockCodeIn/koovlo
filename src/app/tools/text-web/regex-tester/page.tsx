'use client';

import { useEffect, useMemo, useState } from 'react';
import styles from './regextester.module.css';
import ToolInfo from '@/components/ToolInfo';

interface HistoryItem {
  id: string;
  pattern: string;
  flags: string;
  testText: string;
  matchCount: number;
  timestamp: number;
}

interface RegexMatch {
  match: string;
  index: number;
  groups: string[];
}

interface StoredState {
  history?: HistoryItem[];
}

const STORAGE_KEY = 'regex-tester-data';
const createId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const getInitialHistory = (): HistoryItem[] => {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];
    const parsed = JSON.parse(saved) as StoredState;
    return parsed.history || [];
  } catch (error) {
    console.error('Error loading regex tester data:', error);
    return [];
  }
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/\n/g, '<br />');

export default function RegexTesterPage() {
  const [regex, setRegex] = useState('');
  const [testText, setTestText] = useState('');
  const [flags, setFlags] = useState({
    global: true,
    caseInsensitive: false,
    multiline: false,
    dotAll: false,
  });
  const [history, setHistory] = useState<HistoryItem[]>(getInitialHistory());

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ history }));
  }, [history]);

  const flagString = useMemo(
    () =>
      `${flags.global ? 'g' : ''}${flags.caseInsensitive ? 'i' : ''}${flags.multiline ? 'm' : ''}${flags.dotAll ? 's' : ''}`,
    [flags]
  );

  const regexResult = useMemo(() => {
    if (!regex) {
      return {
        matches: [] as RegexMatch[],
        highlightedText: escapeHtml(testText),
        errorMessage: '',
      };
    }

    try {
      const expression = new RegExp(regex, flagString);
      const foundMatches: RegexMatch[] = [];

      if (flags.global) {
        for (const match of testText.matchAll(expression)) {
          foundMatches.push({
            match: match[0],
            index: match.index ?? 0,
            groups: match.slice(1).filter((group): group is string => typeof group === 'string'),
          });
        }
      } else {
        const singleMatch = expression.exec(testText);
        if (singleMatch) {
          foundMatches.push({
            match: singleMatch[0],
            index: singleMatch.index,
            groups: singleMatch.slice(1).filter((group): group is string => typeof group === 'string'),
          });
        }
      }

      let cursor = 0;
      const fragments: string[] = [];
      foundMatches.forEach((match) => {
        const start = match.index;
        const end = start + match.match.length;
        fragments.push(escapeHtml(testText.slice(cursor, start)));
        fragments.push(`<mark class="${styles.highlight}">${escapeHtml(match.match)}</mark>`);
        cursor = end;
      });
      fragments.push(escapeHtml(testText.slice(cursor)));

      return {
        matches: foundMatches,
        highlightedText: fragments.join('') || 'Enter text above to see matches...',
        errorMessage: '',
      };
    } catch (caughtError) {
      return {
        matches: [] as RegexMatch[],
        highlightedText: escapeHtml(testText),
        errorMessage: caughtError instanceof Error ? caughtError.message : 'Invalid regex pattern',
      };
    }
  }, [flagString, flags.global, regex, testText]);


  const runTest = () => {
    if (!regex || regexResult.errorMessage) {
      return;
    }

    const nextItem: HistoryItem = {
      id: createId(),
      pattern: regex,
      flags: flagString || 'none',
      testText: testText.slice(0, 100),
      matchCount: regexResult.matches.length,
      timestamp: Date.now(),
    };

    setHistory((previous) => [nextItem, ...previous].slice(0, 50));
  };

  const handleClear = () => {
    setRegex('');
    setTestText('');
  };

  const loadSampleData = () => {
    setRegex('\\b[\\w.-]+@[\\w.-]+\\.\\w+\\b');
    setTestText(`Contact us at:\nsupport@example.com\njohn.doe@gmail.com\ninvalid-email\nadmin@company.co.uk\n\nPhone: (123) 456-7890\nAnother email: test@test-domain.org`);
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
      alert('Regex pattern copied to clipboard.');
    } catch (caughtError) {
      console.error('Failed to copy:', caughtError);
    }
  };

  const copyMatches = async () => {
    const matchesText = regexResult.matches
      .map((match, index) => `Match ${index + 1}: "${match.match}" at position ${match.index}`)
      .join('\n');

    try {
      await navigator.clipboard.writeText(matchesText);
      alert('Matches copied to clipboard.');
    } catch (caughtError) {
      console.error('Failed to copy:', caughtError);
    }
  };

  const deleteHistoryItem = (id: string) => {
    setHistory((previous) => previous.filter((item) => item.id !== id));
  };

  const clearHistory = () => {
    if (confirm('Clear all history?')) {
      setHistory([]);
    }
  };

  const loadFromHistory = (item: HistoryItem) => {
    setRegex(item.pattern);
    setTestText(item.testText);
    setFlags({
      global: item.flags.includes('g'),
      caseInsensitive: item.flags.includes('i'),
      multiline: item.flags.includes('m'),
      dotAll: item.flags.includes('s'),
    });
  };

  const analytics = useMemo(() => {
    const totalTests = history.length;
    const totalMatches = history.reduce((sum, item) => sum + item.matchCount, 0);
    const avgMatches = totalTests > 0 ? Math.round((totalMatches / totalTests) * 10) / 10 : 0;
    const uniquePatterns = new Set(history.map((item) => item.pattern)).size;
    return { totalTests, totalMatches, avgMatches, uniquePatterns };
  }, [history]);

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>
        <span className={styles.icon}>Regex</span>
        <span className={styles.textGradient}>Regex Tester</span>
      </h1>
      <p className={styles.subtitle}>Test and visualize regular expressions with live matching and readable history.</p>

      <div className={styles.tool}>
        <div className={styles.regexSection}>
          <div className={styles.regexHeader}>
            <h3>Regular Expression</h3>
            <button onClick={loadSampleData} className={styles.sampleBtn}>Load Sample</button>
          </div>

          <div className={styles.regexInput}>
            <input
              type="text"
              value={regex}
              onChange={(event) => setRegex(event.target.value)}
              placeholder="Enter regex pattern (e.g., \\b\\w+@\\w+\\.\\w+\\b)"
              className={styles.regexField}
            />
            <button onClick={copyRegex} className={styles.copyRegexBtn}>Copy</button>
          </div>

          {regexResult.errorMessage && <div className={styles.error}>Error: {regexResult.errorMessage}</div>}

          <div className={styles.flagsSection}>
            <h4>Flags</h4>
            <div className={styles.flagsGrid}>
              <label className={styles.flagOption}>
                <input type="checkbox" checked={flags.global} onChange={(event) => setFlags((previous) => ({ ...previous, global: event.target.checked }))} className={styles.checkbox} />
                <div className={styles.flagText}>
                  <strong>Global (g)</strong>
                  <small>Find all matches</small>
                </div>
              </label>

              <label className={styles.flagOption}>
                <input type="checkbox" checked={flags.caseInsensitive} onChange={(event) => setFlags((previous) => ({ ...previous, caseInsensitive: event.target.checked }))} className={styles.checkbox} />
                <div className={styles.flagText}>
                  <strong>Case Insensitive (i)</strong>
                  <small>Ignore case</small>
                </div>
              </label>

              <label className={styles.flagOption}>
                <input type="checkbox" checked={flags.multiline} onChange={(event) => setFlags((previous) => ({ ...previous, multiline: event.target.checked }))} className={styles.checkbox} />
                <div className={styles.flagText}>
                  <strong>Multiline (m)</strong>
                  <small>Caret and dollar match line boundaries</small>
                </div>
              </label>

              <label className={styles.flagOption}>
                <input type="checkbox" checked={flags.dotAll} onChange={(event) => setFlags((previous) => ({ ...previous, dotAll: event.target.checked }))} className={styles.checkbox} />
                <div className={styles.flagText}>
                  <strong>Dot All (s)</strong>
                  <small>Dot matches new lines</small>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className={styles.testSection}>
          <h3>Test Text</h3>
          <textarea value={testText} onChange={(event) => setTestText(event.target.value)} placeholder="Enter text to test regex against..." className={styles.testTextarea} />
        </div>

        <div className={styles.actions}>
          <button onClick={runTest} className={styles.copyMatchesBtn} disabled={!regex || !!regexResult.errorMessage}>Save Test</button>
          <button onClick={handleClear} className={styles.clearBtn}>Clear All</button>
        </div>

        <div className={styles.resultsSection}>
          <div className={styles.highlightedText}>
            <h3>Highlighted Matches</h3>
            <div className={styles.textDisplay} dangerouslySetInnerHTML={{ __html: regexResult.highlightedText || 'Enter text above to see matches...' }} />
          </div>

          <div className={styles.matchesList}>
            <div className={styles.matchesHeader}>
              <h3>Matches ({regexResult.matches.length})</h3>
              {regexResult.matches.length > 0 && <button onClick={copyMatches} className={styles.copyMatchesBtn}>Copy Matches</button>}
            </div>

            {regexResult.matches.length > 0 ? (
              <div className={styles.matches}>
                {regexResult.matches.map((match, index) => (
                  <div key={`${match.index}-${index}`} className={styles.match}>
                    <div className={styles.matchHeader}>
                      <strong>Match {index + 1}</strong>
                      <span className={styles.matchPosition}>Position: {match.index}</span>
                    </div>
                    <div className={styles.matchContent}>
                      <code>&quot;{match.match}&quot;</code>
                    </div>
                    {match.groups.length > 0 && (
                      <div className={styles.matchGroups}>
                        <small>Groups: {match.groups.map((group, groupIndex) => `$${groupIndex + 1}=&quot;${group}&quot;`).join(', ')}</small>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.noMatches}>No matches found</div>
            )}
          </div>
        </div>
      </div>

      {history.length > 0 && (
        <div className={styles.smartDashboard}>
          <h3>Analytics</h3>
          <div className={styles.analyticsGrid}>
            <div className={styles.statCard}>
              <span className={styles.statValue}>{analytics.totalTests}</span>
              <span className={styles.statLabel}>Total Tests</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statValue}>{analytics.uniquePatterns}</span>
              <span className={styles.statLabel}>Unique Patterns</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statValue}>{analytics.totalMatches}</span>
              <span className={styles.statLabel}>Total Matches</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statValue}>{analytics.avgMatches}</span>
              <span className={styles.statLabel}>Avg Matches/Test</span>
            </div>
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div className={styles.historySection}>
          <div className={styles.historyHeader}>
            <h3>Test History</h3>
            <button onClick={clearHistory} className={styles.clearBtn}>Clear History</button>
          </div>
          <div className={styles.historyList}>
            {history.map((item) => (
              <div key={item.id} className={styles.historyItem}>
                <div className={styles.historyText}>
                  <div className={styles.historyMeta}>
                    <span className={styles.historyPattern}>Pattern: <code>{item.pattern}</code></span>
                    <span className={styles.historyFlags}>Flags: {item.flags}</span>
                    <span className={styles.historyMatches}>Matches: {item.matchCount}</span>
                    <span className={styles.historyTime}>{new Date(item.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <div className={styles.historyContent}>Text: {item.testText.slice(0, 60)}{item.testText.length > 60 ? '...' : ''}</div>
                </div>
                <div className={styles.historyActions}>
                  <button onClick={() => loadFromHistory(item)} className={styles.historyBtn} title="Load this test">Load</button>
                  <button onClick={() => deleteHistoryItem(item.id)} className={styles.historyBtn} title="Delete">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <ToolInfo
        howItWorks="Enter a regex pattern and test text<br>Choose the flags you want to apply<br>Review highlighted matches and captured groups instantly<br>Save useful tests to your local browser history"
        faqs={[
          { title: 'What is a regex?', content: 'A regular expression is a pattern used for searching, validating, and extracting text.' },
          { title: 'What do regex flags do?', content: 'Flags control how matching behaves, such as finding all matches, ignoring case, or treating input as multiline text.' },
          { title: 'How do capture groups work?', content: 'Parentheses create groups so you can isolate parts of a match, and the results appear as $1, $2, and so on.' },
          { title: 'Does this store my text online?', content: 'No. Recent test history is saved only in your browser.' },
        ]}
        tips={[
          'Start with a simple pattern, then add anchors or groups once the base match works.',
          'Global mode is best when you want every match in long content blocks.',
          'Use sample data to check that your flags and capture groups behave as expected.',
        ]}
      />
    </div>
  );
}

