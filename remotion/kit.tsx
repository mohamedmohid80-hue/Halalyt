/* Shared animation kit for Halal YT explainer sections. All coordinates are 1920x1080. */
import React, {createContext, useContext} from 'react';
import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {loadFont as loadPoppins} from '@remotion/google-fonts/Poppins';
import {loadFont as loadNunito} from '@remotion/google-fonts/Nunito';
import {loadFont as loadAmiri} from '@remotion/google-fonts/Amiri';
import {loadFont as loadComic} from '@remotion/google-fonts/ComicNeue';

export const POP = loadPoppins('normal', {weights: ['700', '800', '900'], subsets: ['latin']}).fontFamily;
export const NUN = loadNunito('normal', {weights: ['700', '800', '900'], subsets: ['latin']}).fontFamily;
export const AMIRI = loadAmiri('normal', {weights: ['400', '700'], subsets: ['arabic', 'latin']}).fontFamily;
export const COMIC = loadComic('normal', {weights: ['700'], subsets: ['latin']}).fontFamily;

export const INK = '#151515', RED = '#F03A2E', GREEN = '#1FA34A', GOLD = '#F2B705', GREY = '#9AA0A6', BLUE = '#2F80ED', DEEN = '#1E7B4F';
export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const easeOut = Easing.out(Easing.cubic);
export const easeInOut = Easing.inOut(Easing.cubic);

/* ---------- clock: maps output time to voiceover time (recitations freeze the voiceover clock) ---------- */

export type Gap = {at: number; len: number; id: string};
export type Clock = {t: number; vt: number; gap: string | null; gt: number};
const GapCtx = createContext<Gap[]>([]);
export const GapProvider = GapCtx.Provider;

export const useClock = (): Clock => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const gaps = useContext(GapCtx);
  const t = f / fps;
  let shift = 0;
  for (const g of gaps) {
    const start = g.at + shift;
    if (t < start) break;
    if (t < start + g.len) return {t, vt: g.at, gap: g.id, gt: t - start};
    shift += g.len;
  }
  return {t, vt: t - shift, gap: null, gt: 0};
};
export const useVT = () => useClock().vt;

/* ---------- easing helpers ---------- */

export const prog = (t: number, a: number, d: number, e = easeOut) => interpolate(t, [a, a + d], [0, 1], {...clamp, easing: e});
/** Soft spring pop: 0.4 -> 1.06 -> 1 over 0.32 s. */
export const popS = (t: number, a: number) => (t < a ? 0 : interpolate(t, [a, a + 0.2, a + 0.32], [0.4, 1.06, 1], {...clamp, easing: Easing.out(Easing.quad)}));
export const stampS = (t: number, a: number) => (t < a ? 0 : interpolate(t, [a, a + 0.28, a + 0.38], [3, 0.96, 1], {...clamp, easing: Easing.in(Easing.quad)}));

/* ---------- scene + entrance wrappers ---------- */

export const Scene: React.FC<{from: number; to: number; zoom?: number; fadeIn?: number; fadeOut?: number; bg?: string; children: React.ReactNode}> = ({
  from, to, zoom = 0.012, fadeIn = 0, fadeOut = 0.2, bg, children,
}) => {
  const {vt, gap} = useClock();
  if (gap || vt < from || vt >= to) return null;
  const o = Math.min(fadeIn ? prog(vt, from, fadeIn, Easing.linear) : 1, fadeOut ? 1 - prog(vt, to - fadeOut, fadeOut, Easing.linear) : 1);
  return (
    <AbsoluteFill style={{background: bg, opacity: o, transform: `scale(${1 + zoom * (vt - from)})`, transformOrigin: '50% 50%'}}>{children}</AbsoluteFill>
  );
};

