import type { CSSProperties } from 'react';
import { decodeThemeForEmbed, inlineThemeStyle, resolveEmbedTheme } from '@/lib/embed-theme';
import { readStudioState } from '@/theme/cookie';
import { consumerClassName } from '../registry';
import WorkspaceEmbedClient from './WorkspaceEmbedClient';

interface PageProps {
  searchParams: Promise<{ ref?: string; palette?: string }>;
}

export default async function WorkspaceEmbedPage({ searchParams }: PageProps) {
  const params = await searchParams;

  // Priority: explicit `palette` URL token → studio cookie (same-origin) → `ref` consumer fallback.
  let themeStyle: CSSProperties | undefined;
  if (params.palette) {
    const decoded = decodeThemeForEmbed(params.palette);
    if (decoded) themeStyle = inlineThemeStyle(decoded) as CSSProperties;
  }
  if (!themeStyle) {
    const state = await readStudioState();
    themeStyle = inlineThemeStyle(resolveEmbedTheme(state)) as CSSProperties;
  }

  const themeClassName = themeStyle ? undefined : consumerClassName(params.ref);
  return <WorkspaceEmbedClient themeClassName={themeClassName} themeStyle={themeStyle} />;
}
