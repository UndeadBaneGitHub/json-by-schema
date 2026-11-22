import React, { useState, useRef, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { JsonBySchema } from '../src';

const sampleSchema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  title: 'Application Config',
  type: 'object',
  required: ['serviceName', 'port'],
  properties: {
    serviceName: {
      type: 'string',
      description: 'Name of the service',
      minLength: 2,
    },
    port: {
      type: 'integer',
      description: 'Listening port',
      minimum: 1,
      maximum: 65535,
    },
    environment: {
      type: 'string',
      enum: ['development', 'staging', 'production'],
      description: 'Deployment environment',
    },
    enabled: {
      type: 'boolean',
      description: 'Whether the service is enabled',
    },
    tags: {
      type: 'array',
      description: 'Service tags',
      items: {
        type: 'string',
      },
    },
    database: {
      type: 'object',
      description: 'Database connection settings',
      properties: {
        host: { type: 'string' },
        port: { type: 'integer' },
        ssl: { type: 'boolean' },
      },
    },
  },
  patternProperties: {
    '^x-': {
      type: 'string',
      description: 'Custom extension header',
    },
  },
};

const initialConfig = {
  serviceName: 'my-service',
  port: 8080,
  environment: 'development',
  enabled: true,
  tags: ['api', 'v1'],
  database: {
    host: 'localhost',
    port: 5432,
    ssl: false,
  },
};

function DemoApp() {
  const [config, setConfig] = useState(initialConfig);
  const [path, setPath] = useState('');
  const [rightWidthPct, setRightWidthPct] = useState(33.33);
  const [topHeightPct, setTopHeightPct] = useState(50);
  const [dragging, setDragging] = useState(null); // 'horizontal' | 'vertical' | null
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('jbs-dark-mode');
    if (saved !== null) return saved === 'true';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const containerRef = useRef(null);
  const rightPaneRef = useRef(null);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('jbs-dark-mode', String(darkMode));
  }, [darkMode]);

  useEffect(() => {
    if (!dragging) return undefined;

    const handleMouseMove = (e) => {
      if (dragging === 'horizontal' && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const nextPct = ((rect.right - e.clientX) / rect.width) * 100;
        setRightWidthPct(Math.min(75, Math.max(15, nextPct)));
      } else if (dragging === 'vertical' && rightPaneRef.current) {
        const rect = rightPaneRef.current.getBoundingClientRect();
        const nextPct = ((e.clientY - rect.top) / rect.height) * 100;
        setTopHeightPct(Math.min(85, Math.max(15, nextPct)));
      }
    };

    const handleMouseUp = () => {
      setDragging(null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging]);

  return (
    <div
      ref={containerRef}
      className={`flex h-screen bg-[#f2f2f7] dark:bg-black text-black dark:text-white ${dragging ? 'select-none' : ''}`}
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Segoe UI", Roboto, sans-serif' }}
    >
      <div className="json-by-schema relative flex-1 min-w-0 overflow-auto bg-[#f2f2f7] dark:bg-black">
        <JsonBySchema
          schema={sampleSchema}
          config={config}
          path={path}
          onChange={(nextConfig) => setConfig(nextConfig)}
          onPathChange={(nextPath) => setPath(nextPath)}
        />
      </div>

      <div
        role="separator"
        aria-orientation="vertical"
        onMouseDown={() => setDragging('horizontal')}
        className={`w-[5px] cursor-col-resize flex-shrink-0 transition-colors ${
          dragging === 'horizontal'
            ? 'bg-[#007aff] dark:bg-[#0a84ff]'
            : 'bg-[#c6c6c8]/60 dark:bg-[#38383a] hover:bg-[#8e8e93]/50'
        }`}
      />

      <div
        ref={rightPaneRef}
        className="flex-shrink-0 flex flex-col h-full min-w-0 bg-[#f2f2f7] dark:bg-black"
        style={{ width: `${rightWidthPct}%` }}
      >
        <div
          className="min-h-0 p-4 overflow-auto"
          style={{ height: `${topHeightPct}%` }}
        >
          <h3 className="mt-0 mb-1.5 text-[15px] font-semibold tracking-tight">
            Generated JSON
          </h3>
          <div className="text-[12px] text-[#3c3c43]/60 dark:text-[#ebebf5]/60 mb-2.5">
            Current path: <code className="text-[#007aff] dark:text-[#0a84ff]">{path || '/'}</code>
          </div>
          <pre className="m-0 bg-white dark:bg-[#1c1c1e] border border-[#c6c6c8]/60 dark:border-[#38383a] rounded-xl p-3.5 text-[13px] overflow-auto">
            {JSON.stringify(config, null, 2)}
          </pre>
        </div>

        <div
          role="separator"
          aria-orientation="horizontal"
          onMouseDown={() => setDragging('vertical')}
          className={`h-[5px] cursor-row-resize flex-shrink-0 transition-colors ${
            dragging === 'vertical'
              ? 'bg-[#007aff] dark:bg-[#0a84ff]'
              : 'bg-[#c6c6c8]/60 dark:bg-[#38383a] hover:bg-[#8e8e93]/50'
          }`}
        />

        <div className="flex-1 min-h-0 p-4 pb-16 overflow-auto">
          <h3 className="mt-0 mb-2.5 text-[15px] font-semibold tracking-tight">
            JSON Schema
          </h3>
          <pre className="m-0 bg-white dark:bg-[#1c1c1e] border border-[#c6c6c8]/60 dark:border-[#38383a] rounded-xl p-3.5 text-[13px] overflow-auto">
            {JSON.stringify(sampleSchema, null, 2)}
          </pre>
        </div>
      </div>

      {/* Floating iOS-style Dark Mode Switch */}
      <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-3.5 py-2 rounded-full backdrop-blur-md bg-white/85 dark:bg-[#1c1c1e]/85 border border-black/10 dark:border-white/15 shadow-lg">
        <span className="text-[13px] font-medium text-[#3c3c43] dark:text-[#ebebf5]/80 select-none">
          {darkMode ? 'Dark' : 'Light'}
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={darkMode}
          aria-label="Toggle dark mode"
          onClick={() => setDarkMode((prev) => !prev)}
          className={`relative inline-flex h-[28px] w-[48px] flex-shrink-0 cursor-pointer rounded-full p-[2px] transition-colors duration-200 ease-in-out focus:outline-none ${
            darkMode ? 'bg-[#34c759]' : 'bg-[#e9e9ea]'
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-[24px] w-[24px] transform rounded-full bg-white shadow-md transition-transform duration-200 ease-in-out ${
              darkMode ? 'translate-x-[20px]' : 'translate-x-0'
            }`}
          />
        </button>
      </div>
    </div>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(<DemoApp />);