type Kind = 'slide' | 'slideL' | 'pop' | 'fade' | 'rise' | 'drop' | 'stamp' | 'cut';
/** Positions children absolutely and animates their entrance at voiceover time `at`. Slides/rises begin slightly early so they land on the word. */
export const In: React.FC<{at: number; kind?: Kind; x?: number; y?: number; w?: number; center?: boolean; rot?: number; out?: number; style?: React.CSSProperties; children: React.ReactNode}> = ({
  at, kind = 'rise', x = 0, y = 0, w, center, rot = 0, out, style, children,
}) => {
  const vt = useVT();
  const lead = kind === 'slide' || kind === 'slideL' ? 0.25 : kind === 'rise' || kind === 'drop' || kind === 'fade' ? 0.12 : 0.03;
  const a = at - lead;
  if (vt < a) return null;
  let tx = 0, ty = 0, s = 1, o = 1;
  if (kind === 'slide') tx = interpolate(vt, [a, a + 0.45], [900, 0], {...clamp, easing: Easing.out(Easing.exp)});
  if (kind === 'slideL') tx = interpolate(vt, [a, a + 0.45], [-900, 0], {...clamp, easing: Easing.out(Easing.exp)});
  if (kind === 'rise') { ty = interpolate(vt, [a, a + 0.4], [60, 0], {...clamp, easing: easeOut}); o = prog(vt, a, 0.3, Easing.linear); }
  if (kind === 'drop') { ty = interpolate(vt, [a, a + 0.4], [-60, 0], {...clamp, easing: easeOut}); o = prog(vt, a, 0.3, Easing.linear); }
  if (kind === 'fade') o = prog(vt, a, 0.4, Easing.linear);
  if (kind === 'pop') s = popS(vt, a);
  if (kind === 'stamp') { s = stampS(vt, a); o = prog(vt, a, 0.08, Easing.linear); }
  if (out !== undefined && vt >= out) o *= 1 - prog(vt, out, 0.3, Easing.linear);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, opacity: o, transform: `translate(${center ? '-50%, -50%' : '0,0'}) translate(${tx}px, ${ty}px) scale(${s}) rotate(${rot}deg)`, transformOrigin: 'center', ...style}}>
      {children}
    </div>
  );
};

/* ---------- content ---------- */

export const Pic: React.FC<{src: string; w: number; h?: number; radius?: number; shadow?: boolean; blur?: number; gray?: number; dim?: number; style?: React.CSSProperties}> = ({src, w, h, radius = 18, shadow = true, blur = 0, gray = 0, dim = 0, style}) => (
  <div style={{width: w, height: h, borderRadius: radius, overflow: 'hidden', boxShadow: shadow ? '0 18px 40px rgba(0,0,0,.22)' : undefined, position: 'relative', ...style}}>
    <Img src={staticFile(src)} style={{width: '100%', height: h ? '100%' : undefined, objectFit: 'cover', display: 'block', filter: `blur(${blur}px) grayscale(${gray})`, transform: blur ? 'scale(1.08)' : undefined}} />
    {dim > 0 && <div style={{position: 'absolute', inset: 0, background: `rgba(0,0,0,${dim})`}} />}
  </div>
);

export const Emo: React.FC<{name: string; w: number; glow?: string}> = ({name, w, glow}) => (
  <Img src={staticFile(`rest/e-${name}.png`)} style={{width: w, display: 'block', filter: glow ? `drop-shadow(0 0 28px ${glow})` : 'drop-shadow(0 12px 18px rgba(0,0,0,.18))'}} />
);

export const Sticker: React.FC<{text: string; color: string; size: number; stroke?: string; glow?: string}> = ({text, color, size, stroke = INK, glow}) => (
  <div style={{fontFamily: POP, fontWeight: 900, fontSize: size, color, WebkitTextStroke: `${Math.max(6, Math.round(size / 11))}px ${stroke}`, paintOrder: 'stroke fill', letterSpacing: -1, whiteSpace: 'nowrap', lineHeight: 1.05, textShadow: glow ? `0 0 40px ${glow}` : '0 10px 18px rgba(0,0,0,.28)'}}>{text}</div>
);

