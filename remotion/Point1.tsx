import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {loadFont as loadPoppins} from '@remotion/google-fonts/Poppins';
import {loadFont as loadNunito} from '@remotion/google-fonts/Nunito';
import {loadFont as loadAmiri} from '@remotion/google-fonts/Amiri';
import {loadFont as loadRoboto} from '@remotion/google-fonts/Roboto';

const {fontFamily: POP} = loadPoppins('normal', {weights: ['800', '900'], subsets: ['latin']});
const {fontFamily: NUN} = loadNunito('normal', {weights: ['800', '900'], subsets: ['latin']});
const {fontFamily: AMIRI} = loadAmiri('normal', {weights: ['700'], subsets: ['arabic']});
const {fontFamily: ROBOTO} = loadRoboto('normal', {weights: ['500', '700'], subsets: ['latin']});

export const P1_FPS = 30;
export const P1_DURATION_S = 46.0;
const L = 0.25; // draw-ons and slide-ins start this long before their word

const INK = '#151515', RED = '#F03A2E', GREEN = '#22A745', GOLD = '#F2B705', GREY = '#9AA0A6', BLUE = '#2F80ED';
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const expoOut = Easing.out(Easing.exp);

const useT = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return f / fps;
};
const prog = (t: number, a: number, d: number, e = Easing.out(Easing.cubic)) => interpolate(t, [a, a + d], [0, 1], {...clamp, easing: e});
const pop = (t: number, a: number) => (t < a ? 0 : interpolate(t, [a, a + 0.1], [0.3, 1], {...clamp, easing: Easing.out(Easing.quad)}));
const stamp = (t: number, a: number) => (t < a ? 0 : interpolate(t, [a, a + 0.3], [4, 1], {...clamp, easing: Easing.in(Easing.quad)}));
const slideX = (t: number, a: number, from = 1300) => interpolate(t, [a, a + 0.25], [from, 0], {...clamp, easing: expoOut});

/* ---------- SVG building blocks ---------- */

const Svg: React.FC<{children: React.ReactNode}> = ({children}) => (
  <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}}>
    <defs>
      {[['ah', INK], ['ahr', RED], ['ahg', GREY], ['ahb', BLUE]].map(([id, c]) => (
        <marker key={id} id={id} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill={c} />
        </marker>
      ))}
    </defs>
    {children}
  </svg>
);

