"use client";

import { useState, useEffect } from "react";
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

interface Assessment {
  id: string;
  name: string;
  date: string;
  rankings: RankedStudent[];
  statistics: {
    highest: number;
    lowest: number;
    average: number;
    median: number;
    totalStudents: number;
    stdDev: number;
  };
}

interface StudentPerformance {
  studentId: number;
  name: string;
  scores: number[];
  avgScore: number;
  improvement: number;
  consistency: number;
}

export default function RankCalculator() {
  const [students, setStudents] = useState<Student[]>([
    { id: 1, name: "Student 1", score: 0 },
    { id: 2, name: "Student 2", score: 0 }
  ]);
  const [assessmentName, setAssessmentName] = useState("Assessment 1");
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [results, setResults] = useState<Assessment | null>(null);
  const [lastSaved, setLastSaved] = useState<string>("");
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("rank-calculator-assessments");
    if (saved) {
      try {
        setAssessments(JSON.parse(saved));
      } catch (e) {
        console.error("Error loading assessments:", e);
      }
    }
  }, []);

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

    // Calculate standard deviation
    const variance = scores.reduce((sum, score) => sum + Math.pow(score - average, 2), 0) / scores.length;
    const stdDev = Math.sqrt(variance);

    const newAssessment: Assessment = {
      id: Date.now().toString(),
      name: assessmentName,
      date: new Date().toLocaleDateString(),
      rankings: rankedStudents,
      statistics: {
        highest,
        lowest,
        average,
        median,
        totalStudents: students.length,
        stdDev
      }
    };

    const updatedAssessments = [newAssessment, ...assessments];
    setAssessments(updatedAssessments);
    setResults(newAssessment);
    setLastSaved(new Date().toLocaleTimeString());
    localStorage.setItem("rank-calculator-assessments", JSON.stringify(updatedAssessments));
  };

  const clearAll = () => {
    setStudents([
      { id: 1, name: "Student 1", score: 0 },
      { id: 2, name: "Student 2", score: 0 }
    ]);
    setResults(null);
    setAssessmentName("Assessment 1");
  };

  const getStudentPerformance = (): StudentPerformance[] => {
    const performanceMap = new Map<number, StudentPerformance>();

    assessments.forEach(assessment => {
      assessment.rankings.forEach(ranked => {
        if (!performanceMap.has(ranked.id)) {
          performanceMap.set(ranked.id, {
            studentId: ranked.id,
            name: ranked.name,
            scores: [],
            avgScore: 0,
            improvement: 0,
            consistency: 0
          });
        }
        performanceMap.get(ranked.id)!.scores.push(ranked.score);
      });
    });

    const performance = Array.from(performanceMap.values());
    performance.forEach(p => {
      p.avgScore = p.scores.reduce((a, b) => a + b, 0) / p.scores.length;
      p.improvement = p.scores[0] - (p.scores[p.scores.length - 1] ?? 0);
      
      const variance = p.scores.reduce((sum, score) => sum + Math.pow(score - p.avgScore, 2), 0) / p.scores.length;
      p.consistency = 100 - Math.min(Math.sqrt(variance), 100);
    });

    return performance.sort((a, b) => b.avgScore - a.avgScore);
  };

  const exportData = () => {
    const data = {
      assessments,
      exportedAt: new Date().toISOString()
    };
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rank-data-${new Date().getTime()}.json`;
    a.click();
  };

  const deleteAssessment = (id: string) => {
    const updated = assessments.filter(a => a.id !== id);
    setAssessments(updated);
    localStorage.setItem("rank-calculator-assessments", JSON.stringify(updated));
    if (results?.id === id) {
      setResults(null);
    }
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
        <div className={styles.header}>
          <h1 className={styles.title}>
            🏆 Rank Calculator
          </h1>
          <p className={styles.subtitle}>
            Track student rankings across multiple assessments with intelligent analytics
          </p>
          <div className={styles.dataInfo}>
            <span className={styles.infoItem}>
              💾 <strong>Auto-Save:</strong> All assessments are saved
            </span>
            <span className={styles.infoSeparator}>•</span>
            <span className={styles.infoItem}>
              {lastSaved && <><strong>Last saved:</strong> {lastSaved}</>}
            </span>
          </div>
        </div>

        {/* Smart Analytics Dashboard */}
        {assessments.length > 0 && (
          <div className={styles.smartDashboard}>
            <div className={styles.dashboardSection}>
              <h3>📊 Performance Insights</h3>
              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <span className={styles.statNumber}>{assessments.length}</span>
                  <span className={styles.statName}>Total Assessments</span>
                </div>
                <div className={styles.statCard}>
                  <span className={styles.statNumber}>{new Set(assessments.flatMap(a => a.rankings.map(r => r.id))).size}</span>
                  <span className={styles.statName}>Total Students</span>
                </div>
                <div className={styles.statCard}>
                  <span className={styles.statNumber}>{results ? results.statistics.average.toFixed(1) : "-"}</span>
                  <span className={styles.statName}>Class Average</span>
                </div>
                <div className={styles.statCard}>
                  <span className={styles.statNumber}>{results ? results.statistics.stdDev.toFixed(1) : "-"}</span>
                  <span className={styles.statName}>Std Deviation</span>
                </div>
              </div>
            </div>

            {/* Student Performance Trends */}
            {getStudentPerformance().length > 0 && (
              <div className={styles.dashboardSection}>
                <h3>⭐ Top Performers</h3>
                <div className={styles.topPerformers}>
                  {getStudentPerformance().slice(0, 3).map((perf, idx) => (
                    <div key={perf.studentId} className={styles.performerCard}>
                      <div className={styles.performerRank}>{idx + 1}</div>
                      <div className={styles.performerInfo}>
                        <div className={styles.performerName}>{perf.name}</div>
                        <div className={styles.performerStats}>
                          Avg: {perf.avgScore.toFixed(1)} | Consistency: {perf.consistency.toFixed(0)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className={styles.inputSection}>
          <div className={styles.assessmentInput}>
            <input
              type="text"
              value={assessmentName}
              onChange={(e) => setAssessmentName(e.target.value)}
              placeholder="Assessment name..."
              className={styles.assessmentNameInput}
            />
          </div>

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
            <button onClick={() => setShowAnalytics(!showAnalytics)} className={styles.analyticsBtn}>
              📈 Analytics
            </button>
            <button onClick={() => setShowHistory(!showHistory)} className={styles.historyBtn}>
              📋 History
            </button>
            <button onClick={exportData} className={styles.exportBtn}>
              📥 Export
            </button>
            <button onClick={clearAll} className={styles.clearBtn}>
              Clear All
            </button>
          </div>
        </div>

        {results && (
          <div className={styles.resultsSection}>
            <div className={styles.resultsHeader}>
              <h3>{results.name} - {results.date}</h3>
              <button onClick={() => deleteAssessment(results.id)} className={styles.deleteBtn}>
                Delete Assessment
              </button>
            </div>
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
                  <div className={styles.statLabel}>Std Deviation</div>
                  <div className={styles.statValue}>{results.statistics.stdDev.toFixed(2)}</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statLabel}>Total Students</div>
                  <div className={styles.statValue}>{results.statistics.totalStudents}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Assessment History */}
        {showHistory && assessments.length > 0 && (
          <div className={styles.historySection}>
            <h3>📋 Assessment History</h3>
            <div className={styles.assessmentsList}>
              {assessments.map((assessment) => (
                <div key={assessment.id} className={styles.assessmentCard}>
                  <div className={styles.assessmentHeader}>
                    <div>
                      <h4>{assessment.name}</h4>
                      <p>{assessment.date}</p>
                    </div>
                    <div className={styles.assessmentMeta}>
                      <span>{assessment.statistics.totalStudents} students</span>
                      <span>Avg: {assessment.statistics.average.toFixed(1)}</span>
                      <button
                        onClick={() => {
                          setResults(assessment);
                          setShowHistory(false);
                        }}
                        className={styles.viewBtn}
                      >
                        View
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Student Performance Analytics */}
        {showAnalytics && getStudentPerformance().length > 0 && (
          <div className={styles.analyticsSection}>
            <h3>📊 Student Performance Analytics</h3>
            <div className={styles.performanceTable}>
              <div className={styles.tableHeader}>
                <span>Student</span>
                <span>Avg Score</span>
                <span>Consistency</span>
                <span>Trend</span>
              </div>
              {getStudentPerformance().map((perf) => (
                <div key={perf.studentId} className={styles.tableRow}>
                  <span className={styles.name}>{perf.name}</span>
                  <span className={styles.score}>{perf.avgScore.toFixed(1)}</span>
                  <span className={styles.consistency}>
                    <div className={styles.consistencyBar}>
                      <div
                        className={styles.consistencyFill}
                        style={{ width: `${perf.consistency}%` }}
                      />
                    </div>
                    {perf.consistency.toFixed(0)}%
                  </span>
                  <span className={styles.trend}>
                    {perf.improvement > 0 ? `📈 +${perf.improvement.toFixed(1)}` : perf.improvement < 0 ? `📉 ${perf.improvement.toFixed(1)}` : "→ No change"}
                  </span>
                </div>
              ))}
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