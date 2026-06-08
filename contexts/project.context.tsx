"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

import { Project, ProjectState } from "@/types/project.types";

interface ProjectContextType extends ProjectState {
  addVersion: (projectId: string, code: string) => Promise<void>;
  createProject: (
    name: string,
    description: string,
    theme: string
  ) => Promise<Project>;
  currentProject: null | Project;
  deleteProject: (id: string) => Promise<void>;
  isLoading: boolean;
  projects: Project[];
  setCurrentProject: (project: null | Project) => void;
  setWizardStep: (step: WizardStep) => void;
  undoVersion: (projectId: string) => Promise<void>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  wizardStep: WizardStep;
}

type WizardStep = "build" | "idea" | "iterate" | "theme";

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<null | Project>(null);
  const [wizardStep, setWizardStep] = useState<WizardStep>("idea");
  const [isLoading, setIsLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects");
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const createProject = async (
    name: string,
    description: string,
    theme: string
  ): Promise<Project> => {
    const newProject = {
      createdAt: Date.now(),
      description,
      lastEdited: Date.now(),
      name,
      theme,
      updatedAt: Date.now(),
      versions: [],
    };

    const response = await fetch("/api/projects", {
      body: JSON.stringify(newProject),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });

    if (!response.ok) throw new Error("Failed to create project");

    const savedProject = await response.json();
    setProjects(prev => [savedProject, ...prev]);
    return savedProject;
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    const updatedData = { ...updates, updatedAt: Date.now() };

    // Optimistic update
    setProjects(prev =>
      prev.map(p => (p.id === id ? { ...p, ...updatedData } : p))
    );
    if (currentProject?.id === id) {
      setCurrentProject(prev => (prev ? { ...prev, ...updatedData } : null));
    }

    try {
      const response = await fetch(`/api/projects/${id}`, {
        body: JSON.stringify(updatedData),
        headers: { "Content-Type": "application/json" },
        method: "PATCH",
      });
      if (!response.ok) throw new Error("Failed to update project");
    } catch (error) {
      console.error(error);
      // Revert could be implemented here
    }
  };

  const deleteProject = async (id: string) => {
    // Optimistic update
    setProjects(prev => prev.filter(p => p.id !== id));
    if (currentProject?.id === id) {
      setCurrentProject(null);
    }

    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete project");
    } catch (error) {
      console.error(error);
    }
  };

  const addVersion = async (projectId: string, code: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    const updates = {
      lastEdited: Date.now(),
      updatedAt: Date.now(),
      versions: [...project.versions, code],
    };

    await updateProject(projectId, updates);
  };

  const undoVersion = async (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project || project.versions.length <= 1) return;

    const newVersions = [...project.versions];
    newVersions.pop();

    const updates = {
      lastEdited: Date.now(),
      updatedAt: Date.now(),
      versions: newVersions,
    };

    await updateProject(projectId, updates);
  };

  return (
    <ProjectContext.Provider
      value={{
        addVersion,
        createProject,
        currentProject,
        deleteProject,
        isLoading,
        projects,
        setCurrentProject,
        setWizardStep,
        undoVersion,
        updateProject,
        wizardStep,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return context;
}
