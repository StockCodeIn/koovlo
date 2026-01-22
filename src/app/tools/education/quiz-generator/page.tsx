'use client';

import { useState, useEffect } from 'react';
import styles from './quizgenerator.module.css';

interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer';
  options?: string[];
  correctAnswer: string | number;
  explanation?: string;
  points: number;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  timeLimit?: number; // in minutes
  passingScore: number; // percentage
  createdAt: string;
  category: string;
}

interface QuizAttempt {
  quizId: string;
  answers: Record<string, string | number>;
  score: number;
  totalPoints: number;
  timeSpent: number; // in seconds
  completedAt: string;
}

const categories = [
  'General Knowledge',
  'Science',
  'Mathematics',
  'History',
  'Literature',
  'Geography',
  'Sports',
  'Technology',
  'Arts',
  'Other'
];

export default function QuizGeneratorTool() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isTakingQuiz, setIsTakingQuiz] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [quizStartTime, setQuizStartTime] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('quizzes');
    const savedAttempts = localStorage.getItem('quiz-attempts');
    if (saved) {
      setQuizzes(JSON.parse(saved));
    }
    if (savedAttempts) {
      setAttempts(JSON.parse(savedAttempts));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('quizzes', JSON.stringify(quizzes));
  }, [quizzes]);

  useEffect(() => {
    localStorage.setItem('quiz-attempts', JSON.stringify(attempts));
  }, [attempts]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isTakingQuiz && timeRemaining !== null && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev === null || prev <= 1) {
            // Time's up - auto-submit
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTakingQuiz, timeRemaining]);

  const createNewQuiz = () => {
    const newQuiz: Quiz = {
      id: Date.now().toString(),
      title: '',
      description: '',
      questions: [],
      passingScore: 70,
      createdAt: new Date().toISOString(),
      category: 'Other',
    };

    setQuizzes(prev => [...prev, newQuiz]);
    setCurrentQuiz(newQuiz);
    setIsCreating(true);
  };

  const saveQuiz = (quiz: Quiz) => {
    setQuizzes(prev => prev.map(q => q.id === quiz.id ? quiz : q));
    setCurrentQuiz(quiz);
  };

  const deleteQuiz = (id: string) => {
    setQuizzes(prev => prev.filter(q => q.id !== id));
    if (currentQuiz?.id === id) {
      setCurrentQuiz(null);
      setIsCreating(false);
    }
  };

  const addQuestion = (quizId: string) => {
    const newQuestion: QuizQuestion = {
      id: Date.now().toString(),
      question: '',
      type: 'multiple-choice',
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctAnswer: 0,
      points: 1,
    };

    const updatedQuiz = quizzes.find(q => q.id === quizId);
    if (updatedQuiz) {
      const updated = {
        ...updatedQuiz,
        questions: [...updatedQuiz.questions, newQuestion],
      };
      saveQuiz(updated);
    }
  };

  const updateQuestion = (quizId: string, questionId: string, updates: Partial<QuizQuestion>) => {
    const updatedQuiz = quizzes.find(q => q.id === quizId);
    if (updatedQuiz) {
      const updated = {
        ...updatedQuiz,
        questions: updatedQuiz.questions.map(q =>
          q.id === questionId ? { ...q, ...updates } : q
        ),
      };
      saveQuiz(updated);
    }
  };

  const deleteQuestion = (quizId: string, questionId: string) => {
    const updatedQuiz = quizzes.find(q => q.id === quizId);
    if (updatedQuiz) {
      const updated = {
        ...updatedQuiz,
        questions: updatedQuiz.questions.filter(q => q.id !== questionId),
      };
      saveQuiz(updated);
    }
  };

  const startQuiz = (quiz: Quiz) => {
    setCurrentQuiz(quiz);
    setIsTakingQuiz(true);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setShowResults(false);
    setQuizStartTime(Date.now());
    setTimeRemaining(quiz.timeLimit ? quiz.timeLimit * 60 : null);
  };

  const handleAnswerChange = (questionId: string, answer: string | number) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const nextQuestion = () => {
    if (currentQuiz && currentQuestionIndex < currentQuiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const calculateScore = (): { score: number; totalPoints: number; percentage: number; correct: number; total: number } => {
    if (!currentQuiz) return { score: 0, totalPoints: 0, percentage: 0, correct: 0, total: 0 };

    let correct = 0;
    let totalPoints = 0;
    let earnedPoints = 0;

    currentQuiz.questions.forEach(question => {
      totalPoints += question.points;
      const userAnswer = answers[question.id];

      if (question.type === 'multiple-choice' || question.type === 'true-false') {
        if (userAnswer === question.correctAnswer) {
          correct++;
          earnedPoints += question.points;
        }
      } else if (question.type === 'short-answer') {
        // For short answer, we'll assume it's correct for demo purposes
        // In a real app, you'd implement text similarity or manual grading
        if (userAnswer && String(userAnswer).trim().toLowerCase() === String(question.correctAnswer).toLowerCase()) {
          correct++;
          earnedPoints += question.points;
        }
      }
    });

    const percentage = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;

    return { score: earnedPoints, totalPoints, percentage, correct, total: currentQuiz.questions.length };
  };

  const handleSubmitQuiz = () => {
    if (!currentQuiz) return;

    const endTime = Date.now();
    const timeSpent = quizStartTime ? Math.floor((endTime - quizStartTime) / 1000) : 0;
    const { score, totalPoints, percentage } = calculateScore();

    const attempt: QuizAttempt = {
      quizId: currentQuiz.id,
      answers,
      score,
      totalPoints,
      timeSpent,
      completedAt: new Date().toISOString(),
    };

    setAttempts(prev => [...prev, attempt]);
    setShowResults(true);
    setIsTakingQuiz(false);
  };

  const resetQuiz = () => {
    setIsTakingQuiz(false);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setShowResults(false);
    setQuizStartTime(null);
    setTimeRemaining(null);
    setCurrentQuiz(null);
  };

  const exportQuiz = (quiz: Quiz) => {
    const data = {
      quiz,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${quiz.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}-quiz.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importQuiz = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.quiz) {
          setQuizzes(prev => [...prev, { ...data.quiz, id: Date.now().toString() }]);
        }
      } catch (error) {
        alert('Invalid file format');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getQuizAttempts = (quizId: string) => {
    return attempts.filter(attempt => attempt.quizId === quizId);
  };

  const currentQuestion = currentQuiz?.questions[currentQuestionIndex];
  const progress = currentQuiz ? ((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100 : 0;
  const results = showResults ? calculateScore() : null;

  return (
    <div className={styles.container}>
      <div className={styles.tool}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            📝 Quiz Generator
          </h1>
          <p className={styles.subtitle}>
            Create, manage, and take interactive quizzes with multiple question types
          </p>
        </div>

        {!isTakingQuiz && !showResults && (
          <div className={styles.quizLibrary}>
            <div className={styles.libraryHeader}>
              <h2>Quiz Library</h2>
              <div className={styles.libraryActions}>
                <button onClick={createNewQuiz} className={styles.createBtn}>
                  Create New Quiz
                </button>
                <label className={styles.importBtn}>
                  Import Quiz
                  <input
                    type="file"
                    accept=".json"
                    onChange={importQuiz}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>
            </div>

            <div className={styles.quizGrid}>
              {quizzes.map(quiz => {
                const quizAttempts = getQuizAttempts(quiz.id);
                const bestScore = quizAttempts.length > 0
                  ? Math.max(...quizAttempts.map(a => (a.score / a.totalPoints) * 100))
                  : 0;

                return (
                  <div key={quiz.id} className={styles.quizCard}>
                    <div className={styles.quizCardHeader}>
                      <h3 className={styles.quizTitle}>{quiz.title || 'Untitled Quiz'}</h3>
                      <span className={styles.quizCategory}>{quiz.category}</span>
                    </div>

                    <p className={styles.quizDescription}>
                      {quiz.description || 'No description'}
                    </p>

                    <div className={styles.quizStats}>
                      <div className={styles.stat}>
                        <span className={styles.statValue}>{quiz.questions.length}</span>
                        <span className={styles.statLabel}>Questions</span>
                      </div>
                      <div className={styles.stat}>
                        <span className={styles.statValue}>
                          {quiz.questions.reduce((sum, q) => sum + q.points, 0)}
                        </span>
                        <span className={styles.statLabel}>Points</span>
                      </div>
                      <div className={styles.stat}>
                        <span className={styles.statValue}>{quizAttempts.length}</span>
                        <span className={styles.statLabel}>Attempts</span>
                      </div>
                      {quizAttempts.length > 0 && (
                        <div className={styles.stat}>
                          <span className={styles.statValue}>{Math.round(bestScore)}%</span>
                          <span className={styles.statLabel}>Best Score</span>
                        </div>
                      )}
                    </div>

                    <div className={styles.quizActions}>
                      <button
                        onClick={() => startQuiz(quiz)}
                        className={styles.takeBtn}
                        disabled={quiz.questions.length === 0}
                      >
                        Take Quiz
                      </button>
                      <button
                        onClick={() => {
                          setCurrentQuiz(quiz);
                          setIsCreating(true);
                        }}
                        className={styles.editBtn}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => exportQuiz(quiz)}
                        className={styles.exportBtn}
                      >
                        Export
                      </button>
                      <button
                        onClick={() => deleteQuiz(quiz.id)}
                        className={styles.deleteBtn}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}

              {quizzes.length === 0 && (
                <div className={styles.emptyState}>
                  <p>No quizzes created yet. Click "Create New Quiz" to get started!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {isCreating && currentQuiz && (
          <div className={styles.quizEditor}>
            <div className={styles.editorHeader}>
              <h2>Edit Quiz</h2>
              <button onClick={() => setIsCreating(false)} className={styles.backBtn}>
                ← Back to Library
              </button>
            </div>

            <div className={styles.quizForm}>
              <div className={styles.formGroup}>
                <label>Title:</label>
                <input
                  type="text"
                  value={currentQuiz.title}
                  onChange={(e) => setCurrentQuiz(prev => prev ? { ...prev, title: e.target.value } : null)}
                  className={styles.titleInput}
                  placeholder="Quiz title..."
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Category:</label>
                  <select
                    value={currentQuiz.category}
                    onChange={(e) => setCurrentQuiz(prev => prev ? { ...prev, category: e.target.value } : null)}
                    className={styles.categorySelect}
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label>Time Limit (minutes):</label>
                  <input
                    type="number"
                    value={currentQuiz.timeLimit || ''}
                    onChange={(e) => setCurrentQuiz(prev => prev ? {
                      ...prev,
                      timeLimit: e.target.value ? parseInt(e.target.value) : undefined
                    } : null)}
                    className={styles.timeInput}
                    placeholder="No limit"
                    min="1"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Passing Score (%):</label>
                  <input
                    type="number"
                    value={currentQuiz.passingScore}
                    onChange={(e) => setCurrentQuiz(prev => prev ? {
                      ...prev,
                      passingScore: parseInt(e.target.value) || 0
                    } : null)}
                    className={styles.scoreInput}
                    min="0"
                    max="100"
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Description:</label>
                <textarea
                  value={currentQuiz.description}
                  onChange={(e) => setCurrentQuiz(prev => prev ? { ...prev, description: e.target.value } : null)}
                  className={styles.descriptionTextarea}
                  placeholder="Quiz description..."
                  rows={3}
                />
              </div>
            </div>

            <div className={styles.questionsEditor}>
              <div className={styles.questionsHeader}>
                <h3>Questions</h3>
                <button onClick={() => addQuestion(currentQuiz.id)} className={styles.addQuestionBtn}>
                  Add Question
                </button>
              </div>

              <div className={styles.questionsList}>
                {currentQuiz.questions.map((question, index) => (
                  <div key={question.id} className={styles.questionEditor}>
                    <div className={styles.questionHeader}>
                      <span className={styles.questionNumber}>Q{index + 1}</span>
                      <select
                        value={question.type}
                        onChange={(e) => updateQuestion(currentQuiz.id, question.id, { type: e.target.value as any })}
                        className={styles.typeSelect}
                      >
                        <option value="multiple-choice">Multiple Choice</option>
                        <option value="true-false">True/False</option>
                        <option value="short-answer">Short Answer</option>
                      </select>
                      <input
                        type="number"
                        value={question.points}
                        onChange={(e) => updateQuestion(currentQuiz.id, question.id, { points: parseInt(e.target.value) || 1 })}
                        className={styles.pointsInput}
                        min="1"
                      />
                      <button
                        onClick={() => deleteQuestion(currentQuiz.id, question.id)}
                        className={styles.deleteQuestionBtn}
                      >
                        🗑️
                      </button>
                    </div>

                    <div className={styles.questionContent}>
                      <input
                        type="text"
                        value={question.question}
                        onChange={(e) => updateQuestion(currentQuiz.id, question.id, { question: e.target.value })}
                        className={styles.questionInput}
                        placeholder="Enter question..."
                      />

                      {question.type === 'multiple-choice' && question.options && (
                        <div className={styles.optionsEditor}>
                          {question.options.map((option, optionIndex) => (
                            <div key={optionIndex} className={styles.optionRow}>
                              <input
                                type="radio"
                                name={`correct-${question.id}`}
                                checked={question.correctAnswer === optionIndex}
                                onChange={() => updateQuestion(currentQuiz.id, question.id, { correctAnswer: optionIndex })}
                                className={styles.correctRadio}
                              />
                              <input
                                type="text"
                                value={option}
                                onChange={(e) => {
                                  const newOptions = [...question.options!];
                                  newOptions[optionIndex] = e.target.value;
                                  updateQuestion(currentQuiz.id, question.id, { options: newOptions });
                                }}
                                className={styles.optionInput}
                                placeholder={`Option ${String.fromCharCode(65 + optionIndex)}`}
                              />
                            </div>
                          ))}
                        </div>
                      )}

                      {question.type === 'true-false' && (
                        <div className={styles.trueFalseOptions}>
                          <label className={styles.tfOption}>
                            <input
                              type="radio"
                              name={`correct-${question.id}`}
                              checked={question.correctAnswer === 0}
                              onChange={() => updateQuestion(currentQuiz.id, question.id, { correctAnswer: 0 })}
                            />
                            True
                          </label>
                          <label className={styles.tfOption}>
                            <input
                              type="radio"
                              name={`correct-${question.id}`}
                              checked={question.correctAnswer === 1}
                              onChange={() => updateQuestion(currentQuiz.id, question.id, { correctAnswer: 1 })}
                            />
                            False
                          </label>
                        </div>
                      )}

                      {question.type === 'short-answer' && (
                        <input
                          type="text"
                          value={String(question.correctAnswer)}
                          onChange={(e) => updateQuestion(currentQuiz.id, question.id, { correctAnswer: e.target.value })}
                          className={styles.shortAnswerInput}
                          placeholder="Correct answer..."
                        />
                      )}

                      <textarea
                        value={question.explanation || ''}
                        onChange={(e) => updateQuestion(currentQuiz.id, question.id, { explanation: e.target.value })}
                        className={styles.explanationTextarea}
                        placeholder="Explanation (optional)..."
                        rows={2}
                      />
                    </div>
                  </div>
                ))}

                {currentQuiz.questions.length === 0 && (
                  <div className={styles.emptyQuestions}>
                    <p>No questions added yet. Click "Add Question" to create your first question!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {isTakingQuiz && currentQuiz && currentQuestion && (
          <div className={styles.quizPlayer}>
            <div className={styles.quizHeader}>
              <h2>{currentQuiz.title}</h2>
              <div className={styles.quizInfo}>
                {timeRemaining !== null && (
                  <div className={styles.timer}>
                    Time: {formatTime(timeRemaining)}
                  </div>
                )}
                <div className={styles.progress}>
                  Question {currentQuestionIndex + 1} of {currentQuiz.questions.length}
                </div>
              </div>
            </div>

            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            <div className={styles.questionCard}>
              <div className={styles.questionContent}>
                <h3>{currentQuestion.question}</h3>

                {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
                  <div className={styles.options}>
                    {currentQuestion.options.map((option, index) => (
                      <label key={index} className={styles.option}>
                        <input
                          type="radio"
                          name={`question-${currentQuestion.id}`}
                          value={index}
                          checked={answers[currentQuestion.id] === index}
                          onChange={(e) => handleAnswerChange(currentQuestion.id, parseInt(e.target.value))}
                        />
                        <span className={styles.optionText}>
                          {String.fromCharCode(65 + index)}. {option}
                        </span>
                      </label>
                    ))}
                  </div>
                )}

                {currentQuestion.type === 'true-false' && (
                  <div className={styles.trueFalseOptions}>
                    <label className={styles.tfOption}>
                      <input
                        type="radio"
                        name={`question-${currentQuestion.id}`}
                        value={0}
                        checked={answers[currentQuestion.id] === 0}
                        onChange={(e) => handleAnswerChange(currentQuestion.id, 0)}
                      />
                      True
                    </label>
                    <label className={styles.tfOption}>
                      <input
                        type="radio"
                        name={`question-${currentQuestion.id}`}
                        value={1}
                        checked={answers[currentQuestion.id] === 1}
                        onChange={(e) => handleAnswerChange(currentQuestion.id, 1)}
                      />
                      False
                    </label>
                  </div>
                )}

                {currentQuestion.type === 'short-answer' && (
                  <input
                    type="text"
                    value={String(answers[currentQuestion.id] || '')}
                    onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                    className={styles.shortAnswerInput}
                    placeholder="Your answer..."
                  />
                )}
              </div>
            </div>

            <div className={styles.quizNavigation}>
              <button
                onClick={prevQuestion}
                disabled={currentQuestionIndex === 0}
                className={styles.navBtn}
              >
                ← Previous
              </button>

              <div className={styles.questionIndicators}>
                {currentQuiz.questions.map((_, index) => (
                  <div
                    key={index}
                    className={`${styles.indicator} ${index === currentQuestionIndex ? styles.active : ''} ${answers[currentQuiz.questions[index].id] !== undefined ? styles.answered : ''}`}
                    onClick={() => setCurrentQuestionIndex(index)}
                  />
                ))}
              </div>

              {currentQuestionIndex < currentQuiz.questions.length - 1 ? (
                <button onClick={nextQuestion} className={styles.navBtn}>
                  Next →
                </button>
              ) : (
                <button onClick={handleSubmitQuiz} className={styles.submitBtn}>
                  Submit Quiz
                </button>
              )}
            </div>
          </div>
        )}

        {showResults && currentQuiz && results && (
          <div className={styles.results}>
            <div className={styles.resultsHeader}>
              <h2>Quiz Results</h2>
              <button onClick={resetQuiz} className={styles.resetBtn}>
                ← Back to Library
              </button>
            </div>

            <div className={styles.scoreCard}>
              <div className={styles.scoreDisplay}>
                <div className={styles.mainScore}>
                  <span className={styles.scoreValue}>{results.percentage}%</span>
                  <span className={styles.scoreLabel}>Score</span>
                </div>
                <div className={styles.scoreDetails}>
                  <div className={styles.detail}>
                    <span className={styles.detailValue}>{results.correct}</span>
                    <span className={styles.detailLabel}>Correct</span>
                  </div>
                  <div className={styles.detail}>
                    <span className={styles.detailValue}>{results.total}</span>
                    <span className={styles.detailLabel}>Total</span>
                  </div>
                  <div className={styles.detail}>
                    <span className={styles.detailValue}>{results.score}/{results.totalPoints}</span>
                    <span className={styles.detailLabel}>Points</span>
                  </div>
                </div>
              </div>

              <div className={styles.passStatus}>
                {results.percentage >= currentQuiz.passingScore ? (
                  <div className={styles.passed}>
                    🎉 Passed! (Required: {currentQuiz.passingScore}%)
                  </div>
                ) : (
                  <div className={styles.failed}>
                    ❌ Failed (Required: {currentQuiz.passingScore}%)
                  </div>
                )}
              </div>
            </div>

            <div className={styles.detailedResults}>
              <h3>Question Review</h3>
              {currentQuiz.questions.map((question, index) => {
                const userAnswer = answers[question.id];
                const isCorrect = question.type === 'multiple-choice' || question.type === 'true-false'
                  ? userAnswer === question.correctAnswer
                  : String(userAnswer).toLowerCase().trim() === String(question.correctAnswer).toLowerCase().trim();

                return (
                  <div key={question.id} className={`${styles.questionReview} ${isCorrect ? styles.correct : styles.incorrect}`}>
                    <div className={styles.questionHeader}>
                      <span className={styles.questionNumber}>Q{index + 1}</span>
                      <span className={`${styles.resultIcon} ${isCorrect ? styles.correctIcon : styles.incorrectIcon}`}>
                        {isCorrect ? '✓' : '✗'}
                      </span>
                      <span className={styles.points}>(+{question.points} pts)</span>
                    </div>

                    <div className={styles.questionText}>{question.question}</div>

                    <div className={styles.answerComparison}>
                      <div className={styles.userAnswer}>
                        <strong>Your answer:</strong> {
                          question.type === 'multiple-choice' && question.options
                            ? question.options[Number(userAnswer)] || 'Not answered'
                            : question.type === 'true-false'
                            ? (userAnswer === 0 ? 'True' : userAnswer === 1 ? 'False' : 'Not answered')
                            : String(userAnswer || 'Not answered')
                        }
                      </div>
                      <div className={styles.correctAnswer}>
                        <strong>Correct answer:</strong> {
                          question.type === 'multiple-choice' && question.options
                            ? question.options[Number(question.correctAnswer)]
                            : question.type === 'true-false'
                            ? (question.correctAnswer === 0 ? 'True' : 'False')
                            : String(question.correctAnswer)
                        }
                      </div>
                    </div>

                    {question.explanation && (
                      <div className={styles.explanation}>
                        <strong>Explanation:</strong> {question.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}