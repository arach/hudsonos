# Hudson

Multi-app canvas workspace for AI apps.

Build apps with Provider + Slots + Hooks. Compose them into spatial workspaces with pan, zoom, and windowing.

**[hudsonos.com](https://hudsonos.com)** · **[Demo](https://app.hudsonos.com/demo)** · **[Docs](https://app.hudsonos.com/docs)** · **[Releases](https://hudsonos.com/releases)**

## What is Hudson?

Hudson is a desktop workspace environment where multiple apps run side-by-side on an infinite canvas. Each app is a standalone React component that plugs into the shell through a simple interface — a Provider for state, Slots for UI regions, and Hooks for commands, status, and search.

Apps can be dragged, resized, and arranged spatially. The workspace provides a unified command palette, terminal, and inspector that aggregate across all running apps.

## Download

Hudson is available as a macOS desktop app, code-signed and notarized by Apple.

Download the latest `.dmg` from the [releases page](https://hudsonos.com/releases).

## The HudsonApp Interface

```typescript
export interface HudsonApp {
  id: string;
  name: string;
  description?: string;
  mode: 'canvas' | 'panel';

  Provider: React.FC<{ children: ReactNode }>;

  slots: {
    Content: React.FC;
    LeftPanel?: React.FC;
    Inspector?: React.FC;
    Terminal?: React.FC;
  };

  hooks: {
    useCommands: () => CommandOption[];
    useStatus: () => { label: string; color: StatusColor };
    useSearch?: () => SearchConfig;
  };
}
```

Implement this interface and your app runs in any Hudson workspace.

## This Repository

This repo contains the Hudson marketing site — a static Next.js site deployed to GitHub Pages.

### Development

```bash
bun install
bun dev
```

### Build

```bash
bun run build    # Static export to out/
```

### OG Images

```bash
bun run og       # Regenerate all OG images
```

### Structure

```
app/
  page.tsx              # Landing page
  releases/page.tsx     # Releases (fetches from GitHub API)
  demo/page.tsx         # Demo / preview page
  _landing/             # Shared landing components
    Hero.tsx
    NavHeader.tsx
    Footer.tsx
    Features.tsx
    CodePreview.tsx
    GlyphWaves.tsx      # WebGL background
    ...
public/
  og.png                # Main OG image
  og-releases.png       # Releases OG image
  og-demo.png           # Demo OG image
  demo/hero.png         # Hero screenshot
  fonts/                # AstroMono, GeistMono, JetBrainsMono
```

## Links

- **Website**: [hudsonos.com](https://hudsonos.com)
- **App**: [app.hudsonos.com](https://app.hudsonos.com)
- **Docs**: [app.hudsonos.com/docs](https://app.hudsonos.com/docs)
- **Releases**: [hudsonos.com/releases](https://hudsonos.com/releases)
- **GitHub**: [github.com/arach/hudson](https://github.com/arach/hudson) (private — access by request)
