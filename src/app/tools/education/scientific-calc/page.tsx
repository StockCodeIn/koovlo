'use client';

import { useState } from 'react';
import ToolInfo from '@/components/ToolInfo';
import styles from '../education-layout.module.css';

export default function ScientificCalculator() {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue: number, secondValue: number, operation: string) => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        return firstValue / secondValue;
      case '^':
        return Math.pow(firstValue, secondValue);
      default:
        return secondValue;
    }
  };

  const performFunction = (func: string) => {
    const inputValue = parseFloat(display);
    let result: number;

    switch (func) {
      case 'sin':
        result = Math.sin(inputValue * Math.PI / 180);
        break;
      case 'cos':
        result = Math.cos(inputValue * Math.PI / 180);
        break;
      case 'tan':
        result = Math.tan(inputValue * Math.PI / 180);
        break;
      case 'log':
        result = Math.log10(inputValue);
        break;
      case 'ln':
        result = Math.log(inputValue);
        break;
      case 'sqrt':
        result = Math.sqrt(inputValue);
        break;
      case 'square':
        result = inputValue * inputValue;
        break;
      case '1/x':
        result = 1 / inputValue;
        break;
      case 'pi':
        result = Math.PI;
        break;
      case 'e':
        result = Math.E;
        break;
      default:
        return;
    }

    setDisplay(String(result));
    setWaitingForOperand(true);
  };

  const calculateResult = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const result = calculate(previousValue, inputValue, operation);
      setDisplay(String(result));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  };

  return (
    <main className={styles.container}>
      <h1>Scientific Calculator</h1>
      <p>Advanced calculator with trigonometric and logarithmic functions</p>

      <div className={styles.calculator}>
        <div className={styles.display}>
          <div className={styles.displayText}>{display}</div>
          {operation && previousValue !== null && (
            <div className={styles.operation}>
              {previousValue} {operation}
            </div>
          )}
        </div>

        <div className={styles.keypad}>
          {/* Row 1: Functions */}
          <button onClick={() => performFunction('sin')} className={styles.functionBtn}>sin</button>
          <button onClick={() => performFunction('cos')} className={styles.functionBtn}>cos</button>
          <button onClick={() => performFunction('tan')} className={styles.functionBtn}>tan</button>
          <button onClick={() => performFunction('log')} className={styles.functionBtn}>log</button>
          <button onClick={() => performFunction('ln')} className={styles.functionBtn}>ln</button>

          {/* Row 2: More functions */}
          <button onClick={() => performFunction('sqrt')} className={styles.functionBtn}>√</button>
          <button onClick={() => performFunction('square')} className={styles.functionBtn}>x²</button>
          <button onClick={() => performFunction('1/x')} className={styles.functionBtn}>1/x</button>
          <button onClick={() => performFunction('pi')} className={styles.functionBtn}>π</button>
          <button onClick={() => performFunction('e')} className={styles.functionBtn}>e</button>

          {/* Row 3: Clear and operations */}
          <button onClick={clear} className={styles.clearBtn}>C</button>
          <button onClick={() => performOperation('^')} className={styles.operationBtn}>^</button>
          <button onClick={() => performOperation('÷')} className={styles.operationBtn}>÷</button>
          <button onClick={() => performOperation('×')} className={styles.operationBtn}>×</button>
          <button onClick={() => performOperation('-')} className={styles.operationBtn}>-</button>

          {/* Row 4: Numbers 7-9 and + */}
          <button onClick={() => inputNumber('7')} className={styles.numberBtn}>7</button>
          <button onClick={() => inputNumber('8')} className={styles.numberBtn}>8</button>
          <button onClick={() => inputNumber('9')} className={styles.numberBtn}>9</button>
          <button onClick={() => performOperation('+')} className={styles.operationBtn}>+</button>

          {/* Row 5: Numbers 4-6 */}
          <button onClick={() => inputNumber('4')} className={styles.numberBtn}>4</button>
          <button onClick={() => inputNumber('5')} className={styles.numberBtn}>5</button>
          <button onClick={() => inputNumber('6')} className={styles.numberBtn}>6</button>
          <button onClick={calculateResult} className={styles.equalsBtn}>=</button>

          {/* Row 6: Numbers 1-3 */}
          <button onClick={() => inputNumber('1')} className={styles.numberBtn}>1</button>
          <button onClick={() => inputNumber('2')} className={styles.numberBtn}>2</button>
          <button onClick={() => inputNumber('3')} className={styles.numberBtn}>3</button>

          {/* Row 7: 0 and decimal */}
          <button onClick={() => inputNumber('0')} className={styles.numberBtn}>0</button>
          <button onClick={inputDecimal} className={styles.numberBtn}>.</button>
        </div>
      </div>

      <ToolInfo
        howItWorks="Click numbers and operations to build your calculation<br>Use function buttons for advanced operations<br>Press '=' to calculate the result<br>Use 'C' to clear everything"
        faqs={[
          { title: "What trigonometric functions are available?", content: "Sine (sin), cosine (cos), and tangent (tan) functions." },
          { title: "Are angles in degrees or radians?", content: "Angles are in degrees for trigonometric functions." },
          { title: "What does 'log' and 'ln' mean?", content: "log is base-10 logarithm, ln is natural logarithm (base-e)." },
          { title: "Can I use constants?", content: "Yes, π (pi) and e (Euler's number) are available." }
        ]}
        tips={[
          "Use parentheses in complex expressions by calculating parts separately",
          "Trigonometric functions expect degrees, not radians",
          "Log functions require positive numbers",
          "Clear frequently to avoid calculation errors"
        ]}
      />
    </main>
  );
}