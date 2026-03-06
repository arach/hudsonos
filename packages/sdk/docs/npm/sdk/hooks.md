# Hooks

The SDK provides three hooks for common app needs: persistent state, app settings, and terminal relay. All hooks are designed to work within the Hudson platform adapter system and handle SSR gracefully.

## usePersistentState

A drop-in replacement for `useState` that persists values to `localStorage`. The API is identical to React's `useState`.

### Import

```tsx
import { usePersistentState } from '@hudsonos/sdk';
```

### Signature

```ts
function usePersistentState<T>(
  key: string,
  initialValue: T,
): [T, React.Dispatch<React.SetStateAction<T>>]
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `key` | `string` | The localStorage key. Namespace it with your app ID to avoid collisions. |
| `initialValue` | `T` | Default value used when nothing is found in localStorage. |

### Return Value

A tuple identical to `useState`: the current value and a setter function. The setter accepts either a new value or an updater function.

### Behavior

1. On initial render, reads `localStorage.getItem(key)` and parses JSON.
2. Falls back to `initialValue` if no stored value exists or parsing fails.
3. On SSR (`isSSR` from PlatformProvider), defers the localStorage read to a `useEffect`.
4. Every state change is written back to localStorage as JSON.

### Example

```tsx
import { usePersistentState } from '@hudsonos/sdk';

function ProjectSettings() {
  const [gridSize, setGridSize] = usePersistentState('editor.gridSize', 20);
  const [snapEnabled, setSnapEnabled] = usePersistentState('editor.snap', true);

  return (
    <div>
      <label>
        Grid size
        <input
          type="number"
          value={gridSize}
          onChange={(e) => setGridSize(Number(e.target.value))}
        />
      </label>
      <label>
        <input
          type="checkbox"
          checked={snapEnabled}
          onChange={() => setSnapEnabled((v) => !v)}
        />
        Snap to grid
      </label>
    </div>
  );
}
```

### Key Namespacing

Use a consistent prefix to avoid collisions between apps:

```tsx
// Good: namespaced keys
usePersistentState('shaper.zoom', 0.45);
usePersistentState('shaper.tool', 'select');

// Bad: generic keys that could collide
usePersistentState('zoom', 0.45);
```

---

## useAppSettings

Manages per-app settings backed by localStorage with merge semantics. Works with the `AppSettingsConfig` schema to derive defaults and persist user overrides.

### Import

```tsx
import { useAppSettings } from '@hudsonos/sdk';
import type { AppSettingsValues } from '@hudsonos/sdk';
```

### Signature

```ts
function useAppSettings(
  appId: string,
  config: AppSettingsConfig,
): [AppSettingsValues, (patch: Partial<AppSettingsValues>) => void, () => void]
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `appId` | `string` | Your app's unique ID. Used to namespace the localStorage key as `hudson.app.{appId}.settings`. |
| `config` | `AppSettingsConfig` | The settings schema, containing sections and fields with defaults. |

### Return Value

A three-element tuple:

| Index | Type | Description |
|-------|------|-------------|
| `[0]` | `AppSettingsValues` | Current merged settings (defaults + user overrides). |
| `[1]` | `(patch) => void` | Merge function. Pass partial values to update specific keys. |
| `[2]` | `() => void` | Reset function. Restores all settings to their declared defaults. |

`AppSettingsValues` is `Record<string, string | number | boolean>`.

### Defining a Settings Schema

The settings schema uses `AppSettingsConfig`, which contains sections of typed fields:

```tsx
import type { AppSettingsConfig } from '@hudsonos/sdk';

const settingsConfig: AppSettingsConfig = {
  sections: [
    {
      label: 'Canvas',
      fields: [
        {
          key: 'gridSize',
          label: 'Grid Size',
          type: 'slider',
          default: 20,
          min: 5,
          max: 100,
          step: 5,
          format: (v) => `${v}px`,
        },
        {
          key: 'snapToGrid',
          label: 'Snap to Grid',
          type: 'toggle',
          default: true,
        },
      ],
    },
    {
      label: 'Export',
      fields: [
        {
          key: 'format',
          label: 'Export Format',
          type: 'segment',
          default: 'svg',
          options: [
            { value: 'svg', label: 'SVG' },
            { value: 'png', label: 'PNG' },
            { value: 'json', label: 'JSON' },
          ],
        },
      ],
    },
  ],
};
```

### Field Types

| Type | Control | Default Type |
|------|---------|-------------|
| `'text'` | Text input | `string` |
| `'number'` | Number input | `number` |
| `'toggle'` | On/off switch | `boolean` |
| `'slider'` | Range slider with optional `format` | `number` |
| `'segment'` | Segmented control with `options` | `string` |

### Example

```tsx
import { useAppSettings } from '@hudsonos/sdk';

function MyAppProvider({ children }: { children: React.ReactNode }) {
  const [settings, updateSettings, resetSettings] = useAppSettings(
    'my-editor',
    settingsConfig,
  );

  // Read a value
  const gridSize = settings.gridSize as number;

  // Update a value
  const handleGridChange = (size: number) => {
    updateSettings({ gridSize: size });
  };

  // Reset to defaults
  const handleReset = () => {
    resetSettings();
  };

  return (
    <EditorContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </EditorContext.Provider>
  );
}
```

