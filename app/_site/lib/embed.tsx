'use client';

import { CSSProperties, useCallback, useEffect, useRef, useState } from 'react';

export type EmbedSizing =
  | { mode: 'fixed'; width: number; height: number }
  | { mode: 'responsive'; aspectRatio?: string; minHeight?: number }
  | { mode: 'fill' };

export type HudsonEmbedProps = {
  src: string;
  surface: string;
  sizing?: EmbedSizing;
  className?: string;
  style?: CSSProperties;
  title?: string;
  /** CSS variable names on the host that should mirror to Hudson's --hud-* tokens. */
  themeMap?: Record<string, string>;
  /** Element selector whose computed styles should be read as the theme source. Default: '.hudson-site' or :root. */
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
  '--font-display': '--hud-font-display',
  '--font-body': '--hud-font-body',
  '--font-mono': '--hud-font-mono',
};

export function HudsonEmbed({
  src,
  surface,
  sizing = { mode: 'fill' },
  className,
  style,
  title,
  themeMap = DEFAULT_THEME_MAP,
  themeFrom,
}: HudsonEmbedProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [reportedHeight, setReportedHeight] = useState<number | null>(null);

  const sendThemeSync = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe || !iframe.contentWindow) return;

    const sourceEl =
      (themeFrom && document.querySelector(themeFrom)) ||
      document.querySelector('.hudson-site') ||
      document.documentElement;
    const computed = getComputedStyle(sourceEl as Element);

    const vars: Record<string, string> = {};
    for (const [siteKey, hudKey] of Object.entries(themeMap)) {
      const value = computed.getPropertyValue(siteKey).trim();
      if (value) vars[hudKey] = value;
    }

    let targetOrigin = '*';
    try {
      targetOrigin = new URL(src, window.location.origin).origin;
    } catch {
      /* keep wildcard */
    }

    iframe.contentWindow.postMessage({ type: 'hudson:theme-sync', vars }, targetOrigin);
  }, [src, themeFrom, themeMap]);

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      const iframe = iframeRef.current;
      if (!iframe || e.source !== iframe.contentWindow) return;
      const data = e.data;
      if (!data || typeof data !== 'object') return;

      if (data.type === 'hudson:embed-ready') {
        sendThemeSync();
      } else if (data.type === 'hudson:embed-resize' && sizing.mode === 'responsive') {
        if (typeof data.height === 'number') setReportedHeight(data.height);
      }
    }

    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [sendThemeSync, sizing.mode]);

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
      src={src}
      title={title ?? `hudson embed · ${surface}`}
      data-hudson-embed-surface={surface}
      className={className}
      style={{ display: 'block', border: 0, ...sizeStyle, ...style }}
    />
  );
}
