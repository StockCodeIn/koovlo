import FaqSchema from "@/components/FaqSchema";
import Link from "next/link";
import ToolCard from "@/components/ToolCard";
import { getToolsByCategory } from "@/lib/siteData";
import styles from "../tools-common.module.css";

const tools = getToolsByCategory("education");

const faqs = [
  {
    question: "Are these education tools free?",
    answer: "Yes. Every education tool on Koovlo is free to use in the browser.",
  },
  {
    question: "Who are these tools for?",
    answer: "They are useful for students, teachers, parents, and anyone working with grades, attendance, or revision planning.",
  },
  {
    question: "Why can education tools rank faster than generic PDF terms?",
    answer: "Education pages can target clearer long-tail intent like GPA, CGPA, semester grades, and attendance goals, which are less crowded than broad PDF keywords.",
  },
  {
    question: "Do the formulas follow standard rules?",
    answer: "Yes. These calculators are built around common academic formulas and transparent inputs.",
  },
];

export default function EducationToolsPage() {
  return (
    <main className={styles.container}>
      <section className={styles.hero}>
        <h1 className={styles.pageTitle}>
          <span className={styles.textGradient}>Free online education tools for GPA, CGPA, grades, attendance, and study planning</span>
        </h1>
        <p className={styles.subText}>
          Koovlo&apos;s education hub is one of the best opportunities for search growth because these tools solve specific student needs
          and can support richer explanatory content than generic utility pages.
        </p>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>All education tools</h2>
          <p>Choose the exact calculator or study helper you need and get results quickly.</p>
        </div>
        <div className={styles.grid}>
          {tools.map((tool) => (
            <ToolCard
              key={tool.path}
              title={tool.title}
              desc={tool.description}
              link={tool.path}
              icon={tool.icon}
            />
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Why students can trust these tools</h2>
          <p>The page now gives search engines more context about who the tools are for and why they are useful.</p>
        </div>
        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>✅</div>
            <h3>Clear formulas</h3>
            <p>Inputs are simple, outputs are readable, and the intent behind each calculator is easy to understand.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>📱</div>
            <h3>Mobile friendly</h3>
            <p>Students often check attendance or GPA on the phone, so the layouts stay usable on small screens.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🎓</div>
            <h3>Long-tail intent coverage</h3>
            <p>GPA, CGPA, grade conversion, and attendance use cases give this category better ranking opportunities.</p>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Frequently asked questions</h2>
          <p>Common questions around academic calculators and study workflows.</p>
        </div>
        <div className={styles.faqGrid}>
          {faqs.map((item) => (
            <article key={item.question} className={styles.faqCard}>
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Study guides and explanations</h2>
          <p>Students often need formulas and examples in addition to calculators, so these pages support both users and SEO.</p>
        </div>
        <div className={styles.faqGrid}>
          <article className={styles.faqCard}>
            <h3><Link href="/guides/gpa-vs-cgpa-calculator-guide">GPA vs CGPA: what is the difference and how do you calculate both?</Link></h3>
            <p>Read the plain-English difference between semester GPA, cumulative CGPA, and percentage conversions.</p>
          </article>
        </div>
      </section>

      <FaqSchema items={faqs} />
    </main>
  );
}
