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
// Curated Hudson workspace preview — fully self-contained, zero external deps.
// Visually mirrors the real AppShell + WorkspaceShell chrome for the landing
// iframe. Three faux apps arranged as windows on a dark HUD canvas.
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

export default function PreviewPage() {
  const [activeApp, setActiveApp] = useState<AppId>('docs');

  return (
    <div className="h-screen w-screen bg-neutral-950 text-white flex flex-col overflow-hidden">
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
// Top nav
// ─────────────────────────────────────────────────────────────────────────────

function NavBar() {
  return (
    <header className="h-12 shrink-0 flex items-center justify-between px-4 border-b border-white/10 bg-neutral-950/95 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <HudsonMark className="w-4 h-4 text-emerald-400" />
        <span className="text-[13px] tracking-wider">HUDSON</span>
        <div className="ml-2 px-2 py-0.5 rounded border border-white/10 bg-white/[0.03] text-[10px] uppercase tracking-wider text-white/50">
          Preview
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-white/10 bg-white/[0.02] text-[11px] text-white/40">
          <Search className="w-3 h-3" />
          <span>Search…</span>
          <kbd className="ml-4 px-1.5 py-0.5 rounded bg-white/[0.04] text-[10px] font-mono">
            ⌘K
          </kbd>
        </div>
      </div>
    </header>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// App launcher (left rail)
// ─────────────────────────────────────────────────────────────────────────────

function AppLauncher({
  activeApp,
  onSelect,
}: {
  activeApp: AppId;
  onSelect: (id: AppId) => void;
}) {
  return (
    <aside className="w-12 shrink-0 border-r border-white/10 bg-neutral-950/95 flex flex-col items-center py-3 gap-1.5">
      {(Object.keys(APPS) as AppId[]).map((id) => {
        const App = APPS[id];
        const active = id === activeApp;
        return (
          <button
            key={id}
            onClick={() => onSelect(id)}
            title={App.name}
            className={`w-8 h-8 rounded-md flex items-center justify-center transition ${
              active
                ? 'bg-emerald-400/10 border border-emerald-400/30 text-emerald-300'
                : 'text-white/40 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <App.icon className="w-4 h-4" />
          </button>
        );
      })}
    </aside>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Canvas — renders one of the faux app surfaces
// ─────────────────────────────────────────────────────────────────────────────

function Canvas({ activeApp }: { activeApp: AppId }) {
  return (
    <main className="flex-1 relative min-w-0 bg-neutral-950 overflow-hidden">
      <CanvasGrid />
      <div className="relative h-full p-6 flex items-center justify-center">
        <AppWindow app={activeApp} />
      </div>
    </main>
  );
}

function CanvasGrid() {
  return (
    <div
      className="absolute inset-0 pointer-events-none opacity-[0.04]"
      style={{
        backgroundImage:
          'linear-gradient(to right, rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.6) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }}
    />
  );
}

function AppWindow({ app }: { app: AppId }) {
  const App = APPS[app];
  return (
    <div className="w-full max-w-[760px] h-full max-h-[480px] rounded-lg border border-white/10 bg-neutral-900/80 backdrop-blur overflow-hidden shadow-[0_20px_60px_-20px_rgba(16,185,129,0.12)] relative">
      <Corners />
      {/* Window chrome */}
      <div className="h-8 flex items-center justify-between px-3 border-b border-white/5 bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <App.icon className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-[12px] text-white/80">{App.name}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
          <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
          <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
        </div>
      </div>
      <div className="p-5 h-[calc(100%-32px)] overflow-auto">
        {app === 'docs' && <DocsContent />}
        {app === 'assistant' && <AssistantContent />}
        {app === 'notepad' && <NotepadContent />}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Faux app content
// ─────────────────────────────────────────────────────────────────────────────

function DocsContent() {
  return (
    <div className="text-[13px] leading-relaxed">
      <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-emerald-400/70 mb-2">
        <span>Building Apps</span>
        <ChevronRight className="w-3 h-3" />
        <span>Overview</span>
      </div>
      <h2 className="text-xl text-white/90 mb-4 font-medium">
        The HudsonApp interface
      </h2>
      <p className="text-white/60 mb-3">
        Every Hudson app implements a single TypeScript interface. The shell
        reads your Provider, slots, and hooks — and renders the rest.
      </p>
      <pre className="font-mono text-[11.5px] leading-[1.7] bg-black/40 border border-white/5 rounded-md p-3 text-white/80 overflow-x-auto">
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
    <div className="text-[13px] space-y-3">
      <div className="flex gap-3">
        <div className="w-7 h-7 rounded-md bg-emerald-400/10 border border-emerald-400/30 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
        </div>
        <div className="flex-1 space-y-1">
          <div className="text-[11px] uppercase tracking-wider text-white/40">
            Assistant
          </div>
          <p className="text-white/80">
            I can help you explore Hudson — try asking me to open an app,
            explain the shell, or scaffold a new app.
          </p>
        </div>
      </div>
      <div className="flex gap-3">
        <div className="w-7 h-7 rounded-md bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
          <span className="text-[11px] text-white/60">You</span>
        </div>
        <div className="flex-1 space-y-1 text-white/70">
          <p>Scaffold a notepad app.</p>
        </div>
      </div>
      <div className="flex gap-3">
        <div className="w-7 h-7 rounded-md bg-emerald-400/10 border border-emerald-400/30 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
        </div>
        <div className="flex-1">
          <p className="text-white/80 mb-2">On it. Running:</p>
          <div className="font-mono text-[11.5px] bg-black/40 border border-white/5 rounded-md px-3 py-2 text-emerald-300 flex items-center gap-2">
            <Terminal className="w-3 h-3" />
            bunx create-hudson-app notepad
          </div>
        </div>
      </div>
    </div>
  );
}

function NotepadContent() {
  return (
    <div className="font-mono text-[13px] leading-relaxed text-white/80">
      <div className="text-[11px] uppercase tracking-[0.2em] text-emerald-400/70 mb-3">
        Untitled · draft
      </div>
      <h2 className="text-lg text-white/90 mb-3 font-medium">
        Shipping plan
      </h2>
      <ul className="space-y-1.5 text-white/70">
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
      <p className="mt-5 text-white/50 text-[12px]">
        Notes persist via <code className="text-emerald-300">usePersistentState</code>{' '}
        — localStorage-backed, hooks-only, zero config.
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Inspector (right rail)
// ─────────────────────────────────────────────────────────────────────────────

function Inspector({ activeApp }: { activeApp: AppId }) {
  const App = APPS[activeApp];
  return (
    <aside className="hidden md:flex w-[220px] shrink-0 border-l border-white/10 bg-neutral-950/95 flex-col">
      <div className="h-8 flex items-center px-3 border-b border-white/5 text-[11px] uppercase tracking-[0.2em] text-white/40">
        Inspector
      </div>
      <div className="p-3 space-y-3 text-[12px]">
        <div className="flex items-center gap-2">
          <App.icon className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-white/80 font-medium">{App.name}</span>
        </div>
        <div className="space-y-1.5">
          <InspectorRow label="Mode" value="panel" />
          <InspectorRow label="Provider" value="mounted" />
          <InspectorRow label="Slots" value="Content, Inspector" />
          <InspectorRow label="Status" value="idle" accent />
        </div>
      </div>
      <div className="mt-auto p-3 border-t border-white/5">
        <div className="text-[10px] uppercase tracking-[0.2em] text-white/30 mb-1.5">
          Commands
        </div>
        <div className="space-y-1">
          <InspectorCommand label="Open palette" shortcut="⌘K" />
          <InspectorCommand label="Toggle terminal" shortcut="⌘J" />
        </div>
      </div>
    </aside>
  );
}

function InspectorRow({
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
        className={`font-mono text-[11px] ${
          accent ? 'text-emerald-300' : 'text-white/70'
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function InspectorCommand({
  label,
  shortcut,
}: {
  label: string;
  shortcut: string;
}) {
  return (
    <div className="flex items-center justify-between text-[11px] px-2 py-1 rounded hover:bg-white/5">
      <span className="text-white/60">{label}</span>
      <kbd className="px-1.5 py-0.5 rounded bg-white/[0.04] text-white/50 font-mono text-[10px]">
        {shortcut}
      </kbd>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Status bar (bottom)
// ─────────────────────────────────────────────────────────────────────────────

function StatusBar({ activeApp }: { activeApp: AppId }) {
  const App = APPS[activeApp];
  return (
    <footer className="h-7 shrink-0 flex items-center justify-between px-3 border-t border-white/10 bg-neutral-950/95 text-[11px]">
      <div className="flex items-center gap-3 text-white/50">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          {App.name}
        </span>
        <span className="text-white/20">·</span>
        <span>workspace: preview</span>
      </div>
      <div className="flex items-center gap-3 text-white/40">
        <span className="flex items-center gap-1">
          <Command className="w-3 h-3" />K
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
  const base = 'absolute w-2.5 h-2.5 border-emerald-400/40 pointer-events-none';
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
