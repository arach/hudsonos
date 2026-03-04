'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Download, Apple, Monitor, ExternalLink } from 'lucide-react';
import { NavHeader } from '../_landing/NavHeader';
import { Footer } from '../_landing/Footer';
import '../_landing/landing.css';

interface ReleaseAsset {
  name: string;
  browser_download_url: string;
  size: number;
  download_count: number;
}

interface Release {
  id: number;
  tag_name: string;
  name: string;
  published_at: string;
  body: string;
  html_url: string;
  prerelease: boolean;
  assets: ReleaseAsset[];
}

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function platformInfo(name: string) {
  if (name.endsWith('.dmg'))
    return { label: 'macOS', ext: '.dmg', icon: Apple };
  if (name.endsWith('.zip') && /mac|darwin/i.test(name))
    return { label: 'macOS', ext: '.zip', icon: Apple };
  if (name.endsWith('.exe') || name.endsWith('.msi'))
    return { label: 'Windows', ext: name.slice(name.lastIndexOf('.')), icon: Monitor };
  if (name.endsWith('.AppImage') || name.endsWith('.deb'))
    return { label: 'Linux', ext: name.slice(name.lastIndexOf('.')), icon: Monitor };
  return { label: 'Download', ext: '', icon: Download };
}

/** Very simple markdown-ish rendering: **bold**, `code`, headings, lists */
function ReleaseBody({ body }: { body: string }) {
  const lines = body.split('\n');

  return (
    <div className="space-y-1.5">
      {lines.map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={i} className="h-2" />;

        // ## Heading
        if (trimmed.startsWith('## ')) {
          return (
            <h3
              key={i}
              className="text-xs font-mono font-bold text-neutral-300 tracking-wide uppercase mt-4 mb-1"
            >
              {trimmed.slice(3)}
            </h3>
          );
        }

        // - List item with **bold** and `code`
        if (trimmed.startsWith('- ')) {
          return (
            <div key={i} className="flex gap-2 text-xs font-mono text-neutral-400 leading-relaxed">
              <span className="text-emerald-500/60 shrink-0">-</span>
              <span dangerouslySetInnerHTML={{
                __html: trimmed
                  .slice(2)
                  .replace(/\*\*(.+?)\*\*/g, '<span class="text-neutral-200 font-semibold">$1</span>')
                  .replace(/`(.+?)`/g, '<code class="text-emerald-400/80 bg-emerald-400/5 px-1 rounded text-[11px]">$1</code>')
              }} />
            </div>
          );
        }

        // Regular line with inline formatting
        return (
          <p
            key={i}
            className="text-xs font-mono text-neutral-400 leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: trimmed
                .replace(/\*\*(.+?)\*\*/g, '<span class="text-neutral-200 font-semibold">$1</span>')
                .replace(/`(.+?)`/g, '<code class="text-emerald-400/80 bg-emerald-400/5 px-1 rounded text-[11px]">$1</code>')
            }}
          />
        );
      })}
    </div>
  );
}

