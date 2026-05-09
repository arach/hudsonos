import type { CSSProperties } from 'react';

export type EmbedTheme = 'dark' | 'light';

export interface ConsumerConfig {
  ref: string;
  theme: EmbedTheme;
  template: string;
  defaultWorkspace: string;
  palette: Record<string, string>;
  fonts: Record<string, string>;
}

const HUDSON_FONTS = {
  '--hud-font-display': 'var(--font-newsreader), "Times New Roman", serif',
  '--hud-font-body':    'var(--font-space-grotesk), system-ui, sans-serif',
  '--hud-font-mono':    'var(--font-jetbrains-mono), ui-monospace, monospace',
} as const;

const EDITORIAL_FONTS = {
  '--hud-font-display': 'var(--font-bodoni-moda), "Times New Roman", serif',
  '--hud-font-body':    'var(--font-spectral), Georgia, serif',
  '--hud-font-mono':    'var(--font-jetbrains-mono), ui-monospace, monospace',
} as const;

export const consumers: Record<string, ConsumerConfig> = {
  // Canonical hudson dark — mirrors hudsonkit tokens.css
  // (template=hudson, theme=dark): pure-neutral grays + emerald accent.
  hudson: {
    ref: 'hudson',
    theme: 'dark',
    template: 'hudson',
    defaultWorkspace: 'hudson-os',
    palette: {
      '--hud-bg':           'oklch(0.145 0 0)',
      '--hud-bg-2':         'oklch(0.18 0 0)',
      '--hud-bg-3':         'oklch(0.24 0 0)',
      '--hud-ink':          'oklch(0.95 0 0)',
      '--hud-ink-1':        'oklch(0.85 0 0)',
      '--hud-ink-2':        'oklch(0.64 0 0)',
      '--hud-ink-3':        'oklch(0.50 0 0)',
      '--hud-line':         'oklch(0.28 0 0)',
      '--hud-line-strong':  'oklch(0.40 0 0)',
      '--hud-accent':       'oklch(0.72 0.18 162)',
      '--hud-accent-soft':  'oklch(0.72 0.18 162 / 0.10)',
      '--hud-accent-line':  'oklch(0.72 0.18 162 / 0.45)',
      '--hud-border-width': '1px',
    },
    fonts: { ...HUDSON_FONTS },
  },

  // hudson light — warm off-white canvas, cool ink, pushed emerald.
  'hudson-light': {
    ref: 'hudson-light',
    theme: 'light',
    template: 'hudson',
    defaultWorkspace: 'hudson-os',
    palette: {
      '--hud-bg':           'oklch(0.975 0.008 90)',
      '--hud-bg-2':         'oklch(1 0 0)',
      '--hud-bg-3':         'oklch(0.945 0.012 85)',
      '--hud-ink':          'oklch(0.21 0.02 260)',
      '--hud-ink-1':        'oklch(0.32 0.02 260)',
      '--hud-ink-2':        'oklch(0.50 0.02 260)',
      '--hud-ink-3':        'oklch(0.66 0.015 260)',
      '--hud-line':         'oklch(0.88 0.012 85)',
      '--hud-line-strong':  'oklch(0.74 0.014 85)',
      '--hud-accent':       'oklch(0.58 0.19 162)',
      '--hud-accent-soft':  'oklch(0.58 0.19 162 / 0.08)',
      '--hud-accent-line':  'oklch(0.58 0.19 162 / 0.40)',
      '--hud-border-width': '1px',
    },
    fonts: { ...HUDSON_FONTS },
  },

  // editorial dark — warm earth tones, dusty orange accent.
  'editorial-dark': {
    ref: 'editorial-dark',
    theme: 'dark',
    template: 'editorial',
    defaultWorkspace: 'hudson-os',
    palette: {
      '--hud-bg':           'oklch(0.21 0.015 60)',
      '--hud-bg-2':         'oklch(0.245 0.016 60)',
      '--hud-bg-3':         'oklch(0.29 0.015 65)',
      '--hud-ink':          'oklch(0.92 0.01 85)',
      '--hud-ink-1':        'oklch(0.82 0.01 80)',
      '--hud-ink-2':        'oklch(0.71 0.012 75)',
      '--hud-ink-3':        'oklch(0.55 0.014 70)',
      '--hud-line':         'oklch(0.34 0.015 65)',
      '--hud-line-strong':  'oklch(0.46 0.014 65)',
      '--hud-accent':       'oklch(0.69 0.16 40)',
      '--hud-accent-soft':  'oklch(0.69 0.16 40 / 0.10)',
      '--hud-accent-line':  'oklch(0.69 0.16 40 / 0.45)',
      '--hud-border-width': '1px',
    },
    fonts: { ...EDITORIAL_FONTS },
  },

  // editorial light — paper-warm canvas, dusty orange accent.
  'editorial-light': {
    ref: 'editorial-light',
    theme: 'light',
    template: 'editorial',
    defaultWorkspace: 'hudson-os',
    palette: {
      '--hud-bg':           'oklch(0.98 0.01 80)',
      '--hud-bg-2':         'oklch(1 0 0)',
      '--hud-bg-3':         'oklch(0.94 0.02 80)',
      '--hud-ink':          'oklch(0.20 0.02 60)',
      '--hud-ink-1':        'oklch(0.32 0.02 60)',
      '--hud-ink-2':        'oklch(0.48 0.03 60)',
      '--hud-ink-3':        'oklch(0.66 0.022 60)',
      '--hud-line':         'oklch(0.88 0.015 80)',
      '--hud-line-strong':  'oklch(0.74 0.018 80)',
      '--hud-accent':       'oklch(0.60 0.18 40)',
      '--hud-accent-soft':  'oklch(0.60 0.18 40 / 0.08)',
      '--hud-accent-line':  'oklch(0.60 0.18 40 / 0.40)',
      '--hud-border-width': '1px',
    },
    fonts: { ...EDITORIAL_FONTS },
  },

  // hudsonos — slate paper + amber accent (the consumer hudsonos site).
  hudsonos: {
    ref: 'hudsonos',
    theme: 'dark',
    template: 'hudson',
    defaultWorkspace: 'hudson-os',
    palette: {
      '--hud-bg':           'oklch(0.20 0.02 240)',
      '--hud-bg-2':         'oklch(0.24 0.02 240)',
      '--hud-bg-3':         'oklch(0.28 0.02 240)',
      '--hud-ink':          'oklch(0.94 0.005 240)',
      '--hud-ink-1':        'oklch(0.85 0.005 240)',
      '--hud-ink-2':        'oklch(0.70 0.008 240)',
      '--hud-ink-3':        'oklch(0.55 0.01 240)',
      '--hud-line':         'oklch(0.40 0.012 240)',
      '--hud-line-strong':  'oklch(0.62 0.012 240)',
      '--hud-accent':       'oklch(0.72 0.18 60)',
      '--hud-accent-soft':  'oklch(0.72 0.18 60 / 0.12)',
      '--hud-accent-line':  'oklch(0.72 0.18 60 / 0.45)',
      '--hud-border-width': '1.5px',
    },
    fonts: { ...HUDSON_FONTS },
  },
};

export function resolveConsumer(ref: string | null | undefined): ConsumerConfig | undefined {
  if (!ref) return undefined;
  return consumers[ref];
}

export function consumerThemeStyle(ref: string | null | undefined): CSSProperties | undefined {
  const consumer = resolveConsumer(ref);
  if (!consumer) return undefined;
  return { ...consumer.palette, ...consumer.fonts } as CSSProperties;
}

export function consumerClassName(ref: string | null | undefined): string | undefined {
  const consumer = resolveConsumer(ref);
  if (!consumer) return undefined;
  return `embed-theme-${consumer.ref}`;
}
