# Platform Adapter

The platform adapter system abstracts host-specific concerns so the Hudson shell runs identically on web (Next.js) and native hosts (Electrobun, Tauri, Electron). Apps access the adapter through a React context.

## How It Works

1. The host wraps the app root in a `PlatformProvider` with a custom adapter.
2. Shell components and hooks call `usePlatform()` to read adapter values.
3. If no provider is present, the context falls back to `WEB_ADAPTER`.

```
Host (Next.js / Electrobun / Tauri)
  |
  +-- PlatformProvider adapter={myAdapter}
       |
       +-- WorkspaceShell
            |
            +-- usePlatform()   -> reads adapter values
            +-- usePlatformLayout()  -> derives layout math
```

## PlatformAdapter Interface

```ts
interface PlatformAdapter {
  /** Extra vertical inset above the nav bar for native title bars (0 for web). */
  titleBarInset: number;

  /** HTML attributes spread onto the nav bar to enable native window dragging. */
  dragRegionProps: React.HTMLAttributes<HTMLElement>;

  /** Called on mousedown of interactive elements inside a drag region to prevent drag. */
  onInteractiveMouseDown?: (e: React.MouseEvent) => void;

  /** Whether the host uses SSR (true for Next.js, false for native). */
  isSSR: boolean;

  /** Base URL for API calls. Empty string = same-origin (web). */
  apiBaseUrl: string;

  /** Base URL for service management API. Empty string = same-origin (web). */
  serviceApiUrl: string;
}
```

### Field Details

| Field | Web Default | Native Example | Purpose |
|-------|-------------|----------------|---------|
| `titleBarInset` | `0` | `28` | Pushes content below the native title bar. |
| `dragRegionProps` | `{}` | `{ style: { WebkitAppRegion: 'drag' } }` | Makes the nav bar act as a native drag region. |
| `onInteractiveMouseDown` | `undefined` | Stops drag propagation | Prevents buttons inside the drag region from initiating window drag. |
| `isSSR` | `true` | `false` | Controls hydration-safe localStorage access in `usePersistentState`. |
| `apiBaseUrl` | `''` | `'http://localhost:3600'` | Prefix for fetch calls. Empty uses same-origin. |
| `serviceApiUrl` | `''` | `'http://localhost:3601'` | Prefix for service management API calls. |

## WEB_ADAPTER

The default adapter for browser-based deployments. Zero configuration needed.

```ts
import { WEB_ADAPTER } from '@hudsonos/sdk';

const WEB_ADAPTER: PlatformAdapter = {
  titleBarInset: 0,
  dragRegionProps: {},
  onInteractiveMouseDown: undefined,
  isSSR: true,
  apiBaseUrl: '',
  serviceApiUrl: '',
};
```

You do not need to use `PlatformProvider` if running on the web with default settings. The context falls back to `WEB_ADAPTER` automatically.

## PlatformProvider

Wrap your app root to override platform defaults.

```tsx
import { PlatformProvider } from '@hudsonos/sdk';

function App() {
  return (
    <PlatformProvider adapter={myAdapter}>
      <WorkspaceShell workspace={myWorkspace} />
    </PlatformProvider>
  );
}
```

## usePlatform

Read the active platform adapter from any component.

```tsx
import { usePlatform } from '@hudsonos/sdk';

function MyComponent() {
  const { isSSR, apiBaseUrl } = usePlatform();

  const fetchData = async () => {
    const res = await fetch(`${apiBaseUrl}/api/data`);
    return res.json();
  };

  // ...
}
```

## usePlatformLayout

Derives layout measurements from the base shell theme combined with the active platform adapter. Use this instead of hardcoding pixel values.

```ts
interface PlatformLayout {
  /** Total nav bar height including native title bar inset. */
  navTotalHeight: number;
  /** Top offset for side panels (same as navTotalHeight). */
  panelTopOffset: number;
}
```

```tsx
import { usePlatformLayout } from '@hudsonos/sdk';

function SidePanel() {
  const { panelTopOffset } = usePlatformLayout();

  return (
    <div style={{ top: panelTopOffset, position: 'fixed' }}>
      {/* panel content */}
    </div>
  );
}
```

The layout values are derived as:

```
navTotalHeight = SHELL_THEME.layout.navHeight + adapter.titleBarInset
panelTopOffset = navTotalHeight
```

## Writing a Custom Adapter

To run Hudson inside a native host like Electrobun or Tauri, create a custom adapter.

### Electrobun Example

```tsx
import type { PlatformAdapter } from '@hudsonos/sdk';

const ELECTROBUN_ADAPTER: PlatformAdapter = {
  titleBarInset: 28,

  dragRegionProps: {
    style: { WebkitAppRegion: 'drag' } as React.CSSProperties,
  },

  onInteractiveMouseDown: (e: React.MouseEvent) => {
    // Prevent drag when clicking buttons inside the nav bar
    (e.currentTarget as HTMLElement).style.setProperty(
      '-webkit-app-region',
      'no-drag',
    );
    requestAnimationFrame(() => {
      (e.currentTarget as HTMLElement).style.removeProperty(
        '-webkit-app-region',
      );
    });
  },

  isSSR: false,

  apiBaseUrl: 'http://localhost:3600',

  serviceApiUrl: 'http://localhost:3601',
};
```

### Tauri Example

```tsx
import type { PlatformAdapter } from '@hudsonos/sdk';

const TAURI_ADAPTER: PlatformAdapter = {
  titleBarInset: 32,
  dragRegionProps: {
    'data-tauri-drag-region': true,
  } as React.HTMLAttributes<HTMLElement>,
  isSSR: false,
  apiBaseUrl: 'http://localhost:3600',
  serviceApiUrl: 'http://localhost:3601',
};
```

### Using the Adapter

```tsx
import { PlatformProvider } from '@hudsonos/sdk';

function NativeApp() {
  return (
    <PlatformProvider adapter={ELECTROBUN_ADAPTER}>
      <WorkspaceShell workspace={myWorkspace} />
    </PlatformProvider>
  );
}
```

## SSR Considerations

When `isSSR` is `true` (the default for web), `usePersistentState` defers localStorage reads to a `useEffect` to avoid hydration mismatches. Native hosts set `isSSR: false` to read localStorage synchronously on first render, since there is no server-side rendering step.
