'use client';

import { useEffect, useMemo, useState } from 'react';
import ToolInfo from '@/components/ToolInfo';
import styles from './flashcard.module.css';

type Difficulty = 'easy' | 'medium' | 'hard';
type StudyMode = 'all' | 'spaced' | 'category';

interface Flashcard {
  id: string;
  front: string;
  back: string;
  category: string;
  difficulty: Difficulty;
  lastReviewed?: string;
  nextReview?: string;
  correctCount: number;
  incorrectCount: number;
}

interface Category {
  id: string;
  name: string;
  color: string;
}

interface StoredState {
  cards?: Flashcard[];
  categories?: Category[];
}

const FLASHCARDS_KEY = 'flashcards';
const FLASHCARD_CATEGORIES_KEY = 'flashcard-categories';

const defaultCategories: Category[] = [
  { id: '1', name: 'Math', color: '#007bff' },
  { id: '2', name: 'Science', color: '#28a745' },
  { id: '3', name: 'History', color: '#dc3545' },
  { id: '4', name: 'Language', color: '#ffc107' },
  { id: '5', name: 'Other', color: '#6c757d' },
];

const createId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const getInitialState = (): StoredState => {
  if (typeof window === 'undefined') {
    return { cards: [], categories: defaultCategories };
  }

  try {
    const savedCards = window.localStorage.getItem(FLASHCARDS_KEY);
    const savedCategories = window.localStorage.getItem(FLASHCARD_CATEGORIES_KEY);

    return {
      cards: savedCards ? (JSON.parse(savedCards) as Flashcard[]) : [],
      categories: savedCategories
        ? (JSON.parse(savedCategories) as Category[])
        : defaultCategories,
    };
  } catch (error) {
    console.error('Error loading flashcards:', error);
    return { cards: [], categories: defaultCategories };
  }
};

const normalizeDifficulty = (value: string): Difficulty => {
  if (value === 'easy' || value === 'medium' || value === 'hard') {
    return value;
  }

  return 'medium';
};

const presetCards: Record<'science' | 'history' | 'math', Omit<Flashcard, 'id' | 'correctCount' | 'incorrectCount'>[]> = {
  science: [
    {
      front: 'What is photosynthesis?',
      back: 'The process plants use to convert light energy into chemical energy.',
      category: '2',
      difficulty: 'medium',
    },
    {
      front: 'What is DNA?',
      back: 'DNA is the molecule that carries genetic information in living organisms.',
      category: '2',
      difficulty: 'easy',
    },
    {
      front: "Newton's First Law?",
      back: 'An object stays at rest or in motion unless acted on by an external force.',
      category: '2',
      difficulty: 'medium',
    },
    {
      front: 'What is H2O?',
      back: 'Water, made of two hydrogen atoms and one oxygen atom.',
      category: '2',
      difficulty: 'easy',
    },
  ],
  history: [
    {
      front: 'When was World War II?',
      back: '1939 to 1945.',
      category: '3',
      difficulty: 'easy',
    },
    {
      front: 'Who was the first US President?',
      back: 'George Washington.',
      category: '3',
      difficulty: 'easy',
    },
    {
      front: 'What was the Renaissance?',
      back: 'A major European cultural movement from roughly the 14th to 17th century.',
      category: '3',
      difficulty: 'medium',
    },
    {
      front: 'French Revolution year?',
      back: '1789.',
      category: '3',
      difficulty: 'medium',
    },
  ],
  math: [
    {
      front: 'Pythagorean theorem?',
      back: 'a^2 + b^2 = c^2',
      category: '1',
      difficulty: 'medium',
    },
    {
      front: 'What is pi?',
      back: 'The ratio of a circle circumference to its diameter, approximately 3.14159.',
      category: '1',
      difficulty: 'easy',
    },
    {
      front: 'Quadratic formula?',
      back: 'x = (-b +/- sqrt(b^2 - 4ac)) / 2a',
      category: '1',
      difficulty: 'hard',
    },
    {
      front: 'Sum of angles in a triangle?',
      back: '180 degrees.',
      category: '1',
      difficulty: 'easy',
    },
  ],
};

