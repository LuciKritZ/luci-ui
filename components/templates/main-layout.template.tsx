"use client";

import { MoonIcon, PanelLeftClose, PanelLeftOpen, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import React, { useState } from "react";

import { Button } from "@/components/atoms/index.atoms";
import { Sidebar } from "@/components/organisms/index.organisms";
import { useLayout } from "@/contexts/layout.context";
import { useMounted } from "@/hooks/index.hooks";

interface MainLayoutTemplateProps {
  children: React.ReactNode;
}

export function MainLayoutTemplate({ children }: MainLayoutTemplateProps) {
  const [expanded, setExpanded] = useState(false);
  const { headerActions, headerTitle } = useLayout();
  const { setTheme, theme } = useTheme();
  const mounted = useMounted();

  return (
    <div className='flex min-h-screen bg-background text-foreground overflow-hidden'>
      <Sidebar expanded={expanded} />
      <div className='flex-1 flex flex-col relative overflow-hidden'>
        {/* Top Navbar */}
        <header className='flex items-center px-6 border-b border-border min-h-[80px] shrink-0 bg-background z-nav'>
          <Button
            aria-label='Toggle Sidebar'
            className='mr-6 p-2 rounded-none border border-transparent text-content-secondary hover:text-content-primary hover:bg-surface hover:border-border transition-all duration-300 flex items-center justify-center'
            onClick={() => setExpanded(!expanded)}
            size='icon'
            variant='ghost'
          >
            {expanded ? (
              <PanelLeftClose className='h-5 w-5' />
            ) : (
              <PanelLeftOpen className='h-5 w-5' />
            )}
          </Button>
          <div className='flex items-center gap-4 flex-1'>
            <h2 className='font-display font-bold text-sm tracking-[0.2em] uppercase text-content-primary shrink-0'>
              {headerTitle}
            </h2>
            {headerActions}
          </div>
          <div className='flex items-center ml-auto shrink-0'>
            <Button
              aria-label={
                mounted && theme === "dark"
                  ? "Switch to Light Mode"
                  : "Switch to Dark Mode"
              }
              className='text-content-secondary hover:text-content-primary'
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              size='icon'
              variant='ghost'
            >
              {mounted && theme === "dark" ? (
                <SunIcon className='h-5 w-5' />
              ) : (
                <MoonIcon className='h-5 w-5' />
              )}
            </Button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className='flex-1 overflow-y-auto overflow-x-hidden'>
          {children}
        </main>
      </div>
    </div>
  );
}
