"use client";

import { useMemo, useState } from "react";
import FaqSchema from "@/components/FaqSchema";
import RichSeoContent from "@/components/RichSeoContent";
import ToolInfo from "@/components/ToolInfo";
import { getRelatedTools } from "@/lib/siteData";
import styles from "./gpa.module.css";

interface Course {
  id: number;
  name: string;
  grade: string;
  credits: number;
  completed: boolean;
}

const gradePoints: Record<string, number> = {
  "A+": 4.0,
  A: 4.0,
  "A-": 3.7,
  "B+": 3.3,
  B: 3.0,
  "B-": 2.7,
  "C+": 2.3,
  C: 2.0,
  "C-": 1.7,
  "D+": 1.3,
  D: 1.0,
  F: 0.0,
};

const faqItems = [
  {
    question: "How is GPA calculated?",
    answer:
      "GPA is calculated by multiplying each course grade point by its credits, adding the totals, and dividing by total completed credits.",
  },
  {
    question: "Does this GPA calculator support weighted credits?",
    answer:
      "Yes. Each course has its own credit value, so higher-credit subjects influence the GPA more strongly.",
  },
  {
    question: "Can I use this for semester GPA and cumulative GPA?",
    answer:
      "Yes. Use only one term's courses for semester GPA, or enter courses across terms if you want a combined cumulative view.",
  },
  {
    question: "What if my college uses a different grading scale?",
    answer:
      "This page uses a standard 4.0 scale. If your institution uses a different scale, convert grades carefully before entering them.",
  },
  {
    question: "Can the calculator help with target GPA planning?",
    answer:
      "Yes. Mark future courses as pending and the tool estimates the average grade points needed to hit your target GPA.",
  },
  {
    question: "Is the GPA calculator useful for Indian colleges?",
    answer:
      "It is useful whenever your grades can be mapped to a 4.0 scale, and it also helps students compare GPA-style scoring with percentage workflows.",
  },
];

const relatedTools = getRelatedTools("/tools/education/gpa");

