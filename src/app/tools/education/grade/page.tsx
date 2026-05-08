'use client';

import { useEffect, useMemo, useState } from 'react';
import styles from './grade.module.css';

type GradingScale = 'percentage' | 'letter' | 'gpa';

interface Subject {
  id: number;
  name: string;
  marks: number;
  maxMarks: number;
  weight: number;
}

interface ExamRecord {
  id: string;
  examName: string;
  date: string;
  percentage: number;
  letterGrade: string;
  gpa: number;
  subjects: Subject[];
}

interface StoredState {
  subjects?: Subject[];
  examHistory?: ExamRecord[];
}

const SUBJECTS_KEY = 'grade-calculator-subjects';
const HISTORY_KEY = 'grade-calculator-history';
const defaultSubjects: Subject[] = [
  { id: 1, name: 'Subject 1', marks: 0, maxMarks: 100, weight: 1 },
];

const createId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const getInitialState = (): StoredState => {
  if (typeof window === 'undefined') {
    return { subjects: defaultSubjects, examHistory: [] };
  }

  try {
    const savedSubjects = window.localStorage.getItem(SUBJECTS_KEY);
    const savedHistory = window.localStorage.getItem(HISTORY_KEY);
    return {
      subjects: savedSubjects ? (JSON.parse(savedSubjects) as Subject[]) : defaultSubjects,
      examHistory: savedHistory ? (JSON.parse(savedHistory) as ExamRecord[]) : [],
    };
  } catch (error) {
    console.error('Error loading grade calculator data:', error);
    return { subjects: defaultSubjects, examHistory: [] };
  }
};

const getGradeFromPercentage = (percentage: number) => {
  if (percentage >= 90) return { letterGrade: 'A+', gpa: 4.0 };
  if (percentage >= 85) return { letterGrade: 'A', gpa: 3.7 };
  if (percentage >= 80) return { letterGrade: 'A-', gpa: 3.3 };
  if (percentage >= 75) return { letterGrade: 'B+', gpa: 3.0 };
  if (percentage >= 70) return { letterGrade: 'B', gpa: 2.7 };
  if (percentage >= 65) return { letterGrade: 'B-', gpa: 2.3 };
  if (percentage >= 60) return { letterGrade: 'C+', gpa: 2.0 };
  if (percentage >= 55) return { letterGrade: 'C', gpa: 1.7 };
  if (percentage >= 50) return { letterGrade: 'C-', gpa: 1.0 };
  if (percentage >= 45) return { letterGrade: 'D', gpa: 0.7 };
  return { letterGrade: 'F', gpa: 0.0 };
};

