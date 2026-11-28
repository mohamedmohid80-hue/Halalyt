/* Ep08 "Thousands of good deeds": opening preview (no voiceover yet; timings estimated at ~190 words/min). */
import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Easing, Img, continueRender, delayRender, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {loadFont as loadHand} from '@remotion/google-fonts/PatrickHand';
import {AMIRI, COMIC, NUN, POP, In, Draw, clamp, prog, useVT} from './kit';

const HAND = loadHand('normal', {weights: ['400'], subsets: ['latin']}).fontFamily;
export const EP08P_FPS = 30;
export const EP08P_DURATION_S = 53;

const RED = '#E31B1B', GRN = '#1FA34A', INK = '#151515';
const f = (p: string) => staticFile(`ep4/${p}`);

/* ---------- pieces ---------- */
const Bg: React.FC<{name: string; dim?: number}> = ({name, dim = 0}) => (
  <AbsoluteFill>
    <Img src={f(`bg-${name}.png`)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
    {dim > 0 && <AbsoluteFill style={{background: `rgba(10,5,30,${dim})`}} />}
  </AbsoluteFill>
);
const Icon: React.FC<{n: string; w: number}> = ({n, w}) => <Img src={f(`icons/${n}.png`)} style={{width: w, display: 'block'}} />;
/** Small real photo in a rounded white-bordered card, optionally with a dark time badge. */
const Photo: React.FC<{src: string; w: number; h: number; pos?: string; badge?: string; badgeColor?: string; bright?: number}> = ({src, w, h, pos = 'center', badge, badgeColor = '#fff', bright}) => (
  <div style={{position: 'relative', width: w, height: h, borderRadius: 18, overflow: 'hidden', border: '6px solid #fff', boxShadow: '0 12px 28px rgba(0,0,0,.28)'}}>
    <Img src={f(`photos/${src}.jpg`)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos, display: 'block', filter: bright ? `brightness(${bright}) contrast(1.1)` : undefined}} />
    {badge && <div style={{position: 'absolute', left: 10, top: 10, background: 'rgba(0,0,0,.75)', color: badgeColor, fontFamily: POP, fontWeight: 900, fontSize: 30, padding: '2px 14px', borderRadius: 10}}>{badge}</div>}
  </div>
);
/** A black silhouette person (any rig pose), like the reference videos' "a person" figures. */
const Sil: React.FC<{pose: string; h: number; flip?: boolean}> = ({pose, h, flip}) => (
  <Img src={staticFile(`ep4v/hadi/${pose}.svg`)} style={{height: h, display: 'block', filter: 'brightness(0)', opacity: 0.88, transform: flip ? 'scaleX(-1)' : undefined}} />
);
const Hadi: React.FC<{pose: string; h: number; flip?: boolean}> = ({pose, h, flip}) => (
  <Img src={staticFile(`ep4v/hadi/${pose}.svg`)} style={{height: h, display: 'block', transform: flip ? 'scaleX(-1)' : undefined, filter: 'drop-shadow(0 14px 16px rgba(0,0,0,.3))'}} />
);
/** Italic caps caption at the top that types on. */
const Cap: React.FC<{text: string; at: number; dur?: number; to?: number; cx?: number}> = ({text, at, dur = 0.6, to = 1e9, cx = 960}) => {
  const vt = useVT();
  if (vt < at || vt >= to) return null;
  const n = Math.floor(interpolate(vt, [at, at + dur], [0, text.length], clamp));
  return (
    <div style={{position: 'absolute', left: cx - 900, width: 1800, top: 34, textAlign: 'center', fontFamily: COMIC, fontStyle: 'italic', fontWeight: 700, fontSize: 66, color: '#111', textTransform: 'uppercase', textShadow: '0 0 12px #fff,0 0 4px #fff'}}>
      {text.slice(0, n)}<span style={{opacity: 0}}>{text.slice(n)}</span>
    </div>
  );
};
const Cloud: React.FC<{text: string; w: number; h: number; size?: number}> = ({text, w, h, size = 44}) => (
  <div style={{position: 'relative', width: w, height: h + 80}}>
    <div style={{width: w, height: h, background: '#fff', border: '6px solid #111', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontFamily: COMIC, fontStyle: 'italic', fontWeight: 700, fontSize: size, textTransform: 'uppercase', lineHeight: 1.15, whiteSpace: 'pre-line'}}>{text}</div>
    <div style={{position: 'absolute', left: w * 0.2, top: h + 6, width: 34, height: 34, borderRadius: '50%', background: '#fff', border: '5px solid #111'}} />
    <div style={{position: 'absolute', left: w * 0.12, top: h + 50, width: 20, height: 20, borderRadius: '50%', background: '#fff', border: '4px solid #111'}} />
  </div>
);
const Label: React.FC<{t: string; size?: number; c?: string}> = ({t, size = 64, c = RED}) => <div style={{fontFamily: HAND, fontSize: size, color: c, whiteSpace: 'nowrap'}}>{t}</div>;
const Yel: React.FC<{t: React.ReactNode; size?: number}> = ({t, size = 50}) => <div style={{background: '#FFE14D', fontFamily: NUN, fontWeight: 900, fontSize: size, padding: '6px 22px', whiteSpace: 'nowrap'}}>{t}</div>;
const PillB: React.FC<{t: string; c: string; size?: number}> = ({t, c, size = 44}) => <div style={{background: c, color: '#fff', fontFamily: NUN, fontWeight: 900, fontSize: size, padding: '8px 26px', borderRadius: 12, whiteSpace: 'nowrap'}}>{t}</div>;
const Num: React.FC<{n: number}> = ({n}) => <div style={{fontFamily: POP, fontWeight: 900, fontSize: 34, color: '#fff', background: INK, borderRadius: '50%', width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{n}</div>;

/** A hard-cut scene with an optional slow push-in toward (ox, oy). */
const Shot: React.FC<{from: number; to: number; zoom?: number; ox?: number; oy?: number; panX?: number; shakeAt?: number; over?: React.ReactNode; children: React.ReactNode}> = ({from, to, zoom = 0, ox = 960, oy = 540, panX = 0, shakeAt, over, children}) => {
  const vt = useVT();
  if (vt < from || vt >= to) return null;
  const k = prog(vt, from, to - from, Easing.inOut(Easing.quad));
  const sh = shakeAt !== undefined && vt >= shakeAt && vt < shakeAt + 0.3 ? Math.sin((vt - shakeAt) * 90) * 10 * (1 - (vt - shakeAt) / 0.3) : 0;
  return (
    <AbsoluteFill style={{background: '#fff', overflow: 'hidden'}}>
      <AbsoluteFill data-layer="1" style={{transform: `translate(${-panX * k + sh}px, 0) scale(${1 + zoom * k})`, transformOrigin: `${ox}px ${oy}px`}}>{children}</AbsoluteFill>
      <AbsoluteFill data-layer="1">{over}</AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Phone notification that drops in and buzzes. */
const Notif: React.FC<{at: number}> = ({at}) => {
  const vt = useVT();
  if (vt < at - 0.1) return null;
  const y = interpolate(vt, [at - 0.1, at + 0.3], [-160, 0], {...clamp, easing: Easing.out(Easing.back(1.6))});
  const buzz = vt < at + 0.9 ? Math.sin(vt * 120) * 5 * prog(vt, at + 0.2, 0.1) : 0;
  return (
    <div style={{position: 'absolute', left: 260, top: 300, width: 700, transform: `translate(${buzz}px, ${y}px)`, background: 'rgba(255,255,255,.97)', borderRadius: 28, padding: '22px 30px', boxShadow: '0 14px 30px rgba(0,0,0,.3)', display: 'flex', gap: 22, alignItems: 'center'}}>
      <div style={{width: 86, height: 86, borderRadius: 20, background: '#1E7B4F', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Icon n="crescent" w={62} /></div>
      <div style={{fontFamily: NUN, fontWeight: 800, fontSize: 36}}>Dhuhr has started · 1:30 PM</div>
    </div>
  );
};

/** Layout audit: with props {audit: true}, logs every on-screen element's box each frame (read by tools/audit_layout.py). */
const Audit: React.FC = () => {
  const frame = useCurrentFrame();
  const [h] = useState(() => delayRender('audit'));
  useEffect(() => {
    const id = delayRender(`audit-${frame}`);
    const t = setTimeout(() => {
      const items: object[] = [];
      document.querySelectorAll('[data-layer]').forEach((layer) => {
        for (const el of Array.from(layer.children)) {
          const svg = el.tagName.toLowerCase() === 'svg';
          let r = (svg ? el.querySelector(':scope > path') ?? el : el).getBoundingClientRect();
          if (!svg && r.width >= 1500) { const tw = document.createTreeWalker(el, NodeFilter.SHOW_TEXT); let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; for (let n = tw.nextNode(); n; n = tw.nextNode()) { const rg = document.createRange(); rg.selectNodeContents(n); const q = rg.getBoundingClientRect(); if (q.width) { x0 = Math.min(x0, q.left); y0 = Math.min(y0, q.top); x1 = Math.max(x1, q.right); y1 = Math.max(y1, q.bottom); } } if (x1 > x0) r = new DOMRect(x0, y0, x1 - x0, y1 - y0); }
          if (r.width >= 1900 && r.height >= 1000) continue;
          const src = el.querySelector('img')?.getAttribute('src') ?? '';
          const name = svg ? 'arrow' : src ? src.split('/').pop() : (el.textContent ?? '').slice(0, 30);
          const kind = svg ? 'arrow' : src.includes('/hadi/') ? 'hadi' : src.includes('/photos/') ? 'photo' : src ? 'icon' : 'text';
          items.push({name, kind, x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height)});
        }
      });
      document.querySelectorAll('[data-layer] *').forEach((n) => {
        const el = n as HTMLElement;
        if (!el.clientWidth || !el.textContent?.trim() || el.children.length > 1) return;
        const rg = document.createRange();
        rg.selectNodeContents(el);
        const t = rg.getBoundingClientRect(), b = el.getBoundingClientRect();
        const round = getComputedStyle(el).borderRadius.includes('50%');
        const fsz = Math.max(...[el, ...Array.from(el.querySelectorAll('*'))].map((x) => parseFloat(getComputedStyle(x).fontSize) || 0));
        const v = Math.max(2, fsz * 0.15);
        const spill = round
          ? t.width > b.width * 0.82 || t.height > b.height * 0.95 // text must sit inside the oval, not just the box
          : t.left < b.left - 2 || t.right > b.right + 2 || t.top < b.top - v || t.bottom > b.bottom + v; // a font's ascent/descent may exceed a tight line-height without any visible spill
        if (spill)
          items.push({name: el.textContent.slice(0, 30), kind: 'spill', x: Math.round(t.left - b.left), y: Math.round(t.top - b.top), w: Math.round(t.width - b.width), h: Math.round(t.height - b.height)});
      });
      console.log(`AUDIT ${frame} ${JSON.stringify(items)}`);
      continueRender(id);
    }, 60);
    return () => clearTimeout(t);
  }, [frame]);
  useEffect(() => continueRender(h), [h]);
  return null;
};


const LINES: [number, number, string][] = [
  [0, 7.0, 'The Prophet, sallallahu alayhi wa sallam, once asked his Companions, is any one of you unable to earn a thousand good deeds every day?'],
  [7.0, 8.6, 'A thousand. Every day.'], [8.6, 10.8, "And he wasn't talking about something hard."],
  [10.8, 15.0, 'Just doing seven simple acts can earn you thousands of good deeds every day.'],
  [15.0, 17.0, "And it's not only about the good deeds."], [17.0, 19.6, 'Every one of these raises your status with Allah,'],
  [19.6, 20.8, 'wipes away your sins,'], [20.8, 24.0, 'and makes you a better Muslim, one small habit at a time.'],
  [24.0, 26.2, 'And all of them come from authentic hadith.'],
  [26.2, 28.8, 'First, you need to know how good deeds are counted.'],
  [28.8, 33.6, 'When you do a good deed, Allah writes it down as ten,'], [33.6, 36.8, 'and can multiply it up to seven hundred times, and even more.'],
  [36.8, 38.8, 'So no good deed is ever just one.'],
  [38.8, 41.6, 'Number one. SubhanAllah, one hundred times.'], [41.6, 44.4, 'This is the answer the Prophet gave to his own question.'],
  [44.4, 49.0, 'Glorify Allah one hundred times, and a thousand good deeds will be written for you, or a thousand sins wiped away.'],
  [49.0, 53, "That's a thousand good deeds in two minutes."],
];
const TempSubs: React.FC = () => {
  const vt = useVT();
  const l = LINES.find(([a, b]) => vt >= a && vt < b);
  return (
    <>
      <div style={{position: 'absolute', left: 24, top: 20, fontFamily: NUN, fontWeight: 900, fontSize: 22, color: '#fff', background: 'rgba(0,0,0,.55)', padding: '4px 12px', borderRadius: 8}}>PREVIEW · no voiceover yet</div>
      {l && <div style={{position: 'absolute', left: 0, right: 0, bottom: 40, textAlign: 'center'}}><span style={{display: 'inline-block', maxWidth: 1300, fontFamily: NUN, fontWeight: 800, fontSize: 30, color: '#fff', background: 'rgba(0,0,0,.72)', padding: '8px 22px', borderRadius: 10}}>{l[2]}</span></div>}
    </>
  );
};
const GOLD = '#E8A92E', BLUE = '#2F80ED';
const Big: React.FC<{t: string; c?: string; size?: number}> = ({t, c = INK, size = 160}) => <div style={{fontFamily: POP, fontWeight: 900, fontSize: size, color: c, lineHeight: 1.3, whiteSpace: 'nowrap', letterSpacing: -2}}>{t}</div>;
const Counter: React.FC<{to: number; a: number; b: number; c?: string; size?: number; suffix?: string}> = ({to, a, b, c = GOLD, size = 180, suffix = ''}) => {
  const vt = useVT();
  const n = Math.round(interpolate(vt, [a, b], [0, to], {...clamp, easing: Easing.out(Easing.cubic)}));
  return <Big t={n.toLocaleString('en-US') + suffix} c={c} size={size} />;
};
const Card: React.FC<{children: React.ReactNode; w: number}> = ({children, w}) => (
  <div style={{width: w, background: '#fff', border: '6px solid #1E7B4F', borderRadius: 24, padding: '34px 50px', textAlign: 'center', fontFamily: NUN, fontWeight: 900, fontSize: 60, lineHeight: 1.25, boxShadow: '0 14px 30px rgba(0,0,0,.12)'}}>{children}</div>
);
const Ref: React.FC<{t: string}> = ({t}) => <div style={{fontFamily: NUN, fontWeight: 800, fontSize: 30, color: '#777', whiteSpace: 'nowrap'}}>{t}</div>;
/** Tasbih: a ring of 33 beads that fill in as the count rises. */
const Tasbih: React.FC<{a: number; b: number; r?: number}> = ({a, b, r = 150}) => {
  const vt = useVT();
  const k = interpolate(vt, [a, b], [0, 1], clamp);
  const beads = 33;
  return (
    <svg width={2 * r + 60} height={2 * r + 120} viewBox={`${-r - 30} ${-r - 30} ${2 * r + 60} ${2 * r + 120}`}>
      <circle r={r} fill="none" stroke="#8B5E3C" strokeWidth={4} />
      {Array.from({length: beads}).map((_, i) => {
        const ang = (i / beads) * Math.PI * 2 - Math.PI / 2;
        const on = i / beads < k * 1.0001;
        return <circle key={i} cx={Math.cos(ang) * r} cy={Math.sin(ang) * r} r={13} fill={on ? '#1FA34A' : '#E6DED2'} stroke="#151515" strokeWidth={3} />;
      })}
      <path d={`M0,${r} L-16,${r + 50} L16,${r + 50} Z`} fill="#8B5E3C" stroke="#151515" strokeWidth={3} />
    </svg>
  );
};

export const Ep08Preview: React.FC<{audit?: boolean}> = ({audit}) => (
  <AbsoluteFill style={{background: '#fff'}}>
    {/* 1 · the question */}
    <Shot from={0} to={7.0} zoom={0.03}>
      <In at={0.1} kind="rise" x={260} y={150}><Card w={1400}>Is any one of you unable to earn <span style={{color: GOLD}}>a thousand good deeds</span> every day?</Card></In>
      <In at={1.6} kind="fade" x={830} y={420}><Ref t="Sahih Muslim 2698" /></In>
      <In at={2.4} kind="slideL" x={150} y={640}><Hadi pose="hadi-think" h={400} /></In>
      <In at={4.3} kind="pop" x={1180} y={700}><Yel t="a thousand?" size={56} /></In>
      <In at={5.7} kind="pop" x={1180} y={820}><Label t="every single day" size={56} c={RED} /></In>
    </Shot>
    {/* 2 · a thousand, every day */}
    <Shot from={7.0} to={10.8}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 240, display: 'flex', justifyContent: 'center'}}><Counter to={1000} a={7.0} b={8.0} /></div>
      <In at={7.9} kind="stamp" x={760} y={500}><PillB t="EVERY DAY" c={INK} size={60} /></In>
      <In at={9.2} kind="pop" x={680} y={680}><Label t="not something hard ✓" size={70} c={GRN} /></In>
    </Shot>
    {/* 3 · seven simple acts, and what they give you */}
    <Shot from={10.8} to={26.2}>
      <In at={10.9} kind="pop" x={110} y={80}><Yel t="7 simple acts" size={56} /></In>
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <In key={i} at={11.4 + i * 0.22} kind="pop" x={520 + i * 110} y={92}><Num n={i + 1} /></In>
      ))}
      <Draw d="M1330,120 C1420,120 1480,180 1500,240" at={13.2} arrow />
      <In at={13.6} kind="pop" x={1300} y={250}><Big t="1,000s" c={GOLD} size={120} /></In>
      <In at={14.2} kind="fade" x={1320} y={400}><Label t="of good deeds" size={56} c={INK} /></In>
      <In at={15.2} kind="pop" x={110} y={300}><PillB t="not only good deeds…" c="#9AA0A6" size={44} /></In>
      <In at={17.1} kind="pop" x={110} y={460}>
        <svg width={300} height={200}><path d="M10,190 H80 V140 H150 V90 H220 V40 H290" fill="none" stroke={BLUE} strokeWidth={14} strokeLinejoin="round" /><path d="M250,20 L290,40 L250,60" fill="none" stroke={BLUE} strokeWidth={12} strokeLinecap="round" /></svg>
      </In>
      <In at={17.4} kind="fade" x={110} y={680}><Label t="status raised" size={56} c={BLUE} /></In>
      <In at={19.7} kind="pop" x={560} y={500}>
        <div style={{fontFamily: HAND, fontSize: 52, color: '#999', lineHeight: 1.3}}>sin<br />sin<br />sin</div>
      </In>
      <Draw d="M540,540 L700,540 M540,610 L700,610 M540,680 L700,680" at={20.1} color={RED} width={10} />
      <In at={20.3} kind="fade" x={540} y={740}><Label t="sins wiped" size={56} c={RED} /></In>
      <In at={21.0} kind="slide" x={960} y={470}><Hadi pose="celebrate" h={440} /></In>
      <In at={21.8} kind="pop" x={1300} y={620}><PillB t="a better Muslim ✓" c={GRN} size={52} /></In>
      <In at={24.2} kind="stamp" x={1330} y={790} rot={-6}><div style={{fontFamily: POP, fontWeight: 900, fontSize: 46, color: '#1E7B4F', border: '7px solid #1E7B4F', borderRadius: 14, padding: '2px 22px', background: 'rgba(255,255,255,.85)'}}>AUTHENTIC HADITH</div></In>
    </Shot>
    {/* 4 · how good deeds are counted */}
    <Shot from={26.2} to={38.8}>
      <In at={26.3} kind="pop" x={110} y={80}><Yel t="how good deeds are counted" size={52} /></In>
      <In at={28.9} kind="pop" x={160} y={360}><div style={{border: '8px solid #151515', borderRadius: 24, padding: '30px 40px', fontFamily: POP, fontWeight: 900, fontSize: 70}}>1 deed</div></In>
      <Draw d="M560,430 C620,380 680,380 740,430" at={30.6} arrow />
      <In at={31.0} kind="stamp" x={770} y={330}><Big t="×10" c={GRN} size={170} /></In>
      <In at={32.3} kind="fade" x={790} y={560}><Label t="written as ten" size={52} c={GRN} /></In>
      <Draw d="M1110,430 C1170,380 1230,380 1290,430" at={33.8} arrow />
      <In at={34.2} kind="stamp" x={1320} y={330}><Big t="×700" c={GOLD} size={170} /></In>
      <In at={35.6} kind="fade" x={1420} y={560}><Label t="…and even more" size={60} c={INK} /></In>
      <In at={37.0} kind="slideL" x={150} y={620}><Hadi pose="point-up" h={400} /></In>
      <In at={37.2} kind="pop" x={540} y={760}><PillB t="never just one" c={RED} size={52} /></In>
      <In at={26.6} kind="fade" x={1180} y={950}><Ref t="Sahih al-Bukhari 6491 · Sahih Muslim 131" /></In>
    </Shot>
    {/* 5 · #1 SubhanAllah ×100 */}
    <Shot from={38.8} to={53}>
      <In at={38.9} kind="pop" x={60} y={86}><Num n={1} /></In>
      <In at={38.9} kind="pop" x={130} y={80}><Yel t="SubhanAllah ×100" size={56} /></In>
      <In at={40.3} kind="pop" x={720} y={86}><PillB t="every day" c={INK} size={40} /></In>
      <In at={41.7} kind="fade" x={110} y={190}><Label t="the answer to his question" size={52} c={INK} /></In>
      <In at={43.1} kind="pop" x={760} y={196}><Label t="↓ SubhanAllah" size={52} c={GRN} /></In>
      <In at={44.5} kind="pop" x={150} y={300}><Tasbih a={44.6} b={47.6} /></In>
      <In at={44.6} kind="fade" x={230} y={760}><Counter to={100} a={44.6} b={47.6} c={INK} size={90} /></In>
      <Draw d="M560,500 C660,430 760,430 860,490" at={47.8} arrow />
      <In at={48.0} kind="pop" x={900} y={380}><Counter to={1000} a={48.0} b={49.0} size={170} /></In>
      <In at={48.4} kind="fade" x={940} y={590}><Label t="good deeds" size={60} c={INK} /></In>
      <In at={48.9} kind="pop" x={940} y={690}><PillB t="or 1,000 sins wiped" c={RED} size={46} /></In>
      <In at={51.6} kind="pop" x={1450} y={300}><PillB t="1,000 in 2 min" c={GRN} size={44} /></In>
      <In at={50.2} kind="pop" x={1450} y={180}><div style={{fontFamily: POP, fontWeight: 900, fontSize: 64, color: BLUE}}>≈ 2 min</div></In>
      <In at={44.8} kind="fade" x={1530} y={950}><Ref t="Sahih Muslim 2698" /></In>
    </Shot>
    <TempSubs />
    {audit && <Audit />}
  </AbsoluteFill>
);
