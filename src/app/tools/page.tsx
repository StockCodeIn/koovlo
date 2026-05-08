import type { Metadata } from "next";
import AllToolsClient from "@/components/AllToolsClient";
import Link from "next/link";
import { categories, getToolsByCategory } from "@/lib/siteData";
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

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Crawlable Tool Directory</h2>
          <p>
            Every category and tool is linked here in plain HTML so users and
            search engines can discover deeper pages faster.
          </p>
        </div>
        <div className={styles.categoriesGrid}>
          {categories.map((category) => {
            const categoryTools = getToolsByCategory(category.key);

            return (
              <article key={category.path} className={styles.categoryPanel}>
                <h3>
                  <Link href={category.path}>{category.title}</Link>
                </h3>
                <p>{category.description}</p>
                <ul className={styles.toolList}>
                  {categoryTools.map((tool) => (
                    <li key={tool.path}>
                      <Link href={tool.path}>{tool.title}</Link>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </section>

      <AllToolsClient />
    </main>
  );
}
