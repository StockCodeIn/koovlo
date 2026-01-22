'use client';

import { useState, useRef } from 'react';
import styles from './omrsheet.module.css';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface OMRSheet {
  title: string;
  questions: Question[];
  instructions: string;
}

export default function OMRSheetTool() {
  const [sheet, setSheet] = useState<OMRSheet>({
    title: 'Sample OMR Sheet',
    questions: [
      {
        id: '1',
        question: 'What is the capital of France?',
        options: ['London', 'Berlin', 'Paris', 'Madrid'],
        correctAnswer: 2,
      },
      {
        id: '2',
        question: 'Which planet is known as the Red Planet?',
        options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
        correctAnswer: 1,
      },
    ],
    instructions: 'Please read all questions carefully before answering. Use a dark pen to fill the circles completely.',
  });

  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isPreview, setIsPreview] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      question: '',
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctAnswer: 0,
    };

    setSheet(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
    }));

    setCurrentQuestion(newQuestion);
  };

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setSheet(prev => ({
      ...prev,
      questions: prev.questions.map(q =>
        q.id === id ? { ...q, ...updates } : q
      ),
    }));

    if (currentQuestion?.id === id) {
      setCurrentQuestion(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const deleteQuestion = (id: string) => {
    setSheet(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== id),
    }));

    if (currentQuestion?.id === id) {
      setCurrentQuestion(null);
    }
  };

  const addOption = (questionId: string) => {
    setSheet(prev => ({
      ...prev,
      questions: prev.questions.map(q =>
        q.id === questionId
          ? { ...q, options: [...q.options, `Option ${String.fromCharCode(65 + q.options.length)}`] }
          : q
      ),
    }));
  };

  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    setSheet(prev => ({
      ...prev,
      questions: prev.questions.map(q =>
        q.id === questionId
          ? { ...q, options: q.options.map((opt, i) => i === optionIndex ? value : opt) }
          : q
      ),
    }));
  };

  const deleteOption = (questionId: string, optionIndex: number) => {
    setSheet(prev => ({
      ...prev,
      questions: prev.questions.map(q => {
        if (q.id === questionId) {
          const newOptions = q.options.filter((_, i) => i !== optionIndex);
          const newCorrectAnswer = q.correctAnswer >= optionIndex && q.correctAnswer > 0
            ? q.correctAnswer - 1
            : q.correctAnswer;
          return { ...q, options: newOptions, correctAnswer: newCorrectAnswer };
        }
        return q;
      }),
    }));
  };

  const calculateScore = () => {
    let correct = 0;
    let total = sheet.questions.length;

    sheet.questions.forEach(question => {
      if (answers[question.id] === question.correctAnswer) {
        correct++;
      }
    });

    return { correct, total, percentage: Math.round((correct / total) * 100) };
  };

  const resetAnswers = () => {
    setAnswers({});
    setShowResults(false);
  };

  const exportToJSON = () => {
    const data = {
      sheet,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'omr-sheet.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const importFromJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.sheet) {
          setSheet(data.sheet);
          setCurrentQuestion(null);
          setAnswers({});
          setShowResults(false);
        }
      } catch (error) {
        alert('Invalid file format');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const printSheet = () => {
    if (printRef.current) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>${sheet.title}</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .header { text-align: center; margin-bottom: 30px; }
                .instructions { margin-bottom: 20px; padding: 10px; background: #f0f0f0; }
                .question { margin-bottom: 20px; page-break-inside: avoid; }
                .options { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin: 10px 0; }
                .option { display: flex; align-items: center; gap: 10px; }
                .circle { width: 20px; height: 20px; border: 2px solid #000; border-radius: 50%; display: inline-block; }
                .question-number { font-weight: bold; }
                @media print { .no-print { display: none; } }
              </style>
            </head>
            <body>
              ${printRef.current.innerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  const score = calculateScore();

  return (
    <div className={styles.container}>
      <div className={styles.tool}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            📋 OMR Sheet Generator
          </h1>
          <p className={styles.subtitle}>
            Create and manage Optical Mark Recognition sheets for assessments
          </p>
        </div>

        <div className={styles.controls}>
          <div className={styles.modeToggle}>
            <button
              onClick={() => setIsPreview(false)}
              className={`${styles.modeBtn} ${!isPreview ? styles.active : ''}`}
            >
              ✏️ Edit Mode
            </button>
            <button
              onClick={() => setIsPreview(true)}
              className={`${styles.modeBtn} ${isPreview ? styles.active : ''}`}
            >
              👁️ Preview Mode
            </button>
          </div>

          <div className={styles.actions}>
            <button onClick={addQuestion} className={styles.addBtn}>
              Add Question
            </button>
            <button onClick={printSheet} className={styles.printBtn}>
              🖨️ Print
            </button>
            <button onClick={exportToJSON} className={styles.exportBtn}>
              Export
            </button>
            <label className={styles.importBtn}>
              Import
              <input
                type="file"
                accept=".json"
                onChange={importFromJSON}
                style={{ display: 'none' }}
              />
            </label>
          </div>
        </div>

        {!isPreview ? (
          <div className={styles.editor}>
            <div className={styles.sheetSettings}>
              <div className={styles.settingGroup}>
                <label>Title:</label>
                <input
                  type="text"
                  value={sheet.title}
                  onChange={(e) => setSheet(prev => ({ ...prev, title: e.target.value }))}
                  className={styles.titleInput}
                />
              </div>

              <div className={styles.settingGroup}>
                <label>Instructions:</label>
                <textarea
                  value={sheet.instructions}
                  onChange={(e) => setSheet(prev => ({ ...prev, instructions: e.target.value }))}
                  className={styles.instructionsTextarea}
                  rows={3}
                />
              </div>
            </div>

            <div className={styles.questionsList}>
              {sheet.questions.map((question, index) => (
                <div
                  key={question.id}
                  className={`${styles.questionEditor} ${currentQuestion?.id === question.id ? styles.active : ''}`}
                  onClick={() => setCurrentQuestion(question)}
                >
                  <div className={styles.questionHeader}>
                    <span className={styles.questionNumber}>Q{index + 1}</span>
                    <input
                      type="text"
                      value={question.question}
                      onChange={(e) => updateQuestion(question.id, { question: e.target.value })}
                      placeholder="Enter question..."
                      className={styles.questionInput}
                    />
                    <button
                      onClick={() => deleteQuestion(question.id)}
                      className={styles.deleteQuestionBtn}
                    >
                      🗑️
                    </button>
                  </div>

                  {currentQuestion?.id === question.id && (
                    <div className={styles.questionDetails}>
                      <div className={styles.optionsEditor}>
                        {question.options.map((option, optionIndex) => (
                          <div key={optionIndex} className={styles.optionRow}>
                            <input
                              type="radio"
                              name={`correct-${question.id}`}
                              checked={question.correctAnswer === optionIndex}
                              onChange={() => updateQuestion(question.id, { correctAnswer: optionIndex })}
                              className={styles.correctRadio}
                            />
                            <input
                              type="text"
                              value={option}
                              onChange={(e) => updateOption(question.id, optionIndex, e.target.value)}
                              className={styles.optionInput}
                              placeholder={`Option ${String.fromCharCode(65 + optionIndex)}`}
                            />
                            {question.options.length > 2 && (
                              <button
                                onClick={() => deleteOption(question.id, optionIndex)}
                                className={styles.deleteOptionBtn}
                              >
                                ×
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          onClick={() => addOption(question.id)}
                          className={styles.addOptionBtn}
                        >
                          + Add Option
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {sheet.questions.length === 0 && (
                <div className={styles.emptyState}>
                  <p>No questions added yet. Click "Add Question" to get started!</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className={styles.preview}>
            <div ref={printRef} className={styles.omrSheet}>
              <div className={styles.sheetHeader}>
                <h2 className={styles.sheetTitle}>{sheet.title}</h2>
                <div className={styles.studentInfo}>
                  <div className={styles.infoField}>
                    <label>Name:</label>
                    <div className={styles.blankLine}></div>
                  </div>
                  <div className={styles.infoField}>
                    <label>Roll No:</label>
                    <div className={styles.blankLine}></div>
                  </div>
                  <div className={styles.infoField}>
                    <label>Date:</label>
                    <div className={styles.blankLine}></div>
                  </div>
                </div>
              </div>

              <div className={styles.instructions}>
                <h3>Instructions:</h3>
                <p>{sheet.instructions}</p>
              </div>

              <div className={styles.questions}>
                {sheet.questions.map((question, index) => (
                  <div key={question.id} className={styles.question}>
                    <div className={styles.questionText}>
                      <span className={styles.questionNumber}>{index + 1}.</span>
                      {question.question}
                    </div>

                    <div className={styles.options}>
                      {question.options.map((option, optionIndex) => (
                        <div key={optionIndex} className={styles.option}>
                          <div className={styles.circle}></div>
                          <span className={styles.optionText}>
                            {String.fromCharCode(65 + optionIndex)}. {option}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.testMode}>
              <h3>Test Your Sheet</h3>
              <div className={styles.testQuestions}>
                {sheet.questions.map((question, index) => (
                  <div key={question.id} className={styles.testQuestion}>
                    <div className={styles.testQuestionText}>
                      {index + 1}. {question.question}
                    </div>
                    <div className={styles.testOptions}>
                      {question.options.map((option, optionIndex) => (
                        <label key={optionIndex} className={styles.testOption}>
                          <input
                            type="radio"
                            name={`answer-${question.id}`}
                            value={optionIndex}
                            checked={answers[question.id] === optionIndex}
                            onChange={(e) => setAnswers(prev => ({
                              ...prev,
                              [question.id]: parseInt(e.target.value)
                            }))}
                          />
                          <span className={styles.testOptionText}>
                            {String.fromCharCode(65 + optionIndex)}. {option}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.testActions}>
                <button onClick={resetAnswers} className={styles.resetBtn}>
                  Reset Answers
                </button>
                <button
                  onClick={() => setShowResults(true)}
                  className={styles.checkBtn}
                  disabled={Object.keys(answers).length !== sheet.questions.length}
                >
                  Check Results
                </button>
              </div>

              {showResults && (
                <div className={styles.results}>
                  <h4>Results</h4>
                  <div className={styles.score}>
                    <div className={styles.scoreItem}>
                      <span className={styles.scoreValue}>{score.correct}</span>
                      <span className={styles.scoreLabel}>Correct</span>
                    </div>
                    <div className={styles.scoreItem}>
                      <span className={styles.scoreValue}>{score.total}</span>
                      <span className={styles.scoreLabel}>Total</span>
                    </div>
                    <div className={styles.scoreItem}>
                      <span className={styles.scoreValue}>{score.percentage}%</span>
                      <span className={styles.scoreLabel}>Score</span>
                    </div>
                  </div>

                  <div className={styles.detailedResults}>
                    {sheet.questions.map((question, index) => (
                      <div key={question.id} className={styles.resultItem}>
                        <span className={styles.resultQuestion}>Q{index + 1}:</span>
                        <span className={`${styles.resultStatus} ${
                          answers[question.id] === question.correctAnswer ? styles.correct : styles.incorrect
                        }`}>
                          {answers[question.id] === question.correctAnswer ? '✓' : '✗'}
                        </span>
                        <span className={styles.resultAnswer}>
                          Your answer: {answers[question.id] !== undefined ? String.fromCharCode(65 + answers[question.id]) : 'Not answered'}
                        </span>
                        <span className={styles.correctAnswer}>
                          Correct: {String.fromCharCode(65 + question.correctAnswer)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}