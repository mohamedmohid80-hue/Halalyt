import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, interpolate, staticFile, useVideoConfig} from 'remotion';
import {
  AMIRI, BLUE, Box, COMIC, Count, DEEN, Draw, Emo, GapProvider, Glow, GOLD, GREEN, GREY, Hadi, In, INK, Label, NUN, Person, Pic, Pill,
  POP, RED, Recitation, RedWipe, SacredCard, Scene, Sticker, TitleCard, TypeOn, Words, clamp, easeOut, prog, useVT,
} from './kit';

/* Voiceover clock: recitations are inserted after these voiceover times. */
const R1_AT = 21.4, R1_LEN = 29.42, R2_AT = 101.8, R2_LEN = 17.85;
const PAD_IN = 0.4, PAD_OUT = 0.5;
const GAPS = [
  {at: R1_AT, len: PAD_IN + R1_LEN + PAD_OUT, id: 'r1'},
  {at: R2_AT, len: PAD_IN + R2_LEN + PAD_OUT, id: 'r2'},
];
export const VO_LEN = 362.37;
export const REST_FPS = 30;
export const REST_DURATION_S = VO_LEN + GAPS[0].len + GAPS[1].len;

const R = (f: string) => `rest/${f}`;
const sh = (x: number) => x; // readability marker for x positions

/* ---------- small reusable scene pieces ---------- */

const ChatBubble: React.FC<{text: string; side?: 'l' | 'r'; color?: string}> = ({text, side = 'l', color = '#EFEFEF'}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 18, flexDirection: side === 'l' ? 'row' : 'row-reverse'}}>
    <div style={{width: 74, height: 74, borderRadius: '50%', background: '#D5D5D5'}} />
    <div style={{background: color, borderRadius: 36, padding: '22px 36px', fontFamily: NUN, fontWeight: 800, fontSize: 52}}>{text}</div>
  </div>
);

const Wave: React.FC<{color?: string; bars?: number; w?: number}> = ({color = INK, bars = 34, w = 900}) => {
  const vt = useVT();
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 10, height: 220, width: w}}>
      {Array.from({length: bars}, (_, i) => {
        const h = 30 + 150 * Math.abs(Math.sin(i * 0.9 + vt * 6) * Math.cos(i * 0.37 + vt * 2.3));
        return <div key={i} style={{width: (w - bars * 10) / bars, height: h, background: color, borderRadius: 8}} />;
      })}
    </div>
  );
};