export default function GPACalculator() {
  const [courses, setCourses] = useState<Course[]>([
    { id: 1, name: "Course 1", grade: "A", credits: 3, completed: true },
  ]);
  const [targetGPA, setTargetGPA] = useState<number>(3.5);
  const [bulkInput, setBulkInput] = useState("");

  const nextId = useMemo(
    () => (courses.length ? Math.max(...courses.map((course) => course.id)) + 1 : 1),
    [courses]
  );

  const addCourse = () => {
    setCourses((current) => [
      ...current,
      { id: nextId, name: `Course ${nextId}`, grade: "A", credits: 3, completed: true },
    ]);
  };

  const bulkAddCourses = () => {
    const lines = bulkInput.split("\n").map((line) => line.trim()).filter(Boolean);
    if (lines.length === 0) {
      return;
    }

    const newCourses = lines.map((line, index) => {
      const parts = line.split(",").map((part) => part.trim());
      const parsedGrade = parts[1] && gradePoints[parts[1]] !== undefined ? parts[1] : "A";
      const parsedCredits = Number.parseInt(parts[2] ?? "", 10);

      return {
        id: nextId + index,
        name: parts[0] || `Course ${nextId + index}`,
        grade: parsedGrade,
        credits: Number.isNaN(parsedCredits) ? 3 : parsedCredits,
        completed: true,
      };
    });

    setCourses((current) => [...current, ...newCourses]);
    setBulkInput("");
  };

  const loadPreset = (type: "science" | "arts" | "business") => {
    const presets = {
      science: [
        { name: "Calculus", grade: "A", credits: 4 },
        { name: "Physics", grade: "A-", credits: 4 },
        { name: "Chemistry", grade: "B+", credits: 3 },
        { name: "Biology", grade: "A", credits: 3 },
        { name: "Lab", grade: "A+", credits: 1 },
      ],
      arts: [
        { name: "Literature", grade: "A", credits: 3 },
        { name: "History", grade: "A-", credits: 3 },
        { name: "Philosophy", grade: "B+", credits: 3 },
        { name: "Art History", grade: "A", credits: 3 },
      ],
      business: [
        { name: "Accounting", grade: "A", credits: 3 },
        { name: "Marketing", grade: "A-", credits: 3 },
        { name: "Finance", grade: "B+", credits: 3 },
        { name: "Management", grade: "A", credits: 3 },
      ],
    };

    setCourses((current) => [
      ...current,
      ...presets[type].map((preset, index) => ({
        id: nextId + index,
        name: preset.name,
        grade: preset.grade,
        credits: preset.credits,
        completed: true,
      })),
    ]);
  };

  const removeCourse = (id: number) => {
    if (courses.length > 1) {
      setCourses((current) => current.filter((course) => course.id !== id));
    }
  };

  const updateCourse = (id: number, field: keyof Course, value: string | number | boolean) => {
    setCourses((current) =>
      current.map((course) => (course.id === id ? { ...course, [field]: value } : course))
    );
  };

  const stats = useMemo(() => {
    const completed = courses.filter((course) => course.completed);
    const pending = courses.filter((course) => !course.completed);

    let completedPoints = 0;
    let completedCredits = 0;

    completed.forEach((course) => {
      const points = gradePoints[course.grade] || 0;
      completedPoints += points * course.credits;
      completedCredits += course.credits;
    });

    const currentGPA = completedCredits > 0 ? completedPoints / completedCredits : 0;
    const pendingCredits = pending.reduce((sum, course) => sum + course.credits, 0);
    const totalCredits = completedCredits + pendingCredits;

    let requiredGrade = 0;
    if (pendingCredits > 0 && totalCredits > 0) {
      const requiredPoints = targetGPA * totalCredits - completedPoints;
      requiredGrade = requiredPoints / pendingCredits;
    }

    return {
      currentGPA: Math.round(currentGPA * 100) / 100,
      percentage: Math.round(currentGPA * 25),
      completedCredits,
      pendingCredits,
      totalCredits,
      requiredGrade: Math.max(0, Math.min(4, requiredGrade)),
    };
  }, [courses, targetGPA]);

  const gradeDistribution = useMemo(() => {
    return courses
      .filter((course) => course.completed)
      .reduce<Record<string, number>>((distribution, course) => {
        distribution[course.grade] = (distribution[course.grade] || 0) + 1;
        return distribution;
      }, {});
  }, [courses]);

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>
        <span className={styles.icon}>\uD83C\uDFAF</span>
        GPA Calculator
      </h1>
      <p className={styles.subtitle}>
        Calculate current GPA, plan your target GPA, and understand how credit-weighted grades affect your semester or cumulative average.
      </p>

      <div className={styles.calculator}>
        <div className={styles.inputSection}>
          <div className={styles.headerSection}>
            <h2>Your courses</h2>
            <div className={styles.presetBtns}>
              <button type="button" onClick={() => loadPreset("science")} className={styles.presetBtn}>
                Science preset
              </button>
              <button type="button" onClick={() => loadPreset("arts")} className={styles.presetBtn}>
                Arts preset
              </button>
              <button type="button" onClick={() => loadPreset("business")} className={styles.presetBtn}>
                Business preset
              </button>
            </div>
          </div>

          <div className={styles.bulkSection}>
            <label htmlFor="bulk-courses">Quick add with the format Name, Grade, Credits</label>
            <div className={styles.bulkRow}>
              <textarea
                id="bulk-courses"
                value={bulkInput}
                onChange={(event) => setBulkInput(event.target.value)}
                placeholder={`Calculus, A, 4\nPhysics, A-, 4\nChemistry, B+, 3`}
                className={styles.bulkInput}
              />
              <button type="button" onClick={bulkAddCourses} className={styles.bulkBtn}>
                Add all
              </button>
            </div>
          </div>

          {courses.map((course) => (
            <div key={course.id} className={styles.courseRow}>
              <input
                type="checkbox"
                checked={course.completed}
                onChange={(event) => updateCourse(course.id, "completed", event.target.checked)}
                className={styles.checkbox}
                title="Mark as completed"
              />
              <input
                type="text"
                placeholder="Course name"
                value={course.name}
                onChange={(event) => updateCourse(course.id, "name", event.target.value)}
                className={styles.courseName}
              />

              <select
                value={course.grade}
                onChange={(event) => updateCourse(course.id, "grade", event.target.value)}
                className={styles.gradeSelect}
              >
                {Object.keys(gradePoints).map((grade) => (
                  <option key={grade} value={grade}>
                    {grade}
                  </option>
                ))}
              </select>

              <input
                type="number"
                min="1"
                max="6"
                value={course.credits}
                onChange={(event) => updateCourse(course.id, "credits", Number.parseInt(event.target.value, 10) || 1)}
                className={styles.creditsInput}
                placeholder="Cr"
              />

              {courses.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeCourse(course.id)}
                  className={styles.removeBtn}
                  title="Remove course"
                >
                  x
                </button>
              )}
            </div>
          ))}

          <button type="button" onClick={addCourse} className={styles.addBtn}>
            + Add course
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
              {stats.pendingCredits > 0 && <span> | {stats.pendingCredits} pending</span>}
            </div>
          </div>

          <div className={styles.targetSection}>
            <h3>Target GPA</h3>
            <div className={styles.targetInput}>
              <input
                type="number"
                min="0"
                max="4"
                step="0.1"
                value={targetGPA}
                onChange={(event) => setTargetGPA(Number.parseFloat(event.target.value) || 3.5)}
                className={styles.targetGPAInput}
              />
              <span className={styles.targetLabel}>Goal</span>
            </div>

            {stats.pendingCredits > 0 && (
              <div className={styles.prediction}>
                <p className={styles.predictionText}>
                  To reach <strong>{targetGPA.toFixed(1)}</strong>, you need an average of:
                </p>
                <div className={styles.requiredGrade}>{stats.requiredGrade.toFixed(2)}</div>
                <p className={styles.gradeEquiv}>
                  Approx. {stats.requiredGrade >= 3.85 ? "A+" : stats.requiredGrade >= 3.5 ? "A" : stats.requiredGrade >= 3.15 ? "A-" : stats.requiredGrade >= 2.85 ? "B+" : stats.requiredGrade >= 2.5 ? "B" : stats.requiredGrade >= 2.15 ? "B-" : "C+"} average
                </p>
              </div>
            )}

            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: `${Math.min(100, (stats.currentGPA / 4) * 100)}%` }} />
            </div>
          </div>

          <div className={styles.gradeDistribution}>
            <h3>Grade distribution</h3>
            <div className={styles.distributionGrid}>
              {Object.entries(gradeDistribution).map(([grade, count]) => (
                <div key={grade} className={styles.distItem}>
                  <span className={styles.distGrade}>{grade}</span>
                  <span className={styles.distCount}>x{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.gradeScale}>
            <h3>Grade scale (4.0)</h3>
            <div className={styles.scaleGrid}>
              {Object.entries(gradePoints)
                .slice(0, 6)
                .map(([grade, points]) => (
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
        howItWorks="Add each course with its grade and credit hours.<br>Mark future classes as pending to plan for a target GPA.<br>Use bulk input when you want to paste several courses at once.<br>The calculator uses a standard 4.0 weighted GPA formula."
        faqs={faqItems.map((item) => ({ title: item.question, content: item.answer }))}
        tips={[
          "Double-check credits because higher-credit subjects influence GPA more strongly.",
          "Use semester-only courses when you want a term GPA instead of a cumulative GPA.",
          "Compare the result with your college handbook if your grading scale differs from 4.0.",
        ]}
      />

      <RichSeoContent
        introTitle="How this GPA calculator helps beyond a basic score"
        introText={[
          "Many GPA calculator pages only show an input form and a single result. This page goes further by helping students understand credit-weighted grades, future planning, and the difference between completed and pending courses. That added context matters for users who are trying to improve academic performance, estimate scholarship eligibility, or compare semester outcomes.",
          "From an SEO perspective, richer explanatory content also makes the page more useful for searches like college GPA calculator, semester GPA calculator, GPA vs percentage, and target GPA calculator. Those longer queries are often easier to win than a broad head term alone.",
        ]}
        steps={[
          "Enter each completed course with its letter grade and credit value.",
          "Add pending subjects and uncheck them if you want to forecast your target GPA.",
          "Adjust the target GPA field to see the average grade points you need next.",
          "Review the grade distribution and total completed credits before making decisions.",
        ]}
        benefits={[
          "Supports semester planning and cumulative GPA estimation in one interface.",
          "Works well for students comparing credit-heavy and credit-light subjects.",
          "Makes the target GPA requirement easy to understand at a glance.",
          "Adds enough explanation to be helpful for first-time users, not just returning students.",
        ]}
        faqItems={faqItems}
        relatedTools={relatedTools}
      />

      <FaqSchema items={faqItems} />
    </main>
  );
}