/** A path that draws itself on between `at` and `at + dur`; arrowhead appears when it arrives. */
const Draw: React.FC<{d: string; at: number; dur?: number; color?: string; width?: number; dash?: boolean; marker?: string}> = ({
  d, at, dur = 0.25, color = INK, width = 8, dash, marker,
}) => {
  const t = useT();
  const p = prog(t, at, dur);
  if (p <= 0) return null;
  return (
    <>
      <path d={d} pathLength={1} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeDasharray="1" strokeDashoffset={1 - p} />
      {dash && p >= 1 && <path d={d} fill="none" stroke="#fff" strokeWidth={width + 2} strokeDasharray="20 18" strokeDashoffset={-20} />}
      {marker && p >= 0.98 && <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" markerEnd={`url(#${marker})`} />}
    </>
  );
};

const PopG: React.FC<{at: number; cx: number; cy: number; anim?: 'pop' | 'stamp'; children: React.ReactNode}> = ({at, cx, cy, anim = 'pop', children}) => {
  const t = useT();
  const s = anim === 'pop' ? pop(t, at) : stamp(t, at);
  if (s === 0) return null;
  return <g transform={`translate(${cx} ${cy}) scale(${s}) translate(${-cx} ${-cy})`}>{children}</g>;
};

const Node: React.FC<{x: number; y: number; w: number; h: number; text: string; at: number; icon?: string; fill?: string; stroke?: string; color?: string; size?: number; dash?: boolean}> = ({
  x, y, w, h, text, at, icon, fill = '#fff', stroke = INK, color = INK, size = 58, dash,
}) => (
  <PopG at={at} cx={x + w / 2} cy={y + h / 2}>
    <rect x={x} y={y} width={w} height={h} rx={26} fill={fill} stroke={stroke} strokeWidth={8} strokeDasharray={dash ? '22 16' : undefined} />
    {icon && <text x={x + 30} y={y + h / 2 + 30} fontSize={84}>{icon}</text>}
    <text x={icon ? x + 140 + (w - 140) / 2 : x + w / 2} y={y + h / 2 + size * 0.36} textAnchor="middle" fontFamily={POP} fontWeight={900} fontSize={size} fill={color}>{text}</text>
  </PopG>
);

const Pill: React.FC<{cx: number; cy: number; w: number; text: string; color: string; at: number; anim?: 'pop' | 'stamp'; size?: number}> = ({cx, cy, w, text, color, at, anim = 'pop', size = 48}) => (
  <PopG at={at} cx={cx} cy={cy} anim={anim}>
    <rect x={cx - w / 2} y={cy - 55} width={w} height={110} rx={55} fill={color} />
    <text x={cx} y={cy + size * 0.36} textAnchor="middle" fontFamily={POP} fontWeight={900} fontSize={size} fill="#fff">{text}</text>
  </PopG>
);

const Txt: React.FC<{x: number; y: number; text: string; at?: number; size?: number; color?: string; anchor?: 'start' | 'middle' | 'end'; weight?: number}> = ({
  x, y, text, at = -1, size = 48, color = INK, anchor = 'middle', weight = 900,
}) => {
  const t = useT();
  if (t < at) return null;
  return <text x={x} y={y} textAnchor={anchor} fontFamily={POP} fontWeight={weight} fontSize={size} fill={color}>{text}</text>;
};

const Person: React.FC<{x: number; y: number; s?: number; c?: string}> = ({x, y, s = 1, c = INK}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle cx={0} cy={-34} r={16} fill={c} />
    <path d="M-22,10 Q-22,-14 0,-14 Q22,-14 22,10 Z" fill={c} />
  </g>
);

/** Scene wrapper: visible in [from, to), constant slow zoom, optional fade in/out. */
const Scene: React.FC<{from: number; to: number; fadeIn?: number; fadeOut?: number; zoom?: number; children: React.ReactNode}> = ({
  from, to, fadeIn = 0, fadeOut = 0, zoom = 0.02, children,
}) => {
  const t = useT();
  if (t < from || t >= to) return null;
  const o = Math.min(fadeIn ? prog(t, from, fadeIn, Easing.linear) : 1, fadeOut ? 1 - prog(t, to - fadeOut, fadeOut, Easing.linear) : 1);
  return (
    <AbsoluteFill style={{opacity: o, transform: `scale(${1 + zoom * (t - from)})`, transformOrigin: '50% 50%'}}>{children}</AbsoluteFill>
  );
};

/* ---------- scenes ---------- */

const TitleCard: React.FC = () => {
  const t = useT();
  const word = 'LYING FOR VIEWS';
  const shown = Math.floor(interpolate(t, [1.36, 1.92], [0, word.length], clamp));
  return (
    <Scene from={0} to={3.04 - L}>
      <Img src={staticFile('hadi/hadi-point.svg')} style={{position: 'absolute', left: 100, bottom: 40, height: 860, transform: `translateX(${slideX(t, 0)}px)`}} />
      <Svg>
        <PopG at={0} cx={1250} cy={300}><Txt x={1250} y={380} text="#1" size={260} color={GOLD} /></PopG>
        <Txt x={1250} y={560} text={word.slice(0, shown)} size={110} color={RED} />
        <Draw d="M820,600 Q1250,650 1690,600" at={1.92} dur={0.3} color={RED} width={12} />
      </Svg>
    </Scene>
  );
};

const Feed: React.FC = () => {
  const t = useT();
  const rows: [string, string, number][] = [["You Won't Believe What", 'Happened… 😱', 3.04], ['He did THIS in the', 'masjid 😳', 3.3], ['The ENDING will', 'shock you…', 3.54]];
  const up = interpolate(t, [2.79, 3.1], [700, 0], {...clamp, easing: expoOut});
  const scroll = interpolate(t, [3.1, 4.6], [0, -60], clamp);
  return (
    <Scene from={3.04 - L} to={4.6 - L}>
      <Svg>
        <g transform={`translate(0 ${up})`}>
          <rect x={660} y={60} width={600} height={960} rx={60} fill="#fff" stroke={INK} strokeWidth={10} />
          <g transform={`translate(0 ${scroll})`}>
            {rows.map(([a, b, at], i) => t >= at && (
              <g key={i}>
                <rect x={700} y={130 + i * 290} width={520} height={160} rx={14} fill="#E9E9E9" />
                <text x={700} y={340 + i * 290} fontFamily={ROBOTO} fontWeight={700} fontSize={34}>{a}</text>
                <text x={700} y={380 + i * 290} fontFamily={ROBOTO} fontWeight={700} fontSize={34}>{b}</text>
              </g>
            ))}
          </g>
        </g>
      </Svg>
    </Scene>
  );
};

/** A clickbait title with coloured trick words and labelled callouts that draw on. */
const Breakdown: React.FC<{from: number; to: number; parts: {text: string; color?: string; at?: number}[]; callouts: {wx: number; wy: number; lx: number; ly: number; text: string; color: string; at: number; m: string}[]; enter: 'grow' | 'slide'}> = ({
  from, to, parts, callouts, enter,
}) => {
  const t = useT();
  const s = enter === 'grow' ? interpolate(t, [from, from + 0.3], [0.5, 1], {...clamp, easing: expoOut}) : 1;
  const dx = enter === 'slide' ? slideX(t, from) : 0;
  return (
    <Scene from={from} to={to}>
      <Svg>
        <g transform={`translate(${dx} 0) translate(960 450) scale(${s}) translate(-960 -450)`}>
          <rect x={260} y={380} width={1400} height={137} rx={16} fill="#F5F5F5" stroke="#ddd" strokeWidth={3} />
          <text x={300} y={470} fontFamily={ROBOTO} fontWeight={500} fontSize={72} fill="#0f0f0f">
            {parts.map((p, i) => (
              <tspan key={i} fill={p.color && t >= (p.at ?? 0) ? p.color : '#0f0f0f'} fontWeight={p.color && t >= (p.at ?? 0) ? 700 : 500}>{p.text}</tspan>
            ))}
          </text>
        </g>
        {callouts.map((c, i) => {
          const sy = c.ly + (c.wy > c.ly ? 55 : -55);
          return (
            <g key={i}>
              <Draw d={`M${c.lx},${sy} Q${(c.lx + c.wx) / 2 + 60},${(c.ly + c.wy) / 2} ${c.wx},${c.wy}`} at={c.at - L} color={c.color} marker={c.m} />
              <Pill cx={c.lx} cy={c.ly} w={520} text={c.text} color={c.color} at={c.at} />
            </g>
          );
        })}
      </Svg>
    </Scene>
  );
};

const Tree: React.FC = () => {
  const t = useT();
  const tap = t >= 9.22 && t < 9.36 ? 0.85 : 1;
  return (
    <Scene from={8.88 - L} to={15.24} fadeOut={0.3} zoom={0.005}>
      <Svg>
        <Node x={40} y={450} w={470} h={180} text="THE TITLE" icon="📰" at={8.63} size={58} />
        <Draw d="M520,540 L610,540" at={8.75} marker="ah" />
        <Node x={620} y={450} w={400} h={180} text="CLICK" icon="👆" at={9.22} size={62} />
        <Draw d="M1030,540 C1150,540 1030,200 1150,200" at={10.0} color={GREY} marker="ahg" />
        <Node x={1160} y={110} w={720} h={180} text="What you expected" at={10.25} stroke={GREY} color={GREY} dash size={56} />
        <Draw d="M1030,540 L1150,540" at={10.48 - L} marker="ah" />
        <Node x={1160} y={450} w={720} h={180} text="NOTHING happens" at={10.48} fill="#FFF6CC" size={62} />
        <Draw d="M1030,540 C1150,540 1030,880 1150,880" at={12.18 - L} color={RED} marker="ahr" />
        <Node x={1160} y={790} w={720} h={180} text="A MADE-UP story" at={14.04} fill="#FFE3E1" stroke={RED} color={RED} size={62} />
        <Pill cx={1730} cy={778} w={280} text="= A LIE" color={RED} at={14.3} anim="stamp" size={54} />
      </Svg>
      {t >= 8.9 && t < 9.6 && (
        <Img src={staticFile('hook/cursor.svg')} style={{position: 'absolute', left: 860, top: 560, width: 70, transform: `scale(${tap})`, transformOrigin: 'top left'}} />
      )}
    </Scene>
  );
};

const HadithCard: React.FC<{from: number; to: number; lead: string; leadAt: number; ar: string; arAt: number; phrases: [string, number, number][]; src: string}> = ({
  from, to, lead, leadAt, ar, arAt, phrases, src,
}) => {
  const t = useT();
  const arO = prog(t, arAt, 0.4, Easing.linear);
  return (
    <Scene from={from} to={to} fadeIn={0.4} fadeOut={0.27} zoom={0.006}>
      <div style={{position: 'absolute', left: 260, top: 120, width: 1400, height: 840, background: '#fff', border: '3px solid #ddd', borderRadius: 10, boxShadow: '0 10px 30px rgba(0,0,0,.12)', padding: '60px 80px'}}>
        <div style={{fontFamily: NUN, fontWeight: 900, fontSize: 44, color: '#1E7B4F', textAlign: 'center', opacity: t >= leadAt ? 1 : 0}}>{lead}</div>
        <div style={{opacity: arO}}>
          <div style={{fontFamily: AMIRI, fontWeight: 700, fontSize: 70, direction: 'rtl', textAlign: 'center', lineHeight: 1.7, marginTop: 30, color: '#111'}}>{ar}</div>
          <div style={{fontFamily: NUN, fontWeight: 800, fontSize: 50, textAlign: 'center', marginTop: 36, lineHeight: 1.45, color: '#222'}}>
            “{phrases.map(([p, a, b], i) => (
              <span key={i} style={{background: t >= a && t < b ? 'rgba(46,204,64,.3)' : 'transparent', borderRadius: 6, padding: '0 6px'}}>{p} </span>
            ))}”
          </div>
        </div>
        <div style={{position: 'absolute', bottom: 50, left: 80, right: 80, textAlign: 'center', fontFamily: NUN, fontWeight: 800, fontSize: 32, color: '#666', opacity: arO}}>{src}</div>
      </div>
    </Scene>
  );
};

const Compare: React.FC = () => {
  const t = useT();
  const total = 108;
  const shown = Math.round(interpolate(t, [33.28, 34.0], [0, total], clamp));
  const red = t >= 34.0;
  const count = Math.round(interpolate(t, [33.28, 34.0], [0, 1000000], {...clamp, easing: Easing.out(Easing.cubic)}));
  const vx = slideX(t, 32.34 - L, 700);
  return (
    <Scene from={29.38 - L} to={34.98 - L} zoom={0.006}>
      <Svg>
        <Draw d="M960,120 L960,980" at={29.13} dur={0.3} color="#ddd" width={6} />
        <Txt x={480} y={170} text="A lie to make people laugh" size={52} at={29.38} />
        <PopG at={29.38} cx={480} cy={400}><Person x={480} y={420} s={2.4} /></PopG>
        <Draw d="M530,360 L700,300" at={29.6} marker="ah" />
        <Draw d="M530,400 L720,420" at={29.8} marker="ah" />
        <Draw d="M530,440 L700,540" at={30.0} marker="ah" />
        <PopG at={30.44} cx={770} cy={430}>
          <Person x={760} y={300} s={1.4} c={GREY} /><Person x={780} y={430} s={1.4} c={GREY} /><Person x={760} y={560} s={1.4} c={GREY} />
        </PopG>
        <Txt x={480} y={720} text="a few people" size={48} color={GREY} at={30.44} />
        <Pill cx={480} cy={855} w={360} text="WOE × 3" color={RED} at={31.26} anim="stamp" size={58} />
        {t >= 32.34 - L && (
          <g transform={`translate(${vx} 0)`}>
            <Txt x={1440} y={170} text="A lie to get views" size={52} />
            <rect x={1060} y={290} width={240} height={140} rx={14} fill="#111" />
            <path d="M1160,330 L1210,360 L1160,390 Z" fill="#fff" />
          </g>
        )}
        <Draw d="M1310,360 L1420,360" at={32.44} marker="ah" />
        {Array.from({length: shown}, (_, i) => (
          <Person key={i} x={1450 + (i % 12) * 36} y={260 + Math.floor(i / 12) * 52} s={0.55} c={red ? RED : GREY} />
        ))}
        {t >= 33.28 && <Txt x={1560} y={790} text={`${count.toLocaleString('en-US')} people misled`} size={48} color={red ? RED : GREY} />}
        <Pill cx={1560} cy={895} w={600} text="Then how much worse?" color={INK} at={34.0} size={46} />
      </Svg>
    </Scene>
  );
};

const Gates: React.FC = () => {
  const t = useT();
  const g: [string, string, number][] = [['Exciting?', '🤩', 37.34], ['Curious?', '🧐', 38.8], ['TRUE?', '✅', 40.62]];
  const enter = slideX(t, 35.38 - L, 900);
  return (
    <Scene from={34.98 - L} to={41.54 - L} zoom={0.006}>
      <Svg>
        <PopG at={35.14} cx={960} cy={200}><Txt x={960} y={230} text="THE FIX" size={110} color={GREEN} /></PopG>
        <g transform={`translate(${t >= 35.38 - L ? enter : 2000} 0)`}>
          <rect x={60} y={470} width={300} height={140} rx={22} fill="#fff" stroke={INK} strokeWidth={7} />
          <text x={210} y={556} textAnchor="middle" fontFamily={POP} fontWeight={900} fontSize={46}>Your title</text>
          {g.map(([label, icon, at], i) => {
            const x = 470 + i * 430, on = t >= at, last = i === 2;
            const grow = last && on ? interpolate(t, [at, at + 0.15], [1, 1.1], clamp) : 1;
            return (
              <g key={i} transform={`translate(${x + 160} 540) scale(${grow}) translate(${-(x + 160)} -540)`}>
                <path d={`M${370 + i * 430},540 L${460 + i * 430},540`} stroke={on ? INK : '#ccc'} strokeWidth={8} markerEnd="url(#ah)" />
                <rect x={x} y={last ? 400 : 430} width={320} height={last ? 280 : 220} rx={26} fill={on ? (last ? '#E3F7E8' : '#fff') : '#F4F4F4'} stroke={on ? (last ? GREEN : INK) : '#ccc'} strokeWidth={last ? 12 : 7} />
                <text x={x + 160} y={510} textAnchor="middle" fontSize={70} opacity={on ? 1 : 0.35}>{icon}</text>
                <text x={x + 160} y={600} textAnchor="middle" fontFamily={POP} fontWeight={900} fontSize={last ? 60 : 50} fill={on ? (last ? GREEN : INK) : '#bbb'}>{label}</text>
                <PopG at={at} cx={x + 300} cy={last ? 410 : 440}>
                  <circle cx={x + 300} cy={last ? 410 : 440} r={42} fill={GREEN} />
                  <text x={x + 300} y={last ? 432 : 462} textAnchor="middle" fontFamily={POP} fontWeight={900} fontSize={60} fill="#fff">✓</text>
                </PopG>
              </g>
            );
          })}
        </g>
        <Txt x={1450} y={830} text="Only the last gate is non-negotiable" size={46} color={GREEN} at={40.95} />
      </Svg>
    </Scene>
  );
};

const Bars: React.FC = () => {
  const t = useT();
  const fixed = t >= 44.98;
  const deliver = interpolate(t, [42.52 - L, 42.8], [0, 560], {...clamp, easing: expoOut});
  const promiseGrow = interpolate(t, [43.42 - L, 43.7], [0, 1420], {...clamp, easing: expoOut});
  const promise = fixed ? interpolate(t, [44.98, 45.3], [1420, 560], {...clamp, easing: expoOut}) : promiseGrow;
  const strike = prog(t, 44.62, 0.25);
  const newChars = Math.floor(interpolate(t, [44.75, 45.1], [0, 26], clamp));
  const newTitle = 'What I Found in Killarney 🎯';
  return (
    <Scene from={41.54 - L} to={P1_DURATION_S} zoom={0.008}>
      <Svg>
        <Txt x={960} y={160} text={fixed ? 'Promise = Delivery ✓' : 'Promise vs Delivery'} size={80} color={fixed ? GREEN : INK} at={41.54 - L} />
        <Txt x={250} y={380} text="Title promises" size={48} anchor="start" at={41.54 - L} />
        <rect x={250} y={410} width={promise} height={110} rx={20} fill={fixed ? GREEN : GOLD} />
        <Txt x={250} y={650} text="Video delivers" size={48} anchor="start" at={41.54 - L} />
        <rect x={250} y={680} width={deliver} height={110} rx={20} fill={GREEN} />
        {t >= 43.7 && !fixed && (
          <>
            <rect x={810} y={680} width={860} height={110} rx={20} fill="none" stroke={RED} strokeWidth={7} strokeDasharray="24 16" />
            <PopG at={43.7} cx={1240} cy={735}><Txt x={1240} y={755} text="THE GAP = A LIE" size={56} color={RED} /></PopG>
          </>
        )}
        {t >= 44.62 - L && (
          <g>
            <rect x={900} y={410} width={900} height={88} rx={16} fill="#F5F5F5" stroke="#ddd" strokeWidth={3} />
            <text x={940} y={470} fontFamily={ROBOTO} fontWeight={500} fontSize={46} fill="#999">You Won't Believe What Happened…</text>
            <line x1={930} y1={455} x2={930 + 760 * strike} y2={455} stroke={RED} strokeWidth={6} />
            <rect x={900} y={680} width={900} height={88} rx={16} fill="#F5F5F5" stroke="#ddd" strokeWidth={3} />
            <text x={940} y={740} fontFamily={ROBOTO} fontWeight={700} fontSize={46} fill="#0f0f0f">{Array.from(newTitle).slice(0, newChars).join('')}</text>
          </g>
        )}
      </Svg>
    </Scene>
  );
};

/* ---------- the section ---------- */

const AR1 = 'وَيْلٌ لِلَّذِي يُحَدِّثُ فَيَكْذِبُ لِيُضْحِكَ بِهِ الْقَوْمَ، وَيْلٌ لَهُ، وَيْلٌ لَهُ';
const AR2 = 'وَمَنْ غَشَّنَا فَلَيْسَ مِنَّا';

export const Point1: React.FC = () => {
  const t = useT();
  return (
    <AbsoluteFill style={{background: '#fff'}}>
      <Audio src={staticFile('audio/02-point1.mp3')} />
      <TitleCard />
      <Feed />
      <Breakdown
        from={4.6 - L} to={6.6 - L} enter="grow"
        parts={[{text: "You Won't "}, {text: 'BELIEVE', color: '#C0392B', at: 5.24}, {text: ' '}, {text: 'What', color: BLUE, at: 5.4}, {text: ' Happened… 😱'}]}
        callouts={[
          {wx: 820, wy: 370, lx: 640, ly: 190, text: 'EXAGGERATION', color: RED, at: 5.24, m: 'ahr'},
          {wx: 1070, wy: 535, lx: 1250, ly: 790, text: 'HIDES THE ANSWER', color: BLUE, at: 5.4, m: 'ahb'},
        ]}
      />
      <Breakdown
        from={6.6 - L} to={8.88 - L} enter="slide"
        parts={[{text: 'He did '}, {text: 'THIS', color: BLUE, at: 6.98}, {text: ' in the '}, {text: 'masjid', color: '#C0392B', at: 7.9}, {text: ' 😳'}]}
        callouts={[
          {wx: 640, wy: 370, lx: 560, ly: 190, text: 'MYSTERY WORD', color: BLUE, at: 6.98, m: 'ahb'},
          {wx: 1080, wy: 535, lx: 1250, ly: 790, text: 'EMOTIONAL TRIGGER', color: RED, at: 7.9, m: 'ahr'},
        ]}
      />
      <Tree />
      <HadithCard
        from={15.24} to={24.2} lead="The Prophet ﷺ said:" leadAt={15.24} ar={AR1} arAt={18.14 - L}
        phrases={[['Woe to the one who speaks and lies to make people laugh.', 18.14, 21.7], ['Woe to him, woe to him.', 21.7, 24.2]]}
        src="Sunan Abi Dawud 4990 · Jami' at-Tirmidhi 2315 · Grade: Hasan (Al-Albani)"
      />
      <HadithCard
        from={24.2} to={28.28 - L} lead="He ﷺ also said:" leadAt={24.2} ar={AR2} arAt={25.66 - L}
        phrases={[['Whoever cheats us', 25.66, 26.44], ['is not one of us.', 26.44, 28.1]]}
        src="Sahih Muslim 101 · Grade: Sahih"
      />
      {t >= 28.28 - L && t < 29.38 - L && (
        <Scene from={28.28 - L} to={29.38 - L}>
          <Img src={staticFile('hadi/hadi-think.svg')} style={{position: 'absolute', left: 760, bottom: 40, height: 860, transform: `translateX(${slideX(t, 28.28 - L)}px)`}} />
        </Scene>
      )}
      <Compare />
      <Gates />
      <Bars />
    </AbsoluteFill>
  );
};
