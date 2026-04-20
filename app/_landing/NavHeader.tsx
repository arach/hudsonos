import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { APP_URL } from './env';

export function NavHeader() {
  return (
    <header className="relative z-50 flex items-center justify-between px-6 md:px-10 h-14 border-b border-white/5 bg-neutral-950/80 backdrop-blur-xl sticky top-0">
      <Link href="/" className="flex items-center gap-2">
        <HudsonMark className="w-5 h-5 text-emerald-400" />
        <span className="font-brand text-[15px] tracking-wider text-white">
          HUDSON
        </span>
      </Link>
      <nav className="flex items-center gap-1 text-[13px]">
        <Link
          href="/docs"
          className="px-3 py-1.5 rounded-md text-white/60 hover:text-white hover:bg-white/5 transition"
        >
          Docs
        </Link>
        <Link
          href={`${APP_URL}/app`}
          className="ml-2 px-3 py-1.5 rounded-md border border-emerald-400/30 bg-emerald-400/10 text-emerald-300 hover:bg-emerald-400/20 hover:border-emerald-400/50 transition flex items-center gap-1.5"
        >
          Open the Workspace
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </nav>
    </header>
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
