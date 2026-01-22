'use client';

import { useState, useEffect } from 'react';
import styles from './flashcard.module.css';

interface Flashcard {
  id: string;
  front: string;
  back: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
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

const defaultCategories: Category[] = [
  { id: '1', name: 'Math', color: '#007bff' },
  { id: '2', name: 'Science', color: '#28a745' },
  { id: '3', name: 'History', color: '#dc3545' },
  { id: '4', name: 'Language', color: '#ffc107' },
  { id: '5', name: 'Other', color: '#6c757d' },
];

export default function FlashcardTool() {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [studyMode, setStudyMode] = useState<'all' | 'spaced' | 'category'>('all');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [newCard, setNewCard] = useState({ front: '', back: '', category: '', difficulty: 'medium' as const });
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('flashcards');
    const savedCategories = localStorage.getItem('flashcard-categories');
    if (saved) {
      setCards(JSON.parse(saved));
    }
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('flashcards', JSON.stringify(cards));
  }, [cards]);

  useEffect(() => {
    localStorage.setItem('flashcard-categories', JSON.stringify(categories));
  }, [categories]);

  const addCard = () => {
    if (!newCard.front.trim() || !newCard.back.trim()) return;

    const card: Flashcard = {
      id: Date.now().toString(),
      front: newCard.front.trim(),
      back: newCard.back.trim(),
      category: newCard.category,
      difficulty: newCard.difficulty,
      correctCount: 0,
      incorrectCount: 0,
    };

    setCards(prev => [...prev, card]);
    setNewCard({ front: '', back: '', category: '', difficulty: 'medium' });
    setIsAdding(false);
  };

  const deleteCard = (id: string) => {
    setCards(prev => prev.filter(card => card.id !== id));
    if (currentCardIndex >= cards.length - 1) {
      setCurrentCardIndex(Math.max(0, cards.length - 2));
    }
  };

  const editCard = (id: string, updates: Partial<Flashcard>) => {
    setCards(prev => prev.map(card =>
      card.id === id ? { ...card, ...updates } : card
    ));
  };

  const markCorrect = () => {
    const card = getCurrentCard();
    if (!card) return;

    const now = new Date();
    const nextReview = calculateNextReview(card, true);

    editCard(card.id, {
      correctCount: card.correctCount + 1,
      lastReviewed: now.toISOString(),
      nextReview: nextReview.toISOString(),
    });

    nextCard();
  };

  const markIncorrect = () => {
    const card = getCurrentCard();
    if (!card) return;

    const now = new Date();
    const nextReview = calculateNextReview(card, false);

    editCard(card.id, {
      incorrectCount: card.incorrectCount + 1,
      lastReviewed: now.toISOString(),
      nextReview: nextReview.toISOString(),
    });

    nextCard();
  };

  const calculateNextReview = (card: Flashcard, correct: boolean): Date => {
    const now = new Date();
    let daysToAdd = 1;

    if (correct) {
      // Spaced repetition: increase interval based on correct answers
      const correctStreak = card.correctCount + 1;
      if (correctStreak === 1) daysToAdd = 1;
      else if (correctStreak === 2) daysToAdd = 3;
      else if (correctStreak === 3) daysToAdd = 7;
      else if (correctStreak === 4) daysToAdd = 14;
      else daysToAdd = 30;
    } else {
      // Reset to 1 day if incorrect
      daysToAdd = 1;
    }

    // Adjust based on difficulty
    if (card.difficulty === 'easy') daysToAdd = Math.floor(daysToAdd * 1.5);
    else if (card.difficulty === 'hard') daysToAdd = Math.floor(daysToAdd * 0.7);

    now.setDate(now.getDate() + daysToAdd);
    return now;
  };

  const getFilteredCards = () => {
    let filtered = cards;

    if (studyMode === 'category' && selectedCategory) {
      filtered = filtered.filter(card => card.category === selectedCategory);
    } else if (studyMode === 'spaced') {
      const now = new Date();
      filtered = filtered.filter(card => {
        if (!card.nextReview) return true;
        return new Date(card.nextReview) <= now;
      });
    }

    if (searchTerm) {
      filtered = filtered.filter(card =>
        card.front.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.back.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const getCurrentCard = () => {
    const filteredCards = getFilteredCards();
    return filteredCards[currentCardIndex] || null;
  };

  const nextCard = () => {
    const filteredCards = getFilteredCards();
    if (filteredCards.length === 0) return;

    setCurrentCardIndex(prev => (prev + 1) % filteredCards.length);
    setShowAnswer(false);
    setIsFlipped(false);
  };

  const prevCard = () => {
    const filteredCards = getFilteredCards();
    if (filteredCards.length === 0) return;

    setCurrentCardIndex(prev => (prev - 1 + filteredCards.length) % filteredCards.length);
    setShowAnswer(false);
    setIsFlipped(false);
  };

  const shuffleCards = () => {
    const filteredCards = getFilteredCards();
    if (filteredCards.length === 0) return;

    const shuffled = [...filteredCards].sort(() => Math.random() - 0.5);
    const newIndex = shuffled.findIndex(card => card.id === getCurrentCard()?.id) || 0;
    setCurrentCardIndex(newIndex);
    setShowAnswer(false);
    setIsFlipped(false);
  };

  const flipCard = () => {
    setIsFlipped(!isFlipped);
    if (!showAnswer) {
      setShowAnswer(true);
    }
  };

  const resetProgress = () => {
    setCards(prev => prev.map(card => ({
      ...card,
      correctCount: 0,
      incorrectCount: 0,
      lastReviewed: undefined,
      nextReview: undefined,
    })));
  };

  const exportCards = () => {
    const data = {
      cards,
      categories,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'flashcards-backup.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const importCards = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.cards && Array.isArray(data.cards)) {
          setCards(data.cards);
        }
        if (data.categories && Array.isArray(data.categories)) {
          setCategories(data.categories);
        }
      } catch (error) {
        alert('Invalid file format');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const filteredCards = getFilteredCards();
  const currentCard = getCurrentCard();
  const progress = filteredCards.length > 0 ? ((currentCardIndex + 1) / filteredCards.length) * 100 : 0;

  return (
    <div className={styles.container}>
      <div className={styles.tool}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            🃏 Flashcard Study Tool
          </h1>
          <p className={styles.subtitle}>
            Master concepts with spaced repetition and interactive flashcards
          </p>
        </div>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statValue}>{cards.length}</span>
            <span className={styles.statLabel}>Total Cards</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>
              {cards.reduce((sum, card) => sum + card.correctCount, 0)}
            </span>
            <span className={styles.statLabel}>Correct Answers</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>
              {filteredCards.length}
            </span>
            <span className={styles.statLabel}>Cards to Study</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>
              {Math.round(progress)}%
            </span>
            <span className={styles.statLabel}>Progress</span>
          </div>
        </div>

        <div className={styles.controls}>
          <div className={styles.modeSelector}>
            <select
              value={studyMode}
              onChange={(e) => setStudyMode(e.target.value as any)}
              className={styles.select}
            >
              <option value="all">All Cards</option>
              <option value="spaced">Spaced Repetition</option>
              <option value="category">By Category</option>
            </select>

            {studyMode === 'category' && (
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={styles.select}
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            )}

            <input
              type="text"
              placeholder="Search cards..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.actions}>
            <button onClick={() => setIsAdding(true)} className={styles.addBtn}>
              Add Card
            </button>
            <button onClick={shuffleCards} className={styles.shuffleBtn}>
              Shuffle
            </button>
            <button onClick={resetProgress} className={styles.resetBtn}>
              Reset Progress
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
            <p>No flashcards found. Add your first card to get started!</p>
          </div>
        ) : (
          <>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${progress}%` }}
              ></div>
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
                            backgroundColor: categories.find(c => c.id === currentCard.category)?.color || '#6c757d'
                          }}
                        >
                          {categories.find(c => c.id === currentCard.category)?.name || 'Uncategorized'}
                        </span>
                        <span className={`${styles.difficulty} ${styles[currentCard.difficulty]}`}>
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
                          <span className={styles.statValue}>{currentCard.correctCount}</span>
                          <span className={styles.statLabel}>Correct</span>
                        </div>
                        <div className={styles.stat}>
                          <span className={styles.statValue}>{currentCard.incorrectCount}</span>
                          <span className={styles.statLabel}>Incorrect</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className={styles.cardActions}>
                <button onClick={prevCard} className={styles.navBtn}>
                  ← Previous
                </button>

                <div className={styles.cardCounter}>
                  {currentCardIndex + 1} / {filteredCards.length}
                </div>

                <button onClick={nextCard} className={styles.navBtn}>
                  Next →
                </button>
              </div>

              {showAnswer && (
                <div className={styles.answerActions}>
                  <button onClick={markIncorrect} className={styles.incorrectBtn}>
                    ❌ Incorrect
                  </button>
                  <button onClick={markCorrect} className={styles.correctBtn}>
                    ✅ Correct
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
                  onChange={(e) => setNewCard(prev => ({ ...prev, front: e.target.value }))}
                  placeholder="Enter the question..."
                  className={styles.textarea}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Answer (Back):</label>
                <textarea
                  value={newCard.back}
                  onChange={(e) => setNewCard(prev => ({ ...prev, back: e.target.value }))}
                  placeholder="Enter the answer..."
                  className={styles.textarea}
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Category:</label>
                  <select
                    value={newCard.category}
                    onChange={(e) => setNewCard(prev => ({ ...prev, category: e.target.value }))}
                    className={styles.select}
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label>Difficulty:</label>
                  <select
                    value={newCard.difficulty}
                    onChange={(e) => setNewCard(prev => ({ ...prev, difficulty: e.target.value as any }))}
                    className={styles.select}
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>

              <div className={styles.modalActions}>
                <button onClick={() => setIsAdding(false)} className={styles.cancelBtn}>
                  Cancel
                </button>
                <button onClick={addCard} className={styles.saveBtn}>
                  Add Card
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}