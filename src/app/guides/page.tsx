import type { Metadata } from "next";
import Link from "next/link";
import { guides } from "@/lib/guidesData";
import styles from "./guides.module.css";

export const metadata: Metadata = {
  title: "Guides and Tutorials for PDF, Image, and Student Tools | Koovlo",
  description:
    "Read practical guides for PDF compression, PDF to JPG conversion, GPA vs CGPA, and other browser-based workflows on Koovlo.",
  alternates: {
    canonical: "https://www.koovlo.com/guides",
  },
};

export default function GuidesPage() {
  return (
    <main className={styles.container}>
      <section className={styles.hero}>
        <span className={styles.eyebrow}>Knowledge Hub</span>
        <h1>Practical guides that support the tools, not just the click button</h1>
        <p>
          These guides help users understand when to use each tool, how to get better results,
          and which related workflow to try next. They also give Koovlo a stronger topical structure
          than thin utility pages alone.
        </p>
      </section>

      <section className={styles.grid}>
        {guides.map((guide) => (
          <Link key={guide.path} href={guide.path} className={styles.card}>
            <h2>{guide.title}</h2>
            <p>{guide.description}</p>
          </Link>
        ))}
      </section>
    </main>
  );
}

