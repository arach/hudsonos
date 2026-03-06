# API Reference

Complete reference for every type, hook, utility, and component exported by `@hudsonos/sdk`.

## Types

### HudsonApp

The core contract every app must implement to plug into the Hudson shell.

```ts
interface HudsonApp {
  id: string;
  name: string;
  description?: string;
  mode: 'canvas' | 'panel';
  leftPanel?: { title: string; icon?: ReactNode; headerActions?: React.FC };
  rightPanel?: { title: string; icon?: ReactNode };
  Provider: React.FC<{ children: ReactNode }>;
  tools?: AppTool[];
  slots: {
    Content: React.FC;
    LeftPanel?: React.FC;
    RightPanel?: React.FC;  // deprecated
    Inspector?: React.FC;
    LeftFooter?: React.FC;
    Terminal?: React.FC;
  };
  intents?: AppIntent[];
  manifest?: AppManifest;
  settings?: AppSettingsConfig;
  ports?: AppPorts;
  services?: ServiceDependency[];
  hooks: {
    useCommands: () => CommandOption[];
    useStatus: () => { label: string; color: StatusColor };
    useSearch?: () => SearchConfig;
    useNavCenter?: () => ReactNode | null;
    useNavActions?: () => ReactNode | null;
    useLayoutMode?: () => 'canvas' | 'panel';
    useActiveToolHint?: () => string | null;
    usePortOutput?: () => (portId: string) => unknown | null;
    usePortInput?: () => (portId: string, data: unknown) => void;
  };
}
```

### StatusColor

```ts
type StatusColor = 'emerald' | 'amber' | 'red' | 'neutral';
```

### AppTool

A tool panel entry for the right sidebar accordion.

```ts
interface AppTool {
  id: string;
  name: string;
  icon: ReactNode;
  Component: React.FC;
}
```

### SearchConfig

Configuration for the navigation bar search field.

```ts
interface SearchConfig {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}
```

### AppManifest

Serializable snapshot of an app's capabilities for LLM and tooling introspection.

```ts
interface AppManifest {
  id: string;
  name: string;
  description?: string;
  mode: 'canvas' | 'panel';
  commands?: { id: string; label: string; shortcut?: string }[];
  tools?: { id: string; name: string }[];
}
```

### AppSettingField

```ts
interface AppSettingField {
  key: string;
  label: string;
  type: 'text' | 'number' | 'toggle' | 'slider' | 'segment';
  default: string | number | boolean;
  options?: { value: string; label: string }[];  // for 'segment' type
  min?: number;     // for 'slider' and 'number'
  max?: number;
  step?: number;
  format?: (v: number) => string;  // for 'slider' display
}
```

### AppSettingsSection

```ts
interface AppSettingsSection {
  label: string;
  fields: AppSettingField[];
}
```

### AppSettingsConfig

```ts
interface AppSettingsConfig {
  sections: AppSettingsSection[];
}
```

---

### HudsonWorkspace

A collection of apps that coexist in a shared shell.

```ts
interface HudsonWorkspace {
  id: string;
  name: string;
  description?: string;
  mode: 'canvas' | 'panel';
  apps: WorkspaceAppConfig[];
  defaultFocusedAppId?: string;
}
```

### WorkspaceAppConfig

```ts
interface WorkspaceAppConfig {
  app: HudsonApp;
  canvasMode?: CanvasParticipation;
  defaultWindowBounds?: { x: number; y: number; w: number; h: number };
}
```

### CanvasParticipation

```ts
type CanvasParticipation = 'native' | 'windowed';
```

---

### AppIntent

Static intent declaration for LLM, voice, and search indexing.

```ts
interface AppIntent {
  commandId: string;
  title: string;
  description: string;
  category: IntentCategory;
  keywords: string[];
  params?: IntentParameter[];
  shortcut?: string;
  dangerous?: boolean;
}
```

### IntentCategory

```ts
type IntentCategory =
  | 'tool'
  | 'edit'
  | 'file'
  | 'view'
  | 'navigation'
  | 'toggle'
  | 'workspace'
  | 'settings';
```

### IntentParameter

```ts
interface IntentParameter {
  name: string;
  description: string;
  type: 'string' | 'number' | 'boolean';
  optional?: boolean;
  enum?: string[];
  default?: string | number | boolean;
}
```

### CatalogAppEntry

```ts
interface CatalogAppEntry {
  appId: string;
  appName: string;
  appDescription: string;
  intents: AppIntent[];
}
```

