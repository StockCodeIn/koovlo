'use client';

import { useState, useEffect } from 'react';
import styles from './notesorganizer.module.css';

interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  isFavorite: boolean;
  isPinned: boolean;
  color?: string;
}

interface Category {
  id: string;
  name: string;
  color: string;
}

const defaultCategories: Category[] = [
  { id: '1', name: 'Study Notes', color: '#007bff' },
  { id: '2', name: 'Lecture Notes', color: '#28a745' },
  { id: '3', name: 'Research', color: '#dc3545' },
  { id: '4', name: 'Assignments', color: '#ffc107' },
  { id: '5', name: 'Personal', color: '#6c757d' },
];

export default function NotesOrganizerTool() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'category'>('date');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [lastSaved, setLastSaved] = useState<string>('');
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('#007bff');

  useEffect(() => {
    const saved = localStorage.getItem('notes');
    const savedCategories = localStorage.getItem('notes-categories');
    if (saved) {
      setNotes(JSON.parse(saved));
    }
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
    setLastSaved(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('notes-categories', JSON.stringify(categories));
  }, [categories]);

  const createNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'Untitled Note',
      content: '',
      category: '',
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isFavorite: false,
      isPinned: false,
      color: '#ffffff',
    };

    setNotes(prev => [newNote, ...prev]);
    setCurrentNote(newNote);
    setIsEditing(true);
  };

  const saveNote = (note: Note) => {
    const updatedNote = {
      ...note,
      updatedAt: new Date().toISOString(),
    };

    setNotes(prev => prev.map(n => n.id === note.id ? updatedNote : n));
    setCurrentNote(updatedNote);
    setIsEditing(false);
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
    if (currentNote?.id === id) {
      setCurrentNote(null);
      setIsEditing(false);
    }
  };

  const toggleFavorite = (id: string) => {
    setNotes(prev => prev.map(note =>
      note.id === id ? { ...note, isFavorite: !note.isFavorite } : note
    ));
  };

  const duplicateNote = (note: Note) => {
    const duplicatedNote: Note = {
      ...note,
      id: Date.now().toString(),
      title: `${note.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPinned: false,
    };

    setNotes(prev => [duplicatedNote, ...prev]);
    setCurrentNote(duplicatedNote);
    setIsEditing(true);
  };

  const getFilteredNotes = () => {
    let filtered = notes;

    if (searchTerm) {
      filtered = filtered.filter(note =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(note => note.category === selectedCategory);
    }

    if (showFavorites) {
      filtered = filtered.filter(note => note.isFavorite);
    }

    filtered.sort((a, b) => {
      if (a.isPinned !== b.isPinned) {
        return b.isPinned ? 1 : -1;
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      } else if (sortBy === 'category') {
        const aCat = categories.find(c => c.id === a.category)?.name || '';
        const bCat = categories.find(c => c.id === b.category)?.name || '';
        return aCat.localeCompare(bCat);
      } else {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
    });

    return filtered;
  };

  const togglePin = (id: string) => {
    setNotes(prev => prev.map(note =>
      note.id === id ? { ...note, isPinned: !note.isPinned } : note
    ));
  };

  const addCategory = () => {
    if (!newCategoryName.trim()) return;
    const newCategory: Category = {
      id: Date.now().toString(),
      name: newCategoryName,
      color: newCategoryColor,
    };
    setCategories(prev => [...prev, newCategory]);
    setNewCategoryName('');
    setNewCategoryColor('#007bff');
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(cat => cat.id !== id));
    setNotes(prev => prev.map(note => note.category === id ? { ...note, category: '' } : note));
  };

  const deleteSelectedNotes = () => {
    if (selectedNotes.length === 0) return;
    if (confirm(`Delete ${selectedNotes.length} selected note(s)?`)) {
      setNotes(prev => prev.filter(note => !selectedNotes.includes(note.id)));
      setSelectedNotes([]);
    }
  };

  const toggleNoteSelection = (id: string) => {
    setSelectedNotes(prev => 
      prev.includes(id) ? prev.filter(nId => nId !== id) : [...prev, id]
    );
  };

  const exportNotes = () => {
    const data = {
      notes,
      categories,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'notes-backup.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const importNotes = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.notes && Array.isArray(data.notes)) {
          setNotes(data.notes);
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

  const addTag = (noteId: string, tag: string) => {
    if (!tag.trim()) return;

    setNotes(prev => prev.map(note =>
      note.id === noteId
        ? { ...note, tags: [...new Set([...note.tags, tag.trim()])] }
        : note
    ));
  };

  const removeTag = (noteId: string, tagToRemove: string) => {
    setNotes(prev => prev.map(note =>
      note.id === noteId
        ? { ...note, tags: note.tags.filter(tag => tag !== tagToRemove) }
        : note
    ));
  };

  const filteredNotes = getFilteredNotes();
  const stats = {
    total: notes.length,
    favorites: notes.filter(n => n.isFavorite).length,
    pinned: notes.filter(n => n.isPinned).length,
    categories: new Set(notes.map(n => n.category)).size,
  };

  return (
    <div className={styles.container}>
      <div className={styles.tool}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            📝 Notes Organizer
          </h1>
          <p className={styles.subtitle}>
            Professional note-taking with categories, tags, pinning, and advanced organization
          </p>
          <div className={styles.proInfo}>
            💾 <strong>Auto-Save:</strong> Every change is automatically saved | 
            {lastSaved && <><strong>Last saved:</strong> {lastSaved}</> }
            <br/>
            ⚠️ <strong>Note:</strong> Data is stored on this device only. Clear browser cache = data loss (Backend sync coming soon)
          </div>
        </div>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statValue}>{stats.total}</span>
            <span className={styles.statLabel}>Total Notes</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>{stats.favorites}</span>
            <span className={styles.statLabel}>Favorites</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>{stats.pinned}</span>
            <span className={styles.statLabel}>Pinned</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>{stats.categories}</span>
            <span className={styles.statLabel}>Categories</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>{filteredNotes.length}</span>
            <span className={styles.statLabel}>Filtered</span>
          </div>
        </div>

        <div className={styles.controls}>
          <div className={styles.filters}>
            <input
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />

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

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className={styles.select}
            >
              <option value="date">Sort by Date</option>
              <option value="title">Sort by Title</option>
              <option value="category">Sort by Category</option>
            </select>
          </div>

          <div className={styles.viewControls}>
            <button
              onClick={() => setViewMode('list')}
              className={`${styles.viewBtn} ${viewMode === 'list' ? styles.active : ''}`}
            >
              📋 List
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`${styles.viewBtn} ${viewMode === 'grid' ? styles.active : ''}`}
            >
              🔲 Grid
            </button>
            <button
              onClick={() => setShowFavorites(!showFavorites)}
              className={`${styles.favoriteBtn} ${showFavorites ? styles.active : ''}`}
            >
              ⭐ {showFavorites ? 'All' : 'Favorites'}
            </button>
          </div>

          <div className={styles.actions}>
            <button onClick={createNewNote} className={styles.newBtn}>
              ✨ New Note
            </button>
            {selectedNotes.length > 0 && (
              <button onClick={deleteSelectedNotes} className={styles.deleteSelectedBtn}>
                🗑️ Delete {selectedNotes.length}
              </button>
            )}
            <button onClick={exportNotes} className={styles.exportBtn}>
              📥 Export All
            </button>
            <label className={styles.importBtn}>
              📤 Import
              <input
                type="file"
                accept=".json"
                onChange={importNotes}
                style={{ display: 'none' }}
              />
            </label>
          </div>

          <div className={styles.categoryManager}>
            <div className={styles.categoryHeader}>
              <h4>Manage Categories</h4>
              <button 
                className={styles.expandBtn}
                onClick={() => {
                  const cm = document.querySelector(`.${styles.categoryForm}`);
                  if (cm) cm.classList.toggle(styles.hidden);
                }}
              >
                +
              </button>
            </div>
            <div className={`${styles.categoryForm} ${styles.hidden}`}>
              <input
                type="text"
                placeholder="Category name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className={styles.categoryInput}
              />
              <input
                type="color"
                value={newCategoryColor}
                onChange={(e) => setNewCategoryColor(e.target.value)}
                className={styles.colorPicker}
              />
              <button onClick={addCategory} className={styles.addCategoryBtn}>
                Add
              </button>
            </div>
            <div className={styles.categoryList}>
              {categories.map(cat => (
                <div key={cat.id} className={styles.categoryItem}>
                  <span 
                    className={styles.categoryDot}
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className={styles.categoryName}>{cat.name}</span>
                  {!defaultCategories.some(dc => dc.id === cat.id) && (
                    <button 
                      onClick={() => deleteCategory(cat.id)}
                      className={styles.deleteCategoryBtn}
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.mainContent}>
          <div className={`${styles.notesList} ${viewMode === 'grid' ? styles.gridView : styles.listView}`}>
            {filteredNotes.length === 0 ? (
              <div className={styles.emptyState}>
                <p>No notes found. Create your first note to get started!</p>
              </div>
            ) : (
              filteredNotes.map(note => (
                <div
                  key={note.id}
                  className={`${styles.noteCard} ${currentNote?.id === note.id ? styles.active : ''}`}
                  onClick={() => {
                    setCurrentNote(note);
                    setIsEditing(false);
                  }}
                >
                  <div className={styles.noteCheckbox}>
                    <input
                      type="checkbox"
                      checked={selectedNotes.includes(note.id)}
                      onChange={() => toggleNoteSelection(note.id)}
                      onClick={(e) => e.stopPropagation()}
                      className={styles.checkbox}
                    />
                  </div>
                  <div className={styles.noteHeader}>
                    <div>
                      <h3 className={styles.noteTitle}>
                        {note.isPinned && '📌 '}
                        {note.title || 'Untitled'}
                      </h3>
                    </div>
                    <div className={styles.noteActions}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePin(note.id);
                        }}
                        className={`${styles.pinIcon} ${note.isPinned ? styles.pinned : ''}`}
                      >
                        📌
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(note.id);
                        }}
                        className={`${styles.favoriteIcon} ${note.isFavorite ? styles.favorited : ''}`}
                      >
                        ⭐
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          duplicateNote(note);
                        }}
                        className={styles.duplicateBtn}
                      >
                        📋
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm('Are you sure you want to delete this note?')) {
                            deleteNote(note.id);
                          }
                        }}
                        className={styles.deleteBtn}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  <div className={styles.notePreview}>
                    {note.content.substring(0, 150)}
                    {note.content.length > 150 && '...'}
                  </div>

                  <div className={styles.noteMeta}>
                    {note.category && (
                      <span
                        className={styles.categoryTag}
                        style={{
                          backgroundColor: categories.find(c => c.id === note.category)?.color || '#6c757d'
                        }}
                      >
                        {categories.find(c => c.id === note.category)?.name}
                      </span>
                    )}

                    <div className={styles.tags}>
                      {note.tags.slice(0, 3).map(tag => (
                        <span key={tag} className={styles.tag}>
                          #{tag}
                        </span>
                      ))}
                      {note.tags.length > 3 && (
                        <span className={styles.moreTags}>
                          +{note.tags.length - 3} more
                        </span>
                      )}
                    </div>

                    <span className={styles.date}>
                      {new Date(note.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className={styles.noteEditor}>
            {currentNote ? (
              <div className={styles.editorContent}>
                <div className={styles.editorHeader}>
                  <input
                    type="text"
                    value={currentNote.title}
                    onChange={(e) => setCurrentNote(prev => prev ? { ...prev, title: e.target.value } : null)}
                    className={styles.titleInput}
                    placeholder="Note title..."
                  />

                  <div className={styles.editorActions}>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className={styles.editBtn}
                    >
                      {isEditing ? 'Preview' : 'Edit'}
                    </button>
                    <button
                      onClick={() => saveNote(currentNote)}
                      className={styles.saveBtn}
                    >
                      Save
                    </button>
                  </div>
                </div>

                <div className={styles.noteMetadata}>
                  <select
                    value={currentNote.category}
                    onChange={(e) => setCurrentNote(prev => prev ? { ...prev, category: e.target.value } : null)}
                    className={styles.categorySelect}
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>

                  <div className={styles.tagsEditor}>
                    <input
                      type="text"
                      placeholder="Add tag..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addTag(currentNote.id, (e.target as HTMLInputElement).value);
                          (e.target as HTMLInputElement).value = '';
                        }
                      }}
                      className={styles.tagInput}
                    />
                    <div className={styles.currentTags}>
                      {currentNote.tags.map(tag => (
                        <span key={tag} className={styles.currentTag}>
                          #{tag}
                          <button
                            onClick={() => removeTag(currentNote.id, tag)}
                            className={styles.removeTagBtn}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className={styles.contentEditor}>
                  {isEditing ? (
                    <textarea
                      value={currentNote.content}
                      onChange={(e) => setCurrentNote(prev => prev ? { ...prev, content: e.target.value } : null)}
                      className={styles.contentTextarea}
                      placeholder="Start writing your note..."
                    />
                  ) : (
                    <div className={styles.contentPreview}>
                      {currentNote.content || 'No content yet. Click Edit to start writing.'}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className={styles.noNoteSelected}>
                <p>Select a note from the list to view and edit it.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}