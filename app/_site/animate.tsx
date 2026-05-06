'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

/* ─────────────────────────────────────────────────────────────
   Hudson Site — Animation + Audio engine
   Ported from design bundle animate.jsx
   ───────────────────────────────────────────────────────────── */

type HudAudio = {
  tick: (gain?: number) => void;
  chime: () => void;
  flip: () => void;
  whoosh: () => void;
  setEnabled: (v: boolean) => void;
  isEnabled: () => boolean;
};

declare global {
  interface Window {
    __hudAudio?: HudAudio;
    webkitAudioContext?: typeof AudioContext;
  }
}

/* In-view observer */
export function useInView<T extends Element = HTMLDivElement>(
  opts: IntersectionObserverInit = {},
): [React.RefObject<T | null>, boolean] {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => setInView(e.isIntersecting),
      { threshold: 0.25, ...opts },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [opts]);
  return [ref, inView];
}

/* Count-up — eased, ticks audio if enabled */
export function useCountUp(
  target: number,
  {
    duration = 1100,
    inView = true,
    format = (v: number) => String(v),
  }: { duration?: number; inView?: boolean; format?: (v: number) => string } = {},
): string {
  const [val, setVal] = useState(0);
  const lastTick = useRef(-1);
  useEffect(() => {
    if (!inView) {
      setVal(0);
      lastTick.current = -1;
      return;
    }
    const start = performance.now();
    let raf = 0;
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const cur = Math.round(target * eased);
      setVal(cur);
      if (cur !== lastTick.current && cur < target) {
        window.__hudAudio?.tick();
        lastTick.current = cur;
      }
      if (p < 1) raf = requestAnimationFrame(step);
      else window.__hudAudio?.chime();
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, inView, duration]);
  return format(val);
}

/* Typewriter — emits a key tick per non-space char */
export function useTypewriter(
  text: string,
  {
    speed = 30,
    inView = true,
    startDelay = 200,
  }: { speed?: number; inView?: boolean; startDelay?: number } = {},
): string {
  const [out, setOut] = useState('');
  useEffect(() => {
    if (!inView) {
      setOut('');
      return;
    }
    let i = 0;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      if (cancelled) return;
      if (i <= text.length) {
        setOut(text.slice(0, i));
        if (i > 0 && text[i - 1] !== ' ') {
          window.__hudAudio?.tick(0.02);
        }
        i += 1;
        timer = setTimeout(tick, speed);
      }
    };
    timer = setTimeout(tick, startDelay);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [text, speed, inView, startDelay]);
  return out;
}

/* WebAudio engine — synthesised, no asset loads */
export function initAudio(): HudAudio | null {
  if (typeof window === 'undefined') return null;
  if (window.__hudAudio) return window.__hudAudio;

  let ctx: AudioContext | null = null;
  let enabled = false;
  try {
    enabled = localStorage.getItem('hud-audio') === '1';
  } catch {
    /* ignore */
  }

  const ensure = (): AudioContext | null => {
    if (!enabled) return null;
    if (!ctx) {
      const Ctor = window.AudioContext ?? window.webkitAudioContext;
      if (!Ctor) return null;
      try {
        ctx = new Ctor();
      } catch {
        return null;
      }
    }
    if (ctx && ctx.state === 'suspended') void ctx.resume();
    return ctx;
  };

  const tick: HudAudio['tick'] = (gain = 0.05) => {
    const c = ensure();
    if (!c) return;
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = 'square';
    osc.frequency.value = 1200;
    g.gain.setValueAtTime(gain, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.03);
    osc.connect(g).connect(c.destination);
    osc.start();
    osc.stop(c.currentTime + 0.04);
  };

  const chime: HudAudio['chime'] = () => {
    const c = ensure();
    if (!c) return;
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = 'sine';
    osc.frequency.value = 880;
    g.gain.setValueAtTime(0.07, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.16);
    osc.connect(g).connect(c.destination);
    osc.start();
    osc.stop(c.currentTime + 0.2);
  };

  const flip: HudAudio['flip'] = () => {
    const c = ensure();
    if (!c) return;
    const buf = c.createBuffer(1, c.sampleRate * 0.06, c.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / data.length) * 0.5;
    }
    const src = c.createBufferSource();
    src.buffer = buf;
    const filt = c.createBiquadFilter();
    filt.type = 'highpass';
    filt.frequency.value = 2000;
    const g = c.createGain();
    g.gain.value = 0.18;
    src.connect(filt).connect(g).connect(c.destination);
    src.start();
  };

  const whoosh: HudAudio['whoosh'] = () => {
    const c = ensure();
    if (!c) return;
    const buf = c.createBuffer(1, c.sampleRate * 0.25, c.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    const src = c.createBufferSource();
    src.buffer = buf;
    const filt = c.createBiquadFilter();
    filt.type = 'bandpass';
    filt.Q.value = 4;
    filt.frequency.setValueAtTime(400, c.currentTime);
    filt.frequency.exponentialRampToValueAtTime(3200, c.currentTime + 0.25);
    const g = c.createGain();
    g.gain.value = 0.08;
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.25);
    src.connect(filt).connect(g).connect(c.destination);
    src.start();
  };

  const setEnabled: HudAudio['setEnabled'] = (v) => {
    enabled = v;
    try {
      localStorage.setItem('hud-audio', v ? '1' : '0');
    } catch {
      /* ignore */
    }
    if (v) flip();
  };
  const isEnabled = () => enabled;

  const api: HudAudio = { tick, chime, flip, whoosh, setEnabled, isEnabled };
  window.__hudAudio = api;
  return api;
}

/* Title block parallax — drifts ±12px while sheet is in view */
export function useMetadataParallax() {
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        document.querySelectorAll<HTMLElement>('.hudson-site .sheet').forEach((sheet) => {
          const rect = sheet.getBoundingClientRect();
          const within = -rect.top + window.innerHeight;
          const tb = sheet.querySelector<HTMLElement>('.titleblock');
          if (tb) {
            tb.style.transform = `translateY(${Math.max(-12, Math.min(12, within * 0.012))}px)`;
          }
        });
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);
}

/* Sheet-flip detector — paper-flip sound when a new sheet enters view */
export function useSheetFlipSound() {
  useEffect(() => {
    const sheets = document.querySelectorAll<HTMLElement>('.hudson-site .sheet');
    let lastFired = -1;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && e.intersectionRatio > 0.4) {
            const idx = Array.from(sheets).indexOf(e.target as HTMLElement);
            if (idx !== lastFired) {
              lastFired = idx;
              window.__hudAudio?.flip();
            }
          }
        });
      },
      { threshold: [0.4] },
    );
    sheets.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);
}

/* Counter — animates when its container scrolls into view */
export function Counter({
  to,
  format = (v: number) => v.toLocaleString(),
  duration = 1100,
  suffix = '',
}: {
  to: number;
  format?: (v: number) => string;
  duration?: number;
  suffix?: string;
}): ReactNode {
  const [ref, inView] = useInView<HTMLSpanElement>();
  const v = useCountUp(to, { duration, inView, format });
  return (
    <span ref={ref}>
      {v}
      {suffix}
    </span>
  );
}

/* Mounts the global side-effect hooks once at the root. */
export function GlobalAnimations() {
  useEffect(() => {
    initAudio();
  }, []);
  useMetadataParallax();
  useSheetFlipSound();
  return null;
}
