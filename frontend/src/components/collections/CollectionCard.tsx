'use client';

import { useState } from 'react';
import { Collection } from '@/types';

interface CollectionCardProps {
  collection: Collection;
  onEdit: (collection: Collection) => void;
  onDelete: (id: string) => void;
  onSelect: (collection: Collection) => void;
}

export default function CollectionCard({ collection, onEdit, onDelete, onSelect }: CollectionCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${collection.name}"? This will also delete all bookmarks in this collection.`)) {
      onDelete(collection.id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200">
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
              className="p-1 text-gray-400 hover:text-gray-600 focus:outline-none"
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
    </div>
  );
}