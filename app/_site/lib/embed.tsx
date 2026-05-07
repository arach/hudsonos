'use client';

import { CSSProperties, useCallback, useEffect, useRef, useState } from 'react';

export type EmbedSizing =
  | { mode: 'fixed'; width: number; height: number }
  | { mode: 'responsive'; aspectRatio?: string; minHeight?: number }
  | { mode: 'fill' };

export type EmbedDensity = 'compact' | 'cozy' | 'comfy';

export interface EmbedContext {
  /** Hudson `--hud-*` color tokens. */
  palette: Record<string, string>;
  /** Hudson `--hud-font-*` typography tokens. */
  fonts: Record<string, string>;
  /** Layout hints — embed picks components / density to fit. */
  layout: {
    width: number;
    height: number;
    density?: EmbedDensity;
    sizing: EmbedSizing;
    /** Hint to the embed about which sections the host expects. Non-binding. */
    expects?: {
      manifestPanel?: boolean;
      heroPinned?: boolean;
      inspector?: boolean;
      buildStrip?: boolean;
      legend?: boolean;
    };
  };
  /** Embed surface ID (matches `exports.embeds[i].id` on a Hudson manifest). */
  surface: string;
  /** Render context — what the embed should actually show. */
  context: {
    workspace?: string;
    instance?: string;
    template?: string;
    ref?: string;
    locale?: string;
  };
}

export type HudsonEmbedProps = {
  src: string;
  surface: string;
  sizing?: EmbedSizing;
  /** Layout density hint. Default: `comfy`. */
  density?: EmbedDensity;
  /** Which workspace to render. Default: `self`. */
  workspace?: string;
  /** Multi-instance disambiguator. */
  instance?: string;
  /** First-paint visual preset. */
  template?: string;
  /** Ref-handle for state restore. */
  refHandle?: string;
  /** Consumer identity — Hudson uses this to look up registered config
   *  (theme, palette, fonts, default workspace) on its side. Sent as `?ref=`
   *  on the iframe URL. */
  consumerId?: string;
  /** Section expectations (hint, not contract). */
  expects?: EmbedContext['layout']['expects'];
  className?: string;
  style?: CSSProperties;
  title?: string;
  /** Map of host CSS variables → Hudson `--hud-*` tokens. */
  themeMap?: Record<string, string>;
  /** Element selector whose computed styles are read as the theme source.
   *  Default: `.hudson-site`, falling back to `:root`. */
  themeFrom?: string;
};

const DEFAULT_THEME_MAP: Record<string, string> = {
  '--paper': '--hud-bg',
  '--paper-2': '--hud-bg-2',
  '--paper-3': '--hud-bg-3',
  '--ink': '--hud-ink',
  '--ink-1': '--hud-ink-1',
  '--ink-2': '--hud-ink-2',
  '--ink-3': '--hud-ink-3',
  '--line': '--hud-line',
  '--line-strong': '--hud-line-strong',
  '--accent': '--hud-accent',
  '--accent-soft': '--hud-accent-soft',
  '--accent-line': '--hud-accent-line',
  '--stroke-w': '--hud-border-width',
};

const DEFAULT_FONT_MAP: Record<string, string> = {
  '--font-display': '--hud-font-display',
  '--font-body': '--hud-font-body',
  '--font-mono': '--hud-font-mono',
};

function readVars(el: Element, map: Record<string, string>): Record<string, string> {
  const computed = getComputedStyle(el);
  const out: Record<string, string> = {};
  for (const [src, dest] of Object.entries(map)) {
    const v = computed.getPropertyValue(src).trim();
    if (v) out[dest] = v;
  }
  return out;
}