### IntentCatalog

```ts
interface IntentCatalog {
  version: 1;
  generatedAt: string;
  workspace: { id: string; name: string };
  shell: AppIntent[];
  apps: CatalogAppEntry[];
  index: Record<string, { appId: string; intent: AppIntent }>;
}
```

---

### ServiceDefinition

Defines an external service that can be installed, started, and health-checked.

```ts
interface ServiceDefinition {
  id: string;
  name: string;
  description: string;
  version?: string;
  icon?: string;
  check: {
    healthUrl?: string;
    port?: number;
  };
  install: { command: string; cwd?: string };
  start: { command: string; cwd?: string; env?: Record<string, string> };
  stop?: { command?: string };
}
```

### ServiceDependency

```ts
interface ServiceDependency {
  serviceId: string;
  optional?: boolean;
  reason?: string;
}
```

### ServiceStatus

```ts
type ServiceStatus = 'unknown' | 'not_installed' | 'installed' | 'running' | 'error';
```

### ServiceRecord

```ts
interface ServiceRecord {
  serviceId: string;
  status: ServiceStatus;
  pid?: number;
  logFile?: string;
  lastChecked: number;
  lastChanged: number;
  error?: string;
}
```

### ServiceAction

```ts
interface ServiceAction {
  id: string;
  serviceId: string;
  action: 'check' | 'install' | 'start' | 'stop';
  triggeredBy: 'user' | 'agent' | 'system';
  timestamp: number;
  command?: string;
  output?: string;
  exitCode?: number | null;
  success: boolean;
  durationMs: number;
}
```

---

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

### PipeDefinition

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

---

### CommandOption

Entry for the command palette.

```ts
interface CommandOption {
  id: string;
  label: string;
  action: () => void;
  shortcut?: string;
  icon?: React.ReactNode;
}
```

### ContextMenuEntry

```ts
type ContextMenuEntry = ContextMenuAction | ContextMenuSeparator | ContextMenuGroup;
```

### ContextMenuAction

```ts
interface ContextMenuAction {
  id: string;
  label: string;
  action: () => void;
  shortcut?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}
```

### ContextMenuSeparator

```ts
interface ContextMenuSeparator {
  type: 'separator';
}
```

### ContextMenuGroup

```ts
interface ContextMenuGroup {
  type: 'group';
  label: string;
  items: ContextMenuAction[];
}
```

---

### AI Types

These types are exported for typing app hooks. The runtime ships separately as `@hudsonos/ai`.

### HudsonAIChat

```ts
interface HudsonAIChat {
  messages: unknown[];
  sendMessage: (message: { role: string; content: string }) => void;
  stop: () => void;
  status: string;
  setMessages: (messages: unknown[]) => void;
  clearChat: () => void;
  error: Error | undefined;
  mode: 'cli' | 'api';
  attachments: AIAttachment[];
  activeAttachments: Set<string>;
  toggleAttachment: (label: string) => void;
}
```

### UseHudsonAIOptions

```ts
interface UseHudsonAIOptions {
  toolset: string;
  context?: Record<string, unknown>;
  onToolCall?: (toolName: string, args: Record<string, unknown>) => void | Promise<void>;
  mode?: 'cli' | 'api';
  attachments?: AIAttachment[];
}
```

### AIAttachment

```ts
interface AIAttachment {
  label: string;
  content: () => string | Record<string, unknown> | null;
}
```

---

## Hooks

### usePersistentState

```ts
function usePersistentState<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>]
```

