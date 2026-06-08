"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

import { Wizard } from "@/components/organisms/index.organisms";
import { useProject } from "@/contexts/project.context";

export default function ProjectPage() {
  const { id } = useParams();
  const router = useRouter();
  const { currentProject, isLoading, projects, setCurrentProject } =
    useProject();

  useEffect(() => {
    if (isLoading) return;

    // If we're already on this project, do nothing
    if (currentProject?.id === id) return;

    const project = projects.find(p => p.id === id);
    if (project) {
      setCurrentProject(project);
    } else {
      // Not found, redirect back
      router.push("/");
    }
  }, [id, projects, currentProject, isLoading, setCurrentProject, router]);

  if (isLoading || !currentProject) {
    return (
      <div className='flex items-center justify-center h-[calc(100vh-80px)]'>
        <div className='animate-pulse text-content-tertiary text-sm font-display tracking-widest uppercase'>
          Loading Project...
        </div>
      </div>
    );
  }

  return <Wizard />;
}
