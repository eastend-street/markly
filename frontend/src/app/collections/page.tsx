'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Collection } from '@/types';
import CollectionList from '@/components/collections/CollectionList';
import MobileHeader from '@/components/layout/MobileHeader';

export default function Collections() {
  const { user, logout, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  // const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  const handleSelectCollection = (collection: Collection) => {
    router.push(`/bookmarks?collection=${collection.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileHeader 
        title="Collections" 
        showBackButton={true} 
        backUrl="/dashboard" 
      />

      <main className="max-w-7xl mx-auto py-4 sm:py-6 px-3 sm:px-6 lg:px-8">
        <CollectionList onSelectCollection={handleSelectCollection} />
      </main>
    </div>
  );
}