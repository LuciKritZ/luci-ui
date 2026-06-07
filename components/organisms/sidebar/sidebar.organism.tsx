'use client';

import {
  BriefcaseIcon,
  FolderIcon,
  HomeIcon,
  LayoutTemplateIcon,
  LogOutIcon,
  PaletteIcon,
  PlusIcon,
  SettingsIcon,
} from 'lucide-react';
import { usePathname } from 'next/navigation';

import { useAuth } from '@/contexts/auth.context';
import { cn } from '@/utils/index.utils';

import { SidebarItem } from './sidebar-item.molecule';

interface SidebarProps {
  expanded: boolean;
}

export function Sidebar({ expanded }: SidebarProps) {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  if (!user) return null;

  const getActiveView = () => {
    if (pathname === '/') return 'dashboard';
    const views = [
      'projects',
      'templates',
      'themes',
      'manage',
      'settings',
      'new',
    ];
    for (const view of views) {
      if (pathname.includes(`/${view}`)) return view;
    }
    return 'dashboard';
  };

  const activeView = getActiveView();

  return (
    <aside
      aria-label='Main navigation'
      className={cn(
        'relative shrink-0 h-screen bg-surface border-r border-border flex flex-col transition-[width] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] z-nav',
        expanded ? 'w-[240px]' : 'w-[72px]'
      )}
    >
      {/* Logo container */}
      <div className='py-6 flex flex-col items-center justify-center border-b border-border min-h-[80px] overflow-hidden bg-background'>
        <div
          className={cn(
            'transition-all duration-300 flex items-center justify-center',
            expanded ? 'px-6 w-full justify-start gap-4' : 'px-0'
          )}
        >
          <div className='h-8 w-8 shrink-0 rounded-none bg-brand flex items-center justify-center'>
            <span className='font-display font-bold text-white text-lg leading-none'>
              L
            </span>
          </div>
          {expanded && (
            <span className='font-display font-black tracking-tighter text-content-primary text-xl uppercase whitespace-nowrap animate-in fade-in zoom-in duration-300'>
              LUCI UI
            </span>
          )}
        </div>
      </div>

      {/* Navigation areas */}
      <nav
        aria-label='App sections'
        className='flex-1 py-6 overflow-y-auto overflow-x-hidden space-y-2'
        role='navigation'
      >
        <SidebarItem
          active={activeView === 'new'}
          expanded={expanded}
          href='/new'
          icon={<PlusIcon className='h-5 w-5' />}
          id='nav-new'
          label='Create Project'
        />
        <SidebarItem
          active={activeView === 'dashboard'}
          expanded={expanded}
          href='/'
          icon={<HomeIcon className='h-5 w-5' />}
          id='nav-dashboard'
          label='Dashboard'
        />
        <SidebarItem
          active={activeView === 'projects'}
          expanded={expanded}
          href='/projects'
          icon={<FolderIcon className='h-5 w-5' />}
          id='nav-projects'
          label='Projects'
        />
        <SidebarItem
          active={activeView === 'templates'}
          expanded={expanded}
          href='/templates'
          icon={<LayoutTemplateIcon className='h-5 w-5' />}
          id='nav-templates'
          label='Templates'
        />
        <SidebarItem
          active={activeView === 'themes'}
          expanded={expanded}
          href='/themes'
          icon={<PaletteIcon className='h-5 w-5' />}
          id='nav-themes'
          label='Themes'
        />
        <SidebarItem
          active={activeView === 'manage'}
          expanded={expanded}
          href='/manage'
          icon={<BriefcaseIcon className='h-5 w-5' />}
          id='nav-manage'
          label='Action Definitions'
        />
        <SidebarItem
          active={activeView === 'settings'}
          expanded={expanded}
          href='/settings'
          icon={<SettingsIcon className='h-5 w-5' />}
          id='nav-settings'
          label='Settings'
        />
      </nav>

      {/* Sidebar Footer */}
      <div className='border-t border-border py-4 overflow-hidden space-y-2 bg-background'>
        <SidebarItem
          active={false}
          danger
          expanded={expanded}
          icon={<LogOutIcon className='h-5 w-5' />}
          id='nav-logout'
          label='Sign Out'
          onClick={logout}
        />
      </div>
    </aside>
  );
}
