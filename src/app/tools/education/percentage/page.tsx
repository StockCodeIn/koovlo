'use client';

import { useEffect, useMemo, useState } from 'react';
import styles from './percentage.module.css';

interface Subject {
  id: number;
  name: string;
  obtained: number;
  total: number;
  weight?: number;
}

interface StoredState {
  mode?: 'simple' | 'subjects' | 'weighted' | 'cgpa';
  obtained?: string;
  total?: string;
  subjects?: Subject[];
  weightedSubjects?: Subject[];
  cgpa?: string;
  cgpaScale?: '4' | '10';
}

const STORAGE_KEY = 'percentage-calculator';

const defaultSubjects: Subject[] = [{ id: 1, name: 'Mathematics', obtained: 0, total: 100, weight: 1 }];
const defaultWeightedSubjects: Subject[] = [{ id: 1, name: 'Subject 1', obtained: 0, total: 100, weight: 1 }];

const getInitialState = (): StoredState => {
  if (typeof window === 'undefined') {
    return {
      mode: 'simple',
      obtained: '',
      total: '',
      subjects: defaultSubjects,
      weightedSubjects: defaultWeightedSubjects,
      cgpa: '',
      cgpaScale: '4',
    };
  }

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      return {
        mode: 'simple',
        obtained: '',
        total: '',
        subjects: defaultSubjects,
        weightedSubjects: defaultWeightedSubjects,
        cgpa: '',
        cgpaScale: '4',
      };
    }

    const parsed = JSON.parse(saved) as StoredState;
    return {
      mode: parsed.mode || 'simple',
      obtained: parsed.obtained || '',
      total: parsed.total || '',
      subjects: parsed.subjects || defaultSubjects,
      weightedSubjects: parsed.weightedSubjects || defaultWeightedSubjects,
      cgpa: parsed.cgpa || '',
      cgpaScale: parsed.cgpaScale || '4',
    };
  } catch (error) {
    console.error('Error loading percentage calculator data:', error);
    return {
      mode: 'simple',
      obtained: '',
      total: '',
      subjects: defaultSubjects,
      weightedSubjects: defaultWeightedSubjects,
      cgpa: '',
      cgpaScale: '4',
    };
  }
};

const getGrade = (percentage: number): string => {
  if (percentage >= 90) return 'A+';
  if (percentage >= 85) return 'A';
  if (percentage >= 80) return 'A-';
  if (percentage >= 75) return 'B+';
  if (percentage >= 70) return 'B';
  if (percentage >= 65) return 'B-';
  if (percentage >= 60) return 'C+';
  if (percentage >= 55) return 'C';
  if (percentage >= 50) return 'C-';
  if (percentage >= 45) return 'D';
  return 'F';
};

const getGradeColor = (grade: string): string => {
  const colors: Record<string, string> = {
    'A+': '#28a745',
    A: '#17a2b8',
    'A-': '#007bff',
    'B+': '#ffc107',
    B: '#fd7e14',
    'B-': '#dc3545',
    'C+': '#e83e8c',
    C: '#6610f2',
    'C-': '#20c997',
    D: '#999',
    F: '#555',
  };
  return colors[grade] || '#667eea';
};

