import { useState, useEffect } from 'react';

interface SearchHistoryItem {
  term: string;
  timestamp: number;
}

const MAX_HISTORY_ITEMS = 10;
const STORAGE_KEY = 'markly_search_history';

export function useSearchHistory() {
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setHistory(parsed);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const addToHistory = (term: string) => {
    if (!term.trim()) return;

    const newItem: SearchHistoryItem = {
      term: term.trim(),
      timestamp: Date.now()
    };

    setHistory(prev => {
      // Remove duplicates and add new item at the beginning
      const filtered = prev.filter(item => item.term !== newItem.term);
      const newHistory = [newItem, ...filtered].slice(0, MAX_HISTORY_ITEMS);
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
      return newHistory;
    });
  };

  const removeFromHistory = (term: string) => {
    setHistory(prev => {
      const newHistory = prev.filter(item => item.term !== term);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
      return newHistory;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    history,
    addToHistory,
    removeFromHistory,
    clearHistory
  };
}