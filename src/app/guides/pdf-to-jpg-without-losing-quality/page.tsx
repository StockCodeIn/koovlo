import type { Metadata } from "next";
import Link from "next/link";
import { getToolByPath, type ToolRecord } from "@/lib/siteData";
import styles from "../guides.module.css";

const relatedTools = [
  getToolByPath("/tools/pdf/to-image"),
  getToolByPath("/tools/image/compress"),
  getToolByPath("/tools/image/resize"),
].filter((tool): tool is ToolRecord => Boolean(tool));

export const metadata: Metadata = {
  title: "How to Convert PDF to JPG Without Losing Too Much Quality | Koovlo",
  description:
    "Understand resolution, sharpness, and file size tradeoffs when converting PDF pages to JPG images.",
  alternates: {
    canonical: "https://www.koovlo.com/guides/pdf-to-jpg-without-losing-quality",
  },
};

export default function PdfToJpgGuide() {
  return (
    <main className={styles.container}>
      <section className={styles.hero}>
        <span className={styles.eyebrow}>Conversion Guide</span>
        <h1>How to convert PDF to JPG without losing too much quality</h1>
        <p>
          PDF to JPG conversion is useful for thumbnails, previews, social sharing, and presentation slides.
          The trick is choosing enough resolution to keep text readable without creating unnecessarily large image files.
        </p>
      </section>

      <section className={styles.section}>
        <h2>What affects output quality</h2>
        <ul>
          <li>Higher render scale preserves more detail, especially for charts and smaller text.</li>
          <li>JPG compression reduces size but can blur sharp edges if pushed too far.</li>
          <li>After conversion, image compression and resizing should be handled separately for best control.</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>Recommended workflow</h2>
        <p>
          Convert the PDF at a quality level that keeps headings and small text sharp, then reduce image size
          afterward if needed. This two-step process is often better than exporting too aggressively on the first pass.
        </p>
      </section>

      <section className={styles.section}>
        <h2>When JPG is the wrong format</h2>
        <p>
          If you need transparent backgrounds or pixel-perfect screenshots for design work, PNG may be a better choice.
          JPG is best when you care more about smaller file size than exact lossless detail.
        </p>
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
