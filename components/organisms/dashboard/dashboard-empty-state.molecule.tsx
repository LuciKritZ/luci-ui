'use client';

import { FolderPlusIcon } from 'lucide-react';

import { Button } from '@/components/atoms/index.atoms';
import { useProject } from '@/contexts/project.context';

export function DashboardEmptyState() {
  const { setWizardStep } = useProject();

  return (
    <div className='flex flex-col items-center justify-center py-24 px-8 bg-surface border border-border brand-border relative overflow-hidden max-w-3xl mx-auto'>
      <div className='brand-glow' />
      <div className='relative z-10 flex flex-col items-center'>
        <div className='h-16 w-16 bg-background border border-border flex items-center justify-center mb-8 text-brand'>
          <FolderPlusIcon className='h-6 w-6' />
        </div>
        <h3 className='font-display text-2xl md:text-3xl font-black text-content-primary mb-4 tracking-tighter'>
          Create your first masterpiece
        </h3>
        <p className='font-display text-xs text-content-secondary max-w-md text-center leading-relaxed mb-10'>
          Bring your ideas to life. Start generating your high-fidelity PWA
          application in seconds.
        </p>
        <Button
          className='bg-brand text-white hover:bg-brand/90 h-12 px-8 rounded-none font-display font-bold uppercase tracking-[0.1em] text-xs transition-colors'
          onClick={() => setWizardStep('idea')}
        >
          Start Building
        </Button>
      </div>
    </div>
  );
}
