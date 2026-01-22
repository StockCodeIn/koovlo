'use client';

import { useState } from 'react';
import styles from './average.module.css';

export default function AveragePage() {
  const [inputNumbers, setInputNumbers] = useState('');
  const [results, setResults] = useState({
    numbers: [] as number[],
    count: 0,
    sum: 0,
    mean: 0,
    median: 0,
    mode: [] as number[],
    range: 0,
    min: 0,
    max: 0,
    standardDeviation: 0,
    variance: 0,
  });
  const [error, setError] = useState('');

  const calculateAverage = () => {
    const input = inputNumbers.trim();
    if (!input) {
      setError('Please enter some numbers');
      return;
    }

    // Parse numbers from input (comma, space, or newline separated)
    const numberStrings = input.split(/[,;\s\n]+/).filter(s => s.trim() !== '');
    const numbers: number[] = [];

    for (const str of numberStrings) {
      const num = parseFloat(str.trim());
      if (isNaN(num)) {
        setError(`Invalid number: "${str}". Please enter valid numbers only.`);
        return;
      }
      numbers.push(num);
    }

    if (numbers.length === 0) {
      setError('No valid numbers found');
      return;
    }

    setError('');

    // Calculate statistics
    const count = numbers.length;
    const sum = numbers.reduce((a, b) => a + b, 0);
    const mean = sum / count;

    // Sort for median and other calculations
    const sorted = [...numbers].sort((a, b) => a - b);
    const median = count % 2 === 0
      ? (sorted[count / 2 - 1] + sorted[count / 2]) / 2
      : sorted[Math.floor(count / 2)];

    // Calculate mode
    const frequency: { [key: number]: number } = {};
    numbers.forEach(num => {
      frequency[num] = (frequency[num] || 0) + 1;
    });

    const maxFreq = Math.max(...Object.values(frequency));
    const mode = Object.keys(frequency)
      .filter(key => frequency[Number(key)] === maxFreq)
      .map(Number);

    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    const range = max - min;

    // Calculate variance and standard deviation
    const squaredDiffs = numbers.map(num => Math.pow(num - mean, 2));
    const variance = squaredDiffs.reduce((a, b) => a + b, 0) / count;
    const standardDeviation = Math.sqrt(variance);

    setResults({
      numbers,
      count,
      sum,
      mean,
      median,
      mode,
      range,
      min,
      max,
      standardDeviation,
      variance,
    });
  };

  const handleClear = () => {
    setInputNumbers('');
    setResults({
      numbers: [],
      count: 0,
      sum: 0,
      mean: 0,
      median: 0,
      mode: [],
      range: 0,
      min: 0,
      max: 0,
      standardDeviation: 0,
      variance: 0,
    });
    setError('');
  };

  const loadSampleData = () => {
    setInputNumbers('85, 92, 78, 96, 88, 91, 83, 89, 94, 87');
  };

  const copyResults = async () => {
    const resultsText = `Statistical Analysis Results:

Count: ${results.count}
Sum: ${results.sum.toFixed(2)}
Mean (Average): ${results.mean.toFixed(2)}
Median: ${results.median.toFixed(2)}
Mode: ${results.mode.join(', ')}
Range: ${results.range.toFixed(2)}
Minimum: ${results.min.toFixed(2)}
Maximum: ${results.max.toFixed(2)}
Standard Deviation: ${results.standardDeviation.toFixed(2)}
Variance: ${results.variance.toFixed(2)}

Numbers: ${results.numbers.join(', ')}`;

    try {
      await navigator.clipboard.writeText(resultsText);
      alert('Results copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.tool}>
        <div className={styles.inputSection}>
          <div className={styles.inputHeader}>
            <h3>Enter Numbers</h3>
            <button onClick={loadSampleData} className={styles.sampleBtn}>
              Load Sample
            </button>
          </div>
          <textarea
            value={inputNumbers}
            onChange={(e) => setInputNumbers(e.target.value)}
            placeholder="Enter numbers separated by commas, spaces, or new lines (e.g., 85, 92, 78, 96, 88)"
            className={styles.textarea}
          />
          <div className={styles.inputHelp}>
            <small>You can separate numbers with commas, spaces, semicolons, or new lines</small>
          </div>
        </div>

        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}

        <div className={styles.actions}>
          <button onClick={calculateAverage} className={styles.calculateBtn}>
            Calculate Statistics
          </button>
          <button onClick={handleClear} className={styles.clearBtn}>
            Clear All
          </button>
        </div>

        {results.count > 0 && (
          <div className={styles.resultsSection}>
            <div className={styles.resultsHeader}>
              <h3>Statistical Results</h3>
              <button onClick={copyResults} className={styles.copyBtn}>
                Copy Results
              </button>
            </div>

            <div className={styles.statsGrid}>
              <div className={styles.statGroup}>
                <h4>Basic Statistics</h4>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>Count:</span>
                  <span className={styles.statValue}>{results.count}</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>Sum:</span>
                  <span className={styles.statValue}>{results.sum.toFixed(2)}</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>Mean (Average):</span>
                  <span className={styles.statValue}>{results.mean.toFixed(2)}</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>Median:</span>
                  <span className={styles.statValue}>{results.median.toFixed(2)}</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>Mode:</span>
                  <span className={styles.statValue}>{results.mode.join(', ')}</span>
                </div>
              </div>

              <div className={styles.statGroup}>
                <h4>Range & Spread</h4>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>Minimum:</span>
                  <span className={styles.statValue}>{results.min.toFixed(2)}</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>Maximum:</span>
                  <span className={styles.statValue}>{results.max.toFixed(2)}</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>Range:</span>
                  <span className={styles.statValue}>{results.range.toFixed(2)}</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>Standard Deviation:</span>
                  <span className={styles.statValue}>{results.standardDeviation.toFixed(2)}</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>Variance:</span>
                  <span className={styles.statValue}>{results.variance.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className={styles.numbersList}>
              <h4>Input Numbers ({results.numbers.length})</h4>
              <div className={styles.numbers}>
                {results.numbers.map((num, idx) => (
                  <span key={idx} className={styles.number}>
                    {num}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className={styles.infoSection}>
          <h4>About Average Calculator</h4>
          <p>This tool calculates comprehensive statistics for a set of numbers:</p>
          <ul>
            <li><strong>Mean:</strong> The average of all numbers</li>
            <li><strong>Median:</strong> The middle value when numbers are sorted</li>
            <li><strong>Mode:</strong> The most frequently occurring number(s)</li>
            <li><strong>Range:</strong> The difference between max and min values</li>
            <li><strong>Standard Deviation:</strong> Measures the spread of numbers around the mean</li>
          </ul>
          <p>Perfect for students, researchers, and anyone working with numerical data!</p>
        </div>
      </div>
    </div>
  );
}