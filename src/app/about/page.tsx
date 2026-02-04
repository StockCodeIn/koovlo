import { Metadata } from "next";
import styles from "./about.module.css";

export const metadata: Metadata = {
  title: "About Koovlo - Free Online Tools Platform",
  description: "Learn about Koovlo's mission to provide free, fast, and privacy-friendly online tools for PDF editing, image processing, education, and more.",
  keywords: ["about koovlo", "free online tools", "privacy-friendly tools", "pdf tools", "image tools"],
};

export default function AboutPage() {
  return (
    <main className={styles.container}>
      <section className={styles.hero}>
        <h1>About Koovlo</h1>
        <p className={styles.tagline}>
          Free online tools built for speed, privacy, and simplicity.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Our Mission</h2>
        <p>
          At Koovlo, we believe essential digital tools should be free, fast, and respect your privacy. 
          We've built a collection of powerful online utilities that work directly in your browser — 
          no uploads, no accounts, no hassle.
        </p>
      </section>

      <section className={styles.section}>
        <h2>What We Offer</h2>
        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <div className={styles.icon}>📄</div>
            <h3>PDF Tools</h3>
            <p>Merge, split, compress, convert, and edit PDFs with ease.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.icon}>🖼️</div>
            <h3>Image Tools</h3>
            <p>Resize, compress, convert, and optimize images instantly.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.icon}>🎓</div>
            <h3>Education Tools</h3>
            <p>Calculators and utilities for students and teachers.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.icon}>📝</div>
            <h3>Text & Web Tools</h3>
            <p>Format, analyze, and convert text quickly.</p>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2>Why Choose Koovlo?</h2>
        <ul className={styles.benefitsList}>
          <li><strong>100% Free:</strong> All tools are completely free with no hidden costs.</li>
          <li><strong>Privacy First:</strong> Most tools process data in your browser — nothing gets uploaded.</li>
          <li><strong>No Signup Required:</strong> Start using tools instantly without creating an account.</li>
          <li><strong>Mobile Friendly:</strong> All tools work smoothly on phones, tablets, and desktops.</li>
          <li><strong>Fast & Reliable:</strong> Optimized performance for quick results.</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>Our Commitment</h2>
        <p>
          We're committed to keeping Koovlo free and accessible to everyone. As we grow, 
          we'll continue adding new tools based on user feedback and needs. Your privacy 
          and experience are our top priorities.
        </p>
      </section>
    </main>
  );
}
