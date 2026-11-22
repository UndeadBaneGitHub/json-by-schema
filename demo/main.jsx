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

const preStyle = {
  background: '#fff',
  border: '1px solid #e1e4e8',
  borderRadius: '6px',
  padding: '12px',
  fontSize: '13px',
  overflow: 'auto',
  margin: 0,
};

function DemoApp() {
  const [config, setConfig] = useState(initialConfig);
  const [path, setPath] = useState('');
  const [rightWidthPct, setRightWidthPct] = useState(33.33);
  const [topHeightPct, setTopHeightPct] = useState(50);
  const [dragging, setDragging] = useState(null); // 'horizontal' | 'vertical' | null

  const containerRef = useRef(null);
  const rightPaneRef = useRef(null);

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
      style={{
        display: 'flex',
        height: '100vh',
        fontFamily: 'system-ui, sans-serif',
        userSelect: dragging ? 'none' : 'auto',
      }}
    >
      <div
        className="json-by-schema"
        style={{
          position: 'relative',
          flex: 1,
          minWidth: 0,
          overflow: 'auto',
        }}
      >
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
        style={{
          width: '6px',
          cursor: 'col-resize',
          background: dragging === 'horizontal' ? '#c5cbd3' : '#e1e4e8',
          flexShrink: 0,
        }}
      />

      <div
        ref={rightPaneRef}
        style={{
          width: `${rightWidthPct}%`,
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          background: '#f8f9fa',
          minWidth: 0,
        }}
      >
        <div
          style={{
            height: `${topHeightPct}%`,
            minHeight: 0,
            padding: '16px',
            overflow: 'auto',
          }}
        >
          <h3 style={{ marginTop: 0, marginBottom: '8px' }}>Generated JSON</h3>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
            Current path: <code>{path || '/'}</code>
          </div>
          <pre style={preStyle}>
            {JSON.stringify(config, null, 2)}
          </pre>
        </div>

        <div
          role="separator"
          aria-orientation="horizontal"
          onMouseDown={() => setDragging('vertical')}
          style={{
            height: '6px',
            cursor: 'row-resize',
            background: dragging === 'vertical' ? '#c5cbd3' : '#e1e4e8',
            flexShrink: 0,
          }}
        />

        <div
          style={{
            flex: 1,
            minHeight: 0,
            padding: '16px',
            overflow: 'auto',
          }}
        >
          <h3 style={{ marginTop: 0, marginBottom: '8px' }}>JSON Schema</h3>
          <pre style={preStyle}>
            {JSON.stringify(sampleSchema, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(<DemoApp />);
