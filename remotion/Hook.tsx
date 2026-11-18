import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {loadFont as loadPoppins} from '@remotion/google-fonts/Poppins';
import {loadFont as loadComic} from '@remotion/google-fonts/ComicNeue';

const {fontFamily: POPPINS} = loadPoppins('normal', {weights: ['900'], subsets: ['latin']});
const {fontFamily: COMIC} = loadComic('normal', {weights: ['700'], subsets: ['latin']});

export const HOOK_FPS = 30;
export const HOOK_DURATION_S = 33.2;

const H = (f: string) => staticFile(`hook/${f}`);
const HADI = (pose: string) => staticFile(`hadi/hadi-${pose}.svg`);

/* ---------- timing helpers (all in seconds of the voiceover) ---------- */

const useT = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return frame / fps;
};

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const expoOut = Easing.out(Easing.exp);

/** Measured from the references: lands in 0.25 s, ease-out, no bounce, then drifts 1.5% more over 0.3 s. */
const slideX = (t: number, at: number, from = 1300) =>
  interpolate(t, [at, at + 0.25], [from, 0], {...clamp, easing: expoOut}) +
  interpolate(t, [at + 0.25, at + 0.55], [0, -18], clamp);

const visible = (t: number, at: number) => (t >= at ? 1 : 0);

/** Quick pop: 30% -> 100% in 3 frames, ease-out. */
const popScale = (t: number, at: number) => interpolate(t, [at, at + 0.1], [0.3, 1], {...clamp, easing: Easing.out(Easing.quad)});

/** Stamp: from 400% down to 100% in 0.3 s, ease-in. */
const stampScale = (t: number, at: number) => interpolate(t, [at, at + 0.3], [4, 1], {...clamp, easing: Easing.in(Easing.quad)});

/* ---------- building blocks ---------- */

type Box = {x: number; y: number; w: number};

const Photo: React.FC<Box & {src: string; at: number; enter?: 'slide' | 'cut'; rot?: number; shadow?: boolean}> = ({
  src, x, y, w, at, enter = 'slide', rot = 0, shadow = true,
}) => {
  const t = useT();
  if (t < at) return null;
  const dx = enter === 'slide' ? slideX(t, at) : 0;
  return (
    <Img
      src={H(src)}
      style={{
        position: 'absolute', left: x, top: y, width: w,
        transform: `translateX(${dx}px) rotate(${rot}deg)`,
        boxShadow: shadow ? '0 10px 30px rgba(0,0,0,.25)' : undefined,
      }}
    />
  );
};

const Emoji: React.FC<Box & {src: string; at: number; enter?: 'slide' | 'cut' | 'pop'}> = ({src, x, y, w, at, enter = 'slide'}) => {
  const t = useT();
  if (t < at) return null;
  const dx = enter === 'slide' ? slideX(t, at) : 0;
  const s = enter === 'pop' ? popScale(t, at) : 1;
  return <Img src={H(src)} style={{position: 'absolute', left: x, top: y, width: w, transform: `translateX(${dx}px) scale(${s})`}} />;
};

const Hadi: React.FC<{pose: string; x: number; at: number; enter?: 'slide' | 'cut'; h?: number}> = ({pose, x, at, enter = 'cut', h = 860}) => {
  const t = useT();
  if (t < at) return null;
  const dx = enter === 'slide' ? slideX(t, at) : 0;
  return <Img src={HADI(pose)} style={{position: 'absolute', left: x, bottom: 40, height: h, transform: `translateX(${dx}px)`}} />;
};

const Sticker: React.FC<{text: string; color: string; x: number; y: number; size: number; at: number; rot?: number; anim?: 'pop' | 'stamp' | 'cut'}> = ({
  text, color, x, y, size, at, rot = 0, anim = 'pop',
}) => {
  const t = useT();
  if (t < at) return null;
  const s = anim === 'pop' ? popScale(t, at) : anim === 'stamp' ? stampScale(t, at) : 1;
  const o = anim === 'stamp' ? interpolate(t, [at, at + 0.08], [0, 1], clamp) : 1;
  return (
    <div
      style={{
        position: 'absolute', left: x, top: y, fontFamily: POPPINS, fontWeight: 900, fontSize: size, color,
        WebkitTextStroke: `${Math.round(size / 11)}px #111`, paintOrder: 'stroke fill', letterSpacing: -1,
        textShadow: '0 10px 18px rgba(0,0,0,.35)', whiteSpace: 'nowrap', opacity: o,
        transform: `rotate(${rot}deg) scale(${s})`, transformOrigin: 'center',
      }}
    >
      {text}
    </div>
  );
};

/** Plain line in the casual font; words appear on their spoken timestamps. */
const Line: React.FC<{words: [string, number][]; y: number}> = ({words, y}) => {
  const t = useT();
  return (
    <div style={{position: 'absolute', left: 0, width: 1920, top: y, textAlign: 'center', fontFamily: COMIC, fontWeight: 700, fontSize: 72, color: '#111'}}>
      {words.map(([w, at], i) => (
        <span key={i} style={{opacity: visible(t, at)}}>{w} </span>
      ))}
    </div>
  );
};

