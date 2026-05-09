# Hudson Embed Primitive — RFC v0.3

**Status:** consumer side shipped (POC); Hudson side outstanding
**Date:** 2026-05-07
**Source:** Hudson (`hudson.codex-image-process-lab-exports.mini`) via Scout, conversation `dm.hudson.codex-image-process-lab-exports.mini.hudsonos.main.mini`
**Work item:** `work-mousdekx-3m6eye`

> v0.2 → v0.3 promotes the workspace mock at `/embed/workspace` to the **surface contract** (visual + structural target Hudson should match in spirit, not pixel-perfect), expands the host→embed handshake from `theme-sync` (palette + fonts only) to a richer `embed-context` (palette + fonts + layout hints + surface + workspace context), and reframes the consumer-side as the source of truth for *what should appear* — Hudson supplies *real components* that satisfy that contract.

## v0.3 deltas at a glance

| Concern | v0.2 | v0.3 |
|---|---|---|
| Host → embed message | `hudson:theme-sync` (palette + fonts) | `hudson:embed-context` (palette + fonts + layout + surface + context); `theme-sync` retained for incremental updates |
| Surface contract | RFC prose | live mock at `/embed/workspace` + `app/embed/workspace/page.tsx` JSX as structural blueprint |
| Embed authoring expectation | "render the surface" | render *real Hudson components* themed/sized to host context, hitting roughly the same sections at roughly the same density as the mock |
| Fallback when Hudson is offline | not addressed | host-side mock keeps rendering; host swaps iframe `src` to Hudson when ready |

---

Folds all three pushbacks, closes opens 1 & 5, adds extensions A/B/C. Strikethrough on what changed from v0.1.

---

### 1. Manifest — unchanged from v0.1

```typescript
interface HudsonApp {
  // ... existing fields ...
  exports?: {
    embeds?: EmbedSurface[];
  };
}

interface EmbedSurface {
  id: string;
  name: string;
  slot: keyof HudsonApp['slots'] | React.FC;
  sizing: EmbedSizing;
  interactive?: boolean;       // default true
  chromeless?: boolean;        // default true
  themeMode?: 'inherit' | 'fixed';  // default 'inherit'
}

type EmbedSizing =
  | { mode: 'fixed'; width: number; height: number }
  | { mode: 'responsive'; aspectRatio?: string; minHeight?: number }
  | { mode: 'fill' };
```

### 2. Handshake — v0.3: `embed-context` (was `theme-sync`)

**Pushback 1 accepted.** The embed route speaks only `--hud-*` tokens. Consumers translate outbound.

**Layer A: URL params (static, first paint)**
Unchanged. `?theme=dark&template=hudson` on the iframe src.

**Layer B: postMessage (dynamic, live context)**

v0.3 expands the host→embed message from theme-only to a full render context the embed can act on. Hudson's real components consume this to choose layout density, scope to the right workspace/instance, and theme themselves with the host's palette + fonts.