export default function FlashcardTool() {
  const initialState = getInitialState();
  const [cards, setCards] = useState<Flashcard[]>(initialState.cards || []);
  const [categories, setCategories] = useState<Category[]>(
    initialState.categories || defaultCategories
  );
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [studyMode, setStudyMode] = useState<StudyMode>('all');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [newCard, setNewCard] = useState({
    front: '',
    back: '',
    category: '',
    difficulty: 'medium' as Difficulty,
  });
  const [isAdding, setIsAdding] = useState(false);
  const [isBulkAdding, setIsBulkAdding] = useState(false);
  const [bulkInput, setBulkInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [studyTimer, setStudyTimer] = useState(0);
  const [isStudying, setIsStudying] = useState(false);
  const [lastSaved, setLastSaved] = useState('');

  useEffect(() => {
    window.localStorage.setItem(FLASHCARDS_KEY, JSON.stringify(cards));
  }, [cards]);

  useEffect(() => {
    window.localStorage.setItem(
      FLASHCARD_CATEGORIES_KEY,
      JSON.stringify(categories)
    );
  }, [categories]);

  useEffect(() => {
    if (!isStudying) {
      return;
    }

    const interval = window.setInterval(() => {
      setStudyTimer((previous) => previous + 1);
    }, 1000);

    return () => window.clearInterval(interval);
  }, [isStudying]);

  const filteredCards = useMemo(() => {
    let filtered = cards;

    if (studyMode === 'category' && selectedCategory) {
      filtered = filtered.filter((card) => card.category === selectedCategory);
    } else if (studyMode === 'spaced') {
      const now = new Date();
      filtered = filtered.filter((card) => {
        if (!card.nextReview) return true;
        return new Date(card.nextReview) <= now;
      });
    }

    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase();
      filtered = filtered.filter((card) => {
        const categoryName =
          categories.find((category) => category.id === card.category)?.name || '';

        return [card.front, card.back, categoryName].some((value) =>
          value.toLowerCase().includes(query)
        );
      });
    }

    return filtered;
  }, [cards, categories, searchTerm, selectedCategory, studyMode]);

  const safeCardIndex =
    filteredCards.length === 0
      ? 0
      : Math.min(currentCardIndex, filteredCards.length - 1);

  const currentCard = filteredCards[safeCardIndex] || null;
  const progress =
    filteredCards.length > 0
      ? ((safeCardIndex + 1) / filteredCards.length) * 100
      : 0;

  const updateLastSaved = () => {
    setLastSaved(
      new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      })
    );
  };

  const resetCardView = () => {
    setShowAnswer(false);
    setIsFlipped(false);
  };

  const nextCard = () => {
    if (filteredCards.length === 0) return;
    setCurrentCardIndex((previous) => (previous + 1) % filteredCards.length);
    resetCardView();
  };

  const prevCard = () => {
    if (filteredCards.length === 0) return;
    setCurrentCardIndex(
      (previous) => (previous - 1 + filteredCards.length) % filteredCards.length
    );
    resetCardView();
  };

  const flipCard = () => {
    setIsFlipped((previous) => !previous);
    setShowAnswer(true);
  };

  const getNextReviewDate = (
    card: Flashcard,
    answeredCorrectly: boolean
  ): string => {
    const nextDate = new Date();
    let daysToAdd = 1;

    if (answeredCorrectly) {
      const correctStreak = card.correctCount + 1;
      if (correctStreak === 1) daysToAdd = 1;
      else if (correctStreak === 2) daysToAdd = 3;
      else if (correctStreak === 3) daysToAdd = 7;
      else if (correctStreak === 4) daysToAdd = 14;
      else daysToAdd = 30;
    }

    if (card.difficulty === 'easy') {
      daysToAdd = Math.max(1, Math.floor(daysToAdd * 1.5));
    } else if (card.difficulty === 'hard') {
      daysToAdd = Math.max(1, Math.floor(daysToAdd * 0.7));
    }

    nextDate.setDate(nextDate.getDate() + daysToAdd);
    return nextDate.toISOString();
  };

  const updateCardPerformance = (answeredCorrectly: boolean) => {
    if (!currentCard) return;

    const reviewedAt = new Date().toISOString();
    const nextReview = getNextReviewDate(currentCard, answeredCorrectly);

    setCards((previous) =>
      previous.map((card) =>
        card.id === currentCard.id
          ? {
              ...card,
              correctCount: answeredCorrectly
                ? card.correctCount + 1
                : card.correctCount,
              incorrectCount: answeredCorrectly
                ? card.incorrectCount
                : card.incorrectCount + 1,
              lastReviewed: reviewedAt,
              nextReview,
            }
          : card
      )
    );

    updateLastSaved();
    nextCard();
  };

  const markCorrect = () => updateCardPerformance(true);
  const markIncorrect = () => updateCardPerformance(false);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (isAdding || isBulkAdding) return;

      if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault();
        setIsFlipped((previous) => !previous);
        setShowAnswer(true);
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        if (filteredCards.length > 0) {
          setCurrentCardIndex(
            (previous) => (previous + 1) % filteredCards.length
          );
          resetCardView();
        }
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        if (filteredCards.length > 0) {
          setCurrentCardIndex(
            (previous) =>
              (previous - 1 + filteredCards.length) % filteredCards.length
          );
          resetCardView();
        }
      } else if (event.key === '1' && showAnswer) {
        event.preventDefault();
        if (currentCard) {
          const reviewedAt = new Date().toISOString();
          const nextReview = getNextReviewDate(currentCard, false);

          setCards((previous) =>
            previous.map((card) =>
              card.id === currentCard.id
                ? {
                    ...card,
                    incorrectCount: card.incorrectCount + 1,
                    lastReviewed: reviewedAt,
                    nextReview,
                  }
                : card
            )
          );

          updateLastSaved();
          if (filteredCards.length > 0) {
            setCurrentCardIndex(
              (previous) => (previous + 1) % filteredCards.length
            );
            resetCardView();
          }
        }
      } else if (event.key === '2' && showAnswer) {
        event.preventDefault();
        if (currentCard) {
          const reviewedAt = new Date().toISOString();
          const nextReview = getNextReviewDate(currentCard, true);

          setCards((previous) =>
            previous.map((card) =>
              card.id === currentCard.id
                ? {
                    ...card,
                    correctCount: card.correctCount + 1,
                    lastReviewed: reviewedAt,
                    nextReview,
                  }
                : card
            )
          );

          updateLastSaved();
          if (filteredCards.length > 0) {
            setCurrentCardIndex(
              (previous) => (previous + 1) % filteredCards.length
            );
            resetCardView();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [
    currentCard,
    filteredCards.length,
    isAdding,
    isBulkAdding,
    showAnswer,
  ]);

  const addCard = () => {
    if (!newCard.front.trim() || !newCard.back.trim()) return;

    const card: Flashcard = {
      id: createId(),
      front: newCard.front.trim(),
      back: newCard.back.trim(),
      category: newCard.category,
      difficulty: newCard.difficulty,
      correctCount: 0,
      incorrectCount: 0,
    };

    setCards((previous) => [...previous, card]);
    setNewCard({ front: '', back: '', category: '', difficulty: 'medium' });
    setIsAdding(false);
    updateLastSaved();
  };

  const bulkAddCards = () => {
    const lines = bulkInput.split('\n').filter((line) => line.trim());

    const newCards: Flashcard[] = lines
      .map((line) => {
        const parts = line.split('|').map((part) => part.trim());
        if (parts.length < 2) return null;

        return {
          id: createId(),
          front: parts[0],
          back: parts[1],
          category: parts[2] || '',
          difficulty: normalizeDifficulty(parts[3] || 'medium'),
          correctCount: 0,
          incorrectCount: 0,
        } as Flashcard;
      })
      .filter((card): card is Flashcard => Boolean(card));

    if (newCards.length === 0) return;

    setCards((previous) => [...previous, ...newCards]);
    setBulkInput('');
    setIsBulkAdding(false);
    updateLastSaved();
  };

  const loadPreset = (type: 'science' | 'history' | 'math') => {
    const newCards: Flashcard[] = presetCards[type].map((card) => ({
      ...card,
      id: createId(),
      correctCount: 0,
      incorrectCount: 0,
    }));

    setCards((previous) => [...previous, ...newCards]);
    updateLastSaved();
  };

  const shuffleCards = () => {
    if (filteredCards.length <= 1) return;

    const randomIndex = Math.floor(Math.random() * filteredCards.length);
    setCurrentCardIndex(randomIndex);
    resetCardView();
  };

  const resetProgress = () => {
    setCards((previous) =>
      previous.map((card) => ({
        ...card,
        correctCount: 0,
        incorrectCount: 0,
        lastReviewed: undefined,
        nextReview: undefined,
      }))
    );
    updateLastSaved();
  };

  const startStudySession = () => {
    setIsStudying(true);
    setStudyTimer(0);
    setCurrentCardIndex(0);
    resetCardView();
  };

  const stopStudySession = () => {
    setIsStudying(false);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const exportCards = () => {
    const data = {
      cards,
      categories,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'flashcards-backup.json';
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const importCards = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      try {
        const data = JSON.parse(loadEvent.target?.result as string) as StoredState;
        if (data.cards && Array.isArray(data.cards)) {
          setCards(data.cards);
        }
        if (data.categories && Array.isArray(data.categories)) {
          setCategories(data.categories);
        }
        updateLastSaved();
      } catch {
        alert('Invalid file format');
      }
    };

    reader.readAsText(file);
    event.target.value = '';
  };

  const totalCorrectAnswers = cards.reduce(
    (sum, card) => sum + card.correctCount,
    0
  );

  return (
    <div className={styles.container}>
      <div className={styles.tool}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            <span className={styles.icon}>Cards</span>
            Flashcard Study Tool
          </h1>
          <p className={styles.subtitle}>
            Create digital flashcards, review them with spaced repetition, and
            keep your study set saved in the browser.
          </p>
          <div className={styles.dataInfo}>
            <span className={styles.infoItem}>
              <strong>Auto-save:</strong> Every change stays on this device
            </span>
            <span className={styles.infoSeparator}>•</span>
            <span className={styles.infoItem}>
              {lastSaved ? (
                <>
                  <strong>Last saved:</strong> {lastSaved}
                </>
              ) : (
                'Ready to study'
              )}
            </span>
          </div>
          <p className={styles.infoText}>
            <strong>Tip:</strong> Export a backup before clearing browser data
            or changing devices so you can import your flashcards later.
          </p>
          {isStudying && (
            <div className={styles.timer}>
              Study time: <strong>{formatTime(studyTimer)}</strong>
            </div>
          )}
        </div>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statValue}>{cards.length}</span>
            <span className={styles.statLabel}>Total Cards</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>{totalCorrectAnswers}</span>
            <span className={styles.statLabel}>Correct Answers</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>{filteredCards.length}</span>
            <span className={styles.statLabel}>Cards to Study</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>{Math.round(progress)}%</span>
            <span className={styles.statLabel}>Progress</span>
          </div>
        </div>

        <div className={styles.controls}>
          <div className={styles.modeSelector}>
            <select
              value={studyMode}
              onChange={(event) =>
                setStudyMode(event.target.value as StudyMode)
              }
              className={styles.select}
            >
              <option value="all">All Cards</option>
              <option value="spaced">Spaced Repetition</option>
              <option value="category">By Category</option>
            </select>

            {studyMode === 'category' && (
              <select
                value={selectedCategory}
                onChange={(event) => setSelectedCategory(event.target.value)}
                className={styles.select}
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            )}

            <input
              type="text"
              placeholder="Search cards..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.presetSection}>
            <button
              onClick={() => loadPreset('science')}
              className={styles.presetBtn}
            >
              Science
            </button>
            <button
              onClick={() => loadPreset('history')}
              className={styles.presetBtn}
            >
              History
            </button>
            <button
              onClick={() => loadPreset('math')}
              className={styles.presetBtn}
            >
              Math
            </button>
          </div>

          <div className={styles.actions}>
            <button onClick={() => setIsAdding(true)} className={styles.addBtn}>
              + Add Card
            </button>
            <button
              onClick={() => setIsBulkAdding(true)}
              className={styles.bulkBtn}
            >
              Bulk Import
            </button>
            <button onClick={shuffleCards} className={styles.shuffleBtn}>
              Shuffle
            </button>
            {!isStudying ? (
              <button
                onClick={startStudySession}
                className={styles.startBtn}
              >
                Start Session
              </button>
            ) : (
              <button onClick={stopStudySession} className={styles.stopBtn}>
                Stop
              </button>
            )}
            <button onClick={resetProgress} className={styles.resetBtn}>
              Reset
            </button>
            <button onClick={exportCards} className={styles.exportBtn}>
              Export
            </button>
            <label className={styles.importBtn}>
              Import
              <input
                type="file"
                accept=".json"
                onChange={importCards}
                style={{ display: 'none' }}
              />
            </label>
          </div>
        </div>

        {filteredCards.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No flashcards found. Add your first card to get started.</p>
          </div>
        ) : (
          <>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className={styles.cardContainer}>
              <div
                className={`${styles.card} ${isFlipped ? styles.flipped : ''}`}
                onClick={flipCard}
              >
                <div className={styles.cardFace}>
                  <div className={styles.cardContent}>
                    <div className={styles.cardLabel}>Question</div>
                    <div className={styles.cardText}>
                      {currentCard?.front || 'No card selected'}
                    </div>
                    {currentCard && (
                      <div className={styles.cardMeta}>
                        <span
                          className={styles.categoryTag}
                          style={{
                            backgroundColor:
                              categories.find(
                                (category) => category.id === currentCard.category
                              )?.color || '#6c757d',
                          }}
                        >
                          {categories.find(
                            (category) => category.id === currentCard.category
                          )?.name || 'Uncategorized'}
                        </span>
                        <span
                          className={`${styles.difficulty} ${styles[currentCard.difficulty]}`}
                        >
                          {currentCard.difficulty}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className={styles.cardFace}>
                  <div className={styles.cardContent}>
                    <div className={styles.cardLabel}>Answer</div>
                    <div className={styles.cardText}>
                      {currentCard?.back || 'No answer available'}
                    </div>
                    {currentCard && (
                      <div className={styles.cardStats}>
                        <div className={styles.stat}>
                          <span className={styles.statValue}>
                            {currentCard.correctCount}
                          </span>
                          <span className={styles.statLabel}>Correct</span>
                        </div>
                        <div className={styles.stat}>
                          <span className={styles.statValue}>
                            {currentCard.incorrectCount}
                          </span>
                          <span className={styles.statLabel}>Incorrect</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className={styles.cardActions}>
                <button onClick={prevCard} className={styles.navBtn}>
                  Previous
                </button>

                <div className={styles.cardCounter}>
                  {safeCardIndex + 1} / {filteredCards.length}
                </div>

                <button onClick={nextCard} className={styles.navBtn}>
                  Next
                </button>
              </div>

              {showAnswer && (
                <div className={styles.answerActions}>
                  <button
                    onClick={markIncorrect}
                    className={styles.incorrectBtn}
                  >
                    Incorrect
                  </button>
                  <button onClick={markCorrect} className={styles.correctBtn}>
                    Correct
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {isAdding && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <h3>Add New Flashcard</h3>

              <div className={styles.formGroup}>
                <label>Question (Front):</label>
                <textarea
                  value={newCard.front}
                  onChange={(event) =>
                    setNewCard((previous) => ({
                      ...previous,
                      front: event.target.value,
                    }))
                  }
                  placeholder="Enter the question..."
                  className={styles.textarea}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Answer (Back):</label>
                <textarea
                  value={newCard.back}
                  onChange={(event) =>
                    setNewCard((previous) => ({
                      ...previous,
                      back: event.target.value,
                    }))
                  }
                  placeholder="Enter the answer..."
                  className={styles.textarea}
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Category:</label>
                  <select
                    value={newCard.category}
                    onChange={(event) =>
                      setNewCard((previous) => ({
                        ...previous,
                        category: event.target.value,
                      }))
                    }
                    className={styles.select}
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label>Difficulty:</label>
                  <select
                    value={newCard.difficulty}
                    onChange={(event) =>
                      setNewCard((previous) => ({
                        ...previous,
                        difficulty: normalizeDifficulty(event.target.value),
                      }))
                    }
                    className={styles.select}
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>

              <div className={styles.modalActions}>
                <button
                  onClick={() => setIsAdding(false)}
                  className={styles.cancelBtn}
                >
                  Cancel
                </button>
                <button onClick={addCard} className={styles.saveBtn}>
                  Add Card
                </button>
              </div>
            </div>
          </div>
        )}

        {isBulkAdding && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <h3>Bulk Import Flashcards</h3>
              <p className={styles.bulkInstructions}>
                Enter one card per line in this format:
                <br />
                <code>Question | Answer | Category | Difficulty</code>
                <br />
                <small>Category and difficulty are optional.</small>
              </p>

              <div className={styles.formGroup}>
                <textarea
                  value={bulkInput}
                  onChange={(event) => setBulkInput(event.target.value)}
                  placeholder={
                    'Question 1 | Answer 1 | 2 | easy\nQuestion 2 | Answer 2 | 1 | hard'
                  }
                  className={styles.bulkTextarea}
                  rows={10}
                />
              </div>

              <div className={styles.modalActions}>
                <button
                  onClick={() => setIsBulkAdding(false)}
                  className={styles.cancelBtn}
                >
                  Cancel
                </button>
                <button onClick={bulkAddCards} className={styles.saveBtn}>
                  Import {bulkInput.split('\n').filter((line) => line.trim()).length}{' '}
                  Cards
                </button>
              </div>
            </div>
          </div>
        )}

        <ToolInfo
          howItWorks="Add your own flashcards or load a preset topic<br>Choose all cards, spaced repetition, or category mode<br>Flip the card to reveal the answer<br>Mark each answer correct or incorrect to build review history"
          faqs={[
            {
              title: 'Does this support spaced repetition?',
              content:
                'Yes. When you mark a card correct or incorrect, the tool schedules the next review date based on performance and difficulty.',
            },
            {
              title: 'Is my data stored online?',
              content:
                'No. Flashcards are stored in your browser unless you export a backup manually.',
            },
            {
              title: 'Can I import existing cards?',
              content:
                'Yes. You can bulk import cards line by line or import a JSON backup exported from this tool.',
            },
            {
              title: 'Can I study by subject?',
              content:
                'Yes. Category mode lets you focus on a specific topic or subject area.',
            },
          ]}
          tips={[
            'Short, specific questions usually work better than long paragraphs.',
            'Use spaced repetition mode regularly for better exam retention.',
            'Export backups if you rely on this tool across study sessions.',
          ]}
        />
      </div>
    </div>
  );
}