export default function PercentageCalc() {
  const initialState = getInitialState();
  const [mode, setMode] = useState<'simple' | 'subjects' | 'weighted' | 'cgpa'>(initialState.mode || 'simple');
  const [obtained, setObtained] = useState(initialState.obtained || '');
  const [total, setTotal] = useState(initialState.total || '');
  const [subjects, setSubjects] = useState<Subject[]>(initialState.subjects || defaultSubjects);
  const [weightedSubjects, setWeightedSubjects] = useState<Subject[]>(initialState.weightedSubjects || defaultWeightedSubjects);
  const [cgpa, setCgpa] = useState(initialState.cgpa || '');
  const [cgpaScale, setCgpaScale] = useState<'4' | '10'>(initialState.cgpaScale || '4');
  const [lastSaved, setLastSaved] = useState('');

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ obtained, total, subjects, weightedSubjects, cgpa, cgpaScale, mode })
    );
  }, [cgpa, cgpaScale, mode, obtained, subjects, total, weightedSubjects]);

  const simplePercent = useMemo(() => {
    if (!total || !obtained || Number(total) === 0) return '0';
    return ((parseFloat(obtained) / parseFloat(total)) * 100).toFixed(2);
  }, [obtained, total]);
  const simpleGrade = getGrade(parseFloat(simplePercent));

  const subjectsSummary = useMemo(() => {
    const totalMarks = subjects.reduce((sum, subject) => sum + subject.total, 0);
    const obtainedMarks = subjects.reduce((sum, subject) => sum + subject.obtained, 0);
    const percent = totalMarks > 0 ? ((obtainedMarks / totalMarks) * 100).toFixed(2) : '0';
    return {
      totalMarks,
      obtainedMarks,
      percent,
      grade: getGrade(parseFloat(percent)),
    };
  }, [subjects]);

  const weightedSummary = useMemo(() => {
    const weightedTotal = weightedSubjects.reduce(
      (sum, subject) => sum + (subject.total > 0 ? (subject.obtained / subject.total) * (subject.weight || 1) * 100 : 0),
      0
    );
    const totalWeight = weightedSubjects.reduce((sum, subject) => sum + (subject.weight || 1), 0);
    const percent = totalWeight > 0 ? (weightedTotal / totalWeight).toFixed(2) : '0';
    return {
      percent,
      grade: getGrade(parseFloat(percent)),
    };
  }, [weightedSubjects]);

  const cgpaToPercent = useMemo(() => {
    if (!cgpa) return '0';
    return cgpaScale === '4' ? (parseFloat(cgpa) * 25).toFixed(2) : (parseFloat(cgpa) * 9.5).toFixed(2);
  }, [cgpa, cgpaScale]);

  const updateLastSaved = () => {
    setLastSaved(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
  };

  const addSubject = (type: 'subjects' | 'weighted') => {
    if (type === 'subjects') {
      const newId = Math.max(...subjects.map((subject) => subject.id), 0) + 1;
      setSubjects((previous) => [...previous, { id: newId, name: `Subject ${newId}`, obtained: 0, total: 100 }]);
    } else {
      const newId = Math.max(...weightedSubjects.map((subject) => subject.id), 0) + 1;
      setWeightedSubjects((previous) => [...previous, { id: newId, name: `Subject ${newId}`, obtained: 0, total: 100, weight: 1 }]);
    }
    updateLastSaved();
  };

  const removeSubject = (id: number, type: 'subjects' | 'weighted') => {
    if (type === 'subjects' && subjects.length > 1) {
      setSubjects((previous) => previous.filter((subject) => subject.id !== id));
    } else if (type === 'weighted' && weightedSubjects.length > 1) {
      setWeightedSubjects((previous) => previous.filter((subject) => subject.id !== id));
    }
    updateLastSaved();
  };

  const updateSubject = (
    id: number,
    field: keyof Subject,
    value: string | number,
    type: 'subjects' | 'weighted'
  ) => {
    if (type === 'subjects') {
      setSubjects((previous) => previous.map((subject) => (subject.id === id ? { ...subject, [field]: value } : subject)));
    } else {
      setWeightedSubjects((previous) => previous.map((subject) => (subject.id === id ? { ...subject, [field]: value } : subject)));
    }
    updateLastSaved();
  };

  const copyResults = async (text: string) => {
    await navigator.clipboard.writeText(text);
    alert('Copied to clipboard.');
  };

  const clearAll = () => {
    if (mode === 'simple') {
      setObtained('');
      setTotal('');
    } else if (mode === 'subjects') {
      setSubjects(defaultSubjects);
    } else if (mode === 'weighted') {
      setWeightedSubjects(defaultWeightedSubjects);
    } else {
      setCgpa('');
    }
    updateLastSaved();
  };

  return (
    <div className={styles.container}>
      <div className={styles.tool}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            <span className={styles.icon}>Percentage</span>
            Percentage Calculator
          </h1>
          <p className={styles.subtitle}>Calculate percentages, grades, and CGPA conversions with browser-side auto-save.</p>
          <div className={styles.dataInfo}>
            <span className={styles.infoItem}>
              <strong>Auto-save:</strong> Your calculations stay on this device
            </span>
            <span className={styles.infoSeparator}>•</span>
            <span className={styles.infoItem}>{lastSaved ? <><strong>Last saved:</strong> {lastSaved}</> : 'Ready to calculate'}</span>
          </div>
        </div>

        <div className={styles.modeTabs}>
          <button className={`${styles.modeTab} ${mode === 'simple' ? styles.active : ''}`} onClick={() => setMode('simple')}>Simple</button>
          <button className={`${styles.modeTab} ${mode === 'subjects' ? styles.active : ''}`} onClick={() => setMode('subjects')}>Subjects</button>
          <button className={`${styles.modeTab} ${mode === 'weighted' ? styles.active : ''}`} onClick={() => setMode('weighted')}>Weighted</button>
          <button className={`${styles.modeTab} ${mode === 'cgpa' ? styles.active : ''}`} onClick={() => setMode('cgpa')}>CGPA</button>
        </div>

        {mode === 'simple' && (
          <div className={styles.modeContent}>
            <h2>Simple Percentage Calculator</h2>
            <div className={styles.inputSection}>
              <div className={styles.inputGroup}>
                <label>Obtained Marks</label>
                <input type="number" value={obtained} onChange={(event) => { setObtained(event.target.value); updateLastSaved(); }} placeholder="e.g. 85" className={styles.input} />
              </div>
              <div className={styles.inputGroup}>
                <label>Total Marks</label>
                <input type="number" value={total} onChange={(event) => { setTotal(event.target.value); updateLastSaved(); }} placeholder="e.g. 100" className={styles.input} />
              </div>
            </div>

            {total && obtained && (
              <div className={styles.resultCard}>
                <div className={styles.resultValue}>{simplePercent}%</div>
                <div className={styles.resultLabel}>Percentage</div>
                <div className={styles.gradeBadge} style={{ backgroundColor: getGradeColor(simpleGrade) }}>{simpleGrade}</div>
                <button onClick={() => copyResults(`Percentage: ${simplePercent}%`)} className={styles.copyBtn}>Copy</button>
              </div>
            )}

            <button onClick={clearAll} className={styles.clearBtn}>Clear</button>
          </div>
        )}

        {mode === 'subjects' && (
          <div className={styles.modeContent}>
            <h2>Multiple Subjects Percentage</h2>
            <div className={styles.subjectsForm}>
              {subjects.map((subject) => (
                <div key={subject.id} className={styles.subjectRow}>
                  <input type="text" value={subject.name} onChange={(event) => updateSubject(subject.id, 'name', event.target.value, 'subjects')} placeholder="Subject name" className={styles.subjectInput} />
                  <div className={styles.marksGroup}>
                    <input type="number" value={subject.obtained} onChange={(event) => updateSubject(subject.id, 'obtained', parseFloat(event.target.value) || 0, 'subjects')} placeholder="0" className={styles.marksInput} />
                    <span className={styles.divider}>/</span>
                    <input type="number" value={subject.total} onChange={(event) => updateSubject(subject.id, 'total', parseFloat(event.target.value) || 100, 'subjects')} placeholder="100" className={styles.marksInput} />
                  </div>
                  {subjects.length > 1 && <button onClick={() => removeSubject(subject.id, 'subjects')} className={styles.removeBtn}>×</button>}
                </div>
              ))}
            </div>

            <button onClick={() => addSubject('subjects')} className={styles.addBtn}>+ Add Subject</button>

            {subjects.length > 0 && (
              <div className={styles.resultCard}>
                <div className={styles.resultValue}>{subjectsSummary.percent}%</div>
                <div className={styles.resultLabel}>Overall Percentage</div>
                <div className={styles.gradeBadge} style={{ backgroundColor: getGradeColor(subjectsSummary.grade) }}>{subjectsSummary.grade}</div>
                <div className={styles.subjectStats}>Total Marks: {subjectsSummary.obtainedMarks} / {subjectsSummary.totalMarks}</div>
                <button onClick={() => copyResults(`Percentage: ${subjectsSummary.percent}%\nTotal: ${subjectsSummary.obtainedMarks}/${subjectsSummary.totalMarks}`)} className={styles.copyBtn}>Copy</button>
              </div>
            )}

            <button onClick={clearAll} className={styles.clearBtn}>Clear All</button>
          </div>
        )}

        {mode === 'weighted' && (
          <div className={styles.modeContent}>
            <h2>Weighted Percentage Calculator</h2>
            <div className={styles.subjectsForm}>
              {weightedSubjects.map((subject) => (
                <div key={subject.id} className={styles.weightedRow}>
                  <input type="text" value={subject.name} onChange={(event) => updateSubject(subject.id, 'name', event.target.value, 'weighted')} placeholder="Subject name" className={styles.subjectInput} />
                  <div className={styles.marksGroup}>
                    <input type="number" value={subject.obtained} onChange={(event) => updateSubject(subject.id, 'obtained', parseFloat(event.target.value) || 0, 'weighted')} placeholder="0" className={styles.marksInput} />
                    <span className={styles.divider}>/</span>
                    <input type="number" value={subject.total} onChange={(event) => updateSubject(subject.id, 'total', parseFloat(event.target.value) || 100, 'weighted')} placeholder="100" className={styles.marksInput} />
                  </div>
                  <input type="number" value={subject.weight} onChange={(event) => updateSubject(subject.id, 'weight', parseFloat(event.target.value) || 1, 'weighted')} placeholder="Weight" className={styles.weightInput} min="0.1" step="0.1" />
                  {weightedSubjects.length > 1 && <button onClick={() => removeSubject(subject.id, 'weighted')} className={styles.removeBtn}>×</button>}
                </div>
              ))}
            </div>

            <button onClick={() => addSubject('weighted')} className={styles.addBtn}>+ Add Subject</button>

            {weightedSubjects.length > 0 && (
              <div className={styles.resultCard}>
                <div className={styles.resultValue}>{weightedSummary.percent}%</div>
                <div className={styles.resultLabel}>Weighted Percentage</div>
                <div className={styles.gradeBadge} style={{ backgroundColor: getGradeColor(weightedSummary.grade) }}>{weightedSummary.grade}</div>
                <button onClick={() => copyResults(`Weighted Percentage: ${weightedSummary.percent}%`)} className={styles.copyBtn}>Copy</button>
              </div>
            )}

            <button onClick={clearAll} className={styles.clearBtn}>Clear All</button>
          </div>
        )}

        {mode === 'cgpa' && (
          <div className={styles.modeContent}>
            <h2>CGPA to Percentage Converter</h2>
            <div className={styles.inputSection}>
              <div className={styles.scaleToggle}>
                <button className={`${styles.scaleBtn} ${cgpaScale === '4' ? styles.active : ''}`} onClick={() => { setCgpaScale('4'); updateLastSaved(); }}>4.0 Scale</button>
                <button className={`${styles.scaleBtn} ${cgpaScale === '10' ? styles.active : ''}`} onClick={() => { setCgpaScale('10'); updateLastSaved(); }}>10.0 Scale</button>
              </div>
              <div className={styles.inputGroup}>
                <label>CGPA ({cgpaScale}.0 scale)</label>
                <input type="number" value={cgpa} onChange={(event) => { setCgpa(event.target.value); updateLastSaved(); }} placeholder={cgpaScale === '4' ? 'e.g. 3.8' : 'e.g. 9.5'} className={styles.input} max={cgpaScale === '4' ? '4' : '10'} step="0.1" />
              </div>
            </div>

            {cgpa && (
              <div className={styles.resultCard}>
                <div className={styles.resultValue}>{cgpaToPercent}%</div>
                <div className={styles.resultLabel}>Equivalent Percentage</div>
                <div className={styles.cgpaInfo}>Formula: CGPA × {cgpaScale === '4' ? '25' : '9.5'} = Percentage</div>
                <button onClick={() => copyResults(`${cgpa} CGPA = ${cgpaToPercent}%`)} className={styles.copyBtn}>Copy</button>
              </div>
            )}

            <button onClick={clearAll} className={styles.clearBtn}>Clear</button>
          </div>
        )}

        <div className={styles.infoSection}>
          <h4>Quick Guide</h4>
          <ul>
            <li><strong>Simple:</strong> Calculate a percentage for one exam or subject.</li>
            <li><strong>Multiple Subjects:</strong> Combine marks across subjects for an overall score.</li>
            <li><strong>Weighted:</strong> Apply custom weights for assignments, internal marks, or finals.</li>
            <li><strong>CGPA to %:</strong> Convert 4.0 or 10.0 scale CGPA into an estimated percentage.</li>
            <li>Letter grades are calculated automatically from A+ to F.</li>
            <li>All calculations are stored locally in your browser.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
