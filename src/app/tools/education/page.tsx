// src/app/tools/education/page.tsx
import ToolCard from "@/components/ToolCard";
import styles from "../tools-common.module.css";

const tools = [
    { title: "GPA Calculator", desc: "Calculate GPA with credits and multiple grade scales", link: "/tools/education/gpa", icon: "📊", category: "Education" },
    { title: "CGPA Calculator", desc: "Calculate CGPA across semesters with grade tracking", link: "/tools/education/cgpa", icon: "📈", category: "Education" },
    { title: "Grade Calculator", desc: "Convert marks to grades with weighted subjects", link: "/tools/education/grade", icon: "📝", category: "Education" },
    { title: "Percentage Calculator", desc: "Calculate percentages and CGPA conversions instantly", link: "/tools/education/percentage", icon: "🔢", category: "Education" },
    { title: "Attendance Tracker", desc: "Track and calculate attendance percentage daily", link: "/tools/education/attendance", icon: "📅", category: "Education" },
    { title: "Flashcard Creator", desc: "Create and study with categorized flashcards", link: "/tools/education/flashcard", icon: "🎴", category: "Education" },
    { title: "Quiz Generator", desc: "Create custom quizzes with multiple question types", link: "/tools/education/quiz-generator", icon: "❓", category: "Education" },
    { title: "Notes Organizer", desc: "Organize notes by category, tags, and colors", link: "/tools/education/notes-organizer", icon: "📓", category: "Education" },
    { title: "Revision Planner", desc: "Plan study schedule and track exam preparation", link: "/tools/education/revision-planner", icon: "📅", category: "Education" },
    { title: "Rank Calculator", desc: "Calculate rankings and score statistics instantly", link: "/tools/education/rank", icon: "🏆", category: "Education" },
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
