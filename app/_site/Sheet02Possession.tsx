import { HudsonEmbed } from './lib/embed';
import { Eyebrow, FooterPlate, Slug, TitleBlock } from './Shared';

const SPEC: Array<[string, string, boolean?]> = [
  ['NAV.HEIGHT', '48 px'],
  ['PANEL.WIDTH', '280 px'],
  ['STATUS.HEIGHT', '28 px'],
  ['ACCENT', 'oklch(.72 .18 162)'],
  ['INTENTS', '16 indexed', true],
  ['COMMANDS', '45 live', true],
  ['LATENCY', '< 80 ms (vox→cmd)', true],
  ['SURFACES', 'iOS · macOS · Web'],
  ['THEME', 'hudson · dark'],
  ['VERSION', 'v0.4.2'],
];

const PARTS = [
  { n: '01', t: 'DECLARE', l: 'A typed object names your app.', b: 'id, mode, intents, ports — Hudson reads it like a blueprint.' },
  { n: '02', t: 'WIRE', l: 'Intents become voice + ⌘K.', b: 'Each entry is indexed for fuzzy match, hotkeys, and the assistant.' },
  { n: '03', t: 'COMPOSE', l: 'Drop in primitives.', b: 'Frame, Nav, Panel, Canvas, Status — same chrome every app inherits.' },
  { n: '04', t: 'SHIP', l: 'Three surfaces, zero forks.', b: 'iOS through TestFlight, macOS notarized, Web via CDN. One command.' },
];

export function Sheet02Possession() {
  return (
    <section
      data-screen-label="02 Possession"
      className="sheet sheet--bordered"
      style={{ padding: '120px 64px 72px', position: 'relative' }}
    >
      <div className="sheet__rule" />
      <div className="sheet__rule--left" />

      <Slug num="SHEET 02" title="LIVE WORKSPACE" sub="elevation · 1:1 scale" />
      <TitleBlock sheet="02" sheetTitle="Possession Mode — Live Embed" />

      <div style={{ maxWidth: 1300, margin: '60px auto 0' }}>
        <div style={{ marginBottom: 24 }}>
          <Eyebrow>02 / Live Embed</Eyebrow>
        </div>

        <h2 className="h-section" style={{ marginBottom: 20 }}>
          The page <em>you are reading</em> is also a Hudson app.
        </h2>

        <p className="subhead" style={{ marginBottom: 48, fontSize: 17 }}>
          Below — full chrome, real primitives, one source of truth. Nav at{' '}
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14 }}>48px</span>, panels at{' '}
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14 }}>280px</span>, status bar at{' '}
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14 }}>28px</span>. Every dimension
          below also lives in your manifest.
        </p>

        <div
          className="reflow-stack"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 320px',
            gap: 40,
            alignItems: 'start',
            marginBottom: 64,
          }}
        >
          <div style={{ position: 'relative' }}>
            <div className="embed-plate__caption">
              <span className="live" />
              FIG. 02-A · REFERENCE EMBED
              <span style={{ color: 'var(--ink-faint)' }}>·</span>
              <span>surface contract · workspace</span>
            </div>
            <div className="embed-plate" style={{ height: 720 }}>
              <span className="embed-plate__corner embed-plate__corner--tl" />
              <span className="embed-plate__corner embed-plate__corner--tr" />
              <span className="embed-plate__corner embed-plate__corner--bl" />
              <span className="embed-plate__corner embed-plate__corner--br" />
              <HudsonEmbed
                src="/embed/workspace"
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
                title="Hudson workspace · reference embed"
              />
            </div>

            <div
              style={{
                marginTop: 16,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                letterSpacing: '0.12em',
                color: 'var(--ink-2)',
                textTransform: 'uppercase',
              }}
            >
              <span>① CAPABILITY MAP</span>
              <span>② COMMAND DOCK</span>
              <span>③ STATUS BAR</span>
              <span>④ CANVAS · pan/zoom</span>
            </div>
          </div>

          <div>
            <div className="spec">
              <div className="spec__row spec__row--header">
                <div>Param</div>
                <div>Value</div>
              </div>
              {SPEC.map(([k, v, accent]) => (
                <div key={k} className="spec__row">
                  <div className="spec__k">{k}</div>
                  <div className={'spec__v' + (accent ? ' spec__v--accent' : '')}>{v}</div>
                </div>
              ))}
            </div>

            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10.5,
                letterSpacing: '0.06em',
                color: 'var(--ink-2)',
                marginTop: 16,
                lineHeight: 1.6,
                textTransform: 'uppercase',
              }}
            >
              Note. Every parameter on this sheet is read from the same{' '}
              <span style={{ color: 'var(--accent-deep)', fontWeight: 600 }}>manifest.ts</span> the
              embedded workspace consumes.
            </p>
          </div>
        </div>

        <div style={{ marginBottom: 28 }}>
          <Eyebrow>Parts list · build sequence</Eyebrow>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18 }}>
          {PARTS.map((p) => (
            <div key={p.n} className="part">
              <div className="part__num">{p.n}</div>
              <div className="part__title">{p.t}</div>
              <h3 className="part__lede">{p.l}</h3>
              <p className="part__body">{p.b}</p>
            </div>
          ))}
        </div>
      </div>

      <FooterPlate
        left={['SHEET', '02 / 07']}
        mid="LIVE EMBED · POSSESSION MODE — workspace = self"
        right={['SCALE', '1 : 1']}
      />
    </section>
  );
}
