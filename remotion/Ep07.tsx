/* Ep07 "Day in the life of Muslims 1400 years ago": one generated image per shot, slow zoom-ins, soft crossfades,
   minimal overlays. Shot start times come from the voiceover's word timings (audio/07-day-in-the-life.words.json). */
import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {loadFont as lPoppins} from '@remotion/google-fonts/Poppins';
import {loadFont as lComic} from '@remotion/google-fonts/ComicNeue';
import {loadFont as lNunito} from '@remotion/google-fonts/Nunito';

const POP = lPoppins('normal', {weights: ['900'], subsets: ['latin']}).fontFamily;
const COMIC = lComic('italic', {weights: ['700'], subsets: ['latin']}).fontFamily;
const NUN = lNunito('normal', {weights: ['800'], subsets: ['latin']}).fontFamily;

export const EP07_FPS = 30;
export const EP07_DURATION_S = 238.6;
const FADE = 0.4;
const clampE = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

type Cross = {at: number; x: number; y: number; size?: number};
type Shot = {n: number; t: number; type: 'F' | 'W'; cap?: string; ref?: string; quote?: string; crosses?: Cross[]; lamp?: boolean; ox?: number; oy?: number};

// [image number, start time]; F = full scene (slow zoom-in), W = whiteboard frame (soft pop, gentle zoom)
const SHOTS: Shot[] = [
  {n: 1, t: 0, type: 'F'}, {n: 2, t: 4.14, type: 'W'}, {n: 3, t: 6.56, type: 'W'}, {n: 4, t: 9.04, type: 'F'},
  {n: 5, t: 12.2, type: 'F'}, {n: 6, t: 16.34, type: 'W'}, {n: 7, t: 18.52, type: 'W'},
  {n: 8, t: 20.56, type: 'F', cap: 'MADINAH · 7TH CENTURY'},
  {n: 9, t: 24.9, type: 'W', crosses: [{at: 25.18, x: 23.4, y: 30.8}, {at: 26.26, x: 72.7, y: 24.4}]},
  {n: 10, t: 26.7, type: 'W', crosses: [{at: 27.24, x: 13.5, y: 57.4}, {at: 28.08, x: 79, y: 68}]},
  {n: 11, t: 29.54, type: 'F'}, {n: 12, t: 33.16, type: 'W'}, {n: 13, t: 36.42, type: 'W'},
  {n: 14, t: 43.04, type: 'F'}, {n: 15, t: 49.94, type: 'F', cap: 'BEFORE DAWN'}, {n: 16, t: 55.46, type: 'F'},
  {n: 17, t: 58.14, type: 'F', ref: 'Sahih al-Bukhari 578 · Sahih Muslim 645'},
  {n: 18, t: 68.48, type: 'F', ref: 'Sahih Muslim 670'},
  {n: 19, t: 81.44, type: 'W'}, {n: 20, t: 83.9, type: 'W'},
  {n: 21, t: 88.84, type: 'W', crosses: [{at: 90.9, x: 66, y: 58, size: 600}]},
  {n: 22, t: 95.26, type: 'F', ref: 'Sahih al-Bukhari 6459 · Sahih Muslim 2972'},
  {n: 23, t: 99.56, type: 'W'}, {n: 24, t: 101.84, type: 'F'},
  {n: 25, t: 105.62, type: 'F', cap: 'MORNING'}, {n: 26, t: 109.06, type: 'F', oy: 30}, {n: 27, t: 112.7, type: 'W'},
  {n: 28, t: 114.74, type: 'F'}, {n: 29, t: 116.08, type: 'W'},
  {n: 30, t: 119.36, type: 'W', quote: '"Show me the market"', ref: 'Sahih al-Bukhari 2048'},
  {n: 31, t: 122.04, type: 'W'}, {n: 32, t: 125.66, type: 'F'}, {n: 33, t: 130.16, type: 'F', ref: 'Jami\' at-Tirmidhi 3703'},
  {n: 34, t: 137.02, type: 'F', cap: 'MIDDAY'}, {n: 35, t: 142.0, type: 'F', cap: 'QAYLULAH', ref: 'Sahih al-Bukhari 939'},
  {n: 36, t: 149.5, type: 'W'}, {n: 37, t: 152.8, type: 'F', ref: 'al-Adab al-Mufrad 450', oy: 30}, {n: 38, t: 157.86, type: 'W'},
  {n: 39, t: 161.14, type: 'F'}, {n: 40, t: 164.82, type: 'F', cap: 'AFTERNOON'},
  {n: 41, t: 172.58, type: 'F', ref: 'Sahih al-Bukhari 420'}, {n: 42, t: 173.64, type: 'F', ref: 'Sahih al-Bukhari 2899', ox: 60},
  {n: 43, t: 178.32, type: 'F'}, {n: 44, t: 181.26, type: 'W'},
  {n: 45, t: 184.14, type: 'F', cap: 'MAGHRIB'}, {n: 46, t: 186.38, type: 'F'},
  {n: 47, t: 189.96, type: 'F', cap: 'NIGHT'},
  {n: 48, t: 195.34, type: 'W', lamp: true, crosses: [{at: 197.68, x: 79, y: 64, size: 360}], ref: 'Sahih al-Bukhari 382'},
  {n: 49, t: 198.18, type: 'W', ref: 'Sahih al-Bukhari 568'}, {n: 50, t: 207.72, type: 'F'},
  {n: 51, t: 210.78, type: 'W'}, {n: 52, t: 218.78, type: 'F'}, {n: 53, t: 221.08, type: 'F'}, {n: 54, t: 231.6, type: 'W'},
];
const END = 238.6;

