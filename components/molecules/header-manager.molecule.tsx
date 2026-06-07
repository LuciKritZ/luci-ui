'use client';

import React, { useEffect } from 'react';

import { useLayout } from '@/contexts/layout.context';

interface HeaderManagerProps {
  actions?: React.ReactNode;
  title: string;
}

export function HeaderManager({ actions, title }: HeaderManagerProps) {
  const { setHeaderActions, setHeaderTitle } = useLayout();

  useEffect(() => {
    setHeaderTitle(title);
    setHeaderActions(actions || null);

    // Clean up when leaving the page
    return () => {
      setHeaderTitle('');
      setHeaderActions(null);
    };
  }, [title, actions, setHeaderTitle, setHeaderActions]);

  return null;
}
