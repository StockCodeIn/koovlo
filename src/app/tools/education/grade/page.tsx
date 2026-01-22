'use client';

import { useState } from 'react';
import styles from './grade.module.css';

interface Subject {
  id: number;
  name: string;
  marks: number;
  maxMarks: number;
  weight: number;
}

export default function GradePage() {
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: 1, name: 'Subject 1', marks: 0, maxMarks: 100, weight: 1 },
  ]);
  const [gradingScale, setGradingScale] = useState<'percentage' | 'letter' | 'gpa'>('percentage');
  const [results, setResults] = useState({
    totalMarks: 0,
    totalMaxMarks: 0,
    percentage: 0,
    weightedPercentage: 0,
    letterGrade: '',
    gpa: 0,
  });

  const addSubject = () => {
    const newId = Math.max(...subjects.map(s => s.id)) + 1;
    setSubjects([...subjects, {
      id: newId,
      name: `Subject ${newId}`,
      marks: 0,
      maxMarks: 100,
      weight: 1,
    }]);
  };

  const removeSubject = (id: number) => {
    if (subjects.length > 1) {
      setSubjects(subjects.filter(s => s.id !== id));
    }
  };

  const updateSubject = (id: number, field: keyof Subject, value: string | number) => {
    setSubjects(subjects.map(subject =>
      subject.id === id ? { ...subject, [field]: value } : subject
    ));
  };

  const calculateGrades = () => {
    let totalMarks = 0;
    let totalMaxMarks = 0;
    let weightedTotal = 0;
    let totalWeight = 0;

    subjects.forEach(subject => {
      totalMarks += subject.marks;
      totalMaxMarks += subject.maxMarks;
      weightedTotal += (subject.marks / subject.maxMarks) * subject.weight * 100;
      totalWeight += subject.weight;
    });

    const percentage = totalMaxMarks > 0 ? (totalMarks / totalMaxMarks) * 100 : 0;
    const weightedPercentage = totalWeight > 0 ? weightedTotal / totalWeight : 0;

    // Calculate letter grade
    let letterGrade = '';
    if (weightedPercentage >= 90) letterGrade = 'A+';
    else if (weightedPercentage >= 85) letterGrade = 'A';
    else if (weightedPercentage >= 80) letterGrade = 'A-';
    else if (weightedPercentage >= 75) letterGrade = 'B+';
    else if (weightedPercentage >= 70) letterGrade = 'B';
    else if (weightedPercentage >= 65) letterGrade = 'B-';
    else if (weightedPercentage >= 60) letterGrade = 'C+';
    else if (weightedPercentage >= 55) letterGrade = 'C';
    else if (weightedPercentage >= 50) letterGrade = 'C-';
    else if (weightedPercentage >= 45) letterGrade = 'D';
    else letterGrade = 'F';

    // Calculate GPA (4.0 scale)
    let gpa = 0;
    if (weightedPercentage >= 90) gpa = 4.0;
    else if (weightedPercentage >= 85) gpa = 3.7;
    else if (weightedPercentage >= 80) gpa = 3.3;
    else if (weightedPercentage >= 75) gpa = 3.0;
    else if (weightedPercentage >= 70) gpa = 2.7;
    else if (weightedPercentage >= 65) gpa = 2.3;
    else if (weightedPercentage >= 60) gpa = 2.0;
    else if (weightedPercentage >= 55) gpa = 1.7;
    else if (weightedPercentage >= 50) gpa = 1.0;
    else gpa = 0.0;

    setResults({
      totalMarks,
      totalMaxMarks,
      percentage,
      weightedPercentage,
      letterGrade,
      gpa,
    });
  };

  const handleClear = () => {
    setSubjects([{ id: 1, name: 'Subject 1', marks: 0, maxMarks: 100, weight: 1 }]);
    setResults({
      totalMarks: 0,
      totalMaxMarks: 0,
      percentage: 0,
      weightedPercentage: 0,
      letterGrade: '',
      gpa: 0,
    });
  };

  const loadSampleData = () => {
    setSubjects([
      { id: 1, name: 'Mathematics', marks: 85, maxMarks: 100, weight: 1 },
      { id: 2, name: 'Physics', marks: 78, maxMarks: 100, weight: 1 },
      { id: 3, name: 'Chemistry', marks: 92, maxMarks: 100, weight: 1 },
      { id: 4, name: 'English', marks: 88, maxMarks: 100, weight: 1 },
      { id: 5, name: 'Computer Science', marks: 95, maxMarks: 100, weight: 1 },
    ]);
  };

  const copyResults = async () => {
    const resultsText = `Grade Calculation Results:

Total Marks: ${results.totalMarks}/${results.totalMaxMarks}
Percentage: ${results.percentage.toFixed(2)}%
Weighted Percentage: ${results.weightedPercentage.toFixed(2)}%
Letter Grade: ${results.letterGrade}
GPA: ${results.gpa.toFixed(2)}

Subject Details:
${subjects.map(s => `${s.name}: ${s.marks}/${s.maxMarks} (${((s.marks/s.maxMarks)*100).toFixed(1)}%)`).join('\n')}`;

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
            <h3>Subject Marks</h3>
            <div className={styles.headerActions}>
              <button onClick={loadSampleData} className={styles.sampleBtn}>
                Load Sample
              </button>
              <button onClick={addSubject} className={styles.addBtn}>
                Add Subject
              </button>
            </div>
          </div>

          <div className={styles.subjectsList}>
            {subjects.map((subject, index) => (
              <div key={subject.id} className={styles.subjectRow}>
                <div className={styles.subjectFields}>
                  <input
                    type="text"
                    value={subject.name}
                    onChange={(e) => updateSubject(subject.id, 'name', e.target.value)}
                    placeholder="Subject name"
                    className={styles.subjectName}
                  />
                  <input
                    type="number"
                    value={subject.marks}
                    onChange={(e) => updateSubject(subject.id, 'marks', Number(e.target.value))}
                    placeholder="Marks"
                    className={styles.marksInput}
                    min="0"
                  />
                  <span className={styles.divider}>/</span>
                  <input
                    type="number"
                    value={subject.maxMarks}
                    onChange={(e) => updateSubject(subject.id, 'maxMarks', Number(e.target.value))}
                    placeholder="Max"
                    className={styles.marksInput}
                    min="1"
                  />
                  <input
                    type="number"
                    value={subject.weight}
                    onChange={(e) => updateSubject(subject.id, 'weight', Number(e.target.value))}
                    placeholder="Weight"
                    className={styles.weightInput}
                    min="0.1"
                    step="0.1"
                  />
                </div>
                {subjects.length > 1 && (
                  <button
                    onClick={() => removeSubject(subject.id)}
                    className={styles.removeBtn}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className={styles.optionsSection}>
          <h3>Grading Scale</h3>
          <div className={styles.scaleOptions}>
            <label className={styles.scaleOption}>
              <input
                type="radio"
                value="percentage"
                checked={gradingScale === 'percentage'}
                onChange={(e) => setGradingScale(e.target.value as any)}
              />
              <span>Percentage</span>
            </label>
            <label className={styles.scaleOption}>
              <input
                type="radio"
                value="letter"
                checked={gradingScale === 'letter'}
                onChange={(e) => setGradingScale(e.target.value as any)}
              />
              <span>Letter Grade</span>
            </label>
            <label className={styles.scaleOption}>
              <input
                type="radio"
                value="gpa"
                checked={gradingScale === 'gpa'}
                onChange={(e) => setGradingScale(e.target.value as any)}
              />
              <span>GPA</span>
            </label>
          </div>
        </div>

        <div className={styles.actions}>
          <button onClick={calculateGrades} className={styles.calculateBtn}>
            Calculate Grades
          </button>
          <button onClick={handleClear} className={styles.clearBtn}>
            Clear All
          </button>
        </div>

        {results.totalMaxMarks > 0 && (
          <div className={styles.resultsSection}>
            <div className={styles.resultsHeader}>
              <h3>Grade Results</h3>
              <button onClick={copyResults} className={styles.copyBtn}>
                Copy Results
              </button>
            </div>

            <div className={styles.resultsGrid}>
              <div className={styles.resultCard}>
                <div className={styles.resultValue}>{results.totalMarks}/{results.totalMaxMarks}</div>
                <div className={styles.resultLabel}>Total Marks</div>
              </div>

              <div className={styles.resultCard}>
                <div className={styles.resultValue}>{results.percentage.toFixed(2)}%</div>
                <div className={styles.resultLabel}>Simple Average</div>
              </div>

              <div className={styles.resultCard}>
                <div className={styles.resultValue}>{results.weightedPercentage.toFixed(2)}%</div>
                <div className={styles.resultLabel}>Weighted Average</div>
              </div>

              <div className={styles.resultCard}>
                <div className={styles.resultValue}>{results.letterGrade}</div>
                <div className={styles.resultLabel}>Letter Grade</div>
              </div>

              <div className={styles.resultCard}>
                <div className={styles.resultValue}>{results.gpa.toFixed(2)}</div>
                <div className={styles.resultLabel}>GPA (4.0 scale)</div>
              </div>
            </div>

            <div className={styles.gradeScale}>
              <h4>Grade Scale Reference</h4>
              <div className={styles.scaleTable}>
                <div className={styles.scaleRow}>
                  <span>A+ (90-100%)</span>
                  <span>A (85-89%)</span>
                  <span>A- (80-84%)</span>
                </div>
                <div className={styles.scaleRow}>
                  <span>B+ (75-79%)</span>
                  <span>B (70-74%)</span>
                  <span>B- (65-69%)</span>
                </div>
                <div className={styles.scaleRow}>
                  <span>C+ (60-64%)</span>
                  <span>C (55-59%)</span>
                  <span>C- (50-54%)</span>
                </div>
                <div className={styles.scaleRow}>
                  <span>D (45-49%)</span>
                  <span>F (0-44%)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className={styles.infoSection}>
          <h4>About Grade Calculator</h4>
          <p>This tool helps you calculate grades with support for:</p>
          <ul>
            <li><strong>Simple Average:</strong> Equal weight for all subjects</li>
            <li><strong>Weighted Average:</strong> Different importance for each subject</li>
            <li><strong>Letter Grades:</strong> Standard A+ to F grading scale</li>
            <li><strong>GPA:</strong> Grade Point Average on a 4.0 scale</li>
          </ul>
          <p>Perfect for students tracking their academic performance!</p>
        </div>
      </div>
    </div>
  );
}