const Tile: React.FC<{text: string; bg: string; fg?: string; w?: number}> = ({text, bg, fg = '#fff', w = 400}) => (
  <div style={{width: w, height: w * 0.5625, background: bg, borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 16px 30px rgba(0,0,0,.2)'}}>
    <Sticker text={text} color={fg} size={w / 6.2} />
  </div>
);

const Chip: React.FC<{text: string; on?: boolean}> = ({text, on = true}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 22, background: on ? '#E6F6EA' : '#F2F2F2', border: `6px solid ${on ? GREEN : '#ccc'}`, borderRadius: 999, padding: '20px 40px'}}>
    <div style={{width: 64, height: 64, borderRadius: '50%', background: on ? GREEN : '#ccc', color: '#fff', fontFamily: POP, fontWeight: 900, fontSize: 44, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>✓</div>
    <Label text={text} size={52} />
  </div>
);

const VideoCard: React.FC<{label?: string; w?: number; gray?: boolean; glow?: string; img?: string}> = ({label, w = 520, gray, glow, img}) => (
  <div style={{width: w, filter: gray ? 'grayscale(1) opacity(.45)' : undefined, boxShadow: glow ? `0 0 60px ${glow}` : '0 16px 30px rgba(0,0,0,.18)', borderRadius: 18, background: '#fff', overflow: 'hidden'}}>
    <div style={{height: w * 0.5625, background: img ? undefined : '#1d1d1d', position: 'relative'}}>
      {img && <Img src={staticFile(img)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />}
      <div style={{position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: 0, height: 0, borderLeft: `${w / 9}px solid rgba(255,255,255,.9)`, borderTop: `${w / 15}px solid transparent`, borderBottom: `${w / 15}px solid transparent`}} />
    </div>
    {label && <div style={{padding: '18px 24px', fontFamily: POP, fontWeight: 900, fontSize: w / 13}}>{label}</div>}
  </div>
);

/** Branching network that spreads out from a centre node; nodes light up over [a,b]. */
const Network: React.FC<{a: number; b: number; color: string; flipAt?: number; flipColor?: string; cx?: number; cy?: number; plus?: boolean}> = ({a, b, color, flipAt, flipColor, cx = 960, cy = 560, plus}) => {
  const vt = useVT();
  const rings = [{n: 6, r: 230}, {n: 12, r: 410}];
  const nodes: {x: number; y: number; px: number; py: number; i: number}[] = [];
  let i = 0;
  for (let k = 0; k < rings[0].n; k++) {
    const ang = (k / rings[0].n) * Math.PI * 2 - Math.PI / 2;
    const x = cx + Math.cos(ang) * rings[0].r, y = cy + Math.sin(ang) * rings[0].r * 0.78;
    nodes.push({x, y, px: cx, py: cy, i: i++});
    for (let j = 0; j < 2; j++) {
      const a2 = ang + (j ? 0.22 : -0.22);
      nodes.push({x: cx + Math.cos(a2) * rings[1].r, y: cy + Math.sin(a2) * rings[1].r * 0.78, px: x, py: y, i: i++});
    }
  }
  const total = nodes.length;
  const c = flipAt !== undefined && vt >= flipAt ? flipColor! : color;
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
      {nodes.map((nd) => {
        const at = a + (b - a) * (nd.i / total);
        const p = prog(vt, at, 0.35);
        if (p <= 0) return null;
        const ex = nd.px + (nd.x - nd.px) * p, ey = nd.py + (nd.y - nd.py) * p;
        return (
          <g key={nd.i}>
            <line x1={nd.px} y1={nd.py} x2={ex} y2={ey} stroke={c} strokeWidth={6} opacity={0.6} />
            {p >= 1 && <circle cx={nd.x} cy={nd.y} r={26} fill={c} style={{filter: flipAt !== undefined && vt >= flipAt ? `drop-shadow(0 0 14px ${c})` : undefined}} />}
            {plus && p >= 1 && vt < at + 1.2 && <text x={nd.x + 30} y={nd.y - 30 - (vt - at) * 40} fontFamily={POP} fontWeight={900} fontSize={40} fill={c} opacity={1 - (vt - at) / 1.2}>+1</text>}
          </g>
        );
      })}
      <circle cx={cx} cy={cy} r={60} fill={INK} />
      <path d={`M${cx - 18},${cy - 26} L${cx + 28},${cy} L${cx - 18},${cy + 26} Z`} fill="#fff" />
    </svg>
  );
};

/* ---------- sacred text ---------- */

const T965 = 'وَلَئِن سَأَلْتَهُمْ لَيَقُولُنَّ إِنَّمَا كُنَّا نَخُوضُ وَنَلْعَبُ ۚ قُلْ أَبِٱللَّهِ وَءَايَٰتِهِۦ وَرَسُولِهِۦ كُنتُمْ تَسْتَهْزِءُونَ ۝ لَا تَعْتَذِرُوا۟ قَدْ كَفَرْتُم بَعْدَ إِيمَٰنِكُمْ';
const R1_WORDS: [string, number][] = ([
  ['وَلَئِن', 0], ['سَأَلْتَهُمْ', 1.88], ['لَيَقُولُنَّ', 3.14], ['إِنَّمَا', 5.28], ['كُنَّا', 7.34], ['نَخُوضُ', 8.88], ['وَنَلْعَبُ ۚ', 10.04], ['قُلْ', 11.48],
  ['أَبِٱللَّهِ', 12.02], ['وَءَايَٰتِهِۦ', 13.42], ['وَرَسُولِهِۦ', 15.28], ['كُنتُمْ', 16.94], ['تَسْتَهْزِءُونَ ۝', 18.7],
  ['لَا', 22.57], ['تَعْتَذِرُوا۟', 23.17], ['قَدْ', 24.55], ['كَفَرْتُم', 24.97], ['بَعْدَ', 26.81], ['إِيمَٰنِكُمْ', 27.73],
] as [string, number][]).map(([w, t]) => [w, t + PAD_IN]);
const T4912 = 'وَلَا تَجَسَّسُوا۟ وَلَا يَغْتَب بَّعْضُكُم بَعْضًا ۚ أَيُحِبُّ أَحَدُكُمْ أَن يَأْكُلَ لَحْمَ أَخِيهِ مَيْتًا فَكَرِهْتُمُوهُ';
const R2_WORDS: [string, number][] = ([
  ['وَلَا', 0.12], ['تَجَسَّسُوا۟', 0.86], ['وَلَا', 2.22], ['يَغْتَب', 2.76], ['بَّعْضُكُم', 3.72], ['بَعْضًا ۚ', 5.62], ['أَيُحِبُّ', 6.8], ['أَحَدُكُمْ', 8.12],
  ['أَن', 9.56], ['يَأْكُلَ', 10.34], ['لَحْمَ', 11.08], ['أَخِيهِ', 11.8], ['مَيْتًا', 12.56], ['فَكَرِهْتُمُوهُ', 14.3],
] as [string, number][]).map(([w, t]) => [w, t + PAD_IN]);
const T2419 = 'إِنَّ ٱلَّذِينَ يُحِبُّونَ أَن تَشِيعَ ٱلْفَٰحِشَةُ فِى ٱلَّذِينَ ءَامَنُوا۟ لَهُمْ عَذَابٌ أَلِيمٌ فِى ٱلدُّنْيَا وَٱلْءَاخِرَةِ';
const T335 = 'وَلَيْسَ عَلَيْكُمْ جُنَاحٌ فِيمَآ أَخْطَأْتُم بِهِۦ وَلَٰكِن مَّا تَعَمَّدَتْ قُلُوبُكُمْ';
const H_LIE = 'مَنْ كَذَبَ عَلَيَّ مُتَعَمِّدًا فَلْيَتَبَوَّأْ مَقْعَدَهُ مِنَ النَّارِ';
const H_BAD = 'وَمَنْ سَنَّ فِي الإِسْلاَمِ سُنَّةً سَيِّئَةً كَانَ عَلَيْهِ وِزْرُهَا وَوِزْرُ مَنْ عَمِلَ بِهَا مِنْ بَعْدِهِ مِنْ غَيْرِ أَنْ يَنْقُصَ مِنْ أَوْزَارِهِمْ شَىْءٌ';
const H_GOOD = 'مَنْ سَنَّ فِي الإِسْلاَمِ سُنَّةً حَسَنَةً فَلَهُ أَجْرُهَا وَأَجْرُ مَنْ عَمِلَ بِهَا بَعْدَهُ';
const H_NIYYAH = 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ';

/* ================================================================ */

const Point2: React.FC = () => {
  const vt = useVT();
  return (
    <>
      <TitleCard from={0} to={2.74} n={2} title="MAKING JOKES ABOUT THE RELIGION" a={1.28} b={2.6} pose="facepalm" />

      {/* more common than you'd think: a phone feed full of laughing reactions */}
      <Scene from={2.74} to={6.0}>
        <In at={2.74} kind="slide" x={560} y={60}><Pic src={R('phone-hand.jpg')} w={800} h={960} /></In>
        {[3.66, 4.16, 4.44, 4.84, 5.04].map((at, i) => (
          <In key={i} at={at} kind="pop" x={300 + (i % 2) * 1150 + (i * 37) % 120} y={180 + i * 150}><Emo name="laugh" w={150} /></In>
        ))}
        <In at={4.44} kind="pop" x={960} y={930} center><Pill text="MORE COMMON THAN YOU THINK" color={INK} size={50} /></In>
      </Scene>

      {/* memes about salah / skits mocking hijab: blurred so nothing offensive is shown */}
      <Scene from={6.0} to={9.85}>
        <In at={6.14} kind="slide" x={170} y={190}>
          <Pic src={R('prayer-rug.jpg')} w={760} h={520} blur={14} />
          <div style={{marginTop: 26, textAlign: 'center'}}><Pill text="MEMES ABOUT SALAH" color={RED} /></div>
        </In>
        <In at={6.6} kind="pop" x={480} y={330}><Emo name="laugh" w={180} /></In>
        <In at={7.72} kind="slide" x={1000} y={190}>
          <div style={{width: 760, height: 520, borderRadius: 18, background: 'linear-gradient(135deg,#bbb,#888)', filter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Person c="#555" s={4} /></div>
          <div style={{marginTop: 26, textAlign: 'center'}}><Pill text="SKITS MOCKING HIJAB" color={RED} /></div>
        </In>
        <In at={8.76} kind="pop" x={1300} y={330}><Emo name="laugh" w={180} /></In>
      </Scene>

      {/* sounds that, translated, insult Allah */}
      <Scene from={9.85} to={14.4}>
        <In at={9.92} kind="rise" x={510} y={120}><Wave color={INK} /></In>
        <In at={11.42} kind="rise" x={240} y={470}>
          <Box w={620} h={260}><Label text="🇮🇹 Italian audio" size={46} color={GREY} /><Label text="♪ ♪ ♪" size={60} /></Box>
        </In>
        <Draw d="M880,600 L1050,600" at={11.7} arrow />
        <In at={12.62} kind="rise" x={1070} y={470}>
          <Box w={620} h={260} color={RED} glow="rgba(240,58,46,.45)">
            <Label text="🇬🇧 English" size={46} color={GREY} />
            <div style={{width: 470, height: 64, background: RED, borderRadius: 8}} />
          </Box>
        </In>
        <In at={13.34} kind="pop" x={1590} y={380}><Emo name="warning" w={150} /></In>
        <In at={13.34} kind="rise" x={960} y={830} center><Label text="insulting Allah, hidden in a meme sound" size={50} color={RED} /></In>
      </Scene>

      {/* "relax, it's just a joke" */}
      <Scene from={14.4} to={17.75}>
        <In at={14.58} kind="rise" x={420} y={230}><ChatBubble text="lol 😂" /></In>
        <In at={15.6} kind="rise" x={620} y={430}><ChatBubble text="relax bro" side="r" /></In>
        <In at={16.32} kind="rise" x={420} y={630}><ChatBubble text="it's just a joke" /></In>
      </Scene>

      {/* the same excuse is in the Quran */}
      <Scene from={17.75} to={R1_AT}>
        <In at={17.8} kind="cut" x={120} y={430}><ChatBubble text="it's just a joke" color="#FFF0B3" /></In>
        <In at={18.26} kind="pop" x={300} y={300}><Pill text="THE SAME EXCUSE" color={GOLD} fg={INK} /></In>
        <Draw d="M820,500 C1000,380 1050,420 1150,420" at={19.04} color={GOLD} width={10} dash="22 16" arrow />
        <In at={19.46} kind="slide" x={1150} y={200}>
          <div style={{filter: 'drop-shadow(0 0 40px rgba(242,183,5,.7))'}}><Pic src={R('quran.jpg')} w={640} h={460} /></div>
        </In>
        <In at={20.76} kind="rise" x={1470} y={720} center><Label text="mentioned in the Quran" size={50} color="#9A7A10" /></In>
      </Scene>

      <Recitation id="r1" words={R1_WORDS} label="Surah At-Tawbah · 9:65–66" reciter="Recitation: Mishary Rashid Alafasy" tail={PAD_IN + R1_LEN + PAD_OUT} />

      <SacredCard
        from={R1_AT} to={36.3} quran lead="Allah says:" leadAt={R1_AT} ar={T965} arAt={R1_AT}
        phrases={[['If you ask them, they will surely say,', 21.7, 24.1], ['“We were only joking and playing around.”', 24.14, 25.9], ['Say: Was it Allah, His verses and His Messenger that you were mocking?', 25.92, 31.8], ['Make no excuse.', 31.84, 33.5], ['You have disbelieved after your belief.', 33.52, 36.3]]}
        src="Surah At-Tawbah 9:65–66" srcAt={36.52}
      />

      <Scene from={36.3} to={40.3}>
        <Glow o={0.7} />
        <In at={36.52} kind="pop" x={960} y={430} center><Label text="Surah At-Tawbah" size={90} color="#9A7A10" /></In>
        <In at={38.1} kind="pop" x={960} y={600} center><Sticker text="9 : 65 – 66" color={GOLD} size={170} /></In>
      </Scene>

      {/* comedy is fine */}
      <Scene from={40.3} to={44.1}>
        <In at={40.96} kind="pop" x={430} y={300}><Emo name="laugh" w={420} /></In>
        <In at={41.6} kind="rise" x={1000} y={330}><Sticker text="COMEDY ✓" color={GREEN} size={150} /></In>
        <In at={43.0} kind="rise" x={1010} y={560}><Label text="You can be funny." size={70} /></In>
      </Scene>

      {/* never make Allah, His Messenger or the deen the punchline */}
      <Scene from={44.1} to={49.45} zoom={0.006}>
        {(() => {
          const shieldP = prog(vt, 44.3, 0.6);
          const hit = vt >= 47.5;
          const ax = interpolate(vt, [47.1, 47.5], [-200, 520], {...clamp, easing: easeOut});
          const bounce = hit ? interpolate(vt, [47.5, 48.0], [0, -160], {...clamp, easing: easeOut}) : 0;
          return (
            <>
              <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
                <ellipse cx={1150} cy={560} rx={560 * shieldP} ry={380 * shieldP} fill="rgba(31,163,74,.07)" stroke={GREEN} strokeWidth={10} style={{filter: hit ? 'drop-shadow(0 0 30px rgba(31,163,74,.9))' : 'drop-shadow(0 0 10px rgba(31,163,74,.4))'}} />
              </svg>
              <In at={45.0} kind="pop" x={810} y={450}><Box w={300} h={200} color={DEEN}><Label text="Allah" size={64} color={DEEN} font={NUN} /></Box></In>
              <In at={45.96} kind="pop" x={1150 - 150 + 170} y={300}><Box w={340} h={200} color={DEEN}><Label text="His Messenger ﷺ" size={46} color={DEEN} font={NUN} /></Box></In>
              <In at={46.96} kind="pop" x={1150 - 150 + 170} y={600}><Box w={340} h={200} color={DEEN}><Label text="The Deen" size={56} color={DEEN} font={NUN} /></Box></In>
              {vt >= 47.1 && (
                <div style={{position: 'absolute', left: ax, top: 520 + bounce, transform: `rotate(${hit ? -25 : 0}deg)`, opacity: hit ? 1 - prog(vt, 47.8, 0.4) : 1}}>
                  <Pill text="PUNCHLINE ➜" color={RED} size={48} />
                </div>
              )}
              <In at={47.86} kind="stamp" x={1150} y={1000} center><Sticker text="OFF LIMITS" color={RED} size={80} /></In>
            </>
          );
        })()}
      </Scene>
    </>
  );
};

const Point3: React.FC = () => {
  const vt = useVT();
  const blur = interpolate(vt, [55.8, 56.6], [0, 3], clamp);
  const gray = interpolate(vt, [55.8, 56.6], [0, 0.85], clamp);
  return (
    <>
      <TitleCard from={49.45} to={51.6} n={3} title="SPREADING FAKE HADITH" a={50.3} b={51.4} pose="shock" />

      {/* the emotional "reminder" video with an untraceable quote */}
      <Scene from={51.6} to={60.8} zoom={0.008}>
        <In at={51.64} kind="slide" x={260} y={110}>
          <div style={{position: 'relative', width: 1000, height: 562, borderRadius: 18, overflow: 'hidden', boxShadow: '0 18px 40px rgba(0,0,0,.25)'}}>
            <Img src={staticFile(R('rain-window.jpg'))} style={{width: '100%', height: '100%', objectFit: 'cover', filter: `blur(${blur}px) grayscale(${gray}) brightness(.7)`}} />
            {vt >= 57.2 - 0.1 && (
              <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 60, opacity: prog(vt, 57.1, 0.4)}}>
                <div style={{fontFamily: AMIRI, fontSize: 54, color: '#fff', textAlign: 'center', textShadow: '0 2px 12px rgba(0,0,0,.6)'}}>“The Prophet ﷺ said: whoever shares this will be forgiven…”</div>
              </div>
            )}
          </div>
        </In>
        <In at={54.04} kind="pop" x={1320} y={170}><Pill text="EMOTIONAL VIDEO" color={INK} size={40} /></In>
        <In at={55.8} kind="pop" x={1320} y={290}><Pill text="SAD BACKGROUND" color={GREY} size={40} /></In>
        <In at={57.2} kind="pop" x={1320} y={410}><Pill text="A 'HADITH'" color={GOLD} fg={INK} size={40} /></In>
        <In at={58.52} kind="rise" x={430} y={760}>
          <div style={{display: 'flex', alignItems: 'center', gap: 20, background: '#fff', border: '6px solid #ddd', borderRadius: 999, padding: '18px 34px', width: 760}}>
            <Emo name="magnifier" w={70} />
            <TypeOn text="source of this hadith?" a={58.6} b={59.4} size={44} font={NUN} weight={800} />
          </div>
        </In>
        <In at={59.6} kind="stamp" x={1300} y={800}><Pill text="0 RESULTS" color={RED} size={52} /></In>
      </Scene>

      {/* shared thousands of times */}
      <Scene from={60.8} to={64.8} zoom={0.006}>
        <Network a={61.2} b={62.5} color={GOLD} />
        <In at={61.68} kind="rise" x={960} y={80} center><Count to={12400} a={61.4} b={62.6} suffix=" shares" size={96} /></In>
        <In at={63.28} kind="pop" x={960} y={1000} center><Pill text="…because it sounds beautiful" color={INK} size={46} /></In>
      </Scene>

      <SacredCard
        from={64.8} to={74.9} lead="The Prophet ﷺ said:" leadAt={65.0} ar={H_LIE} arAt={68.2}
        phrases={[['Whoever lies about me on purpose,', 68.3, 70.5], ['let him take his seat in the Fire.', 70.54, 74.9]]}
        src="Sahih al-Bukhari 110 · Grade: Sahih" srcAt={72.88}
      />

      {/* check it: three steps */}
      <Scene from={74.9} to={83.05}>
        <In at={75.28} kind="drop" x={960} y={120} w={1700} center><Label text="Before you put a hadith in a video:" size={56} /></In>
        <In at={77.82} kind="pop" x={960} y={250} center><Sticker text="CHECK IT" color={GREEN} size={120} /></In>
        {[['Where is it from?', 'books', 78.74], ['Is it authentic?', 'check', 79.9], ['Source on the screen', 'magnifier', 80.42]].map(([t, e, at], i) => (
          <In key={i} at={at as number} kind="slide" x={330 + i * 430} y={430}>
            <Box w={400} h={430} color={vt >= (at as number) + 0.6 ? GREEN : INK}>
              <Emo name={e as string} w={150} />
              <Label text={t as string} size={44} />
              <div style={{fontFamily: POP, fontWeight: 900, fontSize: 70, color: GREEN, opacity: prog(vt, (at as number) + 0.5, 0.2)}}>✓</div>
            </Box>
          </In>
        ))}
      </Scene>

      {/* can't find it? don't post it */}
      <Scene from={83.05} to={86.4}>
        <In at={83.12} kind="rise" x={960} y={380} center>
          <div style={{background: vt >= 84.56 ? '#ccc' : BLUE, color: '#fff', fontFamily: POP, fontWeight: 900, fontSize: 90, borderRadius: 24, padding: '30px 120px'}}>POST</div>
        </In>
        <In at={84.56} kind="stamp" x={960} y={380} center><Emo name="cross" w={260} /></In>
        <In at={84.76} kind="rise" x={960} y={700} center><Sticker text="CAN'T FIND IT? DON'T POST IT." color={RED} size={84} /></In>
      </Scene>
    </>
  );
};

const Point4: React.FC = () => {
  const vt = useVT();
  return (
    <>
      <TitleCard from={86.4} to={89.0} n={4} title="BACKBITING & HUMILIATING PEOPLE" a={87.1} b={88.8} pose="facepalm" />

      <Scene from={89.0} to={97.0} zoom={0.008}>
        {[['DRAMA', RED, 89.06, 120, 120], ['EXPOSED', '#111', 90.84, 1400, 120], ['ROAST', '#E8590C', 92.32, 120, 700], ['REACTION', BLUE, 93.2, 1400, 700]].map(([t, c, at, x, y], i) => (
          <In key={i} at={at as number} kind="pop" x={x as number} y={y as number}><Tile text={t as string} bg={c as string} /></In>
        ))}
        <In at={94.3} kind="fade" x={960} y={560} center>
          <div style={{position: 'relative', width: 420, height: 420, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,230,120,.8), rgba(255,255,255,0) 70%)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Person c={GREY} s={4} /></div>
        </In>
        {[[520, 300], [1400, 300], [520, 820], [1400, 820]].map(([x, y], i) => (
          <Draw key={i} d={`M${x},${y} L${x < 960 ? 800 : 1120},${y < 540 ? 450 : 670}`} at={94.6 + i * 0.12} color={RED} arrow />
        ))}
        <In at={95.94} kind="pop" x={960} y={880} center><Pill text="TO MAKE SOMEONE LOOK STUPID" color={RED} size={44} /></In>
      </Scene>

      {/* these get views */}
      <Scene from={97.0} to={R2_AT}>
        {(() => {
          const h1 = interpolate(vt, [97.2, 97.8], [0, 300], {...clamp, easing: easeOut});
          const h2 = interpolate(vt, [98.4, 99.2], [0, 620], {...clamp, easing: easeOut});
          return (
            <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
              <line x1={500} y1={900} x2={1420} y2={900} stroke={INK} strokeWidth={8} />
              <rect x={620} y={900 - h1} width={260} height={h1} rx={14} fill={GREY} />
              <rect x={1040} y={900 - h2} width={260} height={h2} rx={14} fill={RED} style={{filter: 'drop-shadow(0 0 20px rgba(240,58,46,.5))'}} />
              <text x={750} y={960} textAnchor="middle" fontFamily={POP} fontWeight={800} fontSize={40}>normal video</text>
              <text x={1170} y={960} textAnchor="middle" fontFamily={POP} fontWeight={800} fontSize={40}>drama video</text>
            </svg>
          );
        })()}
        <In at={98.46} kind="pop" x={1170} y={180} center><Sticker text="A LOT OF VIEWS" color={GOLD} size={90} /></In>
        <In at={100.0} kind="slide" x={1400} y={380}><div style={{filter: 'drop-shadow(0 0 40px rgba(242,183,5,.7))'}}><Pic src={R('quran.jpg')} w={460} h={330} /></div></In>
      </Scene>

      <Recitation id="r2" words={R2_WORDS} label="Surah Al-Hujurat · 49:12" reciter="Recitation: Mishary Rashid Alafasy" tail={PAD_IN + R2_LEN + PAD_OUT} />

      <SacredCard
        from={R2_AT} to={113.25} quran lead="Allah says:" leadAt={R2_AT} ar={T4912} arAt={R2_AT}
        phrases={[['And do not spy,', 102.2, 103.5], ['and do not backbite one another.', 103.56, 105.5], ['Would any of you like to eat the flesh of his dead brother?', 105.58, 108.8], ['You would hate it.', 108.82, 113.2]]}
        src="Surah Al-Hujurat 49:12" srcAt={109.76}
      />

      {/* warning vs enjoying downfall */}
      <Scene from={113.25} to={125.9} zoom={0.005}>
        <In at={113.4} kind="drop" x={960} y={110} w={1700} center><Label text="Can you never talk about anyone?" size={56} color={GREY} /></In>
        <Draw d="M960,220 L960,1000" at={120.7} color="#ddd" width={6} dur={0.4} />
        <In at={116.32} kind="rise" x={170} y={260}>
          <Box w={640} h={560} color={vt >= 119.34 ? GREEN : INK} glow={vt >= 119.34 ? 'rgba(31,163,74,.35)' : undefined}>
            <Emo name="shield" w={200} />
            <Label text="Warning people" size={60} />
            <Label text="about something harmful" size={40} color={GREY} weight={800} />
            <div style={{fontFamily: POP, fontWeight: 900, fontSize: 64, color: GREEN, opacity: prog(vt, 119.34, 0.3)}}>can be okay ✓</div>
          </Box>
        </In>
        <In at={123.1} kind="rise" x={1110} y={260}>
          <Box w={640} h={560} color={RED} glow="rgba(240,58,46,.3)">
            <Emo name="laugh" w={200} />
            <Label text="Enjoying their downfall" size={54} />
            <Label text="for views" size={40} color={GREY} weight={800} />
            <div style={{fontFamily: POP, fontWeight: 900, fontSize: 64, color: RED, opacity: prog(vt, 124.82, 0.3)}}>✕</div>
          </Box>
        </In>
        <In at={121.06} kind="pop" x={960} y={950} center><Pill text="THERE'S A DIFFERENCE" color={INK} size={44} /></In>
      </Scene>

      {/* talk about the action, not the person */}
      <Scene from={125.9} to={128.4} zoom={0.004}>
        {(() => {
          const x = interpolate(vt, [126.2, 126.9], [520, 1400], {...clamp, easing: easeOut});
          return (
            <>
              <In at={126.0} kind="cut" x={380} y={330}><div style={{opacity: vt >= 127.3 ? 0.35 : 1}}><Person c={INK} s={4.2} /></div><div style={{textAlign: 'center', marginTop: 10}}><Label text="the person" size={44} color={GREY} /></div></In>
              <In at={126.0} kind="cut" x={1220} y={380}><Box w={360} h={220} color={RED}><Label text="the ACTION" size={56} color={RED} /></Box></In>
              <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
                <g transform={`translate(${x} 490)`}>
                  <circle r={90} fill="none" stroke={RED} strokeWidth={8} />
                  <line x1={-130} y1={0} x2={130} y2={0} stroke={RED} strokeWidth={6} />
                  <line x1={0} y1={-130} x2={0} y2={130} stroke={RED} strokeWidth={6} />
                </g>
              </svg>
            </>
          );
        })()}
      </Scene>

      <Scene from={128.4} to={132.2}>
        <In at={128.48} kind="slide" x={180} y={170}><Hadi pose="think" /></In>
        <In at={129.74} kind="pop" x={780} y={330}>
          <div style={{background: '#fff', border: `8px solid ${INK}`, borderRadius: 60, padding: '40px 60px'}}><TypeOn text="Would I say this to their face?" a={129.74} b={130.7} size={60} font={NUN} /></div>
        </In>
      </Scene>
    </>
  );
};

const Point5: React.FC = () => {
  const vt = useVT();
  return (
    <>
      <TitleCard from={132.2} to={134.8} n={5} title="SHOWING OR PROMOTING HARAM" a={133.0} b={134.5} pose="shock" />

      <Scene from={134.8} to={138.85}>
        <In at={135.88} kind="slide" x={460} y={180}>
          <div style={{width: 1000, height: 562, borderRadius: 18, background: 'linear-gradient(135deg,#f5a,#fa6,#a7f)', filter: 'blur(28px)'}} />
        </In>
        <In at={136.74} kind="stamp" x={960} y={460} center><Pill text="INAPPROPRIATE" color={RED} size={64} /></In>
        <In at={138.3} kind="pop" x={1300} y={720}><Emo name="eyes" w={170} /></In>
        <In at={138.48} kind="rise" x={960} y={900} center><Label text="just to get clicks" size={56} color={RED} /></In>
      </Scene>

      <Scene from={138.85} to={145.1} zoom={0.006}>
        <In at={139.76} kind="drop" x={960} y={120} center><Label text="SPONSORED BY…" size={70} /></In>
        <In at={141.24} kind="slide" x={150} y={300}><Box w={500} h={520} color={RED}><Emo name="slot" w={220} /><Label text="Betting apps" size={52} /></Box></In>
        <In at={142.12} kind="slide" x={710} y={300}><Box w={500} h={520} color={RED}><Pic src={R('roulette.jpg')} w={360} h={260} radius={12} /><Label text="Gambling sites" size={52} /></Box></In>
        <In at={143.28} kind="slide" x={1270} y={300}>
          <Box w={500} h={520} color={RED}>
            <svg width={340} height={240}><path d="M10,230 C150,225 220,190 330,10" pathLength={1} fill="none" stroke={RED} strokeWidth={12} strokeDasharray="1" strokeDashoffset={1 - prog(vt, 143.4, 0.6)} /><text x={30} y={80} fontFamily={POP} fontWeight={900} fontSize={80} fill={RED}>%</text></svg>
            <Label text="Loans on interest" size={50} />
          </Box>
        </In>
      </Scene>

      <Scene from={145.1} to={150.0}>
        {(() => {
          const tilt = vt < 147.9 ? interpolate(vt, [145.6, 146.8], [0, -12], clamp) : interpolate(vt, [147.9, 149.4], [-12, 12], {...clamp, easing: easeOut});
          return (
            <>
              <In at={145.22} kind="pop" x={960} y={140} center><Count to={50000} a={145.5} b={146.84} prefix="$" size={110} color={GREEN} /></In>
              <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
                <line x1={960} y1={430} x2={960} y2={940} stroke={INK} strokeWidth={14} />
                <rect x={860} y={930} width={200} height={30} rx={10} fill={INK} />
                <g transform={`rotate(${tilt} 960 430)`}>
                  <line x1={560} y1={430} x2={1360} y2={430} stroke={INK} strokeWidth={14} strokeLinecap="round" />
                  <line x1={560} y1={430} x2={560} y2={560} stroke={INK} strokeWidth={6} />
                  <line x1={1360} y1={430} x2={1360} y2={560} stroke={INK} strokeWidth={6} />
                </g>
              </svg>
              {(() => {
                const r = (tilt * Math.PI) / 180;
                const lx = 960 - 400 * Math.cos(r), ly = 430 - 400 * Math.sin(r);
                const rx = 960 + 400 * Math.cos(r), ry = 430 + 400 * Math.sin(r);
                return (
                  <>
                    <div style={{position: 'absolute', left: lx - 110, top: ly + 120}}><Emo name="moneybag" w={220} /></div>
                    <div style={{position: 'absolute', left: rx - 130, top: ry + 130, opacity: prog(vt, 147.7, 0.3)}}><Box w={260} h={150} color={DEEN}><Label text="Your deen" size={48} color={DEEN} /></Box></div>
                  </>
                );
              })()}
              <In at={148.34} kind="pop" x={960} y={1010} center><Pill text="THAT'S THE TEST" color={INK} size={44} /></In>
            </>
          );
        })()}
      </Scene>

      <SacredCard
        from={150.0} to={161.45} quran lead="Allah warns:" leadAt={150.0} ar={T2419} arAt={150.14}
        phrases={[['Those who love to see indecency spread among the believers', 150.14, 154.2], ['will have a painful punishment, in this life and the next.', 154.24, 161.4]]}
        src="Surah An-Nur 24:19" srcAt={158.82}
      />

      <Scene from={161.45} to={167.75} zoom={0.006}>
        <In at={161.82} kind="drop" x={960} y={130} center><Sticker text="THE PARENTS TEST" color={GOLD} size={110} /></In>
        <In at={163.28} kind="slide" x={160} y={380}><div style={{width: 520, height: 292, borderRadius: 16, background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Label text="your thumbnail" size={44} color="#fff" /></div></In>
        <Draw d="M700,530 L860,530" at={164.0} arrow />
        <In at={164.12} kind="pop" x={900} y={420}><Emo name="eyes" w={240} /></In>
        <In at={164.12} kind="rise" x={1020} y={760} w={700} center><Label text="Would your parents be okay?" size={44} /></In>
        <Draw d="M1180,530 L1340,530" at={165.6} arrow />
        <In at={165.84} kind="stamp" x={1400} y={400}><Emo name="cross" w={240} /></In>
        <In at={166.56} kind="rise" x={1520} y={900} w={600} center><Label text="Then don't post it." size={48} color={RED} /></In>
      </Scene>

      <Scene from={167.75} to={173.5}>
        <In at={168.66} kind="pop" x={960} y={420} center>
          <div style={{filter: vt >= 171.2 ? 'grayscale(1)' : undefined, opacity: vt >= 171.2 ? 0.45 : 1, transform: `scale(${vt >= 171.2 ? interpolate(vt, [171.2, 171.8], [1, 0.8], clamp) : 1})`}}><Emo name="moneybag" w={360} /></div>
        </In>
        <In at={169.8} kind="pop" x={1280} y={260}><Pill text="HARAM PRODUCT" color={RED} size={44} /></In>
        <In at={171.7} kind="stamp" x={960} y={780} center><Sticker text="NOT WORTH IT" color={RED} size={130} /></In>
      </Scene>
    </>
  );
};

const Point6: React.FC = () => {
  const vt = useVT();
  return (
    <>
      <TitleCard from={173.5} to={175.82} n={6} title="STEALING OTHER PEOPLE'S WORK" a={174.28} b={175.6} pose="shock" />

      <Scene from={175.82} to={178.2}>
        <In at={175.9} kind="cut" x={200} y={300}><VideoCard label="Original video" w={560} /></In>
        {[0, 1, 2].map((i) => (
          <In key={i} at={176.6 + i * 0.25} kind="slide" x={900 + i * 60} y={240 + i * 90}><VideoCard label="Re-upload" w={560} /></In>
        ))}
        <In at={177.0} kind="pop" x={1380} y={880} center><Pill text="RE-UPLOADED" color={RED} /></In>
      </Scene>

      <Scene from={178.2} to={182.45}>
        <In at={178.26} kind="slide" x={460} y={200}>
          <Box w={1000} h={420} color={INK}><Emo name="studio" w={160} /><Label text="Scholar's lecture · 1:24:00" size={52} /></Box>
        </In>
        {[0.333, 0.666].map((f, i) => (
          <Draw key={i} d={`M${460 + 1000 * f},170 L${460 + 1000 * f},660`} at={180.42 + i * 0.15} color={RED} width={8} dash="18 14" />
        ))}
        <In at={180.42} kind="pop" x={380} y={130}><Emo name="scissors" w={140} /></In>
        {[0, 1, 2].map((i) => (
          <In key={i} at={181.2 + i * 0.12} kind="pop" x={560 + i * 333} y={720}><Sticker text="$" color={GREEN} size={120} /></In>
        ))}
      </Scene>

      <Scene from={182.45} to={185.85}>
        <In at={182.52} kind="rise" x={510} y={300}><Wave color={DEEN} /></In>
        <In at={183.5} kind="rise" x={960} y={640} center><Label text="a reciter's recitation" size={52} color={DEEN} /></In>
        <In at={184.02} kind="stamp" x={960} y={410} center><Emo name="lock" w={200} /></In>
        <In at={184.6} kind="pop" x={960} y={800} center><Pill text="NO PERMISSION" color={RED} /></In>
      </Scene>

      <Scene from={185.85} to={189.35}>
        <In at={185.9} kind="slide" x={160} y={170}><Hadi pose="think" /></In>
        <In at={186.3} kind="pop" x={760} y={330}>
          <div style={{background: '#fff', border: `8px solid ${INK}`, borderRadius: 80, padding: '44px 64px'}}><TypeOn text="It's Islamic content, so it's fine…" a={186.9} b={188.5} size={56} font={COMIC} weight={700} /></div>
        </In>
      </Scene>

      <Scene from={189.35} to={191.55} zoom={0.006}>
        {['Research', 'Record', 'Edit'].map((t, i) => (
          <In key={i} at={189.5 + i * 0.3} kind="pop" x={260 + i * 520} y={380}><Box w={400} h={240} color={INK}><Emo name={['books', 'studio', 'clapper'][i]} w={110} /><Label text={t} size={52} /></Box></In>
        ))}
        <Draw d="M680,500 L760,500" at={189.8} arrow />
        <Draw d="M1200,500 L1280,500" at={190.1} arrow />
        <In at={190.22} kind="rise" x={960} y={780} center><Label text="hours of someone's hard work" size={54} color={GREY} /></In>
      </Scene>

      <Scene from={191.55} to={200.25} zoom={0.006}>
        <In at={191.6} kind="slide" x={180} y={220}><Pic src={R('gavel.jpg')} w={640} h={420} /></In>
        <In at={192.3} kind="pop" x={1050} y={210}>
          <div style={{width: 300, height: 300, borderRadius: '50%', border: `14px solid ${GOLD}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 60px rgba(242,183,5,.6)'}}><Sticker text="©" color={GOLD} size={200} /></div>
        </In>
        <In at={193.98} kind="rise" x={1200} y={590} center><Label text="Creators have rights over their work" size={46} /></In>
        <In at={195.74} kind="rise" x={260} y={760}><Box w={300} h={150} color={GREEN}><Label text="Owner" size={48} color={GREEN} /></Box></In>
        <Draw d="M580,835 L1280,835" at={196.24} color={RED} width={10} arrow />
        <In at={196.6} kind="rise" x={1300} y={760}><Box w={300} h={150} color={RED}><Label text="Taker" size={48} color={RED} /></Box></In>
        <In at={198.62} kind="stamp" x={930} y={760} center><Pill text="ISN'T YOURS" color={RED} size={44} /></In>
      </Scene>

      <Scene from={200.25} to={204.75}>
        <In at={200.4} kind="slide" x={540} y={200}><Chip text="Ask for permission" /></In>
        <In at={201.7} kind="slide" x={540} y={420}><Chip text="Credit the source" /></In>
        <In at={203.14} kind="slide" x={540} y={640}><Chip text="Or make your own" /></In>
      </Scene>
    </>
  );
};

const Escalation: React.FC = () => {
  const vt = useVT();
  return (
    <>
      <Scene from={204.75} to={209.25}>
        <In at={204.9} kind="stamp" x={960} y={420} center><Sticker text="BUT WAIT…" color={RED} size={200} /></In>
        <In at={207.82} kind="pop" x={960} y={720} center><Emo name="warning" w={220} glow="rgba(240,58,46,.7)" /></In>
      </Scene>

      {/* your video doesn't stop when you stop */}
      <Scene from={209.25} to={213.5} zoom={0.004}>
        {(() => {
          const p = prog(vt, 209.4, 3.0, (x: number) => x);
          const yr = Math.floor(interpolate(vt, [209.6, 213.2], [2026, 2036], clamp));
          return (
            <>
              <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
                <line x1={160} y1={620} x2={160 + 1600 * p} y2={620} stroke={INK} strokeWidth={10} strokeLinecap="round" />
                {Array.from({length: 11}, (_, i) => (160 + i * 160 <= 160 + 1600 * p) && <line key={i} x1={160 + i * 160} y1={600} x2={160 + i * 160} y2={640} stroke={INK} strokeWidth={6} />)}
              </svg>
              <In at={209.48} kind="pop" x={110} y={400}><Pill text="You upload" color={BLUE} size={40} /></In>
              <In at={211.56} kind="pop" x={360} y={680}><Pill text="⏸ You stop" color={GREY} size={40} /></In>
              <div style={{position: 'absolute', left: 60 + 1380 * p, top: 420}}><VideoCard w={260} /></div>
              <In at={212.3} kind="rise" x={1500} y={160} center><Sticker text={`${yr}`} color={INK} size={120} /></In>
              <In at={212.52} kind="rise" x={1500} y={840} center><Label text="…the video keeps going" size={52} color={RED} /></In>
            </>
          );
        })()}
      </Scene>

      <SacredCard
        from={213.5} to={229.0} lead="The Prophet ﷺ said:" leadAt={213.66} ar={H_BAD} arAt={216.7}
        phrases={[['Whoever starts a bad practice in Islam carries its burden,', 216.88, 220.9], ['and the burden of everyone who acts on it after him,', 220.94, 223.7], ['without their burden being reduced at all.', 223.74, 229.0]]}
        src="Sahih Muslim 1017 · Grade: Sahih" srcAt={227.02}
      />

      {/* imagine: one video, a million views, burden stacking */}
      <Scene from={229.0} to={242.3} zoom={0.004}>
        <In at={229.9} kind="slide" x={160} y={200}><VideoCard label="Fake hadith video" w={520} img={R('rain-window.jpg')} /></In>
        <In at={232.6} kind="pop" x={420} y={640} center><Count to={1000000} a={232.4} b={233.2} suffix=" views" size={84} /></In>
        {Array.from({length: 8}, (_, i) => (
          <In key={i} at={232.8 + i * 0.12} kind="drop" x={820} y={860 - i * 70}><div style={{width: 240, height: 60, background: RED, borderRadius: 10, opacity: 0.85}} /></In>
        ))}
        <In at={233.2} kind="rise" x={940} y={250} center><Label text="burden" size={48} color={RED} /></In>
        <In at={234.74} kind="slide" x={1200} y={200}><VideoCard label="Joke about the deen" w={520} /></In>
        <In at={236.56} kind="rise" x={1460} y={640} center><Label text="shared for years" size={52} /></In>
        <In at={236.98} kind="pop" x={1460} y={760} center><Sticker text={`${Math.floor(interpolate(vt, [236.9, 238.0], [2026, 2034], clamp))}`} color={INK} size={100} /></In>
        {vt >= 238.84 && <div style={{position: 'absolute', inset: -200, background: `rgba(255,255,255,${interpolate(vt, [238.84, 239.6], [0, 0.93], clamp)})`}} />}
        <In at={239.46} kind="rise" x={960} y={520} center><Label text="You forgot about it…" size={64} color={GREY} /></In>
        <In at={240.98} kind="pop" x={960} y={700} center><div style={{display: 'flex', alignItems: 'center', gap: 20}}><Emo name="eyes" w={140} /><Label text="it's still being watched" size={60} color={RED} /></div></In>
      </Scene>

      {/* here's the beautiful part */}
      <Scene from={242.3} to={244.2}>
        <Glow color="rgba(31,163,74,.45)" o={prog(vt, 242.4, 0.6)} />
        <In at={243.0} kind="pop" x={960} y={540} center><Sticker text="THE BEAUTIFUL PART" color={GREEN} size={120} glow="rgba(31,163,74,.6)" /></In>
      </Scene>

      <SacredCard
        from={244.2} to={253.75} lead="The same hadith also says:" leadAt={244.26} ar={H_GOOD} arAt={246.3}
        phrases={[['Whoever starts a good practice in Islam gets its reward,', 246.4, 249.8], ['and the reward of everyone who acts on it after him.', 249.82, 253.75]]}
        src="Sahih Muslim 1017 · Grade: Sahih" srcAt={246.3}
      />

      {/* same algorithm: sins vs good deeds */}
      <Scene from={253.75} to={267.85} zoom={0.004}>
        <Network a={254.4} b={256.9} color={RED} flipAt={258.0} flipColor={GREEN} />
        <In at={255.38} kind="drop" x={960} y={70} center><Label text="the same algorithm…" size={56} /></In>
        <In at={256.98} kind="pop" x={260} y={150}><Pill text="multiplies sins" color={RED} size={42} /></In>
        <In at={258.86} kind="pop" x={1360} y={150}><Pill text="multiplies good deeds" color={GREEN} size={42} glow /></In>
        {vt >= 260.2 && <Network a={260.3} b={266.4} color={GREEN} flipAt={260.2} flipColor={GREEN} plus />}
        <In at={265.56} kind="pop" x={960} y={1000} center><Pill text="REWARD THAT KEEPS COMING" color={GREEN} size={44} glow /></In>
      </Scene>
    </>
  );
};

const Closing: React.FC = () => {
  const vt = useVT();
  return (
    <>
      {/* scholars differ */}
      <Scene from={267.85} to={280.0} zoom={0.005}>
        <In at={268.4} kind="drop" x={960} y={130} center><Label text="Things scholars disagree on" size={64} color={GREY} /></In>
        <In at={271.52} kind="slide" x={200} y={320}><Box w={560} h={420} color={GREY}><Label text="♪" size={140} color={GREY} /><Label text="Music" size={64} color={GREY} /></Box></In>
        <In at={272.72} kind="slide" x={1160} y={320}><Box w={560} h={420} color={GREY}><Person c={GREY} s={2.4} /><Label text="Faces & images" size={58} color={GREY} /></Box></In>
        <In at={274.9} kind="pop" x={960} y={530} center><Emo name="scale" w={220} /></In>
        <In at={276.1} kind="pop" x={960} y={860} center><Pill text="DIFFERENT OPINIONS" color={GREY} size={48} /></In>
      </Scene>

      <Scene from={280.0} to={283.75}>
        <In at={280.02} kind="pop" x={960} y={280} center><Emo name="books" w={260} /></In>
        <In at={280.34} kind="slide" x={480} y={500}><Chip text="Ask a scholar you trust" /></In>
        <In at={281.62} kind="slide" x={480} y={700}><Chip text="Follow what you're convinced of" /></In>
      </Scene>

      {/* intention */}
      <Scene from={283.75} to={289.1}>
        <Glow color="rgba(31,163,74,.35)" o={prog(vt, 285.8, 1.0)} r={700} />
        <In at={285.08} kind="rise" x={960} y={330} center><Label text="it all comes down to one thing…" size={60} color={GREY} /></In>
        <In at={287.48} kind="pop" x={960} y={560} center><Sticker text="YOUR INTENTION" color={GREEN} size={150} glow="rgba(31,163,74,.6)" /></In>
        <In at={287.9} kind="rise" x={960} y={780} center><div style={{fontFamily: AMIRI, fontWeight: 700, fontSize: 110, color: DEEN, textShadow: '0 0 30px rgba(31,163,74,.5)'}}>النِّيَّة</div></In>
      </Scene>

      <SacredCard
        from={289.1} to={295.2} lead="The Prophet ﷺ said:" leadAt={289.2} ar={H_NIYYAH} arAt={292.5}
        phrases={[['Actions are only by intentions.', 292.72, 295.2]]}
        src="Sahih al-Bukhari 1 · Grade: Sahih" srcAt={292.72}
      />

      <Scene from={295.2} to={304.95} zoom={0.004}>
        {(() => {
          const res = prog(vt, 303.44, 0.8);
          return (
            <>
              <In at={295.46} kind="drop" x={960} y={120} center><Label text="The exact same video" size={60} /></In>
              <In at={296.34} kind="slide" x={260} y={300}>
                <div style={{transform: `scale(${1 - 0.18 * res})`, filter: `grayscale(${res})`, opacity: 1 - 0.5 * res}}><VideoCard w={560} /></div>
              </In>
              <In at={296.78} kind="slide" x={1100} y={300}>
                <div style={{transform: `scale(${1 + 0.08 * res})`, filter: `drop-shadow(0 0 ${40 * res}px rgba(31,163,74,.8))`}}><VideoCard w={560} /></div>
              </In>
              <In at={298.92} kind="pop" x={540} y={720} center><Pill text="TO SHOW OFF" color={GOLD} fg={INK} /></In>
              <In at={301.08} kind="pop" x={1380} y={720} center><Pill text="TO BENEFIT PEOPLE" color={GREEN} /></In>
              <In at={303.96} kind="rise" x={960} y={900} center><Label text="completely different results" size={56} /></In>
            </>
          );
        })()}
      </Scene>

      <Scene from={304.95} to={310.7}>
        <In at={305.0} kind="slide" x={200} y={170}><Hadi pose="phone" /></In>
        <In at={306.52} kind="pop" x={820} y={300}><div style={{background: BLUE, color: '#fff', fontFamily: POP, fontWeight: 900, fontSize: 70, borderRadius: 20, padding: '24px 80px'}}>UPLOAD</div></In>
        <In at={308.66} kind="rise" x={820} y={540}><TypeOn text="Why am I posting this?" a={308.66} b={309.5} size={80} color={DEEN} /></In>
      </Scene>

      {/* mercy */}
      <Scene from={310.7} to={316.6}>
        <In at={310.8} kind="slide" x={220} y={170}><Hadi pose="facepalm" /></In>
        <In at={312.96} kind="pop" x={820} y={330}><div style={{background: '#fff', border: `8px solid ${INK}`, borderRadius: 60, padding: '36px 56px'}}><TypeOn text="Wait… I've done some of these." a={312.96} b={314.5} size={56} font={COMIC} weight={700} /></div></In>
        <In at={315.34} kind="pop" x={1200} y={700} center><div style={{display: 'flex', alignItems: 'center', gap: 24}}><Emo name="relieved" w={160} /><Sticker text="DON'T PANIC" color={GREEN} size={110} /></div></In>
      </Scene>

      <SacredCard
        from={316.6} to={326.75} quran lead="Allah says:" leadAt={316.64} ar={T335} arAt={318.4}
        phrases={[['There is no blame on you for the mistakes you made,', 318.52, 321.2], ['but only for what your hearts intended.', 321.28, 326.75]]}
        src="Surah Al-Ahzab 33:5" srcAt={323.96}
      />

      <Scene from={326.75} to={332.45}>
        <Glow color="rgba(242,183,5,.25)" />
        <In at={326.88} kind="rise" x={960} y={360} center><Words width={1500} size={64} words={[['Allah', 326.88], ["doesn't", 327.1], ['hold', 327.74], ['us', 327.92], ['accountable', 328.14], ['for', 328.48], ['what', 328.84], ['we', 329.0], ["didn't", 329.18], ['know.', 329.5]]} /></In>
        <In at={330.46} kind="pop" x={960} y={640} center><Sticker text="But now that you know…" color={GOLD} size={100} /></In>
        <In at={332.04} kind="pop" x={960} y={800} center><Label text="you know." size={70} /></In>
      </Scene>

      <Scene from={332.45} to={339.1}>
        {(() => {
          const sun = prog(vt, 337.6, 1.2);
          return (
            <>
              <Glow color="rgba(242,183,5,.4)" y={1000 - 300 * sun} o={sun} />
              <In at={333.34} kind="slide" x={500} y={160}><Chip text="Go back & fix the titles" /></In>
              <In at={335.5} kind="slide" x={500} y={380}><Chip text="Take down what needs to come down" /></In>
              <In at={337.58} kind="slide" x={500} y={600}><Chip text="Start fresh" /></In>
              <div style={{position: 'absolute', left: 860, top: 1080 - 300 * sun, opacity: sun}}><Emo name="sunrise" w={200} /></div>
            </>
          );
        })()}
      </Scene>

      {/* dua */}
      <Scene from={339.1} to={350.6} zoom={0.003} fadeIn={0.4}>
        <Glow color="rgba(31,163,74,.22)" r={950} />
        <In at={339.2} kind="fade" x={960} y={180} center><Emo name="hands" w={170} /></In>
        <In at={339.28} kind="fade" x={960} y={420} center>
          <Words width={1600} size={58} words={[['May', 339.28], ['Allah', 339.38], ['make', 339.56], ['our', 339.92], ['videos', 340.1], ['a', 340.38], ['source', 340.68], ['of', 340.86], ['good', 341.06], ['for', 341.32], ['us,', 341.54], ['and', 342.08], ['not', 342.22], ['against', 342.44], ['us.', 342.74]]} hl={[['good', DEEN]]} />
        </In>
        <In at={343.58} kind="fade" x={960} y={620} center>
          <Words width={1600} size={58} words={[['May', 343.58], ['He', 343.68], ['forgive', 343.82], ['our', 344.12], ['mistakes,', 344.36], ['purify', 345.22], ['our', 345.74], ['intentions,', 346.0], ['and', 346.86], ['accept', 346.96], ['everything', 347.28], ['we', 347.76], ['do', 348.02], ['for', 348.26], ['His', 348.52], ['sake.', 348.74]]} />
        </In>
        <In at={349.7} kind="pop" x={960} y={860} center><Sticker text="Ameen" color={GREEN} size={130} glow="rgba(31,163,74,.6)" /></In>
      </Scene>

      {/* end screen */}
      <EndScreen from={350.6} to={VO_LEN} />
    </>
  );
};

const EndScreen: React.FC<{from: number; to: number}> = ({from, to}) => {
  const vt = useVT();
  const beat = Math.floor((vt - from) / 0.5);
  const pump = 1 + 0.06 * Math.max(0, 1 - ((vt - from) % 0.5) / 0.25);
  return (
    <Scene from={from} to={to + 1} zoom={0} fadeIn={0.4} fadeOut={0}>
      <In at={from} kind="slide" x={120} y={170}><Hadi pose="wave" /></In>
      <In at={from + 0.3} kind="pop" x={1050} y={190} center><div style={{transform: `scale(${pump})`}}><div style={{background: RED, color: '#fff', fontFamily: POP, fontWeight: 900, fontSize: 70, borderRadius: 18, padding: '22px 70px'}}>SUBSCRIBE</div></div></In>
      <In at={from + 0.6} kind="rise" x={1050} y={330} center><div style={{display: 'flex', gap: 14, alignItems: 'baseline'}}><Label text="GOAL:" size={56} /><Sticker text="1,000 subscribers" color={GOLD} size={64} /></div></In>
      {[0, 1].map((i) => (
        <In key={i} at={from + 0.9 + i * 0.3} kind="slide" x={640 + i * 640} y={480}>
          <div style={{width: 580, height: 326, borderRadius: 18, border: '6px dashed #bbb', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `rotate(${beat % 2 === i ? -1.5 : 1.5}deg)`}}><Label text="Watch next ▶" size={50} color="#999" /></div>
        </In>
      ))}
    </Scene>
  );
};

/* ================================================================ */

export const Rest: React.FC = () => {
  const {fps} = useVideoConfig();
  const F = (s: number) => Math.round(s * fps);
  const g1 = GAPS[0].len, g2 = GAPS[1].len;
  return (
    <GapProvider value={GAPS}>
      <AbsoluteFill style={{background: '#fff'}}>
        <Sequence from={0} durationInFrames={F(R1_AT)}><Audio src={staticFile('audio/03-point2.mp3')} /></Sequence>
        <Sequence from={F(R1_AT + PAD_IN)}><Audio src={staticFile('audio/r1-tawbah.wav')} /></Sequence>
        <Sequence from={F(R1_AT + g1)} durationInFrames={F(R2_AT - R1_AT)}><Audio src={staticFile('audio/03-point2.mp3')} startFrom={F(R1_AT)} /></Sequence>
        <Sequence from={F(R2_AT + g1 + PAD_IN)}><Audio src={staticFile('audio/r2-hujurat.wav')} /></Sequence>
        <Sequence from={F(R2_AT + g1 + g2)}><Audio src={staticFile('audio/03-point2.mp3')} startFrom={F(R2_AT)} /></Sequence>
        <Point2 />
        <Point3 />
        <Point4 />
        <Point5 />
        <Point6 />
        <Escalation />
        <Closing />
        <RedWipe at={204.75} />
      </AbsoluteFill>
    </GapProvider>
  );
};

void sh; void COMIC;
