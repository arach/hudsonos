import { Eyebrow, FooterPlate, Slug, TitleBlock } from './Shared';

const SPEC: Array<[string, string, boolean?]> = [
  ['CAPTURE', 'useVoiceInput'],
  ['TRANSCRIBE', 'voxProbe · stt'],
  ['MATCH', 'IntentIndex'],
  ['CONFIRM', 'Assistant'],
  ['DISPATCH', 'command.run', true],
  ['REPLY', 'voiceReply'],
];

const FEATURES = [
  { n: '⌘K', t: 'Command palette', b: 'Every intent fuzzy-searched. Open with ⌘K, type three letters, hit return.' },
  { n: '🎤', t: 'Voice', b: 'Tap-and-hold or hotword. Same intents, no extra wiring per surface.' },
  { n: '↳', t: 'Replies', b: 'Assistant reads the result back if the intent declares a voice reply.' },
];

function VoiceDiagram() {
  const stages = [
    { x: 80, y: 230, label: 'CAPTURE', sub: 'useVoiceInput' },
    { x: 270, y: 130, label: 'TRANSCRIBE', sub: 'voxProbe' },
    { x: 270, y: 330, label: 'MATCH', sub: 'IntentIndex' },
    { x: 480, y: 230, label: 'DISPATCH', sub: 'command.run', accent: true },
    { x: 700, y: 130, label: 'APP', sub: 'Talkie' },
    { x: 700, y: 330, label: 'REPLY', sub: 'voiceReply' },
  ];
  const wires = [
    'M 145 230 C 200 230, 200 130, 205 130',
    'M 145 230 C 200 230, 200 330, 205 330',
    'M 335 130 C 400 130, 400 230, 415 230',
    'M 335 330 C 400 330, 400 230, 415 230',
    'M 545 230 C 620 230, 620 130, 635 130',
    'M 545 230 C 620 230, 620 330, 635 330',
  ];
  const waveHeights = [4, 8, 14, 6, 18, 10, 16, 7, 5];

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: 'oklch(0.145 0 0)',
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
          backgroundSize: '20px 20px',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600,
          height: 300,
          background:
            'radial-gradient(ellipse, oklch(0.72 0.18 162 / 0.18), transparent 65%)',
          filter: 'blur(40px)',
        }}
      />

      <svg width="100%" height="100%" viewBox="0 0 900 460" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <marker
            id="vArr"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto"
          >
            <path d="M0,0 L10,5 L0,10 z" fill="oklch(0.72 0.18 162)" />
          </marker>
        </defs>

        {stages.map((s) => (
          <g key={s.label} transform={`translate(${s.x}, ${s.y})`}>
            <rect
              x="-65"
              y="-32"
              width="130"
              height="64"
              rx="3"
              fill={s.accent ? 'oklch(0.72 0.18 162)' : 'oklch(0.18 0 0)'}
              stroke={s.accent ? 'oklch(0.72 0.18 162)' : 'oklch(0.4 0 0)'}
              strokeWidth="1.5"
            />
            <text
              x="0"
              y="-8"
              textAnchor="middle"
              fontFamily="var(--font-mono)"
              fontSize="11"
              fill={s.accent ? 'oklch(0.145 0 0)' : 'oklch(0.95 0 0)'}
              letterSpacing="2"
              fontWeight="700"
            >
              {s.label}
            </text>
            <text
              x="0"
              y="14"
              textAnchor="middle"
              fontFamily="var(--font-mono)"
              fontSize="10"
              fill={s.accent ? 'oklch(0.145 0 0 / 0.7)' : 'oklch(0.64 0 0)'}
            >
              {s.sub}
            </text>
          </g>
        ))}

        {wires.map((d, i) => (
          <path
            key={i}
            d={d}
            fill="none"
            stroke="oklch(0.72 0.18 162)"
            strokeWidth="1.4"
            strokeDasharray="4 4"
            markerEnd="url(#vArr)"
            opacity="0.85"
          />
        ))}

        <g transform="translate(80, 200)">
          {waveHeights.map((h, i) => (
            <rect
              key={i}
              x={-30 + i * 7}
              y={-h / 2}
              width="3"
              height={h}
              fill="oklch(0.72 0.18 162)"
            />
          ))}
        </g>

        <g transform="translate(270, 80)">
          <rect x="-110" y="-22" width="220" height="36" fill="oklch(0.18 0 0)" stroke="oklch(0.4 0 0)" />
          <text
            x="-100"
            y="2"
            fontFamily="var(--font-mono)"
            fontSize="11"
            fill="oklch(0.95 0 0)"
          >
            &quot;transcribe this clip&quot;
          </text>
        </g>

        <g transform="translate(450, 410)">
          <rect x="-55" y="-12" width="110" height="22" fill="oklch(0.72 0.18 162)" />
          <text
            x="0"
            y="3"
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize="11"
            fill="oklch(0.145 0 0)"
            fontWeight="700"
            letterSpacing="2"
          >
            ⏱ 78 ms TOTAL
          </text>
        </g>
      </svg>
    </div>
  );
}

