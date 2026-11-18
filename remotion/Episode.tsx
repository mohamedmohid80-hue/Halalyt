import React from 'react';
import {Series} from 'remotion';
import {Hook, HOOK_DURATION_S} from './Hook';
import {Point1, P1_DURATION_S} from './Point1';
import {Rest, REST_DURATION_S} from './Rest';

const F = (s: number) => Math.round(s * 30);
export const EPISODE_DURATION_S = HOOK_DURATION_S + P1_DURATION_S + REST_DURATION_S;

/** Episode 1, "What Makes a YouTube Video Haram?", all sections back to back. */
export const Episode: React.FC = () => (
  <Series>
    <Series.Sequence durationInFrames={F(HOOK_DURATION_S)}><Hook /></Series.Sequence>
    <Series.Sequence durationInFrames={F(P1_DURATION_S)}><Point1 /></Series.Sequence>
    <Series.Sequence durationInFrames={F(REST_DURATION_S)}><Rest /></Series.Sequence>
  </Series>
);
