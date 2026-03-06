# Theme

Hudson uses a consolidated design token system called `SHELL_THEME` for all shell chrome components. The theme defines Tailwind CSS classes, z-index layers, and layout measurements.

## SHELL_THEME

Import the theme tokens:

```tsx
import { SHELL_THEME } from '@hudsonos/sdk';
```

### Structure

```ts
const SHELL_THEME = {
  tokens: {
    blur: 'backdrop-blur-xl',
    bg: 'bg-neutral-950/95',
    border: 'border border-neutral-700/80',
    shadow: 'shadow-[0_0_30px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.08)]',
    topHighlight: 'before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent',
  },
  base: string,  // Combined: bg + blur + border + shadow
  panels: { ... },
  effects: { ... },
  zIndex: { ... },
  layout: { ... },
};
```

### tokens

Atomic Tailwind class groups for composing custom surfaces.

| Token | Classes | Usage |
|-------|---------|-------|
| `blur` | `backdrop-blur-xl` | Glass-morphism backdrop blur |
| `bg` | `bg-neutral-950/95` | Near-opaque dark background |
| `border` | `border border-neutral-700/80` | Subtle border |
| `shadow` | Complex box-shadow | Depth + inner highlight |
| `topHighlight` | Pseudo-element gradient | Top-edge light reflection |

### base

The combined base style for panels and overlays:

```
bg-neutral-950/95 backdrop-blur-xl border border-neutral-700/80 shadow-[...]
```

Use this as a starting point when building custom panels that match the shell style:

```tsx
<div className={`${SHELL_THEME.base} rounded-lg p-4`}>
  Custom panel content
</div>
```

### panels

Pre-composed class strings for each shell region.

| Panel | Description |
|-------|-------------|
| `navigationStack` | Top navigation bar container |
| `manifest` | Left sidebar panel |
| `inspector` | Right sidebar panel |
| `minimap` | Minimap overlay (bottom-left) |
| `statusBar` | Bottom status bar |
| `commandDock` | Command dock (bottom-right) |

### effects

Utility class strings for edge effects.

| Effect | Description |
|--------|-------------|
| `rightFade` | Right-edge fade gradient (pseudo-element) |
| `leftFade` | Left-edge fade gradient (pseudo-element) |
| `bottomGlow` | Bottom-edge glow gradient (pseudo-element) |

### zIndex

Z-index values for layering.

| Layer | Value | Usage |
|-------|-------|-------|
| `canvas` | `0` | Canvas background |
| `worldContent` | `10` | Content rendered in world space |
| `panels` | `40` | Side panels |
| `minimap` | `45` | Minimap overlay |
| `navigationStack` | `50` | Navigation bar |
| `statusBar` | `60` | Status bar |
| `drawer` | `70` | Bottom drawer (terminal) |
| `modals` | `100` | Modals and command palette |

When positioning custom overlays, use these values to ensure correct stacking:

```tsx
<div style={{ zIndex: SHELL_THEME.zIndex.modals }}>
  My overlay
</div>
```

### layout

Pixel measurements for shell chrome regions.

| Measurement | Value | Description |
|-------------|-------|-------------|
| `navHeight` | `48` | Navigation bar height (before platform inset) |
| `panelWidth` | `280` | Side panel width |
| `panelTopOffset` | `48` | Top offset for panels (same as navHeight) |
| `statusBarHeight` | `28` | Status bar height |
| `panelBottomOffset` | `28` | Bottom offset for panels (same as statusBarHeight) |

For platform-aware layout values, use `usePlatformLayout()` instead of reading these directly. The hook adds the native title bar inset.

## Tailwind CSS v4 Setup

Hudson uses Tailwind CSS v4. To ensure Tailwind scans the SDK's classes, add a `@source` directive in your CSS:

```css
@import "tailwindcss";
@source "../node_modules/@hudsonos/sdk/dist/**/*.js";
```

This tells Tailwind to scan the SDK's compiled output for class names.

## Scrollbar Styles

The SDK ships a CSS file with dark-themed scrollbar styles for panels. Import it in your app:

```css
@import "@hudsonos/sdk/styles.css";
```

This provides the `.frame-scrollbar` class:

```tsx
<div className="frame-scrollbar overflow-auto">
  Scrollable content with styled scrollbars
</div>
```

The styles apply:
- A 4px-wide scrollbar track (transparent background)
- A subtle white/12% thumb with rounded corners
- A brighter white/22% thumb on hover
- Firefox-compatible `scrollbar-width: thin` and `scrollbar-color`

## Color Guidelines

Hudson's design language uses a dark neutral palette with cool accent colors.

**Do use:**
- `cyan` / `blue` / `teal` / `emerald` for accents and highlights
- `neutral-950` through `neutral-400` for backgrounds and text
- Semi-transparent whites (`white/5`, `white/10`) for hover states

**Do not use:**
- Purple tones
- Bright saturated backgrounds
- Pure white text (prefer `neutral-200` or `neutral-300`)

### Status Colors

The shell uses these semantic colors for status indicators:

| Color | Tailwind Class | Meaning |
|-------|---------------|---------|
| Emerald | `text-emerald-400` | Ready, success, healthy |
| Amber | `text-amber-400` | In progress, warning |
| Red | `text-red-400` | Error, failure |
| Neutral | `text-neutral-400` | Inactive, idle |

## Example: Custom Panel

Build a panel that matches the shell aesthetic:

```tsx
import { SHELL_THEME } from '@hudsonos/sdk';

function CustomOverlay() {
  return (
    <div
      className={`${SHELL_THEME.base} rounded-lg p-4 fixed`}
      style={{ zIndex: SHELL_THEME.zIndex.modals }}
    >
      <h3 className="text-sm font-medium text-neutral-200 mb-2">
        Custom Panel
      </h3>
      <p className="text-xs text-neutral-400">
        This panel uses SHELL_THEME tokens for a consistent look.
      </p>
    </div>
  );
}
```
