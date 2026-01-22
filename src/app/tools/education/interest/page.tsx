"use client";

import { useState } from "react";
import styles from "./interest.module.css";
import ToolInfo from "@/components/ToolInfo";

export default function InterestCalculator() {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [time, setTime] = useState("");
  const [interestType, setInterestType] = useState("simple");
  const [compoundingFrequency, setCompoundingFrequency] = useState("1");
  const [result, setResult] = useState<{
    interest: number;
    totalAmount: number;
    breakdown: string[];
  } | null>(null);

  const calculateInterest = () => {
    const P = parseFloat(principal);
    const R = parseFloat(rate) / 100; // Convert percentage to decimal
    const T = parseFloat(time);
    const N = parseInt(compoundingFrequency);

    if (isNaN(P) || isNaN(R) || isNaN(T) || P <= 0 || R <= 0 || T <= 0) {
      return;
    }

    let interest = 0;
    let totalAmount = 0;
    const breakdown: string[] = [];

    if (interestType === "simple") {
      interest = P * R * T;
      totalAmount = P + interest;
      breakdown.push(`Simple Interest = Principal × Rate × Time`);
      breakdown.push(`= $${P.toFixed(2)} × ${(R * 100).toFixed(2)}% × ${T} ${T === 1 ? 'year' : 'years'}`);
      breakdown.push(`= $${interest.toFixed(2)}`);
    } else {
      // Compound interest
      totalAmount = P * Math.pow(1 + R / N, N * T);
      interest = totalAmount - P;

      breakdown.push(`Compound Interest = Principal × (1 + Rate/${N})^(Frequency × Time) - Principal`);
      breakdown.push(`= $${P.toFixed(2)} × (1 + ${(R * 100).toFixed(2)}%/${N})^(${N} × ${T}) - $${P.toFixed(2)}`);
      breakdown.push(`= $${totalAmount.toFixed(2)} - $${P.toFixed(2)}`);
      breakdown.push(`= $${interest.toFixed(2)}`);
    }

    setResult({
      interest,
      totalAmount,
      breakdown
    });
  };

  const clearAll = () => {
    setPrincipal("");
    setRate("");
    setTime("");
    setResult(null);
  };

  const getCompoundingOptions = () => {
    if (interestType === "simple") return [];
    return [
      { value: "1", label: "Annually" },
      { value: "2", label: "Semi-annually" },
      { value: "4", label: "Quarterly" },
      { value: "12", label: "Monthly" },
      { value: "365", label: "Daily" }
    ];
  };

  return (
    <main className={styles.container}>
      <section className={styles.tool}>
        <h1 className={styles.title}>
          <span className={styles.icon}>💰</span>
          Interest Calculator
        </h1>
        <p>Calculate simple or compound interest on your investments.</p>

        <div className={styles.calculator}>
          <div className={styles.inputSection}>
            <div className={styles.inputGroup}>
              <label htmlFor="principal">Principal Amount ($)</label>
              <input
                id="principal"
                type="number"
                value={principal}
                onChange={(e) => setPrincipal(e.target.value)}
                placeholder="e.g. 1000"
                step="0.01"
                min="0"
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="rate">Annual Interest Rate (%)</label>
              <input
                id="rate"
                type="number"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                placeholder="e.g. 5"
                step="0.01"
                min="0"
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="time">Time Period (Years)</label>
              <input
                id="time"
                type="number"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="e.g. 2"
                step="0.01"
                min="0"
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Interest Type</label>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    value="simple"
                    checked={interestType === "simple"}
                    onChange={(e) => setInterestType(e.target.value)}
                  />
                  <span>Simple Interest</span>
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    value="compound"
                    checked={interestType === "compound"}
                    onChange={(e) => setInterestType(e.target.value)}
                  />
                  <span>Compound Interest</span>
                </label>
              </div>
            </div>

            {interestType === "compound" && (
              <div className={styles.inputGroup}>
                <label htmlFor="compounding">Compounding Frequency</label>
                <select
                  id="compounding"
                  value={compoundingFrequency}
                  onChange={(e) => setCompoundingFrequency(e.target.value)}
                >
                  {getCompoundingOptions().map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className={styles.controls}>
            <button
              className={styles.calculateBtn}
              onClick={calculateInterest}
              disabled={!principal || !rate || !time}
            >
              Calculate Interest
            </button>
            <button className={styles.clearBtn} onClick={clearAll}>
              Clear All
            </button>
          </div>

          {result && (
            <div className={styles.resultSection}>
              <h3>Calculation Results</h3>
              <div className={styles.resultGrid}>
                <div className={styles.resultCard}>
                  <div className={styles.resultLabel}>Interest Earned</div>
                  <div className={styles.resultValue}>${result.interest.toFixed(2)}</div>
                </div>
                <div className={styles.resultCard}>
                  <div className={styles.resultLabel}>Total Amount</div>
                  <div className={styles.resultValue}>${result.totalAmount.toFixed(2)}</div>
                </div>
              </div>

              <div className={styles.breakdown}>
                <h4>Calculation Breakdown</h4>
                <div className={styles.breakdownSteps}>
                  {result.breakdown.map((step, index) => (
                    <div key={index} className={styles.step}>
                      {step}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className={styles.infoSection}>
          <div className={styles.infoCard}>
            <h4>Simple Interest</h4>
            <p>Interest calculated only on the principal amount. Formula: I = P × R × T</p>
            <ul>
              <li>P = Principal amount</li>
              <li>R = Annual interest rate (decimal)</li>
              <li>T = Time period in years</li>
            </ul>
          </div>

          <div className={styles.infoCard}>
            <h4>Compound Interest</h4>
            <p>Interest calculated on both principal and accumulated interest. Formula: A = P × (1 + R/N)^(N×T)</p>
            <ul>
              <li>A = Final amount</li>
              <li>P = Principal amount</li>
              <li>R = Annual interest rate (decimal)</li>
              <li>N = Compounding frequency per year</li>
              <li>T = Time period in years</li>
            </ul>
          </div>
        </div>
      </section>

      <ToolInfo
        howItWorks="1. Enter the principal amount you want to invest.<br>2. Input the annual interest rate as a percentage.<br>3. Specify the time period in years.<br>4. Choose between simple or compound interest.<br>5. For compound interest, select the compounding frequency.<br>6. Click 'Calculate Interest' to see results."
        faqs={[
          {
            title: "What's the difference between simple and compound interest?",
            content: "Simple interest is calculated only on the principal amount. Compound interest is calculated on both the principal and the interest that has already been earned."
          },
          {
            title: "What does compounding frequency mean?",
            content: "It refers to how often interest is added to the principal balance. More frequent compounding results in higher returns."
          },
          {
            title: "Can I use this for loan calculations?",
            content: "Yes, the same formulas apply to loans. The interest amount represents the total cost of borrowing."
          }
        ]}
        tips={[
          "Compound interest grows your money faster - choose it for long-term investments",
          "More frequent compounding (monthly vs annually) increases your returns",
          "Start investing early to take advantage of compound interest over time",
          "Use this calculator for savings accounts, CDs, loans, or investment planning"
        ]}
      />
    </main>
  );
}