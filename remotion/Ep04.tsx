/* Ep04 "Delaying Salah": opening preview (board v3 frames 1-5). Timings are estimates until the v2 voiceover is recorded. */
import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, staticFile} from 'remotion';
import {loadFont as loadHand} from '@remotion/google-fonts/PatrickHand';
import {COMIC, NUN, POP, In, Draw, clamp, prog, useVT} from './kit';

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
const Hadi: React.FC<{pose: string; h: number; flip?: boolean}> = ({pose, h, flip}) => (
  <Img src={f(`hadi/${pose}.svg`)} style={{height: h, display: 'block', transform: flip ? 'scaleX(-1)' : undefined, filter: 'drop-shadow(0 14px 16px rgba(0,0,0,.3))'}} />
);
/** Italic caps caption at the top that types on. */
const Cap: React.FC<{text: string; at: number; dur?: number}> = ({text, at, dur = 0.6}) => {
  const vt = useVT();
  const n = Math.floor(interpolate(vt, [at, at + dur], [0, text.length], clamp));
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 34, textAlign: 'center', fontFamily: COMIC, fontStyle: 'italic', fontWeight: 700, fontSize: 66, color: '#111', textTransform: 'uppercase', textShadow: '0 0 12px #fff,0 0 4px #fff'}}>
      {text.slice(0, n)}<span style={{opacity: 0}}>{text.slice(n)}</span>
    </div>
  );
};
const Cloud: React.FC<{text: string; w: number; h: number; size?: number}> = ({text, w, h, size = 44}) => (
  <div style={{position: 'relative', width: w, height: h + 80}}>
    <div style={{width: w, height: h, background: '#fff', border: '6px solid #111', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontFamily: COMIC, fontStyle: 'italic', fontWeight: 700, fontSize: size, textTransform: 'uppercase', lineHeight: 1.15}}>{text}</div>
    <div style={{position: 'absolute', left: w * 0.2, top: h + 6, width: 34, height: 34, borderRadius: '50%', background: '#fff', border: '5px solid #111'}} />
    <div style={{position: 'absolute', left: w * 0.12, top: h + 50, width: 20, height: 20, borderRadius: '50%', background: '#fff', border: '4px solid #111'}} />
  </div>
);
const Label: React.FC<{t: string; size?: number; c?: string}> = ({t, size = 64, c = RED}) => <div style={{fontFamily: HAND, fontSize: size, color: c, whiteSpace: 'nowrap'}}>{t}</div>;
const Yel: React.FC<{t: string; size?: number}> = ({t, size = 50}) => <div style={{background: '#FFE14D', fontFamily: NUN, fontWeight: 900, fontSize: size, padding: '6px 22px', whiteSpace: 'nowrap'}}>{t}</div>;
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
      <AbsoluteFill style={{transform: `translate(${-panX * k + sh}px, 0) scale(${1 + zoom * k})`, transformOrigin: `${ox}px ${oy}px`}}>{children}</AbsoluteFill>
      {over}
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
    <div style={{position: 'absolute', left: 1130, top: 150, width: 700, transform: `translate(${buzz}px, ${y}px)`, background: 'rgba(255,255,255,.97)', borderRadius: 28, padding: '22px 30px', boxShadow: '0 14px 30px rgba(0,0,0,.3)', display: 'flex', gap: 22, alignItems: 'center'}}>
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
export const Ep04: React.FC = () => {
  return (
    <AbsoluteFill style={{background: '#fff'}}>
      {/* 1 · classroom, push-in on the clock */}
      <Shot from={0} to={5.2} zoom={0.1} ox={1300} oy={250} over={<Cap text="It's 1:30." at={0.15} />}>
        <Bg name="classroom" />
        <Notif at={1.2} />
        <In at={0} kind="cut" x={1180} y={330}><Hadi pose="sit-phone" h={700} /></In>
      </Shot>

      {/* 2 · station, no Hadi, "later" thoughts pop */}
      <Shot from={5.2} to={11} zoom={0.12} panX={120} ox={960} oy={540} over={<Cap text="Millions of Muslims" at={5.3} dur={0.8} />}>
        <Bg name="station" />
        <In at={6.4} kind="pop" x={240} y={320}><Cloud text="I'll pray at home" w={380} h={230} /></In>
        <In at={7.4} kind="pop" x={820} y={260}><Cloud text="I'll pray later" w={330} h={200} size={40} /></In>
        <In at={8.4} kind="pop" x={1380} y={340}><Cloud text="after work" w={320} h={190} size={40} /></In>
      </Shot>

      {/* 3 · bedroom at night, heavy-moment text */}
      <Shot from={11} to={14.2} zoom={0.08} ox={960} oy={900} over={<Cap text="By the time you get home…" at={11.05} dur={0.8} />}>
        <Bg name="bedroom" dim={0.25} />
        <In at={11.2} kind="pop" x={1480} y={150}><div style={{background: 'rgba(0,0,0,.7)', color: '#FF6B6B', fontFamily: POP, fontWeight: 900, fontSize: 80, padding: '8px 30px', borderRadius: 16}}>6:30 PM</div></In>
        <In at={12.5} kind="fade" x={0} y={420} w={1920}><div style={{textAlign: 'center', fontFamily: COMIC, fontStyle: 'italic', fontWeight: 700, fontSize: 120, color: '#fff', textTransform: 'uppercase', textShadow: '0 6px 24px rgba(0,0,0,.6)'}}>Dhuhr is gone.</div></In>
      </Shot>

      {/* 4 · whiteboard A: the myth */}
      <Shot from={14.2} to={22} shakeAt={18.9}>
        <In at={14.3} kind="pop" x={60} y={110}><Num n={1} /></In>
        <In at={14.3} kind="pop" x={130} y={106}><Yel t="Most Muslims think" /></In>
        <In at={15.0} kind="pop" x={160} y={300}><Icon n="clock" w={200} /></In>
        <In at={16.6} kind="pop" x={150} y={520}><Label t="pray it later" size={60} c={INK} /></In>
        <Draw d="M380,400 C480,330 560,330 640,400" at={17.3} arrow />
        <In at={17.3} kind="pop" x={500} y={300}><Num n={2} /></In>
        <In at={17.8} kind="pop" x={660} y={320}><Icon n="check" w={180} /></In>
        <In at={18.0} kind="pop" x={600} y={540}><PillB t="counts the same" c={GRN} /></In>
        <In at={18.85} kind="stamp" x={1160} y={330} rot={-12}><div style={{fontFamily: POP, fontWeight: 900, fontSize: 58, color: RED, border: `8px solid ${RED}`, borderRadius: 16, padding: '4px 26px', background: 'rgba(255,255,255,.7)'}}>WRONG</div></In>
        <In at={18.85} kind="pop" x={1100} y={280}><Num n={3} /></In>
        <In at={19.2} kind="slide" x={1500} y={380}><Hadi pose="shrug" h={560} /></In>
        <In at={20.2} kind="pop" x={1060} y={820}><Num n={4} /></In>
        <In at={20.2} kind="fade" x={1130} y={810}><Label t="it changes everything" size={58} /></In>
      </Shot>

      {/* 5 · whiteboard B: authority + roadmap, slow zoom out as it fills */}
      <Shot from={22} to={34} zoom={-0.06} ox={960} oy={540}>
        <In at={22.2} kind="slideL" x={120} y={560}><Hadi pose="point-left" h={480} flip /></In>
        <In at={25.6} kind="pop" x={60} y={120}><Num n={1} /></In>
        <In at={25.6} kind="pop" x={120} y={170}><Icon n="books" w={190} /></In>
        <In at={25.8} kind="fade" x={80} y={380}><Label t="Sahih Bukhari" size={52} /></In>
        <In at={26.6} kind="pop" x={380} y={120}><Num n={2} /></In>
        <In at={26.6} kind="pop" x={440} y={190}><Icon n="book" w={170} /></In>
        <In at={26.8} kind="fade" x={380} y={380}><Label t="Sahih Muslim" size={52} /></In>
        <Draw d="M720,320 C820,260 900,260 980,320" at={27.5} arrow />
        <In at={27.7} kind="pop" x={980} y={150}><Yel t="In the next few minutes" size={46} /></In>
        <In at={28.8} kind="pop" x={930} y={290}><Num n={3} /></In>
        <In at={28.8} kind="pop" x={1000} y={300}><Icon n="scroll" w={150} /></In>
        <In at={29.0} kind="fade" x={960} y={470}><Label t="what Islam says" size={48} c={INK} /></In>
        <In at={30.3} kind="pop" x={1250} y={290}><Num n={4} /></In>
        <In at={30.3} kind="pop" x={1320} y={300}><Icon n="shield" w={150} /></In>
        <In at={30.5} kind="fade" x={1280} y={470}><Label t="the 1 exception" size={48} c={INK} /></In>
        <In at={32.0} kind="pop" x={1555} y={290}><Num n={5} /></In>
        <In at={32.0} kind="pop" x={1620} y={300}><Icon n="check" w={150} /></In>
        <In at={32.2} kind="fade" x={1630} y={470}><Label t="4 fixes" size={48} c={GRN} /></In>
      </Shot>

      <TempSubs />
    </AbsoluteFill>
  );
};
