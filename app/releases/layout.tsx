import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Releases — Hudson',
  description:
    'Download the latest version of Hudson. Code-signed and notarized by Apple.',
  openGraph: {
    title: 'Releases — Hudson',
    description:
      'Download the latest version of Hudson. Code-signed and notarized by Apple.',
    images: [{ url: '/og-releases.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Releases — Hudson',
    description:
      'Download the latest version of Hudson. Code-signed and notarized by Apple.',
    images: ['/og-releases.png'],
  },
};

export default function ReleasesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
