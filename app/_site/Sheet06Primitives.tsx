import { Eyebrow, FooterPlate, Slug, TitleBlock } from './Shared';

const PRIMS = [
  { name: 'Frame', dim: '100% × 100%', use: 'Chrome root. Hosts nav, panels, canvas, status.' },
  { name: 'NavigationBar', dim: 'h: 48 px', use: 'Crumbs, ⌘K, install. Always pinned to top.' },
  { name: 'SidePanel', dim: 'w: 280 px', use: 'Manifest, inspector, file tree. Either side.' },
  { name: 'Canvas', dim: 'fluid', use: 'Pan/zoom workspace. Floating windows live here.' },
  { name: 'StatusBar', dim: 'h: 28 px', use: 'Live runtime: uptime, intents, logs, version.' },
  { name: 'CommandPalette', dim: '⌘K · 480 px', use: 'Fuzzy-searches every intent. Voice + keys.' },
  { name: 'TerminalDrawer', dim: 'h: 0 / 240px', use: 'Slide-up shell. Natural-language → bash.' },
  { name: 'Assistant', dim: 'overlay', use: 'AI primitive. Reads capability map, dispatches commands.' },
];

function PrimitiveSparkline({ name }: { name: string }) {
  const W = 100;
  const H = 56;
  const ink = 'var(--ink)';
  const accent = 'var(--accent)';
  const line = 'var(--line-strong)';

  switch (name) {
    case 'Frame':
      return (
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          <rect x="2" y="2" width={W - 4} height={H - 4} fill="none" stroke={ink} strokeWidth="1.5" />
          <rect x="6" y="6" width={W - 12} height="6" fill={accent} opacity="0.6" />
          <rect x="6" y={H - 12} width={W - 12} height="6" fill={line} />
          <rect x="6" y="14" width="14" height={H - 26} fill={line} opacity="0.7" />
          <rect x={W - 20} y="14" width="14" height={H - 26} fill={line} opacity="0.7" />
        </svg>
      );
    case 'NavigationBar':
      return (
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          <rect x="2" y="22" width={W - 4} height="14" fill={ink} />
          <circle cx="10" cy="29" r="3" fill={accent} />
          <rect x="20" y="27" width="14" height="4" fill="var(--paper)" opacity="0.7" />
          <rect x="38" y="27" width="10" height="4" fill="var(--paper)" opacity="0.5" />
          <rect x={W - 22} y="25" width="18" height="8" fill={accent} />
        </svg>
      );
    case 'SidePanel':
      return (
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          <rect x="2" y="2" width="32" height={H - 4} fill={ink} />
          <rect x="6" y="8" width="24" height="3" fill={accent} opacity="0.7" />
          <rect x="6" y="16" width="20" height="2" fill="var(--paper)" opacity="0.4" />
          <rect x="6" y="22" width="22" height="2" fill="var(--paper)" opacity="0.4" />
          <rect x="6" y="28" width="18" height="2" fill="var(--paper)" opacity="0.4" />
          <rect x="40" y="2" width={W - 42} height={H - 4} fill="none" stroke={line} strokeDasharray="2 2" />
        </svg>
      );
    case 'Canvas':
      return (
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          <rect x="2" y="2" width={W - 4} height={H - 4} fill="none" stroke={line} />
          {Array.from({ length: 6 }).map((_, x) =>
            Array.from({ length: 4 }).map((_, y) => (
              <circle key={`${x}-${y}`} cx={10 + x * 16} cy={10 + y * 14} r="0.8" fill={line} />
            )),
          )}
          <rect x="20" y="14" width="22" height="14" fill={accent} opacity="0.4" stroke={accent} />
          <rect x="55" y="22" width="28" height="20" fill="none" stroke={ink} />
        </svg>
      );
    case 'StatusBar':
      return (
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          <rect x="2" y={H - 14} width={W - 4} height="10" fill={ink} />
          <circle cx="8" cy={H - 9} r="2" fill={accent} />
          <rect x="14" y={H - 10} width="10" height="2" fill="var(--paper)" opacity="0.5" />
          <rect x="28" y={H - 10} width="14" height="2" fill="var(--paper)" opacity="0.5" />
          <rect x={W - 22} y={H - 10} width="18" height="2" fill={accent} opacity="0.7" />
        </svg>
      );
    case 'CommandPalette':
      return (
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          <rect x="2" y="2" width={W - 4} height={H - 4} fill="var(--paper-2)" stroke={line} />
          <rect x="14" y="10" width={W - 28} height="10" fill={ink} />
          <rect x="18" y="13" width="20" height="4" fill={accent} />
          <rect x="14" y="24" width={W - 28} height="4" fill={line} opacity="0.5" />
          <rect x="14" y="32" width={W - 28} height="4" fill={accent} opacity="0.5" />
          <rect x="14" y="40" width={W - 28} height="4" fill={line} opacity="0.5" />
        </svg>
      );
    case 'TerminalDrawer':
      return (
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          <rect x="2" y="2" width={W - 4} height={H - 26} fill="none" stroke={line} strokeDasharray="2 2" />
          <rect x="2" y={H - 24} width={W - 4} height="22" fill={ink} />
          <text x="6" y={H - 13} fontFamily="var(--font-mono)" fontSize="7" fill={accent}>
            $
          </text>
          <rect x="12" y={H - 15} width="16" height="2" fill="var(--paper)" opacity="0.7" />
          <rect x="12" y={H - 10} width="36" height="2" fill="var(--paper)" opacity="0.4" />
        </svg>
      );
    case 'Assistant':
      return (
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          <circle cx={W / 2} cy={H / 2} r="16" fill="none" stroke={accent} strokeWidth="1.5" />
          <circle cx={W / 2} cy={H / 2} r="10" fill="none" stroke={accent} strokeWidth="1" opacity="0.6" />
          <circle cx={W / 2} cy={H / 2} r="4" fill={accent} />
          <line x1="0" y1={H / 2} x2="20" y2={H / 2} stroke={line} strokeDasharray="2 2" />
          <line x1={W - 20} y1={H / 2} x2={W} y2={H / 2} stroke={line} strokeDasharray="2 2" />
        </svg>
      );
    default:
      return <svg width={W} height={H} />;
  }
}

