'use client';

import { useState } from 'react';
import { Collection, CreateCollectionInput, UpdateCollectionInput } from '@/types';

interface CollectionFormProps {
  collection?: Collection;
  onSubmit: (data: CreateCollectionInput | UpdateCollectionInput) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const colorOptions = [
  { value: '#3B82F6', label: 'Blue', class: 'bg-blue-500' },
  { value: '#EF4444', label: 'Red', class: 'bg-red-500' },
  { value: '#10B981', label: 'Green', class: 'bg-green-500' },
  { value: '#F59E0B', label: 'Orange', class: 'bg-orange-500' },
  { value: '#8B5CF6', label: 'Purple', class: 'bg-purple-500' },
  { value: '#EC4899', label: 'Pink', class: 'bg-pink-500' },
  { value: '#6B7280', label: 'Gray', class: 'bg-gray-500' },
];

export default function CollectionForm({ collection, onSubmit, onCancel, isLoading }: CollectionFormProps) {
  const [formData, setFormData] = useState({
    name: collection?.name || '',
    description: collection?.description || '',
    color: collection?.color || colorOptions[0].value,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData: CreateCollectionInput | UpdateCollectionInput = {
      name: formData.name,
      description: formData.description || undefined,
      color: formData.color,
    };

    onSubmit(submitData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleColorChange = (color: string) => {
    setFormData(prev => ({
      ...prev,
      color
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        {collection ? 'Edit Collection' : 'Create New Collection'}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
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
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter collection name"
          />
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
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Color
          </label>
          <div className="flex flex-wrap gap-3">
            {colorOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleColorChange(option.value)}
                className={`w-8 h-8 rounded-full ${option.class} ${
                  formData.color === option.value
                    ? 'ring-2 ring-offset-2 ring-blue-500'
                    : 'hover:ring-2 hover:ring-offset-2 hover:ring-gray-300'
                }`}
                title={option.label}
              />
            ))}
          </div>
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
            disabled={isLoading || !formData.name.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Saving...' : collection ? 'Update Collection' : 'Create Collection'}
          </button>
        </div>
      </form>
    </div>
  );
}