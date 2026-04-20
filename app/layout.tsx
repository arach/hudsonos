import type { Metadata } from "next";
import { Geist_Mono, Jura } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Brand typeface — Jura. Chosen over Astro Mono (unlicensed) during the Hudson landing rebuild.
const jura = Jura({
  variable: "--font-jura",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://hudsonos.com"),
  title: "Hudson — Multi-app canvas workspace for AI apps",
  description:
    "Build apps with Provider + Slots + Hooks. Compose them into spatial workspaces with pan, zoom, and windowing.",
  openGraph: {
    title: "Hudson — Multi-app canvas workspace for AI apps",
    description:
      "Build apps with Provider + Slots + Hooks. Compose them into spatial workspaces with pan, zoom, and windowing.",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hudson — Multi-app canvas workspace for AI apps",
    description:
      "Build apps with Provider + Slots + Hooks. Compose them into spatial workspaces with pan, zoom, and windowing.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${jura.variable} ${geistMono.variable}`}
    >
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-GSHDZPFRZG"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-GSHDZPFRZG');`}
        </Script>
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
