import Link from "next/link";
import styles from "@/styles/seo-content.module.css";
import type { ToolRecord } from "@/lib/siteData";

type FaqItem = {
  question: string;
  answer: string;
};

type RichSeoContentProps = {
  introTitle: string;
  introText: string[];
  steps: string[];
  benefits: string[];
  faqItems: FaqItem[];
  relatedTools?: ToolRecord[];
};

export default function RichSeoContent({
  introTitle,
  introText,
  steps,
  benefits,
  faqItems,
  relatedTools = [],
}: RichSeoContentProps) {
  return (
    <section className={styles.wrapper}>
      <div className={styles.block}>
        <h2>{introTitle}</h2>
        {introText.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      <div className={styles.twoColumn}>
        <div className={styles.card}>
          <h2>How to use this tool</h2>
          <ol>
            {steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>

        <div className={styles.card}>
          <h2>Why it helps</h2>
          <ul>
            {benefits.map((benefit) => (
              <li key={benefit}>{benefit}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className={styles.block}>
        <h2>Frequently asked questions</h2>
        <div className={styles.faqList}>
          {faqItems.map((item) => (
            <article key={item.question} className={styles.faqItem}>
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </article>
          ))}
        </div>
      </div>

      {relatedTools.length > 0 && (
        <div className={styles.block}>
          <h2>Related tools</h2>
          <div className={styles.relatedGrid}>
            {relatedTools.map((tool) => (
              <Link key={tool.path} href={tool.path} className={styles.relatedCard}>
                <span className={styles.relatedIcon}>{tool.icon}</span>
                <span>
                  <strong>{tool.title}</strong>
                  <small>{tool.description}</small>
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
