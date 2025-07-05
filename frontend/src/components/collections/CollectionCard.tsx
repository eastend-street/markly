'use client';

import { useState } from 'react';
import { Collection } from '@/types';
import { useSwipe } from '@/hooks/useSwipe';

interface CollectionCardProps {
  collection: Collection;
  onEdit: (collection: Collection) => void;
  onDelete: (id: string) => void;
  onSelect: (collection: Collection) => void;
}

export default function CollectionCard({ collection, onEdit, onDelete, onSelect }: CollectionCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showSwipeActions, setShowSwipeActions] = useState(false);

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${collection.name}"? This will also delete all bookmarks in this collection.`)) {
      onDelete(collection.id);
    }
  };

  const swipeRef = useSwipe({
    onSwipeLeft: () => {
      setShowSwipeActions(true);
      setTimeout(() => setShowSwipeActions(false), 3000); // Auto-hide after 3 seconds
    },
    onSwipeRight: () => {
      setShowSwipeActions(false);
    }
  });

  return (
    <div 
      ref={swipeRef}
      className="bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200 relative overflow-hidden"
    >
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div 
            className="flex-1 cursor-pointer"
            onClick={() => onSelect(collection)}
          >
            <div className="flex items-center mb-2">
              <div 
                className="w-4 h-4 rounded-full mr-2"
                style={{ backgroundColor: collection.color || '#3B82F6' }}
              />
              <h3 className="text-lg font-medium text-gray-900 hover:text-blue-600">
                {collection.name}
              </h3>
            </div>
            {collection.description && (
              <p className="text-sm text-gray-600 mb-3">
                {collection.description}
              </p>
            )}
            <p className="text-xs text-gray-500">
              Created {new Date(collection.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none touch-target"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
                <div className="py-1">
                  <button
                    onClick={() => {
                      onEdit(collection);
                      setShowMenu(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Edit Collection
                  </button>
                  <button
                    onClick={() => {
                      handleDelete();
                      setShowMenu(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Delete Collection
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Swipe Actions Overlay */}
      {showSwipeActions && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center space-x-4 md:hidden">
          <button
            onClick={() => {
              onEdit(collection);
              setShowSwipeActions(false);
            }}
            className="bg-green-600 text-white p-3 rounded-full shadow-lg touch-target"
            aria-label="Edit collection"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => {
              onSelect(collection);
              setShowSwipeActions(false);
            }}
            className="bg-blue-600 text-white p-3 rounded-full shadow-lg touch-target"
            aria-label="View collection"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
          <button
            onClick={() => {
              handleDelete();
              setShowSwipeActions(false);
            }}
            className="bg-red-600 text-white p-3 rounded-full shadow-lg touch-target"
            aria-label="Delete collection"
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