import React, { createContext, useContext, useState } from 'react';
import { UserProfile } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  isFaculty: boolean;
  isStudent: boolean;
  signOut: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
}

const STORAGE_KEY = 'edusync_user';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const createProfile = (email: string): UserProfile => ({
    uid: Math.random().toString(36).slice(2),
    email,
    displayName: email.split('@')[0],
    role: 'student',
    createdAt: new Date().toISOString(),
  });

  const signIn = async (email: string, password: string) => {
    if (!email || password.length < 6) throw new Error('Invalid email or password (min 6 chars).');
    const stored = localStorage.getItem(`edusync_account_${email}`);
    if (!stored) throw new Error('No account found. Please sign up first.');
    const account = JSON.parse(stored);
    if (account.password !== password) throw new Error('Incorrect password.');
    localStorage.setItem(STORAGE_KEY, JSON.stringify(account.profile));
    setUser(account.profile);
  };

  const signUp = async (email: string, password: string) => {
    if (!email || password.length < 6) throw new Error('Password must be at least 6 characters.');
    if (localStorage.getItem(`edusync_account_${email}`)) throw new Error('Account already exists. Please sign in.');
    const profile = createProfile(email);
    localStorage.setItem(`edusync_account_${email}`, JSON.stringify({ password, profile }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    setUser(profile);
  };

  const signOut = async () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile: user,
      loading: false,
      isAdmin: user?.role === 'admin',
      isFaculty: user?.role === 'faculty',
      isStudent: user?.role === 'student',
      signIn,
      signUp,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
