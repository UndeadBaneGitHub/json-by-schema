import { defineConfig, transformWithOxc } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const jsxInJsPlugin = {
  name: 'jsx-in-js',
  enforce: 'pre',
  async transform(code, id) {
    if (!id.includes('node_modules') && /\.js$/.test(id) && code.includes('<')) {
      return transformWithOxc(code, id, {
        lang: 'jsx',
        jsx: { runtime: 'automatic' },
      });
    }
    return null;
  },
};

export default defineConfig(({ command, mode }) => {
  const isDemoBuild = command === 'build' && mode === 'demo';
  const isLibBuild = command === 'build' && !isDemoBuild;

  return {
    base: isDemoBuild ? process.env.VITE_BASE_PATH || './' : '/',
    plugins: [tailwindcss(), jsxInJsPlugin, react()],
    optimizeDeps: {
      rolldownOptions: {
        moduleTypes: {
          '.js': 'jsx',
        },
      },
    },
    ...(isLibBuild
      ? {
          build: {
            outDir: 'dist',
            lib: {
              entry: 'src/index.js',
              name: 'JsonBySchema',
              fileName: (format) =>
                format === 'cjs' ? 'json-by-schema.cjs' : 'json-by-schema.js',
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
    ...(isDemoBuild
      ? {
          build: {
            outDir: 'dist-demo',
            emptyOutDir: true,
          },
        }
      : {}),
    test: {
      environment: 'jsdom',
      globals: true,
      exclude: ['e2e/**', 'node_modules/**'],
    },
  };
});
