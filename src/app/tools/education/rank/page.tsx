"use client";

import { useEffect, useMemo, useState } from "react";
import ToolInfo from "@/components/ToolInfo";
import styles from "./rank.module.css";

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

const STORAGE_KEY = 'rank-calculator-assessments';

const getInitialAssessments = (): Assessment[] => {
  if (typeof window === 'undefined') return [];

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved ? (JSON.parse(saved) as Assessment[]) : [];
  } catch (error) {
    console.error('Error loading assessments:', error);
    return [];
  }
};

export default function RankCalculator() {
  const [students, setStudents] = useState<Student[]>([
    { id: 1, name: 'Student 1', score: 0 },
    { id: 2, name: 'Student 2', score: 0 },
  ]);
  const [assessmentName, setAssessmentName] = useState('Assessment 1');
  const [assessments, setAssessments] = useState<Assessment[]>(getInitialAssessments());
  const [results, setResults] = useState<Assessment | null>(null);
  const [lastSaved, setLastSaved] = useState('');
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(assessments));
  }, [assessments]);

  const performance = useMemo(() => {
    const performanceMap = new Map<number, StudentPerformance>();

    assessments.forEach((assessment) => {
      assessment.rankings.forEach((ranked) => {
        if (!performanceMap.has(ranked.id)) {
          performanceMap.set(ranked.id, {
            studentId: ranked.id,
            name: ranked.name,
            scores: [],
            avgScore: 0,
            improvement: 0,
            consistency: 0,
          });
        }
        performanceMap.get(ranked.id)?.scores.push(ranked.score);
      });
    });

    return Array.from(performanceMap.values())
      .map((item) => {
        const avgScore = item.scores.reduce((a, b) => a + b, 0) / item.scores.length;
        const improvement = item.scores[0] - (item.scores[item.scores.length - 1] ?? 0);
        const variance = item.scores.reduce((sum, score) => sum + Math.pow(score - avgScore, 2), 0) / item.scores.length;
        const consistency = 100 - Math.min(Math.sqrt(variance), 100);
        return { ...item, avgScore, improvement, consistency };
      })
      .sort((a, b) => b.avgScore - a.avgScore);
  }, [assessments]);

  const addStudent = () => {
    const newId = Math.max(...students.map((student) => student.id)) + 1;
    setStudents((previous) => [...previous, { id: newId, name: `Student ${newId}`, score: 0 }]);
  };

  const removeStudent = (id: number) => {
    if (students.length > 2) {
      setStudents((previous) => previous.filter((student) => student.id !== id));
    }
  };

  const updateStudent = (id: number, field: 'name' | 'score', value: string | number) => {
    setStudents((previous) => previous.map((student) => (student.id === id ? { ...student, [field]: value } : student)));
  };

  const calculateRankings = () => {
    const sortedStudents = [...students].sort((a, b) => b.score - a.score);
    const rankedStudents: RankedStudent[] = [];
    let currentRank = 1;

    for (let index = 0; index < sortedStudents.length; index += 1) {
      const student = sortedStudents[index];
      const previousStudent = sortedStudents[index - 1];
      if (previousStudent && previousStudent.score === student.score) {
        rankedStudents.push({ ...student, rank: currentRank });
      } else {
        currentRank = index + 1;
        rankedStudents.push({ ...student, rank: currentRank });
      }
    }

    const scores = students.map((student) => student.score);
    const highest = Math.max(...scores);
    const lowest = Math.min(...scores);
    const average = scores.reduce((a, b) => a + b, 0) / scores.length;
    const sortedScores = [...scores].sort((a, b) => a - b);
    const median = sortedScores.length % 2 === 0
      ? (sortedScores[sortedScores.length / 2 - 1] + sortedScores[sortedScores.length / 2]) / 2
      : sortedScores[Math.floor(sortedScores.length / 2)];
    const variance = scores.reduce((sum, score) => sum + Math.pow(score - average, 2), 0) / scores.length;
    const stdDev = Math.sqrt(variance);

    const newAssessment: Assessment = {
      id: `${Date.now()}`,
      name: assessmentName,
      date: new Date().toLocaleDateString(),
      rankings: rankedStudents,
      statistics: {
        highest,
        lowest,
        average,
        median,
        totalStudents: students.length,
        stdDev,
      },
    };

    setAssessments((previous) => [newAssessment, ...previous]);
    setResults(newAssessment);
    setLastSaved(new Date().toLocaleTimeString());
  };

  const clearAll = () => {
    setStudents([
      { id: 1, name: 'Student 1', score: 0 },
      { id: 2, name: 'Student 2', score: 0 },
    ]);
    setResults(null);
    setAssessmentName('Assessment 1');
  };

  const exportData = () => {
    const data = { assessments, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `rank-data-${Date.now()}.json`;
    anchor.click();
  };

  const deleteAssessment = (id: string) => {
    const updated = assessments.filter((assessment) => assessment.id !== id);
    setAssessments(updated);
    if (results?.id === id) {
      setResults(null);
    }
  };

  const getPercentile = (rank: number, total: number): number => {
    if (total <= 1) return 100;
    return ((total - rank) / (total - 1)) * 100;
  };

  const getGradeFromPercentile = (percentile: number): string => {
    if (percentile >= 90) return 'A+';
    if (percentile >= 80) return 'A';
    if (percentile >= 70) return 'B+';
    if (percentile >= 60) return 'B';
    if (percentile >= 50) return 'C+';
    if (percentile >= 40) return 'C';
    if (percentile >= 30) return 'D';
    return 'F';
  };

  return (
    <main className={styles.container}>
      <section className={styles.tool}>
        <div className={styles.header}>
          <h1 className={styles.title}>Rank Calculator</h1>
          <p className={styles.subtitle}>Track student rankings across multiple assessments with saved history and analytics.</p>
          <div className={styles.dataInfo}>
            <span className={styles.infoItem}><strong>Auto-save:</strong> All assessments are stored locally</span>
            <span className={styles.infoSeparator}>•</span>
            <span className={styles.infoItem}>{lastSaved ? <><strong>Last saved:</strong> {lastSaved}</> : 'Ready to calculate'}</span>
          </div>
        </div>

        {assessments.length > 0 && (
          <div className={styles.smartDashboard}>
            <div className={styles.dashboardSection}>
              <h3>Performance Insights</h3>
              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <span className={styles.statNumber}>{assessments.length}</span>
                  <span className={styles.statName}>Total Assessments</span>
                </div>
                <div className={styles.statCard}>
                  <span className={styles.statNumber}>{new Set(assessments.flatMap((assessment) => assessment.rankings.map((student) => student.id))).size}</span>
                  <span className={styles.statName}>Total Students</span>
                </div>
                <div className={styles.statCard}>
                  <span className={styles.statNumber}>{results ? results.statistics.average.toFixed(1) : '-'}</span>
                  <span className={styles.statName}>Class Average</span>
                </div>
                <div className={styles.statCard}>
                  <span className={styles.statNumber}>{results ? results.statistics.stdDev.toFixed(1) : '-'}</span>
                  <span className={styles.statName}>Std Deviation</span>
                </div>
              </div>
            </div>

            {performance.length > 0 && (
              <div className={styles.dashboardSection}>
                <h3>Top Performers</h3>
                <div className={styles.topPerformers}>
                  {performance.slice(0, 3).map((item, index) => (
                    <div key={item.studentId} className={styles.performerCard}>
                      <div className={styles.performerRank}>{index + 1}</div>
                      <div className={styles.performerInfo}>
                        <div className={styles.performerName}>{item.name}</div>
                        <div className={styles.performerStats}>Avg: {item.avgScore.toFixed(1)} | Consistency: {item.consistency.toFixed(0)}%</div>
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
            <input type="text" value={assessmentName} onChange={(event) => setAssessmentName(event.target.value)} placeholder="Assessment name..." className={styles.assessmentNameInput} />
          </div>

          <div className={styles.studentsList}>
            {students.map((student, index) => (
              <div key={student.id} className={styles.studentRow}>
                <div className={styles.studentNumber}>{index + 1}</div>
                <input type="text" value={student.name} onChange={(event) => updateStudent(student.id, 'name', event.target.value)} placeholder="Student name" className={styles.nameInput} />
                <input type="number" value={student.score} onChange={(event) => updateStudent(student.id, 'score', parseFloat(event.target.value) || 0)} placeholder="Score" min="0" step="0.1" className={styles.scoreInput} />
                {students.length > 2 && <button onClick={() => removeStudent(student.id)} className={styles.removeBtn}>×</button>}
              </div>
            ))}
          </div>

          <div className={styles.controls}>
            <button onClick={addStudent} className={styles.addBtn}>Add Student</button>
            <button onClick={calculateRankings} className={styles.calculateBtn}>Calculate Rankings</button>
            <button onClick={() => setShowAnalytics((value) => !value)} className={styles.analyticsBtn}>Analytics</button>
            <button onClick={() => setShowHistory((value) => !value)} className={styles.historyBtn}>History</button>
            <button onClick={exportData} className={styles.exportBtn}>Export</button>
            <button onClick={clearAll} className={styles.clearBtn}>Clear All</button>
          </div>
        </div>

        {results && (
          <div className={styles.resultsSection}>
            <div className={styles.resultsHeader}>
              <h3>{results.name} - {results.date}</h3>
              <button onClick={() => deleteAssessment(results.id)} className={styles.deleteBtn}>Delete Assessment</button>
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
          </div>
        )}

        {showHistory && assessments.length > 0 && (
          <div className={styles.historySection}>
            <h3>Assessment History</h3>
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
                      <button onClick={() => { setResults(assessment); setShowHistory(false); }} className={styles.viewBtn}>View</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {showAnalytics && performance.length > 0 && (
          <div className={styles.analyticsSection}>
            <h3>Student Performance Analytics</h3>
            <div className={styles.performanceTable}>
              <div className={styles.tableHeader}>
                <span>Student</span>
                <span>Avg Score</span>
                <span>Consistency</span>
                <span>Trend</span>
              </div>
              {performance.map((item) => (
                <div key={item.studentId} className={styles.tableRow}>
                  <span className={styles.name}>{item.name}</span>
                  <span className={styles.score}>{item.avgScore.toFixed(1)}</span>
                  <span className={styles.consistency}>
                    <div className={styles.consistencyBar}><div className={styles.consistencyFill} style={{ width: `${item.consistency}%` }} /></div>
                    {item.consistency.toFixed(0)}%
                  </span>
                  <span className={styles.trend}>{item.improvement > 0 ? `Up +${item.improvement.toFixed(1)}` : item.improvement < 0 ? `Down ${item.improvement.toFixed(1)}` : 'No change'}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className={styles.gradeScale}>
          <h4>Grade Scale Reference</h4>
          <div className={styles.scaleGrid}>
            <div className={styles.scaleItem}><span className={styles.gradeLetter}>A+</span><span>90-100%</span></div>
            <div className={styles.scaleItem}><span className={styles.gradeLetter}>A</span><span>80-89%</span></div>
            <div className={styles.scaleItem}><span className={styles.gradeLetter}>B+</span><span>70-79%</span></div>
            <div className={styles.scaleItem}><span className={styles.gradeLetter}>B</span><span>60-69%</span></div>
            <div className={styles.scaleItem}><span className={styles.gradeLetter}>C+</span><span>50-59%</span></div>
            <div className={styles.scaleItem}><span className={styles.gradeLetter}>C</span><span>40-49%</span></div>
            <div className={styles.scaleItem}><span className={styles.gradeLetter}>D</span><span>30-39%</span></div>
            <div className={styles.scaleItem}><span className={styles.gradeLetter}>F</span><span>0-29%</span></div>
          </div>
        </div>
      </section>

      <ToolInfo
        howItWorks="Add students with their names and scores<br>Click Calculate Rankings to generate ranks and class statistics<br>Review percentile and grade information<br>Use history and analytics to compare assessments over time"
        faqs={[
          { title: 'How are ranks calculated?', content: 'Students are sorted by score in descending order, and tied scores receive the same rank.' },
          { title: 'What is percentile ranking?', content: 'Percentile estimates how many students scored below a given student compared with the rest of the class.' },
          { title: 'How are grades assigned?', content: 'Grades are mapped from percentile ranges using a simple classroom grading scale.' },
        ]}
        tips={[
          'Use this tool for class tests, contests, or scholarship screening rounds.',
          'Comparing multiple assessments helps reveal consistency and improvement trends.',
          'Export history regularly if you want backups outside the browser.',
        ]}
      />
    </main>
  );
}