export const Pill: React.FC<{text: string; color: string; size?: number; fg?: string; glow?: boolean}> = ({text, color, size = 46, fg = '#fff', glow}) => (
  <div style={{display: 'inline-block', background: color, color: fg, fontFamily: POP, fontWeight: 900, fontSize: size, padding: `${size * 0.32}px ${size * 0.75}px`, borderRadius: 999, whiteSpace: 'nowrap', boxShadow: glow ? `0 0 40px ${color}` : '0 8px 20px rgba(0,0,0,.18)'}}>{text}</div>
);

export const Box: React.FC<{w: number; h: number; color?: string; fill?: string; dash?: boolean; radius?: number; children?: React.ReactNode; glow?: string; style?: React.CSSProperties}> = ({w, h, color = INK, fill = '#fff', dash, radius = 26, children, glow, style}) => (
  <div style={{width: w, height: h, border: `8px ${dash ? 'dashed' : 'solid'} ${color}`, background: fill, borderRadius: radius, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 10, boxShadow: glow ? `0 0 50px ${glow}` : '0 10px 24px rgba(0,0,0,.08)', ...style}}>{children}</div>
);

export const Label: React.FC<{text: string; size?: number; color?: string; weight?: number; font?: string; align?: 'left' | 'center'}> = ({text, size = 52, color = INK, weight = 900, font = POP, align = 'center'}) => (
  <div style={{fontFamily: font, fontWeight: weight, fontSize: size, color, textAlign: align, lineHeight: 1.15}}>{text}</div>
);

/** Text that types on character by character between a and b (voiceover time). */
export const TypeOn: React.FC<{text: string; a: number; b: number; size?: number; color?: string; font?: string; weight?: number}> = ({text, a, b, size = 60, color = INK, font = POP, weight = 900}) => {
  const vt = useVT();
  const chars = Array.from(text);
  const n = Math.floor(interpolate(vt, [a, b], [0, chars.length], clamp));
  return <div style={{fontFamily: font, fontWeight: weight, fontSize: size, color, whiteSpace: 'nowrap'}}>{chars.slice(0, n).join('')}<span style={{opacity: 0}}>{chars.slice(n).join('')}</span></div>;
};

/** Words revealed one by one at their spoken times. */
export const Words: React.FC<{words: [string, number][]; size?: number; color?: string; font?: string; weight?: number; width?: number; hl?: [string, string][]}> = ({words, size = 64, color = INK, font = NUN, weight = 800, width = 1500, hl = []}) => {
  const vt = useVT();
  return (
    <div style={{width, textAlign: 'center', fontFamily: font, fontWeight: weight, fontSize: size, color, lineHeight: 1.35}}>
      {words.map(([w, at], i) => {
        const o = prog(vt, at - 0.08, 0.25, Easing.linear);
        const c = hl.find(([k]) => w.toLowerCase().includes(k))?.[1];
        return <span key={i} style={{opacity: o, color: c ?? color, display: 'inline-block', marginRight: '0.28em', transform: `translateY(${(1 - o) * 14}px)`}}>{w}</span>;
      })}
    </div>
  );
};

/** SVG path that draws itself on. */
export const Draw: React.FC<{d: string; at: number; dur?: number; color?: string; width?: number; dash?: string; arrow?: boolean}> = ({d, at, dur = 0.4, color = INK, width = 8, dash, arrow}) => {
  const vt = useVT();
  const p = prog(vt, at - 0.1, dur);
  if (p <= 0) return null;
  const id = `m${color.replace('#', '')}`;
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
      <defs><marker id={id} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill={color} /></marker></defs>
      <path d={d} pathLength={1} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeDasharray={dash && p >= 1 ? undefined : '1'} strokeDashoffset={dash && p >= 1 ? undefined : 1 - p} style={dash && p >= 1 ? {strokeDasharray: dash} : undefined} />
      {arrow && p >= 0.98 && <path d={d} fill="none" stroke="transparent" strokeWidth={width} markerEnd={`url(#${id})`} />}
    </svg>
  );
};

