# Intents

Intents are static declarations that describe what your app can do. They bridge the gap between your app's commands and external systems like LLMs, voice assistants, and semantic search. Each intent maps to a `CommandOption` returned by `useCommands()`.

## How Intents Work

1. You declare intents as an array of `AppIntent` objects on your `HudsonApp`.
2. The shell aggregates all app intents into an `IntentCatalog`.
3. External systems (AI agents, voice input, search) use the catalog to discover and invoke commands.
4. When an intent is triggered, the shell finds the matching `CommandOption` by `commandId` and calls its `action()`.

```
User says: "Switch to the pen tool"
  |
  v
LLM matches intent: { commandId: 'shaper:pen-tool', ... }
  |
  v
Shell finds CommandOption with id 'shaper:pen-tool'
  |
  v
Calls action() -> switchTool('pen')
```

## Declaring Intents

Add an `intents` array to your `HudsonApp` definition:

```tsx
import type { HudsonApp, AppIntent } from '@hudsonos/sdk';

const myIntents: AppIntent[] = [
  {
    commandId: 'editor:pen-tool',
    title: 'Switch to Pen Tool',
    description: 'Activate the pen tool for drawing bezier curves.',
    category: 'tool',
    keywords: ['pen', 'draw', 'bezier', 'path tool'],
    shortcut: 'P',
  },
  {
    commandId: 'editor:save',
    title: 'Save Project',
    description: 'Save the current project to local storage.',
    category: 'file',
    keywords: ['save', 'store', 'persist', 'write'],
    shortcut: 'Cmd+S',
  },
];

const editorApp: HudsonApp = {
  id: 'editor',
  name: 'Editor',
  // ...
  intents: myIntents,
};
```

## AppIntent Interface

```ts
interface AppIntent {
  /** Must match a CommandOption.id from useCommands() */
  commandId: string;
  /** Human-readable title: "Switch to Pen Tool" */
  title: string;
  /** Natural-language description for LLM/voice matching */
  description: string;
  /** Categorization for grouping and filtering */
  category: IntentCategory;
  /** Synonyms for fuzzy/semantic matching */
  keywords: string[];
  /** Optional parameters for parameterized intents */
  params?: IntentParameter[];
  /** Keyboard shortcut display string */
  shortcut?: string;
  /** If true, the intent requires confirmation before execution */
  dangerous?: boolean;
}
```

### The commandId Link

The `commandId` field is the bridge between intents and commands. It must exactly match the `id` field of a `CommandOption` returned by your `useCommands()` hook.

```tsx
// In intents.ts
{ commandId: 'editor:save', title: 'Save', ... }

// In hooks.ts — useCommands()
{ id: 'editor:save', label: 'Save', action: () => save(), shortcut: 'Cmd+S' }
```

This decoupling lets intents be declared statically (for indexing) while commands are dynamic (created inside Provider scope with access to state).

## Intent Categories

```ts
type IntentCategory =
  | 'tool'        // Tool switching: "Switch to Pen Tool"
  | 'edit'        // Editing actions: "Undo", "Delete Selected"
  | 'file'        // File operations: "Save", "Export", "New Project"
  | 'view'        // Visibility toggles: "Toggle Grid", "Show Anchors"
  | 'navigation'  // Viewport control: "Zoom In", "Reset Zoom"
  | 'toggle'      // Mode toggles: "Toggle Animation Mode"
  | 'workspace'   // Workspace-level: "Switch App", "Split View"
  | 'settings';   // Settings: "Open Preferences"
```

Use the most specific category. For example, toggling a view layer is `'view'`, while toggling a mode (like animation mode) is `'toggle'`.

## Parameters

Some intents accept parameters. Declare them with `IntentParameter`:

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

### Example: Parameterized Intent

```tsx
{
  commandId: 'editor:set-zoom',
  title: 'Set Zoom Level',
  description: 'Set the canvas zoom to a specific percentage.',
  category: 'navigation',
  keywords: ['zoom', 'set zoom', 'zoom level'],
  params: [
    {
      name: 'level',
      description: 'Zoom percentage (e.g. 100 for 100%)',
      type: 'number',
      default: 100,
    },
  ],
}
```

