import Link from 'next/link';

export function NavHeader() {
  return (
    <header className="h-12 shrink-0 border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-xl flex items-center justify-between px-5 sticky top-0 z-50">
      <Link
        href="/"
        className="text-sm font-mono font-bold tracking-widest text-white uppercase"
      >
        Hudson
      </Link>
      <nav className="flex items-center gap-5">
        <Link
          href="https://app.hudsonos.com/docs"
          className="text-xs font-mono tracking-widest text-neutral-400 hover:text-neutral-200 transition-colors uppercase"
        >
          Docs
        </Link>
        <Link
          href="/releases"
          className="text-xs font-mono tracking-widest text-neutral-400 hover:text-neutral-200 transition-colors uppercase"
        >
          Download
        </Link>
        <Link
          href="/demo"
          className="text-xs font-mono tracking-widest text-neutral-400 hover:text-neutral-200 transition-colors uppercase"
        >
          Demo
        </Link>
        <Link
          href="https://github.com/arach/hudson"
          className="text-xs font-mono tracking-widest text-emerald-400 hover:text-emerald-300 transition-colors uppercase"
        >
          GitHub
        </Link>
      </nav>
    </header>
  );
}