```typescript
// Protocol — host → embed sends a full context once on embed-ready,
// then incremental theme-sync updates as host theme changes live.
type EmbedMessage =
  | { type: 'hudson:embed-context'; context: EmbedContext }       // host → embed (full context, on embed-ready)
  | { type: 'hudson:theme-sync'; vars: Record<string, string> }   // host → embed (--hud-* only, incremental)
  | { type: 'hudson:embed-ready'; surfaceId: string; sizing: EmbedSizing }   // embed → host
  | { type: 'hudson:embed-resize'; width: number; height: number };          // embed → host (responsive only)

interface EmbedContext {
  /** Color tokens — only --hud-* keys are honored by the embed route. */
  palette: Record<string, string>;

  /** Typography tokens — --hud-font-display / --hud-font-body / --hud-font-mono. */
  fonts: Record<string, string>;

  /** Layout hints. Embed picks components + density to fit. */
  layout: {
    width: number;
    height: number;
    density?: 'compact' | 'cozy' | 'comfy';
    sizing: EmbedSizing;
    /** Optional structural expectations — host signals which sections it expects.
        Embed may honor or omit; this is a hint, not a hard contract. */
    expects?: {
      manifestPanel?: boolean;
      heroPinned?: boolean;
      inspector?: boolean;
      buildStrip?: boolean;
      legend?: boolean;
    };
  };

  /** Which embed surface — maps to exports.embeds[i].id on the manifest. */
  surface: string;

  /** Render context — what to actually show. */
  context: {
    workspace?: string;       // 'self' | 'talkie' | 'lattices' | ... — which workspace to render
    instance?: string;        // for multi-instance surfaces
    template?: string;        // 'hudson' | 'minimal' | ... — first-paint visual preset
    ref?: string;             // ref-handle for state restore (see §7)
    locale?: string;
  };
}

// Embed-side listener (injected by embed route)
window.addEventListener('message', (e) => {
  if (!isAllowedOrigin(e.origin)) return;  // fail closed — see §8

  if (e.data.type === 'hudson:embed-context') {
    const ctx = e.data.context as EmbedContext;
    applyTokens(ctx.palette);            // --hud-* color tokens
    applyTokens(ctx.fonts);              // --hud-font-*
    setDensity(ctx.layout.density);      // 'compact' | 'cozy' | 'comfy'
    mountSurface(ctx.surface, ctx.context);  // pick components, scope to workspace
  } else if (e.data.type === 'hudson:theme-sync') {
    applyTokens(e.data.vars);            // incremental theme updates
  }

  function applyTokens(vars: Record<string, string>) {
    for (const [k, v] of Object.entries(vars ?? {})) {
      if (!k.startsWith('--hud-')) continue;  // reject non-hud vars
      document.documentElement.style.setProperty(k, v);
    }
  }
});
```

**Consumer-side translation (marketing site example):**

```typescript
// _site/lib/embed.ts — marketing site owns this mapping
const SITE_TO_HUD: Record<string, string> = {
  '--paper': '--hud-bg',
  '--ink': '--hud-ink',
  '--accent': '--hud-accent',
  '--stroke-w': '--hud-border-width',
  '--font-display': '--hud-font-display',
};

export function syncThemeToEmbed(iframe: HTMLIFrameElement, siteVars: Record<string, string>) {
  const hudVars: Record<string, string> = {};
  for (const [siteKey, value] of Object.entries(siteVars)) {
    const hudKey = SITE_TO_HUD[siteKey];
    if (hudKey) hudVars[hudKey] = value;
  }
  iframe.contentWindow?.postMessage({ type: 'hudson:theme-sync', vars: hudVars }, targetOrigin);
}
```

N consumers, N mapping files, zero bloat on the embed route. Hudson never learns about `--paper`.

### 3. Resize Protocol — v0.2: authority gated by sizing mode

**Pushback 2 accepted.** Authority depends on profile:

| `sizing.mode` | Authority | Behavior |
|---|---|---|
| `fixed` | **Host** | Host sets iframe dimensions from manifest. Embed does not send resize. |
| `fill` | **Host** | Host sets iframe to 100% of container. Embed does not send resize. |
| `responsive` | **Embed** | Embed sends authoritative `embed-resize` with its natural content size. Host applies it (may clamp to max-width/max-height but does not override aspect). |

```typescript
// Embed-side (responsive surfaces only)
function reportNaturalSize() {
  const rect = contentRef.current?.getBoundingClientRect();
  if (rect && sizing.mode === 'responsive') {
    window.parent.postMessage({
      type: 'hudson:embed-resize',
      width: Math.ceil(rect.width),
      height: Math.ceil(rect.height),
    }, '*');  // host validates on receive
  }
}
```

Host-side `<HudsonEmbed>` applies received dimensions for `responsive` surfaces, ignores for `fixed`/`fill`.

