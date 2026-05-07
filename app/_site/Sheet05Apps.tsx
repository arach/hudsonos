import { Eyebrow, FooterPlate, Slug, TitleBlock } from './Shared';

const APPS = [
  {
    id: 'talkie',
    name: 'Talkie',
    tag: 'ios · macos',
    lede: 'Voice notes, transcribed.',
    body: 'A canvas of audio clips. Long-press to record, drag to arrange, ⌘K to find anything you said three weeks ago.',
    accent: 'oklch(0.62 0.16 162)',
  },
  {
    id: 'scout',
    name: 'Scout',
    tag: 'macos · web',
    lede: 'Field notes that file themselves.',
    body: 'TODO — replace with the real Scout pitch.',
    accent: 'oklch(0.66 0.18 50)',
  },
  {
    id: 'linea',
    name: 'Linea',
    tag: 'macos · web',
    lede: 'A line, finely drawn.',
    body: 'TODO — replace with the real Linea pitch.',
    accent: 'oklch(0.55 0.18 250)',
  },
  {
    id: 'lattices',
    name: 'Lattices',
    tag: 'macos',
    lede: 'Structure, made visible.',
    body: 'TODO — replace with the real Lattices pitch.',
    accent: 'oklch(0.60 0.20 18)',
  },
];

function AppCard({ app, index }: { app: typeof APPS[number]; index: number }) {
  return (
    <div
      className="hud-card"
      style={{
        border: 'var(--stroke-w) solid var(--ink)',
        background: 'var(--paper)',
        display: 'grid',
        gridTemplateColumns: '180px 1fr',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          background: 'oklch(0.145 0 0)',
          borderRight: '1px solid var(--ink)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1.4px)',
            backgroundSize: '12px 12px',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            fontFamily: 'var(--font-display)',
            fontSize: 64,
            color: app.accent,
            lineHeight: 1,
            fontStyle: 'italic',
          }}
        >
          {app.name[0]}
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 8,
            left: 8,
            fontFamily: 'var(--font-mono)',
            fontSize: 9,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'oklch(0.64 0 0)',
          }}
        >
          {app.tag}
        </div>
      </div>

      <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              color: 'var(--ink-2)',
              letterSpacing: '0.2em',
            }}
          >
            0{index}
          </span>
          <h3
            style={{
              margin: 0,
              fontFamily: 'var(--font-mono)',
              fontSize: 13,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'var(--ink)',
            }}
          >
            {app.name}
          </h3>
        </div>
        <p
          style={{
            margin: 0,
            fontFamily: 'var(--font-display)',
            fontSize: 24,
            lineHeight: 1.1,
            color: 'var(--ink)',
          }}
        >
          {app.lede}
        </p>
        <p style={{ margin: 0, fontSize: 13, color: 'var(--ink-1)', lineHeight: 1.55 }}>
          {app.body}
        </p>
        <div
          style={{
            marginTop: 'auto',
            paddingTop: 8,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span className="tag tag--accent">view source</span>
          <span style={{ flex: 1 }} />
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              color: 'var(--ink-2)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}
          >
            ▸ open
          </span>
        </div>
      </div>
    </div>
  );
}

export function Sheet05Apps() {
  return (
    <section
      data-screen-label="05 Apps"
      className="sheet sheet--bordered"
      style={{ padding: '120px 64px 72px', position: 'relative' }}
    >
      <div className="sheet__rule" />
      <div className="sheet__rule--left" />

      <Slug num="SHEET 05" title="APPS GALLERY" sub="real software, public" />
      <TitleBlock sheet="05" sheetTitle="Apps Built on Hudson" />

      <div style={{ maxWidth: 1300, margin: '60px auto 0' }}>
        <div style={{ marginBottom: 24 }}>
          <Eyebrow>05 / Apps gallery · in production</Eyebrow>
        </div>

        <div
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, marginBottom: 56 }}
        >
          <h2 className="h-section">
            Four apps,
            <br />
            <em>one</em> kit.
          </h2>
          <p className="subhead" style={{ fontSize: 17, alignSelf: 'end' }}>
            Each ships independently — its own brand, its own scope, its own audience. They share
            Hudson the way print designers share a type system: identical bones, distinct
            identities.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 32 }}>
          {APPS.map((a, i) => (
            <AppCard key={a.id} app={a} index={i + 1} />
          ))}
        </div>
      </div>

      <FooterPlate
        left={['SHEET', '05 / 07']}
        mid="APPS GALLERY · 4 IN PRODUCTION · MORE IN-FLIGHT"
        right={['INSTALLS', '2,847']}
      />
    </section>
  );
}
