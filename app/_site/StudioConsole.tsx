'use client';

import { useEffect, useState } from 'react';

type FontOption = { id: string; label: string; value: string };
type PaletteOption = {
  id: string;
  label: string;
  swatch: string;
  vars: Record<string, string>;
};

const DISPLAY_FONTS: FontOption[] = [
  { id: 'newsreader', label: 'Newsreader', value: 'var(--font-newsreader), Times New Roman, serif' },
  { id: 'bodoni-moda', label: 'Bodoni Moda', value: 'var(--font-bodoni-moda), Times New Roman, serif' },
  { id: 'spectral', label: 'Spectral', value: 'var(--font-spectral), Times New Roman, serif' },
  { id: 'cormorant', label: 'Cormorant', value: 'var(--font-cormorant), Times New Roman, serif' },
];

const BODY_FONTS: FontOption[] = [
  { id: 'space-grotesk', label: 'Space Grotesk', value: 'var(--font-space-grotesk), system-ui, sans-serif' },
  { id: 'plex-sans', label: 'IBM Plex', value: 'var(--font-plex-sans), system-ui, sans-serif' },
  { id: 'geist', label: 'Geist', value: 'var(--font-geist), system-ui, sans-serif' },
];

const MONO_FONTS: FontOption[] = [
  { id: 'jetbrains', label: 'JetBrains', value: 'var(--font-jetbrains-mono), ui-monospace, monospace' },
  { id: 'plex-mono', label: 'Plex Mono', value: 'var(--font-plex-mono), ui-monospace, monospace' },
  { id: 'geist-mono', label: 'Geist', value: 'var(--font-geist-mono), ui-monospace, monospace' },
];

const ACCENTS: PaletteOption[] = [
  {
    id: 'emerald',
    label: 'Emerald',
    swatch: 'oklch(0.62 0.16 162)',
    vars: {
      '--accent': 'oklch(0.62 0.16 162)',
      '--accent-deep': 'oklch(0.50 0.16 162)',
      '--accent-soft': 'oklch(0.62 0.16 162 / 0.10)',
      '--accent-line': 'oklch(0.62 0.16 162 / 0.45)',
    },
  },
  {
    id: 'amber',
    label: 'Amber',
    swatch: 'oklch(0.72 0.18 60)',
    vars: {
      '--accent': 'oklch(0.72 0.18 60)',
      '--accent-deep': 'oklch(0.58 0.18 50)',
      '--accent-soft': 'oklch(0.72 0.18 60 / 0.12)',
      '--accent-line': 'oklch(0.72 0.18 60 / 0.45)',
    },
  },
  {
    id: 'cobalt',
    label: 'Cobalt',
    swatch: 'oklch(0.58 0.19 250)',
    vars: {
      '--accent': 'oklch(0.58 0.19 250)',
      '--accent-deep': 'oklch(0.46 0.19 250)',
      '--accent-soft': 'oklch(0.58 0.19 250 / 0.12)',
      '--accent-line': 'oklch(0.58 0.19 250 / 0.45)',
    },
  },
  {
    id: 'rose',
    label: 'Rose',
    swatch: 'oklch(0.62 0.20 18)',
    vars: {
      '--accent': 'oklch(0.62 0.20 18)',
      '--accent-deep': 'oklch(0.50 0.20 18)',
      '--accent-soft': 'oklch(0.62 0.20 18 / 0.12)',
      '--accent-line': 'oklch(0.62 0.20 18 / 0.45)',
    },
  },
  {
    id: 'violet',
    label: 'Violet',
    swatch: 'oklch(0.58 0.22 310)',
    vars: {
      '--accent': 'oklch(0.58 0.22 310)',
      '--accent-deep': 'oklch(0.46 0.22 310)',
      '--accent-soft': 'oklch(0.58 0.22 310 / 0.12)',
      '--accent-line': 'oklch(0.58 0.22 310 / 0.45)',
    },
  },
  {
    id: 'graphite',
    label: 'Graphite',
    swatch: 'oklch(0.40 0.01 240)',
    vars: {
      '--accent': 'oklch(0.40 0.01 240)',
      '--accent-deep': 'oklch(0.28 0.01 240)',
      '--accent-soft': 'oklch(0.40 0.01 240 / 0.10)',
      '--accent-line': 'oklch(0.40 0.01 240 / 0.45)',
    },
  },
];

