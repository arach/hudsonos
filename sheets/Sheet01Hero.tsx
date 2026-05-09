'use client';

import { Counter } from '@/lib/animate';
import { HudsonEmbed } from '@/lib/embed';
import { EmbedFrame } from '@/primitives/EmbedFrame';
import { Eyebrow } from '@/primitives/Eyebrow';
import { Sheet } from '@/primitives/Sheet';

const STATS: Array<[string, string, string]> = [
  ['Surfaces', '3', 'iOS · macOS · Web'],
  ['Primitives', '8', 'Frame · Nav · Panel · Status · Canvas · Palette · Drawer · Assistant'],
  ['Apps live', '4', 'Talkie · Scout · Linea · Lattices'],
  ['License', 'MINE', 'ask me nicely'],
];

export function Sheet01Hero() {
  return (
    <Sheet
      id="hero"
      num="01"
      slugTitle="HERO"
      slugSub="general arrangement"
      sheetTitle="General Arrangement"
      style={{ minHeight: '100vh' }}
      footer={{
        left: ['CLIENT', 'open-source'],
        mid: 'HUDSONKIT — A SHARED CHROME FOR PERSONAL SOFTWARE',
        right: ['STATUS', 'shipped'],
      }}
    >
      <div style={{ maxWidth: 1100, margin: '60px auto 0', position: 'relative' }}>
        <div style={{ marginBottom: 28 }}>
          <Eyebrow>HudsonKit / open-source workspace framework / v0.4.2</Eyebrow>
        </div>

        <h1 className="h-display" style={{ marginBottom: 32, position: 'relative' }}>
          A workspace framework,
          <br />
          <em>drawn</em> to <span className="boxed">spec</span>.
        </h1>

        <p className="subhead" style={{ marginBottom: 36, fontSize: 18 }}>
          Hudson is the chrome your apps share — nav, panels, command palette, status bar, voice.
          Declare what your app <em>is</em>; the framework renders it on iOS, macOS, and the web
          from the same source.
        </p>

        <div style={{ display: 'flex', gap: 12, marginBottom: 64 }}>
          <a
            className="btn btn--accent"
            href="#install"
            onClick={() => window.__hudAudio?.chime?.({ cat: 'ui' })}
          >
            $ brew install hudson
          </a>
          <a
            className="btn btn--ghost"
            href="#github"
            onClick={() => window.__hudAudio?.tick?.({ cat: 'ui', gain: 0.08 })}
          >
            View source · GitHub
          </a>
        </div>

        <div
          className="hud-card"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 0,
            border: 'var(--stroke-w) solid var(--ink)',
            background: 'var(--paper)',
            maxWidth: 880,
            overflow: 'hidden',
          }}
        >
          {STATS.map((c, i) => (
            <div
              key={c[0]}
              style={{
                padding: '14px 16px',
                borderRight: i < 3 ? '1px solid var(--line-strong)' : 0,
                fontFamily: 'var(--font-mono)',
              }}
            >
              <div
                style={{
                  fontSize: 9,
                  letterSpacing: '0.2em',
                  color: 'var(--ink-2)',
                  textTransform: 'uppercase',
                }}
              >
                {c[0]}
              </div>
              <div
                style={{
                  fontSize: 28,
                  color: 'var(--ink)',
                  fontFamily: 'var(--font-display)',
                  marginTop: 4,
                  lineHeight: 1,
                }}
              >
                {c[0] === 'License' ? c[1] : <Counter to={parseInt(c[1], 10)} />}
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: 'var(--ink-2)',
                  marginTop: 6,
                  letterSpacing: '0.04em',
                  lineHeight: 1.4,
                }}
              >
                {c[2]}
              </div>
            </div>
          ))}
        </div>

        <svg
          style={{
            position: 'absolute',
            left: -32,
            top: -20,
            width: 24,
            height: 200,
            pointerEvents: 'none',
          }}
        >
          <line x1="12" y1="0" x2="12" y2="200" stroke="var(--ink)" strokeWidth="0.75" />
          <line x1="6" y1="0" x2="18" y2="0" stroke="var(--ink)" strokeWidth="0.75" />
          <line x1="6" y1="200" x2="18" y2="200" stroke="var(--ink)" strokeWidth="0.75" />
          <text
            x="0"
            y="105"
            fontFamily="var(--font-mono)"
            fontSize="9"
            fill="var(--ink-2)"
            transform="rotate(-90, 0, 105)"
          >
            200pt LEAD
          </text>
        </svg>

        <div style={{ marginTop: 96, position: 'relative' }}>
          <div
            className="embed-plate__caption"
            style={{ position: 'static', marginBottom: 14, justifyContent: 'space-between' }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
              <span className="live" />
              FIG. 01-A · LIVE EMBED
            </span>
            <span style={{ color: 'var(--ink-3)', letterSpacing: '0.18em' }}>
              workspace = self · installs <span style={{ color: 'var(--ink-1)' }}>2,847</span>
              &nbsp;·&nbsp; stars <span style={{ color: 'var(--ink-1)' }}>1,217</span>
            </span>
          </div>

          <EmbedFrame height={720}>
            <HudsonEmbed
              src={process.env.NEXT_PUBLIC_HUDSON_EMBED_SRC || '/embed/workspace'}
              surface="workspace"
              sizing={{ mode: 'fill' }}
              density="comfy"
              workspace="self"
              template="hudson"
              consumerId="hudsonos"
              expects={{
                manifestPanel: true,
                heroPinned: true,
                inspector: true,
                buildStrip: true,
                legend: true,
              }}
              title="Hudson workspace · live embed"
            />
          </EmbedFrame>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              marginTop: 12,
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--ink-3)',
            }}
          >
            <span>① capability map</span>
            <span>② command dock</span>
            <span>③ status bar</span>
            <span>④ canvas · pan/zoom</span>
          </div>
        </div>
      </div>
    </Sheet>
  );
}
