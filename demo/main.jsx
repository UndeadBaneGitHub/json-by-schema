import React, { useState, useRef, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { yaml } from '@codemirror/lang-yaml';
import { Select } from '@base-ui/react/select';
import { Switch } from '@base-ui/react/switch';
import {
  JsonBySchema,
  THEME_PRESETS,
  SUPPORTED_FORMATS,
  parseStructuredValue,
  stringifyStructuredValue,
} from '../src';

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
    flexibleValue: {
      type: ['string', 'number', 'null'],
      description: 'Multi-type field (type as array)',
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
  flexibleValue: 'hello',
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

const FORMAT_LABELS = {
  json: 'JSON',
  yaml: 'YAML',
};

function DemoApp() {
  const [mode, setMode] = useState(
    () => localStorage.getItem('jbs-format-mode') || 'json',
  );
  const [activeSchema, setActiveSchema] = useState(sampleSchema);
  const [schemaText, setSchemaText] = useState(() =>
    stringifyStructuredValue(
      sampleSchema,
      localStorage.getItem('jbs-format-mode') || 'json',
    ),
  );
  const [schemaError, setSchemaError] = useState(null);
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

  const handleModeChange = (nextMode) => {
    if (!nextMode || nextMode === mode) return;
    setMode(nextMode);
    localStorage.setItem('jbs-format-mode', nextMode);
    setSchemaError(null);
    setSchemaText(stringifyStructuredValue(activeSchema, nextMode));
  };

  const handleCopyJson = async () => {
    const formattedText = stringifyStructuredValue(draftConfig, mode);
    try {
      await navigator.clipboard.writeText(formattedText);
      setCopied(true);
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
      copyTimeoutRef.current = setTimeout(() => setCopied(false), 1800);
    } catch {
      // Fallback if clipboard API is unavailable
    }
  };

  const isSchemaDirty =
    schemaText !== stringifyStructuredValue(activeSchema, mode);

  const handleSchemaTextChange = (nextText) => {
    setSchemaText(nextText);
    try {
      const parsed = parseStructuredValue(nextText, mode);
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        setSchemaError(
          `Schema must be a ${mode.toUpperCase()} object`,
        );
      } else {
        setSchemaError(null);
      }
    } catch (err) {
      setSchemaError(err.message);
    }
  };

  const handleUpdateSchema = () => {
    try {
      const parsed = parseStructuredValue(schemaText, mode);
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        setSchemaError(
          `Schema must be a ${mode.toUpperCase()} object`,
        );
        return;
      }
      setSchemaError(null);
      setActiveSchema(parsed);
      setSchemaText(stringifyStructuredValue(parsed, mode));
      runWithLoadingOverlay(() => {
        setSavedConfig(draftConfig);
        setPath('');
        setEditorKey((k) => k + 1);
      });
    } catch (err) {
      setSchemaError(err.message);
    }
  };

  const [isUpdating, setIsUpdating] = useState(false);

  const runWithLoadingOverlay = (fn) => {
    setIsUpdating(true);
    window.requestAnimationFrame(() => {
      fn();
      setTimeout(() => {
        setIsUpdating(false);
      }, 200);
    });
  };

  const hasChanges = JSON.stringify(draftConfig) !== JSON.stringify(savedConfig);

  const handleGlobalSave = () => {
    runWithLoadingOverlay(() => {
      setSavedConfig(draftConfig);
    });
  };

  const handleGlobalRevert = () => {
    runWithLoadingOverlay(() => {
      setDraftConfig(savedConfig);
      setEditorKey((k) => k + 1);
    });
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
    window.ace = {
      edit: (name) => {
        if (name === 'demo-output-json') {
          return {
            getValue: () => stringifyStructuredValue(draftConfig, mode),
          };
        }
        if (name === 'demo-schema-editor') {
          return {
            getValue: () => schemaText,
            setValue: (nextVal) => handleSchemaTextChange(nextVal),
          };
        }
        return null;
      },
    };
  }, [draftConfig, schemaText, mode]);

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
        <div className="flex items-center gap-3">
          <span className="text-[15px] font-semibold tracking-tight">
            json-by-schema
          </span>
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
          {hasChanges && (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#ff9500]/15 text-[#c97600] dark:bg-[#ff9f0a]/20 dark:text-[#ffb340]">
              Unsaved changes
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-medium text-[#3c3c43]/80 dark:text-[#ebebf5]/70">
              Style
            </span>
            <Select.Root
              items={PRESET_LABELS}
              value={themePreset}
              onValueChange={(nextPreset) => {
                if (nextPreset) setThemePreset(nextPreset);
              }}
            >
              <Select.Trigger
                aria-label="Style"
                className="inline-flex items-center justify-between gap-2 min-w-[110px] px-3 py-1 rounded-lg text-[12px] font-medium bg-[#767680]/15 dark:bg-[#767680]/25 text-black dark:text-white hover:bg-[#767680]/22 dark:hover:bg-[#767680]/35 transition-colors cursor-pointer outline-none"
              >
                <Select.Value />
                <Select.Icon className="text-[#3c3c43]/70 dark:text-[#ebebf5]/60 flex items-center">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </Select.Icon>
              </Select.Trigger>
              <Select.Portal>
                <Select.Positioner sideOffset={6} className="z-[110]">
                  <Select.Popup className="min-w-[130px] p-1 rounded-xl bg-white/95 dark:bg-[#2c2c2e]/95 backdrop-blur-md border border-[#c6c6c8]/60 dark:border-[#38383a] shadow-xl outline-none">
                    <Select.List>
                      {THEME_PRESETS.map((preset) => (
                        <Select.Item
                          key={preset}
                          value={preset}
                          className="relative flex items-center pl-7 pr-3 py-1.5 rounded-lg text-[13px] font-medium text-black dark:text-white select-none cursor-pointer outline-none data-[highlighted]:bg-[#007aff] dark:data-[highlighted]:bg-[#0a84ff] data-[highlighted]:text-white"
                        >
                          <Select.ItemIndicator className="absolute left-2 inline-flex items-center">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </Select.ItemIndicator>
                          <Select.ItemText>
                            {PRESET_LABELS[preset] || preset}
                          </Select.ItemText>
                        </Select.Item>
                      ))}
                    </Select.List>
                  </Select.Popup>
                </Select.Positioner>
              </Select.Portal>
            </Select.Root>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[12px] font-medium text-[#3c3c43]/80 dark:text-[#ebebf5]/70">
              Mode
            </span>
            <Select.Root
              items={FORMAT_LABELS}
              value={mode}
              onValueChange={handleModeChange}
            >
              <Select.Trigger
                aria-label="Mode"
                className="inline-flex items-center justify-between gap-2 min-w-[85px] px-3 py-1 rounded-lg text-[12px] font-medium bg-[#767680]/15 dark:bg-[#767680]/25 text-black dark:text-white hover:bg-[#767680]/22 dark:hover:bg-[#767680]/35 transition-colors cursor-pointer outline-none"
              >
                <Select.Value />
                <Select.Icon className="text-[#3c3c43]/70 dark:text-[#ebebf5]/60 flex items-center">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </Select.Icon>
              </Select.Trigger>
              <Select.Portal>
                <Select.Positioner sideOffset={6} className="z-[110]">
                  <Select.Popup className="min-w-[110px] p-1 rounded-xl bg-white/95 dark:bg-[#2c2c2e]/95 backdrop-blur-md border border-[#c6c6c8]/60 dark:border-[#38383a] shadow-xl outline-none">
                    <Select.List>
                      {SUPPORTED_FORMATS.map((fmt) => (
                        <Select.Item
                          key={fmt}
                          value={fmt}
                          className="relative flex items-center pl-7 pr-3 py-1.5 rounded-lg text-[13px] font-medium text-black dark:text-white select-none cursor-pointer outline-none data-[highlighted]:bg-[#007aff] dark:data-[highlighted]:bg-[#0a84ff] data-[highlighted]:text-white"
                        >
                          <Select.ItemIndicator className="absolute left-2 inline-flex items-center">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </Select.ItemIndicator>
                          <Select.ItemText>
                            {FORMAT_LABELS[fmt] || fmt}
                          </Select.ItemText>
                        </Select.Item>
                      ))}
                    </Select.List>
                  </Select.Popup>
                </Select.Positioner>
              </Select.Portal>
            </Select.Root>
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
            <Switch.Root
              checked={darkMode}
              onCheckedChange={(nextChecked) => setDarkMode(nextChecked)}
              aria-label="Toggle dark mode"
              className={`relative inline-flex h-[24px] w-[42px] flex-shrink-0 cursor-pointer rounded-full p-[2px] transition-colors duration-200 ease-in-out focus:outline-none ${
                darkMode ? 'bg-[#34c759]' : 'bg-[#e9e9ea]'
              }`}
            >
              <Switch.Thumb
                className={`pointer-events-none inline-block h-[20px] w-[20px] transform rounded-full bg-white shadow-md transition-transform duration-200 ease-in-out ${
                  darkMode ? 'translate-x-[18px]' : 'translate-x-0'
                }`}
              />
            </Switch.Root>
          </div>
        </div>
      </header>

      <div ref={containerRef} className="flex flex-1 min-h-0">
        <div className="json-by-schema relative flex-1 min-w-0 overflow-auto bg-[#f2f2f7] dark:bg-black">
          <JsonBySchema
            key={editorKey}
            schema={activeSchema}
            config={savedConfig}
            path={path}
            theme={themePreset}
            darkMode={darkMode}
            format={mode}
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
              {mode === 'yaml' ? 'Generated YAML' : 'Generated JSON'}
            </h3>
            <div className="text-[12px] text-[#3c3c43]/60 dark:text-[#ebebf5]/60 mb-2.5 flex-shrink-0">
              Current path: <code className="text-[#007aff] dark:text-[#0a84ff]">{path || '/'}</code>
            </div>
            <div className="relative flex-1 min-h-0 rounded-xl overflow-auto border border-[#c6c6c8]/60 dark:border-[#38383a] bg-white dark:bg-[#1d1f21]">
              <CodeMirror
                value={stringifyStructuredValue(draftConfig, mode)}
                theme={darkMode ? 'dark' : 'light'}
                extensions={[mode === 'yaml' ? yaml() : json()]}
                editable={false}
                readOnly
                height="100%"
                className="h-full text-[13px]"
                basicSetup={{
                  lineNumbers: true,
                  foldGutter: true,
                  highlightActiveLine: false,
                  tabSize: 2,
                }}
              />
              <button
                type="button"
                onClick={handleCopyJson}
                className="absolute bottom-3 right-3 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium backdrop-blur-md bg-[#f2f2f7]/90 dark:bg-[#2c2c2e]/90 border border-[#c6c6c8]/60 dark:border-[#38383a] text-black dark:text-white shadow-sm hover:bg-[#e5e5ea] dark:hover:bg-[#3a3a3c] cursor-pointer transition-colors"
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

          <div className="flex-1 min-h-0 p-4 flex flex-col">
            <div className="flex items-center justify-between mb-2.5 flex-shrink-0">
              <h3 className="m-0 text-[15px] font-semibold tracking-tight">
                {mode === 'yaml' ? 'YAML Schema' : 'JSON Schema'}
              </h3>
              {schemaError && (
                <span className="text-[11px] font-medium text-[#ff3b30] dark:text-[#ff453a] truncate max-w-[65%]">
                  {schemaError}
                </span>
              )}
            </div>
            <div className="relative flex-1 min-h-0 rounded-xl overflow-auto border border-[#c6c6c8]/60 dark:border-[#38383a] bg-white dark:bg-[#1d1f21]">
              <CodeMirror
                value={schemaText}
                onChange={handleSchemaTextChange}
                theme={darkMode ? 'dark' : 'light'}
                extensions={[mode === 'yaml' ? yaml() : json()]}
                height="100%"
                className="h-full text-[13px]"
                basicSetup={{
                  lineNumbers: true,
                  foldGutter: true,
                  highlightActiveLine: true,
                  tabSize: 2,
                }}
              />
              <button
                type="button"
                disabled={!isSchemaDirty || Boolean(schemaError)}
                onClick={handleUpdateSchema}
                className={`absolute bottom-3 right-3 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium shadow-md transition-opacity ${
                  !isSchemaDirty || schemaError
                    ? 'bg-[#8e8e93]/25 text-[#8e8e93] cursor-not-allowed'
                    : 'bg-[#007aff] dark:bg-[#0a84ff] text-white cursor-pointer hover:opacity-90'
                }`}
              >
                Update editor
              </button>
            </div>
          </div>
        </div>
      </div>

      {isUpdating && (
        <div
          role="status"
          aria-live="polite"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 dark:bg-black/45 backdrop-blur-[2px] cursor-wait"
        >
          <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/95 dark:bg-[#2c2c2e]/95 border border-[#c6c6c8]/60 dark:border-[#38383a] shadow-xl">
            <svg
              className="animate-spin h-5 w-5 text-[#007aff] dark:text-[#0a84ff]"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
            <span className="text-[14px] font-medium text-black dark:text-white">
              Updating editor...
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(<DemoApp />);
