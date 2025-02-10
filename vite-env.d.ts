/// <reference types="vite/client" />

interface ImportMetaEnv {
  VITE_API_URL: string;  // Add your custom VITE_ variables here
  // Add more variables as needed
}

interface ImportMeta {
  env: ImportMetaEnv;
}