### 4. Package Split — v0.2: `@hudson/embed-react`

**Pushback 3 accepted.** Separate package, zero Hudson runtime deps.

```
@hudson/embed-react          ← new package
├── src/
│   ├── HudsonEmbed.tsx      ← iframe wrapper + postMessage protocol
│   ├── protocol.ts          ← message types, origin validation
│   ├── ref.ts               ← ref resolver (fetch /api/refs/<id>)
│   └── index.ts
├── package.json             ← deps: react (peer only). No hudsonkit.
└── tsconfig.json
```

`hudsonkit` re-exports for first-party convenience:

```typescript
// packages/web/hudsonkit/src/embed.ts
export { HudsonEmbed, type HudsonEmbedProps } from '@hudson/embed-react';
```

Talkie, Lattices, blog, social-card generators can `npm i @hudson/embed-react` without pulling hudsonkit's bundle.

### 5. Hosted vs SDK — Extension A

Same manifest, two rendering strategies:

```typescript
interface HudsonEmbedProps {
  // ... sizing, theme, className, style, onReady ...
  
  /** Render mode */
  mode?: 'hosted' | 'sdk' | 'auto';
  
  // Hosted mode (iframe)
  src?: string;               // URL to /embed/... route
  
  // SDK mode (in-tree render)
  app?: HudsonApp;            // Direct app reference
  surface?: string;           // Surface ID from exports.embeds
}
```

| Mode | Renders | Dependencies | Use case |
|---|---|---|---|
| `hosted` | `<iframe src="...">` | `@hudson/embed-react` only | Blog, marketing, agent URLs, low-effort |
| `sdk` | `<app.Provider>` + slot directly in consumer's React tree | `@hudson/embed-react` + `hudsonkit` + the app package | Internal tools, offline, load-bearing integrations |
| `auto` | SDK if `app` prop provided, hosted otherwise | Varies | Convenience default |

**SDK mode** renders the Provider + slot inline — no iframe, no postMessage, full React context sharing. Theme is inherited from the consumer's own ThemeProvider (or overridden via props). This is higher fidelity (no iframe boundary, shared event loop, accessible DOM) but requires the consumer to bundle the app code.

**Hosted mode** is the universal fallback. Any URL, any consumer, any framework — just an iframe.

### 6. Share UX — Extension B

Ships as part of Hudson core (not marketing-site-specific).

**Command palette integration:**
Apps with `exports.embeds` get a "Share as embed" command auto-registered. Filtered to the current app's declared surfaces.

**Share sheet component** (`hudsonkit/src/components/ShareSheet.tsx`):

```typescript
interface ShareSheetProps {
  app: HudsonApp;
  surface: EmbedSurface;
  instanceId?: string;      // For multi-instance apps
  ref?: string;             // Pre-populated ref ID (for artifact shares)
}
```

Three tabs:

| Tab | Output | Note shown |
|---|---|---|
| **iframe** | `<iframe src="https://hudsonos.com/embed/logo-designer/output?ref=ref_3a8f" ...>` | "Hosted — no install, requires hudsonos.com" |
| **React** | `<HudsonEmbed src="..." surface="output" theme="dark" />` | "SDK — full control, requires @hudson/embed-react" |
| **URL** | `https://hudsonos.com/embed/logo-designer/output?ref=ref_3a8f` | "Bare link — markdown, agents, QR" |

**Per-artifact share button:**
Artifact embeds (logo, motion component, arc diagram) surface a share button on the artifact itself. Triggers the share sheet pre-filled with the artifact's ref.

**"Share with @agent" action:**
Sends the URL through Scout. Uses `scout send` (not `ask` — per existing feedback, `ask` times out at ~5min). The URL is self-describing — receiver can open it without needing the message body to explain it.

### 7. Ref-Handle Protocol — Extension C

URLs stay short. Payloads live server-side.

