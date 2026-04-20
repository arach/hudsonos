import type { Metadata } from 'next';
import { NavHeader } from './_landing/NavHeader';
import { Hero } from './_landing/Hero';
import { VideoSection } from './_landing/VideoSection';
import { Features } from './_landing/Features';
import { Shells } from './_landing/Shells';
import { CodePreview } from './_landing/CodePreview';
import { CallToAction } from './_landing/CallToAction';
import { Footer } from './_landing/Footer';
import { ComponentShowcase } from './_landing/ComponentShowcase';
import { LandingGlyphWaves } from './_landing/LandingGlyphWaves';
import { GlyphWavesPageBackground } from './_landing/GlyphWavesPageBackground';
import './_landing/landing.css';

export const metadata: Metadata = {
  title: 'Hudson — Multi-app canvas workspace for AI apps',
  description:
    'Build apps with Provider + Slots + Hooks. Compose them into spatial workspaces with pan, zoom, and windowing.',
};

export default function LandingPage() {
  return (
    <LandingGlyphWaves>
      <div className="relative min-h-screen bg-[#0a0a0a] text-neutral-200 overflow-x-hidden">
        <GlyphWavesPageBackground />
        <NavHeader />
        <Hero />
        <VideoSection />
        <Features />
        <Shells />
        <CodePreview />
        <CallToAction />
        <Footer />
        <ComponentShowcase />
      </div>
    </LandingGlyphWaves>
  );
}
