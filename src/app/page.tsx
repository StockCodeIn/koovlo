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
          Koovlo helps you merge PDFs, compress images, and calculate results —
          fast, free, and privacy-friendly.
        </p>
      </section>

      <section className={styles.popular}>
        <h2>Popular Tools</h2>
        <div className={styles.toolStrip}>
          <Link href="/tools/pdf/merge" className={styles.toolItem}>
            📄 <span>PDF Merge</span>
          </Link>
          <Link href="/tools/image/compress" className={styles.toolItem}>
            🖼️ <span>Image Compress</span>
          </Link>
          <Link href="/tools/education/percentage" className={styles.toolItem}>
            🎓 <span>Percentage Calc</span>
          </Link>
          <Link href="/tools/pdf/compress" className={styles.toolItem}>
            📘 <span>PDF Compress</span>
          </Link>
          <Link href="/tools/image/webp" className={styles.toolItem}>
            ⚡ <span>Image to WebP</span>
          </Link>
        </div>
      </section>
    </main>
    </>
  );
}

