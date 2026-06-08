import type { Artifact } from "./index.types";

export interface Project {
  artifacts?: Artifact[];
  createdAt: number;
  description: string;
  id: string;
  lastEdited: number;
  name: string;
  theme: string;
  updatedAt: number;
  versions: string[]; // Array of code strings
}

export interface ProjectState {
  currentProject: null | Project;
  isLoading: boolean;
  projects: Project[];
}
