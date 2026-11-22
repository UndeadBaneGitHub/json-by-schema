import React, { useState, useRef, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { JsonBySchema, THEME_PRESETS } from '../src';

const sampleSchema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  title: 'Comprehensive Schema Example',
  type: 'object',
  required: ['serviceName', 'port', 'enabled'],
  properties: {
    serviceName: {
      type: 'string',
      description: 'String field (minLength: 2, pattern)',
      minLength: 2,
      pattern: '^[a-z0-9-]+$',
    },
    port: {
      type: 'integer',
      description: 'Integer field (1 - 65535)',
      minimum: 1,
      maximum: 65535,
    },
    timeoutSeconds: {
      type: 'number',
      description: 'Number (float) field',
      minimum: 0.1,
      maximum: 300,
    },
    environment: {
      type: 'string',
      enum: ['development', 'staging', 'production'],
      description: 'Enum field',
    },
    enabled: {
      type: 'boolean',
      description: 'Boolean field',
    },
    nullableMarker: {
      type: 'null',
      description: 'Null type field',
    },
    tags: {
      type: 'array',
      description: 'Array of strings (uniqueItems)',
      uniqueItems: true,
      items: {
        type: 'string',
      },
    },
    scores: {
      type: 'array',
      description: 'Array of numbers',
      items: {
        type: 'number',
      },
    },
    endpoints: {
      type: 'array',
      description: 'Array of objects',
      minItems: 1,
      items: {
        type: 'object',
        required: ['url', 'method'],
        properties: {
          url: { type: 'string' },
          method: { type: 'string', enum: ['GET', 'POST', 'PUT', 'DELETE'] },
          retries: { type: 'integer', minimum: 0 },
        },
      },
    },
    coordinateTuple: {
      type: 'array',
      description: 'Tuple array (fixed positional items)',
      items: [
        { type: 'string', title: 'Label' },
        { type: 'number', title: 'Latitude' },
        { type: 'number', title: 'Longitude' },
      ],
    },
    database: {
      type: 'object',
      description: 'Nested object',
      properties: {
        host: { type: 'string' },
        port: { type: 'integer' },
        ssl: { type: 'boolean' },
      },
    },
    auth: {
      description: 'oneOf schema choice',
      oneOf: [
        {
          title: 'API Key',
          type: 'object',
          required: ['apiKey'],
          properties: {
            apiKey: { type: 'string' },
          },
        },
        {
          title: 'Basic Auth',
          type: 'object',
          required: ['username', 'password'],
          properties: {
            username: { type: 'string' },
            password: { type: 'string' },
          },
        },
      ],
    },
    notificationTarget: {
      description: 'anyOf schema choice',
      anyOf: [
        {
          title: 'Email Address',
          type: 'string',
        },
        {
          title: 'Webhook',
          type: 'object',
          properties: {
            webhookUrl: { type: 'string' },
            secret: { type: 'string' },
          },
        },
      ],
    },
    metadata: {
      description: 'allOf composed object',
      allOf: [
        {
          type: 'object',
          properties: {
            owner: { type: 'string' },
          },
        },
        {
          type: 'object',
          properties: {
            version: { type: 'integer' },
          },
        },
      ],
    },
  },
  patternProperties: {
    '^x-': {
      type: 'string',
      description: 'Pattern property (^x-)',
    },
  },
};

const initialConfig = {
  serviceName: 'my-service',
  port: 8080,
  timeoutSeconds: 12.5,
  environment: 'development',
  enabled: true,
  nullableMarker: null,
  tags: ['api', 'v1'],
  scores: [0.95, 1.5],
  endpoints: [
    {
      url: 'https://api.example.com/health',
      method: 'GET',
      retries: 3,
    },
  ],
  coordinateTuple: ['HQ', 52.52, 13.405],
  database: {
    host: 'localhost',
    port: 5432,
    ssl: false,
  },
  auth: {
    apiKey: 'secret-key-123',
  },
  notificationTarget: 'alerts@example.com',
  metadata: {
    owner: 'platform-team',
    version: 1,
  },
  'x-custom-header': 'enabled',
};

const PRESET_LABELS = {
  ios: 'iOS',
  nomad: 'Nomad',
  github: 'GitHub',
  kubernetes: 'K8s',
  swagger: 'Swagger',
};

