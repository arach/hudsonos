import { SiteRoot } from '@/SiteRoot';
import { readStudioState } from '@/theme/cookie';
import { resolveThemeStyle } from '@/theme/resolve';

export default async function Page() {
  const state = await readStudioState();
  const themeStyle = resolveThemeStyle(state);
  return <SiteRoot themeStyle={themeStyle} initialState={state} />;
}
