import { DashboardPreview } from '@/components/molecules/dashboard-preview.molecule';
import { IDesignTheme } from '@/contexts/design.context';

interface ThemePreviewCanvasProps {
  activePreviewTheme: IDesignTheme;
  previewMode: 'dark' | 'light';
}

export function ThemePreviewCanvas({
  activePreviewTheme,
  previewMode,
}: ThemePreviewCanvasProps) {
  return (
    <div className='max-w-6xl mx-auto'>
      <div className='flex items-center justify-between mb-10'>
        <div className='flex items-center gap-6'>
          <div
            className='w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black text-white shadow-2xl'
            style={{
              backgroundColor:
                activePreviewTheme.colors?.[previewMode]?.primary ||
                activePreviewTheme.colors?.dark?.primary ||
                '#18181b',
              fontFamily: activePreviewTheme.fontDisplay,
            }}
          >
            {activePreviewTheme.name?.[0] || 'T'}
          </div>
          <div>
            <h2 className='text-2xl font-display font-black tracking-tighter uppercase'>
              {activePreviewTheme.name}
            </h2>
            <p className='text-sm text-content-tertiary'>
              {activePreviewTheme.description || 'Custom aesthetic system.'}
            </p>
          </div>
        </div>

        <div className='flex items-center gap-6'>
          <div className='flex gap-3 h-8'>
            <div className='flex-center px-4 py-2 rounded-xl bg-surface border border-border text-center flex text-xs'>
              <div className='text-content-tertiary uppercase font-bold'>
                Radius:&nbsp;
              </div>
              <div className='font-bold'>{activePreviewTheme.radius}</div>
            </div>
            <div className='flex-center px-4 py-2 rounded-xl bg-surface border border-border text-center flex text-xs'>
              <div className='text-content-tertiary uppercase font-bold'>
                Motion:&nbsp;
              </div>
              <div className='font-bold capitalize'>
                {activePreviewTheme.animation}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='relative group'>
        <div className='absolute -inset-1 bg-linear-to-r from-brand/20 to-accent/20 rounded-[calc(var(--preview-radius)+4px)] blur opacity-25'></div>
        <div className='relative shadow-2xl'>
          <DashboardPreview
            initialMode={previewMode}
            theme={activePreviewTheme}
          />
        </div>
      </div>
    </div>
  );
}
