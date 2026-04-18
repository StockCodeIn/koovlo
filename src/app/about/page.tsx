import type { Metadata } from "next";
import styles from "./about.module.css";

export const metadata: Metadata = {
  title: "About Koovlo - Free Online Tools Platform",
  description:
    "Learn about Koovlo's mission to provide free, fast, and privacy-friendly online tools for PDF editing, image processing, education, and more.",
  keywords: ["about koovlo", "free online tools", "privacy-friendly tools", "pdf tools", "image tools"],
};

export default function AboutPage() {
  return (
    <main className={styles.container}>
      <section className={styles.hero}>
        <h1>About Koovlo</h1>
        <p className={styles.tagline}>Free online tools built for speed, privacy, and simplicity.</p>
      </section>

      <section className={styles.section}>
        <h2>Our Mission</h2>
        <p>
          At Koovlo, we believe essential digital tools should be free, fast, and respect your privacy.
          We&apos;ve built a collection of powerful online utilities that work directly in your browser,
          with no uploads, no accounts, and no unnecessary friction.
        </p>
      </section>

      <section className={styles.section}>
        <h2>What We Offer</h2>
        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <div className={styles.icon}>PDF</div>
            <h3>PDF Tools</h3>
            <p>Merge, split, compress, convert, and edit PDFs with ease.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.icon}>IMG</div>
            <h3>Image Tools</h3>
            <p>Resize, compress, convert, and optimize images instantly.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.icon}>EDU</div>
            <h3>Education Tools</h3>
            <p>Calculators and utilities for students and teachers.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.icon}>TXT</div>
            <h3>Text and Web Tools</h3>
            <p>Format, analyze, and convert text quickly.</p>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2>Why Choose Koovlo?</h2>
        <ul className={styles.benefitsList}>
          <li><strong>100% Free:</strong> All tools are completely free with no hidden costs.</li>
          <li><strong>Privacy First:</strong> Many tools process data in your browser so files stay with you.</li>
          <li><strong>No Signup Required:</strong> Start using tools instantly without creating an account.</li>
          <li><strong>Mobile Friendly:</strong> All tools work smoothly on phones, tablets, and desktops.</li>
          <li><strong>Fast and Reliable:</strong> Optimized performance keeps everyday tasks quick and simple.</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>Our Commitment</h2>
        <p>
          We&apos;re committed to keeping Koovlo accessible and genuinely useful. As the platform grows,
          we&apos;ll continue improving tools, content depth, and usability based on real user needs.
        </p>
      </section>
    </main>
  );
}
