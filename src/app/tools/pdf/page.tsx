import Link from "next/link";
import FaqSchema from "@/components/FaqSchema";
import ToolCard from "@/components/ToolCard";
import { getToolsByCategory } from "@/lib/siteData";
import styles from "../tools-common.module.css";

const tools = getToolsByCategory("pdf");

const faqs = [
  {
    question: "Are these PDF tools free?",
    answer: "Yes. Koovlo PDF tools are free to use without a signup flow.",
  },
  {
    question: "Do PDF files stay private?",
    answer: "Many workflows are designed to run in the browser, which helps reduce file sharing and keeps tasks faster.",
  },
  {
    question: "Which PDF pages should be optimized first for SEO?",
    answer: "Pages like PDF to Image, PDF Merge, and Compress PDF are high-value targets when supported by detailed use cases and FAQs.",
  },
  {
    question: "Can I use PDF tools on mobile?",
    answer: "Yes. The PDF tool pages are responsive and can be used from phones and tablets.",
  },
];

export default function PdfToolsPage() {
  return (
    <main className={styles.container}>
      <section className={styles.hero}>
        <h1 className={styles.pageTitle}>
          <span className={styles.textGradient}>Free online PDF tools for merging, converting, compressing, and organizing files</span>
        </h1>
        <p className={styles.subText}>
          This category works as a PDF hub for conversion, page management, signing, metadata editing, and quick browser-based tasks.
          It is built to support both user workflows and long-tail search intent.
        </p>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>All PDF tools</h2>
          <p>Start with the exact task you need and move between related tools without losing context.</p>
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

      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <Link href="/tools">View all tools</Link>
      </div>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Why this category matters</h2>
          <p>Competitive head terms are hard, so the page now explains real usage patterns instead of acting like a thin directory.</p>
        </div>
        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>⚡</div>
            <h3>Quick workflows</h3>
            <p>Users can move from merge to compress to convert without hunting for the next action.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🔒</div>
            <h3>Clear privacy angle</h3>
            <p>Browser-side processing is highlighted because it is a meaningful differentiator in the PDF space.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>📊</div>
            <h3>Better internal links</h3>
            <p>Category messaging now supports semantic context and passes relevance to deeper tool pages.</p>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>PDF guides worth reading</h2>
          <p>Support articles help users compare workflows and give these tool pages stronger topical context.</p>
        </div>
        <div className={styles.faqGrid}>
          <article className={styles.faqCard}>
            <h3><Link href="/guides/compress-pdf-for-email">How to Compress a PDF for Email Without Ruining Readability</Link></h3>
            <p>Understand which files compress well, how to keep text readable, and when to merge or optimize first.</p>
          </article>
          <article className={styles.faqCard}>
            <h3><Link href="/guides/pdf-to-jpg-without-losing-quality">How to Convert PDF to JPG Without Losing Too Much Quality</Link></h3>
            <p>Learn how render quality, image format, and follow-up compression affect the final result.</p>
          </article>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Frequently asked questions</h2>
          <p>Helpful answers for users and richer context for search engines.</p>
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

      <FaqSchema items={faqs} />
    </main>
  );
}
