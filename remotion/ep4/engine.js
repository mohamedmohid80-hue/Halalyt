// ---------- engine ----------
export const EP04F_FPS = 30;
export const EP04F_DURATION_S = Math.round((VO_TOTAL + 0.8) * 10) / 10;

// Sound effects are kept for a few real moments only (stamps, the phone/alarm buzz, a handful of
// whooshes and dings), never closer than SFX_GAP seconds apart, and quiet under the voice.
const SFX_VOL = {thud: .10, whoosh: .06, tick: .07, buzz: .12, ding: .06};
const DEFAULT_SFX = {stamp: 'thud'};
const SFX_GAP = 4;
// time map: the scenes are written on the original voiceover's clock; TMAP maps it onto the new recording
const pw = (x, pairs, i, j) => { for (let k = 1; k < pairs.length; k++) if (x <= pairs[k][i]) { const [a, b] = [pairs[k - 1], pairs[k]]; return a[j] + (b[j] - a[j]) * (x - a[i]) / (b[i] - a[i]); } const a = pairs[pairs.length - 1]; return a[j] + (x - a[i]); };
const toOld = (t) => pw(t, TMAP, 1, 0);
const toNew = (t) => pw(t, TMAP, 0, 1);
const absAt = (sc, it) => (it.at === 0 ? sc.from : it.at);
const htmlAt = (it, t) => (typeof it.h === 'function' ? it.h(t) : it.h);
const num = (re, s, d) => { const m = re.exec(s); return m ? parseFloat(m[1]) : d; };
const geom = (html) => {
  const arrowX = /data-k="arrow"[\s\S]*?d="M\s*([\d.]+)/.exec(html);
  const x = arrowX ? parseFloat(arrowX[1]) : num(/left:\s*(-?[\d.]+)px/, html, 0);
  const y = num(/top:\s*(-?[\d.]+)px/, html, 0);
  const w = num(/width:\s*([\d.]+)px/, html, 300), h = num(/height:\s*([\d.]+)px/, html, 80);
  return {x, y, w: Math.min(w, 1920), h: Math.min(h, 1080)};
};

const Item = ({sc, it, t}) => {
  const at = absAt(sc, it);
  const lead = it.a === 'slideL' || it.a === 'slideR' ? .2 : .05;
  if (t < at - lead) return null;
  const html = htmlAt(it, t);
  const g = geom(html);
  const dt = t - at;
  const p = (d) => Math.max(0, Math.min(1, dt / d));
  const eo = (x) => 1 - Math.pow(1 - x, 3);
  let tf = '', op = 1, clip, filter = '';
  const d = it.d || .35;
  switch (it.a) {
    case 'pop': { const s = dt < 0 ? .4 : dt < .2 ? .4 + .66 * eo(dt / .2) : dt < .32 ? 1.06 - .06 * ((dt - .2) / .12) : 1; tf = `scale(${s})`; op = p(.08); break; }
    case 'stamp': { const s = dt < .26 ? 2.2 - 1.24 * (dt / .26) : dt < .36 ? .96 + .04 * ((dt - .26) / .1) : 1; tf = `scale(${s})`; op = p(.06); break; }
    case 'drop': tf = `translateY(${-90 * (1 - eo(p(.4)))}px)`; op = p(.25); break;
    case 'rise': tf = `translateY(${60 * (1 - eo(p(.45)))}px)`; op = p(.35); break;
    case 'fade': op = p(.45); break;
    case 'slideL': tf = `translateX(${-1100 * (1 - eo(p(.45)))}px)`; break;
    case 'slideR': tf = `translateX(${1100 * (1 - eo(p(.45)))}px)`; break;
    case 'wipe': { const v = it.d ? (1920 - g.x) / it.d : 1500; const edge = g.x + v * Math.max(0, dt); clip = `polygon(0 0, ${edge}px 0, ${edge}px 1080px, 0 1080px)`; if (edge >= 1920) clip = undefined; break; }
    default: break;
  }
  if (it.buzz !== undefined && t >= it.buzz && t < it.buzz + .8) tf += ` translateX(${Math.sin((t - it.buzz) * 70) * 7}px)`;
  if (it.pulse !== undefined && t >= it.pulse && t < it.pulse + .4) tf += ` scale(${1 + .06 * Math.sin(Math.PI * (t - it.pulse) / .4)})`;
  if (it.spin !== undefined && t >= it.spin) tf += ` rotate(${360 * eo(Math.min(1, (t - it.spin) / 1.4))}deg)`;
  if (it.gray !== undefined && t >= it.gray) filter = `grayscale(${Math.min(1, (t - it.gray) / .6)}) brightness(${1 - .25 * Math.min(1, (t - it.gray) / .6)})`;
  if (it.dim !== undefined && t >= it.dim) op *= 1 - .55 * Math.min(1, (t - it.dim) / .4);
  if (it.out !== undefined && t >= it.out) { op *= 1 - Math.min(1, (t - it.out) / .25); if (t >= it.out + .25) return null; }
  const ox = g.x + g.w / 2, oy = g.y + g.h / 2;
  return <div style={{position: 'absolute', inset: 0, opacity: op, transform: tf || undefined, transformOrigin: `${ox}px ${oy}px`, clipPath: clip, filter: filter || undefined}} dangerouslySetInnerHTML={{__html: html}} />;
};

