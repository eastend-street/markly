'use client';

import { useState } from 'react';
import { Collection } from '@/types';

interface SearchFiltersProps {
  collections: Collection[];
  selectedCollection: string;
  onCollectionChange: (collectionId: string) => void;
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
}

const POPULAR_TAGS = [
  'development', 'design', 'tutorial', 'article', 'tool', 'reference',
  'documentation', 'javascript', 'react', 'css', 'html', 'python',
  'github', 'api', 'library', 'framework', 'blog', 'news'
];

export default function SearchFilters({
  collections,
  selectedCollection,
  onCollectionChange,
  selectedTags,
  onTagsChange
}: SearchFiltersProps) {
  const [customTag, setCustomTag] = useState('');
  const [showAllTags, setShowAllTags] = useState(false);

  const handleAddCustomTag = () => {
    const tag = customTag.trim().toLowerCase();
    if (tag && !selectedTags.includes(tag)) {
      onTagsChange([...selectedTags, tag]);
    }
    setCustomTag('');
  };

  const handleCustomTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCustomTag();
    }
  };

  const handleToggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter(t => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  const handleRemoveTag = (tag: string) => {
    onTagsChange(selectedTags.filter(t => t !== tag));
  };

  const displayTags = showAllTags ? POPULAR_TAGS : POPULAR_TAGS.slice(0, 8);

  return (
    <div className="space-y-4">
      {/* Collection Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Filter by Collection
        </label>
        <select
          value={selectedCollection}
          onChange={(e) => onCollectionChange(e.target.value)}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          <option value="">All collections</option>
          {collections.map((collection) => (
            <option key={collection.id} value={collection.id}>
              {collection.name}
            </option>
          ))}
        </select>
      </div>

      {/* Tags Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Filter by Tags
        </label>
        
        {/* Selected Tags */}
        {selectedTags.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-2">
              {selectedTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2.5 py-1.5 rounded-md text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none focus:bg-blue-500 focus:text-white"
                  >
                    <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                      <path strokeLinecap="round" strokeWidth="1.5" d="m1 1 6 6m0-6-6 6" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Custom Tag Input */}
        <div className="mb-3">
          <div className="flex rounded-md shadow-sm">
            <input
              type="text"
              value={customTag}
              onChange={(e) => setCustomTag(e.target.value)}
              onKeyPress={handleCustomTagKeyPress}
              placeholder="Add custom tag..."
              className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            <button
              type="button"
              onClick={handleAddCustomTag}
              disabled={!customTag.trim()}
              className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              Add
            </button>
          </div>
        </div>

        {/* Popular Tags */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Popular Tags
            </span>
            <button
              type="button"
              onClick={() => setShowAllTags(!showAllTags)}
              className="text-xs text-blue-600 hover:text-blue-500 focus:outline-none"
            >
              {showAllTags ? 'Show less' : 'Show all'}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {displayTags.map((tag) => {
              const isSelected = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleToggleTag(tag)}
                  className={`inline-flex items-center px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    isSelected
                      ? 'bg-blue-100 text-blue-800 ring-1 ring-blue-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tag}
                  {isSelected && (
                    <svg className="ml-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}