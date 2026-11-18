import React from 'react';
import {Composition} from 'remotion';
import {Hook, HOOK_DURATION_S, HOOK_FPS} from './Hook';

export const Root: React.FC = () => (
  <>
    <Composition
      id="Ep01-Hook"
      component={Hook}
      durationInFrames={Math.round(HOOK_DURATION_S * HOOK_FPS)}
      fps={HOOK_FPS}
      width={1920}
      height={1080}
    />
  </>
);
