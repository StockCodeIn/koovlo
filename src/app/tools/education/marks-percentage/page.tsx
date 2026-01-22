'use client';

import { useState } from 'react';
import ToolInfo from '@/components/ToolInfo';
import styles from '../education-layout.module.css';

export default function MarksToPercentage() {
  const [obtainedMarks, setObtainedMarks] = useState('');
  const [totalMarks, setTotalMarks] = useState('');
  const [percentage, setPercentage] = useState<number | null>(null);
  const [grade, setGrade] = useState('');

  const calculatePercentage = () => {
    const obtained = parseFloat(obtainedMarks);
    const total = parseFloat(totalMarks);

    if (isNaN(obtained) || isNaN(total) || total === 0) {
      alert('Please enter valid numbers');
      return;
    }

    if (obtained > total) {
      alert('Obtained marks cannot be greater than total marks');
      return;
    }

    const calculatedPercentage = (obtained / total) * 100;
    setPercentage(Math.round(calculatedPercentage * 100) / 100);

    // Calculate grade
    let calculatedGrade = '';
    if (calculatedPercentage >= 90) calculatedGrade = 'A+';
    else if (calculatedPercentage >= 80) calculatedGrade = 'A';
    else if (calculatedPercentage >= 70) calculatedGrade = 'B+';
    else if (calculatedPercentage >= 60) calculatedGrade = 'B';
    else if (calculatedPercentage >= 50) calculatedGrade = 'C+';
    else if (calculatedPercentage >= 40) calculatedGrade = 'C';
    else if (calculatedPercentage >= 33) calculatedGrade = 'D';
    else calculatedGrade = 'F';

    setGrade(calculatedGrade);
  };

  const clearAll = () => {
    setObtainedMarks('');
    setTotalMarks('');
    setPercentage(null);
    setGrade('');
  };

  return (
    <main className={styles.container}>
      <h1>Marks to Percentage Calculator</h1>
      <p>Convert your marks to percentage and get your grade</p>

      <div className={styles.calculator}>
        <div className={styles.inputSection}>
          <h2>Enter Your Marks</h2>

          <div className={styles.inputGroup}>
            <label htmlFor="obtained">Obtained Marks:</label>
            <input
              id="obtained"
              type="number"
              value={obtainedMarks}
              onChange={(e) => setObtainedMarks(e.target.value)}
              placeholder="e.g., 85"
              min="0"
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="total">Total Marks:</label>
            <input
              id="total"
              type="number"
              value={totalMarks}
              onChange={(e) => setTotalMarks(e.target.value)}
              placeholder="e.g., 100"
              min="1"
              className={styles.input}
            />
          </div>

          <div className={styles.buttonGroup}>
            <button onClick={calculatePercentage} className={styles.calculateBtn}>
              Calculate Percentage
            </button>
            <button onClick={clearAll} className={styles.clearBtn}>
              Clear All
            </button>
          </div>
        </div>

        <div className={styles.resultSection}>
          <h2>Your Result</h2>

          {percentage !== null ? (
            <div className={styles.result}>
              <div className={styles.percentageDisplay}>
                <span className={styles.percentageValue}>{percentage}%</span>
                <span className={styles.percentageLabel}>Percentage</span>
              </div>

              <div className={styles.gradeDisplay}>
                <span className={styles.gradeLabel}>Grade:</span>
                <span className={styles.gradeValue}>{grade}</span>
              </div>

              <div className={styles.details}>
                <p><strong>Obtained Marks:</strong> {obtainedMarks}</p>
                <p><strong>Total Marks:</strong> {totalMarks}</p>
                <p><strong>Formula:</strong> ({obtainedMarks} ÷ {totalMarks}) × 100 = {percentage}%</p>
              </div>
            </div>
          ) : (
            <div className={styles.placeholder}>
              <p>📊 Enter your marks and click "Calculate Percentage" to see results</p>
            </div>
          )}
        </div>
      </div>

      <ToolInfo
        howItWorks="Enter your obtained marks<br>Enter the total marks<br>Click 'Calculate Percentage'<br>View your percentage and grade"
        faqs={[
          { title: "How is percentage calculated?", content: "Percentage = (Obtained Marks ÷ Total Marks) × 100" },
          { title: "What grading scale is used?", content: "90%+ = A+, 80%+ = A, 70%+ = B+, 60%+ = B, 50%+ = C+, 40%+ = C, 33%+ = D, Below 33% = F" },
          { title: "Can I use decimal marks?", content: "Yes, the calculator supports decimal values for precise calculations." },
          { title: "Is this grading scale standard?", content: "This is a common grading scale. Your institution may use different criteria." }
        ]}
        tips={["Ensure you enter the correct total marks",
          "Use this for exam results, assignments, or quizzes",
          "Grading scale may vary by institution",
          "Save your results for record keeping"]}
      />
    </main>
  );
}