export function Sheet06Primitives() {
  return (
    <section
      data-screen-label="06 Primitives"
      className="sheet sheet--bordered"
      style={{ padding: '120px 64px 72px', position: 'relative' }}
    >
      <div className="sheet__rule" />
      <div className="sheet__rule--left" />

      <Slug num="SHEET 06" title="PRIMITIVES" sub="reference · all 8" />
      <TitleBlock sheet="06" sheetTitle="Primitives — Reference Sheet" />

      <div style={{ maxWidth: 1300, margin: '60px auto 0' }}>
        <div style={{ marginBottom: 24 }}>
          <Eyebrow>06 / Primitives · the kit</Eyebrow>
        </div>

        <div
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, marginBottom: 56 }}
        >
          <h2 className="h-section">
            The whole kit, <em>itemized</em>.
          </h2>
          <p className="subhead" style={{ fontSize: 17, alignSelf: 'end' }}>
            Eight components do every job. They compose, they nest, and they obey the same
            dimensions on every surface. If you&apos;ve used one Hudson app, the rest are already
            familiar.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 0,
            border: '1.5px solid var(--ink)',
            background: 'var(--paper)',
          }}
        >
          {PRIMS.map((p, i) => (
            <div
              key={p.name}
              style={{
                padding: 20,
                borderRight: i % 4 !== 3 ? '1px solid var(--line-strong)' : 0,
                borderBottom: i < 4 ? '1px solid var(--line-strong)' : 0,
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                minHeight: 200,
              }}
            >
              <PrimitiveSparkline name={p.name} />
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11.5,
                  letterSpacing: '0.1em',
                  color: 'var(--ink)',
                  fontWeight: 600,
                }}
              >
                {`<${p.name}/>`}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 9.5,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--ink-2)',
                }}
              >
                {p.dim}
              </div>
              <p style={{ margin: 0, fontSize: 12.5, color: 'var(--ink-1)', lineHeight: 1.5 }}>
                {p.use}
              </p>
            </div>
          ))}
        </div>
      </div>

      <FooterPlate
        left={['SHEET', '06 / 07']}
        mid="PRIMITIVES — REFERENCE SHEET · 8 COMPONENTS"
        right={['LOC', '~ 2,400']}
      />
    </section>
  );
}
