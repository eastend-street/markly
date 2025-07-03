'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { LOGIN_MUTATION, REGISTER_MUTATION, ME_QUERY } from '@/lib/graphql/queries';

interface User {
  id: string;
  email: string;
  username: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [loginMutation] = useMutation(LOGIN_MUTATION);
  const [registerMutation] = useMutation(REGISTER_MUTATION);
  
  const { data: userData, refetch: refetchUser } = useQuery(ME_QUERY, {
    skip: !user && typeof window !== 'undefined' && !localStorage.getItem('token'),
    errorPolicy: 'ignore',
  });

  useEffect(() => {
    // Check if user is logged in on mount
    const token = localStorage.getItem('token');
    if (token && !user) {
      refetchUser().then(({ data }) => {
        if (data?.me) {
          setUser(data.me);
        } else {
          localStorage.removeItem('token');
        }
        setLoading(false);
      }).catch(() => {
        localStorage.removeItem('token');
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [user, refetchUser]);

  useEffect(() => {
    if (userData?.me) {
      setUser(userData.me);
    }
  }, [userData]);

  const login = async (email: string, password: string) => {
    try {
      const { data } = await loginMutation({
        variables: {
          input: { email, password }
        }
      });

      if (data?.login) {
        const { token, user: loggedInUser } = data.login;
        localStorage.setItem('token', token);
        setUser(loggedInUser);
        return { success: true };
      }
      
      return { success: false, error: 'Login failed' };
    } catch (error) {
      return { success: false, error: (error as Error).message || 'Login failed' };
    }
  };

  const register = async (email: string, username: string, password: string) => {
    try {
      const { data } = await registerMutation({
        variables: {
          input: { email, username, password }
        }
      });

      if (data?.register) {
        const { token, user: registeredUser } = data.register;
        localStorage.setItem('token', token);
        setUser(registeredUser);
        return { success: true };
      }
      
      return { success: false, error: 'Registration failed' };
    } catch (error) {
      return { success: false, error: (error as Error).message || 'Registration failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}