'use client';

import { Bookmark } from '@/types';
import { createHighlightedText } from '@/utils/searchHighlight';

interface SearchResultCardProps {
  bookmark: Bookmark;
  searchTerm: string;
  onSelect: (bookmark: Bookmark) => void;
}

export default function SearchResultCard({ bookmark, searchTerm, onSelect }: SearchResultCardProps) {
  const formatUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch {
      return url;
    }
  };

  return (
    <div 
      className="bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200 overflow-hidden cursor-pointer"
      onClick={() => onSelect(bookmark)}
    >
      {bookmark.screenshot && (
        <div className="h-32 bg-gray-100 overflow-hidden">
          <img 
            src={bookmark.screenshot} 
            alt={`Preview of ${bookmark.title}`}
            className="w-full h-full object-cover hover:scale-105 transition-transform"
            onError={(e) => {
              e.currentTarget.parentElement?.remove();
            }}
          />
        </div>
      )}
      <div className="p-4">
        <div className="flex items-start mb-2">
          <div className="w-4 h-4 mr-2 flex-shrink-0 flex items-center justify-center">
            {bookmark.favicon ? (
              <img 
                src={bookmark.favicon} 
                alt="" 
                className="w-4 h-4 object-contain"
                onError={(e) => {
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
          <h3 
            className="text-lg font-medium text-gray-900 hover:text-blue-600 line-clamp-2 flex-1"
            dangerouslySetInnerHTML={createHighlightedText(bookmark.title, searchTerm)}
          />
        </div>
        
        <p className="text-sm text-gray-500 mb-2">{formatUrl(bookmark.url)}</p>
        
        {bookmark.description && (
          <p 
            className="text-sm text-gray-600 mb-3 line-clamp-2"
            dangerouslySetInnerHTML={createHighlightedText(bookmark.description, searchTerm)}
          />
        )}

        {bookmark.notes && searchTerm && bookmark.notes.toLowerCase().includes(searchTerm.toLowerCase()) && (
          <div className="mb-3">
            <p className="text-xs text-gray-500 mb-1">Notes:</p>
            <p 
              className="text-sm text-gray-600 line-clamp-2 italic"
              dangerouslySetInnerHTML={createHighlightedText(bookmark.notes, searchTerm)}
            />
          </div>
        )}

        {bookmark.tags && bookmark.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {bookmark.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                dangerouslySetInnerHTML={createHighlightedText(tag, searchTerm)}
              />
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
    </div>
  );
}