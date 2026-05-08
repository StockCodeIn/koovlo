import type { Metadata } from "next";
import Link from "next/link";
import { getToolByPath, type ToolRecord } from "@/lib/siteData";
import styles from "../guides.module.css";

const relatedTools = [
  getToolByPath("/tools/pdf/compress"),
  getToolByPath("/tools/pdf/merge"),
  getToolByPath("/tools/pdf/to-image"),
].filter((tool): tool is ToolRecord => Boolean(tool));

export const metadata: Metadata = {
  title: "How to Compress a PDF for Email Without Ruining Readability | Koovlo",
  description:
    "Step-by-step advice for reducing PDF size for email while keeping text readable and file sharing practical.",
  alternates: {
    canonical: "https://www.koovlo.com/guides/compress-pdf-for-email",
  },
};

export default function CompressPdfForEmailGuide() {
  return (
    <main className={styles.container}>
      <section className={styles.hero}>
        <span className={styles.eyebrow}>PDF Guide</span>
        <h1>How to compress a PDF for email without ruining readability</h1>
        <p>
          Many PDFs are too large for email because they contain scans, repeated assets, or unnecessary
          document overhead. The goal is not just to make the file smaller, but to keep it readable enough
          for the person receiving it.
        </p>
      </section>

      <section className={styles.section}>
        <h2>When compression helps the most</h2>
        <ul>
          <li>Scanned forms and reports often contain oversized images that make the file harder to share.</li>
          <li>Client proposals and portfolios may need compression before sending through email or WhatsApp.</li>
          <li>Multi-file workflows work better when you merge first and compress after that final version is ready.</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>Best workflow for most people</h2>
        <p>
          Start with a medium compression setting. Check whether text, tables, and signatures still look clear.
          If the file is still too large, retry with a more aggressive setting. For scanned pages, the biggest
          visual tradeoff usually comes from image-heavy content rather than normal typed text.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Common mistakes</h2>
        <ul>
          <li>Compressing the same PDF again and again, which can compound quality loss.</li>
          <li>Sending raw scans without first removing unused pages or combining files sensibly.</li>
          <li>Ignoring mobile readability even though many recipients open email attachments on phones.</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>Related tools</h2>
        <div className={styles.toolLinks}>
          {relatedTools.map((tool) => (
            <Link key={tool.path} href={tool.path} className={styles.toolLink}>
              <span>{tool.icon}</span>
              <span>{tool.title}</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
