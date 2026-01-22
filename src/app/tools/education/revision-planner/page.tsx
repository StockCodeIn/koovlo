"use client";

import { useState } from "react";
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

export default function RevisionPlanner() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [newSubject, setNewSubject] = useState({
    name: "",
    topics: "",
    hoursNeeded: 0,
    priority: "medium" as const
  });
  const [examDate, setExamDate] = useState("");
  const [dailyStudyHours, setDailyStudyHours] = useState(2);

  const addSubject = () => {
    if (!newSubject.name.trim()) return;

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
    if (!examDate || subjects.length === 0) return;

    const examDateObj = new Date(examDate);
    const today = new Date();
    const daysUntilExam = Math.ceil((examDateObj.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilExam <= 0) return;

    const totalHoursNeeded = subjects.reduce((sum, subject) => sum + subject.hoursNeeded, 0);
    const availableHours = daysUntilExam * dailyStudyHours;

    if (availableHours < totalHoursNeeded) {
      alert(`Warning: You need ${totalHoursNeeded} hours but only have ${availableHours} hours available. Consider extending your study period or reducing study hours per day.`);
    }

    // Generate sessions
    const newSessions: StudySession[] = [];
    let sessionId = 1;

    subjects.forEach(subject => {
      const sessionsForSubject = Math.ceil(subject.hoursNeeded / 2); // 2 hours per session
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

    setSessions(newSessions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
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

    return { totalSessions, completedSessions, totalHours, completedHours };
  };

  const stats = getTotalStats();

  return (
    <main className={styles.container}>
      <section className={styles.tool}>
        <h1 className={styles.title}>
          <span className={styles.icon}>📅</span>
          Revision Planner
        </h1>
        <p>Plan your study sessions and track progress towards your exam goals.</p>

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
      </section>

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
    </main>
  );
}