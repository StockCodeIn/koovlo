"use client";

import { useEffect, useMemo, useState } from "react";
import ToolCard from "@/components/ToolCard";
import FaqSchema from "@/components/FaqSchema";
import { categories, tools } from "@/lib/siteData";
import styles from "@/app/tools/tools.module.css";

const faqs = [
  {
    question: "Are all tools free to use?",
    answer: "Yes. Koovlo tools are free and available directly in your browser.",
  },
  {
    question: "Do I need to create an account?",
    answer: "No signup is required. Open a tool and start using it right away.",
  },
  {
    question: "Is my data safe?",
    answer: "Many tools process data locally in your browser for better privacy and faster results.",
  },
  {
    question: "Can I use these tools on mobile?",
    answer: "Yes. The site is designed to work on phones, tablets, and desktops.",
  },
];

export default function AllToolsClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const filteredTools = useMemo(() => {
    if (!debouncedQuery.trim()) {
      return tools;
    }

    const query = debouncedQuery.toLowerCase();

    return tools.filter((tool) => {
      const category = categories.find((item) => item.key === tool.category);

      return [
        tool.title,
        tool.description,
        category?.title ?? "",
        ...tool.keywords,
      ].some((value) => value.toLowerCase().includes(query));
    });
  }, [debouncedQuery]);

  const toolsByCategory = useMemo(() => {
    return categories.map((category) => ({
      category,
      items: filteredTools.filter((tool) => tool.category === category.key),
    }));
  }, [filteredTools]);

  return (
    <>
      <section className={styles.searchSection}>
        <div className={styles.searchBox}>
          <span className={styles.searchIcon}>{"🔍"}</span>
          <input
            id="tools-search"
            type="text"
            placeholder="Search tools by task, format, or keyword"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className={styles.searchInput}
            aria-label="Search tools"
          />
          {searchQuery && (
            <button
              type="button"
              className={styles.clearBtn}
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
            >
              Clear
            </button>
          )}
        </div>

        {searchQuery && (
          <p className={styles.resultCount}>
            Found <strong>{filteredTools.length}</strong> tool{filteredTools.length !== 1 ? "s" : ""}
          </p>
        )}
      </section>

      {toolsByCategory.map(({ category, items }) =>
        items.length > 0 ? (
          <section key={category.key} className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>
                <span>{category.icon}</span>
                {category.title}
                <span className={styles.count}>({items.length})</span>
              </h2>
              <p>{category.intro}</p>
            </div>
            <div className={styles.grid}>
              {items.map((tool) => (
                <ToolCard
                  key={tool.path}
                  title={tool.title}
                  desc={tool.description}
                  link={tool.path}
                  icon={tool.icon}
                />
              ))}
            </div>
          </section>
        ) : null
      )}

      {filteredTools.length === 0 && (
        <section className={styles.section}>
          <div className={styles.noResults}>
            <div className={styles.noResultsIcon}>🔍</div>
            <h3>No tools found</h3>
            <p>Try a broader keyword like PDF, image, GPA, invoice, or JSON.</p>
            <button type="button" className={styles.resetBtn} onClick={() => setSearchQuery("")}>
              Reset search
            </button>
          </div>
        </section>
      )}

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Why choose Koovlo?</h2>
          <p>Fast, practical tools with a stronger focus on clarity and privacy.</p>
        </div>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>{"⚡"}</div>
            <h3>Fast workflows</h3>
            <p>Useful actions are easy to find, and tool interfaces avoid unnecessary friction.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>{"🔒"}</div>
            <h3>Privacy-aware processing</h3>
            <p>Many tasks run locally in the browser so users can work without sending files around.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>{"🎓"}</div>
            <h3>Student-friendly tools</h3>
            <p>Education pages provide room for long-tail use cases like GPA, CGPA, grades, and attendance.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>{"📱"}</div>
            <h3>Mobile ready</h3>
            <p>Layouts scale down cleanly so users can finish quick tasks on any device.</p>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Frequently asked questions</h2>
          <p>Quick answers that also help search engines understand the site structure.</p>
        </div>
        <div className={styles.faqGrid}>
          {faqs.map((item) => (
            <article key={item.question} className={styles.faqCard}>
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <FaqSchema items={faqs} />
    </>
  );
}
