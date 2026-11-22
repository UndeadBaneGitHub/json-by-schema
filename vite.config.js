import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => ({
  plugins: [react()],
  esbuild: {
    loader: 'jsx',
    include: /\.(js|jsx)$/,
    exclude: /node_modules/,
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
  ...(command === 'build'
    ? {
        build: {
          lib: {
            entry: 'src/index.js',
            name: 'JsonBySchema',
            fileName: (format) => (format === 'cjs' ? 'json-by-schema.cjs' : 'json-by-schema.js'),
            formats: ['es', 'cjs'],
          },
          rollupOptions: {
            external: ['react', 'react-dom', 'react/jsx-runtime'],
            output: {
              globals: {
                react: 'React',
                'react-dom': 'ReactDOM',
              },
            },
          },
        },
      }
    : {}),
  test: {
    environment: 'jsdom',
    globals: true,
    exclude: ['e2e/**', 'node_modules/**'],
  },
}));
