export interface Project {
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