const MemeCaption: React.FC<{text: string; x: number; y: number; size: number; at: number}> = ({text, x, y, size, at}) => {
  const t = useT();
  if (t < at) return null;
  return (
    <div style={{position: 'absolute', left: x, top: y, fontFamily: POPPINS, fontWeight: 900, fontSize: size, color: '#fff', WebkitTextStroke: `${Math.round(size / 8)}px #111`, paintOrder: 'stroke fill', whiteSpace: 'nowrap'}}>
      {text}
    </div>
  );
};

/** Wraps a beat: shows it between `from` and `to`, with the constant slow zoom (2.5%/s) measured in the references. */
const Beat: React.FC<{from: number; to: number; zoom?: number; clip?: string; children: React.ReactNode}> = ({from, to, zoom = 0.025, clip, children}) => {
  const t = useT();
  if (t < from || t >= to) return null;
  const s = 1 + zoom * (t - from);
  return (
    <AbsoluteFill style={{clipPath: clip}}>
      <AbsoluteFill style={{transform: `scale(${s})`, transformOrigin: '50% 50%'}}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------- the hook ---------- */

export const Hook: React.FC = () => {
  const t = useT();

  // Beat boundaries: word timestamps from the voiceover (faster-whisper).
  const B = [0, 0.64, 2.26, 4.32, 4.64, 6.42, 8.8, 9.7, 10.6, 12.56, 16.68, 18.0, 19.52, 20.86, 22.5, 23.82, 24.64, 25.86, 29.48, 31.26, HOOK_DURATION_S];

  // Counter rolls between "watched" (28.06) and "times" (29.1).
  const views = Math.round(interpolate(t, [28.06, 29.1], [0, 12483], {...clamp, easing: Easing.out(Easing.cubic)}));

  // Red wipe at "Now" (19.52): sweeps right -> left in 0.35 s.
  const wipeX = interpolate(t, [19.52, 19.87], [1920, -800], clamp);

  // Cursor in the upload shot: glides to "Select files", clicks on "video" (2.98).
  const curX = interpolate(t, [2.4, 2.9], [1250, 975], {...clamp, easing: expoOut});
  const curY = interpolate(t, [2.4, 2.9], [900, 640], {...clamp, easing: expoOut});
  const curS = t >= 2.98 && t < 3.12 ? 0.82 : 1;

  return (
    <AbsoluteFill style={{background: '#fff'}}>
      <Audio src={staticFile('audio/01-hook.mp3')} />

      {/* 1  Be honest. */}
      <Beat from={B[0]} to={B[1]}><Hadi pose="phone" x={760} at={0} enter="slide" /></Beat>

      {/* 2  When was the last time */}
      <Beat from={B[1]} to={B[2]}><Emoji src="emoji-alarm.png" x={680} y={240} w={560} at={B[1]} /></Beat>

      {/* 3  you uploaded a video */}
      <Beat from={B[2]} to={B[3]}>
        <Photo src="yt-upload.png" x={410} y={60} w={1100} at={B[2]} />
        {t >= 2.4 && (
          <Img src={H('cursor.svg')} style={{position: 'absolute', left: curX, top: curY, width: 70, transform: `scale(${curS})`, transformOrigin: 'top left'}} />
        )}
      </Beat>

      {/* 4  and actually STOPPED */}
      <Beat from={B[3]} to={B[4]}><Emoji src="emoji-stop.png" x={680} y={240} w={560} at={B[3]} enter="cut" /></Beat>

      {/* 5  to ask, is this HALAL? */}
      <Beat from={B[4]} to={B[5]}>
        <Emoji src="emoji-thinking.png" x={330} y={300} w={480} at={B[4]} enter="cut" />
        <Sticker text="HALAL?" color="#2ECC40" x={900} y={400} size={210} rot={-3} at={5.88} />
      </Beat>

      {/* 6  Most of us check the TITLE */}
      <Beat from={B[5]} to={B[6]}>
        <Photo src="yt-title.png" x={210} y={480} w={1500} at={B[5]} shadow={false} />
        {t >= 7.94 && (
          <div style={{position: 'absolute', left: 205, top: 500, height: 95, width: interpolate(t, [7.94, 8.2], [0, 1505], clamp), background: 'rgba(255,214,0,.45)', mixBlendMode: 'multiply', borderRadius: 6}} />
        )}
        <Sticker text="TITLE" color="#FFD400" x={760} y={180} size={170} rot={-2} at={7.94} />
      </Beat>

      {/* 7  the THUMBNAIL (punch-in) */}
      <Beat from={B[6]} to={B[7]}>
        <Photo src="yt-thumb0.png" x={370} y={190} w={1180} at={B[6]} enter="cut" />
        <Sticker text="THUMBNAIL" color="#FFD400" x={520} y={40} size={140} rot={-2} at={B[6]} anim="cut" />
      </Beat>

      {/* 8  the VIEWS */}
      <Beat from={B[7]} to={B[8]}>
        <Photo src="yt-views.png" x={410} y={380} w={1100} at={B[7]} enter="cut" shadow={false} />
        <Emoji src="emoji-eyes.png" x={1450} y={640} w={300} at={9.76} enter="pop" />
      </Beat>

      {/* 9  But what if I told you */}
      <Beat from={B[8]} to={B[9]}><Photo src="meme-rollsafe.jpg" x={410} y={190} w={1100} at={B[8]} /></Beat>

      {/* 10-11  the most common things creators do on YouTube ... are actually HARAM */}
      <Beat from={B[9]} to={B[10]}>
        <Photo src="yt-thumb1.png" x={160} y={300} w={620} rot={-3} at={12.56} />
        <Photo src="yt-thumb2.png" x={650} y={260} w={620} rot={2} at={12.98} />
        <Photo src="yt-thumb3.png" x={1140} y={320} w={620} rot={-1} at={13.36} />
        <Emoji src="yt-logo.png" x={700} y={40} w={520} at={14.22} enter="cut" />
        <Sticker text="HARAM" color="#F03A2E" x={560} y={330} size={300} rot={-4} at={15.58} anim="stamp" />
      </Beat>

      {/* 12  and most people doing them */}
      <Beat from={B[10]} to={B[11]}><Emoji src="emoji-crowd.png" x={650} y={220} w={620} at={B[10]} /></Beat>

      {/* 13  have NO IDEA */}
      <Beat from={B[11]} to={19.9} clip={t >= 19.52 ? `inset(0 ${Math.max(0, 1920 - wipeX)}px 0 0)` : undefined}>
        <Emoji src="emoji-shrug.png" x={300} y={200} w={640} at={B[11]} enter="cut" />
        <Sticker text="NO IDEA" color="#FFD400" x={980} y={420} size={190} rot={-3} at={18.42} />
      </Beat>

      {/* 14  Now, I know what you're thinking (red wipe reveals Hadi) */}
      <Beat from={B[12]} to={B[13]} clip={t < 19.9 ? `inset(0 0 0 ${Math.max(0, wipeX + 800)}px)` : undefined}><Hadi pose="think" x={760} at={B[12]} /></Beat>

      {/* 15  It's just YouTube, right? */}
      <Beat from={B[13]} to={B[14]}>
        <Emoji src="yt-logo.png" x={750} y={330} w={420} at={B[13]} enter="cut" />
        <Line y={620} words={[['"it\'s', 20.86], ['just', 21.54], ['YouTube,', 21.74], ['right?"', 22.14]]} />
      </Beat>

      {/* 16  It's just content. */}
      <Beat from={B[14]} to={B[15]}>
        <Line y={500} words={[['"it\'s', 22.5], ['just', 23.12], ['content."', 23.3]]} />
      </Beat>

      {/* 17  Well... */}
      <Beat from={B[15]} to={B[16]}>
        <Photo src="meme-monkey.jpg" x={550} y={200} w={820} at={B[15]} />
        <MemeCaption text="well..." x={800} y={70} size={110} at={B[15]} />
      </Beat>

      {/* 18  not exactly. */}
      <Beat from={B[16]} to={B[17]}>
        <Hadi pose="facepalm" x={260} at={B[16]} />
        <Sticker text="NOT EXACTLY" color="#F03A2E" x={780} y={440} size={150} rot={-3} at={25.3} />
      </Beat>

      {/* 19-20  Every video you upload can be watched thousands of times */}
      <Beat from={B[17]} to={B[18]}>
        <Photo src="yt-thumb0.png" x={460} y={160} w={1000} at={B[17]} />
        {t >= 28.06 && <Sticker text={`${views.toLocaleString('en-US')} views`} color="#FFD400" x={520} y={770} size={140} rot={-2} at={28.06} anim="cut" />}
        <Emoji src="emoji-eyes.png" x={1560} y={240} w={240} at={27.92} enter="pop" />
      </Beat>

      {/* 21  And every one of those views */}
      <Beat from={B[18]} to={B[19]} zoom={0.015}>
        <Sticker text="EVERY." color="#FFFFFF" x={170} y={430} size={170} rot={-2} at={30.02} anim="cut" />
        <Sticker text="ONE." color="#FFFFFF" x={830} y={430} size={170} rot={-2} at={30.4} anim="cut" />
        <Sticker text="VIEW." color="#FFD400" x={1330} y={430} size={170} rot={-2} at={30.88} anim="cut" />
      </Beat>

      {/* 22  counts for something. */}
      <Beat from={B[19]} to={B[20]}><Emoji src="emoji-scale.png" x={660} y={220} w={600} at={B[19]} /></Beat>

      {/* Red wipe transition, on top of everything */}
      {t >= 19.52 && t < 19.9 && <div style={{position: 'absolute', top: 0, left: wipeX, width: 800, height: 1080, background: '#F03A2E'}} />}
    </AbsoluteFill>
  );
};