export function Sheet03Voice() {
  return (
    <section
      data-screen-label="03 Voice"
      className="sheet sheet--bordered"
      style={{ padding: '120px 64px 72px', position: 'relative' }}
    >
      <div className="sheet__rule" />
      <div className="sheet__rule--left" />

      <Slug num="SHEET 03" title="VOICE LOOP" sub="signal flow" />
      <TitleBlock sheet="03" sheetTitle="Voice → Intent → Command" />

      <div style={{ maxWidth: 1300, margin: '60px auto 0' }}>
        <div style={{ marginBottom: 24 }}>
          <Eyebrow>03 / Voice loop · sub-80ms</Eyebrow>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.4fr 1fr',
            gap: 64,
            alignItems: 'start',
            marginBottom: 56,
          }}
        >
          <h2 className="h-section">
            Speak. The chrome <em>understands</em>.
          </h2>
          <p className="subhead" style={{ alignSelf: 'end', fontSize: 16 }}>
            Every intent you declare is searchable — by keystroke, by ⌘K, and by voice. Hudson
            handles the loop: capture, transcribe, match, dispatch. Your app gets a typed call.
          </p>
        </div>

        <div
          className="reflow-stack"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 360px',
            gap: 40,
            alignItems: 'start',
            marginBottom: 56,
          }}
        >
          <div>
            <div className="embed-plate__caption">
              <span className="live" style={{ background: 'var(--ink-2)' }} />
              EMBED · workspace = voice-demo · status: production
            </div>
            <div className="embed-plate" style={{ height: 460, padding: 0 }}>
              <span className="embed-plate__corner embed-plate__corner--tl" />
              <span className="embed-plate__corner embed-plate__corner--tr" />
              <span className="embed-plate__corner embed-plate__corner--bl" />
              <span className="embed-plate__corner embed-plate__corner--br" />
              <VoiceDiagram />
            </div>
          </div>

          <div className="spec">
            <div className="spec__row spec__row--header">
              <div>Stage</div>
              <div>Primitive</div>
            </div>
            {SPEC.map(([k, v, a]) => (
              <div key={k} className="spec__row">
                <div className="spec__k">{k}</div>
                <div className={'spec__v' + (a ? ' spec__v--accent' : '')}>{v}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 18 }}>
          <Eyebrow>What it gives you</Eyebrow>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
          {FEATURES.map((p) => (
            <div
              key={p.t}
              style={{
                border: '1.5px solid var(--ink)',
                background: 'var(--paper)',
                padding: 22,
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 18,
                  color: 'var(--accent-deep)',
                }}
              >
                {p.n}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'var(--ink-2)',
                }}
              >
                {p.t}
              </div>
              <p style={{ margin: 0, fontSize: 13, color: 'var(--ink-1)', lineHeight: 1.55 }}>
                {p.b}
              </p>
            </div>
          ))}
        </div>
      </div>

      <FooterPlate
        left={['SHEET', '03 / 07']}
        mid="VOICE LOOP · signal flow"
        right={['LATENCY', '< 80 ms']}
      />
    </section>
  );
}
