// src/components/ToolInfo.tsx
import { useState } from "react";
import styles from "@/styles/toolinfo.module.css";

type Tab = {
  title: string;
  content: string;
};

type ToolInfoProps = {
  howItWorks: string;
  faqs: Tab[];
  tips: string[];
};

export default function ToolInfo({ howItWorks, faqs, tips }: ToolInfoProps) {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { title: "How it Works", content: howItWorks },
    { title: "FAQs", content: faqs.map(faq => `<strong>${faq.title}</strong><br>${faq.content}`).join("<br><br>") },
    { title: "Tips", content: tips.join("<br>• ") },
  ];

  return (
    <div className={styles.container}>
      <h3>Tool Information</h3>
      <div className={styles.tabs}>
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`${styles.tab} ${activeTab === index ? styles.active : ""}`}
            onClick={() => setActiveTab(index)}
          >
            {tab.title}
          </button>
        ))}
      </div>
      <div className={styles.content} dangerouslySetInnerHTML={{ __html: tabs[activeTab].content }} />
    </div>
  );
}