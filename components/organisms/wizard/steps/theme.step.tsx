'use client';

import { CheckIcon, PaletteIcon, SparklesIcon } from 'lucide-react';
import Link from 'next/link';

import { useDesignSystem } from '@/contexts/design.context';
import { useProject } from '@/contexts/project.context';
import { cn } from '@/utils/index.utils';

export function ThemeStep() {
  const { savedThemes } = useDesignSystem();
  const { currentProject, updateProject } = useProject();

  const selectedThemeId = currentProject?.theme;

  const handleSelect = (themeId: string) => {
    if (currentProject?.id) {
      updateProject(currentProject.id, { theme: themeId });
    }
  };

  if (savedThemes.length === 0) {
    return (
      <div className='max-w-2xl mx-auto py-12'>
        <div className='text-center p-10 border-2 border-dashed border-border rounded-[32px] bg-surface/30'>
          <div className='w-16 h-16 bg-brand/10 rounded-2xl flex items-center justify-center mx-auto mb-6'>
            <PaletteIcon className='w-8 h-8 text-brand' />
          </div>
          <h3 className='text-xl font-display font-bold mb-3'>
            No custom themes found
          </h3>
          <p className='text-sm text-content-tertiary mb-8 max-w-sm mx-auto'>
            You haven&apos;t generated any aesthetic identities yet. Use our AI
            theme generator to craft a unique look for your project.
          </p>
          <Link
            className='inline-flex items-center gap-2 bg-brand text-white px-8 py-3 rounded-xl text-sm font-bold hover:opacity-90 transition-all shadow-lg shadow-brand/20'
            href='/new/themes?from=wizard'
          >
            <SparklesIcon className='w-4 h-4' />
            Generate with AI
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='max-w-4xl mx-auto'>
      <div className='flex items-center justify-between mb-8'>
        <div>
          <h3 className='text-lg font-display font-bold'>
            Select Visual Identity
          </h3>
          <p className='text-sm text-content-tertiary'>
            Choose the design system for this project.
          </p>
        </div>
        <Link
          className='text-xs font-bold text-brand flex items-center gap-1.5 hover:underline'
          href='/new/themes?from=wizard'
        >
          <SparklesIcon className='w-3.5 h-3.5' />
          Create New Identity
        </Link>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {savedThemes.map(theme => (
          <div
            className={cn(
              'group relative p-6 rounded-3xl border transition-all cursor-pointer',
              selectedThemeId === theme.id
                ? 'bg-brand/5 border-brand/50 ring-2 ring-brand/20 shadow-xl shadow-brand/5'
                : 'bg-surface border-border hover:border-content-tertiary/50'
            )}
            key={theme.id}
            onClick={() => handleSelect(theme.id!)}
          >
            {selectedThemeId === theme.id && (
              <div className='absolute top-4 right-4 w-6 h-6 bg-brand rounded-full flex items-center justify-center shadow-lg animate-in zoom-in duration-300'>
                <CheckIcon className='w-3.5 h-3.5 text-white' />
              </div>
            )}

            <div className='flex flex-col gap-4'>
              <div className='flex items-center gap-3'>
                <div
                  className='w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold'
                  style={{
                    backgroundColor: theme.colors.dark.primary,
                    fontFamily: theme.fontDisplay,
                  }}
                >
                  {theme.name.charAt(0)}
                </div>
                <div>
                  <h4 className='font-display font-bold text-sm'>
                    {theme.name}
                  </h4>
                  <p className='text-[10px] text-content-tertiary uppercase tracking-widest font-black'>
                    {theme.fontSans} • {theme.radius}
                  </p>
                </div>
              </div>

              {/* Color Strip */}
              <div className='flex h-3 gap-1 rounded-full overflow-hidden'>
                <div
                  className='flex-1'
                  style={{ backgroundColor: theme.colors.dark.primary }}
                />
                <div
                  className='flex-1'
                  style={{ backgroundColor: theme.colors.dark.accent }}
                />
                <div
                  className='flex-1'
                  style={{ backgroundColor: theme.colors.dark.surface }}
                />
                <div
                  className='flex-1'
                  style={{ backgroundColor: theme.colors.dark.background }}
                />
              </div>

              <p className='text-[11px] text-content-tertiary line-clamp-1 italic'>
                {theme.description || 'A cohesive design system built with AI.'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
