import React from 'react';
import {Composition} from 'remotion';
import {Hook, HOOK_DURATION_S, HOOK_FPS} from './Hook';
import {Point1, P1_DURATION_S, P1_FPS} from './Point1';
import {Rest, REST_DURATION_S, REST_FPS} from './Rest';
import {Episode, EPISODE_DURATION_S} from './Episode';
import {Ep03, EP03_DURATION_S, EP03_FPS} from './Ep03';
import {Ep04, EP04_DURATION_S, EP04_FPS} from './Ep04';
import {Ep06Full, EP06F_DURATION_S, EP06F_FPS} from './Ep06Full';
import {Ep08Full, EP08F_DURATION_S, EP08F_FPS} from './Ep08Full';
import {Ep08Preview, EP08P_DURATION_S, EP08P_FPS} from './Ep08Preview';
import {Ep07, EP07_DURATION_S, EP07_FPS} from './Ep07';
import {Ep04Full, EP04F_DURATION_S, EP04F_FPS} from './Ep04Full';

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
    <Composition id="Ep01-Rest" component={Rest} durationInFrames={Math.round(REST_DURATION_S * REST_FPS)} fps={REST_FPS} width={1920} height={1080} />
    <Composition id="Ep01-Full" component={Episode} durationInFrames={Math.round(EPISODE_DURATION_S * 30)} fps={30} width={1920} height={1080} />
    <Composition id="Ep03-ShareQuran" component={Ep03} durationInFrames={Math.round(EP03_DURATION_S * EP03_FPS)} fps={EP03_FPS} width={1920} height={1080} />
    <Composition id="Ep04-Preview" component={Ep04} durationInFrames={Math.round(EP04_DURATION_S * EP04_FPS)} fps={EP04_FPS} width={1920} height={1080} />
    <Composition id="Ep04-Full" component={Ep04Full} durationInFrames={Math.round(EP04F_DURATION_S * EP04F_FPS)} fps={EP04F_FPS} width={1920} height={1080} />
    <Composition id="Ep06-Full" component={Ep06Full} durationInFrames={Math.round(EP06F_DURATION_S * EP06F_FPS)} fps={EP06F_FPS} width={1920} height={1080} />
    <Composition id="Ep07-DayInTheLife" component={Ep07} durationInFrames={Math.round(EP07_DURATION_S * EP07_FPS)} fps={EP07_FPS} width={1920} height={1080} />
    <Composition id="Ep08-Preview" component={Ep08Preview} durationInFrames={Math.round(EP08P_DURATION_S * EP08P_FPS)} fps={EP08P_FPS} width={1920} height={1080} />
    <Composition id="Ep08-Full" component={Ep08Full} durationInFrames={Math.round(EP08F_DURATION_S * EP08F_FPS)} fps={EP08F_FPS} width={1920} height={1080} />
  </>
);
