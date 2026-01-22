'use client';

import { useState, useEffect } from 'react';
import styles from './checklist.module.css';

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  category?: string;
}

interface Category {
  id: string;
  name: string;
  color: string;
}

const defaultCategories: Category[] = [
  { id: '1', name: 'Study', color: '#007bff' },
  { id: '2', name: 'Assignment', color: '#28a745' },
  { id: '3', name: 'Exam', color: '#dc3545' },
  { id: '4', name: 'Project', color: '#ffc107' },
  { id: '5', name: 'Personal', color: '#6c757d' },
];

export default function ChecklistTool() {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [newItem, setNewItem] = useState('');
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newCategory, setNewCategory] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'priority' | 'category'>('date');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('checklist-items');
    const savedCategories = localStorage.getItem('checklist-categories');
    if (saved) {
      setItems(JSON.parse(saved));
    }
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('checklist-items', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('checklist-categories', JSON.stringify(categories));
  }, [categories]);

  const addItem = () => {
    if (!newItem.trim()) return;

    const item: ChecklistItem = {
      id: Date.now().toString(),
      text: newItem.trim(),
      completed: false,
      priority: newPriority,
      category: newCategory || undefined,
      dueDate: newDueDate || undefined,
    };

    setItems(prev => [...prev, item]);
    setNewItem('');
    setNewDueDate('');
  };

  const toggleItem = (id: string) => {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const deleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const editItem = (id: string, newText: string) => {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, text: newText } : item
    ));
  };

  const clearCompleted = () => {
    setItems(prev => prev.filter(item => !item.completed));
  };

  const getFilteredItems = () => {
    let filtered = items;

    // Filter by completion status
    if (filter === 'pending') {
      filtered = filtered.filter(item => !item.completed);
    } else if (filter === 'completed') {
      filtered = filtered.filter(item => item.completed);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort items
    filtered.sort((a, b) => {
      if (sortBy === 'priority') {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      } else if (sortBy === 'category') {
        return (a.category || '').localeCompare(b.category || '');
      } else {
        // Sort by due date, then by creation date
        const aDate = a.dueDate ? new Date(a.dueDate) : new Date(parseInt(a.id));
        const bDate = b.dueDate ? new Date(b.dueDate) : new Date(parseInt(b.id));
        return aDate.getTime() - bDate.getTime();
      }
    });

    return filtered;
  };

  const getStats = () => {
    const total = items.length;
    const completed = items.filter(item => item.completed).length;
    const pending = total - completed;
    const overdue = items.filter(item =>
      !item.completed && item.dueDate && new Date(item.dueDate) < new Date()
    ).length;

    return { total, completed, pending, overdue };
  };

  const exportToJSON = () => {
    const data = {
      items,
      categories,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'checklist-backup.json';
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
        if (data.items && Array.isArray(data.items)) {
          setItems(data.items);
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

  const stats = getStats();
  const filteredItems = getFilteredItems();

  return (
    <div className={styles.container}>
      <div className={styles.tool}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            📋 Task Checklist
          </h1>
          <p className={styles.subtitle}>
            Organize your tasks with priorities, categories, and due dates
          </p>
        </div>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statValue}>{stats.total}</span>
            <span className={styles.statLabel}>Total Tasks</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>{stats.pending}</span>
            <span className={styles.statLabel}>Pending</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>{stats.completed}</span>
            <span className={styles.statLabel}>Completed</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>{stats.overdue}</span>
            <span className={styles.statLabel}>Overdue</span>
          </div>
        </div>

        <div className={styles.controls}>
          <div className={styles.filters}>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className={styles.select}
            >
              <option value="all">All Tasks</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className={styles.select}
            >
              <option value="date">Sort by Date</option>
              <option value="priority">Sort by Priority</option>
              <option value="category">Sort by Category</option>
            </select>

            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.actions}>
            <button onClick={clearCompleted} className={styles.clearBtn}>
              Clear Completed
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

        <div className={styles.addForm}>
          <input
            type="text"
            placeholder="Enter a new task..."
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addItem()}
            className={styles.taskInput}
          />

          <div className={styles.formRow}>
            <select
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value as any)}
              className={styles.prioritySelect}
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>

            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className={styles.categorySelect}
            >
              <option value="">No Category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>

            <input
              type="date"
              value={newDueDate}
              onChange={(e) => setNewDueDate(e.target.value)}
              className={styles.dateInput}
            />

            <button onClick={addItem} className={styles.addBtn}>
              Add Task
            </button>
          </div>
        </div>

        <div className={styles.taskList}>
          {filteredItems.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No tasks found. Add your first task above!</p>
            </div>
          ) : (
            filteredItems.map(item => {
              const category = categories.find(cat => cat.id === item.category);
              const isOverdue = !item.completed && item.dueDate && new Date(item.dueDate) < new Date();

              return (
                <div
                  key={item.id}
                  className={`${styles.taskItem} ${item.completed ? styles.completed : ''} ${isOverdue ? styles.overdue : ''}`}
                >
                  <div className={styles.taskContent}>
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => toggleItem(item.id)}
                      className={styles.checkbox}
                    />

                    <input
                      type="text"
                      value={item.text}
                      onChange={(e) => editItem(item.id, e.target.value)}
                      className={styles.taskText}
                      disabled={item.completed}
                    />

                    <div className={styles.taskMeta}>
                      <span className={`${styles.priority} ${styles[item.priority]}`}>
                        {item.priority}
                      </span>

                      {category && (
                        <span
                          className={styles.categoryTag}
                          style={{ backgroundColor: category.color }}
                        >
                          {category.name}
                        </span>
                      )}

                      {item.dueDate && (
                        <span className={`${styles.dueDate} ${isOverdue ? styles.overdueDate : ''}`}>
                          📅 {new Date(item.dueDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => deleteItem(item.id)}
                    className={styles.deleteBtn}
                  >
                    🗑️
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}