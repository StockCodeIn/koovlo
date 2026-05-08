import type { Metadata } from "next";
import Link from "next/link";
import { getToolByPath, type ToolRecord } from "@/lib/siteData";
import styles from "../guides.module.css";

const relatedTools = [
  getToolByPath("/tools/education/gpa"),
  getToolByPath("/tools/education/cgpa"),
  getToolByPath("/tools/education/percentage"),
].filter((tool): tool is ToolRecord => Boolean(tool));

export const metadata: Metadata = {
  title: "GPA vs CGPA: Difference, Formula, and Calculator Guide | Koovlo",
  description:
    "A simple guide to GPA and CGPA formulas, semester examples, and when to use each academic calculator.",
  alternates: {
    canonical: "https://www.koovlo.com/guides/gpa-vs-cgpa-calculator-guide",
  },
};

export default function GpaVsCgpaGuide() {
  return (
    <main className={styles.container}>
      <section className={styles.hero}>
        <span className={styles.eyebrow}>Student Guide</span>
        <h1>GPA vs CGPA: what is the difference and how do you calculate both?</h1>
        <p>
          Students often confuse GPA and CGPA because both measure academic performance. The main difference is scope:
          GPA usually refers to one term or one snapshot, while CGPA tracks performance across multiple semesters.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Simple difference</h2>
        <ul>
          <li>GPA is usually the grade point average for one semester or one group of courses.</li>
          <li>CGPA is the cumulative grade point average across semesters or the full program.</li>
          <li>Percentage calculators help when schools or job forms ask for marks instead of grade points.</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>How to think about the formula</h2>
        <p>
          Both calculations usually depend on credits and grade points, not just raw marks. That is why weighted subjects
          matter. A high score in a low-credit subject does not affect the result as much as a strong score in a core subject.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Why this matters for search intent</h2>
        <p>
          Students do not search only for a calculator. They also search for explanations like GPA vs CGPA, semester GPA,
          CGPA to percentage, and target score planning. Supporting guides help tool pages rank for these broader question-driven queries.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Related tools</h2>
        <div className={styles.toolLinks}>
          {relatedTools.map((tool) => (
            <Link key={tool.path} href={tool.path} className={styles.toolLink}>
              <span>{tool.icon}</span>
              <span>{tool.title}</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
