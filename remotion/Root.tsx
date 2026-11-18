import React from 'react';
import {Composition} from 'remotion';
import {Hook, HOOK_DURATION_S, HOOK_FPS} from './Hook';
import {Point1, P1_DURATION_S, P1_FPS} from './Point1';

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
    <Composition
      id="Ep01-Point1"
      component={Point1}
      durationInFrames={Math.round(P1_DURATION_S * P1_FPS)}
      fps={P1_FPS}
      width={1920}
      height={1080}
    />
  </>
);
