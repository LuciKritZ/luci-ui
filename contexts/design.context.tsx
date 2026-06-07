'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

import { useAuth } from './auth.context';

export interface IDesignTheme {
  _id?: string;
  animation: 'bouncy' | 'fluid' | 'minimal' | 'snappy';
  colors: {
    dark: {
      accent: string;
      background: string;
      border: string;
      card: string;
      cardForeground: string;
      content: string;
      destructive: string;
      destructiveForeground: string;
      input: string;
      muted: string;
      mutedForeground: string;
      popover: string;
      popoverForeground: string;
      primary: string;
      primaryForeground: string;
      ring: string;
      secondary: string;
      secondaryForeground: string;
      sidebarActive: string;
      sidebarActiveForeground: string;
      surface: string;
    };
    light: {
      accent: string;
      background: string;
      border: string;
      card: string;
      cardForeground: string;
      content: string;
      destructive: string;
      destructiveForeground: string;
      input: string;
      muted: string;
      mutedForeground: string;
      popover: string;
      popoverForeground: string;
      primary: string;
      primaryForeground: string;
      ring: string;
      secondary: string;
      secondaryForeground: string;
      sidebarActive: string;
      sidebarActiveForeground: string;
      surface: string;
    };
  };
  createdAt: string;
  description?: string;
  fontDisplay: string;
  fontSans: string;
  id: string;
  name: string;
  radius: string;
  shadows: 'glow' | 'none' | 'sharp' | 'soft';
  spacing: {
    base: string;
    scale: 'comfortable' | 'compact' | 'loose';
  };
}

interface DesignSystemContextType {
  activePreviewTheme: IDesignTheme | null;
  deleteTheme: (id: string) => Promise<void>;
  generateThemes: (prompt: string) => Promise<IDesignTheme[]>;
  isFetchingThemes: boolean;
  isLoading: boolean;
  savedThemes: IDesignTheme[];
  saveTheme: (
    theme: Omit<IDesignTheme, 'createdAt' | 'id'>
  ) => Promise<IDesignTheme>;
  searchQuery: string;
  setActivePreviewTheme: (theme: IDesignTheme | null) => void;
  setSearchQuery: (query: string) => void;
}

const DesignSystemContext = createContext<DesignSystemContextType | undefined>(
  undefined
);

export function DesignSystemProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuth();
  const [activePreviewTheme, setActivePreviewTheme] =
    useState<IDesignTheme | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingThemes, setIsFetchingThemes] = useState(true);
  const [savedThemes, setSavedThemes] = useState<IDesignTheme[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchSavedThemes = async () => {
    try {
      setIsFetchingThemes(true);
      const response = await fetch('/api/themes');
      const data = await response.json();
      setSavedThemes(data);
    } catch (error) {
      console.error('Failed to fetch themes:', error);
    } finally {
      setIsFetchingThemes(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchSavedThemes();
    }
  }, [isAuthenticated]);

  const generateThemes = async (prompt: string): Promise<IDesignTheme[]> => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/generate/themes', {
        body: JSON.stringify({ prompt }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      });
      const data = await response.json();
      return data.themes;
    } finally {
      setIsLoading(false);
    }
  };

  const saveTheme = async (
    theme: Omit<IDesignTheme, 'createdAt' | 'id'>
  ): Promise<IDesignTheme> => {
    const response = await fetch('/api/themes', {
      body: JSON.stringify(theme),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to save theme');
    }

    const saved = await response.json();
    setSavedThemes(prev => [...prev, saved]);
    return saved;
  };

  const deleteTheme = async (id: string) => {
    try {
      const response = await fetch(`/api/themes/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setSavedThemes(prev => prev.filter(t => t.id !== id && t._id !== id));
        if (activePreviewTheme?.id === id || activePreviewTheme?._id === id) {
          setActivePreviewTheme(null);
        }
      }
    } catch (error) {
      console.error('Delete theme error:', error);
    }
  };

  return (
    <DesignSystemContext.Provider
      value={{
        activePreviewTheme,
        deleteTheme,
        generateThemes,
        isFetchingThemes,
        isLoading,
        savedThemes,
        saveTheme,
        searchQuery,
        setActivePreviewTheme,
        setSearchQuery,
      }}
    >
      {children}
    </DesignSystemContext.Provider>
  );
}

export function useDesignSystem() {
  const context = useContext(DesignSystemContext);
  if (context === undefined) {
    throw new Error(
      'useDesignSystem must be used within a DesignSystemProvider'
    );
  }
  return context;
}
