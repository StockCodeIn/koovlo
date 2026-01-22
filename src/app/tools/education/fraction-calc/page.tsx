"use client";

import { useState } from "react";
import styles from "./fraction-calc.module.css";
import ToolInfo from "@/components/ToolInfo";

interface Fraction {
  numerator: number;
  denominator: number;
}

export default function FractionCalculator() {
  const [fraction1, setFraction1] = useState<Fraction>({ numerator: 0, denominator: 1 });
  const [fraction2, setFraction2] = useState<Fraction>({ numerator: 0, denominator: 1 });
  const [operation, setOperation] = useState("+");
  const [result, setResult] = useState<Fraction | null>(null);
  const [decimalResult, setDecimalResult] = useState("");

  const gcd = (a: number, b: number): number => {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b !== 0) {
      const temp = b;
      b = a % b;
      a = temp;
    }
    return a;
  };

  const simplifyFraction = (frac: Fraction): Fraction => {
    if (frac.denominator === 0) return frac;
    const divisor = gcd(frac.numerator, frac.denominator);
    return {
      numerator: frac.numerator / divisor,
      denominator: frac.denominator / divisor
    };
  };

  const addFractions = (f1: Fraction, f2: Fraction): Fraction => {
    const numerator = f1.numerator * f2.denominator + f2.numerator * f1.denominator;
    const denominator = f1.denominator * f2.denominator;
    return simplifyFraction({ numerator, denominator });
  };

  const subtractFractions = (f1: Fraction, f2: Fraction): Fraction => {
    const numerator = f1.numerator * f2.denominator - f2.numerator * f1.denominator;
    const denominator = f1.denominator * f2.denominator;
    return simplifyFraction({ numerator, denominator });
  };

  const multiplyFractions = (f1: Fraction, f2: Fraction): Fraction => {
    const numerator = f1.numerator * f2.numerator;
    const denominator = f1.denominator * f2.denominator;
    return simplifyFraction({ numerator, denominator });
  };

  const divideFractions = (f1: Fraction, f2: Fraction): Fraction => {
    if (f2.numerator === 0) return { numerator: 0, denominator: 1 };
    const numerator = f1.numerator * f2.denominator;
    const denominator = f1.denominator * f2.numerator;
    return simplifyFraction({ numerator, denominator });
  };

  const calculate = () => {
    let calculatedResult: Fraction;

    switch (operation) {
      case "+":
        calculatedResult = addFractions(fraction1, fraction2);
        break;
      case "-":
        calculatedResult = subtractFractions(fraction1, fraction2);
        break;
      case "×":
        calculatedResult = multiplyFractions(fraction1, fraction2);
        break;
      case "÷":
        calculatedResult = divideFractions(fraction1, fraction2);
        break;
      default:
        return;
    }

    setResult(calculatedResult);
    setDecimalResult((calculatedResult.numerator / calculatedResult.denominator).toFixed(6));
  };

  const formatFraction = (frac: Fraction): string => {
    if (frac.denominator === 1) return frac.numerator.toString();
    if (frac.denominator === 0) return "undefined";
    return `${frac.numerator}/${frac.denominator}`;
  };

  const clearAll = () => {
    setFraction1({ numerator: 0, denominator: 1 });
    setFraction2({ numerator: 0, denominator: 1 });
    setResult(null);
    setDecimalResult("");
  };

  return (
    <main className={styles.container}>
      <section className={styles.tool}>
        <h1 className={styles.title}>
          <span className={styles.icon}>🔢</span>
          Fraction Calculator
        </h1>
        <p>Perform arithmetic operations with fractions.</p>

        <div className={styles.calculator}>
          <div className={styles.inputSection}>
            <div className={styles.fractionInput}>
              <div className={styles.fraction}>
                <input
                  type="number"
                  value={fraction1.numerator}
                  onChange={(e) => setFraction1({...fraction1, numerator: parseInt(e.target.value) || 0})}
                  placeholder="0"
                />
                <div className={styles.divider}></div>
                <input
                  type="number"
                  value={fraction1.denominator}
                  onChange={(e) => setFraction1({...fraction1, denominator: parseInt(e.target.value) || 1})}
                  placeholder="1"
                  min="1"
                />
              </div>
            </div>

            <div className={styles.operationSelector}>
              <select value={operation} onChange={(e) => setOperation(e.target.value)}>
                <option value="+">+</option>
                <option value="-">-</option>
                <option value="×">×</option>
                <option value="÷">÷</option>
              </select>
            </div>

            <div className={styles.fractionInput}>
              <div className={styles.fraction}>
                <input
                  type="number"
                  value={fraction2.numerator}
                  onChange={(e) => setFraction2({...fraction2, numerator: parseInt(e.target.value) || 0})}
                  placeholder="0"
                />
                <div className={styles.divider}></div>
                <input
                  type="number"
                  value={fraction2.denominator}
                  onChange={(e) => setFraction2({...fraction2, denominator: parseInt(e.target.value) || 1})}
                  placeholder="1"
                  min="1"
                />
              </div>
            </div>
          </div>

          <div className={styles.controls}>
            <button className={styles.calculateBtn} onClick={calculate}>
              Calculate
            </button>
            <button className={styles.clearBtn} onClick={clearAll}>
              Clear
            </button>
          </div>

          {result && (
            <div className={styles.resultSection}>
              <h3>Result:</h3>
              <div className={styles.resultDisplay}>
                <div className={styles.fractionResult}>
                  {formatFraction(fraction1)} {operation} {formatFraction(fraction2)} = {formatFraction(result)}
                </div>
                <div className={styles.decimalResult}>
                  Decimal: {decimalResult}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className={styles.examples}>
          <h3>Examples</h3>
          <div className={styles.exampleGrid}>
            <div className={styles.example}>
              <strong>Addition:</strong> 1/2 + 1/3 = 5/6
            </div>
            <div className={styles.example}>
              <strong>Subtraction:</strong> 3/4 - 1/4 = 1/2
            </div>
            <div className={styles.example}>
              <strong>Multiplication:</strong> 2/3 × 3/4 = 1/2
            </div>
            <div className={styles.example}>
              <strong>Division:</strong> 1/2 ÷ 1/4 = 2/1
            </div>
          </div>
        </div>
      </section>

      <ToolInfo
        howItWorks="1. Enter the first fraction (numerator and denominator).<br>2. Select the arithmetic operation (+, -, ×, ÷).<br>3. Enter the second fraction.<br>4. Click 'Calculate' to see the result in both fraction and decimal form.<br>5. All results are automatically simplified to lowest terms."
        faqs={[
          {
            title: "How does fraction addition work?",
            content: "To add fractions, find a common denominator, add the numerators, then simplify the result."
          },
          {
            title: "What if the denominator is zero?",
            content: "Division by zero is undefined. The calculator will show 'undefined' for such operations."
          },
          {
            title: "Are results automatically simplified?",
            content: "Yes, all fraction results are reduced to their lowest terms using the greatest common divisor (GCD)."
          }
        ]}
        tips={[
          "Remember to find common denominators when adding or subtracting fractions",
          "Multiplying fractions is straightforward - just multiply numerators and denominators",
          "To divide fractions, multiply by the reciprocal of the second fraction",
          "Use the decimal result to verify your fraction calculations"
        ]}
      />
    </main>
  );
}