/** Number rolling between a and b. */
export const Count: React.FC<{from?: number; to: number; a: number; b: number; suffix?: string; prefix?: string; size?: number; color?: string}> = ({from = 0, to, a, b, suffix = '', prefix = '', size = 120, color = GOLD}) => {
  const vt = useVT();
  const n = Math.round(interpolate(vt, [a, b], [from, to], {...clamp, easing: easeOut}));
  return <Sticker text={`${prefix}${n.toLocaleString('en-US')}${suffix}`} color={color} size={size} />;
};

/** Soft radial glow behind sacred text. */
export const Glow: React.FC<{color?: string; x?: number; y?: number; r?: number; o?: number}> = ({color = 'rgba(242,183,5,.35)', x = 960, y = 540, r = 900, o = 1}) => (
  <div style={{position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: '50%', background: `radial-gradient(circle, ${color} 0%, rgba(255,255,255,0) 60%)`, opacity: o}} />
);

export const Hadi: React.FC<{pose: string; h?: number}> = ({pose, h = 860}) => (
  <Img src={staticFile(`hadi/hadi-${pose}.svg`)} style={{height: h, display: 'block'}} />
);

/** Section title: big number, title typed on, underline drawn, Hadi on the left. */
export const TitleCard: React.FC<{from: number; to: number; n: number; title: string; a: number; b: number; pose?: string; color?: string}> = ({from, to, n, title, a, b, pose = 'point', color = RED}) => {
  const vt = useVT();
  const ul = prog(vt, b, 0.35);
  const size = title.length > 22 ? 84 : 104;
  return (
    <Scene from={from} to={to}>
      <In at={from} kind="slide" x={90} y={170}><Hadi pose={pose} /></In>
      <In at={from} kind="pop" x={1220} y={300} center><Sticker text={`#${n}`} color={GOLD} size={230} /></In>
      <div style={{position: 'absolute', left: 560, width: 1320, top: 470, textAlign: 'center'}}><TypeOn text={title} a={a} b={b} size={size} color={color} /></div>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <path d="M720,640 Q1220,690 1720,640" pathLength={1} stroke={color} strokeWidth={12} fill="none" strokeLinecap="round" strokeDasharray="1" strokeDashoffset={1 - ul} />
      </svg>
    </Scene>
  );
};

/** Clean card for hadith / ayah translations. Phrases highlight in green while spoken. */
export const SacredCard: React.FC<{from: number; to: number; lead: string; leadAt: number; ar: string; arAt: number; phrases: [string, number, number][]; src: string; srcAt?: number; quran?: boolean}> = ({
  from, to, lead, leadAt, ar, arAt, phrases, src, srcAt, quran,
}) => {
  const vt = useVT();
  const arO = prog(vt, arAt - 0.2, 0.5, Easing.linear);
  const srcO = prog(vt, (srcAt ?? arAt) - 0.2, 0.5, Easing.linear);
  const glowO = 0.55 + 0.25 * Math.sin(vt * 1.6);
  return (
    <Scene from={from} to={to} fadeIn={0.45} fadeOut={0.35} zoom={0.004}>
      {quran && <Glow o={glowO} r={850} />}
      <div style={{position: 'absolute', left: 230, top: 110, width: 1460, height: 860, background: '#fff', border: `3px solid ${quran ? '#E8C766' : '#ddd'}`, borderRadius: 14, boxShadow: quran ? '0 0 60px rgba(242,183,5,.35)' : '0 10px 30px rgba(0,0,0,.12)', padding: '56px 90px'}}>
        <div style={{fontFamily: NUN, fontWeight: 900, fontSize: 44, color: DEEN, textAlign: 'center', opacity: prog(vt, leadAt - 0.15, 0.4, Easing.linear)}}>{lead}</div>
        <div style={{opacity: arO}}>
          <div style={{fontFamily: AMIRI, fontWeight: 700, fontSize: ar.length > 90 ? 58 : 72, direction: 'rtl', textAlign: 'center', lineHeight: 1.75, marginTop: 26, color: '#111'}}>{ar}</div>
          <div style={{fontFamily: NUN, fontWeight: 800, fontSize: 48, textAlign: 'center', marginTop: 30, lineHeight: 1.45, color: '#222'}}>
            “{phrases.map(([p, a, b], i) => {
              const on = vt >= a - 0.05 && vt < b;
              const seen = vt >= a - 0.05;
              return <span key={i} style={{background: on ? 'rgba(46,204,64,.28)' : 'transparent', borderRadius: 6, padding: '0 6px', opacity: seen ? 1 : 0.35, transition: 'none'}}>{p} </span>;
            })}”
          </div>
        </div>
        <div style={{position: 'absolute', bottom: 46, left: 80, right: 80, textAlign: 'center', fontFamily: NUN, fontWeight: 800, fontSize: 34, color: quran ? '#9A7A10' : '#666', opacity: srcO}}>{src}</div>
      </div>
    </Scene>
  );
};

