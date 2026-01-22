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
        <ToolCard title="CGPA Calculator" desc="Calculate CGPA" link="/tools/education/cgpa" icon="📘" />
        <ToolCard title="GPA Calculator" desc="Calculate GPA" link="/tools/education/gpa" icon="📚" />
        <ToolCard title="Marks to Percentage" desc="Convert marks to percentage" link="/tools/education/marks-percentage" icon="🔄" />
        <ToolCard title="Grade Calculator" desc="Calculate grades" link="/tools/education/grade" icon="🎓" />
        <ToolCard title="Attendance Calculator" desc="Calculate attendance percentage" link="/tools/education/attendance" icon="📅" />
        <ToolCard title="Rank Calculator" desc="Calculate rank" link="/tools/education/rank" icon="🏆" />
        <ToolCard title="Word Counter" desc="Count words in text" link="/tools/education/word-counter" icon="📝" />
        <ToolCard title="Reading Time Calculator" desc="Estimate reading time" link="/tools/education/reading-time" icon="⏱️" />
        <ToolCard title="Text Summarizer" desc="Summarize text" link="/tools/education/text-summarizer" icon="📄" />
        <ToolCard title="Flashcard Maker" desc="Create flashcards" link="/tools/education/flashcard" icon="🃏" />
        <ToolCard title="Quiz Generator" desc="Generate quizzes" link="/tools/education/quiz-generator" icon="❓" />
        <ToolCard title="Notes Organizer" desc="Organize notes" link="/tools/education/notes-organizer" icon="📓" />
        <ToolCard title="Scientific Calculator" desc="Advanced calculator" link="/tools/education/scientific-calc" icon="🧮" />
        <ToolCard title="Unit Converter" desc="Convert units" link="/tools/education/unit-converter" icon="🔄" />
        <ToolCard title="Fraction Calculator" desc="Calculate fractions" link="/tools/education/fraction-calc" icon="➗" />
        <ToolCard title="Average Calculator" desc="Calculate averages" link="/tools/education/average" icon="📊" />
        <ToolCard title="Speed Distance Time" desc="Calculate speed, distance, time" link="/tools/education/speed-distance-time" icon="🏃" />
        <ToolCard title="Interest Calculator" desc="Calculate simple/compound interest" link="/tools/education/interest" icon="💰" />
        <ToolCard title="Question Paper Timer" desc="Timer for exams" link="/tools/education/timer" icon="⏰" />
        <ToolCard title="Answer Sheet Generator" desc="Generate answer sheets" link="/tools/education/answer-sheet" icon="📝" />
        <ToolCard title="OMR Sheet Generator" desc="Generate OMR sheets" link="/tools/education/omr-sheet" icon="📋" />
        <ToolCard title="Revision Planner" desc="Plan revisions" link="/tools/education/revision-planner" icon="📅" />
        <ToolCard title="Checklist" desc="Important topics checklist" link="/tools/education/checklist" icon="✅" />
    </div>
    </main >
  );
}
