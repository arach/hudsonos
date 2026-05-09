import { SiteRoot } from '@/SiteRoot';
import { DEFAULTS } from '@/theme/defaults';
import { resolveThemeStyle } from '@/theme/resolve';

// Static export: render with defaults at build time.
// The StudioConsole rehydrates user preferences from localStorage/cookie on the client.
export default function Page() {
  const themeStyle = resolveThemeStyle({ ...DEFAULTS });
  return <SiteRoot themeStyle={themeStyle} initialState={{ ...DEFAULTS }} />;
}
