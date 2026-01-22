"use client";

import { useState } from "react";
import styles from "./answer-sheet.module.css";
import ToolInfo from "@/components/ToolInfo";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

export default function AnswerSheetGenerator() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [numQuestions, setNumQuestions] = useState(10);
  const [numOptions, setNumOptions] = useState(4);
  const [testTitle, setTestTitle] = useState("Answer Sheet");
  const [studentName, setStudentName] = useState("");
  const [showAnswers, setShowAnswers] = useState(false);
  const [generated, setGenerated] = useState(false);

  const generateQuestions = () => {
    const newQuestions: Question[] = [];
    for (let i = 1; i <= numQuestions; i++) {
      const options = [];
      for (let j = 0; j < numOptions; j++) {
        options.push(String.fromCharCode(65 + j)); // A, B, C, D, etc.
      }
      newQuestions.push({
        id: i,
        question: `Question ${i}`,
        options,
        correctAnswer: Math.floor(Math.random() * numOptions)
      });
    }
    setQuestions(newQuestions);
    setGenerated(true);
    setShowAnswers(false);
  };

  const updateQuestion = (id: number, field: keyof Question, value: any) => {
    setQuestions(questions.map(q =>
      q.id === id ? { ...q, [field]: value } : q
    ));
  };

  const addQuestion = () => {
    const newId = Math.max(...questions.map(q => q.id), 0) + 1;
    const options = [];
    for (let j = 0; j < numOptions; j++) {
      options.push(String.fromCharCode(65 + j));
    }
    setQuestions([...questions, {
      id: newId,
      question: `Question ${newId}`,
      options,
      correctAnswer: 0
    }]);
  };

  const removeQuestion = (id: number) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const printSheet = () => {
    window.print();
  };

  const exportToText = () => {
    let text = `${testTitle}\n${studentName ? `Student: ${studentName}\n` : ''}\n`;
    questions.forEach(q => {
      text += `${q.id}. ${q.question}\n`;
      q.options.forEach((option, index) => {
        text += `   ${String.fromCharCode(65 + index)}) ${option}\n`;
      });
      text += '\n';
    });

    if (showAnswers) {
      text += '\nANSWER KEY:\n';
      questions.forEach(q => {
        text += `${q.id}. ${String.fromCharCode(65 + q.correctAnswer)}\n`;
      });
    }

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${testTitle.replace(/\s+/g, '_')}_answer_sheet.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className={styles.container}>
      <section className={styles.tool}>
        <h1 className={styles.title}>
          <span className={styles.icon}>📋</span>
          Answer Sheet Generator
        </h1>
        <p>Create customizable answer sheets for quizzes and exams.</p>

        <div className={styles.generator}>
          <div className={styles.setupSection}>
            <h3>Test Setup</h3>
            <div className={styles.setupGrid}>
              <div className={styles.inputGroup}>
                <label htmlFor="testTitle">Test Title:</label>
                <input
                  id="testTitle"
                  type="text"
                  value={testTitle}
                  onChange={(e) => setTestTitle(e.target.value)}
                  placeholder="Enter test title"
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="studentName">Student Name (Optional):</label>
                <input
                  id="studentName"
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Enter student name"
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="numQuestions">Number of Questions:</label>
                <input
                  id="numQuestions"
                  type="number"
                  min="1"
                  max="100"
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(parseInt(e.target.value) || 10)}
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="numOptions">Options per Question:</label>
                <select
                  id="numOptions"
                  value={numOptions}
                  onChange={(e) => setNumOptions(parseInt(e.target.value))}
                >
                  <option value="2">2 (True/False)</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
              </div>
            </div>

            <div className={styles.controls}>
              <button onClick={generateQuestions} className={styles.generateBtn}>
                Generate Answer Sheet
              </button>
              {generated && (
                <>
                  <button onClick={addQuestion} className={styles.addBtn}>
                    Add Question
                  </button>
                  <label className={styles.checkbox}>
                    <input
                      type="checkbox"
                      checked={showAnswers}
                      onChange={(e) => setShowAnswers(e.target.checked)}
                    />
                    Show Answer Key
                  </label>
                </>
              )}
            </div>
          </div>

          {generated && (
            <div className={styles.sheetSection}>
              <div className={styles.sheetHeader}>
                <h3>{testTitle}</h3>
                {studentName && <p>Student: {studentName}</p>}
                <div className={styles.sheetActions}>
                  <button onClick={printSheet} className={styles.printBtn}>
                    Print Sheet
                  </button>
                  <button onClick={exportToText} className={styles.exportBtn}>
                    Export as Text
                  </button>
                </div>
              </div>

              <div className={styles.questionsList}>
                {questions.map(question => (
                  <div key={question.id} className={styles.question}>
                    <div className={styles.questionHeader}>
                      <span className={styles.questionNumber}>{question.id}.</span>
                      <input
                        type="text"
                        value={question.question}
                        onChange={(e) => updateQuestion(question.id, 'question', e.target.value)}
                        className={styles.questionText}
                        placeholder="Enter question"
                      />
                      <button
                        onClick={() => removeQuestion(question.id)}
                        className={styles.removeBtn}
                      >
                        ×
                      </button>
                    </div>

                    <div className={styles.options}>
                      {question.options.map((option, index) => (
                        <label key={index} className={styles.option}>
                          <input
                            type="radio"
                            name={`question-${question.id}`}
                            value={index}
                            checked={!showAnswers}
                            readOnly={!showAnswers}
                          />
                          <span className={styles.optionLetter}>
                            {String.fromCharCode(65 + index)})
                          </span>
                          {showAnswers ? (
                            <input
                              type="text"
                              value={option}
                              onChange={(e) => {
                                const newOptions = [...question.options];
                                newOptions[index] = e.target.value;
                                updateQuestion(question.id, 'options', newOptions);
                              }}
                              className={styles.optionText}
                            />
                          ) : (
                            <span className={styles.optionText}>{option}</span>
                          )}
                          {showAnswers && question.correctAnswer === index && (
                            <span className={styles.correctMark}>✓</span>
                          )}
                        </label>
                      ))}
                    </div>

                    {showAnswers && (
                      <div className={styles.correctAnswer}>
                        <label>Correct Answer:</label>
                        <select
                          value={question.correctAnswer}
                          onChange={(e) => updateQuestion(question.id, 'correctAnswer', parseInt(e.target.value))}
                        >
                          {question.options.map((_, index) => (
                            <option key={index} value={index}>
                              {String.fromCharCode(65 + index)}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {showAnswers && (
                <div className={styles.answerKey}>
                  <h4>Answer Key</h4>
                  <div className={styles.keyGrid}>
                    {questions.map(q => (
                      <div key={q.id} className={styles.keyItem}>
                        <span>{q.id}.</span>
                        <span className={styles.correctAnswer}>
                          {String.fromCharCode(65 + q.correctAnswer)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <ToolInfo
        howItWorks="1. Set up your test with title, number of questions, and options.<br>2. Generate the answer sheet with the specified parameters.<br>3. Customize questions and answers as needed.<br>4. Print or export the sheet for use."
        faqs={[
          {
            title: "Can I customize the questions and answers?",
            content: "Yes, after generating the sheet, you can edit question text, answer options, and mark correct answers."
          },
          {
            title: "How do I print the answer sheet?",
            content: "Click the 'Print Sheet' button to open your browser's print dialog for clean printing."
          },
          {
            title: "Can I export the answer sheet?",
            content: "Yes, use 'Export as Text' to download a plain text file with the complete answer sheet and key."
          }
        ]}
        tips={[
          "Use for classroom quizzes, practice tests, or certification exams",
          "Customize answer options for different question types (True/False, multiple choice)",
          "Print multiple copies for different students",
          "Use the answer key feature to create self-grading tests",
          "Combine with our Quiz Generator for complete test creation"
        ]}
      />
    </main>
  );
}