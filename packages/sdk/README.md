# @hudsonos/sdk

SDK for building [Hudson](https://hudsonos.com) apps — types, hooks, and utilities.

## Install

```bash
bun add @hudsonos/sdk
```

Peer dependencies:

```bash
bun add react lucide-react
```

## Quick Start

```tsx
import type { HudsonApp } from '@hudsonos/sdk';

const myApp: HudsonApp = {
  id: 'my-app',
  name: 'My App',
  mode: 'panel',
  Provider: ({ children }) => <>{children}</>,
  slots: {
    Content: () => <div>Hello Hudson</div>,
  },
  hooks: {
    useCommands: () => [],
    useStatus: () => ({ label: 'Ready', color: 'emerald' }),
  },
};
```

## What's Included

### Types

- `HudsonApp` — the contract every app must implement
- `HudsonWorkspace` — workspace configuration
- `AppIntent` — LLM/voice/search intent declarations
- `ServiceDefinition` — service registry types
- `AppPorts` — inter-app data piping
- `CommandOption`, `ContextMenuEntry` — UI overlay types

### Hooks

- `usePersistentState(key, initial)` — localStorage-backed useState
- `useAppSettings(appId, config)` — per-app settings with merge semantics
- `useTerminalRelay(options)` — WebSocket terminal relay connection

### Utilities

- `sounds` — tactile UI sounds via Web Audio API
- `logEvent` — event-based debug logging
- `worldToScreen` / `screenToWorld` — canvas viewport math
- `deriveManifest` — build app manifests from HudsonApp definitions
- `SHELL_THEME` — design tokens for Hudson chrome

### Platform

- `PlatformProvider` / `usePlatform` — abstract host-specific concerns (web vs native)
- `usePlatformLayout` — derived layout measurements
- `WEB_ADAPTER` — zero-config web defaults

### Components

- `ZoomControls` — canvas zoom widget with editable percentage

### Styles

Import scrollbar styles for dark-themed panels:

```css
@import "@hudsonos/sdk/styles.css";
```

## Tailwind CSS v4

To scan the SDK for Tailwind classes:

```css
@import "tailwindcss";
@source "../node_modules/@hudsonos/sdk/dist/**/*.js";
```

## AI Support

AI types (`HudsonAIChat`, `UseHudsonAIOptions`, `AIAttachment`) are exported for typing.
The runtime ships separately as `@hudsonos/ai` (coming soon).

## License

MIT
