interface ShellCardProps {
  name: string;
  tagline: string;
  body: string;
  tag: string;
  accent: 'emerald' | 'cyan';
}

const SHELLS: ShellCardProps[] = [
  {
    name: 'AppShell',
    tagline: 'Single app. Full chrome.',
    body: "For most consumers. A polished frame around one HudsonApp — nav, sidebar, status bar. Use when you're shipping a focused tool.",
    tag: 'Single app',
    accent: 'emerald',
  },
  {
    name: 'WorkspaceShell',
    tagline: 'Multi-app canvas.',
    body: "Infinite pan/zoom plane with windowed apps. Used by Hudson's own /app route. Use when the interface is the environment.",
    tag: 'Multi-app',
    accent: 'cyan',
  },
];

export function Shells() {
  return (
    <section className="py-32 px-8 lg:px-16">
      <div className="max-w-[900px] mx-auto">
        <div className="text-center">
          <div className="text-[11px] uppercase tracking-[0.2em] text-emerald-400/70">
            Two shells, same primitives
          </div>
          <h2 className="mt-1 font-brand text-2xl md:text-3xl font-medium text-white/90 mb-12">
            Pick the chrome that fits.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {SHELLS.map((shell) => (
            <ShellCard key={shell.name} {...shell} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ShellCard({ name, tagline, body, tag, accent }: ShellCardProps) {
  const ring =
    accent === 'cyan'
      ? 'border-cyan-400/20 hover:border-cyan-400/40'
      : 'border-emerald-400/20 hover:border-emerald-400/40';
  const text = accent === 'cyan' ? 'text-cyan-300' : 'text-emerald-300';
  return (
    <div
      className={`relative rounded-lg border ${ring} bg-white/[0.02] p-6 transition`}
    >
      <div className="flex items-baseline justify-between">
        <div className={`font-brand text-lg ${text}`}>{name}</div>
        <div className="text-[11px] uppercase tracking-wider text-white/40">
          {tag}
        </div>
      </div>
      <div className="mt-2 text-[15px] font-medium text-white/85">
        {tagline}
      </div>
      <p className="mt-3 text-[13px] text-neutral-500 leading-relaxed">
        {body}
      </p>
    </div>
  );
}