Parameters are passed to the LLM/agent system for structured invocation. Your `CommandOption.action()` implementation handles the actual execution.

## Keywords

Keywords enable fuzzy and semantic matching. Include:

- The primary term ("save")
- Common synonyms ("store", "persist")
- Alternate phrasings ("write to disk", "quick save")
- Abbreviations users might say ("ctrl z" for undo)

```tsx
{
  commandId: 'editor:undo',
  title: 'Undo',
  description: 'Undo the last editing action.',
  category: 'edit',
  keywords: ['undo', 'revert', 'go back', 'ctrl z', 'step back'],
  shortcut: 'Cmd+Z',
}
```

## Dangerous Intents

Set `dangerous: true` for intents that perform destructive or irreversible actions. The execution layer can require confirmation before running.

```tsx
{
  commandId: 'editor:delete-all',
  title: 'Delete All Objects',
  description: 'Remove all objects from the canvas. This cannot be undone.',
  category: 'edit',
  keywords: ['delete all', 'clear canvas', 'remove everything'],
  dangerous: true,
}
```

## The Intent Catalog

The shell aggregates all app intents into an `IntentCatalog`:

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

The `index` field provides a flat lookup from `commandId` to the owning app and intent. This makes it fast for agents to resolve which app handles a given command.

### CatalogAppEntry

```ts
interface CatalogAppEntry {
  appId: string;
  appName: string;
  appDescription: string;
  intents: AppIntent[];
}
```

## Real-World Example: Shaper Intents

The Shaper reference app declares intents across multiple categories:

```tsx
import type { AppIntent } from '@hudsonos/sdk';

export const shaperIntents: AppIntent[] = [
  // Tools
  {
    commandId: 'shaper:select-tool',
    title: 'Switch to Select Tool',
    description: 'Activate the selection tool for picking and moving anchor points.',
    category: 'tool',
    keywords: ['select', 'pointer', 'cursor', 'pick', 'arrow'],
    shortcut: 'V',
  },
  {
    commandId: 'shaper:pen-tool',
    title: 'Switch to Pen Tool',
    description: 'Activate the pen tool for drawing new bezier curve anchor points.',
    category: 'tool',
    keywords: ['pen', 'draw', 'bezier', 'add point', 'create'],
    shortcut: 'P',
  },

  // Edit
  {
    commandId: 'shaper:undo',
    title: 'Undo',
    description: 'Undo the last editing action in the bezier editor.',
    category: 'edit',
    keywords: ['undo', 'revert', 'go back', 'ctrl z'],
    shortcut: 'Cmd+Z',
  },

  // File
  {
    commandId: 'shaper:save',
    title: 'Save Project',
    description: 'Save the current bezier project to local storage.',
    category: 'file',
    keywords: ['save', 'store', 'persist', 'quick save'],
    shortcut: 'Cmd+S',
  },

  // View
  {
    commandId: 'shaper:toggle-grid',
    title: 'Toggle Grid',
    description: 'Show or hide the background grid on the canvas.',
    category: 'view',
    keywords: ['grid', 'gridlines', 'show grid', 'background grid'],
  },

  // Toggle
  {
    commandId: 'shaper:toggle-animation',
    title: 'Toggle Animation Mode',
    description: 'Enable or disable animation mode for previewing path animations.',
    category: 'toggle',
    keywords: ['animation', 'animate', 'motion', 'preview animation'],
    shortcut: 'T',
  },
];
```

## Best Practices

1. **One intent per command.** Each intent maps to exactly one `CommandOption`.
2. **Write descriptions for humans and LLMs.** Be specific about what the action does and when to use it.
3. **Include 4-6 keywords.** Cover the primary term, synonyms, and common natural-language phrasings.
4. **Namespace commandIds.** Use the pattern `appId:action` (e.g., `shaper:save`).
5. **Use categories consistently.** Tools switch modes, edits change data, views toggle visibility.
6. **Mark destructive actions as dangerous.** Deletion, clearing, and reset actions should require confirmation.
