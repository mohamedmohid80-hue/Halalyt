import React from 'react';
import {AbsoluteFill, Audio, Img, interpolate, staticFile} from 'remotion';
import {
  AMIRI, Box, Count, DEEN, Draw, Emo, GapProvider, Glow, GOLD, GREEN, GREY, Hadi, In, INK, Label, NUN, Pill, POP, RED,
  RedWipe, Scene, Sticker, clamp, easeOut, prog, useVT,
} from './kit';
import {loadFont as loadHand} from '@remotion/google-fonts/PatrickHand';

const HAND = loadHand('normal', {weights: ['400'], subsets: ['latin']}).fontFamily;

export const EP03_FPS = 30;
export const EP03_DURATION_S = 238.5;

const S = (f: string) => staticFile(`share/${f}`);

/* ---------- v3 building blocks ---------- */

/** Real screenshot / photo card, rounded with a soft shadow. */
const Shot: React.FC<{src: string; w: number; h?: number; glow?: string; dim?: number; blur?: number}> = ({src, w, h, glow, dim = 0, blur = 0}) => (
  <div style={{width: w, height: h, borderRadius: 18, overflow: 'hidden', position: 'relative', boxShadow: glow ? `0 0 50px ${glow}, 0 18px 40px rgba(0,0,0,.28)` : '0 18px 40px rgba(0,0,0,.28)'}}>
    <Img src={S(src)} style={{width: '100%', height: h ? '100%' : undefined, objectFit: 'cover', display: 'block', filter: blur ? `blur(${blur}px)` : undefined}} />
    {dim > 0 && <div style={{position: 'absolute', inset: 0, background: `rgba(0,0,0,${dim})`}} />}
  </div>
);

