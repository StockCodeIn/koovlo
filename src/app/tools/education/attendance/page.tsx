"use client";

import { useEffect, useMemo, useState } from "react";
import ToolInfo from "@/components/ToolInfo";
import styles from "./attendance.module.css";

type AttendanceStatus = "present" | "absent" | "late" | "excused";

interface Student {
  id: number;
  name: string;
  attendance: AttendanceStatus[];
}

interface AttendanceData {
  students: Student[];
  className: string;
  dates: string[];
}

const STORAGE_KEY = "attendanceData";

function getToday() {
  return new Date().toISOString().split("T")[0];
}

function getInitialData(): AttendanceData {
  const fallback: AttendanceData = {
    students: [
      { id: 1, name: "Student 1", attendance: ["absent"] },
      { id: 2, name: "Student 2", attendance: ["absent"] },
    ],
    className: "My Class",
    dates: [getToday()],
  };

  if (typeof window === "undefined") return fallback;

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return fallback;
    const parsed = JSON.parse(saved) as Partial<AttendanceData>;
    const dates = parsed.dates?.length ? parsed.dates : fallback.dates;
    const students = (parsed.students || fallback.students).map((student, index) => ({
      id: student.id ?? index + 1,
      name: student.name || `Student ${index + 1}`,
      attendance: Array.from({ length: dates.length }, (_, attendanceIndex) => student.attendance?.[attendanceIndex] || "absent"),
    }));

    return {
      students,
      className: parsed.className || fallback.className,
      dates,
    };
  } catch {
    return fallback;
  }
}

