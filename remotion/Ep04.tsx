/* Ep04 "Delaying Salah": opening preview (board v3 frames 1-5). Timings are estimates until the v2 voiceover is recorded. */
import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Easing, Img, continueRender, delayRender, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {loadFont as loadHand} from '@remotion/google-fonts/PatrickHand';
import {AMIRI, COMIC, NUN, POP, In, Draw, clamp, prog, useVT} from './kit';

const HAND = loadHand('normal', {weights: ['400'], subsets: ['latin']}).fontFamily;
export const EP04_FPS = 30;
export const EP04_DURATION_S = 34;

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
  <Img src={f(`hadi/${pose}.svg`)} style={{height: h, display: 'block', filter: 'brightness(0)', opacity: 0.88, transform: flip ? 'scaleX(-1)' : undefined}} />
);
const Hadi: React.FC<{pose: string; h: number; flip?: boolean}> = ({pose, h, flip}) => (
  <Img src={f(`hadi/${pose}.svg`)} style={{height: h, display: 'block', transform: flip ? 'scaleX(-1)' : undefined, filter: 'drop-shadow(0 14px 16px rgba(0,0,0,.3))'}} />
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

/** Temporary on-screen narration so the preview can be followed without the voiceover. */
const LINES: [number, number, string][] = [
  [0.2, 2.0, "It's 1:30. Your phone buzzes."], [2.0, 3.4, 'Dhuhr just came in.'], [3.4, 5.2, "And you're stuck in class."],
  [5.2, 7.6, 'So you do what millions of Muslims do every single day.'], [7.6, 11.0, "You tell yourself, I'll pray when I get home."],
  [11.0, 14.2, 'But by the time you get home, Dhuhr is gone.'],
  [14.2, 16.4, 'Most Muslims think this is completely fine.'], [16.4, 18.8, 'As long as you pray it later, it counts the same.'],
  [18.8, 19.6, 'Wrong.'], [19.6, 22.0, 'And the reason why will change the way you look at every single prayer.'],
  [22.0, 25.4, 'The Prophet, sallallahu alayhi wa sallam, spoke about this directly,'], [25.4, 27.4, "and it's recorded in Sahih Bukhari and Sahih Muslim."],
  [27.4, 30.2, "So in the next few minutes, I'll show you exactly what Islam says about delaying your salah,"],
  [30.2, 31.8, "the one situation where you're actually allowed to,"], [31.8, 34, 'and four simple things you can do at school or at work.'],
];
const TempSubs: React.FC = () => {
  const vt = useVT();
  const l = LINES.find(([a, b]) => vt >= a && vt < b);
  return (
    <>
      <div style={{position: 'absolute', left: 24, bottom: 110, fontFamily: NUN, fontWeight: 900, fontSize: 22, color: '#fff', background: 'rgba(0,0,0,.55)', padding: '4px 12px', borderRadius: 8}}>PREVIEW · temp text instead of voiceover</div>
      {l && <div style={{position: 'absolute', left: 0, right: 0, bottom: 34, textAlign: 'center'}}><span style={{fontFamily: NUN, fontWeight: 800, fontSize: 38, color: '#fff', background: 'rgba(0,0,0,.72)', padding: '8px 22px', borderRadius: 10}}>{l[2]}</span></div>}
    </>
  );
};

/* ---------- the opening ---------- */
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

export const Ep04: React.FC<{audit?: boolean}> = ({audit}) => {
  return (
    <AbsoluteFill style={{background: '#fff'}}>
      {/* 1 · classroom, push-in on the clock */}
      <Shot from={0} to={5.2} zoom={0.1} ox={1300} oy={250} over={<><Cap text="It's 1:30." at={0.15} to={2.0} cx={620} /><Cap text="Dhuhr just came in." at={2.0} to={3.4} cx={620} /><Cap text="Stuck in class." at={3.4} cx={620} /></>}>
        <Bg name="classroom" />
        <Notif at={1.2} />
        <In at={0} kind="cut" x={1180} y={310}><Hadi pose="sit-phone" h={700} /></In>
      </Shot>

      {/* 2 · station, no Hadi, "later" thoughts pop */}
      <Shot from={5.2} to={11} zoom={0.12} panX={120} ox={960} oy={540} over={<><Cap text="Millions of Muslims" at={5.3} dur={0.8} to={9.8} /><Cap text="I'll pray when I get home." at={9.8} dur={0.7} /></>}>
        <Bg name="station" />
        <In at={6.0} kind="pop" x={1380} y={340}><Cloud text={"after\nwork"} w={320} h={190} size={40} /></In>
        <In at={7.0} kind="pop" x={820} y={260}><Cloud text={"I'll pray\nlater"} w={330} h={200} size={40} /></In>
        <In at={8.6} kind="pop" x={330} y={300}><Cloud text={"I'll pray\nat home"} w={400} h={240} /></In>
      </Shot>

      {/* 3 · bedroom at night, heavy-moment text */}
      <Shot from={11} to={14.2} zoom={0.08} ox={960} oy={900} over={<Cap text="By the time you get home…" at={11.05} dur={0.8} />}>
        <Bg name="bedroom" dim={0.25} />
        <In at={11.2} kind="pop" x={1380} y={170}><div style={{background: 'rgba(0,0,0,.7)', color: '#FF6B6B', fontFamily: POP, fontWeight: 900, fontSize: 80, padding: '8px 30px', borderRadius: 16}}>6:30 PM</div></In>
        <In at={12.5} kind="fade" x={0} y={420} w={1920}><div style={{textAlign: 'center', fontFamily: COMIC, fontStyle: 'italic', fontWeight: 700, fontSize: 120, color: '#fff', textTransform: 'uppercase', textShadow: '0 6px 24px rgba(0,0,0,.6)'}}>Dhuhr is gone.</div></In>
      </Shot>

      {/* 4 · whiteboard A: the myth */}
      <Shot from={14.2} to={22} shakeAt={18.9}>
        <In at={14.3} kind="pop" x={60} y={110}><Num n={1} /></In>
        <In at={14.3} kind="pop" x={130} y={106}><Yel t="Most Muslims think" /></In>
        <In at={15.0} kind="pop" x={120} y={220}><Sil pose="walk1" h={270} /></In>
        <In at={15.15} kind="pop" x={275} y={220}><Sil pose="walk-phone" h={270} /></In>
        <In at={15.3} kind="pop" x={430} y={220}><Sil pose="carry-bag" h={270} /></In>
        <In at={15.45} kind="pop" x={585} y={220}><Sil pose="walk1" h={270} flip /></In>
        <In at={15.9} kind="pop" x={850} y={330}><PillB t="completely fine ✓" c={GRN} /></In>
        <In at={16.5} kind="pop" x={140} y={560}><Photo src="pray-rug" w={260} h={300} badge="6:30 PM" badgeColor="#FF6B6B" /></In>
        <In at={16.7} kind="fade" x={150} y={875}><Label t="pray it later" size={56} /></In>
        <Draw d="M440,700 C520,640 600,640 670,700" at={17.3} arrow />
        <In at={17.3} kind="pop" x={525} y={575}><Num n={2} /></In>
        <In at={17.8} kind="pop" x={700} y={570}><Photo src="pray-field" w={300} h={280} pos="center 60%" bright={1.6} badge="1:30 PM" badgeColor="#7CFFB0" /></In>
        <In at={18.0} kind="pop" x={700} y={880}><PillB t="counts the same" c={GRN} /></In>
        <In at={18.85} kind="stamp" x={1110} y={660} rot={-12}><div style={{fontFamily: POP, fontWeight: 900, fontSize: 70, color: RED, border: `9px solid ${RED}`, borderRadius: 16, padding: '4px 30px', background: 'rgba(255,255,255,.8)'}}>WRONG</div></In>
        <In at={18.85} kind="pop" x={1080} y={570}><Num n={3} /></In>
        <In at={19.2} kind="slide" x={1500} y={330}><Hadi pose="shrug" h={540} /></In>
        <In at={20.2} kind="pop" x={1040} y={472}><Num n={4} /></In>
        <In at={20.2} kind="fade" x={1105} y={462}><Label t="it changes everything" size={52} /></In>
      </Shot>

      {/* 5 · whiteboard B: authority + roadmap, slow zoom out as it fills */}
      <Shot from={22} to={34} zoom={-0.05} ox={960} oy={540}>
        <In at={22.2} kind="slideL" x={130} y={600}><Hadi pose="point-left" h={430} flip /></In>
        <In at={22.4} kind="pop" x={60} y={92}><Num n={1} /></In>
        <In at={22.4} kind="pop" x={130} y={86}><Yel t={<>The Prophet <span style={{fontFamily: AMIRI, fontWeight: 400}}>ﷺ</span></>} /></In>
        <In at={23.0} kind="pop" x={1120} y={50}><Photo src="nabawi" w={300} h={180} pos="center 70%" /></In>
        <In at={23.6} kind="fade" x={600} y={92}><Label t="spoke about this directly" size={56} /></In>
        <In at={25.4} kind="pop" x={60} y={262}><Num n={2} /></In>
        <In at={25.4} kind="pop" x={130} y={260}><Photo src="books-shelf" w={220} h={200} /></In>
        <In at={25.6} kind="fade" x={135} y={475}><Label t="Sahih Bukhari" size={48} /></In>
        <In at={26.4} kind="pop" x={390} y={260}><Photo src="books-shelf2" w={200} h={200} pos="center 30%" /></In>
        <In at={26.6} kind="fade" x={385} y={475}><Label t="Sahih Muslim" size={48} /></In>
        <Draw d="M630,380 C720,320 830,320 920,400" at={27.4} arrow />
        <In at={27.6} kind="pop" x={1000} y={290}><Yel t="In the next few minutes" size={46} /></In>
        <In at={28.6} kind="pop" x={950} y={402}><Num n={3} /></In>
        <In at={28.6} kind="pop" x={1020} y={395}><Photo src="quran-ms" w={190} h={200} /></In>
        <In at={28.8} kind="fade" x={990} y={610}><Label t="what Islam says" size={46} c={INK} /></In>
        <In at={30.2} kind="pop" x={1280} y={402}><Num n={4} /></In>
        <In at={30.2} kind="pop" x={1320} y={380}><Sil pose="raise-hand" h={230} /></In>
        <In at={30.4} kind="fade" x={1300} y={610}><Label t="the 1 exception" size={46} c={INK} /></In>
        <In at={31.8} kind="pop" x={1580} y={402}><Num n={5} /></In>
        <In at={31.8} kind="pop" x={1650} y={385}><div style={{fontFamily: POP, fontWeight: 900, fontSize: 130, color: RED, lineHeight: 1.25}}>x4</div></In>
        <In at={32.0} kind="fade" x={1640} y={610}><Label t="simple fixes" size={46} c={GRN} /></In>
      </Shot>

      <TempSubs />
      {audit && <Audit />}
    </AbsoluteFill>
  );
};
