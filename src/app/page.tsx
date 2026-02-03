// src/app/page.tsx
import Link from "next/link";
import styles from "./page.module.css";
import ToolsNav from "@/components/ToolsNav";

export default function HomePage() {
  return (
    <>
      <ToolsNav />
      <main>
        <section className={styles.hero}>
          <h1>Free Online Tools for Everyday Tasks</h1>
          <p>
            Koovlo helps you edit PDFs, images, documents, and text — fast, free, and privacy‑friendly.
          </p>
          <div className={styles.heroCta}>
            <Link href="/tools" className={styles.primaryCta}>Explore All Tools</Link>
          </div>
        </section>

        <section className={styles.quickSection}>
          <h2>Important Tools</h2>
          <div className={styles.quickGrid}>
            <Link href="/tools/pdf/merge" className={styles.toolCard}>📄 PDF Merge</Link>
            <Link href="/tools/pdf/compress" className={styles.toolCard}>🗜️ PDF Compress</Link>
            <Link href="/tools/pdf/to-word" className={styles.toolCard}>📝 PDF to Word</Link>
            <Link href="/tools/image/compress" className={styles.toolCard}>🖼️ Image Compress</Link>
            <Link href="/tools/image/resize" className={styles.toolCard}>📏 Image Resize</Link>
            <Link href="/tools/document/invoice" className={styles.toolCard}>💳 Invoice Generator</Link>
            <Link href="/tools/document/resume-builder" className={styles.toolCard}>📄 Resume Builder</Link>
            <Link href="/tools/document/pdf-form-builder" className={styles.toolCard}>📝 PDF Form Builder</Link>
            <Link href="/tools/text-web/word-counter" className={styles.toolCard}>📊 Word Counter</Link>
            <Link href="/tools/text-web/json-formatter" className={styles.toolCard}>🔧 JSON Formatter</Link>
            <Link href="/tools/education/percentage" className={styles.toolCard}>🎓 Percentage Calc</Link>
            <Link href="/tools/education/attendance" className={styles.toolCard}>📅 Attendance Calc</Link>
          </div>
        </section>

        <section className={styles.categories}>
          <h2>Browse by Category</h2>
          <div className={styles.categoryRow}>
            <Link href="/tools/pdf" className={styles.categoryChip}>📄 PDF Tools</Link>
            <Link href="/tools/image" className={styles.categoryChip}>🖼️ Image Tools</Link>
            <Link href="/tools/education" className={styles.categoryChip}>🎓 Education Tools</Link>
            <Link href="/tools/document" className={styles.categoryChip}>📋 Document Tools</Link>
            <Link href="/tools/text-web" className={styles.categoryChip}>📝 Text/Web Tools</Link>
          </div>
        </section>
      </main>
    </>
  );
}

