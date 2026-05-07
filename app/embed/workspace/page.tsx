'use client';

import { useEffect, useRef } from 'react';

const ALLOWED_ORIGINS = (() => {
  const list = new Set<string>();
  if (typeof window !== 'undefined') list.add(window.location.origin);
  const env = process.env.NEXT_PUBLIC_HUDSON_EMBED_ORIGINS ?? '';
  for (const o of env.split(',').map((s) => s.trim()).filter(Boolean)) list.add(o);
  return list;
})();

function isAllowedOrigin(origin: string) {
  if (typeof window !== 'undefined' && origin === window.location.origin) return true;
  if (ALLOWED_ORIGINS.has(origin)) return true;
  if (ALLOWED_ORIGINS.has('*')) return true;
  return false;
}

export default function WorkspaceEmbed() {
  const sentReady = useRef(false);

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (!isAllowedOrigin(e.origin)) return;
      const data = e.data;
      if (!data || typeof data !== 'object') return;
      if (data.type === 'hudson:theme-sync' && data.vars) {
        for (const [k, v] of Object.entries(data.vars)) {
          if (typeof k === 'string' && k.startsWith('--hud-') && typeof v === 'string') {
            document.documentElement.style.setProperty(k, v);
          }
        }
      }
    }
    window.addEventListener('message', onMessage);

    if (window.parent !== window && !sentReady.current) {
      sentReady.current = true;
      window.parent.postMessage(
        { type: 'hudson:embed-ready', surfaceId: 'workspace', sizing: { mode: 'fill' } },
        '*',
      );
    }

    return () => window.removeEventListener('message', onMessage);
  }, []);

  return (
    <div className="workspace">
      <header className="workspace__top">
        <span className="workspace__brand">H&nbsp;hudson</span>
        <span className="workspace__crumb workspace__crumb--active">manifest</span>
        <span className="workspace__crumb">canvas</span>
        <span className="workspace__crumb">inspector</span>
        <span className="workspace__crumb">install</span>
        <span className="workspace__spacer" />
        <span className="workspace__meta">workspace · self</span>
        <span className="workspace__kbd">⌘K</span>
        <button className="workspace__cta" type="button">install</button>
      </header>

      <div className="workspace__body">
        <aside className="workspace__panel">
          <div className="workspace__panel-head">
            <span>manifest</span>
            <span className="live">live</span>
          </div>
          <pre className="workspace__manifest">
{`manifest.ts
`}<span className="k">name</span>{`      `}<span className="v">"hudson"</span>{`
`}<span className="k">version</span>{`   `}<span className="v">"0.4.2"</span>{`
`}<span className="k">accent</span>{`    `}<span className="a">emerald</span>{`
`}<span className="k">template</span>{`  `}<span className="v">hudson</span>{`

apps
talkie       ios · macos
scout-ops    ios
meridian     macos
logo-studio  web

primitives
Frame         chrome root
Canvas        pan/zoom
SidePanel     this thing
NavigationBar above
StatusBar     below
CommandDock   palette`}
          </pre>
          <p className="workspace__panel-note">
            this panel is rendered by <code>&lt;SidePanel side=&quot;left&quot; /&gt;</code> —
            the same primitive your apps use.
          </p>
        </aside>

        <main className="workspace__hero">
          <div className="workspace__hero-frame">
            <span className="workspace__hero-tab">HERO · pinned</span>
            <div className="workspace__hero-eyebrow">— You are inside a Hudson app</div>
            <h2 className="workspace__hero-title">
              This page is built <span className="accent">with itself.</span>
            </h2>
            <p className="workspace__hero-body">
              Every panel is a real Hudson primitive. Below: build a Hudson app in four steps.
            </p>
            <div className="workspace__hero-ctas">
              <button className="workspace__btn workspace__btn--primary" type="button">
                $ brew install hudson
              </button>
              <button className="workspace__btn" type="button">poke around →</button>
            </div>
          </div>
        </main>

        <aside className="workspace__panel workspace__panel--right">
          <div className="workspace__panel-head">
            <span>inspector</span>
            <span style={{ color: 'var(--hud-ink-3)', fontSize: 9, letterSpacing: '0.16em' }}>runtime</span>
          </div>
          <div className="workspace__capmap">
            <div className="workspace__capmap-label">capability map</div>
            <svg viewBox="0 0 200 70" preserveAspectRatio="xMidYMid meet">
              <line x1="20" y1="35" x2="100" y2="14" stroke="currentColor" strokeWidth="0.6" />
              <line x1="20" y1="35" x2="100" y2="35" stroke="currentColor" strokeWidth="0.6" />
              <line x1="20" y1="35" x2="100" y2="56" stroke="currentColor" strokeWidth="0.6" />
              <line x1="100" y1="35" x2="180" y2="20" stroke="currentColor" strokeWidth="0.6" />
              <line x1="100" y1="35" x2="180" y2="50" stroke="currentColor" strokeWidth="0.6" />
              <circle cx="20" cy="35" r="3" fill="var(--hud-accent)" />
              <circle cx="100" cy="14" r="2.4" fill="var(--hud-ink-3)" />
              <circle cx="100" cy="35" r="2.8" fill="var(--hud-accent)" />
              <circle cx="100" cy="56" r="2.4" fill="var(--hud-ink-3)" />
              <circle cx="180" cy="20" r="2.4" fill="var(--hud-ink-3)" />
              <circle cx="180" cy="50" r="2.4" fill="var(--hud-ink-3)" />
            </svg>
          </div>
          <div className="workspace__stats">
            <div className="workspace__stat"><span className="k">ws.uptime</span><span>00:03</span></div>
            <div className="workspace__stat"><span className="k">intents</span><span>16</span></div>
            <div className="workspace__stat"><span className="k">commands</span><span>45</span></div>
            <div className="workspace__stat"><span className="k">services</span><span>1</span></div>
            <div className="workspace__stat"><span className="k">ai.provider</span><span className="accent">copilot</span></div>
            <div className="workspace__stat"><span className="k">ai.model</span><span>gemini-3-flash</span></div>
            <div className="workspace__stat"><span className="k">voice</span><span>vox</span></div>
            <div className="workspace__stat"><span className="k">theme</span><span>hudson · dark</span></div>
          </div>
          <div className="workspace__log">
            <div><span className="ts">00:00</span><span className="kw">init</span>shell mounted</div>
            <div><span className="ts">00:01</span><span className="kw">idx</span>16 intents resolved</div>
            <div><span className="ts">00:01</span><span className="kw">cmd</span>45 commands live</div>
            <div><span className="ts">00:02</span><span className="kw">ai</span>capability map exposed</div>
            <div><span className="ts">00:03</span><span className="kw ok">ok</span>ready<span className="cursor" /></div>
          </div>
        </aside>
      </div>

      <footer className="workspace__build">
        <div className="workspace__build-head">
          BUILD AN APP IN 4 WINDOWS · DECLARE → WIRE → COMPOSE → SHIP
        </div>
        <div className="workspace__build-grid">
          <div className="workspace__step">
            <div className="workspace__step-head">§ STEP 01</div>
            <div className="workspace__step-action"><span className="workspace__step-num">1</span>DECLARE</div>
            <div className="workspace__step-body">Describe the app. One typed object.</div>
            <pre className="workspace__step-code">{`const Talkie: `}<span className="kw">HudsonApp</span>{` = {
  id: `}<span className="str">&quot;talkie&quot;</span>{`,
  mode: `}<span className="str">&quot;canvas&quot;</span>{`,
  intents: [ `}<span className="num">12</span>{` ],
};`}</pre>
          </div>
          <div className="workspace__step">
            <div className="workspace__step-head">§ STEP 02</div>
            <div className="workspace__step-action"><span className="workspace__step-num">2</span>WIRE</div>
            <div className="workspace__step-body">Add intents. Indexed for voice + ⌘K.</div>
            <pre className="workspace__step-code">{`transcribe `}<span className="kw">stt</span>{`        92%
replay-clip `}<span className="kw">audio·seek</span>{` 78%

→ "transcribe this"
  match`}</pre>
          </div>
          <div className="workspace__step">
            <div className="workspace__step-head">§ STEP 03</div>
            <div className="workspace__step-action"><span className="workspace__step-num">3</span>COMPOSE</div>
            <div className="workspace__step-body">Drop in primitives. Identical chrome.</div>
            <pre className="workspace__step-code">{`<`}<span className="kw">Frame</span>{` hud={<`}<span className="kw">Nav</span>{`/>}>
  <`}<span className="kw">Content</span>{`/>
</`}<span className="kw">Frame</span>{`>`}</pre>
          </div>
          <div className="workspace__step">
            <div className="workspace__step-head">§ STEP 04</div>
            <div className="workspace__step-action"><span className="workspace__step-num">4</span>SHIP</div>
            <div className="workspace__step-body">One manifest, three surfaces.</div>
            <pre className="workspace__step-code">{`> hudson ship `}<span className="kw">--all</span>{`
✓ 3 surfaces · 0 forks
  `}<span className="kw">iOS</span>{` · `}<span className="kw">macOS</span>{` · `}<span className="kw">Web</span>{``}</pre>
          </div>
        </div>
      </footer>

      <div className="workspace__legend">
        <span><span className="num">①</span>capability map</span>
        <span><span className="num">②</span>command dock</span>
        <span><span className="num">③</span>status bar</span>
        <span><span className="num">④</span>canvas · pan/zoom</span>
      </div>
    </div>
  );
}
