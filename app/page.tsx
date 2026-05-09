import { SiteRoot } from '@/SiteRoot';
import { DEFAULTS } from '@/theme/defaults';
import { resolveThemeStyle } from '@/theme/resolve';

// Static export: HTML ships with DEFAULTS inlined on .hudson-site so first
// paint has CSS vars even before site.css finishes loading (matters in dev).
// The theme-boot script in <head> injects a higher-specificity !important
// rule that overrides these for users with a saved cookie. StudioConsole
// removes the boot <style> after hydration so subsequent toggles take effect.
export default function Page() {
  const themeStyle = resolveThemeStyle({ ...DEFAULTS });
  return <SiteRoot themeStyle={themeStyle} initialState={{ ...DEFAULTS }} />;
}
