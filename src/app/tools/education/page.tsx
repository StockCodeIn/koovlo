// src/app/tools/education/page.tsx
import ToolCard from "@/components/ToolCard";
import styles from "../tools-common.module.css";

export const metadata = {
  title: "Education Tools – Koovlo",
  description:
    "Free online calculators and academic tools for students: percentage, CGPA, marks and more.",
};

export default function EducationToolsPage() {
  return (

    <main className={styles.container}>
      <h1 className={styles.pageTitle}>
        <span className={styles.icon}>🎓</span>
        <span className={styles.textGradient}>Education Tools</span>
      </h1>
      <p className={styles.subText}>
        Easy calculators for students and teachers — built for speed and simplicity.
      </p>

      <div className={styles.grid}>
        <ToolCard title="Percentage Calculator" desc="Calculate exam percentage" link="/tools/education/percentage" icon="📊" />
        <ToolCard title="CGPA Calculator" desc="Calculate overall CGPA across all semesters with credits & percentage" link="/tools/education/cgpa" icon="📘" />
        <ToolCard title="GPA Calculator" desc="Calculate current semester GPA and predict required grades for your target" link="/tools/education/gpa" icon="📚" />
        <ToolCard title="Grade Calculator" desc="Calculate weighted grades" link="/tools/education/grade" icon="🎓" />
        <ToolCard title="Attendance Calculator" desc="Track and calculate attendance" link="/tools/education/attendance" icon="📅" />
        <ToolCard title="Rank Calculator" desc="Calculate class rank & percentile" link="/tools/education/rank" icon="🏆" />
        <ToolCard title="Text Summarizer" desc="Summarize long text instantly" link="/tools/education/text-summarizer" icon="📄" />
        <ToolCard title="Flashcard Maker" desc="Create study flashcards" link="/tools/education/flashcard" icon="🃏" />
        <ToolCard title="Quiz Generator" desc="Generate practice quizzes" link="/tools/education/quiz-generator" icon="❓" />
        <ToolCard title="Notes Organizer" desc="Professional note-taking with categories, tags, pinning, and advanced organization" link="/tools/education/notes-organizer" icon="📓" />
        <ToolCard title="Revision Planner" desc="Plan your exam revision" link="/tools/education/revision-planner" icon="📅" />
      </div>
    </main >
  );
}
