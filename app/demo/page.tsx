import Image from 'next/image';
import Link from 'next/link';
import { NavHeader } from '../_landing/NavHeader';
import { Footer } from '../_landing/Footer';

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-[family-name:var(--font-geist-mono)]">
      <NavHeader />

      <main className="flex-1 max-w-[1080px] mx-auto w-full px-6 py-16">
        <h1 className="text-3xl font-mono font-bold tracking-wide mb-2">
          See Hudson in Action
        </h1>
        <p className="text-sm text-neutral-500 font-mono mb-12">
          A multi-app canvas workspace for React — pan, zoom, and window your
          apps in a unified spatial environment.
        </p>

        {/* Hero screenshot */}
        <div className="relative rounded-xl overflow-hidden border border-neutral-800 mb-12">
          <Image
            src="/demo/hero.png"
            alt="Hudson workspace screenshot"
            width={1920}
            height={1080}
            className="w-full h-auto"
            priority
          />
        </div>

        {/* CTA */}
        <div className="flex items-center gap-4 mb-20">
          <Link href="https://app.hudsonos.com" className="btn-primary font-mono">
            Open Hudson
          </Link>
          <Link href="/releases" className="btn-secondary font-mono">
            Download
          </Link>
        </div>

        {/* Feature preview grid */}
        <h2 className="text-xl font-mono font-bold tracking-wide text-neutral-100 mb-8">
          Key Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: 'Spatial Canvas',
              description:
                'Pan and zoom through your apps in an infinite 2D workspace with smooth hardware-accelerated rendering.',
            },
            {
              title: 'Provider + Slots',
              description:
                'Build apps using a simple interface — Provider wraps state, Slots define UI regions. No boilerplate.',
            },
            {
              title: 'Hooks API',
              description:
                'Expose commands, status, and search from your app with useCommands, useStatus, and useSearch hooks.',
            },
            {
              title: 'Windowing',
              description:
                'Each app lives in a draggable, resizable window with focus management and z-ordering built in.',
            },
            {
              title: 'Command Palette',
              description:
                'Unified command palette aggregates actions from every running app. Search and execute anything.',
            },
            {
              title: 'Hot Module Reload',
              description:
                'Apps reload independently without losing workspace layout. True HMR for multi-app development.',
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="border border-neutral-800 rounded-lg p-5"
            >
              <h3 className="text-sm font-mono font-bold text-neutral-200 mb-2">
                {feature.title}
              </h3>
              <p className="text-xs text-neutral-500 font-mono leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
