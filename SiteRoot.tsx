import type { CSSProperties } from 'react';
import { GlobalAnimations } from '@/lib/animate';
import { DraftingFxLayers, FxProvider } from '@/lib/fx';
import { sheets } from '@/sheets';
import { StudioConsole } from '@/StudioConsole';
import type { StudioState } from '@/theme/defaults';
import { StudioProvider } from '@/theme/StudioContext';

interface SiteRootProps {
  themeStyle?: CSSProperties;
  initialState?: StudioState;
}

export function SiteRoot({ themeStyle, initialState }: SiteRootProps) {
  return (
    <StudioProvider initial={initialState}>
      <FxProvider>
        <main className="hudson-site" style={themeStyle}>
          {sheets.map(({ id, Component }) => (
            <Component key={id} />
          ))}
          <StudioConsole />
          <GlobalAnimations />
          <DraftingFxLayers />
        </main>
      </FxProvider>
    </StudioProvider>
  );
}