export function HudsonEmbed({
  src,
  surface,
  sizing = { mode: 'fill' },
  density = 'comfy',
  workspace = 'self',
  instance,
  template,
  refHandle,
  consumerId,
  expects,
  className,
  style,
  title,
  themeMap = DEFAULT_THEME_MAP,
  themeFrom,
}: HudsonEmbedProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [reportedHeight, setReportedHeight] = useState<number | null>(null);

  const targetOrigin = (() => {
    try {
      if (typeof window === 'undefined') return '*';
      return new URL(src, window.location.origin).origin;
    } catch {
      return '*';
    }
  })();

  // Build the iframe URL with first-paint runtime params.
  // - ?ref=<consumerId>   → server-side registry lookup (theme/fonts/workspace/palette)
  // - ?mode=<sizing.mode> → sizing intent
  // - ?sizex=, ?sizey=    → known dimensions (only for fixed mode)
  // - ?density=           → per-slot layout density
  // postMessage carries live updates after mount, not first paint.
  const iframeSrc = (() => {
    try {
      const isAbsolute = /^https?:\/\//i.test(src);
      const url = new URL(src, typeof window === 'undefined' ? 'http://localhost' : window.location.origin);
      if (consumerId) url.searchParams.set('ref', consumerId);
      url.searchParams.set('mode', sizing.mode);
      if (sizing.mode === 'fixed') {
        url.searchParams.set('sizex', String(sizing.width));
        url.searchParams.set('sizey', String(sizing.height));
      }
      if (density) url.searchParams.set('density', density);
      // Surface is in the path on Hudson's route, but echoing here lets
      // single-segment routes (our local mock) pick it up too.
      url.searchParams.set('surface', surface);
      // Preserve the absolute-vs-relative character of the input src so
      // SSR/CSR agree and we don't lose cross-origin host info.
      return isAbsolute ? url.toString() : url.pathname + url.search;
    } catch {
      return src;
    }
  })();

  const buildPalette = useCallback(() => {
    const sourceEl =
      (themeFrom && document.querySelector(themeFrom)) ||
      document.querySelector('.hudson-site') ||
      document.documentElement;
    return readVars(sourceEl as Element, themeMap);
  }, [themeFrom, themeMap]);

  const buildFonts = useCallback(() => {
    const sourceEl =
      (themeFrom && document.querySelector(themeFrom)) ||
      document.querySelector('.hudson-site') ||
      document.documentElement;
    return readVars(sourceEl as Element, DEFAULT_FONT_MAP);
  }, [themeFrom]);

  const sendEmbedContext = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe || !iframe.contentWindow) return;

    const rect = iframe.getBoundingClientRect();
    const ctx: EmbedContext = {
      palette: buildPalette(),
      fonts: buildFonts(),
      layout: {
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        density,
        sizing,
        expects,
      },
      surface,
      context: {
        workspace,
        instance,
        template,
        ref: refHandle,
      },
    };

    iframe.contentWindow.postMessage({ type: 'hudson:embed-context', context: ctx }, targetOrigin);
  }, [
    buildFonts,
    buildPalette,
    density,
    expects,
    instance,
    refHandle,
    sizing,
    surface,
    targetOrigin,
    template,
    workspace,
  ]);

  const sendThemeSync = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe || !iframe.contentWindow) return;
    const vars = { ...buildPalette(), ...buildFonts() };
    iframe.contentWindow.postMessage({ type: 'hudson:theme-sync', vars }, targetOrigin);
  }, [buildFonts, buildPalette, targetOrigin]);

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      const iframe = iframeRef.current;
      if (!iframe || e.source !== iframe.contentWindow) return;
      const data = e.data;
      if (!data || typeof data !== 'object') return;

      if (data.type === 'hudson:embed-ready') {
        sendEmbedContext();
      } else if (data.type === 'hudson:embed-resize' && sizing.mode === 'responsive') {
        if (typeof data.height === 'number') setReportedHeight(data.height);
      }
    }

    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [sendEmbedContext, sizing.mode]);

  // After the embed is mounted, push incremental theme-sync if the host theme changes.
  // Detect with a MutationObserver on the source element's `style` and `class`.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const sourceEl =
      (themeFrom && document.querySelector(themeFrom)) ||
      document.querySelector('.hudson-site') ||
      document.documentElement;
    if (!sourceEl) return;
    const obs = new MutationObserver(() => sendThemeSync());
    obs.observe(sourceEl, { attributes: true, attributeFilter: ['style', 'class'] });
    return () => obs.disconnect();
  }, [sendThemeSync, themeFrom]);

  const sizeStyle: CSSProperties = (() => {
    if (sizing.mode === 'fixed') return { width: sizing.width, height: sizing.height };
    if (sizing.mode === 'responsive')
      return {
        width: '100%',
        height: reportedHeight ?? sizing.minHeight ?? 240,
        aspectRatio: !reportedHeight ? sizing.aspectRatio : undefined,
      };
    return { width: '100%', height: '100%' };
  })();

  return (
    <iframe
      ref={iframeRef}
      src={iframeSrc}
      title={title ?? `hudson embed · ${surface}`}
      data-hudson-embed-surface={surface}
      className={className}
      style={{ display: 'block', border: 0, ...sizeStyle, ...style }}
    />
  );
}