const PAPERS: PaletteOption[] = [
  {
    id: 'linen',
    label: 'Linen',
    swatch: 'oklch(0.95 0.012 70)',
    vars: {
      '--paper': 'oklch(0.95 0.012 70)',
      '--paper-2': 'oklch(0.92 0.014 70)',
      '--paper-3': 'oklch(0.88 0.016 70)',
      '--paper-edge': 'oklch(0.82 0.018 70)',
      '--ink': 'oklch(0.22 0.014 60)',
      '--ink-1': 'oklch(0.34 0.012 60)',
      '--ink-2': 'oklch(0.52 0.010 60)',
      '--ink-3': 'oklch(0.66 0.008 60)',
      '--ink-faint': 'oklch(0.78 0.006 60)',
      '--line': 'oklch(0.78 0.010 60)',
      '--line-strong': 'oklch(0.56 0.014 60)',
      '--line-grid': 'oklch(0.86 0.010 60)',
    },
  },
  {
    id: 'cream',
    label: 'Cream',
    swatch: 'oklch(0.97 0.012 85)',
    vars: {
      '--paper': 'oklch(0.97 0.012 85)',
      '--paper-2': 'oklch(0.94 0.014 85)',
      '--paper-3': 'oklch(0.90 0.016 85)',
      '--paper-edge': 'oklch(0.85 0.018 85)',
      '--ink': 'oklch(0.20 0.02 60)',
      '--ink-1': 'oklch(0.32 0.02 60)',
      '--ink-2': 'oklch(0.52 0.015 60)',
      '--ink-3': 'oklch(0.68 0.012 60)',
      '--ink-faint': 'oklch(0.80 0.010 60)',
      '--line': 'oklch(0.80 0.015 60)',
      '--line-strong': 'oklch(0.58 0.02 60)',
      '--line-grid': 'oklch(0.88 0.012 60)',
    },
  },
  {
    id: 'bone',
    label: 'Bone',
    swatch: 'oklch(0.96 0.002 80)',
    vars: {
      '--paper': 'oklch(0.96 0.002 80)',
      '--paper-2': 'oklch(0.93 0.003 80)',
      '--paper-3': 'oklch(0.89 0.004 80)',
      '--paper-edge': 'oklch(0.84 0.005 80)',
      '--ink': 'oklch(0.18 0.005 80)',
      '--ink-1': 'oklch(0.30 0.005 80)',
      '--ink-2': 'oklch(0.50 0.004 80)',
      '--ink-3': 'oklch(0.66 0.003 80)',
      '--ink-faint': 'oklch(0.78 0.002 80)',
      '--line': 'oklch(0.78 0.005 80)',
      '--line-strong': 'oklch(0.55 0.006 80)',
      '--line-grid': 'oklch(0.86 0.004 80)',
    },
  },
  {
    id: 'slate',
    label: 'Slate',
    swatch: 'oklch(0.18 0.02 240)',
    vars: {
      '--paper': 'oklch(0.20 0.02 240)',
      '--paper-2': 'oklch(0.24 0.02 240)',
      '--paper-3': 'oklch(0.28 0.02 240)',
      '--paper-edge': 'oklch(0.12 0.02 240)',
      '--ink': 'oklch(0.94 0.005 240)',
      '--ink-1': 'oklch(0.85 0.005 240)',
      '--ink-2': 'oklch(0.70 0.008 240)',
      '--ink-3': 'oklch(0.55 0.01 240)',
      '--ink-faint': 'oklch(0.42 0.012 240)',
      '--line': 'oklch(0.40 0.012 240)',
      '--line-strong': 'oklch(0.62 0.012 240)',
      '--line-grid': 'oklch(0.32 0.012 240)',
    },
  },
];

const DEFAULTS = {
  display: 'newsreader',
  body: 'space-grotesk',
  mono: 'jetbrains',
  accent: 'amber',
  paper: 'slate',
  gridMinor: 0.45,
  gridMajor: 0.55,
  strokeW: 1.5,
  radiusUI: 0,
  radiusCard: 0,
  bodyWeight: 400,
  audio: false,
  audioUI: true,
  audioCount: true,
  audioType: true,
  audioPage: false,
  snap: false,
  grain: false,
};

type State = typeof DEFAULTS;

type Preset = {
  id: string;
  label: string;
  hint: string;
  patch: Partial<State>;
};

