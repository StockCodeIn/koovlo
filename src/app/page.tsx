// src/app/psge.tsx
import type { Metadata } from "next";
import Link from "next/link";
import FaqSchema from "@/components/FaqSchema";
import { categories, getFeaturedTools } from "@/lib/siteData";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Koovlo - Free Online PDF, Image, Education and Document Tools",
  description:
    "Explore free browser-based tools for PDF conversion, image editing, student calculators, document generation, and text utilities on Koovlo.",
  alternates: {
    canonical: "https://www.koovlo.com",
  },
};

const featuredTools = getFeaturedTools();

const homepageFaqs = [
  {
    question: "Are Koovlo tools free to use?",
    answer:
      "Yes. Koovlo tools are free to use directly in your browser without creating an account.",
  },
  {
    question: "Does Koovlo upload files to a server?",
    answer:
      "Many Koovlo tools are designed to process files locally in the browser, which helps with privacy and speed.",
  },
  {
    question: "Which categories are best for SEO-focused growth?",
    answer:
      "Education, image, and long-tail PDF workflows are strong opportunities because they allow more specific use cases and supporting content.",
  },
];

export default function HomePage() {
  return (
    <>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>Privacy-first browser tools</p>
        <h1>Free online PDF, image, education, and web tools that load fast and feel simple</h1>
        <p>
          Koovlo brings together practical tools for students, creators, freelancers, and everyday work.
          Use PDF converters, image utilities, GPA calculators, resume builders, and text helpers without a heavy workflow.
        </p>

        <div className={styles.heroButtons}>
          <Link href="/tools" className={styles.primaryBtn}>
            Explore all tools
          </Link>
          <Link href="/tools/education" className={styles.secondaryBtn}>
            See student tools
          </Link>
        </div>

        <div className={styles.heroStats}>
          <div>
            <strong>45+</strong>
            <span>useful tools</span>
          </div>
          <div>
            <strong>5</strong>
            <span>content clusters</span>
          </div>
          <div>
            <strong>0</strong>
            <span>signup steps</span>
          </div>
        </div>
      </section>

      <section className={styles.featured}>
        <div className={styles.sectionHeading}>
          <h2>Popular tools people reach for first</h2>
          <p>These pages are the strongest starting point for product polish, internal links, and search visibility.</p>
        </div>
        <div className={styles.featuredGrid}>
          {featuredTools.map((tool) => (
            <Link key={tool.path} href={tool.path} className={styles.toolCard}>
              <div className={styles.icon}>{tool.icon}</div>
              <h3>{tool.title}</h3>
              <p>{tool.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.categories}>
        <div className={styles.sectionHeading}>
          <h2>Browse by category</h2>
          <p>Each category now works better as a content hub, not just a list of buttons.</p>
        </div>
        <div className={styles.categoryGrid}>
          {categories.map((category) => (
            <Link key={category.path} href={category.path} className={styles.categoryCard}>
              <span className={styles.categoryIcon}>{category.icon}</span>
              <strong>{category.title}</strong>
              <small>{category.description}</small>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.trust}>
        <div className={styles.sectionHeading}>
          <h2>Why Koovlo can stand out</h2>
          <p>Winning against larger competitors requires clearer positioning, better page depth, and a smoother experience.</p>
        </div>
        <div className={styles.trustGrid}>
          <article>
            <h3>Privacy-first workflows</h3>
            <p>Most tools are built around browser-side processing so users can work faster without sending files everywhere.</p>
          </article>
          <article>
            <h3>Student and utility focus</h3>
            <p>Education calculators and practical workflows create more room for long-tail rankings than generic head terms alone.</p>
          </article>
          <article>
            <h3>Cleaner conversion paths</h3>
            <p>Simple layouts, obvious actions, and related-tool navigation help both users and search engines understand the next step.</p>
          </article>
          <article>
            <h3>Useful supporting content</h3>
            <p>Mini-guides, FAQs, and comparison-friendly copy add the semantic depth that thin tool pages usually miss.</p>
          </article>
        </div>
      </section>

      <section className={styles.seo}>
        <div className={styles.sectionHeading}>
          <h2>Built to support topical authority, not just one-click tools</h2>
        </div>
        <p>
          Search traffic for utility sites rarely comes from a homepage alone. It grows when category pages become strong hubs,
          individual tool pages answer real questions, and related workflows are internally linked in a way that makes sense.
          Koovlo now leans harder into that structure with better category messaging, stronger keyword coverage, and richer page-level content.
        </p>
        <p>
          The biggest near-term opportunity is to build trust around privacy, speed, and education-oriented use cases while targeting
          less competitive long-tail searches such as GPA and CGPA calculators, browser-based PDF tasks, and lightweight image workflows.
        </p>
      </section>

      <section className={styles.faqSection}>
        <div className={styles.sectionHeading}>
          <h2>Frequently asked questions</h2>
        </div>
        <div className={styles.faqGrid}>
          {homepageFaqs.map((item) => (
            <article key={item.question} className={styles.faqCard}>
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <FaqSchema items={homepageFaqs} />
    </>
  );
}