const JSON_TOKEN_REGEX =
  /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g;

function HighlightedJson({ data }) {
  const text = JSON.stringify(data, null, 2) || '';
  const parts = [];
  let lastIndex = 0;
  let match;

  JSON_TOKEN_REGEX.lastIndex = 0;
  while ((match = JSON_TOKEN_REGEX.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(
        <span key={`p-${lastIndex}`} className="text-[#6e7781] dark:text-[#8b949e]">
          {text.slice(lastIndex, match.index)}
        </span>,
      );
    }

    const token = match[0];
    let cls = 'text-[#0550ae] dark:text-[#79c0ff]'; // number
    if (token.startsWith('"')) {
      if (token.endsWith(':')) {
        cls = 'text-[#0550ae] dark:text-[#79c0ff]'; // key
      } else {
        cls = 'text-[#116329] dark:text-[#a5d6ff]'; // string
      }
    } else if (/true|false/.test(token)) {
      cls = 'text-[#8250df] dark:text-[#d2a8ff]'; // boolean
    } else if (token === 'null') {
      cls = 'text-[#cf222e] dark:text-[#ff7b72]'; // null
    }

    parts.push(
      <span key={`t-${match.index}`} className={cls}>
        {token}
      </span>,
    );
    lastIndex = JSON_TOKEN_REGEX.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(
      <span key={`p-${lastIndex}`} className="text-[#6e7781] dark:text-[#8b949e]">
        {text.slice(lastIndex)}
      </span>,
    );
  }

  return <>{parts}</>;
}

