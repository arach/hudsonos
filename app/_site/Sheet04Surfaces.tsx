'use client';

import { useEffect, useState } from 'react';
import { useInView, useTypewriter } from './animate';
import { Eyebrow, FooterPlate, Slug, TitleBlock } from './Shared';

const SHIP_CMD = 'hudson ship --all';

function ShipBlock() {
  const [ref, inView] = useInView<HTMLPreElement>({ threshold: 0.4 });
  const cmd = useTypewriter(SHIP_CMD, { inView, speed: 38, startDelay: 200 });
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (!inView) {
      setStage(0);
      return;
    }
    const timers = [
      setTimeout(() => setStage(1), 900),
      setTimeout(() => setStage(2), 1500),
      setTimeout(() => setStage(3), 2100),
      setTimeout(() => setStage(4), 2700),
      setTimeout(() => {
        setStage(5);
        window.__hudAudio?.chime();
      }, 3200),
    ];
    return () => timers.forEach(clearTimeout);
  }, [inView]);

  const ok = <span style={{ color: 'oklch(0.78 0.16 162)' }}>✓</span>;
  return (
    <pre ref={ref} className="code" style={{ margin: 0, minHeight: 168 }}>
      {'$ '}
      <span className="kw">{cmd}</span>
      {cmd.length === SHIP_CMD.length ? '' : <span style={{ opacity: 0.5 }}>▌</span>}
      {'\n'}
      {stage >= 1 && (
        <>
          <span className="com">  › building 3 surfaces…</span>
          {'\n'}
        </>
      )}
      {stage >= 2 && <>  {ok} ios     → TestFlight{'\n'}</>}
      {stage >= 3 && <>  {ok} macos   → notarized{'\n'}</>}
      {stage >= 4 && <>  {ok} web     → CDN{'\n'}</>}
      {stage >= 5 && (
        <>
          {'  '}
          <span className="com">3 surfaces · 0 forks · 41s</span>
        </>
      )}
    </pre>
  );
}

function ManifestBox() {
  return (
    <div
      style={{
        border: '1.5px solid var(--ink)',
        background: 'var(--ink)',
        color: 'oklch(0.92 0 0)',
        padding: 18,
        fontFamily: 'var(--font-mono)',
        fontSize: 11.5,
        lineHeight: 1.55,
        width: 280,
      }}
    >
      <div
        style={{
          fontSize: 9,
          letterSpacing: '0.2em',
          color: 'oklch(0.72 0.18 162)',
          marginBottom: 12,
          textTransform: 'uppercase',
        }}
      >
        SOURCE · manifest.ts
      </div>
      <span style={{ color: 'oklch(0.78 0.13 320)' }}>const </span>
      <span style={{ color: 'oklch(0.95 0 0)' }}>app</span>:{' '}
      <span style={{ color: 'oklch(0.78 0.13 320)' }}>HudsonApp</span> = {'{'}
      <br />
      {'  '}id: <span style={{ color: 'oklch(0.78 0.16 162)' }}>&quot;talkie&quot;</span>,
      <br />
      {'  '}mode: <span style={{ color: 'oklch(0.78 0.16 162)' }}>&quot;canvas&quot;</span>,
      <br />
      {'  '}intents: [<span style={{ color: 'oklch(0.78 0.17 75)' }}>12</span>],
      <br />
      {'  '}surfaces: [
      <br />
      {'    '}<span style={{ color: 'oklch(0.78 0.16 162)' }}>&quot;ios&quot;</span>,
      <br />
      {'    '}<span style={{ color: 'oklch(0.78 0.16 162)' }}>&quot;macos&quot;</span>,
      <br />
      {'    '}<span style={{ color: 'oklch(0.78 0.16 162)' }}>&quot;web&quot;</span>,
      <br />
      {'  '}],
      <br />
      {'};'}
    </div>
  );
}

