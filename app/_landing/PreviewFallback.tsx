'use client';

import { useState } from 'react';
import {
  BookOpen,
  ChevronRight,
  Command,
  FileText,
  Search,
  Sparkles,
  Terminal,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// PreviewFallback — shown in PreviewSection when the real /preview iframe
// can't reach its origin (dev without hudson running, prod outage, etc.).
// Curated mock workspace, zero external deps.
// ─────────────────────────────────────────────────────────────────────────────

type AppId = 'docs' | 'assistant' | 'notepad';

const APPS: Record<
  AppId,
  { name: string; icon: React.ComponentType<{ className?: string }> }
> = {
  docs: { name: 'Hudson Docs', icon: BookOpen },
  assistant: { name: 'Hudson AI', icon: Sparkles },
  notepad: { name: 'Notepad', icon: FileText },
};

export function PreviewFallback() {
  const [activeApp, setActiveApp] = useState<AppId>('docs');

  return (
    <div className="w-full h-[560px] md:h-[640px] bg-neutral-950 text-white flex flex-col overflow-hidden">
      <NavBar />

      <div className="flex-1 flex min-h-0">
        <AppLauncher activeApp={activeApp} onSelect={setActiveApp} />
        <Canvas activeApp={activeApp} />
        <Inspector activeApp={activeApp} />
      </div>

      <StatusBar activeApp={activeApp} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Chrome pieces
// ─────────────────────────────────────────────────────────────────────────────

function NavBar() {
  return (
    <header className="h-10 shrink-0 flex items-center justify-between px-3 border-b border-white/10 bg-neutral-950/95 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <HudsonMark className="w-4 h-4 text-emerald-400" />
        <span className="text-[12px] tracking-wider">HUDSON</span>
        <div className="ml-1 px-1.5 py-0.5 rounded border border-white/10 bg-white/[0.03] text-[9px] uppercase tracking-wider text-white/50">
          Mock
        </div>
      </div>
      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md border border-white/10 bg-white/[0.02] text-[10px] text-white/40">
        <Search className="w-2.5 h-2.5" />
        <span>Search…</span>
        <kbd className="ml-3 px-1 py-0.5 rounded bg-white/[0.04] text-[9px] font-mono">
          ⌘K
        </kbd>
      </div>
    </header>
  );
}

function AppLauncher({
  activeApp,
  onSelect,
}: {
  activeApp: AppId;
  onSelect: (id: AppId) => void;
}) {
  return (
    <aside className="w-10 shrink-0 border-r border-white/10 bg-neutral-950/95 flex flex-col items-center py-2 gap-1">
      {(Object.keys(APPS) as AppId[]).map((id) => {
        const App = APPS[id];
        const active = id === activeApp;
        return (
          <button
            key={id}
            onClick={() => onSelect(id)}
            title={App.name}
            className={`w-7 h-7 rounded flex items-center justify-center transition ${
              active
                ? 'bg-emerald-400/10 border border-emerald-400/30 text-emerald-300'
                : 'text-white/40 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <App.icon className="w-3.5 h-3.5" />
          </button>
        );
      })}
    </aside>
  );
}

function Canvas({ activeApp }: { activeApp: AppId }) {
  return (
    <main className="flex-1 relative min-w-0 bg-neutral-950 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
      <div className="relative h-full p-4 flex items-center justify-center">
        <AppWindow app={activeApp} />
      </div>
    </main>
  );
}

function AppWindow({ app }: { app: AppId }) {
  const App = APPS[app];
  return (
    <div className="w-full max-w-[720px] h-full max-h-[460px] rounded-lg border border-white/10 bg-neutral-900/80 backdrop-blur overflow-hidden shadow-[0_20px_60px_-20px_rgba(16,185,129,0.12)] relative">
      <Corners />
      <div className="h-7 flex items-center justify-between px-2.5 border-b border-white/5 bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <App.icon className="w-3 h-3 text-emerald-400" />
          <span className="text-[11px] text-white/80">{App.name}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-white/10" />
          <span className="w-2 h-2 rounded-full bg-white/10" />
          <span className="w-2 h-2 rounded-full bg-white/10" />
        </div>
      </div>
      <div className="p-4 h-[calc(100%-28px)] overflow-auto">
        {app === 'docs' && <DocsContent />}
        {app === 'assistant' && <AssistantContent />}
        {app === 'notepad' && <NotepadContent />}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Faux app contents
// ─────────────────────────────────────────────────────────────────────────────

function DocsContent() {
  return (
    <div className="text-[12px] leading-relaxed">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-emerald-400/70 mb-2">
        <span>Building Apps</span>
        <ChevronRight className="w-2.5 h-2.5" />
        <span>Overview</span>
      </div>
      <h2 className="text-lg text-white/90 mb-3 font-medium">
        The HudsonApp interface
      </h2>
      <p className="text-white/60 mb-3">
        Every Hudson app implements a single TypeScript interface. The shell
        reads your Provider, slots, and hooks — and renders the rest.
      </p>
      <pre className="font-mono text-[10.5px] leading-[1.7] bg-black/40 border border-white/5 rounded-md p-2.5 text-white/80 overflow-x-auto">
        <code>
          <span className="text-rose-300">interface</span>{' '}
          <span className="text-cyan-300">HudsonApp</span> {'{'}
          {'\n'}
          {'  '}id: <span className="text-emerald-300">string</span>;{'\n'}
          {'  '}name: <span className="text-emerald-300">string</span>;{'\n'}
          {'  '}Provider:{' '}
          <span className="text-cyan-300">React.FC</span>;{'\n'}
          {'  '}slots: {'{ Content, LeftPanel?, Inspector? }'};{'\n'}
          {'  '}hooks: {'{ useCommands, useStatus, ... }'};{'\n'}
          {'}'}
        </code>
      </pre>
    </div>
  );
}

function AssistantContent() {
  return (
    <div className="text-[12px] space-y-2.5">
      <div className="flex gap-2.5">
        <div className="w-6 h-6 rounded bg-emerald-400/10 border border-emerald-400/30 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-3 h-3 text-emerald-300" />
        </div>
        <div className="flex-1 space-y-1">
          <div className="text-[10px] uppercase tracking-wider text-white/40">
            Assistant
          </div>
          <p className="text-white/80">
            I can help you explore Hudson — try asking me to open an app,
            explain the shell, or scaffold a new app.
          </p>
        </div>
      </div>
      <div className="flex gap-2.5">
        <div className="w-6 h-6 rounded bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
          <span className="text-[10px] text-white/60">You</span>
        </div>
        <div className="flex-1 text-white/70">
          <p>Scaffold a notepad app.</p>
        </div>
      </div>
      <div className="flex gap-2.5">
        <div className="w-6 h-6 rounded bg-emerald-400/10 border border-emerald-400/30 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-3 h-3 text-emerald-300" />
        </div>
        <div className="flex-1">
          <p className="text-white/80 mb-1.5">On it. Running:</p>
          <div className="font-mono text-[10.5px] bg-black/40 border border-white/5 rounded-md px-2.5 py-1.5 text-emerald-300 flex items-center gap-1.5">
            <Terminal className="w-2.5 h-2.5" />
            bunx create-hudson-app notepad
          </div>
        </div>
      </div>
    </div>
  );
}

function NotepadContent() {
  return (
    <div className="font-mono text-[12px] leading-relaxed text-white/80">
      <div className="text-[10px] uppercase tracking-[0.2em] text-emerald-400/70 mb-2">
        Untitled · draft
      </div>
      <h2 className="text-base text-white/90 mb-2.5 font-medium">
        Shipping plan
      </h2>
      <ul className="space-y-1 text-white/70">
        <li>
          <span className="text-emerald-400">▸</span> Finalize landing copy
        </li>
        <li>
          <span className="text-emerald-400">▸</span> Wire the interest form
          to Resend
        </li>
        <li>
          <span className="text-white/20">▸</span> Record a 60s walkthrough
        </li>
        <li>
          <span className="text-white/20">▸</span> Open up the SDK repo
        </li>
      </ul>
      <p className="mt-4 text-white/50 text-[11px]">
        Notes persist via{' '}
        <code className="text-emerald-300">usePersistentState</code> —
        localStorage-backed, hooks-only, zero config.
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Right rail + status bar
// ─────────────────────────────────────────────────────────────────────────────

function Inspector({ activeApp }: { activeApp: AppId }) {
  const App = APPS[activeApp];
  return (
    <aside className="hidden md:flex w-[200px] shrink-0 border-l border-white/10 bg-neutral-950/95 flex-col">
      <div className="h-7 flex items-center px-2.5 border-b border-white/5 text-[10px] uppercase tracking-[0.2em] text-white/40">
        Inspector
      </div>
      <div className="p-2.5 space-y-2.5 text-[11px]">
        <div className="flex items-center gap-1.5">
          <App.icon className="w-3 h-3 text-emerald-400" />
          <span className="text-white/80 font-medium">{App.name}</span>
        </div>
        <div className="space-y-1">
          <Row label="Mode" value="panel" />
          <Row label="Provider" value="mounted" />
          <Row label="Slots" value="Content" />
          <Row label="Status" value="idle" accent />
        </div>
      </div>
      <div className="mt-auto p-2.5 border-t border-white/5">
        <div className="text-[9px] uppercase tracking-[0.2em] text-white/30 mb-1">
          Commands
        </div>
        <div className="space-y-0.5">
          <Cmd label="Open palette" shortcut="⌘K" />
          <Cmd label="Toggle terminal" shortcut="⌘J" />
        </div>
      </div>
    </aside>
  );
}

function Row({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-white/40">{label}</span>
      <span
        className={`font-mono text-[10px] ${
          accent ? 'text-emerald-300' : 'text-white/70'
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function Cmd({ label, shortcut }: { label: string; shortcut: string }) {
  return (
    <div className="flex items-center justify-between text-[10px] px-1.5 py-0.5 rounded hover:bg-white/5">
      <span className="text-white/60">{label}</span>
      <kbd className="px-1 py-0.5 rounded bg-white/[0.04] text-white/50 font-mono text-[9px]">
        {shortcut}
      </kbd>
    </div>
  );
}

function StatusBar({ activeApp }: { activeApp: AppId }) {
  const App = APPS[activeApp];
  return (
    <footer className="h-6 shrink-0 flex items-center justify-between px-2.5 border-t border-white/10 bg-neutral-950/95 text-[10px]">
      <div className="flex items-center gap-2.5 text-white/50">
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          Mock fallback
        </span>
        <span className="text-white/20">·</span>
        <span>{App.name}</span>
      </div>
      <div className="flex items-center gap-2.5 text-white/40">
        <span className="flex items-center gap-0.5">
          <Command className="w-2.5 h-2.5" />K
        </span>
        <span>v0.1</span>
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared bits
// ─────────────────────────────────────────────────────────────────────────────

function Corners() {
  const base = 'absolute w-2 h-2 border-emerald-400/40 pointer-events-none';
  return (
    <>
      <span className={`${base} top-1 left-1 border-t border-l`} />
      <span className={`${base} top-1 right-1 border-t border-r`} />
      <span className={`${base} bottom-1 left-1 border-b border-l`} />
      <span className={`${base} bottom-1 right-1 border-b border-r`} />
    </>
  );
}

function HudsonMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={className}
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
    </svg>
  );
}
