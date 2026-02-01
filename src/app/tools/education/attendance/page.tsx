"use client";

import { useState, useEffect } from "react";
import styles from "./attendance.module.css";
import ToolInfo from "@/components/ToolInfo";

interface Student {
  id: number;
  name: string;
  attendance: ('present' | 'absent' | 'late' | 'excused')[];
}

export default function AttendanceTracker() {
  const [students, setStudents] = useState<Student[]>([
    { id: 1, name: "Student 1", attendance: [] },
    { id: 2, name: "Student 2", attendance: [] }
  ]);
  const [className, setClassName] = useState("My Class");
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [dates, setDates] = useState<string[]>([new Date().toISOString().split('T')[0]]);
  const [viewMode, setViewMode] = useState<'daily' | 'summary'>('daily');
  const [bulkNames, setBulkNames] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('attendanceData');
      if (saved) {
        try {
          const data = JSON.parse(saved);
          setStudents(data.students);
          setDates(data.dates);
          setClassName(data.className);
        } catch (error) {
          console.error('Failed to load attendance data:', error);
        }
      }
      setIsLoaded(true);
    }
  }, []);

  // Auto-save data to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      localStorage.setItem('attendanceData', JSON.stringify({
        students,
        dates,
        className
      }));
    }
  }, [students, dates, className, isLoaded]);

  const addStudent = () => {
    const newId = Math.max(...students.map(s => s.id)) + 1;
    setStudents([...students, {
      id: newId,
      name: `Student ${newId}`,
      attendance: new Array(dates.length).fill('absent')
    }]);
  };

  const addStudentsFromList = () => {
    const names = bulkNames
      .split("\n")
      .map(name => name.trim())
      .filter(Boolean);

    if (names.length === 0) return;

    const startId = Math.max(...students.map(s => s.id)) + 1;
    const newStudents = names.map((name, index) => ({
      id: startId + index,
      name,
      attendance: new Array(dates.length).fill('absent')
    }));

    setStudents(prev => [...prev, ...newStudents]);
    setBulkNames("");
  };

  const removeStudent = (id: number) => {
    if (students.length > 2) {
      setStudents(students.filter(s => s.id !== id));
    }
  };

  const updateStudentName = (id: number, name: string) => {
    setStudents(students.map(s =>
      s.id === id ? { ...s, name } : s
    ));
  };

  const markAttendance = (studentId: number, dateIndex: number, status: 'present' | 'absent' | 'late' | 'excused') => {
    setStudents(students.map(student => {
      if (student.id === studentId) {
        const newAttendance = [...student.attendance];
        newAttendance[dateIndex] = status;
        return { ...student, attendance: newAttendance };
      }
      return student;
    }));
  };

  const addDate = () => {
    if (!newDate || dates.includes(newDate)) return;
    setDates([...dates, newDate]);

    setStudents(students.map(student => ({
      ...student,
      attendance: [...student.attendance, 'absent']
    })));
  };

  const removeDate = (dateIndex: number) => {
    if (dates.length > 1) {
      setDates(dates.filter((_, index) => index !== dateIndex));
      setStudents(students.map(student => ({
        ...student,
        attendance: student.attendance.filter((_, index) => index !== dateIndex)
      })));
    }
  };

  const markAllForDate = (dateIndex: number, status: 'present' | 'absent' | 'late' | 'excused') => {
    setStudents(students.map(student => {
      const newAttendance = [...student.attendance];
      newAttendance[dateIndex] = status;
      return { ...student, attendance: newAttendance };
    }));
  };

  const getAttendanceStats = (student: Student) => {
    const total = student.attendance.length;
    const present = student.attendance.filter(a => a === 'present').length;
    const absent = student.attendance.filter(a => a === 'absent').length;
    const late = student.attendance.filter(a => a === 'late').length;
    const excused = student.attendance.filter(a => a === 'excused').length;
    const percentage = total > 0 ? ((present + late * 0.5 + excused) / total * 100).toFixed(1) : '0';

    return { total, present, absent, late, excused, percentage };
  };

  const exportReport = () => {
    let report = `${className} - Attendance Report\n\n`;
    report += `Generated on: ${new Date().toLocaleDateString()}\n\n`;

    // Daily view
    report += 'DAILY ATTENDANCE:\n';
    report += 'Date\t\t' + students.map(s => s.name).join('\t') + '\n';
    dates.forEach((date, dateIndex) => {
      report += `${new Date(date).toLocaleDateString()}\t`;
      students.forEach(student => {
        const status = student.attendance[dateIndex] || 'absent';
        const symbol = status === 'present' ? 'P' : status === 'absent' ? 'A' : status === 'late' ? 'L' : 'E';
        report += `${symbol}\t\t`;
      });
      report += '\n';
    });

    report += '\nSUMMARY:\n';
    report += 'Student\t\tPresent\tAbsent\tLate\tExcused\tPercentage\n';
    students.forEach(student => {
      const stats = getAttendanceStats(student);
      report += `${student.name}\t\t${stats.present}\t${stats.absent}\t${stats.late}\t${stats.excused}\t${stats.percentage}%\n`;
    });

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${className.replace(/\s+/g, '_')}_attendance_report.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return '#28a745';
      case 'absent': return '#dc3545';
      case 'late': return '#ffc107';
      case 'excused': return '#6c757d';
      default: return '#dee2e6';
    }
  };

  const clearAllData = () => {
    if (typeof window !== 'undefined' && confirm('Are you sure? This will delete all attendance data.')) {
      setStudents([
        { id: 1, name: "Student 1", attendance: [] },
        { id: 2, name: "Student 2", attendance: [] }
      ]);
      setDates([new Date().toISOString().split('T')[0]]);
      setClassName("My Class");
      localStorage.removeItem('attendanceData');
    }
  };

  const downloadBackup = () => {
    const backup = {
      timestamp: new Date().toISOString(),
      className,
      students,
      dates
    };
    
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className={styles.container}>
      <section className={styles.tool}>
        <h1 className={styles.title}>
          <span className={styles.icon}>📊</span>
          Attendance Tracker
        </h1>
        <p>Track and manage student attendance for your classes.</p>

        <div className={styles.tracker}>
          <div className={styles.headerSection}>
            <div className={styles.classInfo}>
              <label>Class Name:</label>
              <input
                type="text"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                className={styles.classNameInput}
              />
            </div>

            <div className={styles.quickDate}
            >
              <label>Add Date:</label>
              <div className={styles.dateControls}>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className={styles.dateInput}
                />
                <button onClick={addDate} className={styles.addDateBtn}>Add</button>
              </div>
              <div className={styles.quickActions}>
                <button
                  className={styles.quickBtn}
                  onClick={() => setNewDate(new Date().toISOString().split('T')[0])}
                >
                  Today
                </button>
                {dates.length > 0 && (
                  <>
                    <button
                      className={styles.quickBtnPresent}
                      onClick={() => markAllForDate(dates.length - 1, 'present')}
                    >
                      Mark All Present
                    </button>
                    <button
                      className={styles.quickBtnAbsent}
                      onClick={() => markAllForDate(dates.length - 1, 'absent')}
                    >
                      Mark All Absent
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className={styles.viewToggle}>
              <button
                className={viewMode === 'daily' ? styles.active : ''}
                onClick={() => setViewMode('daily')}
              >
                Daily View
              </button>
              <button
                className={viewMode === 'summary' ? styles.active : ''}
                onClick={() => setViewMode('summary')}
              >
                Summary View
              </button>
            </div>

            <div className={styles.actions}>
              <button onClick={addStudent} className={styles.addBtn}>
                Add Student
              </button>
              <button onClick={exportReport} className={styles.exportBtn}>
                Export Report
              </button>
              <button onClick={downloadBackup} className={styles.backupBtn}>
                💾 Backup
              </button>
              <button onClick={clearAllData} className={styles.clearBtn}>
                🗑️ Clear
              </button>
            </div>
          </div>

          <div className={styles.bulkAdd}>
            <label>Quick Add Students (one per line)</label>
            <div className={styles.bulkRow}>
              <textarea
                value={bulkNames}
                onChange={(e) => setBulkNames(e.target.value)}
                placeholder={`Amit Sharma
Neha Singh
Rahul Verma`}
                className={styles.bulkInput}
              />
              <button onClick={addStudentsFromList} className={styles.bulkBtn}>
                Add Names
              </button>
            </div>
          </div>

          {viewMode === 'daily' ? (
            <div className={styles.dailyView}>
              {/* Desktop View */}
              <div className={styles.desktopView}>
                <div className={styles.datesHeader}>
                  <div className={styles.studentColumn}>Student</div>
                  {dates.map((date, index) => (
                    <div key={date} className={styles.dateColumn}>
                      <div className={styles.date}>
                        {new Date(date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                      <button
                        onClick={() => removeDate(index)}
                        className={styles.removeDateBtn}
                        disabled={dates.length <= 1}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>

                <div className={styles.attendanceGrid}>
                  {students.map(student => (
                    <div key={student.id} className={styles.studentRow}>
                      <div className={styles.studentInfo}>
                        <input
                          type="text"
                          value={student.name}
                          onChange={(e) => updateStudentName(student.id, e.target.value)}
                          className={styles.studentNameInput}
                        />
                        <button
                          onClick={() => removeStudent(student.id)}
                          className={styles.removeStudentBtn}
                          disabled={students.length <= 2}
                        >
                          ×
                        </button>
                      </div>

                      {dates.map((_, dateIndex) => (
                        <div key={dateIndex} className={styles.attendanceCell}>
                          <select
                            value={student.attendance[dateIndex] || 'absent'}
                            onChange={(e) => markAttendance(student.id, dateIndex, e.target.value as any)}
                            style={{
                              backgroundColor: getStatusColor(student.attendance[dateIndex] || 'absent')
                            }}
                          >
                            <option value="present">Present</option>
                            <option value="absent">Absent</option>
                            <option value="late">Late</option>
                            <option value="excused">Excused</option>
                          </select>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile View */}
              <div className={styles.mobileView}>
                {dates.map((date, dateIndex) => (
                  <div key={date} className={styles.dateCard}>
                    <div className={styles.dateCardHeader}>
                      <h3>{new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</h3>
                      <button
                        onClick={() => removeDate(dateIndex)}
                        className={styles.removeDateBtn}
                        disabled={dates.length <= 1}
                      >
                        ×
                      </button>
                    </div>
                    <div className={styles.dateCardBody}>
                      {students.map(student => (
                        <div key={student.id} className={styles.mobileAttendanceRow}>
                          <div className={styles.mobileStudentInfo}>
                            <div className={styles.studentName}>
                              {student.name}
                            </div>
                            <button
                              onClick={() => removeStudent(student.id)}
                              className={styles.mobileRemoveBtn}
                              disabled={students.length <= 2}
                              title="Delete student"
                            >
                              ×
                            </button>
                          </div>
                          <select
                            value={student.attendance[dateIndex] || 'absent'}
                            onChange={(e) => markAttendance(student.id, dateIndex, e.target.value as any)}
                            style={{
                              backgroundColor: getStatusColor(student.attendance[dateIndex] || 'absent')
                            }}
                            className={styles.mobileSelect}
                          >
                            <option value="present">Present</option>
                            <option value="absent">Absent</option>
                            <option value="late">Late</option>
                            <option value="excused">Excused</option>
                          </select>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className={styles.summaryView}>
              <div className={styles.summaryHeader}>
                <h3>Attendance Summary</h3>
                <p>Total Days: {dates.length}</p>
              </div>

              <div className={styles.summaryGrid}>
                {students.map(student => {
                  const stats = getAttendanceStats(student);
                  return (
                    <div key={student.id} className={styles.summaryCard}>
                      <h4>{student.name}</h4>
                      <div className={styles.stats}>
                        <div className={styles.stat}>
                          <span className={styles.statValue} style={{ color: '#28a745' }}>
                            {stats.present}
                          </span>
                          <span className={styles.statLabel}>Present</span>
                        </div>
                        <div className={styles.stat}>
                          <span className={styles.statValue} style={{ color: '#dc3545' }}>
                            {stats.absent}
                          </span>
                          <span className={styles.statLabel}>Absent</span>
                        </div>
                        <div className={styles.stat}>
                          <span className={styles.statValue} style={{ color: '#ffc107' }}>
                            {stats.late}
                          </span>
                          <span className={styles.statLabel}>Late</span>
                        </div>
                        <div className={styles.stat}>
                          <span className={styles.statValue} style={{ color: '#6c757d' }}>
                            {stats.excused}
                          </span>
                          <span className={styles.statLabel}>Excused</span>
                        </div>
                        <div className={styles.stat}>
                          <span className={styles.statValue} style={{ color: '#007bff' }}>
                            {stats.percentage}%
                          </span>
                          <span className={styles.statLabel}>Attendance</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      <ToolInfo
        howItWorks="1. Enter class name and add dates quickly.<br>2. Paste student names or add manually.<br>3. Use Mark All Present/Absent for fast entry.<br>4. Switch to summary view for overview.<br>5. Export reports when done."
        faqs={[
          {
            title: "How is attendance percentage calculated?",
            content: "Present = 100%, Late = 50%, Excused = 100%, Absent = 0%. Formula: (Present + Late×0.5 + Excused) ÷ Total Days × 100%"
          },
          {
            title: "Can I add past dates?",
            content: "Currently, dates are added sequentially. You can modify the date input to add specific past dates."
          },
          {
            title: "How do I export the attendance data?",
            content: "Click 'Export Report' to download a text file with both daily attendance and summary statistics."
          }
        ]}
        tips={[
          "Use consistent attendance marking for accurate percentage calculations",
          "Regular attendance tracking helps identify students who need support",
          "Export reports regularly for administrative records",
          "Use the summary view to quickly identify attendance patterns",
          "Consider setting attendance goals and celebrating good attendance"
        ]}
      />
    </main>
  );
}