function SplitArrow() {
  return (
    <div className="reflow-split-arrow" style={{ width: 60, height: 200, position: 'relative' }}>
      <svg width="60" height="200" viewBox="0 0 60 200" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <marker
            id="sArr"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto"
          >
            <path d="M0,0 L10,5 L0,10 z" fill="var(--ink)" />
          </marker>
        </defs>
        <line x1="0" y1="100" x2="20" y2="100" stroke="var(--ink)" strokeWidth="1.5" />
        <line x1="20" y1="40" x2="20" y2="160" stroke="var(--ink)" strokeWidth="1.5" />
        <line
          x1="20"
          y1="40"
          x2="55"
          y2="40"
          stroke="var(--ink)"
          strokeWidth="1.5"
          markerEnd="url(#sArr)"
        />
        <line
          x1="20"
          y1="100"
          x2="55"
          y2="100"
          stroke="var(--ink)"
          strokeWidth="1.5"
          markerEnd="url(#sArr)"
        />
        <line
          x1="20"
          y1="160"
          x2="55"
          y2="160"
          stroke="var(--ink)"
          strokeWidth="1.5"
          markerEnd="url(#sArr)"
        />
      </svg>
    </div>
  );
}

function PlatformFrame({
  kind,
  label,
  sub,
}: {
  kind: 'ios' | 'macos' | 'web';
  label: string;
  sub: string;
}) {
  const isMobile = kind === 'ios';
  const W = isMobile ? 132 : 220;
  const H = isMobile ? 200 : 156;
  const radius = kind === 'ios' ? 18 : kind === 'macos' ? 6 : 4;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <div
        style={{
          width: W,
          height: H,
          background: 'oklch(0.145 0 0)',
          border: '1.5px solid var(--ink)',
          borderRadius: radius,
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 4px 0 var(--paper-edge)',
        }}
      >
        {kind === 'macos' && (
          <div style={{ position: 'absolute', top: 6, left: 8, display: 'flex', gap: 5 }}>
            {['oklch(0.65 0.2 30)', 'oklch(0.78 0.16 80)', 'oklch(0.7 0.17 145)'].map((c, i) => (
              <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: c }} />
            ))}
          </div>
        )}
        {kind === 'ios' && (
          <div
            style={{
              position: 'absolute',
              top: 6,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 50,
              height: 12,
              background: 'oklch(0.05 0 0)',
              borderRadius: 6,
            }}
          />
        )}
        {kind === 'web' && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 18,
              background: 'oklch(0.20 0 0)',
              borderBottom: '1px solid oklch(0.30 0 0)',
              display: 'flex',
              alignItems: 'center',
              paddingLeft: 8,
              gap: 6,
            }}
          >
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{ width: 6, height: 6, borderRadius: '50%', background: 'oklch(0.4 0 0)' }}
              />
            ))}
          </div>
        )}

        <div
          style={{
            position: 'absolute',
            top: kind === 'ios' ? 24 : 22,
            left: 0,
            right: 0,
            height: kind === 'ios' ? 22 : 14,
            background: 'oklch(0.18 0 0)',
            borderBottom: '1px solid oklch(0.72 0.18 162 / 0.4)',
            display: 'flex',
            alignItems: 'center',
            paddingLeft: 6,
            gap: 4,
          }}
        >
          <div
            style={{ width: 8, height: 8, background: 'oklch(0.72 0.18 162)', borderRadius: 2 }}
          />
          <div style={{ width: 24, height: 4, background: 'oklch(0.4 0 0)' }} />
          <div style={{ width: 18, height: 4, background: 'oklch(0.4 0 0)' }} />
        </div>

        <div
          style={{
            position: 'absolute',
            left: 0,
            top: kind === 'ios' ? 46 : 36,
            bottom: 14,
            width: kind === 'ios' ? 28 : 44,
            background: 'oklch(0.18 0 0)',
            borderRight: '1px solid oklch(0.30 0 0)',
          }}
        />
        {kind !== 'ios' && (
          <div
            style={{
              position: 'absolute',
              right: 0,
              top: 36,
              bottom: 14,
              width: 44,
              background: 'oklch(0.18 0 0)',
              borderLeft: '1px solid oklch(0.30 0 0)',
            }}
          />
        )}
        <div
          style={{
            position: 'absolute',
            left: kind === 'ios' ? 28 : 44,
            right: kind === 'ios' ? 0 : 44,
            top: kind === 'ios' ? 46 : 36,
            bottom: 14,
            background: 'oklch(0.145 0 0)',
            backgroundImage:
              'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1.4px)',
            backgroundSize: '12px 12px',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: '60%',
              height: '40%',
              border: '1px solid oklch(0.72 0.18 162 / 0.6)',
              background: 'oklch(0.72 0.18 162 / 0.08)',
            }}
          />
        </div>
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: 14,
            background: 'oklch(0.18 0 0)',
            borderTop: '1px solid oklch(0.30 0 0)',
            display: 'flex',
            alignItems: 'center',
            paddingLeft: 6,
          }}
        >
          <div
            style={{ width: 6, height: 6, borderRadius: '50%', background: 'oklch(0.7 0.17 145)' }}
          />
          <div style={{ width: 30, height: 3, background: 'oklch(0.4 0 0)', marginLeft: 6 }} />
        </div>
      </div>

      <div
        style={{
          textAlign: 'center',
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
        }}
      >
        <div style={{ color: 'var(--ink)', fontWeight: 600 }}>{label}</div>
        <div
          style={{
            color: 'var(--ink-2)',
            fontSize: 9.5,
            marginTop: 4,
            letterSpacing: '0.12em',
          }}
        >
          {sub}
        </div>
      </div>
    </div>
  );
}

