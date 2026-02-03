// src/app/tools/image/page.tsx
import ToolCard from "@/components/ToolCard";
import styles from "../tools-common.module.css";

const tools = [
  { title: "Image Resize", desc: "Resize multiple images with presets or exact dimensions.", link: "/tools/image/resize", icon: "📏" },
  { title: "Image Compress", desc: "Compress images in bulk. Fast, private, and free.", link: "/tools/image/compress", icon: "🗜️" },
  { title: "Image Convert", desc: "Convert images between formats instantly.", link: "/tools/image/convert", icon: "🔄" },
  { title: "Add Image Watermark", desc: "Add text or logo watermark to images.", link: "/tools/image/add-watermark", icon: "💧" },
  { title: "Strip Metadata", desc: "Remove EXIF metadata to protect privacy.", link: "/tools/image/strip-metadata", icon: "🗑️" },
];

const faqs = [
  {
    q: "Are these image tools free?",
    a: "Yes, all image tools are free and run in your browser.",
  },
  {
    q: "Do my images upload to a server?",
    a: "No. Processing happens locally in your browser for privacy.",
  },
  {
    q: "Can I use these tools on mobile?",
    a: "Yes. The tools are optimized for phones and tablets.",
  },
  {
    q: "Which formats are supported?",
    a: "Common formats like JPG, PNG, and WEBP are supported across tools.",
  },
];

export default function ImageToolsPage() {
  return (
    <main className={styles.container}>
      <section className={styles.hero}>
        <h1 className={styles.pageTitle}>
          <span className={styles.icon}>🖼️</span>
          <span className={styles.textGradient}>Image Tools</span>
        </h1>
        <p className={styles.subText}>
          Simple, powerful, and secure image utilities that run directly in your browser — fast, private, and mobile-friendly.
        </p>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Popular Image Tools</h2>
          <p>Resize, compress, convert, and protect your images in seconds.</p>
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
          <h2>Why use Koovlo Image Tools?</h2>
          <p>Built for speed, quality, and privacy.</p>
        </div>
        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>⚡</div>
            <h3>Fast Processing</h3>
            <p>Quick edits and conversions without long uploads.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🔒</div>
            <h3>Privacy First</h3>
            <p>Your images stay in your browser — no server uploads.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>📱</div>
            <h3>Mobile Friendly</h3>
            <p>Use all tools smoothly on phone, tablet, or desktop.</p>
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
