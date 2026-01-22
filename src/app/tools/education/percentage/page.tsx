"use client";

import { useState } from "react";
import styles from "./percentage.module.css";
import ToolInfo from "@/components/ToolInfo";

export default function PercentageCalc() {
  const [obtained, setObtained] = useState("");
  const [total, setTotal] = useState("");

  const percent = total && obtained ? ((parseFloat(obtained) / parseFloat(total)) * 100).toFixed(2) : "0";

  return (
    <main className={styles.container}>
      <section className={styles.box}>
        <h1 className={styles.pageTitle}>
          <span className={styles.icon}>📊</span>
          <span className={styles.textGradient}>Percentage Calculator</span>
        </h1>
        <p>Calculate percentage from obtained and total marks.</p>

        <div className={styles.inputGroup}>
          <label>Obtained Marks:</label>
          <input
            type="number"
            value={obtained}
            onChange={(e) => setObtained(e.target.value)}
            placeholder="e.g. 85"
          />
        </div>
        <div className={styles.inputGroup}>
          <label>Total Marks:</label>
          <input
            type="number"
            value={total}
            onChange={(e) => setTotal(e.target.value)}
            placeholder="e.g. 100"
          />
        </div>

        <div className={styles.result}>
          <h2>Percentage: {percent}%</h2>
        </div>
      </section>

      <ToolInfo
        howItWorks="1. Enter obtained marks.<br>2. Enter total marks.<br>3. View the calculated percentage."
        faqs={[
          { title: "Formula?", content: "(Obtained / Total) * 100" }
        ]}
        tips={["Useful for exams, grades, and scores."]}
      />
    </main>
  );
}