function DemoApp() {
  const [savedConfig, setSavedConfig] = useState(initialConfig);
  const [draftConfig, setDraftConfig] = useState(initialConfig);
  const [editorKey, setEditorKey] = useState(0);
  const [path, setPath] = useState('');
  const [rightWidthPct, setRightWidthPct] = useState(33.33);
  const [topHeightPct, setTopHeightPct] = useState(50);
  const [dragging, setDragging] = useState(null); // 'horizontal' | 'vertical' | null
  const [themePreset, setThemePreset] = useState(
    () => localStorage.getItem('jbs-theme-preset') || 'ios',
  );
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('jbs-dark-mode');
    if (saved !== null) return saved === 'true';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [copied, setCopied] = useState(false);
  const copyTimeoutRef = useRef(null);

  const handleCopyJson = async () => {
    const jsonText = JSON.stringify(draftConfig, null, 2);
    try {
      await navigator.clipboard.writeText(jsonText);
      setCopied(true);
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
      copyTimeoutRef.current = setTimeout(() => setCopied(false), 1800);
    } catch {
      // Fallback if clipboard API is unavailable
    }
  };

  const hasChanges = JSON.stringify(draftConfig) !== JSON.stringify(savedConfig);

  const handleGlobalSave = () => {
    setSavedConfig(draftConfig);
  };

  const handleGlobalRevert = () => {
    setDraftConfig(savedConfig);
    setEditorKey((k) => k + 1);
  };

  const containerRef = useRef(null);
  const rightPaneRef = useRef(null);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('jbs-dark-mode', String(darkMode));
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('jbs-theme-preset', themePreset);
  }, [themePreset]);

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
      className={`flex flex-col h-screen bg-[#f2f2f7] dark:bg-black text-black dark:text-white ${dragging ? 'select-none' : ''}`}
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Segoe UI", Roboto, sans-serif' }}
    >
      {/* Top Bar */}
      <header className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-white dark:bg-[#1c1c1e] border-b border-[#c6c6c8]/60 dark:border-[#38383a] flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <span className="text-[15px] font-semibold tracking-tight">
            json-by-schema
          </span>
          {hasChanges && (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#ff9500]/15 text-[#c97600] dark:bg-[#ff9f0a]/20 dark:text-[#ffb340]">
              Unsaved changes
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-full bg-[#767680]/15 dark:bg-[#767680]/25 p-0.5">
            {THEME_PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setThemePreset(preset)}
                className={`px-2.5 py-1 rounded-full text-[12px] font-medium capitalize transition-colors cursor-pointer ${
                  themePreset === preset
                    ? 'bg-white dark:bg-[#3a3a3c] text-black dark:text-white shadow-sm'
                    : 'text-[#3c3c43]/70 dark:text-[#ebebf5]/60 hover:text-black dark:hover:text-white'
                }`}
              >
                {PRESET_LABELS[preset] || preset}
              </button>
            ))}
          </div>

          <div className="w-px h-5 bg-black/10 dark:bg-white/15" />

          <div className="flex items-center gap-2">
            <span className="text-[#3c3c43] dark:text-[#ebebf5]/80 flex items-center" aria-hidden="true">
              {darkMode ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              )}
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={darkMode}
              aria-label="Toggle dark mode"
              onClick={() => setDarkMode((prev) => !prev)}
              className={`relative inline-flex h-[24px] w-[42px] flex-shrink-0 cursor-pointer rounded-full p-[2px] transition-colors duration-200 ease-in-out focus:outline-none ${
                darkMode ? 'bg-[#34c759]' : 'bg-[#e9e9ea]'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-[20px] w-[20px] transform rounded-full bg-white shadow-md transition-transform duration-200 ease-in-out ${
                  darkMode ? 'translate-x-[18px]' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="w-px h-5 bg-black/10 dark:bg-white/15" />

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={!hasChanges}
              onClick={handleGlobalRevert}
              className={`px-3 py-1.5 rounded-lg text-[13px] font-medium border transition-colors ${
                hasChanges
                  ? 'border-[#c6c6c8] dark:border-[#38383a] text-black dark:text-white hover:bg-[#f2f2f7] dark:hover:bg-[#2c2c2e] cursor-pointer'
                  : 'border-transparent text-[#8e8e93] opacity-50 cursor-not-allowed'
              }`}
            >
              Revert changes
            </button>
            <button
              type="button"
              disabled={!hasChanges}
              onClick={handleGlobalSave}
              className={`px-3.5 py-1.5 rounded-lg text-[13px] font-medium transition-opacity ${
                hasChanges
                  ? 'bg-[#007aff] dark:bg-[#0a84ff] text-white cursor-pointer hover:opacity-90'
                  : 'bg-[#8e8e93]/20 text-[#8e8e93] cursor-not-allowed'
              }`}
            >
              Save
            </button>
          </div>
        </div>
      </header>

      <div ref={containerRef} className="flex flex-1 min-h-0">
        <div className="json-by-schema relative flex-1 min-w-0 overflow-auto bg-[#f2f2f7] dark:bg-black">
          <JsonBySchema
            key={editorKey}
            schema={sampleSchema}
            config={savedConfig}
            path={path}
            theme={themePreset}
            darkMode={darkMode}
            onChange={(nextConfig) => setDraftConfig(nextConfig)}
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
            className="min-h-0 p-4 flex flex-col"
            style={{ height: `${topHeightPct}%` }}
          >
            <h3 className="mt-0 mb-1.5 text-[15px] font-semibold tracking-tight flex-shrink-0">
              Generated JSON
            </h3>
            <div className="text-[12px] text-[#3c3c43]/60 dark:text-[#ebebf5]/60 mb-2.5 flex-shrink-0">
              Current path: <code className="text-[#007aff] dark:text-[#0a84ff]">{path || '/'}</code>
            </div>
            <div className="relative flex-1 min-h-0">
              <pre className="m-0 h-full bg-white dark:bg-[#1c1c1e] border border-[#c6c6c8]/60 dark:border-[#38383a] rounded-xl p-3.5 pb-12 text-[13px] overflow-auto">
                <HighlightedJson data={draftConfig} />
              </pre>
              <button
                type="button"
                onClick={handleCopyJson}
                className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium backdrop-blur-md bg-[#f2f2f7]/90 dark:bg-[#2c2c2e]/90 border border-[#c6c6c8]/60 dark:border-[#38383a] text-black dark:text-white shadow-sm hover:bg-[#e5e5ea] dark:hover:bg-[#3a3a3c] cursor-pointer transition-colors"
              >
                {copied ? (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#34c759" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
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

          <div className="flex-1 min-h-0 p-4 overflow-auto">
            <h3 className="mt-0 mb-2.5 text-[15px] font-semibold tracking-tight">
              JSON Schema
            </h3>
            <pre className="m-0 bg-white dark:bg-[#1c1c1e] border border-[#c6c6c8]/60 dark:border-[#38383a] rounded-xl p-3.5 text-[13px] overflow-auto">
              {JSON.stringify(sampleSchema, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(<DemoApp />);
