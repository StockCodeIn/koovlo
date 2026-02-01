"use client";
import { useState } from "react";
import styles from "./cgpa.module.css";
import ToolInfo from "@/components/ToolInfo";

interface Subject {
  id: number;
  name: string;
  grade: string;
  gpa: number;
  credits: number;
  semester: number;
}

export default function CGPACalc() {
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: 1, name: "Subject 1", grade: "A", gpa: 10, credits: 3, semester: 1 }
  ]);
  const [currentSemester, setCurrentSemester] = useState(1);
  const [bulkInput, setBulkInput] = useState("");
  const [gradeScale, setGradeScale] = useState<'10' | '4'>('10');

  const gradeToGPA = (grade: string, scale: '10' | '4'): number => {
    if (scale === '10') {
      const gradeMap: { [key: string]: number } = {
        'O': 10, 'A+': 9, 'A': 8.5, 'B+': 8, 'B': 7.5, 'C+': 7, 'C': 6.5, 'D': 6, 'F': 0
      };
      return gradeMap[grade.toUpperCase()] || 0;
    } else {
      const gradeMap: { [key: string]: number } = {
        'A+': 4.0, 'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7, 
        'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'D+': 1.3, 'D': 1.0, 'F': 0
      };
      return gradeMap[grade.toUpperCase()] || 0;
    }
  };

  const addSubject = () => {
    const newId = Math.max(...subjects.map(s => s.id)) + 1;
    setSubjects([...subjects, { 
      id: newId, 
      name: `Subject ${newId}`, 
      grade: 'A', 
      gpa: gradeScale === '10' ? 8.5 : 4.0, 
      credits: 3, 
      semester: currentSemester 
    }]);
  };

  const updateSubject = (id: number, field: keyof Subject, value: any) => {
    setSubjects(subjects.map(s => {
      if (s.id === id) {
        const updated = { ...s, [field]: value };
        if (field === 'grade') {
          updated.gpa = gradeToGPA(value, gradeScale);
        } else if (field === 'gpa') {
          updated.gpa = parseFloat(value) || 0;
        }
        return updated;
      }
      return s;
    }));
  };

  const removeSubject = (id: number) => {
    if (subjects.length > 1) {
      setSubjects(subjects.filter(s => s.id !== id));
    }
  };

  const bulkAddSubjects = () => {
    const lines = bulkInput.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length === 0) return;

    const startId = Math.max(...subjects.map(s => s.id)) + 1;
    const newSubjects = lines.map((line, idx) => {
      const parts = line.split(',').map(p => p.trim());
      const name = parts[0] || `Subject ${startId + idx}`;
      const grade = parts[1] || 'A';
      const credits = parseInt(parts[2]) || 3;
      
      return {
        id: startId + idx,
        name,
        grade,
        gpa: gradeToGPA(grade, gradeScale),
        credits,
        semester: currentSemester
      };
    });

    setSubjects([...subjects, ...newSubjects]);
    setBulkInput('');
  };

  const loadPreset = (type: 'engineering' | 'medical' | 'commerce') => {
    const presets = {
      engineering: [
        { name: 'Mathematics', grade: 'A', credits: 4 },
        { name: 'Physics', grade: 'A+', credits: 4 },
        { name: 'Chemistry', grade: 'B+', credits: 3 },
        { name: 'Programming', grade: 'O', credits: 4 },
        { name: 'English', grade: 'A', credits: 2 }
      ],
      medical: [
        { name: 'Anatomy', grade: 'A', credits: 5 },
        { name: 'Physiology', grade: 'A+', credits: 4 },
        { name: 'Biochemistry', grade: 'B+', credits: 3 },
        { name: 'Pharmacology', grade: 'A', credits: 4 }
      ],
      commerce: [
        { name: 'Accounting', grade: 'A', credits: 4 },
        { name: 'Economics', grade: 'A+', credits: 3 },
        { name: 'Business Studies', grade: 'A', credits: 4 },
        { name: 'Statistics', grade: 'B+', credits: 3 }
      ]
    };

    const preset = presets[type];
    const startId = Math.max(...subjects.map(s => s.id)) + 1;
    const newSubjects = preset.map((p, idx) => ({
      id: startId + idx,
      name: p.name,
      grade: p.grade,
      gpa: gradeToGPA(p.grade, gradeScale),
      credits: p.credits,
      semester: currentSemester
    }));

    setSubjects([...subjects, ...newSubjects]);
  };

  const calculateCGPA = () => {
    if (subjects.length === 0) return { cgpa: 0, percentage: 0, totalCredits: 0 };
    
    const totalCredits = subjects.reduce((sum, s) => sum + s.credits, 0);
    const weightedSum = subjects.reduce((sum, s) => sum + (s.gpa * s.credits), 0);
    const cgpa = totalCredits > 0 ? weightedSum / totalCredits : 0;
    
    // Convert to percentage (assuming 10-point scale)
    const percentage = gradeScale === '10' ? (cgpa * 9.5) : (cgpa * 25);
    
    return { cgpa, percentage, totalCredits };
  };

  const { cgpa, percentage, totalCredits } = calculateCGPA();

  const getSemesterSubjects = (sem: number) => subjects.filter(s => s.semester === sem);
  const semesters = Array.from(new Set(subjects.map(s => s.semester))).sort((a, b) => a - b);

  return (
    <main className={styles.container}>
      <section className={styles.box}>
        <h1 className={styles.pageTitle}>
          <span className={styles.icon}>📘</span>
          CGPA Calculator
        </h1>
        <p className={styles.subtitle}>Calculate Cumulative Grade Point Average with credit hours</p>

        <div className={styles.headerSection}>
          <div className={styles.scaleSelector}>
            <label>Grade Scale:</label>
            <div className={styles.scaleBtns}>
              <button 
                className={gradeScale === '10' ? styles.active : ''}
                onClick={() => setGradeScale('10')}
              >
                10-Point
              </button>
              <button 
                className={gradeScale === '4' ? styles.active : ''}
                onClick={() => setGradeScale('4')}
              >
                4-Point
              </button>
            </div>
          </div>

          <div className={styles.presets}>
            <label>Quick Load:</label>
            <div className={styles.presetBtns}>
              <button onClick={() => loadPreset('engineering')} className={styles.presetBtn}>
                ⚙️ Engineering
              </button>
              <button onClick={() => loadPreset('medical')} className={styles.presetBtn}>
                🏥 Medical
              </button>
              <button onClick={() => loadPreset('commerce')} className={styles.presetBtn}>
                💼 Commerce
              </button>
            </div>
          </div>
        </div>

        <div className={styles.bulkSection}>
          <label>Bulk Add Subjects (Format: Name, Grade, Credits)</label>
          <div className={styles.bulkRow}>
            <textarea
              value={bulkInput}
              onChange={(e) => setBulkInput(e.target.value)}
              placeholder={`Mathematics, A, 4
Physics, A+, 4
Chemistry, B+, 3`}
              className={styles.bulkInput}
            />
            <button onClick={bulkAddSubjects} className={styles.bulkBtn}>
              Add Subjects
            </button>
          </div>
        </div>

        <div className={styles.semesterControl}>
          <label>Current Semester:</label>
          <input 
            type="number" 
            min="1" 
            max="12" 
            value={currentSemester}
            onChange={(e) => setCurrentSemester(parseInt(e.target.value) || 1)}
            className={styles.semesterInput}
          />
          <button onClick={addSubject} className={styles.addBtn}>
            + Add Subject
          </button>
        </div>

        <div className={styles.subjectsList}>
          {semesters.map(sem => (
            <div key={sem} className={styles.semesterGroup}>
              <h3>Semester {sem}</h3>
              {getSemesterSubjects(sem).map(subject => (
                <div key={subject.id} className={styles.subjectRow}>
                  <input
                    type="text"
                    value={subject.name}
                    onChange={(e) => updateSubject(subject.id, 'name', e.target.value)}
                    className={styles.nameInput}
                    placeholder="Subject name"
                  />
                  <input
                    type="text"
                    value={subject.grade}
                    onChange={(e) => updateSubject(subject.id, 'grade', e.target.value)}
                    className={styles.gradeInput}
                    placeholder="Grade"
                  />
                  <input
                    type="number"
                    value={subject.gpa}
                    onChange={(e) => updateSubject(subject.id, 'gpa', e.target.value)}
                    className={styles.gpaInput}
                    step="0.1"
                    min="0"
                    max={gradeScale === '10' ? '10' : '4'}
                    placeholder="GPA"
                  />
                  <input
                    type="number"
                    value={subject.credits}
                    onChange={(e) => updateSubject(subject.id, 'credits', parseInt(e.target.value) || 0)}
                    className={styles.creditsInput}
                    min="1"
                    max="6"
                    placeholder="Cr"
                  />
                  <button 
                    onClick={() => removeSubject(subject.id)} 
                    className={styles.removeBtn}
                    disabled={subjects.length <= 1}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className={styles.resultCard}>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>CGPA</span>
            <span className={styles.resultValue}>{cgpa.toFixed(2)}</span>
          </div>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Percentage</span>
            <span className={styles.resultValue}>{percentage.toFixed(1)}%</span>
          </div>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Total Credits</span>
            <span className={styles.resultValue}>{totalCredits}</span>
          </div>
        </div>
      </section>

      <ToolInfo
        howItWorks="1. Enter GPA for each subject.<br>2. Add more subjects if needed.<br>3. View calculated CGPA."
        faqs={[
          { title: "What is CGPA?", content: "Cumulative Grade Point Average - average of all subject GPAs." },
          { title: "GPA scale?", content: "Typically 0-10 or 0-4, depending on your institution." }
        ]}
        tips={["Ensure all GPAs are on the same scale. Minimum 1 subject required."]}
      />
    </main>
  );
}
