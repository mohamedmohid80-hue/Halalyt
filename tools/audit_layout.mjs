// Renders a composition with {audit:true} and collects the per-frame element boxes logged by its <Audit/>.
// usage: node tools/audit_layout.mjs Ep04-Preview out.json [everyNth]
import {bundle} from '@remotion/bundler';
import {selectComposition, renderFrames} from '@remotion/renderer';
import fs from 'fs';
const [id, out, nth = '3'] = process.argv.slice(2);
const serveUrl = await bundle({entryPoint: 'remotion/index.ts'});
const inputProps = {audit: true};
const browserExecutable = fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : null;
const comp = await selectComposition({serveUrl, id, inputProps, browserExecutable});
const rows = {};
await renderFrames({
  serveUrl, composition: comp, inputProps, outputDir: fs.mkdtempSync('/tmp/claude-0/-home-user-Halalyt/99006890-0444-50df-a2d5-cb89c235fb12/scratchpad/af-'),
  browserExecutable, imageFormat: 'jpeg', scale: 0.2, everyNthFrame: Number(nth),
  onStart: () => {}, onFrameUpdate: () => {},
  onBrowserLog: (l) => { const m = /^AUDIT (\d+) (.*)$/.exec(l.text); if (m) rows[m[1]] = JSON.parse(m[2]); },
});
fs.writeFileSync(out, JSON.stringify({fps: comp.fps, frames: rows}));
console.log('frames audited:', Object.keys(rows).length);
