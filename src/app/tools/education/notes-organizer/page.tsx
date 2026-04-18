'use client';

import { useEffect, useMemo, useState } from 'react';
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

interface StoredState {
  notes?: Note[];
  categories?: Category[];
}

const defaultCategories: Category[] = [
  { id: '1', name: 'Study Notes', color: '#007bff' },
  { id: '2', name: 'Lecture Notes', color: '#28a745' },
  { id: '3', name: 'Research', color: '#dc3545' },
  { id: '4', name: 'Assignments', color: '#ffc107' },
  { id: '5', name: 'Personal', color: '#6c757d' },
];

const NOTES_KEY = 'notes';
const CATEGORIES_KEY = 'notes-categories';
const createId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const getInitialState = (): StoredState => {
  if (typeof window === 'undefined') {
    return { notes: [], categories: defaultCategories };
  }

  try {
    const savedNotes = window.localStorage.getItem(NOTES_KEY);
    const savedCategories = window.localStorage.getItem(CATEGORIES_KEY);
    return {
      notes: savedNotes ? (JSON.parse(savedNotes) as Note[]) : [],
      categories: savedCategories ? (JSON.parse(savedCategories) as Category[]) : defaultCategories,
    };
  } catch (error) {
    console.error('Error loading notes:', error);
    return { notes: [], categories: defaultCategories };
  }
};

