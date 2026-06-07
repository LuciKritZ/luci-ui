export * from './auth.types';
export * from './project.types';
export * from './settings.types';

export interface Artifact {
  html: string;
  id: string;
  status: 'complete' | 'error' | 'streaming';
  styleName: string;
}

export interface ComponentVariation {
  html: string;
  name: string;
}

export interface Session {
  artifacts: Artifact[];
  id: string;
  prompt: string;
  timestamp: number;
}
