'use client';

import React from 'react';

import { useProject } from '@/contexts/project.context';

import { BuildStep } from './steps/build.step';
import { IdeaStep } from './steps/idea.step';
import { IterateStep } from './steps/iterate.step';
import { ThemeStep } from './steps/theme.step';

export function Wizard() {
  const { wizardStep } = useProject();

  // Return IterateStep early to bypass the max-w-4xl constraint and progress bar.
  // This allows the Iterate step to use the full viewport width and height
  // for the sidebar and live preview canvas, identical to the Theme Generator UI.
  if (wizardStep === 'iterate') {
    return <IterateStep />;
  }

  return (
    <div className='page-container max-w-4xl'>
      <div className='w-full'>
        <div className='mb-12 flex items-center justify-between'>
          {['idea', 'theme', 'build', 'iterate'].map((step, i) => (
            <React.Fragment key={step}>
              <div className='flex flex-col items-center gap-2'>
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-none border text-xs font-display font-bold transition-all duration-300 ${
                    wizardStep === step
                      ? 'bg-brand text-white border-brand'
                      : 'bg-surface text-content-tertiary border-border'
                  }`}
                >
                  {i + 1}
                </div>
                <span
                  className={`text-[10px] font-bold uppercase tracking-widest mt-3 transition-colors duration-300 ${
                    wizardStep === step ? 'text-brand' : 'text-content-tertiary'
                  }`}
                >
                  {step}
                </span>
              </div>
              {i < 3 && (
                <div className='h-px flex-1 bg-border mx-4 mt-4 transition-colors duration-300' />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className='mt-8'>
          {wizardStep === 'idea' && <IdeaStep />}
          {wizardStep === 'theme' && <ThemeStep />}
          {wizardStep === 'build' && <BuildStep />}
        </div>
      </div>
    </div>
  );
}