export default function NotesOrganizerTool() {
  const initialState = getInitialState();
  const [notes, setNotes] = useState<Note[]>(initialState.notes || []);
  const [categories, setCategories] = useState<Category[]>(initialState.categories || defaultCategories);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'category'>('date');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [lastSaved, setLastSaved] = useState('');
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('#007bff');
  const [showCategoryForm, setShowCategoryForm] = useState(false);

  useEffect(() => {
    window.localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    window.localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
  }, [categories]);

  const updateLastSaved = () => {
    setLastSaved(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
  };

  const createNewNote = () => {
    const newNote: Note = {
      id: createId(),
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

    setNotes((previous) => [newNote, ...previous]);
    setCurrentNote(newNote);
    setIsEditing(true);
    updateLastSaved();
  };

  const saveNote = (note: Note) => {
    const updatedNote = { ...note, updatedAt: new Date().toISOString() };
    setNotes((previous) => previous.map((item) => (item.id === note.id ? updatedNote : item)));
    setCurrentNote(updatedNote);
    setIsEditing(false);
    updateLastSaved();
  };

  const deleteNote = (id: string) => {
    setNotes((previous) => previous.filter((note) => note.id !== id));
    if (currentNote?.id === id) {
      setCurrentNote(null);
      setIsEditing(false);
    }
    updateLastSaved();
  };

  const toggleFavorite = (id: string) => {
    setNotes((previous) => previous.map((note) => (note.id === id ? { ...note, isFavorite: !note.isFavorite } : note)));
    updateLastSaved();
  };

  const duplicateNote = (note: Note) => {
    const duplicatedNote: Note = {
      ...note,
      id: createId(),
      title: `${note.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPinned: false,
    };

    setNotes((previous) => [duplicatedNote, ...previous]);
    setCurrentNote(duplicatedNote);
    setIsEditing(true);
    updateLastSaved();
  };

  const filteredNotes = useMemo(() => {
    const filtered = notes.filter((note) => {
      const matchesSearch = !searchTerm ||
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = !selectedCategory || note.category === selectedCategory;
      const matchesFavorite = !showFavorites || note.isFavorite;
      return matchesSearch && matchesCategory && matchesFavorite;
    });

    return filtered.sort((a, b) => {
      if (a.isPinned !== b.isPinned) {
        return b.isPinned ? 1 : -1;
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'category') {
        const aCategory = categories.find((category) => category.id === a.category)?.name || '';
        const bCategory = categories.find((category) => category.id === b.category)?.name || '';
        return aCategory.localeCompare(bCategory);
      }
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }, [categories, notes, searchTerm, selectedCategory, showFavorites, sortBy]);

  const togglePin = (id: string) => {
    setNotes((previous) => previous.map((note) => (note.id === id ? { ...note, isPinned: !note.isPinned } : note)));
    updateLastSaved();
  };

  const addCategory = () => {
    if (!newCategoryName.trim()) return;
    const newCategory: Category = { id: createId(), name: newCategoryName, color: newCategoryColor };
    setCategories((previous) => [...previous, newCategory]);
    setNewCategoryName('');
    setNewCategoryColor('#007bff');
    updateLastSaved();
  };

  const deleteCategory = (id: string) => {
    setCategories((previous) => previous.filter((category) => category.id !== id));
    setNotes((previous) => previous.map((note) => (note.category === id ? { ...note, category: '' } : note)));
    updateLastSaved();
  };

  const deleteSelectedNotes = () => {
    if (selectedNotes.length === 0) return;
    if (confirm(`Delete ${selectedNotes.length} selected note(s)?`)) {
      setNotes((previous) => previous.filter((note) => !selectedNotes.includes(note.id)));
      setSelectedNotes([]);
      updateLastSaved();
    }
  };

  const toggleNoteSelection = (id: string) => {
    setSelectedNotes((previous) => (previous.includes(id) ? previous.filter((item) => item !== id) : [...previous, id]));
  };

  const exportNotes = () => {
    const data = { notes, categories, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'notes-backup.json';
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const importNotes = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      try {
        const data = JSON.parse(loadEvent.target?.result as string) as StoredState;
        if (data.notes && Array.isArray(data.notes)) setNotes(data.notes);
        if (data.categories && Array.isArray(data.categories)) setCategories(data.categories);
        updateLastSaved();
      } catch {
        alert('Invalid file format');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const addTag = (noteId: string, tag: string) => {
    if (!tag.trim()) return;
    setNotes((previous) => previous.map((note) => (note.id === noteId ? { ...note, tags: [...new Set([...note.tags, tag.trim()])] } : note)));
    updateLastSaved();
  };

  const removeTag = (noteId: string, tagToRemove: string) => {
    setNotes((previous) => previous.map((note) => (note.id === noteId ? { ...note, tags: note.tags.filter((tag) => tag !== tagToRemove) } : note)));
    updateLastSaved();
  };

  const stats = {
    total: notes.length,
    favorites: notes.filter((note) => note.isFavorite).length,
    pinned: notes.filter((note) => note.isPinned).length,
    categories: new Set(notes.map((note) => note.category)).size,
  };

  return (
    <div className={styles.container}>
      <div className={styles.tool}>
        <div className={styles.header}>
          <h1 className={styles.title}>Notes Organizer</h1>
          <p className={styles.subtitle}>Keep study notes structured with categories, tags, pinning, favorites, and backups.</p>
          <div className={styles.proInfo}>
            <strong>Auto-save:</strong> Every change is saved on this device.
            {lastSaved && <> <strong>Last saved:</strong> {lastSaved}</>}
            <br />
            <strong>Note:</strong> Data stays in this browser only, so export a backup if you plan to switch devices or clear storage.
          </div>
        </div>

        <div className={styles.stats}>
          <div className={styles.stat}><span className={styles.statValue}>{stats.total}</span><span className={styles.statLabel}>Total Notes</span></div>
          <div className={styles.stat}><span className={styles.statValue}>{stats.favorites}</span><span className={styles.statLabel}>Favorites</span></div>
          <div className={styles.stat}><span className={styles.statValue}>{stats.pinned}</span><span className={styles.statLabel}>Pinned</span></div>
          <div className={styles.stat}><span className={styles.statValue}>{stats.categories}</span><span className={styles.statLabel}>Categories</span></div>
          <div className={styles.stat}><span className={styles.statValue}>{filteredNotes.length}</span><span className={styles.statLabel}>Filtered</span></div>
        </div>

        <div className={styles.controls}>
          <div className={styles.filters}>
            <input type="text" placeholder="Search notes..." value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} className={styles.searchInput} />

            <select value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value)} className={styles.select}>
              <option value="">All Categories</option>
              {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
            </select>

            <select value={sortBy} onChange={(event) => setSortBy(event.target.value as 'date' | 'title' | 'category')} className={styles.select}>
              <option value="date">Sort by Date</option>
              <option value="title">Sort by Title</option>
              <option value="category">Sort by Category</option>
            </select>
          </div>

          <div className={styles.viewControls}>
            <button onClick={() => setViewMode('list')} className={`${styles.viewBtn} ${viewMode === 'list' ? styles.active : ''}`}>List</button>
            <button onClick={() => setViewMode('grid')} className={`${styles.viewBtn} ${viewMode === 'grid' ? styles.active : ''}`}>Grid</button>
            <button onClick={() => setShowFavorites((value) => !value)} className={`${styles.favoriteBtn} ${showFavorites ? styles.active : ''}`}>{showFavorites ? 'Show All' : 'Favorites'}</button>
          </div>

          <div className={styles.actions}>
            <button onClick={createNewNote} className={styles.newBtn}>New Note</button>
            {selectedNotes.length > 0 && <button onClick={deleteSelectedNotes} className={styles.deleteSelectedBtn}>Delete {selectedNotes.length}</button>}
            <button onClick={exportNotes} className={styles.exportBtn}>Export All</button>
            <label className={styles.importBtn}>Import<input type="file" accept=".json" onChange={importNotes} style={{ display: 'none' }} /></label>
          </div>

          <div className={styles.categoryManager}>
            <div className={styles.categoryHeader}>
              <h4>Manage Categories</h4>
              <button className={styles.expandBtn} onClick={() => setShowCategoryForm((value) => !value)}>{showCategoryForm ? '−' : '+'}</button>
            </div>
            {showCategoryForm && (
              <div className={styles.categoryForm}>
                <input type="text" placeholder="Category name" value={newCategoryName} onChange={(event) => setNewCategoryName(event.target.value)} className={styles.categoryInput} />
                <input type="color" value={newCategoryColor} onChange={(event) => setNewCategoryColor(event.target.value)} className={styles.colorPicker} />
                <button onClick={addCategory} className={styles.addCategoryBtn}>Add</button>
              </div>
            )}
            <div className={styles.categoryList}>
              {categories.map((category) => (
                <div key={category.id} className={styles.categoryItem}>
                  <span className={styles.categoryDot} style={{ backgroundColor: category.color }} />
                  <span className={styles.categoryName}>{category.name}</span>
                  {!defaultCategories.some((defaultCategory) => defaultCategory.id === category.id) && <button onClick={() => deleteCategory(category.id)} className={styles.deleteCategoryBtn}>×</button>}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.mainContent}>
          <div className={`${styles.notesList} ${viewMode === 'grid' ? styles.gridView : styles.listView}`}>
            {filteredNotes.length === 0 ? (
              <div className={styles.emptyState}><p>No notes found. Create your first note to get started.</p></div>
            ) : (
              filteredNotes.map((note) => (
                <div key={note.id} className={`${styles.noteCard} ${currentNote?.id === note.id ? styles.active : ''}`} onClick={() => { setCurrentNote(note); setIsEditing(false); }}>
                  <div className={styles.noteCheckbox}>
                    <input type="checkbox" checked={selectedNotes.includes(note.id)} onChange={() => toggleNoteSelection(note.id)} onClick={(event) => event.stopPropagation()} className={styles.checkbox} />
                  </div>
                  <div className={styles.noteHeader}>
                    <div><h3 className={styles.noteTitle}>{note.isPinned ? 'Pinned: ' : ''}{note.title || 'Untitled'}</h3></div>
                    <div className={styles.noteActions}>
                      <button onClick={(event) => { event.stopPropagation(); togglePin(note.id); }} className={`${styles.pinIcon} ${note.isPinned ? styles.pinned : ''}`}>Pin</button>
                      <button onClick={(event) => { event.stopPropagation(); toggleFavorite(note.id); }} className={`${styles.favoriteIcon} ${note.isFavorite ? styles.favorited : ''}`}>Fav</button>
                      <button onClick={(event) => { event.stopPropagation(); duplicateNote(note); }} className={styles.duplicateBtn}>Copy</button>
                      <button onClick={(event) => { event.stopPropagation(); if (confirm('Are you sure you want to delete this note?')) { deleteNote(note.id); } }} className={styles.deleteBtn}>Delete</button>
                    </div>
                  </div>

                  <div className={styles.notePreview}>{note.content.substring(0, 150)}{note.content.length > 150 && '...'}</div>

                  <div className={styles.noteMeta}>
                    {note.category && (
                      <span className={styles.categoryTag} style={{ backgroundColor: categories.find((category) => category.id === note.category)?.color || '#6c757d' }}>
                        {categories.find((category) => category.id === note.category)?.name}
                      </span>
                    )}

                    <div className={styles.tags}>
                      {note.tags.slice(0, 3).map((tag) => <span key={tag} className={styles.tag}>#{tag}</span>)}
                      {note.tags.length > 3 && <span className={styles.moreTags}>+{note.tags.length - 3} more</span>}
                    </div>

                    <span className={styles.date}>{new Date(note.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className={styles.noteEditor}>
            {currentNote ? (
              <div className={styles.editorContent}>
                <div className={styles.editorHeader}>
                  <input type="text" value={currentNote.title} onChange={(event) => setCurrentNote((previous) => (previous ? { ...previous, title: event.target.value } : null))} className={styles.titleInput} placeholder="Note title..." />
                  <div className={styles.editorActions}>
                    <button onClick={() => setIsEditing((value) => !value)} className={styles.editBtn}>{isEditing ? 'Preview' : 'Edit'}</button>
                    <button onClick={() => saveNote(currentNote)} className={styles.saveBtn}>Save</button>
                  </div>
                </div>

                <div className={styles.noteMetadata}>
                  <select value={currentNote.category} onChange={(event) => setCurrentNote((previous) => (previous ? { ...previous, category: event.target.value } : null))} className={styles.categorySelect}>
                    <option value="">Select Category</option>
                    {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                  </select>

                  <div className={styles.tagsEditor}>
                    <input type="text" placeholder="Add tag..." onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        addTag(currentNote.id, (event.target as HTMLInputElement).value);
                        (event.target as HTMLInputElement).value = '';
                      }
                    }} className={styles.tagInput} />
                    <div className={styles.currentTags}>
                      {currentNote.tags.map((tag) => (
                        <span key={tag} className={styles.currentTag}>#{tag}<button onClick={() => removeTag(currentNote.id, tag)} className={styles.removeTagBtn}>×</button></span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className={styles.contentEditor}>
                  {isEditing ? (
                    <textarea value={currentNote.content} onChange={(event) => setCurrentNote((previous) => (previous ? { ...previous, content: event.target.value } : null))} className={styles.contentTextarea} placeholder="Start writing your note..." />
                  ) : (
                    <div className={styles.contentPreview}>{currentNote.content || 'No content yet. Click Edit to start writing.'}</div>
                  )}
                </div>
              </div>
            ) : (
              <div className={styles.noNoteSelected}><p>Select a note from the list to view and edit it.</p></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
