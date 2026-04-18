"use client";

import { useMemo, useState } from "react";
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

type GradeScale = "10" | "4";
type SubjectField = keyof Subject;
type SubjectValue = string | number;

export default function CGPACalc() {
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: 1, name: "Subject 1", grade: "A", gpa: 10, credits: 3, semester: 1 },
  ]);
  const [currentSemester, setCurrentSemester] = useState(1);
  const [bulkInput, setBulkInput] = useState("");
  const [gradeScale, setGradeScale] = useState<GradeScale>("10");

  const gradeToGPA = (grade: string, scale: GradeScale): number => {
    if (scale === "10") {
      const gradeMap: Record<string, number> = {
        O: 10,
        "A+": 9,
        A: 8.5,
        "B+": 8,
        B: 7.5,
        "C+": 7,
        C: 6.5,
        D: 6,
        F: 0,
      };
      return gradeMap[grade.toUpperCase()] || 0;
    }

    const gradeMap: Record<string, number> = {
      "A+": 4,
      A: 4,
      "A-": 3.7,
      "B+": 3.3,
      B: 3,
      "B-": 2.7,
      "C+": 2.3,
      C: 2,
      "C-": 1.7,
      "D+": 1.3,
      D: 1,
      F: 0,
    };
    return gradeMap[grade.toUpperCase()] || 0;
  };

  const addSubject = () => {
    const newId = Math.max(...subjects.map((subject) => subject.id)) + 1;
    setSubjects((previous) => [
      ...previous,
      {
        id: newId,
        name: `Subject ${newId}`,
        grade: "A",
        gpa: gradeScale === "10" ? 8.5 : 4,
        credits: 3,
        semester: currentSemester,
      },
    ]);
  };

  const updateSubject = (id: number, field: SubjectField, value: SubjectValue) => {
    setSubjects((previous) =>
      previous.map((subject) => {
        if (subject.id !== id) return subject;

        const updated: Subject = { ...subject, [field]: value } as Subject;

        if (field === "grade" && typeof value === "string") {
          updated.grade = value;
          updated.gpa = gradeToGPA(value, gradeScale);
        }

        if (field === "gpa") {
          updated.gpa = typeof value === "number" ? value : parseFloat(value) || 0;
        }

        if (field === "credits") {
          updated.credits = typeof value === "number" ? value : parseInt(value, 10) || 0;
        }

        if (field === "semester") {
          updated.semester = typeof value === "number" ? value : parseInt(value, 10) || 1;
        }

        if (field === "name" && typeof value === "string") {
          updated.name = value;
        }

        return updated;
      })
    );
  };

  const removeSubject = (id: number) => {
    if (subjects.length > 1) {
      setSubjects((previous) => previous.filter((subject) => subject.id !== id));
    }
  };

  const bulkAddSubjects = () => {
    const lines = bulkInput.split("\n").map((line) => line.trim()).filter(Boolean);
    if (lines.length === 0) return;

    const startId = Math.max(...subjects.map((subject) => subject.id)) + 1;
    const newSubjects: Subject[] = lines.map((line, index) => {
      const parts = line.split(",").map((part) => part.trim());
      const name = parts[0] || `Subject ${startId + index}`;
      const grade = parts[1] || "A";
      const credits = parseInt(parts[2], 10) || 3;

      return {
        id: startId + index,
        name,
        grade,
        gpa: gradeToGPA(grade, gradeScale),
        credits,
        semester: currentSemester,
      };
    });

    setSubjects((previous) => [...previous, ...newSubjects]);
    setBulkInput("");
  };

  const loadPreset = (type: "engineering" | "medical" | "commerce") => {
    const presets = {
      engineering: [
        { name: "Mathematics", grade: "A", credits: 4 },
        { name: "Physics", grade: "A+", credits: 4 },
        { name: "Chemistry", grade: "B+", credits: 3 },
        { name: "Programming", grade: "O", credits: 4 },
        { name: "English", grade: "A", credits: 2 },
      ],
      medical: [
        { name: "Anatomy", grade: "A", credits: 5 },
        { name: "Physiology", grade: "A+", credits: 4 },
        { name: "Biochemistry", grade: "B+", credits: 3 },
        { name: "Pharmacology", grade: "A", credits: 4 },
      ],
      commerce: [
        { name: "Accounting", grade: "A", credits: 4 },
        { name: "Economics", grade: "A+", credits: 3 },
        { name: "Business Studies", grade: "A", credits: 4 },
        { name: "Statistics", grade: "B+", credits: 3 },
      ],
    };

    const preset = presets[type];
    const startId = Math.max(...subjects.map((subject) => subject.id)) + 1;
    const newSubjects: Subject[] = preset.map((presetItem, index) => ({
      id: startId + index,
      name: presetItem.name,
      grade: presetItem.grade,
      gpa: gradeToGPA(presetItem.grade, gradeScale),
      credits: presetItem.credits,
      semester: currentSemester,
    }));

    setSubjects((previous) => [...previous, ...newSubjects]);
  };

  const semesters = useMemo(
    () => Array.from(new Set(subjects.map((subject) => subject.semester))).sort((a, b) => a - b),
    [subjects]
  );

  const { cgpa, percentage, totalCredits } = useMemo(() => {
    if (subjects.length === 0) {
      return { cgpa: 0, percentage: 0, totalCredits: 0 };
    }

    const credits = subjects.reduce((sum, subject) => sum + subject.credits, 0);
    const weightedSum = subjects.reduce((sum, subject) => sum + subject.gpa * subject.credits, 0);
    const score = credits > 0 ? weightedSum / credits : 0;
    const resultPercentage = gradeScale === "10" ? score * 9.5 : score * 25;

    return { cgpa: score, percentage: resultPercentage, totalCredits: credits };
  }, [gradeScale, subjects]);

  const getSemesterSubjects = (semester: number) => subjects.filter((subject) => subject.semester === semester);

  return (
    <main className={styles.container}>
      <section className={styles.box}>
        <h1 className={styles.pageTitle}>
          <span className={styles.icon}>CGPA</span>
          CGPA Calculator
        </h1>
        <p className={styles.subtitle}>Calculate cumulative GPA across semesters with credits, presets, and percentage estimates.</p>

        <div className={styles.headerSection}>
          <div className={styles.scaleSelector}>
            <label>Grade Scale:</label>
            <div className={styles.scaleBtns}>
              <button className={gradeScale === "10" ? styles.active : ""} onClick={() => setGradeScale("10")}>10-Point</button>
              <button className={gradeScale === "4" ? styles.active : ""} onClick={() => setGradeScale("4")}>4-Point</button>
            </div>
          </div>

          <div className={styles.presets}>
            <label>Quick Load:</label>
            <div className={styles.presetBtns}>
              <button onClick={() => loadPreset("engineering")} className={styles.presetBtn}>Engineering</button>
              <button onClick={() => loadPreset("medical")} className={styles.presetBtn}>Medical</button>
              <button onClick={() => loadPreset("commerce")} className={styles.presetBtn}>Commerce</button>
            </div>
          </div>
        </div>

        <div className={styles.bulkSection}>
          <label>Bulk Add Subjects (Format: Name, Grade, Credits)</label>
          <div className={styles.bulkRow}>
            <textarea
              value={bulkInput}
              onChange={(event) => setBulkInput(event.target.value)}
              placeholder={`Mathematics, A, 4\nPhysics, A+, 4\nChemistry, B+, 3`}
              className={styles.bulkInput}
            />
            <button onClick={bulkAddSubjects} className={styles.bulkBtn}>Add Subjects</button>
          </div>
        </div>

        <div className={styles.semesterControl}>
          <label>Current Semester:</label>
          <input type="number" min="1" max="12" value={currentSemester} onChange={(event) => setCurrentSemester(parseInt(event.target.value, 10) || 1)} className={styles.semesterInput} />
          <button onClick={addSubject} className={styles.addBtn}>+ Add Subject</button>
        </div>

        <div className={styles.subjectsList}>
          {semesters.map((semester) => (
            <div key={semester} className={styles.semesterGroup}>
              <h3>Semester {semester}</h3>
              {getSemesterSubjects(semester).map((subject) => (
                <div key={subject.id} className={styles.subjectRow}>
                  <input type="text" value={subject.name} onChange={(event) => updateSubject(subject.id, "name", event.target.value)} className={styles.nameInput} placeholder="Subject name" />
                  <input type="text" value={subject.grade} onChange={(event) => updateSubject(subject.id, "grade", event.target.value)} className={styles.gradeInput} placeholder="Grade" />
                  <input type="number" value={subject.gpa} onChange={(event) => updateSubject(subject.id, "gpa", event.target.value)} className={styles.gpaInput} step="0.1" min="0" max={gradeScale === "10" ? "10" : "4"} placeholder="GPA" />
                  <input type="number" value={subject.credits} onChange={(event) => updateSubject(subject.id, "credits", parseInt(event.target.value, 10) || 0)} className={styles.creditsInput} min="1" max="6" placeholder="Cr" />
                  <button onClick={() => removeSubject(subject.id)} className={styles.removeBtn} disabled={subjects.length <= 1}>x</button>
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
        howItWorks="Select your grading scale<br>Add subjects one by one or paste them in bulk<br>Enter grade, GPA, and credit values for each semester<br>Review the live CGPA, percentage estimate, and total credits"
        faqs={[
          { title: 'What is CGPA?', content: 'CGPA stands for Cumulative Grade Point Average, which combines grades from multiple subjects or semesters into a single score.' },
          { title: 'How is CGPA calculated?', content: 'The calculator multiplies each subject GPA by its credits, sums the values, and divides by the total credits.' },
          { title: 'Can I use 4-point and 10-point scales?', content: 'Yes, the tool supports both common grading systems.' },
          { title: 'Is the percentage exact?', content: 'The percentage is an estimate based on common conversion formulas and may differ by institution.' },
        ]}
        tips={[
          'Credits matter, so high-credit subjects influence your CGPA more strongly.',
          'Use presets to create a quick sample and adjust values from there.',
          'Bulk add is helpful when you already have a semester list in spreadsheet format.',
        ]}
      />
    </main>
  );
}
