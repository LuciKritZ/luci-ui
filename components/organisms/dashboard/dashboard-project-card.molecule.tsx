"use client";

import { motion } from "framer-motion";
import { Variants } from "framer-motion";
import { ExternalLinkIcon, Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

import { Button } from "@/components/atoms/index.atoms";
import { ConfirmationDialog } from "@/components/molecules/index.molecules";
import { useProject } from "@/contexts/project.context";
import { Project } from "@/types/project.types";

interface DashboardProjectCardProps {
  project: Project;
  variants: Variants;
}

export function DashboardProjectCard({
  project,
  variants,
}: DashboardProjectCardProps) {
  const router = useRouter();
  const { deleteProject, setCurrentProject, setWizardStep } = useProject();

  const handleResume = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentProject(project);
    // Based on whether it has a theme or versions, we could set the step, but for now we resume to the wizard
    if (
      (project.versions && project.versions.length > 0) ||
      (project.artifacts && project.artifacts.length > 0)
    ) {
      setWizardStep("iterate");
    } else if (project.theme) {
      setWizardStep("build");
    } else {
      setWizardStep("theme");
    }
    router.push(`/project/${project.id}`);
  };

  const handleDelete = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    deleteProject(project.id);
  };

  return (
    <motion.div
      className='group brand-border !border-l-4 !border-l-brand p-6 bg-surface hover:bg-background transition-all duration-300 flex flex-col min-h-[200px] cursor-pointer'
      onClick={handleResume}
      variants={variants}
    >
      <div className='brand-glow' />

      <div className='relative z-10 flex items-start justify-between mb-8'>
        <span className='font-display text-[10px] md:text-xs text-content-tertiary uppercase tracking-[0.1em]'>
          {project.id.slice(0, 8).toUpperCase()}
        </span>
        <span className='font-display text-[10px] md:text-xs text-content-tertiary uppercase tracking-[0.1em] opacity-50 group-hover:opacity-100 transition-opacity'>
          {new Date(project.updatedAt).toLocaleDateString()}
        </span>
      </div>

      <div className='relative z-10 mb-6'>
        <h3 className='text-3xl md:text-4xl lg:text-5xl font-black text-content-primary tracking-tighter leading-none mb-2 line-clamp-1'>
          {project.name}
        </h3>
      </div>

      <div className='relative z-10 mt-auto flex items-end justify-between'>
        <p className='font-display text-xs text-content-secondary line-clamp-2 max-w-[75%]'>
          {project.description}
        </p>

        <div className='flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0'>
          <Button
            className='h-8 w-8 p-0 bg-transparent border-border hover:bg-brand hover:text-white rounded-none hover:border-brand transition-colors'
            onClick={handleResume}
            variant='outline'
          >
            <ExternalLinkIcon className='h-3 w-3' />
          </Button>
          <div
            className='flex items-center space-x-2'
            onClick={e => e.stopPropagation()}
          >
            <ConfirmationDialog
              description={`Are you sure you want to delete '${project.name}'? This action cannot be undone.`}
              onConfirm={handleDelete}
              title='Delete Project?'
              trigger={
                <Button
                  className='h-8 w-8 p-0 flex items-center justify-center border border-border hover:bg-destructive hover:text-white rounded-none hover:border-destructive transition-colors text-content-secondary'
                  onClick={e => e.stopPropagation()}
                  variant='outline'
                >
                  <Trash2Icon className='h-3 w-3' />
                </Button>
              }
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
