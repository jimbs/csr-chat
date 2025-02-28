import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://api.karera.com/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        configure: (proxy, options) => {
          // Add custom middleware logic here
          proxy.on('proxyReq', (proxyReq, req, res) => {
            // Modify request headers, etc.
            proxyReq.setHeader('x-custom-header', 'custom-value');
          });
          
          proxy.on('proxyRes', (proxyRes, req, res) => {
            // Handle response
            return { test: "test"}
          });
        }
      }
    }
  },
  ssr: {
    noExternal: ['react-router-dom']
  }
});