const XMark: React.FC<{c: Cross; t: number}> = ({c, t}) => {
  if (t < c.at - 0.05) return null;
  const k = Math.min(1, (t - c.at + 0.05) / 0.28);
  const s = k < 1 ? 2.2 - 1.2 * Easing.in(Easing.quad)(k) : 1;
  const size = c.size ?? 420;
  return (
    <div data-k="text" style={{position: 'absolute', left: `${c.x}%`, top: `${c.y}%`, transform: `translate(-50%,-50%) scale(${s})`, opacity: Math.min(1, k * 3),
      fontFamily: POP, fontWeight: 900, fontSize: size, lineHeight: 1, color: '#E31B1B', textShadow: '0 0 10px #fff, 0 0 3px #fff'}}>✕</div>
  );
};

const Lamp: React.FC<{t: number; from: number}> = ({t, from}) => {
  const o = interpolate(t, [from + 0.3, from + 0.8], [0, 1], clampE);
  return (
    <svg viewBox="0 0 120 80" style={{position: 'absolute', left: '64%', top: '46%', width: '30%', opacity: o}}>
      <path d="M10,50 Q60,80 110,50 L95,40 Q60,58 25,40 Z" fill="#C98A4A" stroke="#151515" strokeWidth={4} />
      <path d="M95,40 Q112,30 118,36" fill="none" stroke="#151515" strokeWidth={4} />
      <path d="M20,42 Q8,30 14,22 Q22,30 20,42" fill="#FFB347" stroke="#151515" strokeWidth={3} />
    </svg>
  );
};

const ShotView: React.FC<{s: Shot; next: number; t: number}> = ({s, next, t}) => {
  const dur = next - s.t;
  const k = Math.max(0, Math.min(1, (t - s.t) / (dur + FADE)));
  const zoomTo = s.type === 'F' ? (dur > 7 ? 1.14 : 1.08) : 1.04;
  let scale = 1 + (zoomTo - 1) * k;
  if (s.type === 'W') scale *= interpolate(t - s.t, [0, 0.35], [0.96, 1], {...clampE, easing: Easing.out(Easing.cubic)});
  const op = s.t === 0 ? 1 : interpolate(t, [s.t, s.t + FADE], [0, 1], clampE);
  const capO = interpolate(t, [s.t + 0.3, s.t + 0.8, s.t + Math.min(dur, 3.2) - 0.3, s.t + Math.min(dur, 3.2)], [0, 1, 1, 0], clampE);
  const refO = interpolate(t, [s.t + 0.6, s.t + 1.1], [0, 1], clampE);
  const qO = interpolate(t, [s.t + 0.5, s.t + 0.9], [0, 1], clampE);
  return (
    <AbsoluteFill style={{opacity: op}}>
      <AbsoluteFill style={{transform: `scale(${scale})`, transformOrigin: `${s.ox ?? 50}% ${s.oy ?? 50}%`, background: '#FCFBF7'}}>
        <Img src={staticFile(`ep7v/${s.n}.jpg`)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        {s.lamp && <Lamp t={t} from={s.t} />}
        {(s.crosses ?? []).map((c, i) => <XMark key={i} c={c} t={t} />)}
      </AbsoluteFill>
      {s.cap && <div data-k="text" style={{position: 'absolute', left: 0, right: 0, top: 40, textAlign: 'center', opacity: capO}}>
        <span style={{fontFamily: COMIC, fontStyle: 'italic', fontWeight: 700, fontSize: 60, color: '#fff', letterSpacing: 2, textShadow: '0 3px 14px rgba(0,0,0,.85), 0 0 4px #000'}}>{s.cap}</span></div>}
      {s.quote && <div data-k="text" style={{position: 'absolute', left: '22%', width: '50%', top: 60, textAlign: 'center', opacity: qO}}>
        <span style={{fontFamily: COMIC, fontStyle: 'italic', fontWeight: 700, fontSize: 64, color: '#151515'}}>{s.quote}</span></div>}
      {s.ref && <div data-k="text" style={{position: 'absolute', right: 28, bottom: 26, opacity: refO, background: 'rgba(0,0,0,.62)', color: '#fff',
        fontFamily: NUN, fontWeight: 800, fontSize: 26, padding: '6px 16px', borderRadius: 10}}>{s.ref}</div>}
    </AbsoluteFill>
  );
};

export const Ep07: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const live: React.ReactNode[] = [];
  SHOTS.forEach((s, i) => {
    const next = i + 1 < SHOTS.length ? SHOTS[i + 1].t : END;
    if (t >= s.t && t < next + FADE) live.push(<ShotView key={s.n} s={s} next={next} t={t} />);
  });
  const sfx: [number, string, number][] = [[0.0, 'buzz', 0.08]];
  for (const s of SHOTS) for (const c of s.crosses ?? []) sfx.push([c.at, 'thud', 0.07]);
  const fadeOut = interpolate(t, [END - 0.8, END], [1, 0], clampE);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <AbsoluteFill style={{opacity: fadeOut}}>{live}</AbsoluteFill>
      <Audio src={staticFile('ep7v/vo.mp3')} />
      {sfx.map(([at, n, v], i) => <Sequence key={i} from={Math.round(at * fps)} durationInFrames={Math.round(fps * 1.1)}><Audio src={staticFile(`ep7v/sfx/${n}.wav`)} volume={v} /></Sequence>)}
    </AbsoluteFill>
  );
};
