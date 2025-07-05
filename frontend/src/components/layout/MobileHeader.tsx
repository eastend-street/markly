'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface MobileHeaderProps {
  title: string;
  showBackButton?: boolean;
  backUrl?: string;
  rightAction?: React.ReactNode;
}

export default function MobileHeader({ title, showBackButton = false, backUrl = '/dashboard', rightAction }: MobileHeaderProps) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleBack = () => {
    router.push(backUrl);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3 sm:py-6">
          <div className="flex items-center space-x-2 sm:space-x-4">
            {showBackButton && (
              <button
                onClick={handleBack}
                className="text-gray-500 hover:text-gray-700 p-2 -ml-2 touch-target"
                aria-label="Go back"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
            )}
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">{title}</h1>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            {rightAction}
            <span className="hidden sm:inline text-gray-700 text-sm">Welcome, {user?.username}!</span>
            <span className="sm:hidden text-gray-700 text-sm truncate max-w-20">{user?.username}</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-md hover:bg-red-700 text-sm touch-target"
              aria-label="Logout"
            >
              <span className="hidden sm:inline">Logout</span>
              <span className="sm:hidden">Exit</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}