const PRESETS: Preset[] = [
  {
    id: 'warm',
    label: 'Warm',
    hint: 'linen · emerald · spectral',
    patch: {
      paper: 'linen',
      accent: 'emerald',
      display: 'spectral',
      body: 'plex-sans',
      mono: 'jetbrains',
      strokeW: 1.25,
      radiusUI: 3,
      radiusCard: 4,
      bodyWeight: 400,
      grain: true,
    },
  },
  {
    id: 'modern',
    label: 'Modern',
    hint: 'bone · cobalt · bodoni',
    patch: {
      paper: 'bone',
      accent: 'cobalt',
      display: 'bodoni-moda',
      body: 'geist',
      mono: 'plex-mono',
      strokeW: 1,
      radiusUI: 6,
      radiusCard: 8,
      bodyWeight: 400,
      grain: false,
    },
  },
  {
    id: 'ink',
    label: 'Ink',
    hint: 'slate · amber · newsreader',
    patch: {
      paper: 'slate',
      accent: 'amber',
      display: 'newsreader',
      body: 'space-grotesk',
      mono: 'jetbrains',
      strokeW: 1.5,
      radiusUI: 0,
      radiusCard: 0,
      bodyWeight: 400,
      grain: false,
    },
  },
];

const STORAGE_KEY = 'hudson-studio-console-v1';

function applyVars(target: HTMLElement, vars: Record<string, string>) {
  for (const [k, v] of Object.entries(vars)) {
    target.style.setProperty(k, v);
  }
}