function Skeleton() {
  return (
    <div className="space-y-6">
      {[1, 2].map((i) => (
        <div key={i} className="animate-pulse">
          <div className="rounded-xl border border-neutral-800/60 bg-neutral-900/30 p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-7 w-20 bg-neutral-800 rounded-md" />
              <div className="h-4 w-40 bg-neutral-800/50 rounded" />
            </div>
            <div className="h-12 w-full bg-neutral-800/30 rounded-lg mb-6" />
            <div className="space-y-2">
              <div className="h-3 w-full bg-neutral-800/20 rounded" />
              <div className="h-3 w-4/5 bg-neutral-800/20 rounded" />
              <div className="h-3 w-3/5 bg-neutral-800/20 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ReleasesPage() {
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('https://api.github.com/repos/arach/hudsonos/releases')
      .then((res) => {
        if (!res.ok) throw new Error(`GitHub API returned ${res.status}`);
        return res.json();
      })
      .then((data) => setReleases(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const latest = releases[0];
  const older = releases.slice(1);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-neutral-200 flex flex-col">
      <NavHeader />

      <main className="flex-1 max-w-[860px] mx-auto w-full px-6 pt-20 pb-24">
        {/* Page header */}
        <div className="mb-16">
          <h1 className="text-4xl font-mono font-bold tracking-wide text-white mb-3">
            Releases
          </h1>
          <p className="text-sm text-neutral-500 font-mono leading-relaxed max-w-[480px]">
            Download the latest version of Hudson. Code-signed and notarized by Apple.
          </p>
        </div>

        {loading && <Skeleton />}

        {error && (
          <div className="rounded-xl border border-neutral-800/60 bg-neutral-900/20 p-10 text-center">
            <p className="text-sm text-neutral-400 font-mono mb-5">
              Could not load releases from GitHub.
            </p>
            <Link
              href="https://github.com/arach/hudsonos/releases"
              className="btn-primary font-mono"
            >
              View on GitHub
            </Link>
          </div>
        )}

        {!loading && !error && releases.length === 0 && (
          <div className="rounded-xl border border-neutral-800/60 bg-neutral-900/20 p-10 text-center">
            <p className="text-sm text-neutral-500 font-mono mb-5">
              No releases published yet.
            </p>
            <Link
              href="https://github.com/arach/hudsonos"
              className="btn-secondary font-mono"
            >
              View Repository
            </Link>
          </div>
        )}

        {/* Latest release — hero card */}
        {latest && (
          <div className="mb-16">
            <div
              className="rounded-xl overflow-hidden"
              style={{
                background:
                  'linear-gradient(165deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 40%, rgba(0,0,0,0.1) 100%)',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow:
                  'inset 0 1px 0 rgba(255,255,255,0.06), 0 4px 24px rgba(0,0,0,0.4)',
              }}
            >
              {/* Header */}
              <div className="px-8 pt-8 pb-6 border-b border-neutral-800/40">
                <div className="flex items-center gap-3 mb-1">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold tracking-wide">
                    {latest.tag_name}
                  </span>
                  <span className="text-[10px] font-mono tracking-widest text-emerald-400/60 uppercase">
                    Latest
                  </span>
                  {latest.prerelease && (
                    <span className="text-[10px] font-mono tracking-widest uppercase px-2 py-0.5 rounded-full border border-yellow-500/30 text-yellow-400">
                      Pre-release
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-3">
                  {latest.name && latest.name !== latest.tag_name && (
                    <span className="text-sm font-mono text-neutral-300">
                      {latest.name}
                    </span>
                  )}
                  <span className="text-xs font-mono text-neutral-600">
                    {new Date(latest.published_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </div>

              {/* Download buttons */}
              {latest.assets.length > 0 && (
                <div className="px-8 py-5 border-b border-neutral-800/40 bg-neutral-950/30">
                  <div className="flex flex-wrap gap-3">
                    {latest.assets.map((asset) => {
                      const info = platformInfo(asset.name);
                      const Icon = info.icon;
                      return (
                        <a
                          key={asset.name}
                          href={asset.browser_download_url}
                          className="btn-primary font-mono flex items-center gap-2.5 text-sm"
                        >
                          <Icon className="w-4 h-4" />
                          <span>Download for {info.label}</span>
                          <span className="opacity-50 text-xs">
                            {formatBytes(asset.size)}
                          </span>
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Release notes */}
              {latest.body && (
                <div className="px-8 py-6">
                  <ReleaseBody body={latest.body} />
                </div>
              )}

              {/* Footer link */}
              <div className="px-8 pb-6">
                <a
                  href={latest.html_url}
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-600 hover:text-neutral-400 transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  View on GitHub
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Older releases */}
        {older.length > 0 && (
          <div>
            <h2 className="text-sm font-mono font-bold tracking-widest text-neutral-500 uppercase mb-6">
              Previous Releases
            </h2>

            <div className="space-y-4">
              {older.map((release) => (
                <article
                  key={release.id}
                  className="group rounded-lg border border-neutral-800/50 bg-neutral-900/20 hover:border-neutral-700/50 transition-colors"
                >
                  <div className="px-6 py-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono font-bold text-neutral-300 bg-neutral-800/50 px-2 py-0.5 rounded">
                          {release.tag_name}
                        </span>
                        {release.name && release.name !== release.tag_name && (
                          <span className="text-xs font-mono text-neutral-500">
                            {release.name}
                          </span>
                        )}
                        {release.prerelease && (
                          <span className="text-[9px] font-mono tracking-widest uppercase px-1.5 py-0.5 rounded border border-yellow-500/20 text-yellow-500/70">
                            Pre-release
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-mono text-neutral-600">
                        {new Date(release.published_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>

                    {/* Compact asset list */}
                    {release.assets.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {release.assets.map((asset) => {
                          const info = platformInfo(asset.name);
                          const Icon = info.icon;
                          return (
                            <a
                              key={asset.name}
                              href={asset.browser_download_url}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono border border-neutral-800 bg-neutral-900/40 text-neutral-400 hover:text-emerald-400 hover:border-emerald-500/30 transition-colors"
                            >
                              <Icon className="w-3 h-3" />
                              <span>{info.label}</span>
                              <span className="text-neutral-600 text-[10px]">
                                {formatBytes(asset.size)}
                              </span>
                            </a>
                          );
                        })}
                      </div>
                    )}

                    {/* Collapsed release notes */}
                    {release.body && (
                      <details className="group/details">
                        <summary className="text-xs font-mono text-neutral-600 hover:text-neutral-400 transition-colors cursor-pointer select-none">
                          Release notes
                        </summary>
                        <div className="mt-3 pt-3 border-t border-neutral-800/30">
                          <ReleaseBody body={release.body} />
                        </div>
                      </details>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
