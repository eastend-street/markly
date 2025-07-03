'use client';

import { useState } from 'react';
import { Bookmark, CreateBookmarkInput, UpdateBookmarkInput, Collection } from '@/types';
import { createBookmark, updateBookmark, extractUrlMetadata } from '@/lib/actions/bookmarks';

// Fragment for this component
export const BOOKMARK_FORM_FRAGMENT = `
  fragment BookmarkForm on Bookmark {
    id
    title
    url
    description
    notes
    tags
    collectionId
  }
`;

interface BookmarkFormProps {
  bookmark?: Bookmark;
  collections: Collection[];
  onSuccess: () => void;
  onCancel: () => void;
}

export default function BookmarkForm({ bookmark, collections, onSuccess, onCancel }: BookmarkFormProps) {
  const [formData, setFormData] = useState({
    title: bookmark?.title || '',
    url: bookmark?.url || '',
    description: bookmark?.description || '',
    notes: bookmark?.notes || '',
    tags: bookmark?.tags?.join(', ') || '',
    collectionId: bookmark?.collectionId || (collections[0]?.id || ''),
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isExtractingMetadata, setIsExtractingMetadata] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const submitData: CreateBookmarkInput | UpdateBookmarkInput = {
        title: formData.title,
        url: formData.url,
        description: formData.description || undefined,
        notes: formData.notes || undefined,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
        collectionId: formData.collectionId,
      };

      let result;
      if (bookmark) {
        result = await updateBookmark(bookmark.id, submitData as UpdateBookmarkInput);
      } else {
        result = await createBookmark(submitData as CreateBookmarkInput);
      }

      if (result.success) {
        onSuccess();
      } else {
        alert('Failed to save bookmark: ' + result.error);
      }
    } catch {
      alert('Failed to save bookmark');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleExtractMetadata = async () => {
    if (!formData.url) return;

    setIsExtractingMetadata(true);
    try {
      const metadata = await extractUrlMetadata(formData.url);
      setFormData(prev => ({
        ...prev,
        title: prev.title || metadata.title,
        description: prev.description || metadata.description,
      }));
    } catch {
      console.error('Failed to extract metadata');
    } finally {
      setIsExtractingMetadata(false);
    }
  };

  const handleUrlBlur = () => {
    if (formData.url && !formData.title) {
      handleExtractMetadata();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        {bookmark ? 'Edit Bookmark' : 'Add New Bookmark'}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
            URL *
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              id="url"
              name="url"
              value={formData.url}
              onChange={handleChange}
              onBlur={handleUrlBlur}
              required
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://example.com"
            />
            <button
              type="button"
              onClick={handleExtractMetadata}
              disabled={!formData.url || isExtractingMetadata}
              className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isExtractingMetadata ? 'Loading...' : 'Extract'}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Bookmark title"
          />
        </div>

        <div>
          <label htmlFor="collectionId" className="block text-sm font-medium text-gray-700 mb-1">
            Collection *
          </label>
          <select
            id="collectionId"
            name="collectionId"
            value={formData.collectionId}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {collections.map((collection) => (
              <option key={collection.id} value={collection.id}>
                {collection.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Optional description"
          />
        </div>

        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
            Tags
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Separate tags with commas"
          />
          <p className="text-xs text-gray-500 mt-1">Separate multiple tags with commas</p>
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Personal notes about this bookmark"
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading || !formData.title.trim() || !formData.url.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Saving...' : bookmark ? 'Update Bookmark' : 'Add Bookmark'}
          </button>
        </div>
      </form>
    </div>
  );
}