'use client';

import { useState, useEffect } from 'react';
import styles from './percentage.module.css';

interface Subject {
  id: number;
  name: string;
  obtained: number;
  total: number;
  weight?: number;
}

export default function PercentageCalc() {
  const [mode, setMode] = useState<'simple' | 'subjects' | 'weighted' | 'cgpa'>('simple');
  const [obtained, setObtained] = useState('');
  const [total, setTotal] = useState('');
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: 1, name: 'Mathematics', obtained: 0, total: 100, weight: 1 },
  ]);
  const [weightedSubjects, setWeightedSubjects] = useState<Subject[]>([
    { id: 1, name: 'Subject 1', obtained: 0, total: 100, weight: 1 },
  ]);
  const [cgpa, setCgpa] = useState('');
  const [cgpaScale, setCgpaScale] = useState<'4' | '10'>('4');
  const [lastSaved, setLastSaved] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('percentage-calculator');
    if (saved) {
      const data = JSON.parse(saved);
      setObtained(data.obtained || '');
      setTotal(data.total || '');
      setSubjects(data.subjects || subjects);
      setWeightedSubjects(data.weightedSubjects || weightedSubjects);
      setCgpa(data.cgpa || '');
      setCgpaScale(data.cgpaScale || '4');
      setMode(data.mode || 'simple');
    }
  }, []);

  useEffect(() => {
    const data = { obtained, total, subjects, weightedSubjects, cgpa, cgpaScale, mode };
    localStorage.setItem('percentage-calculator', JSON.stringify(data));
    setLastSaved(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
  }, [obtained, total, subjects, weightedSubjects, cgpa, cgpaScale, mode]);

  const simplePercent = total && obtained ? ((parseFloat(obtained) / parseFloat(total)) * 100).toFixed(2) : '0';
  const simpleGrade = getGrade(parseFloat(simplePercent));

  const subjectsTotal = subjects.reduce((sum, s) => sum + s.total, 0);
  const subjectsObtained = subjects.reduce((sum, s) => sum + s.obtained, 0);
  const subjectsPercent = subjectsTotal > 0 ? ((subjectsObtained / subjectsTotal) * 100).toFixed(2) : '0';
  const subjectsGrade = getGrade(parseFloat(subjectsPercent));

  const weightedTotal = weightedSubjects.reduce((sum, s) => sum + (s.obtained / s.total) * (s.weight || 1) * 100, 0);
  const totalWeight = weightedSubjects.reduce((sum, s) => sum + (s.weight || 1), 0);
  const weightedPercent = totalWeight > 0 ? (weightedTotal / totalWeight).toFixed(2) : '0';
  const weightedGrade = getGrade(parseFloat(weightedPercent));

  const cgpaToPercent = cgpa && cgpaScale === '4'
    ? (parseFloat(cgpa) * 25).toFixed(2)
    : cgpa && cgpaScale === '10'
      ? (parseFloat(cgpa) * 9.5).toFixed(2)
      : '0';

  function getGrade(percentage: number): string {
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
  }

  function getGradeColor(grade: string): string {
    const colors: { [key: string]: string } = {
      'A+': '#28a745',
      'A': '#17a2b8',
      'A-': '#007bff',
      'B+': '#ffc107',
      'B': '#fd7e14',
      'B-': '#dc3545',
      'C+': '#e83e8c',
      'C': '#6610f2',
      'C-': '#20c997',
      'D': '#999',
      'F': '#555',
    };
    return colors[grade] || '#667eea';
  }

  const addSubject = (type: 'subjects' | 'weighted') => {
    if (type === 'subjects') {
      const newId = Math.max(...subjects.map(s => s.id), 0) + 1;
      setSubjects([...subjects, { id: newId, name: `Subject ${newId}`, obtained: 0, total: 100 }]);
    } else {
      const newId = Math.max(...weightedSubjects.map(s => s.id), 0) + 1;
      setWeightedSubjects([...weightedSubjects, { id: newId, name: `Subject ${newId}`, obtained: 0, total: 100, weight: 1 }]);
    }
  };

  const removeSubject = (id: number, type: 'subjects' | 'weighted') => {
    if (type === 'subjects' && subjects.length > 1) {
      setSubjects(subjects.filter(s => s.id !== id));
    } else if (type === 'weighted' && weightedSubjects.length > 1) {
      setWeightedSubjects(weightedSubjects.filter(s => s.id !== id));
    }
  };

  const updateSubject = (id: number, field: string, value: any, type: 'subjects' | 'weighted') => {
    if (type === 'subjects') {
      setSubjects(subjects.map(s => s.id === id ? { ...s, [field]: value } : s));
    } else {
      setWeightedSubjects(weightedSubjects.map(s => s.id === id ? { ...s, [field]: value } : s));
    }
  };

  const copyResults = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const clearAll = () => {
    if (mode === 'simple') {
      setObtained('');
      setTotal('');
    } else if (mode === 'subjects') {
      setSubjects([{ id: 1, name: 'Mathematics', obtained: 0, total: 100, weight: 1 }]);
    } else if (mode === 'weighted') {
      setWeightedSubjects([{ id: 1, name: 'Subject 1', obtained: 0, total: 100, weight: 1 }]);
    } else {
      setCgpa('');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.tool}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            <span className={styles.icon}>📊</span>
            Percentage Calculator
          </h1>
          <p className={styles.subtitle}>
            Calculate percentages, grades, and convert between scales
          </p>
          <div className={styles.dataInfo}>
            <span className={styles.infoItem}>
              💾 <strong>Auto-Save:</strong> Your calculations are automatically saved
            </span>
            <span className={styles.infoSeparator}>•</span>
            <span className={styles.infoItem}>
              {lastSaved && <><strong>Last saved:</strong> {lastSaved}</>}
            </span>
          </div>
        </div>

        <div className={styles.modeTabs}>
          <button
            className={`${styles.modeTab} ${mode === 'simple' ? styles.active : ''}`}
            onClick={() => setMode('simple')}
          >
            📝 Simple
          </button>
          <button
            className={`${styles.modeTab} ${mode === 'subjects' ? styles.active : ''}`}
            onClick={() => setMode('subjects')}
          >
            📚 Subjects
          </button>
          <button
            className={`${styles.modeTab} ${mode === 'weighted' ? styles.active : ''}`}
            onClick={() => setMode('weighted')}
          >
            ⚖️ Weighted
          </button>
          <button
            className={`${styles.modeTab} ${mode === 'cgpa' ? styles.active : ''}`}
            onClick={() => setMode('cgpa')}
          >
            🔄 CGPA
          </button>
        </div>

        {mode === 'simple' && (
          <div className={styles.modeContent}>
            <h2>Simple Percentage Calculator</h2>
            <div className={styles.inputSection}>
              <div className={styles.inputGroup}>
                <label>Obtained Marks</label>
                <input
                  type="number"
                  value={obtained}
                  onChange={(e) => setObtained(e.target.value)}
                  placeholder="e.g. 85"
                  className={styles.input}
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Total Marks</label>
                <input
                  type="number"
                  value={total}
                  onChange={(e) => setTotal(e.target.value)}
                  placeholder="e.g. 100"
                  className={styles.input}
                />
              </div>
            </div>

            {total && obtained && (
              <div className={styles.resultCard}>
                <div className={styles.resultValue}>{simplePercent}%</div>
                <div className={styles.resultLabel}>Percentage</div>
                <div className={styles.gradeBadge} style={{ backgroundColor: getGradeColor(simpleGrade) }}>
                  {simpleGrade}
                </div>
                <button onClick={() => copyResults(`Percentage: ${simplePercent}%`)} className={styles.copyBtn}>
                  📋 Copy
                </button>
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
                  <input
                    type="text"
                    value={subject.name}
                    onChange={(e) => updateSubject(subject.id, 'name', e.target.value, 'subjects')}
                    placeholder="Subject name"
                    className={styles.subjectInput}
                  />
                  <div className={styles.marksGroup}>
                    <input
                      type="number"
                      value={subject.obtained}
                      onChange={(e) => updateSubject(subject.id, 'obtained', parseFloat(e.target.value) || 0, 'subjects')}
                      placeholder="0"
                      className={styles.marksInput}
                    />
                    <span className={styles.divider}>/</span>
                    <input
                      type="number"
                      value={subject.total}
                      onChange={(e) => updateSubject(subject.id, 'total', parseFloat(e.target.value) || 100, 'subjects')}
                      placeholder="100"
                      className={styles.marksInput}
                    />
                  </div>
                  {subjects.length > 1 && (
                    <button
                      onClick={() => removeSubject(subject.id, 'subjects')}
                      className={styles.removeBtn}
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button onClick={() => addSubject('subjects')} className={styles.addBtn}>
              + Add Subject
            </button>

            {subjects.length > 0 && (
              <div className={styles.resultCard}>
                <div className={styles.resultValue}>{subjectsPercent}%</div>
                <div className={styles.resultLabel}>Overall Percentage</div>
                <div className={styles.gradeBadge} style={{ backgroundColor: getGradeColor(subjectsGrade) }}>
                  {subjectsGrade}
                </div>
                <div className={styles.subjectStats}>
                  Total Marks: {subjectsObtained} / {subjectsTotal}
                </div>
                <button onClick={() => copyResults(`Percentage: ${subjectsPercent}%\nTotal: ${subjectsObtained}/${subjectsTotal}`)} className={styles.copyBtn}>
                  📋 Copy
                </button>
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
                  <input
                    type="text"
                    value={subject.name}
                    onChange={(e) => updateSubject(subject.id, 'name', e.target.value, 'weighted')}
                    placeholder="Subject name"
                    className={styles.subjectInput}
                  />
                  <div className={styles.marksGroup}>
                    <input
                      type="number"
                      value={subject.obtained}
                      onChange={(e) => updateSubject(subject.id, 'obtained', parseFloat(e.target.value) || 0, 'weighted')}
                      placeholder="0"
                      className={styles.marksInput}
                    />
                    <span className={styles.divider}>/</span>
                    <input
                      type="number"
                      value={subject.total}
                      onChange={(e) => updateSubject(subject.id, 'total', parseFloat(e.target.value) || 100, 'weighted')}
                      placeholder="100"
                      className={styles.marksInput}
                    />
                  </div>
                  <input
                    type="number"
                    value={subject.weight}
                    onChange={(e) => updateSubject(subject.id, 'weight', parseFloat(e.target.value) || 1, 'weighted')}
                    placeholder="Weight"
                    className={styles.weightInput}
                    min="0.1"
                    step="0.1"
                  />
                  {weightedSubjects.length > 1 && (
                    <button
                      onClick={() => removeSubject(subject.id, 'weighted')}
                      className={styles.removeBtn}
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button onClick={() => addSubject('weighted')} className={styles.addBtn}>
              + Add Subject
            </button>

            {weightedSubjects.length > 0 && (
              <div className={styles.resultCard}>
                <div className={styles.resultValue}>{weightedPercent}%</div>
                <div className={styles.resultLabel}>Weighted Percentage</div>
                <div className={styles.gradeBadge} style={{ backgroundColor: getGradeColor(weightedGrade) }}>
                  {weightedGrade}
                </div>
                <button onClick={() => copyResults(`Weighted Percentage: ${weightedPercent}%`)} className={styles.copyBtn}>
                  📋 Copy
                </button>
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
                <button
                  className={`${styles.scaleBtn} ${cgpaScale === '4' ? styles.active : ''}`}
                  onClick={() => setCgpaScale('4')}
                >
                  4.0 Scale
                </button>
                <button
                  className={`${styles.scaleBtn} ${cgpaScale === '10' ? styles.active : ''}`}
                  onClick={() => setCgpaScale('10')}
                >
                  10.0 Scale
                </button>
              </div>
              <div className={styles.inputGroup}>
                <label>CGPA ({cgpaScale}.0 scale)</label>
                <input
                  type="number"
                  value={cgpa}
                  onChange={(e) => setCgpa(e.target.value)}
                  placeholder={cgpaScale === '4' ? 'e.g. 3.8' : 'e.g. 9.5'}
                  className={styles.input}
                  max={cgpaScale === '4' ? '4' : '10'}
                  step="0.1"
                />
              </div>
            </div>

            {cgpa && (
              <div className={styles.resultCard}>
                <div className={styles.resultValue}>{cgpaToPercent}%</div>
                <div className={styles.resultLabel}>Equivalent Percentage</div>
                <div className={styles.cgpaInfo}>
                  Formula: CGPA × {cgpaScale === '4' ? '25' : '9.5'} = Percentage
                </div>
                <button onClick={() => copyResults(`${cgpa} CGPA = ${cgpaToPercent}%`)} className={styles.copyBtn}>
                  📋 Copy
                </button>
              </div>
            )}

            <button onClick={clearAll} className={styles.clearBtn}>Clear</button>
          </div>
        )}

        <div className={styles.infoSection}>
          <h4>📖 Quick Guide</h4>
          <ul>
            <li>📝 <strong>Simple:</strong> Calculate percentage for single exam/subject</li>
            <li>📚 <strong>Multiple Subjects:</strong> Average percentage across subjects</li>
            <li>⚖️ <strong>Weighted:</strong> Calculate with custom weights for each subject</li>
            <li>🔄 <strong>CGPA to %:</strong> Convert CGPA (4.0 or 10.0 scale) to percentage</li>
            <li>📊 Letter grades automatically calculated (A+ to F)</li>
            <li>💾 All data is saved automatically</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
