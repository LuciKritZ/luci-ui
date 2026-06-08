import { Project } from "@/types/project.types";

interface RecentActivityListProps {
  recentProjects: Project[];
}

export function RecentActivityList({
  recentProjects,
}: RecentActivityListProps) {
  return (
    <div className='space-y-4'>
      {recentProjects.map(project => (
        <div
          className='flex items-center justify-between py-4 border-b border-border/50 last:border-0'
          key={project.id}
        >
          <div className='flex items-center gap-4'>
            <div className='h-2 w-2 bg-brand' />
            <span className='font-display font-bold text-content-primary'>
              {project.name}
            </span>
          </div>
          <span className='font-mono text-xs text-content-tertiary'>
            {new Date(project.updatedAt).toLocaleDateString()}
          </span>
        </div>
      ))}
    </div>
  );
}