```
https://hudsonos.com/embed/logo-designer/output?ref=ref_3a8f2c
```

**Ref payload shape:**

```typescript
interface EmbedRef {
  id: string;                          // ref_3a8f2c
  from: string;                        // Scout agent ID or user handle
  createdAt: string;                   // ISO 8601
  intent: 'continue' | 'fork' | 'discuss' | 'view';
  prompt?: string;                     // Pre-fill instruction
  context: {
    appId: string;
    surface: string;
    instance?: string;                 // For multi-instance apps
    state?: Record<string, unknown>;   // Serialized app state snapshot
  };
  files?: string[];                    // ref://attachments/... URIs
  signature?: string;                  // Provenance verification
  ttl?: number;                        // Seconds until expiry (0 = permanent)
}
```

**Where refs live — two stores, unified protocol:**

| Store | Used by | Endpoint | Lifecycle |
|---|---|---|---|
| **Hudson API** | Human shares, marketing site | `POST /api/refs` → id, `GET /api/refs/<id>` → payload | Hudson-managed, persisted |
| **Scout broker** | Agent shares | Broker payload kind `embed-ref` | Broker-managed, follows broker retention |

`<HudsonEmbed>` doesn't care which store — it does `fetch(refUrl)` and trusts the response shape. The `ref` query param is a short ID; the embed route resolves it to a full payload via whichever store minted it.

**Static export constraint for refs:**
`/api/refs` is a runtime endpoint — incompatible with `output: "export"`. Two options:
- **v1:** Refs are optional. Static embeds work without them (no `?ref=` param). Ref resolution requires a deployed Hudson instance or the Scout broker.
- **v2:** A build-time ref bake: `scripts/bake-refs.ts` reads a manifest of known refs and writes them to `public/refs/<id>.json`. Static fetch works. New refs require rebuild or external store.

**Leaning v1** — refs are a progressive enhancement. Embeds without refs are fully functional (just no pre-applied state or provenance). Refs unlock richer handoffs but don't gate basic embedding.

**Scout as ref transport:**

```
// Agent A finishes a logo, shares it with Agent B
scout send --to agentB.mini "embed live: hudsonos.com/embed/logo-designer/output?ref=ref_xy12"

// Agent B opens the URL — sees the logo, provenance ("from agentA.mini · 2m ago"), 
// pre-applied state, and the prompt "Make this more minimal"
```

The ref payload's `from` field is the Scout agent ID. Receivers know who sent it without trusting the URL host. `signature` field enables verification if the broker signs refs.

### 8. Origin Allowlist — Open 1 closed

**Decided: fail closed, day one.**

```typescript
// Embed route: origin validation
const ALLOWED_ORIGINS = new Set([
  typeof window !== 'undefined' ? window.location.origin : '',  // same-origin always allowed
  ...parseOriginList(process.env.NEXT_PUBLIC_HUDSON_EMBED_ORIGINS ?? ''),
]);

function isAllowedOrigin(origin: string): boolean {
  if (ALLOWED_ORIGINS.has(origin)) return true;
  if (ALLOWED_ORIGINS.has('*')) return true;  // dev escape hatch
  return false;  // fail closed
}
```

Dev default: `NEXT_PUBLIC_HUDSON_EMBED_ORIGINS=http://localhost:3000,http://localhost:3500` (covers marketing site + Hudson dev ports). Production: explicit allowlist per deployment.

### 9. SSG Rebuild — Open 5 closed

**Decided: acceptable for v1, with dev-mode escape.**

```typescript
// app/embed/[appId]/[surface]/page.tsx
export function generateStaticParams() {
  // Enumerate all embeddable surfaces from the registry
  return getAllApps()
    .filter(app => app.exports?.embeds?.length)
    .flatMap(app => 
      app.exports!.embeds!.map(surface => ({
        appId: app.id,
        surface: surface.id,
      }))
    );
}
```

