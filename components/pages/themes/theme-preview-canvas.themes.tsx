"use client";

import { CheckIcon, CopyIcon } from "lucide-react";
import { useState } from "react";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/atoms/index.atoms";
import { DashboardPreview } from "@/components/molecules/dashboard-preview.molecule";
import { IDesignTheme } from "@/contexts/design.context";
import { generateThemeCss } from "@/utils/theme-css.utils";

interface ThemePreviewCanvasProps {
  activePreviewTheme: IDesignTheme;
  previewMode: "dark" | "light";
}

export function ThemePreviewCanvas({
  activePreviewTheme,
  previewMode,
}: ThemePreviewCanvasProps) {
  const [copiedCss, setCopiedCss] = useState(false);

  const handleCopyCss = async () => {
    try {
      const css = generateThemeCss(activePreviewTheme);
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(css);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = css;
        textArea.style.position = "absolute";
        textArea.style.left = "-999999px";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        textArea.remove();
      }
      setCopiedCss(true);
      setTimeout(() => setCopiedCss(false), 2000);
    } catch (err) {
      console.error("Failed to copy CSS", err);
    }
  };

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
                "#18181b",
              fontFamily: activePreviewTheme.fontDisplay,
            }}
          >
            {activePreviewTheme.name?.[0] || "T"}
          </div>
          <div>
            <h2 className='text-2xl font-display font-black tracking-tighter uppercase'>
              {activePreviewTheme.name}
            </h2>
            <p className='text-sm text-content-tertiary'>
              {activePreviewTheme.description || "Custom aesthetic system."}
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
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  className='h-8 px-4 rounded-xl text-xs font-bold gap-2'
                  variant='outline'
                >
                  <CopyIcon className='w-3.5 h-3.5' />
                  Export CSS
                </Button>
              </DialogTrigger>
              <DialogContent className='max-w-3xl'>
                <DialogHeader>
                  <DialogTitle>Export Theme CSS</DialogTitle>
                  <DialogDescription className='sr-only'>
                    CSS variables for the generated theme.
                  </DialogDescription>
                </DialogHeader>
                <div className='bg-surface border border-border p-4 rounded-xl overflow-x-auto text-xs font-mono h-[60vh] overflow-y-auto whitespace-pre select-all'>
                  {generateThemeCss(activePreviewTheme)}
                </div>
                <DialogFooter>
                  <Button onClick={handleCopyCss} className='gap-2'>
                    {copiedCss ? (
                      <>
                        <CheckIcon className='w-4 h-4 text-green-500' />
                        Copied
                      </>
                    ) : (
                      <>
                        <CopyIcon className='w-4 h-4' />
                        Copy to Clipboard
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
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