/** Word-by-word line in the handwritten caps font: next word fades in from grey; key words in red. */
const Hand: React.FC<{words: [string, number][]; size?: number; width?: number; keys?: string[]; color?: string; keyColor?: string; align?: 'center' | 'left'}> = ({
  words, size = 84, width = 1600, keys = [], color = INK, keyColor = RED, align = 'center',
}) => {
  const vt = useVT();
  return (
    <div style={{width, textAlign: align, fontFamily: HAND, fontSize: size, lineHeight: 1.28, textTransform: 'uppercase', letterSpacing: 1}}>
      {words.map(([w, at], i) => {
        const p = prog(vt, at - 0.12, 0.28);
        const key = keys.some((k) => w.toLowerCase().replace(/[^a-z']/g, '').startsWith(k));
        const col = p >= 1 ? (key ? keyColor : color) : `rgba(150,150,150,${p})`;
        return <span key={i} style={{color: col, marginRight: '0.3em', display: 'inline-block'}}>{w}</span>;
      })}
    </div>
  );
};

/** Red hand-drawn arrow plus a label that types in. */
const ArrowLabel: React.FC<{x1: number; y1: number; x2: number; y2: number; text: string; at: number; color?: string}> = ({x1, y1, x2, y2, text, at, color = RED}) => (
  <>
    <Draw d={`M${x1},${y1} Q${(x1 + x2) / 2},${Math.min(y1, y2) - 40} ${x2},${y2}`} at={at} color={color} width={8} arrow />
    <In at={at + 0.2} kind="fade" x={x2 + 20} y={y2 - 46}><div style={{fontFamily: HAND, fontSize: 70, color, textTransform: 'uppercase', whiteSpace: 'nowrap'}}>{text}</div></In>
  </>
);

/** Phone frame showing a real post. */
const Phone: React.FC<{src: string; dim?: number; children?: React.ReactNode}> = ({src, dim = 0, children}) => (
  <div style={{width: 470, height: 860, borderRadius: 70, background: '#0b0b0e', padding: 22, boxShadow: '0 30px 60px rgba(0,0,0,.45)'}}>
    <div style={{width: '100%', height: '100%', borderRadius: 50, overflow: 'hidden', position: 'relative', background: '#000'}}>
      <Img src={S(src)} style={{position: 'absolute', height: '100%', left: '50%', transform: 'translateX(-50%)'}} />
      {dim > 0 && <div style={{position: 'absolute', inset: 0, background: `rgba(0,0,0,${dim})`}} />}
      {children}
    </div>
  </div>
);

/** Red lower-third chapter title. */
const LowerThird: React.FC<{text: string; at: number}> = ({text, at}) => (
  <In at={at} kind="slideL" x={60} y={900}>
    <div style={{background: '#fff', border: `6px solid ${INK}`, padding: '10px 34px', fontFamily: POP, fontWeight: 900, fontSize: 62, color: RED, whiteSpace: 'nowrap'}}>{text}</div>
  </In>
);

/** Calligraphy-style seal used when quoting the Prophet ﷺ. */
const Seal: React.FC<{label: string; size?: number}> = ({label, size = 300}) => (
  <div style={{width: size, height: size, borderRadius: '50%', background: 'radial-gradient(circle,#7A4A1E,#4A2A0E)', border: '10px solid #C89A4A', boxShadow: '0 0 0 6px #4A2A0E, 0 16px 30px rgba(0,0,0,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
    <div style={{fontFamily: AMIRI, fontWeight: 700, fontSize: size * 0.36, color: '#F3D58A', direction: 'rtl'}}>{label}</div>
  </div>
);

/** Quran card: Arabic on top (shown, not recited), English in quotes typed word by word, reference small at the bottom. */
const Ayah: React.FC<{from: number; to: number; ar: string; en: [string, number][]; source: string}> = ({from, to, ar, en, source}) => {
  const vt = useVT();
  return (
    <Scene from={from} to={to} fadeIn={0.4} fadeOut={0.35} zoom={0.004}>
      <Glow o={0.55 + 0.2 * Math.sin(vt * 1.6)} r={850} />
      <div style={{position: 'absolute', left: 230, top: 130, width: 1460, height: 820, background: '#fff', border: '3px solid #E8C766', borderRadius: 14, boxShadow: '0 0 60px rgba(242,183,5,.35)', padding: '60px 90px'}}>
        <div style={{fontFamily: AMIRI, fontWeight: 700, fontSize: ar.length > 120 ? 54 : 66, direction: 'rtl', textAlign: 'center', lineHeight: 1.8, color: '#111', opacity: prog(vt, from, 0.6)}}>{ar}</div>
        <div style={{marginTop: 40, display: 'flex', justifyContent: 'center'}}>
          <div style={{fontFamily: NUN, fontWeight: 800, fontSize: 52, textAlign: 'center', lineHeight: 1.45, width: 1260}}>
            {en.map(([w, at], i) => (
              <span key={i} style={{opacity: prog(vt, at - 0.1, 0.25), marginRight: '0.28em', display: 'inline-block', color: '#222'}}>{w}</span>
            ))}
          </div>
        </div>
        <div style={{position: 'absolute', bottom: 46, left: 0, right: 0, textAlign: 'center', fontFamily: NUN, fontWeight: 800, fontSize: 34, color: '#9A7A10', opacity: prog(vt, from + 0.5, 0.5)}}>{source}</div>
      </div>
    </Scene>
  );
};

/* ---------- section components ---------- */

const Intro: React.FC = () => {
  const vt = useVT();
  return (
    <>
      {/* 1. Late at night with a phone */}
      <Scene from={0} to={1.7} zoom={0.04}>
        <Img src={S('phone-hand.jpg')} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(.45) saturate(.7) hue-rotate(195deg)'}} />
        <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 52% 48%,rgba(80,120,255,.25),rgba(0,0,0,.65) 70%)'}} />
        <In at={0.3} kind="fade" x={1500} y={60}><div style={{fontFamily: HAND, fontSize: 100, color: '#fff'}}>2:14 AM</div></In>
      </Scene>
      {/* 2–3. Real post on the phone, caption slides up */}
      <Scene from={1.7} to={7.2} zoom={0.01}>
        <In at={1.76} kind="rise" x={725} y={110}>
          <Phone src="yt-stop-scrolling.png" dim={vt >= 5.48 ? interpolate(vt, [5.48, 5.9], [0, 0.55], clamp) : 0}>
            {vt >= 5.48 && (
              <div style={{position: 'absolute', left: 26, right: 26, bottom: 90 - 60 * (1 - prog(vt, 5.48, 0.35)), background: 'rgba(0,0,0,.8)', borderRadius: 20, padding: 22, fontFamily: NUN, fontWeight: 800, fontSize: 34, color: '#fff', opacity: prog(vt, 5.48, 0.35)}}>Share this with 10 people…</div>
            )}
          </Phone>
        </In>
        {vt >= 2.36 && vt < 5.4 && (
          <div style={{position: 'absolute', left: 760, top: 990, display: 'flex', gap: 10, alignItems: 'flex-end', height: 60}}>
            {Array.from({length: 22}, (_, i) => <div key={i} style={{width: 10, height: 10 + 40 * Math.abs(Math.sin(i * 0.8 + vt * 7)), background: GOLD, borderRadius: 4}} />)}
          </div>
        )}
      </Scene>
      {/* 4. Caption 1 */}
      <Scene from={7.2} to={11.3} zoom={0.008}>
        <In at={7.2} kind="fade" x={960} y={480} center>
          <Hand size={96} keys={['10', 'people', 'tonight']} words={[['"Share', 7.32], ['this', 7.34], ['with', 7.56], ['10', 7.78], ['people', 8.04], ['and', 8.44], ['Allah', 8.9], ['will', 9.14], ['open', 9.44], ['a', 9.72], ['door', 9.88], ['for', 10.0], ['you', 10.2], ['tonight."', 10.34]]} />
        </In>
      </Scene>
      {/* 5. Caption 2 */}
      <Scene from={11.3} to={14.4} zoom={0.008}>
        <In at={11.3} kind="fade" x={960} y={520} center>
          <Hand size={112} keys={['shaytan', 'stopped']} words={[['"If', 11.38], ['you', 11.5], ['scroll', 11.62], ['past', 11.9], ['this,', 12.16], ['Shaytan', 12.98], ['stopped', 13.24], ['you."', 13.58]]} />
        </In>
      </Scene>
      {/* 6. So you share it */}
      <Scene from={14.4} to={15.7}>
        <In at={14.4} kind="slide" x={330} y={170}><Hadi pose="phone" /></In>
        <In at={14.6} kind="pop" x={1000} y={420}>
          <div style={{background: '#FFD400', border: `6px solid ${INK}`, borderRadius: 24, padding: '24px 70px', fontFamily: POP, fontWeight: 900, fontSize: 90, transform: `scale(${vt >= 14.82 && vt < 14.95 ? 0.92 : 1})`}}>SHARE</div>
        </In>
        <In at={14.9} kind="rise" x={1420} y={330}><Sticker text="+1" color={GREEN} size={90} /></In>
      </Scene>
      {/* 7. Who would scroll past the Quran */}
      <Scene from={15.7} to={18.2} zoom={0.015}>
        <Glow o={0.6} />
        <In at={15.74} kind="fade" x={960} y={540} center><Shot src="quran.jpg" w={900} glow="rgba(242,183,5,.55)" /></In>
      </Scene>
      {/* 8. Millions of Muslims: cascade of real thumbnails */}
      <Scene from={18.2} to={21.8} zoom={0.008}>
        {([['yt-allah-warning.png', 80, 110, -4], ['yt-letter.png', 690, 80, 3], ['yt-last-advice.png', 1300, 130, -2], ['yt-warning-now.png', 250, 560, 2], ['yt-message.png', 880, 590, -3]] as [string, number, number, number][]).map(([f, x, y, r], i) => (
          <In key={i} at={18.3 + i * 0.35} kind="slide" x={x} y={y} rot={r}><Shot src={f} w={540} /></In>
        ))}
        <In at={19.6} kind="pop" x={1470} y={660}><div style={{background: INK, borderRadius: 16, padding: '10px 30px'}}><Count to={1000000} a={19.6} b={20.9} suffix="+" size={70} color="#7CFF8A" /></div></In>
      </Scene>
      {/* 9. What if I told you */}
      <Scene from={21.8} to={26.4}>
        <In at={21.84} kind="slide" x={460} y={140}><Shot src="meme-rollsafe.jpg" w={1000} /></In>
      </Scene>
      {/* 10. Sharing the Quran is beautiful */}
      <Scene from={26.4} to={30.6}>
        <In at={26.5} kind="slide" x={330} y={220}><Shot src="quran.jpg" w={720} /></In>
        <In at={28.1} kind="stamp" x={1360} y={540} center>
          <div style={{width: 300, height: 300, borderRadius: '50%', background: GREEN, color: '#fff', fontFamily: POP, fontWeight: 900, fontSize: 210, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 50px rgba(31,163,74,.6)'}}>✓</div>
        </In>
      </Scene>
      {/* 11. What they attach to it */}
      <Scene from={30.6} to={33.2} zoom={0.006}>
        <In at={30.64} kind="slide" x={130} y={270}><Shot src="yt-dont-skip.png" w={760} /></In>
        <ArrowLabel x1={930} y1={380} x2={1200} y2={270} text="pressure" at={31.0} />
        <ArrowLabel x1={930} y1={490} x2={1200} y2={490} text="threats" at={31.6} />
        <ArrowLabel x1={930} y1={600} x2={1200} y2={710} text="fake promises" at={32.1} />
      </Scene>
      {/* 12. Roadmap */}
      <Scene from={33.2} to={40.3} zoom={0.004}>
        <In at={33.2} kind="slide" x={90} y={170}><Hadi pose="point" /></In>
        <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
          <line x1={760} y1={560} x2={760 + 1060 * prog(vt, 33.9, 1.2)} y2={560} stroke={INK} strokeWidth={8} />
        </svg>
        {(['guilt trip', 'fake promises', 'fear → money', 'instead'] as const).map((t, i) => (
          <React.Fragment key={i}>
            <In at={i < 3 ? 35.04 + i * 0.3 : 37.26} kind="pop" x={820 + i * 320} y={560} center>
              <div style={{width: 92, height: 92, borderRadius: '50%', background: i < 3 ? RED : GREEN, color: '#fff', fontFamily: POP, fontWeight: 900, fontSize: 54, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{i < 3 ? i + 1 : '✓'}</div>
            </In>
            <In at={i < 3 ? 35.2 + i * 0.3 : 37.4} kind="fade" x={820 + i * 320} y={650} center>
              <div style={{fontFamily: HAND, fontSize: 48, textTransform: 'uppercase', color: i < 3 ? INK : GREEN, whiteSpace: 'nowrap'}}>{t}</div>
            </In>
          </React.Fragment>
        ))}
      </Scene>
    </>
  );
};

const Point1: React.FC = () => {
  const vt = useVT();
  return (
    <>
      <Scene from={40.3} to={42.5}>
        <In at={40.34} kind="slide" x={1250} y={170}><Hadi pose="think" /></In>
        <In at={40.34} kind="pop" x={540} y={420} center><Sticker text="#1" color={GOLD} size={220} /></In>
        <LowerThird text="#1 THEY GUILT TRIP YOU" at={40.6} />
      </Scene>
      {/* the three guilt-trip captions, as real-post style comment bubbles */}
      <Scene from={42.5} to={50.8} zoom={0.006}>
        {([['"If you scroll past this, Shaytan stopped you."', 42.6, 120], ['"Only true believers will share this."', 45.66, 400], ['"Let\'s see how many people really love Allah."', 48.14, 680]] as [string, number, number][]).map(([t, at, y], i) => (
          <In key={i} at={at} kind="slide" x={260} y={y}>
            <div style={{display: 'flex', alignItems: 'center', gap: 26}}>
              <div style={{width: 110, height: 110, borderRadius: '50%', background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: AMIRI, fontSize: 52, color: GOLD}}>☪</div>
              <div style={{background: '#F1F1F1', borderRadius: 34, padding: '26px 40px', fontFamily: NUN, fontWeight: 800, fontSize: 50, maxWidth: 1250}}>{t}</div>
            </div>
          </In>
        ))}
      </Scene>
      {/* Read that again */}
      <Scene from={50.8} to={56.5}>
        <In at={50.92} kind="fade" x={960} y={180} center><Hand size={70} words={[['Read', 50.92], ['that', 51.06], ['again.', 51.24]]} /></In>
        <In at={52.18} kind="slide" x={340} y={330}>
          <div style={{background: '#FFD400', border: `6px solid ${INK}`, borderRadius: 24, padding: '20px 60px', fontFamily: POP, fontWeight: 900, fontSize: 80, opacity: 0.6}}>SHARE</div>
        </In>
        <Draw d="M820,420 C900,420 960,500 1080,520" at={53.6} color={RED} width={10} arrow />
        <In at={54.5} kind="pop" x={1110} y={430}><Box w={560} h={220} color={RED}><Label text="something is wrong" size={44} color={RED} /><Label text="with your iman?" size={44} color={RED} /></Box></In>
      </Scene>
      {/* Who gave them the right */}
      <Scene from={56.5} to={64.2}>
        <In at={56.6} kind="slide" x={150} y={170}><Hadi pose="shock" /></In>
        <In at={56.74} kind="fade" x={1150} y={300} center><Hand size={78} width={1200} keys={['right']} words={[['Who', 56.74], ['gave', 56.92], ['them', 57.12], ['the', 57.32], ['right?', 57.46]]} /></In>
        <In at={59.0} kind="rise" x={1150} y={520} center><Label text="Why you scrolled past?" size={52} color={GREY} /></In>
        <In at={61.3} kind="rise" x={1150} y={640} center><Label text="What Shaytan did?" size={52} color={GREY} /></In>
        <In at={62.0} kind="pop" x={1600} y={760}><Emo name="thinking" w={160} /></In>
      </Scene>
      <Ayah from={64.2} to={70.7}
        ar="قُل لَّا يَعْلَمُ مَن فِى ٱلسَّمَٰوَٰتِ وَٱلْأَرْضِ ٱلْغَيْبَ إِلَّا ٱللَّهُ"
        en={[['"Say,', 66.04], ['none', 66.64], ['in', 66.9], ['the', 67.12], ['heavens', 67.26], ['and', 67.46], ['the', 67.74], ['earth', 67.88], ['knows', 68.08], ['the', 68.44], ['unseen', 68.72], ['except', 69.18], ['Allah."', 69.68]]}
        source="Surah An-Naml 27:65" />
      {/* Only Allah knows your heart: page vs heart */}
      <Scene from={70.7} to={78.7} zoom={0.004}>
        <In at={70.78} kind="pop" x={360} y={300}><Emo name="heart" w={300} glow="rgba(31,163,74,.6)" /></In>
        <In at={71.0} kind="rise" x={510} y={660} center><Label text="Only Allah knows" size={52} color={DEEN} /></In>
        <In at={72.98} kind="slide" x={1050} y={260}>
          <Box w={720} h={360} color={GREY}><Label text="A page with" size={56} color={GREY} /><Count to={1000000} a={73.3} b={74.2} size={80} color={GREY} /><Label text="followers" size={56} color={GREY} /></Box>
        </In>
        <In at={74.3} kind="stamp" x={1410} y={440} center><Emo name="cross" w={200} /></In>
        <In at={75.36} kind="rise" x={960} y={880} center>
          <Hand size={64} width={1700} keys={['measured', 'share']} words={[['Your', 75.36], ['love', 75.5], ['for', 75.72], ['Allah', 75.96], ['is', 76.22], ['not', 76.52], ['measured', 76.84], ['by', 77.18], ['a', 77.42], ['share', 77.6], ['button.', 77.76]]} />
        </In>
      </Scene>
    </>
  );
};

const Point2: React.FC = () => (
  <>
    <Scene from={78.7} to={81.3}>
      <In at={78.8} kind="slide" x={1250} y={170}><Hadi pose="facepalm" /></In>
      <In at={78.8} kind="pop" x={540} y={420} center><Sticker text="#2" color={GOLD} size={220} /></In>
      <LowerThird text="#2 FAKE PROMISES" at={79.0} />
    </Scene>
    {/* three fake promises with "receipts" */}
    <Scene from={81.3} to={91.4} zoom={0.005}>
      {([['Share → good news in 24 hours', 81.42, 'hourglass', GREEN], ['Send to 7 → problems solved', 84.9, 'check', GREEN], ['Ignore → bad luck for a year', 88.26, 'warning', RED]] as [string, number, string, string][]).map(([t, at, e, c], i) => (
        <In key={i} at={at} kind="slide" x={250} y={150 + i * 270}>
          <div style={{display: 'flex', alignItems: 'center', gap: 30, background: '#fff', border: `6px solid ${c}`, borderRadius: 28, padding: '24px 40px', width: 1420, boxShadow: '0 10px 24px rgba(0,0,0,.08)'}}>
            <Emo name={e} w={120} />
            <Label text={t} size={58} align="left" />
          </div>
        </In>
      ))}
    </Scene>
    {/* Where did they get that from */}
    <Scene from={91.4} to={97.3}>
      <In at={91.54} kind="fade" x={960} y={200} center><Hand size={86} keys={['where']} words={[['Where', 91.54], ['did', 91.6], ['they', 91.74], ['get', 91.88], ['that', 92.04], ['from?', 92.24]]} /></In>
      <In at={93.02} kind="slide" x={330} y={380}><Shot src="quran.jpg" w={520} /></In>
      <In at={93.5} kind="stamp" x={590} y={530} center><Emo name="cross" w={170} /></In>
      <In at={94.36} kind="slide" x={1150} y={360}><Seal label="محمد ﷺ" size={320} /></In>
      <In at={95.2} kind="stamp" x={1310} y={520} center><Emo name="cross" w={170} /></In>
      <In at={94.0} kind="rise" x={590} y={840} center><Label text="Not in the Quran" size={46} color={RED} /></In>
      <In at={95.0} kind="rise" x={1310} y={840} center><Label text="Not from the Prophet ﷺ" size={46} color={RED} /></In>
    </Scene>
    <Ayah from={97.3} to={104.3}
      ar="وَأَن تَقُولُوا۟ عَلَى ٱللَّهِ مَا لَا تَعْلَمُونَ"
      en={[['Allah', 97.44], ['has', 98.7], ['forbidden…', 98.8], ['"that', 101.4], ['you', 101.48], ['say', 101.64], ['about', 101.92], ['Allah', 102.2], ['what', 102.58], ['you', 102.98], ['do', 103.18], ['not', 103.34], ['know."', 103.52]]}
      source="Surah Al-A'raf 7:33" />
    <Ayah from={104.3} to={109.1}
      ar="وَلَا تَقُولُوا۟ لِمَا تَصِفُ أَلْسِنَتُكُمُ ٱلْكَذِبَ هَٰذَا حَلَٰلٌ وَهَٰذَا حَرَامٌ لِّتَفْتَرُوا۟ عَلَى ٱللَّهِ ٱلْكَذِبَ"
      en={[['A', 104.38], ['warning', 104.88], ['against', 105.26], ['making', 105.62], ['up', 105.9], ['rules', 106.12], ['with', 106.38], ['your', 106.64], ['tongue', 106.82], ['and', 107.12], ['lying', 107.44], ['about', 107.76], ['Allah.', 108.06]]}
      source="Surah An-Nahl 16:116" />
    {/* speaking on Allah's behalf, with a time limit */}
    <Scene from={109.1} to={121.1} zoom={0.004}>
      <In at={109.22} kind="fade" x={960} y={170} center>
        <Hand size={72} width={1700} keys={['never', 'promised']} words={[['Promising', 109.22], ['a', 109.52], ['reward', 109.7], ['that', 110.06], ['Allah', 110.3], ['never', 110.58], ['promised', 110.98]]} />
      </In>
      <In at={111.4} kind="stamp" x={960} y={400} center><Sticker text="NOT A SMALL THING" color={RED} size={110} /></In>
      <In at={113.12} kind="rise" x={960} y={560} center><Label text="It's speaking on Allah's behalf." size={56} /></In>
      <In at={116.36} kind="slide" x={560} y={680}><Shot src="yt-dont-skip.png" w={460} /></In>
      <In at={118.04} kind="pop" x={1120} y={720}>
        <div style={{background: RED, color: '#fff', borderRadius: 18, padding: '18px 34px', fontFamily: POP, fontWeight: 900, fontSize: 60}}>⏱ {Math.max(0, Math.ceil(interpolate(useVT(), [118.04, 120.6], [10, 0], clamp)))}s</div>
      </In>
      <In at={119.56} kind="rise" x={1330} y={860} center><Label text="so you don't stop to think" size={42} color={GREY} /></In>
    </Scene>
  </>
);

const Point3: React.FC = () => {
  const vt = useVT();
  const steps: [string, string, number][] = [['Sees the Quran', 'books', 127.46], ['Feels scared to scroll', 'pensive', 129.24], ['Shares · comments · Ameen', 'speech', 131.3], ['Post goes viral', 'chart', 134.62], ['Page grows', 'moneybag', 136.06]];
  return (
    <>
      <Scene from={121.1} to={125.4}>
        <In at={121.2} kind="slide" x={1250} y={170}><Hadi pose="shock" /></In>
        <In at={121.2} kind="pop" x={540} y={420} center><Sticker text="#3" color={GOLD} size={220} /></In>
        <LowerThird text="#3 YOUR FEAR → THEIR MONEY" at={121.5} />
      </Scene>
      {/* the pipeline */}
      <Scene from={125.4} to={138.4} zoom={0.003}>
        <In at={125.52} kind="drop" x={960} y={110} center><Label text="How these posts work" size={60} /></In>
        {steps.map(([t, e, at], i) => (
          <React.Fragment key={i}>
            <In at={at} kind="pop" x={110 + i * 360} y={330}>
              <Box w={320} h={340} color={i === 4 ? GOLD : INK}><Emo name={e} w={120} /><Label text={t} size={36} /></Box>
            </In>
            {i < 4 && <Draw d={`M${440 + i * 360},500 L${465 + i * 360},500`} at={steps[i + 1][2] - 0.15} arrow width={8} />}
          </React.Fragment>
        ))}
        <In at={137.28} kind="pop" x={960} y={820} center><Sticker text="And then what?" color={RED} size={90} /></In>
      </Scene>
      {/* where the views go */}
      <Scene from={138.4} to={147.8} zoom={0.004}>
        <In at={138.48} kind="slide" x={130} y={230}><Box w={480} h={420} color={GREEN}><Emo name="moneybag" w={170} /><Label text="Money from views" size={46} /></Box></In>
        <In at={141.26} kind="slide" x={720} y={230}><Box w={480} h={420} color={GOLD}><Emo name="chart" w={170} /><Label text="Start selling things" size={46} /></Box></In>
        <In at={143.14} kind="slide" x={1310} y={230}>
          <Box w={480} h={420} color={RED}><div style={{background: RED, color: '#fff', fontFamily: POP, fontWeight: 900, fontSize: 56, padding: '10px 26px', borderRadius: 10, transform: 'rotate(-4deg)'}}>PAGE FOR SALE</div><Label text="Sold, with your followers" size={42} /></Box>
        </In>
        <In at={146.34} kind="rise" x={960} y={790} center><Label text="…the followers you helped build" size={52} color={GREY} /></In>
      </Scene>
      {/* fear → dashboard */}
      <Scene from={147.8} to={154.4} zoom={0.004}>
        <In at={147.9} kind="slide" x={180} y={300}><Emo name="hands" w={340} glow="rgba(31,163,74,.6)" /></In>
        <In at={148.5} kind="rise" x={350} y={720} center><Label text="Your fear of Allah" size={50} color={DEEN} /></In>
        <Draw d="M640,470 C860,380 1020,380 1180,450" at={151.64} color={RED} width={12} arrow />
        <In at={152.18} kind="slide" x={1200} y={250}>
          <div style={{width: 580, height: 400, background: '#111827', borderRadius: 20, padding: 30, boxShadow: '0 18px 40px rgba(0,0,0,.35)'}}>
            <div style={{fontFamily: NUN, fontWeight: 800, fontSize: 30, color: '#9CA3AF'}}>Page dashboard</div>
            <Count to={4812000} a={152.3} b={153.3} suffix=" views" size={56} color="#7CFF8A" />
            <svg width={520} height={190}><polyline points="0,180 80,160 160,150 240,110 320,90 400,40 520,10" fill="none" stroke="#7CFF8A" strokeWidth={8} /></svg>
          </div>
        </In>
      </Scene>
      <Ayah from={154.4} to={162.9}
        ar="وَلَا تَشْتَرُوا۟ بِـَٔايَٰتِى ثَمَنًا قَلِيلًا وَإِيَّٰىَ فَٱتَّقُونِ"
        en={[['"And', 158.16], ['do', 158.16], ['not', 158.28], ['exchange', 158.46], ['My', 158.92], ['verses', 159.16], ['for', 159.46], ['a', 159.8], ['small', 159.94], ['price,', 160.2], ['and', 160.58], ['fear', 161.16], ['only', 161.56], ['Me."', 161.98]]}
        source="Surah Al-Baqarah 2:41" />
      {/* hadith: the reciter */}
      <Scene from={162.9} to={176.4} fadeIn={0.4} zoom={0.004}>
        <In at={163.0} kind="slide" x={140} y={260}><Seal label="محمد ﷺ" size={330} /></In>
        <In at={163.5} kind="fade" x={600} y={200}>
          <div style={{width: 1180, background: '#1F2937', borderRadius: 18, padding: '40px 50px', color: '#fff', fontFamily: NUN}}>
            <div style={{fontWeight: 800, fontSize: 38, lineHeight: 1.45}}>
              Among the first judged on the Day of Judgement is <span style={{color: vt >= 169.5 ? '#7CFF8A' : '#fff'}}>a man who recited the Quran</span>… <span style={{color: vt >= 173.4 ? '#FFB4A8' : '#fff'}}>so that people would say, "he is a reciter."</span>
            </div>
            <div style={{marginTop: 26, fontWeight: 800, fontSize: 30}}>Grade: <span style={{color: '#7CFF8A'}}>Sahih</span></div>
            <div style={{fontWeight: 800, fontSize: 28, color: '#9CA3AF'}}>Reference: Sahih Muslim 1905</div>
          </div>
        </In>
      </Scene>
      {/* praise vs views */}
      <Scene from={176.4} to={181.9}>
        <In at={176.6} kind="slide" x={230} y={300}><Box w={560} h={380} color={GOLD}><Emo name="studio" w={150} /><Label text="Reciting for praise" size={46} /></Box></In>
        <In at={178.4} kind="stamp" x={510} y={250} center><Pill text="THAT SERIOUS" color={RED} size={46} /></In>
        <In at={179.6} kind="slide" x={1130} y={300}><Box w={560} h={380} color={RED}><Emo name="eyes" w={150} /><Label text="Using it for views?" size={46} color={RED} /></Box></In>
      </Scene>
      {/* not every page */}
      <Scene from={181.9} to={197.1} zoom={0.004}>
        <In at={182.0} kind="slide" x={160} y={170}><Hadi pose="neutral" /></In>
        <In at={183.34} kind="rise" x={1150} y={240} center><Label text="Not every page is doing this." size={58} /></In>
        <In at={186.36} kind="pop" x={1150} y={380} center><Pill text="Many share sincerely ✓" color={GREEN} size={46} /></In>
        <In at={190.18} kind="fade" x={1150} y={560} center>
          <Hand size={62} width={1100} keys={['pressure', 'threats', 'fake', 'promises']} words={[['But', 190.08], ['with', 191.06], ['pressure,', 191.32], ['threats', 192.14], ['and', 192.4], ['fake', 192.8], ['promises', 193.08]]} />
        </In>
        <In at={194.24} kind="rise" x={1150} y={800} center><Label text="Who is that post really serving?" size={52} color={RED} /></In>
      </Scene>
    </>
  );
};

const Instead: React.FC = () => (
  <>
    <Scene from={197.1} to={198.7}>
      <In at={197.26} kind="pop" x={960} y={480} center><Sticker text="SO WHAT SHOULD YOU DO?" color={GREEN} size={110} /></In>
    </Scene>
    <Scene from={198.7} to={214.8} zoom={0.004}>
      <In at={198.8} kind="slide" x={260} y={160}>
        <div style={{display: 'flex', alignItems: 'center', gap: 30}}><Emo name="heart" w={130} /><Label text="Share it because you love it" size={60} align="left" /></div>
      </In>
      <In at={200.8} kind="rise" x={420} y={320}><Label text="not because someone scared you into it" size={46} color={GREY} align="left" /></In>
      <In at={202.72} kind="slide" x={260} y={450}>
        <div style={{display: 'flex', alignItems: 'center', gap: 30}}><Emo name="cross" w={130} /><Label text="Threats · guilt trips · fake promises → don't share that version" size={50} align="left" /></div>
      </In>
      <In at={210.38} kind="slide" x={260} y={720}>
        <div style={{display: 'flex', alignItems: 'center', gap: 30}}><Emo name="check" w={130} /><Label text="Same verse, sincere source, your own words" size={56} align="left" /></div>
      </In>
    </Scene>
    <Scene from={214.8} to={221.6}>
      <In at={214.9} kind="fade" x={960} y={220} center><Label text="If you really want the reward…" size={60} color={GREY} /></In>
      {([['READ IT', 218.48], ['UNDERSTAND IT', 219.46], ['LIVE IT', 220.64]] as [string, number][]).map(([t, at], i) => (
        <In key={i} at={at} kind="pop" x={400 + i * 560} y={560} center><Sticker text={t} color={i === 2 ? GREEN : '#fff'} size={84} /></In>
      ))}
    </Scene>
    {/* mercy */}
    <Scene from={221.6} to={232.1}>
      <Glow color="rgba(31,163,74,.22)" />
      <In at={221.66} kind="slide" x={220} y={170}><Hadi pose="thumbsup" /></In>
      <In at={223.78} kind="pop" x={1180} y={300} center><Sticker text="DON'T PANIC" color={GREEN} size={120} /></In>
      <In at={226.08} kind="rise" x={1180} y={480} center><Label text="Allah knows your intention." size={56} color={DEEN} /></In>
      <In at={230.04} kind="pop" x={1180} y={680} center><Sticker text="Now you know." color={GOLD} size={110} /></In>
    </Scene>
  </>
);

const Outro: React.FC = () => {
  const vt = useVT();
  const pump = 1 + 0.06 * Math.max(0, 1 - ((vt - 232.2) % 0.5) / 0.25);
  return (
    <Scene from={232.1} to={EP03_DURATION_S + 1} zoom={0} fadeIn={0.3} fadeOut={0}>
      <In at={232.1} kind="slide" x={170} y={170}><Hadi pose="wave" /></In>
      <In at={233.94} kind="pop" x={1180} y={460} center>
        <div style={{transform: `scale(${pump})`}}><div style={{background: RED, color: '#fff', fontFamily: POP, fontWeight: 900, fontSize: 96, borderRadius: 22, padding: '28px 90px'}}>SUBSCRIBE</div></div>
      </In>
      <In at={235.32} kind="rise" x={1180} y={660} center><Label text="for more content" size={56} color={GREY} /></In>
    </Scene>
  );
};

export const Ep03: React.FC = () => (
  <GapProvider value={[]}>
    <AbsoluteFill style={{background: '#fff'}}>
      <Audio src={staticFile('audio/03-share-quran.mp3')} />
      <Intro />
      <Point1 />
      <Point2 />
      <Point3 />
      <Instead />
      <Outro />
      <RedWipe at={40.3} />
      <RedWipe at={78.7} />
      <RedWipe at={121.1} />
    </AbsoluteFill>
  </GapProvider>
);

void easeOut; void Pill;
