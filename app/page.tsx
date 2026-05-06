import type { Metadata } from 'next';
import { SiteRoot } from './_site/SiteRoot';

export const metadata: Metadata = {
  title: 'HudsonKit — A workspace framework, drawn to spec',
  description:
    'Hudson is the chrome your apps share — nav, panels, command palette, status bar, voice. Declare what your app is; the framework renders it on iOS, macOS, and the web from the same source.',
};

export default function LandingPage() {
  return <SiteRoot />;
}
