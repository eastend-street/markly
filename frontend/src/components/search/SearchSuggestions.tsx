'use client';

import { useState, useRef, useEffect } from 'react';

interface SearchHistoryItem {
  term: string;
  timestamp: number;
}

interface SearchSuggestionsProps {
  searchTerm: string;
  history: SearchHistoryItem[];
  onSelectSuggestion: (term: string) => void;
  onRemoveFromHistory: (term: string) => void;
  showSuggestions: boolean;
  onCloseSuggestions: () => void;
}

export default function SearchSuggestions({
  searchTerm,
  history,
  onSelectSuggestion,
  onRemoveFromHistory,
  showSuggestions,
  onCloseSuggestions
}: SearchSuggestionsProps) {
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        onCloseSuggestions();
      }
    };

    if (showSuggestions) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSuggestions, onCloseSuggestions]);

  // Filter history based on current search term
  const filteredHistory = history.filter(item => 
    item.term.toLowerCase().includes(searchTerm.toLowerCase()) && 
    item.term !== searchTerm
  );

  if (!showSuggestions || (filteredHistory.length === 0 && searchTerm.trim())) {
    return null;
  }

  return (
    <div 
      ref={suggestionsRef}
      className="absolute top-full left-0 right-0 bg-white border border-gray-300 border-t-0 rounded-b-md shadow-lg z-10 max-h-60 overflow-y-auto"
    >
      {!searchTerm.trim() && history.length > 0 && (
        <div className="px-3 py-2 text-xs text-gray-500 border-b border-gray-100">
          Recent searches
        </div>
      )}
      
      {filteredHistory.length > 0 ? (
        <div>
          {filteredHistory.slice(0, 5).map((item) => (
            <div
              key={item.term}
              className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 cursor-pointer group"
            >
              <button
                onClick={() => onSelectSuggestion(item.term)}
                className="flex items-center flex-1 text-left focus:outline-none"
              >
                <svg className="w-4 h-4 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm text-gray-700">{item.term}</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveFromHistory(item.term);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 focus:outline-none touch-target"
                aria-label="Remove from history"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      ) : searchTerm.trim() && (
        <div className="px-3 py-4 text-center text-sm text-gray-500">
          No matching search history
        </div>
      )}
      
      {!searchTerm.trim() && history.length === 0 && (
        <div className="px-3 py-4 text-center text-sm text-gray-500">
          No search history yet
        </div>
      )}
    </div>
  );
}