/** Arabic ayah shown during a recitation; each word glows gold as it is recited. Rendered only while that gap is playing. */
export const Recitation: React.FC<{id: string; words: [string, number][]; label: string; reciter: string; tail: number}> = ({id, words, label, reciter, tail}) => {
  const {gap, gt} = useClock();
  if (gap !== id) return null;
  const o = Math.min(prog(gt, 0, 0.6, Easing.linear), 1 - prog(gt, tail - 0.5, 0.5, Easing.linear));
  const pulse = 0.6 + 0.25 * Math.sin(gt * 1.4);
  return (
    <AbsoluteFill style={{background: '#fff', opacity: o}}>
      <Glow r={1000} o={pulse} />
      <div style={{position: 'absolute', left: 140, right: 140, top: 230, textAlign: 'center', direction: 'rtl', fontFamily: AMIRI, fontWeight: 700, fontSize: 92, lineHeight: 1.9}}>
        {words.map(([w, at], i) => {
          const lit = gt >= at;
          const fresh = gt >= at && gt < at + 1.2;
          return (
            <span key={i} style={{color: lit ? '#151515' : 'rgba(21,21,21,.22)', textShadow: fresh ? '0 0 26px rgba(242,183,5,.95), 0 0 6px rgba(242,183,5,.8)' : lit ? '0 0 10px rgba(242,183,5,.35)' : 'none', marginLeft: '0.32em', display: 'inline-block'}}>{w}</span>
          );
        })}
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 150, textAlign: 'center', fontFamily: NUN, fontWeight: 900, fontSize: 44, color: "#9A7A10"}}>{label}</div>
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 95, textAlign: 'center', fontFamily: NUN, fontWeight: 800, fontSize: 30, color: '#999'}}>{reciter}</div>
    </AbsoluteFill>
  );
};

export const RedWipe: React.FC<{at: number}> = ({at}) => {
  const vt = useVT();
  if (vt < at || vt > at + 0.5) return null;
  const x = interpolate(vt, [at, at + 0.45], [1920, -900], {...clamp, easing: easeInOut});
  return <div style={{position: 'absolute', top: 0, left: x, width: 900, height: 1080, background: RED}} />;
};

export const Person: React.FC<{c?: string; s?: number}> = ({c = INK, s = 1}) => (
  <svg width={60 * s} height={70 * s} viewBox="-30 -55 60 70"><circle cx={0} cy={-34} r={16} fill={c} /><path d="M-24,12 Q-24,-14 0,-14 Q24,-14 24,12 Z" fill={c} /></svg>
);