const SceneView = ({sc, t}) => {
  const k = Math.max(0, Math.min(1, (t - sc.from) / (sc.to - sc.from)));
  const kk = k * k * (3 - 2 * k);
  let scale = 1 + (sc.zoom || 0) * kk, ox = sc.ox ?? 960, oy = sc.oy ?? 540;
  if (sc.camTo && t >= sc.camTo.at) { const q = Math.min(1, (t - sc.camTo.at) / (sc.to - sc.camTo.at)); scale = scale + (sc.camTo.scale - scale) * q * q; ox = sc.camTo.ox; oy = sc.camTo.oy; }
  // keyframed camera [t, scale, centreX, centreY], smoothly eased between keys (used for continuous moves with no cut)
  let camT;
  if (sc.cam) {
    const K = sc.cam; let i = 0; while (i < K.length - 2 && t > K[i + 1][0]) i++;
    const [a, b] = [K[i], K[i + 1]]; const u0 = Math.max(0, Math.min(1, (t - a[0]) / (b[0] - a[0]))); const u = u0 * u0 * (3 - 2 * u0);
    const cs = a[1] + (b[1] - a[1]) * u, cx = a[2] + (b[2] - a[2]) * u, cy = a[3] + (b[3] - a[3]) * u;
    camT = `translate(${960 - cx * cs}px, ${540 - cy * cs}px) scale(${cs})`;
  }
  let sx = 0;
  for (const s of sc.shake || []) if (t >= s && t < s + .3) sx = Math.sin((t - s) * 90) * 12 * (1 - (t - s) / .3);
  return (
    <div data-scene="1" data-noaudit={sc.noAuditAfter !== undefined && t >= sc.noAuditAfter ? '1' : undefined} style={{position: 'absolute', inset: 0, background: '#fff', overflow: 'hidden', transform: camT ? `translateX(${sx}px) ${camT}` : `translateX(${sx}px) scale(${scale})`, transformOrigin: camT ? '0 0' : `${ox}px ${oy}px`}}>
      {sc.items.map((it, i) => <Item key={i} sc={sc} it={it} t={t} />)}
    </div>
  );
};

