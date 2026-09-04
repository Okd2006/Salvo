import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

/**
 * Custom Vite Plugin to mount the Salvo API handler directly in dev mode.
 * Guarantees that /api/* requests work instantaneously without requiring
 * a secondary backend process or risking CORS / port conflicts.
 */
function salvoApiPlugin(): Plugin {
  return {
    name: 'salvo-api-dev-server',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url || '';
        if (url.startsWith('/api/') || url === '/api') {
          try {
            const { handleApiRequest } = await import('./src/api/handler.js');
            await handleApiRequest(req, res);
          } catch (err: any) {
            console.error('[Vite Dev API Middleware Error]:', err);
            if (!res.headersSent) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err?.message || 'API Internal Server Error' }));
            }
          }
          return;
        }
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), salvoApiPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: false,
  },
});
