import { GlobalAnimations } from './animate';
import { Sheet01Hero } from './Sheet01Hero';
import { Sheet02Possession } from './Sheet02Possession';
import { Sheet03Voice } from './Sheet03Voice';
import { Sheet04Surfaces } from './Sheet04Surfaces';
import { Sheet05Apps } from './Sheet05Apps';
import { Sheet06Primitives } from './Sheet06Primitives';
import { Sheet07Quickstart } from './Sheet07Quickstart';
import { StudioConsole } from './StudioConsole';
import './site.css';

export function SiteRoot() {
  return (
    <main className="hudson-site">
      <Sheet01Hero />
      <Sheet02Possession />
      <Sheet03Voice />
      <Sheet04Surfaces />
      <Sheet05Apps />
      <Sheet06Primitives />
      <Sheet07Quickstart />
      <StudioConsole />
      <GlobalAnimations />
    </main>
  );
}
