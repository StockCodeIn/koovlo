// src/app/tools/page.tsx
import { Metadata } from "next";
import AllToolsClient from "@/components/AllToolsClient";
import styles from "./tools.module.css";

export default function AllToolsPage() {
  return (
    <main className={styles.main}>
      <section className={styles.heroSection}>
        <h1>40+ Free Online Tools – PDF, Image, Education, Document & Text Utilities</h1>
        <p>
          Browse 40+ fast, free and secure online tools including PDF Merge, Image Compressor, Resume Builder, GPA Calculator and Word Counter.
        </p>
      </section>

      {/* Client component handles search, filtering, and interactive content */}
      <AllToolsClient />
    </main>
  );
}

