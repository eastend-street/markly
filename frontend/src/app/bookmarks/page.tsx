'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_COLLECTIONS_QUERY } from '@/lib/graphql/queries';
import BookmarkList from '@/components/bookmarks/BookmarkList';
import MobileHeader from '@/components/layout/MobileHeader';

export default function BookmarksPage() {
  const { user, logout, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const collectionId = searchParams.get('collection');
  
  const { data: collectionsData, loading: collectionsLoading } = useQuery(GET_COLLECTIONS_QUERY, {
    skip: !isAuthenticated,
    errorPolicy: 'all',
  });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth');
    }
  }, [isAuthenticated, loading, router]);

  if (loading || collectionsLoading) {
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
    return null;
  }

  const collections = collectionsData?.collections || [];
  const selectedCollection = collections.find(c => c.id === collectionId);
  
  // Create filter based on collection parameter
  const filter = collectionId ? { collectionId } : undefined;
  
  const pageTitle = selectedCollection ? `${selectedCollection.name} Bookmarks` : 'Bookmarks';
  const backUrl = collectionId ? '/collections' : '/dashboard';

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileHeader 
        title={pageTitle}
        showBackButton={true} 
        backUrl={backUrl}
      />

      <main className="max-w-7xl mx-auto py-4 sm:py-6 px-3 sm:px-6 lg:px-8">
        <BookmarkList 
          collections={collections} 
          filter={filter}
        />
      </main>
    </div>
  );
}