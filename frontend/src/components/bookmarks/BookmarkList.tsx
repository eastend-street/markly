'use client';

import { useState, useEffect, useCallback } from 'react';
import { Bookmark, Collection, BookmarkFilter } from '@/types';
import { getBookmarks } from '@/lib/actions/bookmarks';
import BookmarkCard, { BOOKMARK_CARD_FRAGMENT } from './BookmarkCard';
import BookmarkForm from './BookmarkForm';

// Fragment for this component combining its children
export const BOOKMARK_LIST_FRAGMENT = `
  fragment BookmarkList on Query {
    bookmarks(filter: $filter, limit: $limit, offset: $offset) {
      ...BookmarkCard
    }
  }
  ${BOOKMARK_CARD_FRAGMENT}
`;

interface BookmarkListProps {
  initialBookmarks?: Bookmark[];
  collections: Collection[];
  filter?: BookmarkFilter;
  showAddButton?: boolean;
  showSearch?: boolean;
  onSelectBookmark?: (bookmark: Bookmark) => void;
}

export default function BookmarkList({ 
  initialBookmarks = [], 
  collections, 
  filter,
  showAddButton = true,
  showSearch = true,
  onSelectBookmark 
}: BookmarkListProps) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks);
  const [showForm, setShowForm] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCollection, setSelectedCollection] = useState('');

  const fetchBookmarks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Combine props filter with local search filters
      const combinedFilter: BookmarkFilter = {
        ...filter,
        ...(searchTerm.trim() && { search: searchTerm.trim() }),
        ...(selectedCollection && { collectionId: selectedCollection })
      };
      
      const result = await getBookmarks(combinedFilter);
      if (result.success && result.data) {
        setBookmarks(result.data);
      } else {
        setError(result.error || 'Failed to fetch bookmarks');
      }
    } catch {
      setError('Failed to fetch bookmarks');
    } finally {
      setLoading(false);
    }
  }, [filter, searchTerm, selectedCollection]);

  useEffect(() => {
    if (initialBookmarks.length === 0) {
      const timer = setTimeout(() => {
        fetchBookmarks();
      }, 300); // Debounce search
      
      return () => clearTimeout(timer);
    }
  }, [filter, initialBookmarks.length, searchTerm, selectedCollection, fetchBookmarks]);

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingBookmark(null);
    fetchBookmarks();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingBookmark(null);
  };

  const handleEditBookmark = (bookmark: Bookmark) => {
    setEditingBookmark(bookmark);
  };

  const handleSelectBookmark = (bookmark: Bookmark) => {
    if (onSelectBookmark) {
      onSelectBookmark(bookmark);
    } else {
      // Default behavior - open bookmark URL
      window.open(bookmark.url, '_blank', 'noopener,noreferrer');
    }
  };

  if (loading && bookmarks.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load bookmarks</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={fetchBookmarks}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <h2 className="text-lg sm:text-2xl font-bold text-gray-900">
          {filter?.collectionId ? 'Collection Bookmarks' : 'Your Bookmarks'}
        </h2>
        {showAddButton && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-3 sm:py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm sm:text-base font-medium touch-target w-full sm:w-auto"
          >
            <span className="sm:hidden">+ Add New Bookmark</span>
            <span className="hidden sm:inline">Add Bookmark</span>
          </button>
        )}
      </div>

      {showSearch && (
        <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 border">
          <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-4">
            {/* Search Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search bookmarks..."
                className="block w-full pl-10 pr-3 py-3 sm:py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-base sm:text-sm"
              />
            </div>

            {/* Collection Filter */}
            <select
              value={selectedCollection}
              onChange={(e) => setSelectedCollection(e.target.value)}
              className="block w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-base sm:text-sm"
            >
              <option value="">All collections</option>
              {collections.map((collection) => (
                <option key={collection.id} value={collection.id}>
                  {collection.name}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Search */}
          {(searchTerm || selectedCollection) && (
            <div className="mt-3 flex justify-center sm:justify-end">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCollection('');
                }}
                className="text-sm text-gray-500 hover:text-gray-700 focus:outline-none px-3 py-2 touch-target"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      )}

      {(showForm || editingBookmark) && (
        <BookmarkForm
          bookmark={editingBookmark || undefined}
          collections={collections}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      )}

      {bookmarks.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No bookmarks yet</h3>
          <p className="text-gray-600 mb-4">
            {filter?.collectionId 
              ? 'This collection doesn\'t have any bookmarks yet.' 
              : 'Start building your bookmark collection.'
            }
          </p>
          {showAddButton && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Add Your First Bookmark
            </button>
          )}
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {bookmarks.map((bookmark) => (
              <BookmarkCard
                key={bookmark.id}
                bookmark={bookmark}
                onEdit={handleEditBookmark}
                onSelect={handleSelectBookmark}
              />
            ))}
          </div>
          
          {loading && (
            <div className="flex justify-center items-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Refreshing...</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}