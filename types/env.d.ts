declare namespace NodeJS {
  interface ProcessEnv {
    ENCRYPTION_KEY: string;
    ENVIRONMENT: 'local' | 'production' | 'staging';
    JWT_SECRET: string;
    MONGO_URI: string;
  }
}