export default function GradePage() {
  const initialState = getInitialState();
  const [subjects, setSubjects] = useState<Subject[]>(initialState.subjects || defaultSubjects);
  const [gradingScale, setGradingScale] = useState<GradingScale>('percentage');
  const [examHistory, setExamHistory] = useState<ExamRecord[]>(initialState.examHistory || []);
  const [lastSaved, setLastSaved] = useState('');
  const [hasCalculated, setHasCalculated] = useState(false);

  useEffect(() => {
    window.localStorage.setItem(SUBJECTS_KEY, JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(examHistory));
  }, [examHistory]);

  const updateLastSaved = () => {
    setLastSaved(
      new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      })
    );
  };

  const results = useMemo(() => {
    let totalMarks = 0;
    let totalMaxMarks = 0;
    let weightedTotal = 0;
    let totalWeight = 0;

    subjects.forEach((subject) => {
      totalMarks += subject.marks;
      totalMaxMarks += subject.maxMarks;
      if (subject.maxMarks > 0) {
        weightedTotal += (subject.marks / subject.maxMarks) * subject.weight * 100;
      }
      totalWeight += subject.weight;
    });

    const percentage = totalMaxMarks > 0 ? (totalMarks / totalMaxMarks) * 100 : 0;
    const weightedPercentage = totalWeight > 0 ? weightedTotal / totalWeight : 0;
    const { letterGrade, gpa } = getGradeFromPercentage(weightedPercentage);

    return {
      totalMarks,
      totalMaxMarks,
      percentage,
      weightedPercentage,
      letterGrade,
      gpa,
    };
  }, [subjects]);

  const addSubject = () => {
    const newId = Math.max(...subjects.map((subject) => subject.id)) + 1;
    setSubjects((previous) => [
      ...previous,
      { id: newId, name: `Subject ${newId}`, marks: 0, maxMarks: 100, weight: 1 },
    ]);
    updateLastSaved();
  };

  const removeSubject = (id: number) => {
    if (subjects.length > 1) {
      setSubjects((previous) => previous.filter((subject) => subject.id !== id));
      updateLastSaved();
    }
  };

  const updateSubject = (id: number, field: keyof Subject, value: string | number) => {
    setSubjects((previous) =>
      previous.map((subject) =>
        subject.id === id ? { ...subject, [field]: value } : subject
      )
    );
    updateLastSaved();
  };

  const calculateGrades = () => {
    setHasCalculated(true);
  };

  const handleClear = () => {
    setSubjects(defaultSubjects);
    setHasCalculated(false);
    updateLastSaved();
  };

  const loadSampleData = () => {
    setSubjects([
      { id: 1, name: 'Mathematics', marks: 85, maxMarks: 100, weight: 1 },
      { id: 2, name: 'Physics', marks: 78, maxMarks: 100, weight: 1 },
      { id: 3, name: 'Chemistry', marks: 92, maxMarks: 100, weight: 1 },
      { id: 4, name: 'English', marks: 88, maxMarks: 100, weight: 1 },
      { id: 5, name: 'Computer Science', marks: 95, maxMarks: 100, weight: 1 },
    ]);
    setHasCalculated(false);
    updateLastSaved();
  };

  const loadPreset = (type: 'science' | 'commerce' | 'arts') => {
    const presets: Record<'science' | 'commerce' | 'arts', Subject[]> = {
      science: [
        { id: 1, name: 'Physics', marks: 0, maxMarks: 100, weight: 1 },
        { id: 2, name: 'Chemistry', marks: 0, maxMarks: 100, weight: 1 },
        { id: 3, name: 'Mathematics', marks: 0, maxMarks: 100, weight: 1 },
        { id: 4, name: 'English', marks: 0, maxMarks: 100, weight: 1 },
      ],
      commerce: [
        { id: 1, name: 'Accounting', marks: 0, maxMarks: 100, weight: 1 },
        { id: 2, name: 'Economics', marks: 0, maxMarks: 100, weight: 1 },
        { id: 3, name: 'Business Studies', marks: 0, maxMarks: 100, weight: 1 },
        { id: 4, name: 'English', marks: 0, maxMarks: 100, weight: 1 },
      ],
      arts: [
        { id: 1, name: 'History', marks: 0, maxMarks: 100, weight: 1 },
        { id: 2, name: 'Geography', marks: 0, maxMarks: 100, weight: 1 },
        { id: 3, name: 'Political Science', marks: 0, maxMarks: 100, weight: 1 },
        { id: 4, name: 'English', marks: 0, maxMarks: 100, weight: 1 },
      ],
    };

    setSubjects(presets[type]);
    setHasCalculated(false);
    updateLastSaved();
  };

  const saveToHistory = (examName: string) => {
    const newRecord: ExamRecord = {
      id: createId(),
      examName,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      percentage: results.weightedPercentage,
      letterGrade: results.letterGrade,
      gpa: results.gpa,
      subjects: structuredClone(subjects),
    };
    setExamHistory((previous) => [newRecord, ...previous].slice(0, 10));
    alert(`Exam \"${examName}\" saved to history.`);
    updateLastSaved();
  };

  const deleteFromHistory = (id: string) => {
    setExamHistory((previous) => previous.filter((record) => record.id !== id));
    updateLastSaved();
  };

  const copyResults = async () => {
    const resultsText = `Grade Calculation Results:\n\nTotal Marks: ${results.totalMarks}/${results.totalMaxMarks}\nPercentage: ${results.percentage.toFixed(2)}%\nWeighted Percentage: ${results.weightedPercentage.toFixed(2)}%\nLetter Grade: ${results.letterGrade}\nGPA: ${results.gpa.toFixed(2)}\n\nSubject Details:\n${subjects
      .map(
        (subject) =>
          `${subject.name}: ${subject.marks}/${subject.maxMarks} (${((subject.marks / subject.maxMarks) * 100).toFixed(1)}%)`
      )
      .join('\n')}`;

    try {
      await navigator.clipboard.writeText(resultsText);
      alert('Results copied to clipboard.');
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleSaveExam = () => {
    const examName = prompt('Enter exam name (for example Midterm or Final):');
    if (examName?.trim()) {
      saveToHistory(examName.trim());
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.tool}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            <span className={styles.icon}>Grades</span>
            Grade Calculator
          </h1>
          <p className={styles.subtitle}>
            Calculate subject averages, weighted grades, letter grades, and GPA from one dashboard.
          </p>
          <div className={styles.dataInfo}>
            <span className={styles.infoItem}>
              <strong>Auto-save:</strong> Your subjects and exam history stay on this device
            </span>
            <span className={styles.infoSeparator}>•</span>
            <span className={styles.infoItem}>
              {lastSaved ? <><strong>Last saved:</strong> {lastSaved}</> : 'Ready to calculate'}
            </span>
          </div>
        </div>

        <div className={styles.presetBtns}>
          <button onClick={() => loadPreset('science')} className={styles.presetBtn}>Science</button>
          <button onClick={() => loadPreset('commerce')} className={styles.presetBtn}>Commerce</button>
          <button onClick={() => loadPreset('arts')} className={styles.presetBtn}>Arts</button>
        </div>

        <div className={styles.inputSection}>
          <div className={styles.inputHeader}>
            <h3>Subject Marks</h3>
            <div className={styles.headerActions}>
              <button onClick={loadSampleData} className={styles.sampleBtn}>Load Sample</button>
              <button onClick={addSubject} className={styles.addBtn}>Add Subject</button>
            </div>
          </div>

          <div className={styles.subjectsList}>
            {subjects.map((subject) => (
              <div key={subject.id} className={styles.subjectRow}>
                <div className={styles.subjectFields}>
                  <input type="text" value={subject.name} onChange={(event) => updateSubject(subject.id, 'name', event.target.value)} placeholder="Subject name" className={styles.subjectName} />
                  <input type="number" value={subject.marks} onChange={(event) => updateSubject(subject.id, 'marks', Number(event.target.value))} placeholder="Marks" className={styles.marksInput} min="0" />
                  <span className={styles.divider}>/</span>
                  <input type="number" value={subject.maxMarks} onChange={(event) => updateSubject(subject.id, 'maxMarks', Number(event.target.value))} placeholder="Max" className={styles.marksInput} min="1" />
                  <input type="number" value={subject.weight} onChange={(event) => updateSubject(subject.id, 'weight', Number(event.target.value))} placeholder="Weight" className={styles.weightInput} min="0.1" step="0.1" />
                </div>
                {subjects.length > 1 && (
                  <button onClick={() => removeSubject(subject.id)} className={styles.removeBtn}>×</button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className={styles.optionsSection}>
          <h3>Preferred Result View</h3>
          <div className={styles.scaleOptions}>
            <label className={styles.scaleOption}>
              <input type="radio" value="percentage" checked={gradingScale === 'percentage'} onChange={() => setGradingScale('percentage')} />
              <span>Percentage</span>
            </label>
            <label className={styles.scaleOption}>
              <input type="radio" value="letter" checked={gradingScale === 'letter'} onChange={() => setGradingScale('letter')} />
              <span>Letter Grade</span>
            </label>
            <label className={styles.scaleOption}>
              <input type="radio" value="gpa" checked={gradingScale === 'gpa'} onChange={() => setGradingScale('gpa')} />
              <span>GPA</span>
            </label>
          </div>
        </div>

        <div className={styles.actions}>
          <button onClick={calculateGrades} className={styles.calculateBtn}>Calculate Grades</button>
          <button onClick={handleClear} className={styles.clearBtn}>Clear All</button>
        </div>

        {hasCalculated && results.totalMaxMarks > 0 && (
          <div className={styles.resultsSection}>
            <div className={styles.resultsHeader}>
              <h3>Grade Results</h3>
              <div className={styles.headerActions}>
                <button onClick={handleSaveExam} className={styles.saveHistoryBtn}>Save to History</button>
                <button onClick={copyResults} className={styles.copyBtn}>Copy Results</button>
              </div>
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

        {examHistory.length > 0 && (
          <div className={styles.historySection}>
            <h3>Exam History</h3>
            <div className={styles.historyGrid}>
              {examHistory.map((record) => (
                <div key={record.id} className={styles.historyCard}>
                  <div className={styles.historyDate}>{record.date}</div>
                  <div className={styles.historyName}>{record.examName}</div>
                  <div className={styles.historyStats}>
                    <span className={styles.historyPercentage}>{record.percentage.toFixed(1)}%</span>
                    <span className={styles.historyGrade}>{record.letterGrade}</span>
                  </div>
                  <button onClick={() => deleteFromHistory(record.id)} className={styles.historyDeleteBtn}>×</button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className={styles.infoSection}>
          <h4>How to Use the Grade Calculator</h4>
          <p><strong>Step 1:</strong> Choose a preset stream or add subjects manually.</p>
          <p><strong>Step 2:</strong> Enter marks, maximum marks, and optional weights.</p>
          <p><strong>Step 3:</strong> Click Calculate Grades to see averages, letter grades, and GPA.</p>
          <p><strong>Step 4:</strong> Save important exams to history so you can compare performance later.</p>
          <ul>
            <li>Simple and weighted averages are both calculated automatically.</li>
            <li>Exam history helps you compare multiple tests over time.</li>
            <li>All data stays stored in your browser on this device.</li>
            <li>Letter grades and GPA are generated instantly after calculation.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
