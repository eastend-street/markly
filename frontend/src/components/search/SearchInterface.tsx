'use client';

import { useState, useEffect, useCallback } from 'react';
import { Collection, Bookmark, BookmarkFilter } from '@/types';
import { getBookmarks } from '@/lib/actions/bookmarks';
import SearchResultCard from './SearchResultCard';
import SearchFilters from './SearchFilters';

interface SearchInterfaceProps {
  collections: Collection[];
}

export default function SearchInterface({ collections }: SearchInterfaceProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCollection, setSelectedCollection] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const searchBookmarks = useCallback(async () => {
    // Don't search if no search criteria
    if (!searchTerm.trim() && !selectedCollection && selectedTags.length === 0) {
      setBookmarks([]);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const filter: BookmarkFilter = {};
      
      if (searchTerm.trim()) {
        filter.search = searchTerm.trim();
      }
      
      if (selectedCollection) {
        filter.collectionId = selectedCollection;
      }
      
      if (selectedTags.length > 0) {
        filter.tags = selectedTags;
      }

      const result = await getBookmarks(filter);
      if (result.success && result.data) {
        setBookmarks(result.data);
      } else {
        setError(result.error || 'Failed to search bookmarks');
        setBookmarks([]);
      }
    } catch {
      setError('Failed to search bookmarks');
      setBookmarks([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedCollection, selectedTags]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      searchBookmarks();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchBookmarks]);

  const handleClearSearch = () => {
    setSearchTerm('');
    setSelectedCollection('');
    setSelectedTags([]);
    setBookmarks([]);
    setHasSearched(false);
    setError(null);
  };

  const handleSelectBookmark = (bookmark: Bookmark) => {
    window.open(bookmark.url, '_blank', 'noopener,noreferrer');
  };

  const searchCriteria = [
    searchTerm.trim() && `"${searchTerm.trim()}"`,
    selectedCollection && collections.find(c => c.id === selectedCollection)?.name,
    selectedTags.length > 0 && `Tags: ${selectedTags.join(', ')}`
  ].filter(Boolean);

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Find Your Bookmarks</h2>
            <p className="text-sm text-gray-600">Search by title, description, notes, tags, or collection</p>
          </div>
        </div>

        {/* Main Search Input */}
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => handleSearchInputChange(e.target.value)}
            onFocus={handleSearchInputFocus}
            placeholder="Search bookmarks..."
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-base sm:text-sm"
          />
          <SearchSuggestions
            searchTerm={searchTerm}
            history={history}
            onSelectSuggestion={handleSelectSuggestion}
            onRemoveFromHistory={removeFromHistory}
            showSuggestions={showSuggestions}
            onCloseSuggestions={() => setShowSuggestions(false)}
          />
        </div>

        {/* Search Filters */}
        <SearchFilters
          collections={collections}
          selectedCollection={selectedCollection}
          onCollectionChange={setSelectedCollection}
          selectedTags={selectedTags}
          onTagsChange={setSelectedTags}
        />

        {/* Clear Search Button */}
        {(searchTerm || selectedCollection || selectedTags.length > 0) && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleClearSearch}
              className="text-sm text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Search Results */}
      <div className="bg-white rounded-lg shadow-sm">
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Searching...</span>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Search failed</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={searchBookmarks}
              className="bg-blue-600 text-white px-4 py-3 sm:py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 touch-target"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && hasSearched && (
          <div className="p-6">
            {/* Search Summary */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {bookmarks.length === 0 ? 'No results found' : `Found ${bookmarks.length} bookmark${bookmarks.length === 1 ? '' : 's'}`}
              </h3>
              {searchCriteria.length > 0 && (
                <p className="text-sm text-gray-600">
                  Searching for: {searchCriteria.join(' • ')}
                </p>
              )}
            </div>

            {/* Results Grid */}
            {bookmarks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {bookmarks.map((bookmark) => (
                  <SearchResultCard
                    key={bookmark.id}
                    bookmark={bookmark}
                    searchTerm={searchTerm}
                    onSelect={handleSelectBookmark}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.441-1.045-5.86-2.709M12 15a7.963 7.963 0 01-5.86-2.709M12 15V9a4.002 4.002 0 00-3.874-3.99M12 15v6m0-6h4.5m0 0a4.5 4.5 0 00-4.5-4.5V15z" />
                  </svg>
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">No matching bookmarks</h4>
                <p className="text-gray-600">
                  Try adjusting your search terms or filters to find what you&apos;re looking for.
                </p>
              </div>
            )}
          </div>
        )}

        {!hasSearched && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Start searching</h3>
            <p className="text-gray-600">
              Enter a search term, select a collection, or choose tags to find your bookmarks.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}