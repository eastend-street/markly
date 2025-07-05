'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_COLLECTIONS_QUERY } from '@/lib/graphql/queries';
import SearchInterface from '@/components/search/SearchInterface';
import MobileHeader from '@/components/layout/MobileHeader';

export default function SearchPage() {
  const { user, logout, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  
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

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileHeader 
        title="Search" 
        showBackButton={true} 
        backUrl="/dashboard" 
      />

      <main className="max-w-7xl mx-auto py-4 sm:py-6 px-3 sm:px-6 lg:px-8">
        <SearchInterface collections={collections} />
      </main>
    </div>
  );
}