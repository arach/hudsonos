import type { Metadata } from 'next';
import {
  Geist,
  Geist_Mono,
  Jura,
  Space_Grotesk,
  JetBrains_Mono,
  Newsreader,
  Bodoni_Moda,
  Spectral,
  Cormorant_Garamond,
  IBM_Plex_Sans,
  IBM_Plex_Mono,
} from 'next/font/google';
import '@/styles/site.css';
import {
  PAPERS,
  ACCENTS,
  DISPLAY_FONTS,
  BODY_FONTS,
  MONO_FONTS,
  STUDIO_COOKIE,
} from '@/theme/defaults';

const geist = Geist({ subsets: ['latin'], display: 'swap', variable: '--font-geist' });
const geistMono = Geist_Mono({ subsets: ['latin'], display: 'swap', variable: '--font-geist-mono' });
const jura = Jura({ subsets: ['latin'], display: 'swap', variable: '--font-jura' });
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
});
const newsreader = Newsreader({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-newsreader',
  style: ['normal', 'italic'],
  axes: ['opsz'],
});
const bodoniModa = Bodoni_Moda({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-bodoni-moda',
  style: ['normal', 'italic'],
});
const spectral = Spectral({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-spectral',
  style: ['normal', 'italic'],
  weight: ['400', '500', '600'],
});
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-cormorant',
  style: ['normal', 'italic'],
  weight: ['400', '500', '600'],
});
const plexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plex-sans',
  weight: ['300', '400', '500', '600', '700'],
});
const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plex-mono',
  weight: ['400', '500', '600'],
});

export const metadata: Metadata = {
  title: 'Hudson — workspace framework, drawn to spec',
  description: 'HudsonKit. Open-source workspace framework. Drawn to spec.',
};

const fontVars = [
  geist.variable,
  geistMono.variable,
  jura.variable,
  spaceGrotesk.variable,
  jetbrainsMono.variable,
  newsreader.variable,
  bodoniModa.variable,
  spectral.variable,
  cormorant.variable,
  plexSans.variable,
  plexMono.variable,
].join(' ');

// Theme boot script — runs synchronously in <head> before the body paints.
// Reads the studio cookie and inserts a <style>html .hudson-site{...}</style>
// rule with higher specificity than the default .hudson-site declaration in
// site.css, so the user's saved theme is in effect on the very first frame.
// No-op when there's no cookie or anything is malformed; defaults take over.
const themeLookups = JSON.stringify({
  paper: Object.fromEntries(PAPERS.map((p) => [p.id, p.vars])),
  accent: Object.fromEntries(ACCENTS.map((a) => [a.id, a.vars])),
  display: Object.fromEntries(DISPLAY_FONTS.map((f) => [f.id, f.cssValue])),
  body: Object.fromEntries(BODY_FONTS.map((f) => [f.id, f.cssValue])),
  mono: Object.fromEntries(MONO_FONTS.map((f) => [f.id, f.cssValue])),
});

const themeBootScript = `(function(){try{
var m=document.cookie.match(/${STUDIO_COOKIE}=([^;]+)/);if(!m)return;
var s=JSON.parse(decodeURIComponent(m[1]));
var L=${themeLookups};
var P=L.paper[s.paper],A=L.accent[s.accent];if(!P||!A)return;
var r=Object.assign({},P,A);
if(L.display[s.display])r['--font-display']=L.display[s.display];
if(L.body[s.body])r['--font-body']=L.body[s.body];
if(L.mono[s.mono])r['--font-mono']=L.mono[s.mono];
if(typeof s.bodyWeight==='number')r['--font-weight-body']=String(s.bodyWeight);
if(typeof s.gridMinor==='number')r['--grid-opacity-minor']=String(s.gridMinor);
if(typeof s.gridMajor==='number')r['--grid-opacity-major']=String(s.gridMajor);
if(typeof s.strokeW==='number')r['--stroke-w']=s.strokeW+'px';
if(typeof s.radiusUI==='number')r['--radius-ui']=s.radiusUI+'px';
if(typeof s.radiusCard==='number')r['--radius-card']=s.radiusCard+'px';
var c='';for(var k in r)c+=k+':'+r[k]+' !important;';
var st=document.createElement('style');st.id='hudson-theme-boot';
st.textContent='html .hudson-site{'+c+'}';
document.head.appendChild(st);
}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVars}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body style={{ margin: 0 }}>
        {children}
      </body>
    </html>
  );
}
