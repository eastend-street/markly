'use client';

import { useState } from 'react';
import { Collection, CreateCollectionInput, UpdateCollectionInput } from '@/types';

const COLLECTION_COLORS = [
  '#3B82F6', // Blue
  '#EF4444', // Red
  '#10B981', // Green
  '#F59E0B', // Yellow
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#F97316', // Orange
  '#06B6D4', // Cyan
  '#84CC16', // Lime
  '#6366F1', // Indigo
  '#14B8A6', // Teal
  '#F43F5E', // Rose
];

interface CollectionFormProps {
  collection?: Collection;
  onSubmit: (data: CreateCollectionInput | UpdateCollectionInput) => Promise<void>;
  onCancel: () => void;
}

export default function CollectionForm({ collection, onSubmit, onCancel }: CollectionFormProps) {
  const [formData, setFormData] = useState({
    name: collection?.name || '',
    description: collection?.description || '',
    color: collection?.color || COLLECTION_COLORS[0],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    // Basic validation
    const newErrors: {[key: string]: string} = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Collection name is required';
    }
    if (formData.name.trim().length < 2) {
      newErrors.name = 'Collection name must be at least 2 characters long';
    }
    if (formData.name.trim().length > 50) {
      newErrors.name = 'Collection name must be less than 50 characters';
    }
    if (formData.description && formData.description.length > 200) {
      newErrors.description = 'Description must be less than 200 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      const submitData = {
        name: formData.name.trim(),
        description: formData.description?.trim() || undefined,
        color: formData.color,
      };

      await onSubmit(submitData);
    } catch (error) {
      console.error('Error submitting collection form:', error);
      setErrors({ submit: 'Failed to save collection. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleColorSelect = (color: string) => {
    setFormData(prev => ({
      ...prev,
      color
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4 text-center sm:text-left">
        {collection ? 'Edit Collection' : 'Create New Collection'}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Collection Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter collection name"
            className={`w-full px-3 py-3 sm:py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base sm:text-sm ${
              errors.name ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
            }`}
            maxLength={50}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description (Optional)
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe this collection"
            rows={3}
            className={`w-full px-3 py-3 sm:py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base sm:text-sm ${
              errors.description ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
            }`}
            maxLength={200}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            {formData.description.length}/200 characters
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Collection Color
          </label>
          <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-2 sm:gap-3">
            {COLLECTION_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => handleColorSelect(color)}
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  formData.color === color 
                    ? 'border-gray-800 shadow-lg scale-110' 
                    : 'border-gray-300 hover:border-gray-400 hover:scale-105'
                }`}
                style={{ backgroundColor: color }}
                aria-label={`Select color ${color}`}
              />
            ))}
          </div>
          <div className="mt-3 flex items-center space-x-2">
            <div 
              className="w-6 h-6 rounded-full border border-gray-300"
              style={{ backgroundColor: formData.color }}
            />
            <span className="text-sm text-gray-600">Selected: {formData.color}</span>
          </div>
        </div>

        {errors.submit && (
          <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-md p-3">
            {errors.submit}
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-3 sm:py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 touch-target"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading || !formData.name.trim()}
            className="px-4 py-3 sm:py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed touch-target"
          >
            {isLoading ? 'Saving...' : collection ? 'Update Collection' : 'Create Collection'}
          </button>
        </div>
      </form>
    </div>
  );
}