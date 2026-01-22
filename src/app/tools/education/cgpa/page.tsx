"use client";
import { useState } from "react";
import styles from "./cgpa.module.css";
import ToolInfo from "@/components/ToolInfo";

export default function CGPACalc() {
  const [grades, setGrades] = useState<number[]>([0]);

  const addSubject = () => setGrades([...grades, 0]);

  const update = (i: number, val: number) => {
    const g = [...grades];
    g[i] = val;
    setGrades(g);
  };

  const removeSubject = (i: number) => {
    if (grades.length > 1) {
      setGrades(grades.filter((_, idx) => idx !== i));
    }
  };

  const cgpa =
    grades.length > 0
      ? (grades.reduce((a, b) => a + b, 0) / grades.length).toFixed(2)
      : "0";

  return (
    <main className={styles.container}>
      <section className={styles.box}>
        <h1 className={styles.pageTitle}>
          <span className={styles.icon}>📘</span>
          <span className={styles.textGradient}>CGPA Calculator</span>
        </h1>
        <p>Calculate your Cumulative Grade Point Average (CGPA) easily.</p>

        <div className={styles.subjects}>
          {grades.map((g, i) => (
            <div key={i} className={styles.subject}>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                placeholder={`Subject ${i + 1} GPA`}
                value={g || ""}
                onChange={(e) => update(i, +e.target.value)}
              />
              {grades.length > 1 && (
                <button onClick={() => removeSubject(i)} className={styles.removeBtn}>×</button>
              )}
            </div>
          ))}
        </div>

        <button onClick={addSubject} className={styles.addBtn}>
          + Add Subject
        </button>

        <div className={styles.result}>
          <h2>CGPA: {cgpa}</h2>
        </div>
      </section>

      <ToolInfo
        howItWorks="1. Enter GPA for each subject.<br>2. Add more subjects if needed.<br>3. View calculated CGPA."
        faqs={[
          { title: "What is CGPA?", content: "Cumulative Grade Point Average - average of all subject GPAs." },
          { title: "GPA scale?", content: "Typically 0-10 or 0-4, depending on your institution." }
        ]}
        tips={["Ensure all GPAs are on the same scale. Minimum 1 subject required."]}
      />
    </main>
  );
}
