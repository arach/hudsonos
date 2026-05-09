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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVars}>
      <body style={{ margin: 0 }}>
        {children}
      </body>
    </html>
  );
}
