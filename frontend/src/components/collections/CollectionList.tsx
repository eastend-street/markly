'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { 
  GET_COLLECTIONS_QUERY, 
  CREATE_COLLECTION_MUTATION, 
  UPDATE_COLLECTION_MUTATION,
  DELETE_COLLECTION_MUTATION 
} from '@/lib/graphql/queries';
import { Collection, CreateCollectionInput, UpdateCollectionInput } from '@/types';
import CollectionCard from './CollectionCard';
import CollectionForm from './CollectionForm';

interface CollectionListProps {
  onSelectCollection: (collection: Collection) => void;
}

export default function CollectionList({ onSelectCollection }: CollectionListProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);

  const { data, loading, error, refetch } = useQuery(GET_COLLECTIONS_QUERY, {
    errorPolicy: 'all',
  });

  const [createCollection] = useMutation(CREATE_COLLECTION_MUTATION, {
    onCompleted: () => {
      setShowForm(false);
      refetch();
    },
    onError: (error) => {
      console.error('Error creating collection:', error);
      alert('Failed to create collection. Please try again.');
    }
  });

  const [updateCollection] = useMutation(UPDATE_COLLECTION_MUTATION, {
    onCompleted: () => {
      setEditingCollection(null);
      refetch();
    },
    onError: (error) => {
      console.error('Error updating collection:', error);
      alert('Failed to update collection. Please try again.');
    }
  });

  const [deleteCollection] = useMutation(DELETE_COLLECTION_MUTATION, {
    onCompleted: () => {
      refetch();
    },
    onError: (error) => {
      console.error('Error deleting collection:', error);
      alert('Failed to delete collection. Please try again.');
    }
  });

  const handleCreateCollection = async (input: CreateCollectionInput | UpdateCollectionInput) => {
    await createCollection({ variables: { input: input as CreateCollectionInput } });
  };

  const handleUpdateCollection = async (input: CreateCollectionInput | UpdateCollectionInput) => {
    if (editingCollection) {
      await updateCollection({ 
        variables: { 
          id: editingCollection.id, 
          input: input as UpdateCollectionInput
        } 
      });
    }
  };

  const handleDeleteCollection = async (id: string) => {
    await deleteCollection({ variables: { id } });
  };

  const handleEditCollection = (collection: Collection) => {
    setEditingCollection(collection);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingCollection(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load collections</h3>
        <p className="text-gray-600 mb-4">There was an error loading your collections.</p>
        <button
          onClick={() => refetch()}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  const collections = data?.collections || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Your Collections</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          New Collection
        </button>
      </div>

      {(showForm || editingCollection) && (
        <CollectionForm
          collection={editingCollection || undefined}
          onSubmit={editingCollection ? handleUpdateCollection : handleCreateCollection}
          onCancel={handleCancelForm}
        />
      )}

      {collections.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No collections yet</h3>
          <p className="text-gray-600 mb-4">Create your first collection to start organizing your bookmarks.</p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Create Your First Collection
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((collection: Collection) => (
            <CollectionCard
              key={collection.id}
              collection={collection}
              onEdit={handleEditCollection}
              onDelete={handleDeleteCollection}
              onSelect={onSelectCollection}
            />
          ))}
        </div>
      )}
    </div>
  );
}