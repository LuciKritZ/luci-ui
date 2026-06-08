import { TrashIcon } from "lucide-react";

import { Button } from "@/components/atoms/index.atoms";
import { IDesignTheme, useDesignSystem } from "@/contexts/design.context";
import { cn } from "@/utils/index.utils";

interface ThemesListProps {
  activePreviewTheme: IDesignTheme | null;
  filteredThemes: IDesignTheme[];
  previewMode: "dark" | "light";
  setActivePreviewTheme: (theme: IDesignTheme) => void;
}

export function ThemesList({
  activePreviewTheme,
  filteredThemes,
  previewMode,
  setActivePreviewTheme,
}: ThemesListProps) {
  const { deleteTheme } = useDesignSystem();

  return (
    <div className='grid grid-cols-1 gap-4'>
      {filteredThemes.map(theme => {
        const colors = theme.colors?.[previewMode] || theme.colors?.dark;
        const currentColors = colors || {
          accent: "#3b82f6",
          background: "#ffffff",
          primary: "#18181b",
          surface: "#f9fafb",
        };
        return (
          <div
            className={cn(
              "group p-4 rounded-2xl border transition-all cursor-pointer",
              activePreviewTheme?.id === theme.id
                ? "bg-brand/5 border-brand/50 ring-1 ring-brand/50 shadow-xl shadow-brand/5"
                : "bg-surface border-border hover:border-content-tertiary/50"
            )}
            key={theme.id}
            onClick={() => setActivePreviewTheme(theme)}
          >
            <div className='flex items-center justify-between mb-4'>
              <span className='font-display font-bold text-sm'>
                {theme.name}
              </span>
              <div className='flex items-center gap-2'>
                <span className='text-[10px] text-content-tertiary uppercase font-black tracking-widest'>
                  {theme.animation}
                </span>
                <Button
                  className='opacity-0 group-hover:opacity-100 transition-opacity text-content-tertiary hover:text-destructive hover:bg-destructive/10'
                  onClick={e => {
                    e.stopPropagation();
                    deleteTheme(theme.id || theme._id || "");
                  }}
                  size='icon-xs'
                  variant='ghost'
                >
                  <TrashIcon className='w-3 h-3' />
                </Button>
              </div>
            </div>

            <div className='flex gap-1.5 mb-4'>
              <div
                className='flex-1 h-2 rounded-full'
                style={{ backgroundColor: currentColors.primary }}
              />
              <div
                className='flex-1 h-2 rounded-full'
                style={{ backgroundColor: currentColors.accent }}
              />
              <div
                className='flex-1 h-2 rounded-full'
                style={{ backgroundColor: currentColors.surface }}
              />
              <div
                className='flex-1 h-2 rounded-full'
                style={{ backgroundColor: currentColors.background }}
              />
            </div>

            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <span className='text-[10px] font-bold text-content-tertiary'>
                  {theme.fontDisplay}
                </span>
              </div>
              <div className='text-[10px] font-medium text-content-tertiary bg-white/5 px-2 py-0.5 rounded'>
                R: {theme.radius}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
