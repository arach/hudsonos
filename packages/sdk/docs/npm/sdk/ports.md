# Ports

Ports enable inter-app data piping in Hudson workspaces. One app can expose data outputs, another can accept data inputs, and the shell connects them through pipe definitions.

## Concepts

- **Output**: Data a source app produces (e.g., an SVG string, a JSON object).
- **Input**: Data a sink app consumes.
- **Pipe**: A connection between one app's output and another app's input.
- **Data type**: A semantic label (like `'svg'`, `'json'`, `'text'`) that helps match compatible ports.

```
App A (source)          Pipe             App B (sink)
  output:svg ---------> [pipe] --------> input:svg
```

## Declaring Ports

Declare ports statically on your `HudsonApp` definition:

```tsx
import type { HudsonApp } from '@hudsonos/sdk';

const shaperApp: HudsonApp = {
  id: 'shaper',
  name: 'Shaper',
  // ...
  ports: {
    outputs: [
      {
        id: 'svg',
        name: 'SVG Output',
        dataType: 'svg',
        description: 'Complete SVG of the current Shaper canvas',
      },
    ],
  },
};
```

### AppOutput

```ts
interface AppOutput {
  id: string;
  name: string;
  dataType: string;
  description?: string;
}
```

### AppInput

```ts
interface AppInput {
  id: string;
  name: string;
  dataType: string;
  description?: string;
}
```

### AppPorts

```ts
interface AppPorts {
  outputs?: AppOutput[];
  inputs?: AppInput[];
}
```

## Implementing Port Hooks

The shell reads and writes port data through two hooks on your app definition.

### usePortOutput

Returns a getter function that produces a data snapshot for a given port ID.

**Signature on HudsonApp.hooks:**

```ts
usePortOutput?: () => (portId: string) => unknown | null;
```

**Implementation example (Shaper):**

```tsx
import { useCallback } from 'react';
import { useShaper } from './ShaperProvider';

export function useShaperPortOutput() {
  const { strokesPath, pathColor, fillEnabled, fillPattern } = useShaper();

  return useCallback((portId: string): unknown | null => {
    if (portId !== 'svg') return null;
    if (!strokesPath) return null;

    const fill = fillEnabled ? pathColor : 'none';
    const stroke = fillEnabled && fillPattern === 'solid' ? 'none' : pathColor;

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <path d="${strokesPath}" fill="${fill}" stroke="${stroke}" stroke-width="2" />
</svg>`;
  }, [strokesPath, pathColor, fillEnabled, fillPattern]);
}
```

Key points:
- The hook returns a **function**, not the data directly. The shell calls this function when it needs a snapshot.
- Return `null` for unknown port IDs or when data is unavailable.
- Wrap the getter in `useCallback` for stable references.

### usePortInput

Returns a setter function that receives data pushed from a pipe.

**Signature on HudsonApp.hooks:**

```ts
usePortInput?: () => (portId: string, data: unknown) => void;
```

**Implementation example:**

```tsx
import { useCallback } from 'react';
import { useEditor } from './EditorProvider';

export function useEditorPortInput() {
  const { importSvg } = useEditor();

  return useCallback((portId: string, data: unknown) => {
    if (portId === 'svg' && typeof data === 'string') {
      importSvg(data);
    }
  }, [importSvg]);
}
```

### Wiring Hooks into the App

```tsx
const myApp: HudsonApp = {
  // ...
  hooks: {
    useCommands: useMyCommands,
    useStatus: useMyStatus,
    usePortOutput: useMyPortOutput,
    usePortInput: useMyPortInput,
  },
};
```

## PipeDefinition

Pipes are persisted connections between an output and an input:

```ts
interface PipeDefinition {
  id: string;
  name: string;
  source: { appId: string; portId: string };
  sink: { appId: string; portId: string };
  createdAt: number;
  lastPushedAt: number | null;
  enabled: boolean;
}
```

| Field | Description |
|-------|-------------|
| `id` | Unique pipe identifier. |
| `name` | Human-readable label. |
| `source` | The output port: which app and port ID. |
| `sink` | The input port: which app and port ID. |
| `createdAt` | Unix timestamp of creation. |
| `lastPushedAt` | Unix timestamp of last data push, or `null`. |
| `enabled` | Whether the pipe is active. |

Pipes are stored as JSON files (typically in `.data/pipes/`) and managed by the shell.

## Data Types

The `dataType` field is a semantic label that describes the kind of data a port handles. Use consistent strings across your apps so the shell can suggest compatible connections.

Common data types:

| Data Type | Description |
|-----------|-------------|
| `'svg'` | SVG markup string |
| `'json'` | Arbitrary JSON object |
| `'text'` | Plain text string |
| `'image'` | Base64 or URL to an image |
| `'markdown'` | Markdown text |

There is no enforced schema for data types. They are hints for the user and shell UI when creating pipe connections.

## Example: Full Pipe Setup

App A (Shaper) outputs SVG. App B (Logo Designer) accepts SVG as input.

**App A -- Shaper:**

```tsx
const shaperApp: HudsonApp = {
  id: 'shaper',
  // ...
  ports: {
    outputs: [
      { id: 'svg', name: 'SVG Output', dataType: 'svg' },
    ],
  },
  hooks: {
    // ...
    usePortOutput: useShaperPortOutput,
  },
};
```

**App B -- Logo Designer:**

```tsx
const logoApp: HudsonApp = {
  id: 'logo-designer',
  // ...
  ports: {
    inputs: [
      { id: 'svg', name: 'SVG Input', dataType: 'svg' },
    ],
  },
  hooks: {
    // ...
    usePortInput: useLogoPortInput,
  },
};
```

**Pipe Definition (created by the shell):**

```json
{
  "id": "pipe-shaper-logo-svg",
  "name": "Shaper SVG to Logo",
  "source": { "appId": "shaper", "portId": "svg" },
  "sink": { "appId": "logo-designer", "portId": "svg" },
  "createdAt": 1709654321000,
  "lastPushedAt": null,
  "enabled": true
}
```

When the pipe is triggered, the shell calls Shaper's `usePortOutput` getter with `portId: 'svg'`, takes the returned SVG string, and passes it to Logo Designer's `usePortInput` setter with `portId: 'svg'`.

## Best Practices

1. **Use semantic data types.** Match `dataType` strings between compatible ports.
2. **Return null for unknown ports.** Always check the `portId` parameter and return `null` for IDs your app does not handle.
3. **Keep output snapshots lightweight.** The getter may be called frequently. Avoid expensive computation inside it.
4. **Validate input data.** Check the type and shape of incoming data before applying it to your app state.
5. **Namespace port IDs if needed.** Simple IDs like `'svg'` work when an app has one port of that type. Use longer IDs like `'canvas-svg'` if disambiguation is needed.