localStorage-backed `useState`. See [Hooks guide](./hooks.md#usepersistentstate).

### useAppSettings

```ts
function useAppSettings(
  appId: string,
  config: AppSettingsConfig,
): [AppSettingsValues, (patch: Partial<AppSettingsValues>) => void, () => void]
```

Per-app settings with merge semantics. See [Hooks guide](./hooks.md#useappsettings).

### useTerminalRelay

```ts
function useTerminalRelay(options?: UseTerminalRelayOptions): TerminalRelayHandle
```

WebSocket terminal relay connection. See [Hooks guide](./hooks.md#useterminalrelay).

---

## Utilities

### sounds

Tactile UI sounds generated with the Web Audio API. No audio files required.

```ts
import { sounds, click, thock, blipUp, blipDown, pop, confirm, error, whoosh, chime, tick, slideIn, slideOut, boot, ping, type } from '@hudsonos/sdk';
```

See [Sounds](./sounds.md) for the full catalog.

### Mute Control

```ts
function isMuted(): boolean;
function setMuted(muted: boolean): void;
function toggleMute(): boolean;
```

### Sound Preview

```ts
function preview(name: SoundName): void;
```

Plays the sound even when muted. Useful for settings previews.

### SoundName

```ts
type SoundName = keyof typeof sounds;
// 'click' | 'thock' | 'blipUp' | 'blipDown' | 'pop' | 'confirm' | 'error' | 'whoosh' | 'chime' | 'tick' | 'slideIn' | 'slideOut' | 'boot' | 'ping' | 'type'
```

---

### logEvent

Event-based debug logging. Only emits when `FRAME_DEBUG` is enabled (via `window.FRAME_DEBUG = true` or `localStorage.setItem('FRAME_DEBUG', '1')`).

```ts
function logEvent(label: string, payload: Record<string, unknown>, tag?: string): void;
```

### FRAME_LOG_EVENT

The CustomEvent type string for log listeners.

```ts
const FRAME_LOG_EVENT: string; // 'frame:log'
```

### FrameLogEntry

```ts
interface FrameLogEntry {
  id: string;
  label: string;
  tag: string;
  timestamp: string;
  payload: Record<string, unknown>;
}
```

---

### worldToScreen

Converts world-space coordinates to screen-space coordinates.

```ts
function worldToScreen(
  worldPos: { x: number; y: number },
  panOffset: { x: number; y: number },
  scale: number,
  viewportCenter: { x: number; y: number },
): { x: number; y: number }
```

### screenToWorld

Converts screen-space coordinates to world-space coordinates.

```ts
function screenToWorld(
  screenPos: { x: number; y: number },
  panOffset: { x: number; y: number },
  scale: number,
  viewportCenter: { x: number; y: number },
): { x: number; y: number }
```

---

### deriveManifest

Derives a serializable `AppManifest` from a `HudsonApp` definition. Returns the app's static manifest if one is provided; otherwise builds one from top-level fields.

```ts
function deriveManifest(app: HudsonApp): AppManifest
```

---

### SHELL_THEME

Design tokens for Hudson shell chrome. See [Theme](./theme.md) for full details.

```ts
const SHELL_THEME: {
  tokens: { blur, bg, border, shadow, topHighlight };
  base: string;
  panels: { navigationStack, manifest, inspector, minimap, statusBar, commandDock };
  effects: { rightFade, leftFade, bottomGlow };
  zIndex: { canvas, worldContent, panels, minimap, navigationStack, statusBar, drawer, modals };
  layout: { navHeight, panelWidth, panelTopOffset, statusBarHeight, panelBottomOffset };
}
```

---

## Platform

### PlatformAdapter

```ts
interface PlatformAdapter {
  titleBarInset: number;
  dragRegionProps: React.HTMLAttributes<HTMLElement>;
  onInteractiveMouseDown?: (e: React.MouseEvent) => void;
  isSSR: boolean;
  apiBaseUrl: string;
  serviceApiUrl: string;
}
```

### PlatformLayout

```ts
interface PlatformLayout {
  navTotalHeight: number;
  panelTopOffset: number;
}
```

### WEB_ADAPTER

Zero-config web defaults. Used when no `PlatformProvider` is present.

```ts
const WEB_ADAPTER: PlatformAdapter;
```

### PlatformProvider

```tsx
function PlatformProvider(props: {
  adapter: PlatformAdapter;
  children: React.ReactNode;
}): JSX.Element
```

### usePlatform

```ts
function usePlatform(): PlatformAdapter
```

### usePlatformLayout

```ts
function usePlatformLayout(): PlatformLayout
```

---

## Components

### ZoomControls

A canvas zoom widget with plus/minus buttons and an editable percentage display.

```tsx
import { ZoomControls } from '@hudsonos/sdk';

<ZoomControls
  scale={zoom}
  onZoom={(newScale) => setZoom(newScale)}
  min={0.1}
  max={3}
  step={0.1}
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `scale` | `number` | -- | Current zoom level (1 = 100%). |
| `onZoom` | `(newScale: number) => void` | -- | Called with the clamped new scale on zoom change. |
| `min` | `number` | `0.2` | Minimum zoom level. |
| `max` | `number` | `3` | Maximum zoom level. |
| `step` | `number` | `0.1` | Zoom increment per click. |

The percentage label is clickable for direct numeric input.
