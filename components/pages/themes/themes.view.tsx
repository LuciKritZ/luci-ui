'use client';

import { PlusIcon, SearchIcon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { Skeleton } from '@/components/atoms/index.atoms';
import { HeaderManager } from '@/components/molecules/header-manager.molecule';
import { NoThemeSelected } from '@/components/pages/themes/no-theme-selected.themes';
import { NoThemesFound } from '@/components/pages/themes/no-themes-found.themes';
import { ThemePreviewCanvas } from '@/components/pages/themes/theme-preview-canvas.themes';
import { ThemesList } from '@/components/pages/themes/themes-list.themes';
import { useDesignSystem } from '@/contexts/design.context';

export function ThemesView() {
  const {
    activePreviewTheme,
    isFetchingThemes,
    savedThemes,
    searchQuery,
    setActivePreviewTheme,
    setSearchQuery,
  } = useDesignSystem();

  const [previewMode] = useState<'dark' | 'light'>('dark');

  const filteredThemes = savedThemes.filter(theme => {
    const name = theme?.name?.toLowerCase() || '';
    const description = theme?.description?.toLowerCase() || '';
    const query = searchQuery.toLowerCase();
    return name.includes(query) || description.includes(query);
  });

  return (
    <div className='flex flex-col h-[calc(100vh-80px)] overflow-hidden'>
      <HeaderManager
        actions={
          <div className='ml-auto flex items-center gap-4'>
            <div className='relative hidden md:block'>
              <SearchIcon className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-content-tertiary' />
              <input
                className='bg-surface border border-border rounded-xl pl-10 pr-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all w-64'
                onChange={e => setSearchQuery(e.target.value)}
                placeholder='Search themes...'
                type='text'
                value={searchQuery}
              />
            </div>
            <Link
              className='bg-brand text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:opacity-90 transition-all'
              href='/new/themes'
            >
              <PlusIcon className='w-3.5 h-3.5' />
              New Theme
            </Link>
          </div>
        }
        title='Themes'
      />
      <div className='flex-1 flex overflow-hidden'>
        {/* Gallery Sidebar */}
        <div className='w-96 border-r border-border bg-surface/30 overflow-y-auto p-6'>
          {isFetchingThemes ? (
            <div className='space-y-4'>
              {[1, 2, 3, 4].map(i => (
                <div
                  className='p-4 rounded-2xl border bg-surface border-border animate-pulse'
                  key={i}
                >
                  <div className='flex items-center justify-between mb-4'>
                    <Skeleton className='h-4 w-24' />
                    <Skeleton className='h-8 w-8 rounded-lg' />
                  </div>
                  <div className='flex gap-1.5 mb-4'>
                    <Skeleton className='flex-1 h-2 rounded-full' />
                    <Skeleton className='flex-1 h-2 rounded-full' />
                    <Skeleton className='flex-1 h-2 rounded-full' />
                    <Skeleton className='flex-1 h-2 rounded-full' />
                  </div>
                  <div className='flex items-center justify-between'>
                    <Skeleton className='h-3 w-16' />
                    <Skeleton className='h-4 w-12 rounded' />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredThemes.length === 0 ? (
            <NoThemesFound />
          ) : (
            <ThemesList
              activePreviewTheme={activePreviewTheme}
              filteredThemes={filteredThemes}
              previewMode={previewMode}
              setActivePreviewTheme={setActivePreviewTheme}
            />
          )}
        </div>

        {/* Focused Preview Canvas */}
        <div className='flex-1 bg-background p-12 overflow-y-auto'>
          {activePreviewTheme ? (
            <ThemePreviewCanvas
              activePreviewTheme={activePreviewTheme}
              previewMode={previewMode}
            />
          ) : (
            <NoThemeSelected />
          )}
        </div>
      </div>
    </div>
  );
}
