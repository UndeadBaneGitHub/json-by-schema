# json-by-schema

[![CI](https://github.com/UndeadBaneGitHub/json-by-schema/actions/workflows/ci.yml/badge.svg)](https://github.com/UndeadBaneGitHub/json-by-schema/actions/workflows/ci.yml)
[![Publish to npm & Deploy GitHub Pages Demo](https://github.com/UndeadBaneGitHub/json-by-schema/actions/workflows/publish.yml/badge.svg)](https://github.com/UndeadBaneGitHub/json-by-schema/actions/workflows/publish.yml)
[![npm version](https://img.shields.io/npm/v/json-by-schema.svg)](https://www.npmjs.com/package/json-by-schema)

A React 18 UI component for viewing, navigating, validating, and editing **JSON** or **YAML** configurations driven by a **JSON Schema**.

**[Live Demo Playground](https://undeadbanegithub.github.io/json-by-schema/)**

---

## Features

- **Column-Miller Navigation**: Finder-style multi-pane drill-down for deeply nested objects, arrays, and polymorphic schemas (`oneOf`, `anyOf`, `allOf`, and `type` arrays).
- **JSON & YAML Input/Output**: Pass `format="json"` or `format="yaml"` (or `mode="yaml"`) to work with objects or raw JSON/YAML strings, including an embedded CodeMirror 6 raw editor (`Edit as JSON` / `Edit as YAML`).
- **Built-in Theme Presets & Dark Mode**: Includes 5 design presets (`ios`, `nomad`, `github`, `kubernetes`, `swagger`) plus full custom CSS variable token overrides and light/dark mode support.
- **Explicit Save & Unsaved Changes Guard**: Prevents accidental data loss when navigating away from modified fields.
- **Drag-and-Drop Array Reordering**: Powered by `@dnd-kit`, with support for array of objects, primitives, and fixed positional tuple arrays.
- **Schema Validation & Custom Validators**: Real-time JSON Schema Draft-04 validation plus extensible cross-field custom validators.

---

## Installation

```bash
npm install json-by-schema
# or
pnpm add json-by-schema
# or
yarn add json-by-schema
```

> `react` (`^18.0.0`) and `react-dom` (`^18.0.0`) are peer dependencies.

---

## Quick Start

Import the component and its stylesheet:

```jsx
import React, { useState } from 'react';
import { JsonBySchema } from 'json-by-schema';
import 'json-by-schema/styles.css';

const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  type: 'object',
  required: ['serviceName', 'port'],
  properties: {
    serviceName: {
      type: 'string',
      description: 'Service identifier',
      minLength: 2,
    },
    port: {
      type: 'integer',
      minimum: 1,
      maximum: 65535,
    },
    enabled: {
      type: 'boolean',
    },
  },
};

const initialConfig = {
  serviceName: 'my-service',
  port: 8080,
  enabled: true,
};

export default function App() {
  const [config, setConfig] = useState(initialConfig);
  const [path, setPath] = useState('');

  return (
    <div style={{ height: '600px' }}>
      <JsonBySchema
        schema={schema}
        config={config}
        path={path}
        format="json"
        theme="ios"
        darkMode={false}
        onChange={(nextConfig, delta, formattedString) => {
          setConfig(nextConfig);
        }}
        onPathChange={(nextPath) => setPath(nextPath)}
      />
    </div>
  );
}
```

---

## Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `schema` | `object \| string` | **required** | JSON Schema object, or a JSON/YAML string representation of the schema. |
| `config` | `object \| array \| string` | `{}` | Initial configuration object/array, or a JSON/YAML string. |
| `format` (`mode`) | `'json' \| 'yaml'` | `'json'` | Active format for string parsing, `onChange` formatted string output, and the raw CodeMirror editor (`Edit as JSON` vs `Edit as YAML`). |
| `onChange` | `(nextValue, delta, secondaryValue) => void` | `undefined` | Invoked when a property change is saved. If `config` was passed as an object, `nextValue` is the updated object and `secondaryValue` is the formatted JSON/YAML string. If `config` was passed as a string, `nextValue` is the formatted string and `secondaryValue` is the parsed object. |
| `path` | `string` | `''` | Controlled navigation path (e.g. `'database/host'`). |
| `onPathChange` | `(nextPath: string) => void` | `undefined` | Invoked when the user navigates to a different property column. |
| `theme` | `string \| object` | `'ios'` | Preset name (`'ios'`, `'nomad'`, `'github'`, `'kubernetes'`, `'swagger'`) or an object of theme token overrides. |
| `darkMode` | `boolean` | `undefined` | Controlled dark mode boolean. If omitted, `<JsonBySchema>` renders a built-in floating dark mode toggle and persists to `localStorage`. |
| `customValidators` | `Array<Function>` | `[]` | Custom validator functions returning a `CustomValidationResult`. |
| `deltaDepth` | `number` | `0` | Depth used when computing the `delta` object passed to `onChange`. |

---

## Development & Scripts

```bash
# Start local Vite demo playground at http://localhost:5173
pnpm start

# Run Biome linter
pnpm lint

# Run Vitest unit & component tests
pnpm test

# Run Playwright E2E tests (Chromium & Firefox)
pnpm test:e2e

# Build npm library bundle into dist/
pnpm build

# Build static demo playground into dist-demo/ (used for GitHub Pages)
pnpm build:demo
```

---

## Publishing & Deployment

### Unified Release Workflow (`publish.yml`)
[`.github/workflows/publish.yml`](.github/workflows/publish.yml) publishes **both** the package to **npmjs** and the updated **GitHub Pages demo playground** in a single release pipeline whenever a `v*` tag is pushed, a GitHub Release is published, or the workflow is triggered manually:

1. In your GitHub repository settings under **Settings → Pages → Build and deployment**, set **Source** to **GitHub Actions** (pushes to `main` also deploy the demo via [`.github/workflows/pages.yml`](.github/workflows/pages.yml)).
2. Add an `NPM_TOKEN` repository secret in GitHub (**Settings → Secrets and variables → Actions**) containing an npm automation access token.
3. Bump the version in `package.json`, tag the release (e.g. `git tag v0.2.0 && git push origin v0.2.0`), or publish a GitHub Release.
4. [`.github/workflows/publish.yml`](.github/workflows/publish.yml) will automatically lint, test, build, publish the package to npm with provenance (`npm publish --provenance --access public`), build the demo playground (`pnpm build:demo`), and deploy it to GitHub Pages.
5. You can also publish to npm manually from your terminal with `npm publish` / `pnpm publish` (`prepublishOnly` automatically runs `pnpm lint && pnpm test && pnpm build`).

## License

[MIT](LICENSE)
