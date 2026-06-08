"use client";

import { ActivityIcon, BarChart3Icon, FolderIcon } from "lucide-react";

import { useProject } from "@/contexts/project.context";

import { NoRecentActivity } from "./no-recent-activity.analytics-dashboard";
import { RecentActivityList } from "./recent-activity-list.analytics-dashboard";

export function AnalyticsDashboard() {
  const { projects } = useProject();

  const recentProjects = projects.slice(0, 3);

  return (
    <div className='page-container'>
      {/* Top Stats Row */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-12'>
        <div className='relative overflow-hidden bg-surface border border-border p-6'>
          <div className='absolute left-0 top-0 bottom-0 w-1 bg-brand' />
          <div className='flex items-center gap-4 mb-4'>
            <div className='h-10 w-10 rounded-none bg-background flex items-center justify-center border border-border'>
              <FolderIcon className='h-5 w-5 text-brand' />
            </div>
            <h2 className='text-sm font-display font-bold uppercase tracking-widest text-content-secondary'>
              Total Projects
            </h2>
          </div>
          <p className='text-5xl font-mono font-bold text-content-primary'>
            {projects.length}
          </p>
        </div>

        <div className='relative overflow-hidden bg-surface border border-border p-6'>
          <div className='absolute left-0 top-0 bottom-0 w-1 bg-border' />
          <div className='flex items-center gap-4 mb-4'>
            <div className='h-10 w-10 rounded-none bg-background flex items-center justify-center border border-border'>
              <ActivityIcon className='h-5 w-5 text-content-primary' />
            </div>
            <h2 className='text-sm font-display font-bold uppercase tracking-widest text-content-secondary'>
              System Health
            </h2>
          </div>
          <p className='text-5xl font-mono font-bold text-status-green'>
            99.9%
          </p>
        </div>

        <div className='relative overflow-hidden bg-surface border border-border p-6'>
          <div className='absolute left-0 top-0 bottom-0 w-1 bg-border' />
          <div className='flex items-center gap-4 mb-4'>
            <div className='h-10 w-10 rounded-none bg-background flex items-center justify-center border border-border'>
              <BarChart3Icon className='h-5 w-5 text-content-primary' />
            </div>
            <h2 className='text-sm font-display font-bold uppercase tracking-widest text-content-secondary'>
              API Usage
            </h2>
          </div>
          <p className='text-5xl font-mono font-bold text-content-primary'>
            1.2k<span className='text-xl text-content-tertiary'>/req</span>
          </p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className='relative overflow-hidden bg-surface border border-border p-8'>
        <h2 className='text-xl font-display font-bold uppercase tracking-widest text-content-primary mb-6 border-b border-border pb-4'>
          Recent Activity
        </h2>
        {recentProjects.length > 0 ? (
          <RecentActivityList recentProjects={recentProjects} />
        ) : (
          <NoRecentActivity />
        )}
      </div>
    </div>
  );
}
