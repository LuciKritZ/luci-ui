'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

import { MainLayoutTemplate } from '@/components/templates/index.templates';
import { useAuth } from '@/contexts/auth.context';
import { DesignSystemProvider } from '@/contexts/design.context';
import { LayoutProvider } from '@/contexts/layout.context';
import { ProjectProvider } from '@/contexts/project.context';
import { SettingsProvider } from '@/contexts/settings.context';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isAuthLoading, router]);

  if (isAuthLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-[#09090b]'>
        <div className='h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent' />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <SettingsProvider>
      <DesignSystemProvider>
        <ProjectProvider>
          <LayoutProvider>
            <MainLayoutTemplate>{children}</MainLayoutTemplate>
          </LayoutProvider>
        </ProjectProvider>
      </DesignSystemProvider>
    </SettingsProvider>
  );
}
