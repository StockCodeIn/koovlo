// src/app/tools/education/page.tsx
import ToolCard from "@/components/ToolCard";
import styles from "../tools-common.module.css";

const tools = [
  { title: "Percentage Calculator", desc: "Calculate exam percentage instantly.", link: "/tools/education/percentage", icon: "📊" },
  { title: "CGPA Calculator", desc: "Compute CGPA across semesters with credits.", link: "/tools/education/cgpa", icon: "📘" },
  { title: "GPA Calculator", desc: "Calculate semester GPA and target grades.", link: "/tools/education/gpa", icon: "📚" },
  { title: "Grade Calculator", desc: "Calculate weighted grades and final scores.", link: "/tools/education/grade", icon: "🎓" },
  { title: "Attendance Calculator", desc: "Track attendance and required classes.", link: "/tools/education/attendance", icon: "📅" },
  { title: "Rank Calculator", desc: "Estimate rank and percentile quickly.", link: "/tools/education/rank", icon: "🏆" },
  { title: "Text Summarizer", desc: "Summarize long text into key points.", link: "/tools/education/text-summarizer", icon: "📄" },
  { title: "Flashcard Maker", desc: "Create study flashcards in seconds.", link: "/tools/education/flashcard", icon: "🃏" },
  { title: "Quiz Generator", desc: "Generate practice quizzes instantly.", link: "/tools/education/quiz-generator", icon: "❓" },
  { title: "Notes Organizer", desc: "Organize notes with tags and categories.", link: "/tools/education/notes-organizer", icon: "📓" },
  { title: "Revision Planner", desc: "Plan your exam revision schedule.", link: "/tools/education/revision-planner", icon: "📅" },
];

const faqs = [
  {
    q: "Are these education tools free?",
    a: "Yes, all education tools are 100% free and work in your browser.",
  },
  {
    q: "Do I need to sign up?",
    a: "No sign up required. Open any tool and start using it immediately.",
  },
  {
    q: "Are these calculators accurate?",
    a: "Yes. Calculations follow standard academic formulas with clear inputs.",
  },
  {
    q: "Can I use these tools on mobile?",
    a: "Absolutely. All tools are optimized for phones and tablets.",
  },
];

export default function EducationToolsPage() {
  return (
    <main className={styles.container}>
      <section className={styles.hero}>
        <h1 className={styles.pageTitle}>
          <span className={styles.icon}>🎓</span>
          <span className={styles.textGradient}>Education Tools</span>
        </h1>
        <p className={styles.subText}>
          Smart calculators and study utilities for students and teachers — fast, accurate, and mobile-friendly.
        </p>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Popular Education Tools</h2>
          <p>Pick a tool and get results instantly.</p>
        </div>
        <div className={styles.grid}>
          {tools.map((tool) => (
            <ToolCard
              key={tool.title}
              title={tool.title}
              desc={tool.desc}
              link={tool.link}
              icon={tool.icon}
            />
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Why students love Koovlo</h2>
          <p>Built to save time, reduce errors, and study smarter.</p>
        </div>
        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>⚡</div>
            <h3>Instant Results</h3>
            <p>Get accurate calculations in seconds with clean inputs.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>📱</div>
            <h3>Mobile Ready</h3>
            <p>Use any calculator smoothly on mobile or desktop.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>✅</div>
            <h3>Accurate Formulas</h3>
            <p>Standard academic formulas ensure reliable results.</p>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Frequently Asked Questions</h2>
          <p>Quick answers to common questions.</p>
        </div>
        <div className={styles.faqGrid}>
          {faqs.map((item) => (
            <div key={item.q} className={styles.faqCard}>
              <h3>{item.q}</h3>
              <p>{item.a}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