export function Sheet04Surfaces() {
  return (
    <section
      data-screen-label="04 Surfaces"
      className="sheet sheet--bordered"
      style={{ padding: '120px 64px 72px', position: 'relative' }}
    >
      <div className="sheet__rule" />
      <div className="sheet__rule--left" />

      <Slug num="SHEET 04" title="MULTI-SURFACE" sub="three views, one source" />
      <TitleBlock sheet="04" sheetTitle="One Manifest, Three Surfaces" />

      <div style={{ maxWidth: 1300, margin: '60px auto 0' }}>
        <div style={{ marginBottom: 24 }}>
          <Eyebrow>04 / Multi-surface</Eyebrow>
        </div>

        <h2 className="h-section" style={{ marginBottom: 48 }}>
          Write <em>once</em>. Render on{' '}
          <span style={{ borderBottom: '1.5px solid var(--accent)' }}>iOS</span>,{' '}
          <span style={{ borderBottom: '1.5px solid var(--accent)' }}>macOS</span>, and the{' '}
          <span style={{ borderBottom: '1.5px solid var(--accent)' }}>Web</span>.
        </h2>

        <div
          style={{
            border: '1.5px solid var(--ink)',
            background: 'var(--paper)',
            padding: 40,
            marginBottom: 48,
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: -1,
              left: -1,
              background: 'var(--ink)',
              color: 'var(--paper)',
              padding: '6px 14px',
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
            }}
          >
            FIG. 04-A · ASSEMBLY
          </div>

          <div
            className="reflow-assembly"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto 1fr auto 1fr',
              gap: 0,
              alignItems: 'center',
              marginTop: 28,
            }}
          >
            <ManifestBox />
            <SplitArrow />
            <div
              className="reflow-platforms"
              style={{
                gridColumn: 'span 3',
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 28,
              }}
            >
              <PlatformFrame kind="ios" label="iOS" sub="TestFlight · App Store" />
              <PlatformFrame kind="macos" label="macOS" sub="notarized · DMG" />
              <PlatformFrame kind="web" label="Web" sub="CDN · PWA" />
            </div>
          </div>

          <div
            className="reflow-hide-narrow"
            style={{
              marginTop: 32,
              display: 'grid',
              gridTemplateColumns: 'auto auto 1fr',
              gap: 0,
              alignItems: 'center',
            }}
          >
            <div style={{ width: 280 }} />
            <div style={{ width: 60 }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
              {[
                ['390 × 844', '@3x'],
                ['1024 × 768', 'window'],
                ['fluid', '@1x → ∞'],
              ].map(([d, s]) => (
                <div
                  key={d}
                  style={{
                    textAlign: 'center',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--ink-2)',
                  }}
                >
                  <div style={{ color: 'var(--ink)', fontSize: 13, fontWeight: 600 }}>{d}</div>
                  <div style={{ marginTop: 2 }}>{s}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.4fr 1fr',
            gap: 48,
            alignItems: 'start',
          }}
        >
          <p className="subhead" style={{ fontSize: 17 }}>
            Same primitives, same intents, same chrome dimensions across every target. Hudson swaps
            the platform layer underneath — Swift on Apple, React on the web — but the components
            your app declares are identical.{' '}
            <em>Zero forks. Zero &quot;iOS-only&quot; features. Zero per-platform UI debt.</em>
          </p>

          <div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--ink-2)',
                marginBottom: 8,
              }}
            >
              SHIP COMMAND
            </div>
            <ShipBlock />
          </div>
        </div>
      </div>

      <FooterPlate
        left={['SHEET', '04 / 07']}
        mid="MULTI-SURFACE — ONE MANIFEST, THREE TARGETS"
        right={['FORKS', '0']}
      />
    </section>
  );
}
