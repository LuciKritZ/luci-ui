export interface Settings {
  apiKeys: {
    [provider: string]: {
      _id: string;
      createdAt?: Date;
      hasKey: boolean;
      meta?: { description?: string };
      priority: number;
      status: 'active' | 'exhausted';
    }[];
  };
  hasGeminiApiKey: boolean;
  theme: 'dark' | 'light' | 'system';
}
