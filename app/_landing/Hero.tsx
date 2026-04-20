import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { APP_URL } from './env';

export function Hero() {
  return (
    <section className="relative px-6 md:px-10 pt-20 pb-14 md:pt-28 md:pb-20">
      <div className="max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.02] text-[11px] tracking-wider uppercase text-white/50 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Preview · v0.1
        </div>
        <h1 className="font-brand text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight text-white">
          Build rich, composable,
          <br />
          canvas-friendly,
          <br />
          <span className="text-emerald-300">AI-powered web apps.</span>
        </h1>
        <p className="mt-8 max-w-2xl text-base md:text-lg text-white/60 leading-relaxed">
          Hudson is a shell and primitives library for composing canvas
          workspaces and single-app dashboards. Provider&nbsp;+&nbsp;Slots
          &nbsp;+&nbsp;Hooks &mdash; apps own state, the shell renders
          chrome.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Link
            href={`${APP_URL}/app`}
            className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-md border border-emerald-400/40 bg-emerald-400/10 text-emerald-200 hover:bg-emerald-400/20 hover:border-emerald-400/60 transition"
          >
            Open the Workspace
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/docs"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md border border-white/10 bg-white/[0.02] hover:bg-white/5 hover:border-white/20 transition text-white/80"
          >
            Read the Docs
          </Link>
        </div>
      </div>
    </section>
  );
}
