import { LayoutTemplateIcon } from "lucide-react";

import { HeaderManager } from "@/components/molecules/header-manager.molecule";

export function TemplatesPage() {
  return (
    <>
      <HeaderManager title='Templates' />
      <main className='py-6'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex flex-col items-center justify-center min-h-[50vh] border border-dashed border-border bg-surface/50 p-12 text-center'>
            <div className='mb-6 flex h-16 w-16 items-center justify-center rounded-none bg-background border border-border'>
              <LayoutTemplateIcon className='h-8 w-8 text-content-tertiary' />
            </div>
            <h2 className='mb-2 text-xl font-display font-bold uppercase tracking-widest text-content-primary'>
              Template Library
            </h2>
            <p className='max-w-md font-mono text-[11px] text-content-secondary mb-8 uppercase tracking-tighter'>
              We are currently curating the first batch of structural templates
              for atomic design systems.
            </p>
            <div className='inline-flex items-center justify-center border border-border bg-background px-6 py-3 font-display text-[10px] font-bold uppercase tracking-[0.2em] text-content-tertiary'>
              [ Coming Soon ]
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
