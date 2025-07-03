'use client';

import { useState, useEffect } from 'react';
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
  onSelectBookmark?: (bookmark: Bookmark) => void;
}

export default function BookmarkList({ 
  initialBookmarks = [], 
  collections, 
  filter,
  showAddButton = true,
  onSelectBookmark 
}: BookmarkListProps) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks);
  const [showForm, setShowForm] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBookmarks = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getBookmarks(filter);
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
  };

  useEffect(() => {
    if (initialBookmarks.length === 0) {
      fetchBookmarks();
    }
  }, [filter, initialBookmarks.length, fetchBookmarks]);

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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          {filter?.collectionId ? 'Collection Bookmarks' : 'Your Bookmarks'}
        </h2>
        {showAddButton && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add Bookmark
          </button>
        )}
      </div>

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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