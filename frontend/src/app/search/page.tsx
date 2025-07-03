'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_COLLECTIONS_QUERY } from '@/lib/graphql/queries';
import SearchInterface from '@/components/search/SearchInterface';

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
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Search Bookmarks</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.username}!</span>
              <button
                onClick={logout}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <SearchInterface collections={collections} />
        </div>
      </main>
    </div>
  );
}