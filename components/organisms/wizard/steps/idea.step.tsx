'use client';

import { SparklesIcon } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/atoms/index.atoms';
import { useProject } from '@/contexts/project.context';

export function IdeaStep() {
  const {
    createProject,
    currentProject,
    setCurrentProject,
    setWizardStep,
    updateProject,
  } = useProject();
  const [idea, setIdea] = useState(currentProject?.description || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleNext = async () => {
    setIsSaving(true);
    try {
      if (currentProject?.id && !currentProject.id.startsWith('proj_')) {
        await updateProject(currentProject.id, { description: idea });
      } else {
        const name =
          idea.split(' ').slice(0, 3).join(' ') || 'Untitled Project';
        const project = await createProject(name, idea, 'minimal');
        setCurrentProject(project);
      }
      setWizardStep('theme');
    } catch (error) {
      console.error('Failed to save project:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className='flex flex-col items-center max-w-2xl mx-auto py-20 px-4'>
      <div className='mb-8 text-center'>
        <h2 className='text-3xl font-bold text-white mb-4'>
          What are we building today?
        </h2>
        <p className='text-zinc-500'>
          Describe your app idea in simple words. Our AI will handle the rest.
        </p>
      </div>

      <div className='w-full'>
        <textarea
          className='w-full h-48 bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 text-lg text-white placeholder-zinc-700 focus:outline-none focus:ring-1 focus:ring-white transition-all resize-none mb-8'
          onChange={e => setIdea(e.target.value)}
          placeholder='e.g. A meditation app with a minimal timer and soundscapes...'
          value={idea}
        />
        <div className='flex justify-center'>
          <Button
            className='h-12 px-8 text-sm font-bold uppercase tracking-widest'
            disabled={!idea.trim() || isSaving}
            onClick={handleNext}
          >
            {isSaving ? (
              <div className='h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2' />
            ) : (
              <SparklesIcon className='w-4 h-4 mr-2' />
            )}
            {isSaving ? 'Saving...' : 'Generate Themes'}
          </Button>
        </div>
      </div>
    </div>
  );
}
