import { PaletteIcon } from "lucide-react";

export function NoThemeSelected() {
  return (
    <div className='h-full flex flex-col items-center justify-center text-center'>
      <div className='w-20 h-20 bg-surface border border-border rounded-3xl flex items-center justify-center mb-6'>
        <PaletteIcon className='w-10 h-10 text-border' />
      </div>
      <h2 className='text-xl font-display font-bold mb-2'>
        Select a theme to preview
      </h2>
      <p className='text-sm text-content-tertiary max-w-sm'>
        Explore your saved design systems and see them come to life in a fully
        rendered dashboard.
      </p>
    </div>
  );
}
