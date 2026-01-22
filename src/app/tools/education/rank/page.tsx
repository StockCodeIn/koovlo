"use client";

import { useState } from "react";
import styles from "./rank.module.css";
import ToolInfo from "@/components/ToolInfo";

interface Student {
  id: number;
  name: string;
  score: number;
}

interface RankedStudent extends Student {
  rank: number;
}

export default function RankCalculator() {
  const [students, setStudents] = useState<Student[]>([
    { id: 1, name: "Student 1", score: 0 },
    { id: 2, name: "Student 2", score: 0 }
  ]);
  const [results, setResults] = useState<{
    rankings: RankedStudent[];
    statistics: {
      highest: number;
      lowest: number;
      average: number;
      median: number;
      totalStudents: number;
    };
  } | null>(null);

  const addStudent = () => {
    const newId = Math.max(...students.map(s => s.id)) + 1;
    setStudents([...students, { id: newId, name: `Student ${newId}`, score: 0 }]);
  };

  const removeStudent = (id: number) => {
    if (students.length > 2) {
      setStudents(students.filter(s => s.id !== id));
    }
  };

  const updateStudent = (id: number, field: 'name' | 'score', value: string | number) => {
    setStudents(students.map(s =>
      s.id === id ? { ...s, [field]: value } : s
    ));
  };

  const calculateRankings = () => {
    // Sort students by score in descending order (highest first)
    const sortedStudents = [...students].sort((a, b) => b.score - a.score);

    // Calculate rankings with ties
    const rankedStudents: RankedStudent[] = [];
    let currentRank = 1;
    
    for (let i = 0; i < sortedStudents.length; i++) {
      const student = sortedStudents[i];
      const prevStudent = sortedStudents[i - 1];
      
      if (prevStudent && prevStudent.score === student.score) {
        // Same score as previous, same rank
        rankedStudents.push({ ...student, rank: currentRank });
      } else {
        // Different score, increment rank
        currentRank = i + 1;
        rankedStudents.push({ ...student, rank: currentRank });
      }
    }

    // Calculate statistics
    const scores = students.map(s => s.score);
    const highest = Math.max(...scores);
    const lowest = Math.min(...scores);
    const average = scores.reduce((a, b) => a + b, 0) / scores.length;
    const sortedScores = [...scores].sort((a, b) => a - b);
    const median = sortedScores.length % 2 === 0
      ? (sortedScores[sortedScores.length / 2 - 1] + sortedScores[sortedScores.length / 2]) / 2
      : sortedScores[Math.floor(sortedScores.length / 2)];

    setResults({
      rankings: rankedStudents,
      statistics: {
        highest,
        lowest,
        average,
        median,
        totalStudents: students.length
      }
    });
  };

  const clearAll = () => {
    setStudents([
      { id: 1, name: "Student 1", score: 0 },
      { id: 2, name: "Student 2", score: 0 }
    ]);
    setResults(null);
  };

  const getPercentile = (rank: number, total: number): number => {
    return ((total - rank) / (total - 1)) * 100;
  };

  const getGradeFromPercentile = (percentile: number): string => {
    if (percentile >= 90) return "A+";
    if (percentile >= 80) return "A";
    if (percentile >= 70) return "B+";
    if (percentile >= 60) return "B";
    if (percentile >= 50) return "C+";
    if (percentile >= 40) return "C";
    if (percentile >= 30) return "D";
    return "F";
  };

  return (
    <main className={styles.container}>
      <section className={styles.tool}>
        <h1 className={styles.title}>
          <span className={styles.icon}>🏆</span>
          Rank Calculator
        </h1>
        <p>Calculate student rankings, percentiles, and class statistics.</p>

        <div className={styles.inputSection}>
          <div className={styles.studentsList}>
            {students.map((student, index) => (
              <div key={student.id} className={styles.studentRow}>
                <div className={styles.studentNumber}>{index + 1}</div>
                <input
                  type="text"
                  value={student.name}
                  onChange={(e) => updateStudent(student.id, 'name', e.target.value)}
                  placeholder="Student name"
                  className={styles.nameInput}
                />
                <input
                  type="number"
                  value={student.score}
                  onChange={(e) => updateStudent(student.id, 'score', parseFloat(e.target.value) || 0)}
                  placeholder="Score"
                  min="0"
                  step="0.1"
                  className={styles.scoreInput}
                />
                {students.length > 2 && (
                  <button
                    onClick={() => removeStudent(student.id)}
                    className={styles.removeBtn}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className={styles.controls}>
            <button onClick={addStudent} className={styles.addBtn}>
              Add Student
            </button>
            <button onClick={calculateRankings} className={styles.calculateBtn}>
              Calculate Rankings
            </button>
            <button onClick={clearAll} className={styles.clearBtn}>
              Clear All
            </button>
          </div>
        </div>

        {results && (
          <div className={styles.resultsSection}>
            <h3>Class Rankings</h3>
            <div className={styles.rankingsTable}>
              <div className={styles.tableHeader}>
                <span>Rank</span>
                <span>Student</span>
                <span>Score</span>
                <span>Percentile</span>
                <span>Grade</span>
              </div>
              {results.rankings.map((student) => {
                const percentile = getPercentile(student.rank, results.statistics.totalStudents);
                const grade = getGradeFromPercentile(percentile);
                return (
                  <div key={student.id} className={styles.tableRow}>
                    <span className={styles.rank}>{student.rank}</span>
                    <span className={styles.name}>{student.name}</span>
                    <span className={styles.score}>{student.score}</span>
                    <span className={styles.percentile}>{percentile.toFixed(1)}%</span>
                    <span className={styles.grade}>{grade}</span>
                  </div>
                );
              })}
            </div>

            <div className={styles.statistics}>
              <h4>Class Statistics</h4>
              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <div className={styles.statLabel}>Highest Score</div>
                  <div className={styles.statValue}>{results.statistics.highest}</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statLabel}>Lowest Score</div>
                  <div className={styles.statValue}>{results.statistics.lowest}</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statLabel}>Average Score</div>
                  <div className={styles.statValue}>{results.statistics.average.toFixed(1)}</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statLabel}>Median Score</div>
                  <div className={styles.statValue}>{results.statistics.median.toFixed(1)}</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statLabel}>Total Students</div>
                  <div className={styles.statValue}>{results.statistics.totalStudents}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className={styles.gradeScale}>
          <h4>Grade Scale Reference</h4>
          <div className={styles.scaleGrid}>
            <div className={styles.scaleItem}>
              <span className={styles.gradeLetter}>A+</span>
              <span>90-100%</span>
            </div>
            <div className={styles.scaleItem}>
              <span className={styles.gradeLetter}>A</span>
              <span>80-89%</span>
            </div>
            <div className={styles.scaleItem}>
              <span className={styles.gradeLetter}>B+</span>
              <span>70-79%</span>
            </div>
            <div className={styles.scaleItem}>
              <span className={styles.gradeLetter}>B</span>
              <span>60-69%</span>
            </div>
            <div className={styles.scaleItem}>
              <span className={styles.gradeLetter}>C+</span>
              <span>50-59%</span>
            </div>
            <div className={styles.scaleItem}>
              <span className={styles.gradeLetter}>C</span>
              <span>40-49%</span>
            </div>
            <div className={styles.scaleItem}>
              <span className={styles.gradeLetter}>D</span>
              <span>30-39%</span>
            </div>
            <div className={styles.scaleItem}>
              <span className={styles.gradeLetter}>F</span>
              <span>0-29%</span>
            </div>
          </div>
        </div>
      </section>

      <ToolInfo
        howItWorks="1. Add students with their names and scores.<br>2. Click 'Calculate Rankings' to see rankings and statistics.<br>3. View percentile rankings and grade assignments.<br>4. Check class statistics for insights into performance distribution."
        faqs={[
          {
            title: "How are ranks calculated?",
            content: "Students are ranked by score in descending order. Ties receive the same rank number."
          },
          {
            title: "What is percentile ranking?",
            content: "Percentile shows what percentage of students scored lower than the individual student."
          },
          {
            title: "How are grades assigned?",
            content: "Grades are based on percentile performance using a standard grading scale."
          }
        ]}
        tips={[
          "Use this tool for class rankings, competitions, or scholarship evaluations",
          "Percentiles help identify top performers and those who may need extra help",
          "Consider both absolute scores and relative performance when evaluating students",
          "Regular ranking analysis can help track class progress over time"
        ]}
      />
    </main>
  );
}