export default function AttendanceTracker() {
  const initialData = useMemo(() => getInitialData(), []);
  const [students, setStudents] = useState<Student[]>(initialData.students);
  const [className, setClassName] = useState(initialData.className);
  const [newDate, setNewDate] = useState(initialData.dates[0] || getToday());
  const [dates, setDates] = useState<string[]>(initialData.dates);
  const [viewMode, setViewMode] = useState<"daily" | "summary">("daily");
  const [bulkNames, setBulkNames] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ students, dates, className }));
  }, [students, dates, className]);

  const addStudent = () => {
    const newId = students.length ? Math.max(...students.map((student) => student.id)) + 1 : 1;
    setStudents((current) => [
      ...current,
      { id: newId, name: `Student ${newId}`, attendance: new Array(dates.length).fill("absent") },
    ]);
  };

  const addStudentsFromList = () => {
    const names = bulkNames.split("\n").map((name) => name.trim()).filter(Boolean);
    if (names.length === 0) return;

    const startId = students.length ? Math.max(...students.map((student) => student.id)) + 1 : 1;
    const newStudents = names.map((name, index) => ({
      id: startId + index,
      name,
      attendance: new Array(dates.length).fill("absent") as AttendanceStatus[],
    }));

    setStudents((current) => [...current, ...newStudents]);
    setBulkNames("");
  };

  const markAttendance = (studentId: number, dateIndex: number, status: AttendanceStatus) => {
    setStudents((current) =>
      current.map((student) => {
        if (student.id !== studentId) return student;
        const attendance = [...student.attendance];
        attendance[dateIndex] = status;
        return { ...student, attendance };
      })
    );
  };

  const addDate = () => {
    if (!newDate || dates.includes(newDate)) return;
    setDates((current) => [...current, newDate]);
    setStudents((current) => current.map((student) => ({ ...student, attendance: [...student.attendance, "absent"] })));
  };

  const removeDate = (dateIndex: number) => {
    if (dates.length <= 1) return;
    setDates((current) => current.filter((_, index) => index !== dateIndex));
    setStudents((current) =>
      current.map((student) => ({
        ...student,
        attendance: student.attendance.filter((_, index) => index !== dateIndex),
      }))
    );
  };

  const getAttendanceStats = (student: Student) => {
    const total = student.attendance.length;
    const present = student.attendance.filter((status) => status === "present").length;
    const absent = student.attendance.filter((status) => status === "absent").length;
    const late = student.attendance.filter((status) => status === "late").length;
    const excused = student.attendance.filter((status) => status === "excused").length;
    const percentage = total > 0 ? (((present + late * 0.5 + excused) / total) * 100).toFixed(1) : "0.0";

    return { total, present, absent, late, excused, percentage };
  };

  const getStatusColor = (status: AttendanceStatus) => {
    switch (status) {
      case "present":
        return "#28a745";
      case "absent":
        return "#dc3545";
      case "late":
        return "#ffc107";
      case "excused":
        return "#6c757d";
      default:
        return "#dee2e6";
    }
  };

  return (
    <main className={styles.container}>
      <section className={styles.tool}>
        <h1 className={styles.title}>
          <span className={styles.icon}>Track</span>
          Attendance Tracker
        </h1>
        <p>Track daily attendance, add dates quickly, and review summary performance for each student.</p>

        <div className={styles.tracker}>
          <div className={styles.headerSection}>
            <div className={styles.classInfo}>
              <label htmlFor="class-name">Class Name:</label>
              <input id="class-name" type="text" value={className} onChange={(event) => setClassName(event.target.value)} className={styles.classNameInput} />
            </div>

            <div className={styles.quickDate}>
              <label htmlFor="new-date">Add Date:</label>
              <div className={styles.dateControls}>
                <input id="new-date" type="date" value={newDate} onChange={(event) => setNewDate(event.target.value)} className={styles.dateInput} />
                <button type="button" onClick={addDate} className={styles.addDateBtn}>Add</button>
              </div>
              <div className={styles.quickActions}>
                <button type="button" className={styles.quickBtn} onClick={() => setNewDate(getToday())}>Today</button>
              </div>
            </div>

            <div className={styles.viewToggle}>
              <button type="button" className={viewMode === "daily" ? styles.active : ""} onClick={() => setViewMode("daily")}>Daily View</button>
              <button type="button" className={viewMode === "summary" ? styles.active : ""} onClick={() => setViewMode("summary")}>Summary View</button>
            </div>

            <div className={styles.actions}>
              <button type="button" onClick={addStudent} className={styles.addBtn}>Add Student</button>
              <button type="button" onClick={() => { setStudents(initialData.students); setDates(initialData.dates); setClassName(initialData.className); setNewDate(initialData.dates[0] || getToday()); }} className={styles.clearBtn}>Reset</button>
            </div>
          </div>

          <div className={styles.bulkAdd}>
            <label htmlFor="bulk-students">Quick Add Students (one per line)</label>
            <div className={styles.bulkRow}>
              <textarea id="bulk-students" value={bulkNames} onChange={(event) => setBulkNames(event.target.value)} placeholder={`Amit Sharma\nNeha Singh\nRahul Verma`} className={styles.bulkInput} />
              <button type="button" onClick={addStudentsFromList} className={styles.bulkBtn}>Add Names</button>
            </div>
          </div>

          {viewMode === "daily" ? (
            <div className={styles.dailyView}>
              <div className={styles.desktopView}>
                <div className={styles.datesHeader}>
                  <div className={styles.studentColumn}>Student</div>
                  {dates.map((date, index) => (
                    <div key={date} className={styles.dateColumn}>
                      <div className={styles.date}>{new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</div>
                      <button type="button" onClick={() => removeDate(index)} className={styles.removeDateBtn} disabled={dates.length <= 1}>x</button>
                    </div>
                  ))}
                </div>

                <div className={styles.attendanceGrid}>
                  {students.map((student) => (
                    <div key={student.id} className={styles.studentRow}>
                      <div className={styles.studentInfo}>
                        <input type="text" value={student.name} onChange={(event) => setStudents((current) => current.map((item) => item.id === student.id ? { ...item, name: event.target.value } : item))} className={styles.studentNameInput} />
                        <button type="button" onClick={() => setStudents((current) => current.length > 1 ? current.filter((item) => item.id !== student.id) : current)} className={styles.removeStudentBtn} disabled={students.length <= 1}>x</button>
                      </div>

                      {dates.map((_, dateIndex) => (
                        <div key={`${student.id}-${dateIndex}`} className={styles.attendanceCell}>
                          <select value={student.attendance[dateIndex] || "absent"} onChange={(event) => markAttendance(student.id, dateIndex, event.target.value as AttendanceStatus)} style={{ backgroundColor: getStatusColor(student.attendance[dateIndex] || "absent") }}>
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

              <div className={styles.mobileView}>
                {dates.map((date, dateIndex) => (
                  <div key={date} className={styles.dateCard}>
                    <div className={styles.dateCardHeader}>
                      <h3>{new Date(date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</h3>
                      <button type="button" onClick={() => removeDate(dateIndex)} className={styles.removeDateBtn} disabled={dates.length <= 1}>x</button>
                    </div>
                    <div className={styles.dateCardBody}>
                      {students.map((student) => (
                        <div key={student.id} className={styles.mobileAttendanceRow}>
                          <div className={styles.mobileStudentInfo}>
                            <div className={styles.studentName}>{student.name}</div>
                          </div>
                          <select value={student.attendance[dateIndex] || "absent"} onChange={(event) => markAttendance(student.id, dateIndex, event.target.value as AttendanceStatus)} style={{ backgroundColor: getStatusColor(student.attendance[dateIndex] || "absent") }} className={styles.mobileSelect}>
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
                {students.map((student) => {
                  const stats = getAttendanceStats(student);
                  return (
                    <div key={student.id} className={styles.summaryCard}>
                      <h4>{student.name}</h4>
                      <div className={styles.stats}>
                        <div className={styles.stat}><span className={styles.statValue} style={{ color: "#28a745" }}>{stats.present}</span><span className={styles.statLabel}>Present</span></div>
                        <div className={styles.stat}><span className={styles.statValue} style={{ color: "#dc3545" }}>{stats.absent}</span><span className={styles.statLabel}>Absent</span></div>
                        <div className={styles.stat}><span className={styles.statValue} style={{ color: "#ffc107" }}>{stats.late}</span><span className={styles.statLabel}>Late</span></div>
                        <div className={styles.stat}><span className={styles.statValue} style={{ color: "#6c757d" }}>{stats.excused}</span><span className={styles.statLabel}>Excused</span></div>
                        <div className={styles.stat}><span className={styles.statValue} style={{ color: "#007bff" }}>{stats.percentage}%</span><span className={styles.statLabel}>Attendance</span></div>
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
        howItWorks="1. Name your class and add attendance dates.<br>2. Add students one by one or paste a full list.<br>3. Mark each date as present, absent, late, or excused.<br>4. Switch to summary view for attendance percentages."
        faqs={[
          { title: "How is attendance percentage calculated?", content: "Present counts as 100%, late counts as 50%, excused counts as 100%, and absent counts as 0%." },
          { title: "Does the tracker save progress?", content: "Yes. Attendance data is stored in your browser so it stays available on the same device." },
          { title: "Can I manage this on mobile?", content: "Yes. The page includes a mobile card layout for each date and student list." },
        ]}
        tips={[
          "Use consistent attendance labels so percentages stay meaningful.",
          "Review the summary view to spot patterns early.",
          "Add dates as you go instead of waiting until the end of the week.",
        ]}
      />
    </main>
  );
}

