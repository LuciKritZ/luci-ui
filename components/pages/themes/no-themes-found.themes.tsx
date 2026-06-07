import { PaletteIcon, SparklesIcon } from 'lucide-react';
import Link from 'next/link';

export function NoThemesFound() {
  return (
    <div className='text-center py-20 px-6 border-2 border-dashed border-border rounded-3xl'>
      <div className='w-12 h-12 bg-surface border border-border rounded-2xl flex items-center justify-center mx-auto mb-4'>
        <PaletteIcon className='w-6 h-6 text-content-tertiary' />
      </div>
      <h3 className='text-sm font-bold mb-2'>No themes found</h3>
      <p className='text-xs text-content-tertiary mb-6'>
        Start by generating your first design system with AI.
      </p>
      <Link
        className='inline-flex items-center gap-2 text-brand text-xs font-bold hover:underline'
        href='/new/themes'
      >
        <SparklesIcon className='w-3.5 h-3.5' />
        Open Generator
      </Link>
    </div>
  );
}
