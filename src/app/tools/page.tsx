import type { Metadata } from "next";
import AllToolsClient from "@/components/AllToolsClient";
import styles from "./tools.module.css";

export const metadata: Metadata = {
  title: "All Tools - Free Online PDF, Image, Education and Text Utilities",
  description:
    "Browse every Koovlo tool in one place, including PDF utilities, image editors, GPA calculators, document builders, and text helpers.",
  alternates: {
    canonical: "https://www.koovlo.com/tools",
  },
};

export default function AllToolsPage() {
  return (
    <main className={styles.main}>
      <section className={styles.heroSection}>
        <h1>All Koovlo tools in one searchable library</h1>
        <p>
          Browse PDF, image, education, document, and text tools with clearer category hubs,
          better internal links, and stronger long-tail search coverage.
        </p>
      </section>

      <AllToolsClient />
    </main>
  );
}
