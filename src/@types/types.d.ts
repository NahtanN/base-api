declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;
    PORT: number;
    APP_URL: string;
    DATABASE_USERNAME: string;
    DATABASE_PASSWORD: string;
    DATABASE_URL: string;
    DATABASE_SCHEMA: string;
    DATABASE_HOST: string;
    DATABASE_PORT: number;
  }
}
