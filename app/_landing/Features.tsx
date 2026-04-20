import {
  Code2,
  Layers,
  LayoutGrid,
  MousePointer2,
  PanelsTopLeft,
  Terminal,
} from 'lucide-react';
import type { ComponentType } from 'react';

interface FeatureItem {
  icon: ComponentType<{ className?: string }>;
  title: string;
  body: string;
}

const PATTERN: FeatureItem[] = [
  {
    icon: Layers,
    title: 'Apps own their state',
    body: 'Each app is a React Provider. The shell nests providers and renders slots.',
  },
  {
    icon: PanelsTopLeft,
    title: 'Slots, not prescriptions',
    body: 'Apps declare what they want in the nav, side panels, overlays. The shell composes.',
  },
  {
    icon: Code2,
    title: 'Strict TypeScript interface',
    body: 'Implement HudsonApp and you get chrome, windows, intents, and AI for free.',
  },
];

const PRIMITIVES: FeatureItem[] = [
  {
    icon: LayoutGrid,
    title: 'Canvas workspace',
    body: 'Pan, zoom, and windowed apps on an infinite plane. Or static panels for dashboards.',
  },
  {
    icon: Terminal,
    title: 'Built-in AI + terminal',
    body: 'Bottom drawer ships with Hudson AI and an embedded PTY terminal.',
  },
  {
    icon: MousePointer2,
    title: 'Keyboard-first',
    body: 'Command palette, focus model, hold-space pan — designed for power users.',
  },
];

export function Features() {
  return (
    <section className="py-32 px-8 lg:px-16">
      <div className="max-w-[1080px] mx-auto">
        <h2 className="font-brand text-2xl md:text-3xl font-medium text-white/90 mb-16">
          Built for builders
        </h2>

        <div className="grid md:grid-cols-2 gap-12 md:gap-16">
          <FeatureColumn eyebrow="The Pattern" title="Provider + Slots + Hooks" items={PATTERN} />
          <FeatureColumn eyebrow="The Primitives" title="Canvas · Windows · Chrome" items={PRIMITIVES} />
        </div>
      </div>
    </section>
  );
}

function FeatureColumn({
  eyebrow,
  title,
  items,
}: {
  eyebrow: string;
  title: string;
  items: FeatureItem[];
}) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-[0.2em] text-emerald-400/70">
        {eyebrow}
      </div>
      <h3 className="mt-1 font-brand text-xl md:text-2xl font-medium text-white/90 mb-8">
        {title}
      </h3>
      <ul className="space-y-6">
        {items.map((it) => (
          <li key={it.title} className="flex gap-4">
            <div className="flex-shrink-0 w-9 h-9 rounded-md border border-emerald-500/20 bg-emerald-500/5 flex items-center justify-center">
              <it.icon className="w-4 h-4 text-emerald-300" />
            </div>
            <div>
              <div className="text-[14px] font-medium text-white/90">
                {it.title}
              </div>
              <p className="mt-1 text-[13px] text-neutral-500 leading-relaxed">
                {it.body}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
