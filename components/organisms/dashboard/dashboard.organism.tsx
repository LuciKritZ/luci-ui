'use client';

import { motion } from 'framer-motion';

import { useProject } from '@/contexts/project.context';

import { DashboardEmptyState } from './dashboard-empty-state.molecule';
import { DashboardProjectCard } from './dashboard-project-card.molecule';

export function Dashboard() {
  const { projects } = useProject();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className='page-container'>
      {projects.length > 0 ? (
        <motion.div
          animate='show'
          className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
          initial='hidden'
          variants={container}
        >
          {projects.map(project => (
            <DashboardProjectCard
              key={project.id}
              project={project}
              variants={item}
            />
          ))}
        </motion.div>
      ) : (
        <DashboardEmptyState />
      )}
    </div>
  );
}
