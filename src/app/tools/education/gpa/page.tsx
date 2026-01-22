'use client';

import { useState } from 'react';
import ToolInfo from '@/components/ToolInfo';
import styles from './gpa.module.css';

interface Course {
  id: number;
  name: string;
  grade: string;
  credits: number;
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
    { id: 1, name: 'Course 1', grade: 'A', credits: 3 },
  ]);
  const [gpa, setGpa] = useState<number>(0);

  const addCourse = () => {
    const newId = Math.max(...courses.map(c => c.id)) + 1;
    setCourses([...courses, { id: newId, name: `Course ${newId}`, grade: 'A', credits: 3 }]);
  };

  const removeCourse = (id: number) => {
    if (courses.length > 1) {
      setCourses(courses.filter(c => c.id !== id));
    }
  };

  const updateCourse = (id: number, field: keyof Course, value: string | number) => {
    setCourses(courses.map(c =>
      c.id === id ? { ...c, [field]: value } : c
    ));
  };

  const calculateGPA = () => {
    let totalPoints = 0;
    let totalCredits = 0;

    courses.forEach(course => {
      const points = gradePoints[course.grade] || 0;
      totalPoints += points * course.credits;
      totalCredits += course.credits;
    });

    const calculatedGPA = totalCredits > 0 ? totalPoints / totalCredits : 0;
    setGpa(Math.round(calculatedGPA * 100) / 100);
  };

  return (
    <main className={styles.container}>
      <h1>GPA Calculator</h1>

      <div className={styles.calculator}>
        <div className={styles.inputSection}>
          <h2>Add Your Courses</h2>

          {courses.map((course, index) => (
            <div key={course.id} className={styles.courseRow}>
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
                placeholder="Credits"
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
            Add Course
          </button>

          <button onClick={calculateGPA} className={styles.calculateBtn}>
            Calculate GPA
          </button>
        </div>

        <div className={styles.resultSection}>
          <h2>Your GPA</h2>
          <div className={styles.gpaDisplay}>
            <span className={styles.gpaValue}>{gpa.toFixed(2)}</span>
            <span className={styles.gpaLabel}>GPA</span>
          </div>

          <div className={styles.gradeScale}>
            <h3>Grade Scale</h3>
            <div className={styles.scaleGrid}>
              {Object.entries(gradePoints).map(([grade, points]) => (
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