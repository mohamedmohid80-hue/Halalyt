import React from 'react';
import {AbsoluteFill, Composition, interpolate, useCurrentFrame} from 'remotion';

const Hello: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 20], [0, 1], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{background: '#0b3d2e', justifyContent: 'center', alignItems: 'center'}}>
      <div style={{color: 'white', fontSize: 90, fontFamily: 'sans-serif', opacity, textAlign: 'center'}}>
        Halal YT<br />Remotion OK
      </div>
    </AbsoluteFill>
  );
};

export const Root: React.FC = () => (
  <Composition id="Hello" component={Hello} durationInFrames={45} fps={30} width={1080} height={1920} />
);
