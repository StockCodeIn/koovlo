'use client';

import { useState } from 'react';
import ToolInfo from '@/components/ToolInfo';
import styles from './gpa.module.css';

interface Course {
  id: number;
  name: string;
  grade: string;
  credits: number;
  completed: boolean;
}

const gradePoints: { [key: string]: number } = {
  'A+': 4.0,
  'A': 4.0,
  'A-': 3.7,
  'B+': 3.3,
  'B': 3.0,
  'B-': 2.7,
  'C+': 2.3,
  'C': 2.0,
  'C-': 1.7,
  'D+': 1.3,
  'D': 1.0,
  'F': 0.0,
};

export default function GPACalculator() {
  const [courses, setCourses] = useState<Course[]>([
    { id: 1, name: 'Course 1', grade: 'A', credits: 3, completed: true },
  ]);
  const [targetGPA, setTargetGPA] = useState<number>(3.5);
  const [bulkInput, setBulkInput] = useState('');

  const addCourse = () => {
    const newId = Math.max(...courses.map(c => c.id)) + 1;
    setCourses([...courses, { id: newId, name: `Course ${newId}`, grade: 'A', credits: 3, completed: true }]);
  };

  const bulkAddCourses = () => {
    const lines = bulkInput.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length === 0) return;

    const startId = Math.max(...courses.map(c => c.id)) + 1;
    const newCourses = lines.map((line, idx) => {
      const parts = line.split(',').map(p => p.trim());
      const name = parts[0] || `Course ${startId + idx}`;
      const grade = parts[1] || 'A';
      const credits = parseInt(parts[2]) || 3;
      
      return {
        id: startId + idx,
        name,
        grade,
        credits,
        completed: true
      };
    });

    setCourses([...courses, ...newCourses]);
    setBulkInput('');
  };

  const loadPreset = (type: 'science' | 'arts' | 'business') => {
    const presets = {
      science: [
        { name: 'Calculus', grade: 'A', credits: 4 },
        { name: 'Physics', grade: 'A-', credits: 4 },
        { name: 'Chemistry', grade: 'B+', credits: 3 },
        { name: 'Biology', grade: 'A', credits: 3 },
        { name: 'Lab', grade: 'A+', credits: 1 }
      ],
      arts: [
        { name: 'Literature', grade: 'A', credits: 3 },
        { name: 'History', grade: 'A-', credits: 3 },
        { name: 'Philosophy', grade: 'B+', credits: 3 },
        { name: 'Art History', grade: 'A', credits: 3 }
      ],
      business: [
        { name: 'Accounting', grade: 'A', credits: 3 },
        { name: 'Marketing', grade: 'A-', credits: 3 },
        { name: 'Finance', grade: 'B+', credits: 3 },
        { name: 'Management', grade: 'A', credits: 3 }
      ]
    };

    const preset = presets[type];
    const startId = Math.max(...courses.map(c => c.id)) + 1;
    const newCourses = preset.map((p, idx) => ({
      id: startId + idx,
      name: p.name,
      grade: p.grade,
      credits: p.credits,
      completed: true
    }));

    setCourses([...courses, ...newCourses]);
  };

  const removeCourse = (id: number) => {
    if (courses.length > 1) {
      setCourses(courses.filter(c => c.id !== id));
    }
  };

  const updateCourse = (id: number, field: keyof Course, value: string | number | boolean) => {
    setCourses(courses.map(c =>
      c.id === id ? { ...c, [field]: value } : c
    ));
  };

  const calculateGPA = () => {
    const completed = courses.filter(c => c.completed);
    const pending = courses.filter(c => !c.completed);

    let completedPoints = 0;
    let completedCredits = 0;

    completed.forEach(course => {
      const points = gradePoints[course.grade] || 0;
      completedPoints += points * course.credits;
      completedCredits += course.credits;
    });

    const currentGPA = completedCredits > 0 ? completedPoints / completedCredits : 0;

    // Calculate what grades needed in pending courses to reach target
    const pendingCredits = pending.reduce((sum, c) => sum + c.credits, 0);
    const totalCredits = completedCredits + pendingCredits;
    
    let requiredGrade = 0;
    if (pendingCredits > 0 && totalCredits > 0) {
      const requiredPoints = (targetGPA * totalCredits) - completedPoints;
      requiredGrade = requiredPoints / pendingCredits;
    }

    return { 
      currentGPA: Math.round(currentGPA * 100) / 100,
      percentage: Math.round(currentGPA * 25),
      completedCredits,
      pendingCredits,
      totalCredits,
      requiredGrade: Math.max(0, Math.min(4, requiredGrade))
    };
  };

  const stats = calculateGPA();

  const getGradeDistribution = () => {
    const dist: { [key: string]: number } = {};
    courses.filter(c => c.completed).forEach(c => {
      dist[c.grade] = (dist[c.grade] || 0) + 1;
    });
    return dist;
  };

  const gradeDistribution = getGradeDistribution();

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>
        <span className={styles.icon}>🎯</span>
        GPA Calculator
      </h1>
      <p className={styles.subtitle}>Calculate current GPA and predict what grades you need to reach your goal</p>

      
      <div className={styles.calculator}>
        <div className={styles.inputSection}>
          <div className={styles.headerSection}>
            <h2>Your Courses</h2>
            <div className={styles.presetBtns}>
              <button onClick={() => loadPreset('science')} className={styles.presetBtn}>
                🔬 Science
              </button>
              <button onClick={() => loadPreset('arts')} className={styles.presetBtn}>
                🎨 Arts
              </button>
              <button onClick={() => loadPreset('business')} className={styles.presetBtn}>
                💼 Business
              </button>
            </div>
          </div>

          <div className={styles.bulkSection}>
            <label>Quick Add (Format: Name, Grade, Credits)</label>
            <div className={styles.bulkRow}>
              <textarea
                value={bulkInput}
                onChange={(e) => setBulkInput(e.target.value)}
                placeholder={`Calculus, A, 4\nPhysics, A-, 4\nChemistry, B+, 3`}
                className={styles.bulkInput}
              />
              <button onClick={bulkAddCourses} className={styles.bulkBtn}>
                Add All
              </button>
            </div>
          </div>

          {courses.map((course) => (
            <div key={course.id} className={styles.courseRow}>
              <input
                type="checkbox"
                checked={course.completed}
                onChange={(e) => updateCourse(course.id, 'completed', e.target.checked)}
                className={styles.checkbox}
                title="Mark as completed"
              />
              <input
                type="text"
                placeholder="Course name"
                value={course.name}
                onChange={(e) => updateCourse(course.id, 'name', e.target.value)}
                className={styles.courseName}
              />

              <select
                value={course.grade}
                onChange={(e) => updateCourse(course.id, 'grade', e.target.value)}
                className={styles.gradeSelect}
              >
                {Object.keys(gradePoints).map(grade => (
                  <option key={grade} value={grade}>{grade}</option>
                ))}
              </select>

              <input
                type="number"
                min="1"
                max="6"
                value={course.credits}
                onChange={(e) => updateCourse(course.id, 'credits', parseInt(e.target.value) || 1)}
                className={styles.creditsInput}
                placeholder="Cr"
              />

              {courses.length > 1 && (
                <button
                  onClick={() => removeCourse(course.id)}
                  className={styles.removeBtn}
                  title="Remove course"
                >
                  ×
                </button>
              )}
            </div>
          ))}

          <button onClick={addCourse} className={styles.addBtn}>
            + Add Course
          </button>
        </div>

        <div className={styles.resultSection}>
          <div className={styles.currentGPA}>
            <h2>Current GPA</h2>
            <div className={styles.gpaDisplay}>
              <span className={styles.gpaValue}>{stats.currentGPA.toFixed(2)}</span>
              <span className={styles.gpaLabel}>{stats.percentage}%</span>
            </div>
            <div className={styles.credits}>
              <span>{stats.completedCredits} credits completed</span>
              {stats.pendingCredits > 0 && <span> • {stats.pendingCredits} pending</span>}
            </div>
          </div>

          <div className={styles.targetSection}>
            <h3>🎯 Target GPA</h3>
            <div className={styles.targetInput}>
              <input
                type="number"
                min="0"
                max="4"
                step="0.1"
                value={targetGPA}
                onChange={(e) => setTargetGPA(parseFloat(e.target.value) || 3.5)}
                className={styles.targetGPAInput}
              />
              <span className={styles.targetLabel}>Goal</span>
            </div>
            
            {stats.pendingCredits > 0 && (
              <div className={styles.prediction}>
                <p className={styles.predictionText}>
                  To reach <strong>{targetGPA.toFixed(1)}</strong>, you need an average of:
                </p>
                <div className={styles.requiredGrade}>
                  {stats.requiredGrade.toFixed(2)}
                </div>
                <p className={styles.gradeEquiv}>
                  ≈ {stats.requiredGrade >= 3.85 ? 'A+' : 
                     stats.requiredGrade >= 3.5 ? 'A' :
                     stats.requiredGrade >= 3.15 ? 'A-' :
                     stats.requiredGrade >= 2.85 ? 'B+' :
                     stats.requiredGrade >= 2.5 ? 'B' :
                     stats.requiredGrade >= 2.15 ? 'B-' : 'C+'} grade
                </p>
              </div>
            )}

            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill} 
                style={{ width: `${Math.min(100, (stats.currentGPA / 4) * 100)}%` }}
              />
            </div>
          </div>

          <div className={styles.gradeDistribution}>
            <h3>Grade Distribution</h3>
            <div className={styles.distributionGrid}>
              {Object.entries(gradeDistribution).map(([grade, count]) => (
                <div key={grade} className={styles.distItem}>
                  <span className={styles.distGrade}>{grade}</span>
                  <span className={styles.distCount}>×{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.gradeScale}>
            <h3>Grade Scale (4.0)</h3>
            <div className={styles.scaleGrid}>
              {Object.entries(gradePoints).slice(0, 6).map(([grade, points]) => (
                <div key={grade} className={styles.scaleItem}>
                  <span className={styles.grade}>{grade}</span>
                  <span className={styles.points}>{points}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ToolInfo
        howItWorks="Enter your course names, grades, and credit hours<br>Add multiple courses using the 'Add Course' button<br>Click 'Calculate GPA' to get your GPA<br>GPA is calculated using standard 4.0 scale"
        faqs={[
          { title: "What is GPA?", content: "GPA stands for Grade Point Average, calculated on a 4.0 scale." },
          { title: "How is GPA calculated?", content: "GPA = (Grade Points × Credits) / Total Credits" },
          { title: "What grades are supported?", content: "A+, A, A-, B+, B, B-, C+, C, C-, D+, D, F" },
          { title: "Can I use different grading scales?", content: "This calculator uses the standard 4.0 scale." }
        ]}
        tips={["Ensure all grades and credits are entered correctly", "Different institutions may have slightly different grade scales", "Minimum 1 course required for calculation"]}
      />
    </main>
  );
}