**Dev mode:** `bun dev` serves dynamic routes — no `generateStaticParams` needed. Embeds enumerate dynamically via the registry. Hot reload works.

**Prod build:** `bun run build` statically generates all embed pages from the registry. Adding/removing embeds requires rebuild. This is the same cost as adding a new page to any static site — acceptable.

**Follow-up flag:** If embed count grows past ~50 or if external consumers need to register embeds without rebuilding Hudson, revisit with ISR or a dynamic fallback route behind a feature flag. Not v1.

### 10. What Ships Where — Updated

| Component | Package / Location | Deps | Rationale |
|---|---|---|---|
| `EmbedSurface` type + `exports` field | `hudsonkit` types | None | Core app contract |
| `/embed/[appId]/[surface]` route | Hudson app (`app/embed/`) | hudsonkit, registry | Runtime rendering |
| postMessage listener + origin guard | Embed route (inline) | None | Core embed security |
| `<HudsonEmbed>` component | **`@hudson/embed-react`** | react (peer) | Standalone consumer package |
| `protocol.ts` (message types) | `@hudson/embed-react` | None | Shared contract |
| `ref.ts` (ref resolver) | `@hudson/embed-react` | None | Fetch + parse |
| Re-export of `<HudsonEmbed>` | `hudsonkit/src/embed.ts` | `@hudson/embed-react` | First-party convenience |
| `ShareSheet` component | `hudsonkit` | hudsonkit internals | In-app share UX |
| "Share as embed" command | Auto-registered by shell for apps with `exports.embeds` | hudsonkit | Discovery |
| `/api/refs` endpoint | Hudson app (`app/api/refs/`) | Storage TBD | Ref store (runtime only) |
| Scout `embed-ref` payload kind | Scout broker | Broker internals | Agent-to-agent ref transport |
| `SITE_TO_HUD` mapping | Marketing site (`_site/lib/embed.ts`) | None | Consumer-specific translation |
| `build-embed-stats.ts` | Hudson build scripts | Registry | KPI tile data |
| Sheet01/02 embed wiring | Marketing site (`_site/`) | `@hudson/embed-react` | Site-specific consumer |
| Per-app embed declarations | Each app's `index.ts` | hudsonkit types | App-specific |

### 11. Still Open (by design)

| # | Question | Status |
|---|---|---|
| 3 | Instance default-singleton for artifact embeds | Open — singleton default is fine for v1; multi-instance `?instance=<id>` param spec'd but untested |
| 4 | Resize advisory wording | Open — v0.2 split authority by sizing mode; exact clamping behavior TBD per consumer |
| 6 | WorkspaceShell empty-canvas behavior | Open — does `/embed/workspace` with no focused app show an empty canvas, a grid of app icons, or the boot animation? Needs design input |

### 12. Surface Contract — `/embed/workspace` (v0.3)

The hudsonos consumer side ships a working iframe-based embed at `/embed/workspace` whose **structure and density** define what the real Hudson-side embed should render. Hudson's version uses real components (real `<WorkspaceShell>`, `<ManifestPanel>`, `<CapabilityMap>`, `<RuntimeInspector>`) and will look different — this is intended — but should hit roughly the same sections at roughly the same density and feel.

**Live URL:** `https://hudsonos.com/embed/workspace` (hudsonos repo, branch `homepage-polish`, file `app/embed/workspace/page.tsx`).

**Sections the surface contract expects (workspace surface, density `comfy`):**

