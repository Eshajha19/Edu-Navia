import { defineConfig, loadEnv } from 'vite';
import { resolve } from 'path';
import { readdirSync } from 'fs';

// Automatically find all HTML files to build safely
const root = process.cwd();
const htmlFiles = readdirSync(root).filter(file => file.endsWith('.html'));
const inputMap = {};
htmlFiles.forEach(file => {
  inputMap[file.replace('.html', '')] = resolve(root, file);
});

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');

  const envWithProcess = {
    ...env,
    ...process.env
  };

  // On Render, VITE_API_URL should be empty to use relative paths (same domain)
  // For local dev with separate backend, use http://127.0.0.1:8000
  const apiUrl = mode === 'production' ? '' : 'http://127.0.0.1:8000';

  // Force empty API URL for production to ensure relative paths
  const finalApiUrl = mode === 'production' ? '' : (envWithProcess.VITE_API_URL || 'http://127.0.0.1:8000');

  return {
    define: {
      'import.meta.env.VITE_FIREBASE_API_KEY': JSON.stringify(envWithProcess.VITE_FIREBASE_API_KEY || ''),
      'import.meta.env.VITE_FIREBASE_AUTH_DOMAIN': JSON.stringify(envWithProcess.VITE_FIREBASE_AUTH_DOMAIN || ''),
      'import.meta.env.VITE_FIREBASE_PROJECT_ID': JSON.stringify(envWithProcess.VITE_FIREBASE_PROJECT_ID || ''),
      'import.meta.env.VITE_FIREBASE_STORAGE_BUCKET': JSON.stringify(envWithProcess.VITE_FIREBASE_STORAGE_BUCKET || ''),
      'import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID': JSON.stringify(envWithProcess.VITE_FIREBASE_MESSAGING_SENDER_ID || ''),
      'import.meta.env.VITE_FIREBASE_APP_ID': JSON.stringify(envWithProcess.VITE_FIREBASE_APP_ID || ''),
      'import.meta.env.VITE_API_URL': JSON.stringify(finalApiUrl)
    },
    server: {
      port: 3000,
      proxy: {
        '/recommendations': 'http://127.0.0.1:8000',
        '/predict': 'http://127.0.0.1:8000',
        '/chat': 'http://127.0.0.1:8000',
        '/register': 'http://127.0.0.1:8000',
        '/cutoff-predict': 'http://127.0.0.1:8000'
      }
    },
    build: {
      outDir: '../dist',
      rollupOptions: {
        input: inputMap
      }
    }
  };
});
