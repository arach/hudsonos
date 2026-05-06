import { Eyebrow, FooterPlate, Slug, TitleBlock } from './Shared';

const STEPS = [
  { n: '01', t: 'INSTALL', cmd: '$ brew install hudson', caption: 'Single tap. Mac, Linux, WSL.' },
  {
    n: '02',
    t: 'SCAFFOLD',
    cmd: '$ hudson new my-app',
    caption: 'Manifest, app folder, primitives wired up. Ready to run.',
  },
  {
    n: '03',
    t: 'SHIP',
    cmd: '$ hudson ship --all',
    caption: 'Three surfaces. ~40 seconds. Zero forks.',
  },
];

const FOOTER_COLS = [
  { h: 'Project', links: ['GitHub', 'Changelog', 'Roadmap', 'Discord'] },
  { h: 'Docs', links: ['Quickstart', 'Manifest', 'Primitives', 'Voice / AI'] },
  { h: 'Apps', links: ['Talkie', 'Scout', 'Linea', 'Lattices'] },
  { h: 'Legal', links: ['MIT License', 'Contributing', 'Code of Conduct', 'Security'] },
];

export function Sheet07Quickstart() {
  return (
    <section
      data-screen-label="07 Quickstart"
      className="sheet sheet--bordered"
      style={{ padding: '120px 64px 72px', position: 'relative' }}
    >
      <div className="sheet__rule" />
      <div className="sheet__rule--left" />

      <Slug num="SHEET 07" title="QUICKSTART" sub="install · scaffold · ship" />
      <TitleBlock sheet="07" sheetTitle="Quickstart — End Sheet" />

      <div style={{ maxWidth: 1300, margin: '60px auto 0' }}>
        <div style={{ marginBottom: 24 }}>
          <Eyebrow>07 / Quickstart</Eyebrow>
        </div>

        <h2 className="h-section" style={{ marginBottom: 48 }}>
          Three commands. <em>Then</em> you build.
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 24,
            marginBottom: 56,
          }}
        >
          {STEPS.map((s) => (
            <div
              key={s.n}
              style={{
                border: '1.5px solid var(--ink)',
                background: 'var(--paper)',
                padding: '20px 22px',
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 44,
                    lineHeight: 1,
                    color: 'var(--accent-deep)',
                  }}
                >
                  {s.n}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    color: 'var(--ink-2)',
                  }}
                >
                  {s.t}
                </span>
              </div>
              <pre className="code" style={{ margin: 0, fontSize: 12, padding: 12 }}>
                <span style={{ color: 'oklch(0.78 0.16 162)' }}>{s.cmd}</span>
              </pre>
              <p style={{ margin: 0, fontSize: 13, color: 'var(--ink-1)', lineHeight: 1.55 }}>
                {s.caption}
              </p>
            </div>
          ))}
        </div>

        <div
          style={{
            border: '1.5px solid var(--ink)',
            background: 'var(--ink)',
            color: 'oklch(0.95 0 0)',
            padding: '40px 48px',
            marginBottom: 64,
            display: 'flex',
            alignItems: 'center',
            gap: 36,
          }}
        >
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'oklch(0.72 0.18 162)',
                marginBottom: 12,
              }}
            >
              ⸻ FINAL NOTE
            </div>
            <p
              style={{
                margin: 0,
                fontFamily: 'var(--font-display)',
                fontSize: 34,
                lineHeight: 1.1,
                color: 'oklch(0.95 0 0)',
              }}
            >
              Build software the way you&apos;d <em>draw</em> it.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <a className="btn btn--accent" href="#install">
              $ brew install hudson
            </a>
            <a
              className="btn"
              style={{
                background: 'transparent',
                color: 'oklch(0.95 0 0)',
                borderColor: 'oklch(0.4 0 0)',
              }}
              href="#docs"
            >
              Read the docs →
            </a>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 32,
            paddingTop: 32,
            borderTop: '1px solid var(--line-strong)',
          }}
        >
          {FOOTER_COLS.map((c) => (
            <div key={c.h}>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: 'var(--ink-2)',
                  marginBottom: 12,
                }}
              >
                {c.h}
              </div>
              <ul
                style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                }}
              >
                {c.links.map((l) => (
                  <li key={l}>
                    <a href="#" style={{ fontSize: 13, color: 'var(--ink)' }}>
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <FooterPlate
        left={['SHEET', '07 / 07']}
        mid="HUDSONKIT — END OF DRAWING SET"
        right={['LICENSE', 'MIT']}
      />
    </section>
  );
}
