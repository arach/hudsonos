import Link from 'next/link';
import { ArrowUpRight, Maximize2, MousePointer2 } from 'lucide-react';
import { APP_URL } from './env';

const PREVIEW_URL = `${APP_URL}/preview`;

export function VideoSection() {
  return (
    <section className="relative px-6 md:px-10 pb-20">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-end justify-between mb-4">
          <div>
            <div className="text-[11px] uppercase tracking-[0.2em] text-emerald-400/70">
              Live / Interactive
            </div>
            <h2 className="mt-1 font-brand text-xl md:text-2xl font-medium text-white/90">
              The workspace, running inline
            </h2>
          </div>
          <Link
            href={APP_URL}
            target="_blank"
            rel="noopener"
            className="hidden md:inline-flex items-center gap-1.5 text-[12px] text-white/60 hover:text-white transition"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            Open fullscreen
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <HudFrame>
          <iframe
            src={PREVIEW_URL}
            title="Hudson workspace preview"
            className="block w-full h-[560px] md:h-[640px] border-0 bg-neutral-950"
            loading="lazy"
          />
        </HudFrame>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-white/40">
          <span className="flex items-center gap-1.5">
            <MousePointer2 className="w-3 h-3" />
            Click to interact
          </span>
          <span className="hidden md:inline text-white/20">·</span>
          <span>Space + drag to pan</span>
          <span className="hidden md:inline text-white/20">·</span>
          <span>Scroll to zoom</span>
          <span className="hidden md:inline text-white/20">·</span>
          <span>⌘K opens the command palette</span>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Shared HUD frame with corner brackets
// ─────────────────────────────────────────────────────────────

function HudFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative rounded-xl border border-white/10 bg-white/[0.015] shadow-[0_20px_60px_-20px_rgba(16,185,129,0.15)] overflow-hidden">
      <Corners />
      <div className="relative">{children}</div>
    </div>
  );
}

function Corners() {
  const base = 'absolute w-3 h-3 border-emerald-400/40 pointer-events-none';
  return (
    <>
      <span className={`${base} top-1 left-1 border-t border-l`} />
      <span className={`${base} top-1 right-1 border-t border-r`} />
      <span className={`${base} bottom-1 left-1 border-b border-l`} />
      <span className={`${base} bottom-1 right-1 border-b border-r`} />
    </>
  );
}