// every image URL the scenes use, so they can all be loaded before the first frame
const ASSETS = (() => {
  const set = new Set();
  for (const sc of SC) for (const it of sc.items) {
    const h = htmlAt(it, sc.to - .01);
    for (const m of h.matchAll(/url\(([^)]+)\)/g)) set.add(m[1].replace(/["']/g, ''));
    for (const m of h.matchAll(/src="([^"]+)"/g)) set.add(m[1]);
  }
  return [...set].filter((u) => u.includes('ep4v'));
})();

const Preload = () => {
  const [h] = useState(() => delayRender('ep4 assets'));
  useEffect(() => {
    Promise.all(ASSETS.map((u) => new Promise((res) => { const im = new Image(); im.onload = () => (im.decode ? im.decode().catch(() => 0) : 0).then ? im.decode().then(res, res) : res(); im.onerror = res; im.src = u; })))
      .then(() => continueRender(h));
  }, [h]);
  return null;
};

/** Layout audit: with {audit:true}, logs every on-screen element box each frame (read by tools/audit_layout.py). */
const Audit = () => {
  const frame = useCurrentFrame();
  useEffect(() => {
    const id = delayRender(`audit-${frame}`);
    const tm = setTimeout(() => {
      const items = [];
      const root = document.querySelector('[data-scene]');
      if (root && !root.dataset.noaudit) for (const el of root.querySelectorAll('[data-k]')) {
        const kind = el.dataset.k; if (kind === 'bg') continue;
        const wrap = el.closest('[data-scene] > div > div') || el;
        if (parseFloat(getComputedStyle(wrap).opacity) < .05) continue;
        let r = (kind === 'arrow' ? el.querySelector(':scope > path') : el).getBoundingClientRect();
        if (kind === 'text' && r.width >= 1500) { const tw = document.createTreeWalker(el, NodeFilter.SHOW_TEXT); let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; for (let n = tw.nextNode(); n; n = tw.nextNode()) { const rg = document.createRange(); rg.selectNodeContents(n); for (const q of rg.getClientRects()) { x0 = Math.min(x0, q.left); y0 = Math.min(y0, q.top); x1 = Math.max(x1, q.right); y1 = Math.max(y1, q.bottom); } } if (x1 > x0) r = new DOMRect(x0, y0, x1 - x0, y1 - y0); }
        const name = (el.textContent || '').trim().slice(0, 30) || (el.getAttribute('src') || el.style.backgroundImage || kind).split('/').pop().slice(0, 30);
        items.push({name, kind, over: !!el.dataset.over, crop: !!el.dataset.crop, x: r.left, y: r.top, w: r.width, h: r.height});
        const fsz = parseFloat(getComputedStyle(el).fontSize) || 16;
        if (kind === 'text' && el.clientWidth && (el.scrollWidth > el.clientWidth + 2 || el.scrollHeight > el.clientHeight + fsz * .3)) items.push({name, kind: 'spill', x: 0, y: 0, w: 0, h: 0});
      }
      console.log(`AUDIT ${frame} ${JSON.stringify(items)}`);
      continueRender(id);
    }, 40);
    return () => clearTimeout(tm);
  }, [frame]);
  return null;
};

export const Ep04Full = ({audit}: {audit?: boolean}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = toOld(frame / fps);
  const sc = SC.find((s) => t >= s.from && t < s.to) || SC[SC.length - 1];
  const sfx = [];
  for (const s of SC) for (const it of s.items) {
    if (s.quiet || it.sfx === 0) continue;
    const name = it.sfx || DEFAULT_SFX[it.a];
    if (name && SFX_VOL[name] !== undefined) sfx.push([Math.max(0, Math.round(toNew(absAt(s, it)) * fps)), name]);
  }
  sfx.sort((a, b) => a[0] - b[0]);
  for (let i = sfx.length - 1, last = 1e9; i >= 0; i--) { if (last - sfx[i][0] < SFX_GAP * fps) sfx.splice(i, 1); else last = sfx[i][0]; }
  return (
    <AbsoluteFill style={{background: '#fff'}}>
      <style>{CSS}</style>
      <Preload />
      <SceneView sc={sc} t={t} />
      {VO_PARTS.map(([f, off], i) => <Sequence key={'vo' + i} from={Math.round(off * fps)}><Audio src={staticFile(`ep4v/${f}`)} /></Sequence>)}
      {sfx.map(([f, n], i) => <Sequence key={i} from={f} durationInFrames={Math.round(fps * 1.1)}><Audio src={staticFile(`ep4v/sfx/${n}.wav`)} volume={SFX_VOL[n]} /></Sequence>)}
      {audit && <Audit />}
    </AbsoluteFill>
  );
};