| Section | Mock content (placeholder data) | Real Hudson source |
|---|---|---|
| Top bar | `H hudson` brand · breadcrumbs (manifest / canvas / inspector / install) · `workspace · self` · ⌘K · install button | Hudson's actual NavigationBar primitive |
| Manifest panel (left, ~240px) | manifest.ts text dump · apps list · primitives list · "this panel is rendered by `<SidePanel side='left' />`" caption | Real `<ManifestPanel>` reading the actual workspace manifest |
| Hero pinned (center) | "HERO · pinned" tab badge · "You are inside a Hudson app" eyebrow · "This page is built *with itself.*" headline · body copy · two CTAs | Real `<HeroPinned>` or first-class app hero primitive |
| Inspector (right, ~260px) | capability map (5-node graph) · runtime stats table (uptime, intents, commands, services, ai.provider, ai.model, voice, theme) · log feed with blinking cursor | Real `<CapabilityMap>` + `<RuntimeInspector>` + `<LogFeed>` |
| Build strip (bottom) | DECLARE → WIRE → COMPOSE → SHIP — 4 step cards, each with a numbered badge, a one-sentence body, and a code snippet | Real `<BuildSequence>` or onboarding primitive |
| Legend (footer) | ① capability map · ② command dock · ③ status bar · ④ canvas · pan/zoom | Same — registration footer for the embed plate |

**Feel notes (non-binding but hold the line on):**

- **Density:** mono-typeset, 10–11px body text, generous whitespace inside panels but tight vertical rhythm. Engineering-drawing adjacent.
- **Color discipline:** one accent color (default emerald `oklch(0.72 0.18 162)`), used sparingly — brand badge, primary CTA, italic emphasis, "ok" log line, capability-map active node. Everything else is ink-on-dark.
- **Typography:** display serif for the headline (1 line, italic accent on the verb-phrase), mono for everything else. No sans body text in the embed itself.
- **Borders:** 1px dim lines between panels, 1px accent border around the hero frame, no rounded corners > 2px.
- **Liveness signals:** pulsing live-dot on the manifest panel head, blinking cursor at end of log, accent-soft halo on active capability-map nodes.

**What "parity" means here:**
- ✅ Real components rendering the same six sections in the same arrangement
- ✅ Real workspace data (real manifest, real intents/commands counts, real log)
- ✅ Host's palette + fonts applied via `embed-context`
- ✅ Roughly the same vertical density (within ~20%)
- ❌ Pixel-perfect match to the mock — Hudson's components will look different, that's fine
- ❌ Carrying over the mock's specific copy ("This page is built with itself.") — Hudson should pick its own hero copy

The mock at `/embed/workspace` stays as the **fallback** when Hudson's deployment isn't reachable. Host code: `<HudsonEmbed src="/embed/workspace" surface="workspace" sizing={{ mode: 'fill' }} />` becomes `<HudsonEmbed src="https://hudsonos.com/embed/workspace" ... />` (or eventually the Hudson-app origin) once Hudson ships. One-line swap.

### 13. Implementation Order

Logo Designer as first artifact embed, as proposed:

1. **`EmbedSurface` type** → add to `HudsonApp` in hudsonkit
2. **`/embed/[appId]/[surface]` route** → minimal shell, theme listener, origin guard
3. **`@hudson/embed-react` package** → `<HudsonEmbed>` + protocol + ref resolver
4. **Logo Designer embed declaration** → `exports: { embeds: [{ id: 'output', slot: LogoArtifactEmbed, sizing: { mode: 'responsive', aspectRatio: '1/1' }, interactive: false, chromeless: true }] }`
5. **ShareSheet + command palette wiring** → "Share as embed" for any app with exports
6. **`build-embed-stats.ts`** → KPI tile data for Sheet01
7. **Marketing site wiring** → Sheet02 (workspace embed), Sheet01 (KPI tile)
8. **Ref protocol** → `/api/refs` endpoint + Scout `embed-ref` payload kind

Steps 1–4 are the primitive. 5–6 are first-party UX. 7–8 are integration. Each step is independently shippable.

---

Contract is ready to implement. Logo Designer artifact embed is the right first target — it has port output already, it's a clean responsive/chromeless/non-interactive surface, and it exercises the manifest + route + host-component stack end-to-end without needing WorkspaceShell complexity. Say the word and I'll start with steps 1–3 (type, route, package).