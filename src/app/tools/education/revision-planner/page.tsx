"use client";

import { useState, useEffect } from "react";
import styles from "./revision-planner.module.css";
import ToolInfo from "@/components/ToolInfo";

interface Subject {
  id: number;
  name: string;
  topics: string[];
  hoursNeeded: number;
  priority: 'high' | 'medium' | 'low';
}

interface StudySession {
  id: number;
  subjectId: number;
  topic: string;
  date: string;
  duration: number;
  completed: boolean;
}

interface StudyPlan {
  id: string;
  examDate: string;
  dailyStudyHours: number;
  subjects: Subject[];
  sessions: StudySession[];
  createdAt: string;
  completionRate: number;
}

interface SubjectPerformance {
  subjectId: number;
  name: string;
  totalHours: number;
  completedHours: number;
  completionRate: number;
  efficiency: number;
}

export default function RevisionPlanner() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [plans, setPlans] = useState<StudyPlan[]>([]);
  const [newSubject, setNewSubject] = useState({
    name: "",
    topics: "",
    hoursNeeded: 0,
    priority: "medium" as const
  });
  const [examDate, setExamDate] = useState("");
  const [dailyStudyHours, setDailyStudyHours] = useState(2);
  const [lastSaved, setLastSaved] = useState("");
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("revision-planner-data");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setSubjects(data.subjects || []);
        setSessions(data.sessions || []);
        setPlans(data.plans || []);
      } catch (e) {
        console.error("Error loading data:", e);
      }
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem("revision-planner-data", JSON.stringify({
      subjects,
      sessions,
      plans
    }));
    setLastSaved(new Date().toLocaleTimeString());
  }, [subjects, sessions, plans]);

  const addSubject = () => {
    if (!newSubject.name.trim()) {
      alert('Please enter a subject name.');
      return;
    }
    
    if (newSubject.hoursNeeded <= 0) {
      alert('Please enter hours needed (must be greater than 0).');
      return;
    }

    const subject: Subject = {
      id: Date.now(),
      name: newSubject.name,
      topics: newSubject.topics.split(',').map(t => t.trim()).filter(t => t),
      hoursNeeded: newSubject.hoursNeeded,
      priority: newSubject.priority
    };

    setSubjects([...subjects, subject]);
    setNewSubject({
      name: "",
      topics: "",
      hoursNeeded: 0,
      priority: "medium"
    });
  };

  const removeSubject = (id: number) => {
    setSubjects(subjects.filter(s => s.id !== id));
    setSessions(sessions.filter(s => s.subjectId !== id));
  };

  const generateStudyPlan = () => {
    if (!examDate || subjects.length === 0) {
      alert('Please add at least one subject and set an exam date before generating a study plan.');
      return;
    }

    const examDateObj = new Date(examDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day
    examDateObj.setHours(0, 0, 0, 0); // Reset time to start of day
    
    const daysUntilExam = Math.ceil((examDateObj.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilExam <= 0) {
      alert('Please select a future exam date.');
      return;
    }

    const totalHoursNeeded = subjects.reduce((sum, subject) => sum + subject.hoursNeeded, 0);
    const availableHours = daysUntilExam * dailyStudyHours;

    if (availableHours < totalHoursNeeded) {
      alert(`Warning: You need ${totalHoursNeeded} hours but only have ${availableHours} hours available. Consider extending your study period or reducing study hours per day.`);
    }

    // Generate sessions with priority-weighted distribution
    const newSessions: StudySession[] = [];
    let sessionId = Date.now();

    // Sort subjects by priority
    const sortedSubjects = [...subjects].sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    sortedSubjects.forEach(subject => {
      const sessionsForSubject = Math.ceil(subject.hoursNeeded / 2);
      const topicsPerSession = Math.ceil(subject.topics.length / sessionsForSubject);

      for (let i = 0; i < sessionsForSubject; i++) {
        const sessionTopics = subject.topics.slice(i * topicsPerSession, (i + 1) * topicsPerSession);
        const sessionDate = new Date(today);
        sessionDate.setDate(today.getDate() + Math.floor((i * daysUntilExam) / sessionsForSubject));

        newSessions.push({
          id: sessionId++,
          subjectId: subject.id,
          topic: sessionTopics.join(', '),
          date: sessionDate.toISOString().split('T')[0],
          duration: Math.min(2, subject.hoursNeeded - (i * 2)),
          completed: false
        });
      }
    });

    const sortedSessions = newSessions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    setSessions(sortedSessions);

    // Save plan to history
    const completionRate = 0;
    const newPlan: StudyPlan = {
      id: Date.now().toString(),
      examDate,
      dailyStudyHours,
      subjects: JSON.parse(JSON.stringify(subjects)),
      sessions: JSON.parse(JSON.stringify(sortedSessions)),
      createdAt: new Date().toISOString(),
      completionRate
    };
    setPlans([newPlan, ...plans]);
    
    // Success feedback
    alert(`Study plan generated successfully! ${sortedSessions.length} study sessions created over ${daysUntilExam} days.`);
  };

  const toggleSessionComplete = (id: number) => {
    setSessions(sessions.map(session =>
      session.id === id ? { ...session, completed: !session.completed } : session
    ));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#dc3545';
      case 'medium': return '#ffc107';
      case 'low': return '#28a745';
      default: return '#6c757d';
    }
  };

  const getTotalStats = () => {
    const totalSessions = sessions.length;
    const completedSessions = sessions.filter(s => s.completed).length;
    const totalHours = sessions.reduce((sum, s) => sum + s.duration, 0);
    const completedHours = sessions.filter(s => s.completed).reduce((sum, s) => sum + s.duration, 0);
    const completionRate = totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0;

    return { totalSessions, completedSessions, totalHours, completedHours, completionRate };
  };

  const getSubjectPerformance = (): SubjectPerformance[] => {
    return subjects.map(subject => {
      const subjectSessions = sessions.filter(s => s.subjectId === subject.id);
      const completedSessions = subjectSessions.filter(s => s.completed);
      const totalHours = subjectSessions.reduce((sum, s) => sum + s.duration, 0);
      const completedHours = completedSessions.reduce((sum, s) => sum + s.duration, 0);
      const completionRate = totalHours > 0 ? Math.round((completedHours / totalHours) * 100) : 0;
      const efficiency = totalHours > 0 ? Math.round((completedHours / subject.hoursNeeded) * 100) : 0;

      return {
        subjectId: subject.id,
        name: subject.name,
        totalHours,
        completedHours,
        completionRate,
        efficiency: Math.min(100, efficiency)
      };
    });
  };

  const getStudyInsights = () => {
    const stats = getTotalStats();
    const performance = getSubjectPerformance();
    const daysRemaining = examDate ? Math.ceil((new Date(examDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0;
    const dailyTarget = stats.totalHours > 0 ? (stats.totalHours - stats.completedHours) / Math.max(daysRemaining, 1) : 0;
    const currentDaily = dailyStudyHours;
    const onTrack = currentDaily >= dailyTarget * 0.8;

    return { stats, performance, daysRemaining, dailyTarget, onTrack };
  };

  const deletePlan = (id: string) => {
    setPlans(plans.filter(p => p.id !== id));
  };

  const stats = getTotalStats();
  const studyInsights = getStudyInsights();

  return (
    <main className={styles.container}>
      <section className={styles.tool}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            📅 Revision Planner
          </h1>
          <p className={styles.subtitle}>
            Plan your study sessions with intelligent analytics and progress tracking
          </p>
          <div className={styles.dataInfo}>
            <span className={styles.infoItem}>
              💾 <strong>Auto-Save:</strong> All study plans are saved
            </span>
            <span className={styles.infoSeparator}>•</span>
            <span className={styles.infoItem}>
              {lastSaved && <><strong>Last saved:</strong> {lastSaved}</>}
            </span>
          </div>
        </div>

        {/* Smart Analytics Dashboard */}
        {sessions.length > 0 && (
          <div className={styles.smartDashboard}>
            <div className={styles.dashboardSection}>
              <h3>📊 Study Progress</h3>
              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <span className={styles.statNumber}>{stats.completionRate}%</span>
                  <span className={styles.statName}>Overall Progress</span>
                </div>
                <div className={styles.statCard}>
                  <span className={styles.statNumber}>{stats.completedSessions}/{stats.totalSessions}</span>
                  <span className={styles.statName}>Sessions Done</span>
                </div>
                <div className={styles.statCard}>
                  <span className={styles.statNumber}>{stats.completedHours.toFixed(1)}/{stats.totalHours.toFixed(1)}</span>
                  <span className={styles.statName}>Study Hours</span>
                </div>
                <div className={styles.statCard}>
                  <span className={styles.statNumber}>{studyInsights.daysRemaining}</span>
                  <span className={styles.statName}>Days Left</span>
                </div>
              </div>
            </div>

            {/* Subject Performance */}
            {getSubjectPerformance().length > 0 && (
              <div className={styles.dashboardSection}>
                <h3>📚 Subject Performance</h3>
                <div className={styles.performanceList}>
                  {getSubjectPerformance().map(perf => (
                    <div key={perf.subjectId} className={styles.performanceItem}>
                      <div className={styles.performanceName}>{perf.name}</div>
                      <div className={styles.performanceBar}>
                        <div
                          className={styles.performanceFill}
                          style={{ width: `${perf.completionRate}%` }}
                        />
                      </div>
                      <div className={styles.performanceStats}>
                        <span>{perf.completedHours.toFixed(1)}/{perf.totalHours.toFixed(1)}h</span>
                        <span>{perf.efficiency}% efficiency</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Study Insights */}
            {studyInsights.onTrack !== undefined && (
              <div className={styles.dashboardSection}>
                <h3>💡 Smart Insights</h3>
                <div className={styles.insightCard}>
                  {studyInsights.onTrack ? (
                    <div className={styles.insightPositive}>
                      ✅ You're on track! Continue at {dailyStudyHours}h/day to finish on time.
                    </div>
                  ) : (
                    <div className={styles.insightWarning}>
                      ⚠️ Behind schedule! Increase to {studyInsights.dailyTarget.toFixed(1)}h/day or extend exam prep time.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        <div className={styles.planner}>
          <div className={styles.setupSection}>
            <h3>Exam Setup</h3>
            <div className={styles.setupGrid}>
              <div className={styles.inputGroup}>
                <label htmlFor="examDate">Exam Date:</label>
                <input
                  id="examDate"
                  type="date"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="dailyHours">Daily Study Hours:</label>
                <input
                  id="dailyHours"
                  type="number"
                  value={dailyStudyHours}
                  onChange={(e) => setDailyStudyHours(parseFloat(e.target.value) || 2)}
                  min="0.5"
                  max="12"
                  step="0.5"
                />
              </div>
            </div>
          </div>

          <div className={styles.subjectsSection}>
            <h3>Subjects & Topics</h3>
            <div className={styles.addSubject}>
              <div className={styles.inputRow}>
                <input
                  type="text"
                  placeholder="Subject name"
                  value={newSubject.name}
                  onChange={(e) => setNewSubject({...newSubject, name: e.target.value})}
                />
                <input
                  type="text"
                  placeholder="Topics (comma separated)"
                  value={newSubject.topics}
                  onChange={(e) => setNewSubject({...newSubject, topics: e.target.value})}
                />
                <input
                  type="number"
                  placeholder="Hours needed"
                  value={newSubject.hoursNeeded || ""}
                  onChange={(e) => setNewSubject({...newSubject, hoursNeeded: parseFloat(e.target.value) || 0})}
                  min="0"
                  step="0.5"
                />
                <select
                  value={newSubject.priority}
                  onChange={(e) => setNewSubject({...newSubject, priority: e.target.value as any})}
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
                <button onClick={addSubject} className={styles.addBtn}>
                  Add Subject
                </button>
              </div>
            </div>

            <div className={styles.subjectsList}>
              {subjects.map(subject => (
                <div key={subject.id} className={styles.subjectCard}>
                  <div className={styles.subjectHeader}>
                    <h4>{subject.name}</h4>
                    <div className={styles.subjectMeta}>
                      <span
                        className={styles.priority}
                        style={{ backgroundColor: getPriorityColor(subject.priority) }}
                      >
                        {subject.priority}
                      </span>
                      <span className={styles.hours}>{subject.hoursNeeded}h</span>
                      <button
                        onClick={() => removeSubject(subject.id)}
                        className={styles.removeBtn}
                      >
                        ×
                      </button>
                    </div>
                  </div>
                  <div className={styles.topics}>
                    {subject.topics.map((topic, index) => (
                      <span key={index} className={styles.topic}>
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.controls}>
            <button
              onClick={generateStudyPlan}
              className={styles.generateBtn}
              disabled={!examDate || subjects.length === 0}
            >
              Generate Study Plan
            </button>
            <button onClick={() => setShowAnalytics(!showAnalytics)} className={styles.analyticsBtn}>
              📈 Analytics
            </button>
            <button onClick={() => setShowHistory(!showHistory)} className={styles.historyBtn}>
              📋 History
            </button>
          </div>

          {sessions.length > 0 && (
            <div className={styles.planSection}>
              <div className={styles.planHeader}>
                <h3>Your Study Plan</h3>
                <div className={styles.stats}>
                  <span>{stats.completedSessions}/{stats.totalSessions} sessions</span>
                  <span>{stats.completedHours.toFixed(1)}/{stats.totalHours.toFixed(1)} hours</span>
                </div>
              </div>

              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${(stats.completedSessions / stats.totalSessions) * 100}%` }}
                ></div>
              </div>

              <div className={styles.sessionsList}>
                {sessions.map(session => {
                  const subject = subjects.find(s => s.id === session.subjectId);
                  return (
                    <div key={session.id} className={`${styles.sessionCard} ${session.completed ? styles.completed : ''}`}>
                      <div className={styles.sessionHeader}>
                        <div className={styles.sessionInfo}>
                          <h4>{subject?.name}</h4>
                          <span className={styles.date}>{new Date(session.date).toLocaleDateString()}</span>
                        </div>
                        <div className={styles.sessionActions}>
                          <span className={styles.duration}>{session.duration}h</span>
                          <input
                            type="checkbox"
                            checked={session.completed}
                            onChange={() => toggleSessionComplete(session.id)}
                          />
                        </div>
                      </div>
                      <p className={styles.topic}>{session.topic}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Study Analytics */}
        {showAnalytics && getSubjectPerformance().length > 0 && (
          <div className={styles.analyticsSection}>
            <h3>📊 Detailed Analytics</h3>
            <div className={styles.analyticsGrid}>
              {getSubjectPerformance().map(perf => (
                <div key={perf.subjectId} className={styles.analyticsCard}>
                  <h4>{perf.name}</h4>
                  <div className={styles.analyticsMetric}>
                    <span>Completion Rate</span>
                    <span className={styles.metricValue}>{perf.completionRate}%</span>
                  </div>
                  <div className={styles.analyticsMetric}>
                    <span>Hours Completed</span>
                    <span className={styles.metricValue}>{perf.completedHours.toFixed(1)}h / {perf.totalHours.toFixed(1)}h</span>
                  </div>
                  <div className={styles.analyticsMetric}>
                    <span>Efficiency Score</span>
                    <span className={styles.metricValue}>{perf.efficiency}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Study Plan History */}
        {showHistory && plans.length > 0 && (
          <div className={styles.historySection}>
            <h3>📋 Study Plan History</h3>
            <div className={styles.plansList}>
              {plans.map(plan => (
                <div key={plan.id} className={styles.planCard}>
                  <div className={styles.planHeader}>
                    <div>
                      <h4>Exam Date: {new Date(plan.examDate).toLocaleDateString()}</h4>
                      <p>Created: {new Date(plan.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className={styles.planMeta}>
                      <span>{plan.subjects.length} subjects</span>
                      <span>{plan.sessions.length} sessions</span>
                      <button onClick={() => deletePlan(plan.id)} className={styles.deleteBtn}>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      
      <ToolInfo
        howItWorks="1. Set your exam date and daily study hours.<br>2. Add subjects with topics and estimated study hours needed.<br>3. Set priority levels for each subject.<br>4. Generate your personalized study plan.<br>5. Check off completed sessions to track progress."
        faqs={[
          {
            title: "How does the planner distribute study time?",
            content: "It allocates study sessions based on hours needed per subject and spreads them evenly across available days."
          },
          {
            title: "What if I need more time than available?",
            content: "The planner will warn you and suggest either extending your study period or reducing daily study hours."
          },
          {
            title: "Can I modify the generated plan?",
            content: "Yes, you can mark sessions as complete and adjust your study schedule as needed."
          }
        ]}
        tips={[
          "Be realistic about daily study hours to avoid burnout",
          "Prioritize difficult subjects with more study time",
          "Include regular breaks and review sessions in your plan",
          "Adjust the plan as you progress and learn your optimal study pace",
          "Use spaced repetition for better long-term retention"
        ]}
      />
      </section>
    </main>
  );
}