export function StudioConsole() {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<State>(DEFAULTS);

  // Load saved settings — anchor to DEFAULTS so old persisted shapes are forward-compatible
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<State>;
        setState({ ...DEFAULTS, ...parsed });
      }
    } catch {
      // ignore
    }
  }, []);

  // Apply settings to the .hudson-site wrapper
  useEffect(() => {
    const root = document.querySelector<HTMLElement>('.hudson-site');
    if (!root) return;

    const display = DISPLAY_FONTS.find((f) => f.id === state.display) ?? DISPLAY_FONTS[0];
    const body = BODY_FONTS.find((f) => f.id === state.body) ?? BODY_FONTS[0];
    const mono = MONO_FONTS.find((f) => f.id === state.mono) ?? MONO_FONTS[0];
    const accent = ACCENTS.find((a) => a.id === state.accent) ?? ACCENTS[0];
    const paper = PAPERS.find((p) => p.id === state.paper) ?? PAPERS[0];

    applyVars(root, paper.vars);
    applyVars(root, accent.vars);
    applyVars(root, {
      '--font-display': display.value,
      '--font-body': body.value,
      '--font-mono': mono.value,
      '--font-weight-body': String(state.bodyWeight ?? DEFAULTS.bodyWeight),
      '--grid-opacity-minor': String(state.gridMinor),
      '--grid-opacity-major': String(state.gridMajor),
      '--stroke-w': `${state.strokeW ?? DEFAULTS.strokeW}px`,
      '--radius-ui': `${state.radiusUI ?? DEFAULTS.radiusUI}px`,
      '--radius-card': `${state.radiusCard ?? DEFAULTS.radiusCard}px`,
    });

    root.classList.toggle('snap', state.snap);
    root.classList.toggle('grain', state.grain);

    window.__hudAudio?.setEnabled(state.audio);
    window.__hudAudio?.setCategory?.('ui', state.audioUI);
    window.__hudAudio?.setCategory?.('count', state.audioCount);
    window.__hudAudio?.setCategory?.('type', state.audioType);
    window.__hudAudio?.setCategory?.('page', state.audioPage);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
  }, [state]);

  function applyPreset(preset: Preset) {
    setState((s) => ({ ...s, ...preset.patch }));
    window.__hudAudio?.whoosh({ cat: 'ui' });
  }

  function set<K extends keyof State>(key: K, value: State[K]) {
    setState((s) => ({ ...s, [key]: value }));
  }

  if (!open) {
    return (
      <div className="studio-console">
        <button
          className="studio-console__toggle"
          onClick={() => setOpen(true)}
          aria-label="Open studio console"
        >
          <span className="dot" />
          STUDIO
        </button>
      </div>
    );
  }

  return (
    <div className="studio-console">
      <div className="studio-console__panel" role="dialog" aria-label="Studio Console">
        <div className="studio-console__head">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <svg width="14" height="14" viewBox="0 0 32 32" fill="none">
              <rect
                x="3"
                y="3"
                width="26"
                height="26"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <rect x="9" y="9" width="14" height="14" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
              <rect x="13" y="13" width="6" height="6" fill="currentColor" />
            </svg>
            STUDIO CONSOLE
          </span>
          <button
            className="studio-console__close"
            onClick={() => setOpen(false)}
            aria-label="Close studio console"
          >
            ✕
          </button>
        </div>

        <div className="studio-console__body">
          <div className="studio-console__group">
            <div className="studio-console__label">
              <span>Theme</span>
              <span className="meta">preset bundles</span>
            </div>
            <div className="studio-console__chips">
              {PRESETS.map((p) => {
                const active = Object.entries(p.patch).every(
                  ([k, v]) => state[k as keyof State] === v,
                );
                return (
                  <button
                    key={p.id}
                    className="studio-console__chip"
                    aria-pressed={active}
                    onClick={() => applyPreset(p)}
                    title={p.hint}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="studio-console__group">
            <div className="studio-console__label">
              <span>Effects</span>
              <span className="meta">scroll · grain · sound</span>
            </div>
            <div className="studio-console__chips">
              <button
                className="studio-console__chip"
                aria-pressed={state.snap}
                onClick={() => set('snap', !state.snap)}
              >
                Snap
              </button>
              <button
                className="studio-console__chip"
                aria-pressed={state.grain}
                onClick={() => set('grain', !state.grain)}
              >
                Grain
              </button>
              <button
                className="studio-console__chip"
                aria-pressed={state.audio}
                onClick={() => set('audio', !state.audio)}
              >
                Sound
              </button>
            </div>
            {state.audio && (
              <div className="studio-console__chips" style={{ marginTop: 6 }}>
                <button
                  className="studio-console__chip"
                  aria-pressed={state.audioUI}
                  onClick={() => set('audioUI', !state.audioUI)}
                  title="Button clicks · UI feedback"
                >
                  · UI
                </button>
                <button
                  className="studio-console__chip"
                  aria-pressed={state.audioCount}
                  onClick={() => set('audioCount', !state.audioCount)}
                  title="Number count-ups in hero stats"
                >
                  · Counts
                </button>
                <button
                  className="studio-console__chip"
                  aria-pressed={state.audioType}
                  onClick={() => set('audioType', !state.audioType)}
                  title="Typewriter effect on ship block"
                >
                  · Type
                </button>
                <button
                  className="studio-console__chip"
                  aria-pressed={state.audioPage}
                  onClick={() => set('audioPage', !state.audioPage)}
                  title="Sheet flips · preset whoosh (already played once on first visit)"
                >
                  · Pages
                </button>
              </div>
            )}
          </div>

          <div className="studio-console__group">
            <div className="studio-console__label">
              <span>Display</span>
              <span className="meta">headlines · h-display</span>
            </div>
            <div className="studio-console__chips">
              {DISPLAY_FONTS.map((f) => (
                <button
                  key={f.id}
                  className="studio-console__chip"
                  aria-pressed={state.display === f.id}
                  onClick={() => set('display', f.id)}
                  style={{ fontFamily: f.value, letterSpacing: '0.02em', textTransform: 'none' }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="studio-console__group">
            <div className="studio-console__label">
              <span>Body</span>
              <span className="meta">subhead · paragraphs</span>
            </div>
            <div className="studio-console__chips">
              {BODY_FONTS.map((f) => (
                <button
                  key={f.id}
                  className="studio-console__chip"
                  aria-pressed={state.body === f.id}
                  onClick={() => set('body', f.id)}
                  style={{ fontFamily: f.value, letterSpacing: '0.02em', textTransform: 'none' }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="studio-console__group">
            <div className="studio-console__label">
              <span>Mono</span>
              <span className="meta">labels · code · spec</span>
            </div>
            <div className="studio-console__chips">
              {MONO_FONTS.map((f) => (
                <button
                  key={f.id}
                  className="studio-console__chip"
                  aria-pressed={state.mono === f.id}
                  onClick={() => set('mono', f.id)}
                  style={{ fontFamily: f.value, letterSpacing: '0.02em', textTransform: 'none' }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="studio-console__group">
            <div className="studio-console__label">
              <span>Accent</span>
              <span className="meta">links · ticks · live</span>
            </div>
            <div className="studio-console__chips">
              {ACCENTS.map((a) => (
                <button
                  key={a.id}
                  className="studio-console__chip"
                  aria-pressed={state.accent === a.id}
                  onClick={() => set('accent', a.id)}
                >
                  <span className="swatch" style={{ background: a.swatch }} />
                  {a.label}
                </button>
              ))}
            </div>
          </div>

          <div className="studio-console__group">
            <div className="studio-console__label">
              <span>Paper</span>
              <span className="meta">sheet · ink</span>
            </div>
            <div className="studio-console__chips">
              {PAPERS.map((p) => (
                <button
                  key={p.id}
                  className="studio-console__chip"
                  aria-pressed={state.paper === p.id}
                  onClick={() => set('paper', p.id)}
                >
                  <span className="swatch" style={{ background: p.swatch }} />
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="studio-console__group">
            <div className="studio-console__label">
              <span>Line</span>
              <span className="meta">{(state.strokeW ?? DEFAULTS.strokeW).toFixed(2)} px stroke</span>
            </div>
            <div className="studio-console__row">
              <span style={{ fontSize: 9, letterSpacing: '0.16em', color: 'var(--ink-2)' }}>
                WEIGHT
              </span>
              <input
                type="range"
                min={0.5}
                max={3}
                step={0.25}
                value={state.strokeW ?? DEFAULTS.strokeW}
                onChange={(e) => set('strokeW', Number(e.target.value))}
              />
            </div>
          </div>

          <div className="studio-console__group">
            <div className="studio-console__label">
              <span>Radius</span>
              <span className="meta">UI · cards</span>
            </div>
            <div className="studio-console__row">
              <span style={{ fontSize: 9, letterSpacing: '0.16em', color: 'var(--ink-2)' }}>
                UI · {state.radiusUI ?? DEFAULTS.radiusUI}
              </span>
              <input
                type="range"
                min={0}
                max={10}
                step={1}
                value={state.radiusUI ?? DEFAULTS.radiusUI}
                onChange={(e) => set('radiusUI', Number(e.target.value))}
                title="btn · code · tag · kbd · console chips"
              />
            </div>
            <div className="studio-console__row">
              <span style={{ fontSize: 9, letterSpacing: '0.16em', color: 'var(--ink-2)' }}>
                CARD · {state.radiusCard ?? DEFAULTS.radiusCard}
              </span>
              <input
                type="range"
                min={0}
                max={16}
                step={1}
                value={state.radiusCard ?? DEFAULTS.radiusCard}
                onChange={(e) => set('radiusCard', Number(e.target.value))}
                title="hero stats · app cards · step cards · feature cards · manifest · final note"
              />
            </div>
          </div>

          <div className="studio-console__group">
            <div className="studio-console__label">
              <span>Body weight</span>
              <span className="meta">{state.bodyWeight ?? DEFAULTS.bodyWeight}</span>
            </div>
            <div className="studio-console__row">
              <span style={{ fontSize: 9, letterSpacing: '0.16em', color: 'var(--ink-2)' }}>
                WEIGHT
              </span>
              <input
                type="range"
                min={300}
                max={700}
                step={100}
                value={state.bodyWeight ?? DEFAULTS.bodyWeight}
                onChange={(e) => set('bodyWeight', Number(e.target.value))}
              />
            </div>
          </div>

          <div className="studio-console__group">
            <div className="studio-console__label">
              <span>Grid</span>
              <span className="meta">12 / 72 px</span>
            </div>
            <div className="studio-console__row">
              <span style={{ fontSize: 9, letterSpacing: '0.16em', color: 'var(--ink-2)' }}>
                MINOR
              </span>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={state.gridMinor}
                onChange={(e) => set('gridMinor', Number(e.target.value))}
              />
            </div>
            <div className="studio-console__row">
              <span style={{ fontSize: 9, letterSpacing: '0.16em', color: 'var(--ink-2)' }}>
                MAJOR
              </span>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={state.gridMajor}
                onChange={(e) => set('gridMajor', Number(e.target.value))}
              />
            </div>
          </div>

          <button className="studio-console__reset" onClick={() => setState(DEFAULTS)}>
            ↺ Reset to defaults
          </button>
        </div>
      </div>
    </div>
  );
}