### Registering Settings on the App

Pass the config to the `settings` field of your `HudsonApp` definition. The shell reads this to render a settings panel.

```tsx
const myApp: HudsonApp = {
  id: 'my-editor',
  name: 'Editor',
  // ...
  settings: settingsConfig,
};
```

---

## useTerminalRelay

Connects to a WebSocket-based terminal relay server. The relay manages PTY sessions on a backend, allowing your app to embed a live terminal.

### Import

```tsx
import { useTerminalRelay } from '@hudsonos/sdk';
import type { TerminalRelayHandle, UseTerminalRelayOptions, RelayStatus } from '@hudsonos/sdk';
```

### Signature

```ts
function useTerminalRelay(
  options?: UseTerminalRelayOptions,
): TerminalRelayHandle
```

### Options

```ts
interface UseTerminalRelayOptions {
  /** WebSocket URL. Defaults to ws://localhost:3600 */
  url?: string;
  /** System prompt for the CLI session */
  systemPrompt?: string;
  /** Working directory for the PTY session */
  cwd?: string;
  /** Files to bootstrap in the CWD before spawning */
  workspaceFiles?: Record<string, string>;
  /** Auto-connect on mount. Defaults to false. */
  autoConnect?: boolean;
}
```

| Option | Default | Description |
|--------|---------|-------------|
| `url` | `'ws://localhost:3600'` | WebSocket URL of the relay server. |
| `systemPrompt` | `undefined` | Passed to the CLI session on init. |
| `cwd` | Server's `$HOME` | Working directory for the spawned PTY. |
| `workspaceFiles` | `undefined` | Map of relative paths to file contents. Created on the server if missing. |
| `autoConnect` | `false` | When `true`, opens the WebSocket on mount. |

### Return Value: TerminalRelayHandle

```ts
interface TerminalRelayHandle {
  status: RelayStatus;
  sessionId: string | null;
  error: string | null;
  exitCode: number | null;
  onData: (cb: (data: string) => void) => void;
  sendInput: (data: string) => void;
  sendLine: (text: string) => void;
  resize: (cols: number, rows: number) => void;
  connect: () => void;
  disconnect: () => void;
}
```

| Field | Description |
|-------|-------------|
| `status` | Connection state: `'disconnected'`, `'connecting'`, `'connected'`, or `'error'`. |
| `sessionId` | Server-assigned session ID after init. `null` before connection or after exit. |
| `error` | Human-readable error message. `null` when healthy. |
| `exitCode` | Process exit code. `null` while running or before start. |
| `onData` | Register a callback to receive terminal output. |
| `sendInput` | Send raw keystrokes to the PTY. |
| `sendLine` | Send a line of text (appends `\r` automatically). |
| `resize` | Resize the remote terminal. Can be called before connect to set initial size. |
| `connect` | Open the WebSocket and initialize or reconnect a session. |
| `disconnect` | Close the WebSocket. The server-side session stays alive for reconnection. |

### RelayStatus

```ts
type RelayStatus = 'disconnected' | 'connecting' | 'connected' | 'error';
```

### Example

```tsx
import { useTerminalRelay } from '@hudsonos/sdk';
import { useEffect, useRef } from 'react';

function AppTerminal() {
  const terminal = useTerminalRelay({
    url: 'ws://localhost:3600',
    systemPrompt: 'You are a helpful coding assistant.',
    cwd: '/Users/me/project',
    autoConnect: false,
  });

  const outputRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    terminal.onData((data) => {
      if (outputRef.current) {
        outputRef.current.textContent += data;
      }
    });
  }, [terminal]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-neutral-800">
        <span className={`h-2 w-2 rounded-full ${
          terminal.status === 'connected' ? 'bg-emerald-500' :
          terminal.status === 'connecting' ? 'bg-amber-500' :
          terminal.status === 'error' ? 'bg-red-500' :
          'bg-neutral-600'
        }`} />
        <span className="text-xs text-neutral-500">{terminal.status}</span>
        {terminal.status === 'disconnected' && (
          <button onClick={terminal.connect} className="text-xs text-cyan-400">
            Connect
          </button>
        )}
      </div>
      <pre ref={outputRef} className="flex-1 p-3 text-xs font-mono text-neutral-400 overflow-auto" />
    </div>
  );
}
```

### Session Lifecycle

1. Call `resize(cols, rows)` to set the initial terminal dimensions.
2. Call `connect()` to open the WebSocket.
3. On open, the hook sends a `session:init` message with dimensions, system prompt, and CWD.
4. The server responds with `session:ready` containing the session ID.
5. Terminal data flows via `terminal:data` messages to the `onData` callback.
6. Call `sendInput` or `sendLine` to write to the PTY.
7. On disconnect and reconnect, the hook sends `session:reconnect` to resume the existing session.
8. If the session has expired, the server responds with `session:expired` and the hook automatically re-initializes.
