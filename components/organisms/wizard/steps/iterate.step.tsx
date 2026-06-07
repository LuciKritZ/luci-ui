'use client';

import {
  BrainIcon,
  CheckIcon,
  CodeIcon,
  RotateCcwIcon,
  SaveIcon,
  SparklesIcon,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/atoms/index.atoms';
import { SideDrawer } from '@/components/organisms/index.organisms';
import { useProject } from '@/contexts/project.context';
import { useSettings } from '@/contexts/settings.context';
import { useGenerator } from '@/hooks/index.hooks';
import { cn } from '@/utils/index.utils';

export function IterateStep() {
  const router = useRouter();
  const { addVersion, currentProject } = useProject();
  const { isSettingsLoaded } = useSettings();
  const {
    generateSession,
    isLoading,
    sessions,
    setCurrentSessionIndex,
    setSessions,
  } = useGenerator();

  const [focusedArtifactIndex, setFocusedArtifactIndex] = useState<number>(0);
  const [drawerState, setDrawerState] = useState<{
    data: null | string;
    isOpen: boolean;
    mode: 'code' | 'variations' | null;
    title: string;
  }>({ data: null, isOpen: false, mode: null, title: '' });

  const [savedArtifactIds, setSavedArtifactIds] = useState<Set<string>>(
    new Set()
  );

  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current || !currentProject) return;

    if (currentProject.versions && currentProject.versions.length > 0) {
      const recoveredSession = {
        artifacts: currentProject.versions.map((code, index) => ({
          html: code,
          id: `artifact_${Date.now()}_${index}`,
          status: 'complete' as const,
          styleName: `Iteration ${index + 1}`,
        })),
        id: `session_${Date.now()}`,
        prompt: currentProject.description || 'Recovered Project',
        timestamp: currentProject.lastEdited || Date.now(),
      };
      setSessions([recoveredSession]);
      setCurrentSessionIndex(0);
      setFocusedArtifactIndex(currentProject.versions.length - 1);
      hasInitialized.current = true;
    } else if (
      currentProject.description &&
      sessions.length === 0 &&
      !isLoading &&
      isSettingsLoaded
    ) {
      hasInitialized.current = true;
      generateSession(
        currentProject.description,
        currentProject.theme || 'minimal'
      );
    }
  }, [
    currentProject,
    generateSession,
    setSessions,
    setCurrentSessionIndex,
    sessions.length,
    isLoading,
    isSettingsLoaded,
  ]);

  const allArtifacts = sessions.flatMap(s => s.artifacts);
  const activeArtifact = allArtifacts[focusedArtifactIndex];

  const handleSaveToProject = async (html: string, artifactId: string) => {
    if (!currentProject) return;
    await addVersion(currentProject.id, html);
    setSavedArtifactIds(prev => new Set(prev).add(artifactId));
    router.push('/');
  };

  const handleShowCode = () => {
    if (activeArtifact) {
      setDrawerState({
        data: activeArtifact.html,
        isOpen: true,
        mode: 'code',
        title: 'Source Code',
      });
    }
  };

  return (
    <div className='flex flex-col h-[calc(100vh-80px)] overflow-hidden bg-background text-content-primary w-full'>
      {/* Header Area */}
      <div className='p-8 border-b border-border bg-surface/50 backdrop-blur-sm shrink-0'>
        <div className='max-w-4xl mx-auto flex items-center justify-between'>
          <div>
            <h2 className='text-xl font-display font-black tracking-tighter uppercase text-white'>
              {currentProject?.name || 'Generating Project'}
            </h2>
            <p className='text-sm text-content-tertiary mt-1 max-w-2xl truncate'>
              {currentProject?.description ||
                'Your vision is coming to life...'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className='flex-1 flex overflow-hidden'>
        {/* Sidebar */}
        <div className='w-80 border-r border-border bg-surface/30 overflow-y-auto p-6 space-y-4 flex flex-col'>
          <h3 className='text-xs font-bold uppercase tracking-widest text-content-tertiary mb-6 shrink-0'>
            Generated Designs
          </h3>

          {allArtifacts.length === 0 && !isLoading && (
            <div className='text-center py-12 px-4 border-2 border-dashed border-border rounded-2xl'>
              <BrainIcon className='w-8 h-8 text-border mx-auto mb-4' />
              <p className='text-xs text-content-tertiary'>Awaiting ideas...</p>
            </div>
          )}

          {allArtifacts.map((artifact, index) => {
            const isSelected = focusedArtifactIndex === index;
            const isBlurring = artifact.status === 'streaming';

            return (
              <div
                className={cn(
                  'group relative p-4 rounded-2xl border transition-all',
                  isBlurring
                    ? 'opacity-70 cursor-wait'
                    : 'cursor-pointer hover:border-content-tertiary/50',
                  isSelected
                    ? 'bg-brand/5 border-brand/50 ring-1 ring-brand/50'
                    : 'bg-surface border-border'
                )}
                key={artifact.id}
                onClick={() => !isBlurring && setFocusedArtifactIndex(index)}
              >
                <div className='flex items-center justify-between mb-2'>
                  <span className='font-display font-bold text-sm text-white line-clamp-1 mr-2'>
                    {artifact.styleName}
                  </span>
                  {isBlurring && (
                    <RotateCcwIcon className='w-4 h-4 text-brand animate-spin shrink-0' />
                  )}
                  {!isBlurring && savedArtifactIds.has(artifact.id) && (
                    <CheckIcon className='w-4 h-4 text-green-500 shrink-0' />
                  )}
                </div>

                <div className='flex items-center justify-between'>
                  <span
                    className={cn(
                      'text-[10px] px-2 py-0.5 rounded-md font-medium',
                      isBlurring
                        ? 'bg-brand/20 text-brand animate-pulse'
                        : 'bg-content-primary/5 text-content-secondary'
                    )}
                  >
                    {isBlurring
                      ? 'Generating...'
                      : artifact.status === 'error'
                        ? 'Failed'
                        : 'Complete'}
                  </span>
                  {!isBlurring && (
                    <span className='text-[10px] text-content-tertiary uppercase tracking-wider font-bold'>
                      Iteration {index + 1}
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          {allArtifacts.length > 0 && (
            <Button
              className='w-full mt-4 border-border px-4 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:text-white transition-all shrink-0'
              disabled={isLoading}
              onClick={() => {
                if (currentProject?.description) {
                  generateSession(
                    currentProject.description,
                    currentProject.theme || 'minimal'
                  );
                  setFocusedArtifactIndex(0);
                }
              }}
              variant='outline'
            >
              {isLoading ? (
                <RotateCcwIcon className='w-4 h-4 animate-spin' />
              ) : (
                <SparklesIcon className='w-4 h-4' />
              )}
              {isLoading ? 'Loading...' : 'Load More Designs'}
            </Button>
          )}
        </div>

        {/* Live Preview Canvas */}
        <div className='flex-1 bg-background p-12 overflow-y-auto relative'>
          <div className='max-w-5xl mx-auto h-full flex flex-col'>
            <div className='flex items-center justify-between mb-8 shrink-0'>
              <div>
                <h3 className='text-sm font-bold uppercase tracking-widest text-content-tertiary'>
                  Generated HTML
                </h3>
                <p className='text-xs text-content-tertiary'>
                  Interact with your selected design.
                </p>
              </div>

              {activeArtifact &&
                !activeArtifact.status.includes('error') &&
                activeArtifact.status !== 'streaming' && (
                  <div className='flex items-center gap-4'>
                    <Button
                      className='flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors'
                      onClick={handleShowCode}
                      variant='outline'
                    >
                      <CodeIcon className='w-4 h-4' />
                      Source
                    </Button>
                    <Button
                      className='bg-brand text-white px-6 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:opacity-90 transition-all'
                      onClick={() =>
                        handleSaveToProject(
                          activeArtifact.html,
                          activeArtifact.id
                        )
                      }
                    >
                      <SaveIcon className='w-4 h-4' />
                      Save & Finish
                    </Button>
                  </div>
                )}
            </div>

            <div className='relative group flex-1 bg-surface/50 rounded-2xl border border-border overflow-hidden min-h-[500px]'>
              {activeArtifact?.status === 'streaming' ? (
                <div className='absolute inset-0 flex flex-col items-center justify-center p-16 text-brand gap-4 bg-background'>
                  <BrainIcon className='w-12 h-12 animate-pulse' />
                  <span className='font-display font-bold tracking-widest uppercase text-sm text-center'>
                    Designing your variation...
                  </span>
                </div>
              ) : activeArtifact?.status === 'error' ? (
                <div className='absolute inset-0 flex flex-col items-center justify-center p-16 text-red-500 gap-4 bg-background text-center'>
                  <span className='font-bold text-sm'>
                    {activeArtifact.styleName}
                  </span>
                </div>
              ) : activeArtifact?.html ? (
                <iframe
                  className='w-full h-full bg-white'
                  sandbox='allow-scripts allow-forms allow-modals allow-popups allow-presentation allow-same-origin'
                  srcDoc={activeArtifact.html}
                  title={activeArtifact.id}
                />
              ) : (
                <div className='absolute inset-0 flex items-center justify-center text-content-tertiary text-sm'>
                  Select a variation to preview
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <SideDrawer
        isOpen={drawerState.isOpen}
        onClose={() => setDrawerState(s => ({ ...s, isOpen: false }))}
        title={drawerState.title}
      >
        {drawerState.mode === 'code' && (
          <pre className='p-4 bg-zinc-900 overflow-auto text-sm text-white h-full'>
            <code>{drawerState.data}</code>
          </pre>
        )}
      </SideDrawer>
    </div>
  );
}
