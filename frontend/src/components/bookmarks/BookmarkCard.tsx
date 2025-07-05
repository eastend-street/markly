'use client';

import { useState } from 'react';
import { Bookmark } from '@/types';
import { deleteBookmark } from '@/lib/actions/bookmarks';
import { useSwipe } from '@/hooks/useSwipe';

// Fragment for this component
export const BOOKMARK_CARD_FRAGMENT = `
  fragment BookmarkCard on Bookmark {
    id
    title
    url
    description
    favicon
    tags
    collectionId
    collection {
      id
      name
      color
    }
    createdAt
  }
`;

interface BookmarkCardProps {
  bookmark: Bookmark;
  onEdit?: (bookmark: Bookmark) => void;
  onSelect: (bookmark: Bookmark) => void;
  showActions?: boolean;
}

export default function BookmarkCard({ bookmark, onEdit, onSelect, showActions = true }: BookmarkCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showSwipeActions, setShowSwipeActions] = useState(false);

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${bookmark.title}"?`)) {
      setIsDeleting(true);
      try {
        const result = await deleteBookmark(bookmark.id);
        if (!result.success) {
          alert('Failed to delete bookmark: ' + result.error);
        }
      } catch {
        alert('Failed to delete bookmark');
      } finally {
        setIsDeleting(false);
        setShowMenu(false);
      }
    }
  };

  const handleVisit = () => {
    window.open(bookmark.url, '_blank', 'noopener,noreferrer');
  };

  const formatUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch {
      return url;
    }
  };

  const swipeRef = useSwipe({
    onSwipeLeft: () => {
      if (showActions) {
        setShowSwipeActions(true);
        setTimeout(() => setShowSwipeActions(false), 3000); // Auto-hide after 3 seconds
      }
    },
    onSwipeRight: () => {
      setShowSwipeActions(false);
    }
  });

  return (
    <div 
      ref={swipeRef}
      className="bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200 overflow-hidden relative"
    >
      {bookmark.screenshot && (
        <div className="h-32 bg-gray-100 overflow-hidden">
          <img 
            src={bookmark.screenshot} 
            alt={`Preview of ${bookmark.title}`}
            className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
            onClick={() => onSelect(bookmark)}
            onError={(e) => {
              e.currentTarget.parentElement?.remove();
            }}
          />
        </div>
      )}
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div 
            className="flex-1 cursor-pointer"
            onClick={() => onSelect(bookmark)}
          >
            <div className="flex items-center mb-2">
              <div className="w-4 h-4 mr-2 flex-shrink-0 flex items-center justify-center">
                {bookmark.favicon ? (
                  <img 
                    src={bookmark.favicon} 
                    alt="" 
                    className="w-4 h-4 object-contain"
                    onError={(e) => {
                      // Fallback to default globe icon
                      e.currentTarget.style.display = 'none';
                      const parent = e.currentTarget.parentElement;
                      if (parent && !parent.querySelector('.fallback-icon')) {
                        const fallbackIcon = document.createElement('div');
                        fallbackIcon.className = 'fallback-icon w-4 h-4 rounded bg-gray-200 flex items-center justify-center text-gray-500 text-xs';
                        fallbackIcon.innerHTML = '🌐';
                        parent.appendChild(fallbackIcon);
                      }
                    }}
                  />
                ) : (
                  <div className="w-4 h-4 rounded bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                    🌐
                  </div>
                )}
              </div>
              <h3 className="text-lg font-medium text-gray-900 hover:text-blue-600 line-clamp-2">
                {bookmark.title}
              </h3>
            </div>
            
            <p className="text-sm text-gray-500 mb-2">{formatUrl(bookmark.url)}</p>
            
            {bookmark.description && (
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {bookmark.description}
              </p>
            )}

            {bookmark.tags && bookmark.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {bookmark.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {tag}
                  </span>
                ))}
                {bookmark.tags.length > 3 && (
                  <span className="text-xs text-gray-500">
                    +{bookmark.tags.length - 3} more
                  </span>
                )}
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center">
                {bookmark.collection && (
                  <>
                    <div 
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: bookmark.collection.color || '#3B82F6' }}
                    />
                    <span>{bookmark.collection.name}</span>
                  </>
                )}
              </div>
              <span>{new Date(bookmark.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          {showActions && (
            <div className="relative ml-4">
              <button
                onClick={() => setShowMenu(!showMenu)}
                disabled={isDeleting}
                className="p-1 text-gray-400 hover:text-gray-600 focus:outline-none disabled:opacity-50"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
                  <div className="py-1">
                    <button
                      onClick={handleVisit}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Visit Link
                    </button>
                    {onEdit && (
                      <button
                        onClick={() => {
                          onEdit(bookmark);
                          setShowMenu(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Edit Bookmark
                      </button>
                    )}
                    <button
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 disabled:opacity-50"
                    >
                      {isDeleting ? 'Deleting...' : 'Delete Bookmark'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Swipe Actions Overlay */}
      {showSwipeActions && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center space-x-4 md:hidden">
          <button
            onClick={handleVisit}
            className="bg-blue-600 text-white p-3 rounded-full shadow-lg touch-target"
            aria-label="Visit link"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </button>
          {onEdit && (
            <button
              onClick={() => {
                onEdit(bookmark);
                setShowSwipeActions(false);
              }}
              className="bg-green-600 text-white p-3 rounded-full shadow-lg touch-target"
              aria-label="Edit bookmark"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          )}
          <button
            onClick={() => {
              handleDelete();
              setShowSwipeActions(false);
            }}
            disabled={isDeleting}
            className="bg-red-600 text-white p-3 rounded-full shadow-lg touch-target disabled:opacity-50"
            aria-label="Delete bookmark"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}