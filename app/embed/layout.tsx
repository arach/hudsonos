import type { Metadata } from "next";
import "./embed.css";

export const metadata: Metadata = {
  title: "Hudson Embed",
  robots: { index: false, follow: false },
};

export default function EmbedLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
