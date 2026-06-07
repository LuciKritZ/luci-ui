'use client';

import { CheckIcon, RotateCcwIcon, SaveIcon, SparklesIcon } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';

import { Button, Skeleton } from '@/components/atoms/index.atoms';
import { DashboardPreview } from '@/components/molecules/dashboard-preview.molecule';
import { HeaderManager } from '@/components/molecules/header-manager.molecule';
import { IDesignTheme, useDesignSystem } from '@/contexts/design.context';
import { cn } from '@/utils/index.utils';

export function NewThemesView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromWizard = searchParams.get('from') === 'wizard';

  const {
    activePreviewTheme,
    generateThemes,
    isLoading,
    saveTheme,
    setActivePreviewTheme,
  } = useDesignSystem();

  const [prompt, setPrompt] = useState('');
  const [generatedThemes, setGeneratedThemes] = useState<IDesignTheme[]>([]);
  const [savedThemeIds, setSavedThemeIds] = useState<Set<string>>(new Set());
  const [previewMode] = useState<'dark' | 'light'>('dark');

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    try {
      const themes = await generateThemes(prompt);
      setGeneratedThemes(themes);
      if (themes.length > 0) {
        setActivePreviewTheme(themes[0]);
      }
    } catch (error) {
      console.error('Generation failed:', error);
    }
  };

  const handleSave = async (theme: IDesignTheme, index: number) => {
    try {
      await saveTheme(theme);
      setSavedThemeIds(prev => new Set(prev).add(index.toString()));

      if (fromWizard) {
        router.push('/new');
      }
    } catch (error) {
      console.error('Save failed:', error);
    }
  };

  return (
    <div className='flex flex-col h-[calc(100vh-80px)] overflow-hidden'>
      <HeaderManager title='Theme Generator' />
      {/* Input Area */}
      <div className='p-8 border-b border-border bg-surface/50 backdrop-blur-sm shrink-0'>
        <div className='max-w-4xl mx-auto'>
          <form className='relative w-full' onSubmit={handleGenerate}>
            <input
              className='w-full bg-background border border-border rounded-xl pl-4 pr-36 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all'
              onChange={e => setPrompt(e.target.value)}
              placeholder="e.g. 'A futuristic dark dashboard for a space logistics company with neon accents'"
              type='text'
              value={prompt}
            />
            <Button
              className='absolute right-1.5 top-1.5 bottom-1.5 h-auto bg-brand text-white px-6 rounded-lg text-xs font-bold flex items-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all'
              disabled={isLoading || !prompt.trim()}
              type='submit'
            >
              {isLoading ? (
                <RotateCcwIcon className='w-3.5 h-3.5 animate-spin' />
              ) : (
                <>
                  <SparklesIcon className='w-3.5 h-3.5' />
                  Generate
                </>
              )}
            </Button>
          </form>
        </div>
      </div>

      {/* Main Content Area: Left Sidebar (Pills) + Right (Preview) */}
      <div className='flex-1 flex overflow-hidden'>
        {/* Theme Selection Sidebar */}
        <div className='w-80 border-r border-border bg-surface/30 overflow-y-auto p-6 space-y-4'>
          <h3 className='text-xs font-bold uppercase tracking-widest text-content-tertiary mb-6'>
            Generated Identities
          </h3>

          {generatedThemes.length === 0 && !isLoading && (
            <div className='text-center py-12 px-4 border-2 border-dashed border-border rounded-2xl'>
              <SparklesIcon className='w-8 h-8 text-border mx-auto mb-4' />
              <p className='text-xs text-content-tertiary'>
                Your generated themes will appear here.
              </p>
            </div>
          )}

          {isLoading && (
            <div className='space-y-4'>
              {[1, 2, 3].map(i => (
                <div
                  className='p-4 rounded-2xl border bg-surface border-border animate-pulse'
                  key={i}
                >
                  <div className='flex items-center justify-between mb-3'>
                    <Skeleton className='h-4 w-24' />
                    <Skeleton className='h-8 w-8 rounded-lg' />
                  </div>
                  <div className='flex gap-1.5 mb-3'>
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
          )}

          {!isLoading &&
            generatedThemes.map((theme, index) => {
              const colors = theme.colors?.[previewMode] || theme.colors?.dark;
              const currentColors = colors || {
                accent: '#3b82f6',
                background: '#ffffff',
                content: '#09090b',
                primary: '#18181b',
                surface: '#f9fafb',
              };
              return (
                <div
                  className={cn(
                    'group relative p-4 rounded-2xl border transition-all cursor-pointer',
                    activePreviewTheme?.name === theme.name
                      ? 'bg-brand/5 border-brand/50 ring-1 ring-brand/50'
                      : 'bg-surface border-border hover:border-content-tertiary/50'
                  )}
                  key={index}
                  onClick={() => setActivePreviewTheme(theme)}
                >
                  <div className='flex items-center justify-between mb-3'>
                    <span className='font-display font-bold text-sm'>
                      {theme.name}
                    </span>
                    {savedThemeIds.has(index.toString()) ? (
                      <CheckIcon className='w-4 h-4 text-green-500' />
                    ) : (
                      <Button
                        className='p-2 opacity-0 group-hover:opacity-100 hover:bg-brand/10 rounded-lg text-brand transition-all'
                        onClick={e => {
                          e.stopPropagation();
                          handleSave(theme, index);
                        }}
                        size='icon'
                        variant='ghost'
                      >
                        <SaveIcon className='w-4 h-4' />
                      </Button>
                    )}
                  </div>

                  {/* Color Pills Mini Preview */}
                  <div className='flex gap-1.5 mb-3'>
                    <div
                      className='w-4 h-4 rounded-full border border-white/10'
                      style={{ backgroundColor: currentColors.background }}
                    />
                    <div
                      className='w-4 h-4 rounded-full border border-white/10'
                      style={{ backgroundColor: currentColors.primary }}
                    />
                    <div
                      className='w-4 h-4 rounded-full border border-white/10'
                      style={{ backgroundColor: currentColors.accent }}
                    />
                    <div
                      className='w-4 h-4 rounded-full border border-white/10'
                      style={{ backgroundColor: currentColors.content }}
                    />
                  </div>

                  <div className='flex items-center gap-2'>
                    <span className='text-[10px] px-2 py-0.5 rounded-md bg-content-primary/5 text-content-secondary font-medium'>
                      {theme.fontSans}
                    </span>
                    <span className='text-[10px] px-2 py-0.5 rounded-md bg-content-primary/5 text-content-secondary font-medium lowercase'>
                      {theme.animation}
                    </span>
                  </div>
                </div>
              );
            })}
        </div>

        {/* Live Preview Canvas */}
        <div className='flex-1 bg-background p-12 overflow-y-auto'>
          <div className='max-w-5xl mx-auto'>
            <div className='flex items-center justify-between mb-8'>
              <div>
                <h3 className='text-sm font-bold uppercase tracking-widest text-content-tertiary'>
                  Real-time Visualization
                </h3>
                <p className='text-xs text-content-tertiary'>
                  How your theme looks in a production environment.
                </p>
              </div>

              <div className='flex items-center gap-6'>
                {activePreviewTheme &&
                  generatedThemes.length > 0 &&
                  !savedThemeIds.has(
                    generatedThemes.indexOf(activePreviewTheme).toString()
                  ) && (
                    <Button
                      className='bg-brand text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:opacity-90 transition-all'
                      onClick={() =>
                        handleSave(
                          activePreviewTheme,
                          generatedThemes.indexOf(activePreviewTheme)
                        )
                      }
                    >
                      <SaveIcon className='w-3.5 h-3.5' />
                      Save Aesthetic
                    </Button>
                  )}
              </div>
            </div>

            <div className='relative group'>
              <div className='absolute -inset-1 bg-linear-to-r from-brand/20 to-accent/20 rounded-[calc(var(--preview-radius)+4px)] blur opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:duration-200'></div>
              <div className='relative'>
                <DashboardPreview
                  initialMode={previewMode}
                  theme={activePreviewTheme}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
