// Layout check for a storyboard page: every .scene's elements (data-k) -> same JSON as audit_layout.mjs.
// usage: NODE_PATH=$(npm root -g) node tools/audit_board.js board.html out.json
const {chromium} = require('playwright');
(async () => {
  const [page_, out] = process.argv.slice(2);
  const b = await chromium.launch(); const p = await b.newPage({viewport: {width: 2100, height: 1200}});
  await p.goto('file://' + require('path').resolve(page_)); await p.waitForTimeout(3000);
  const frames = await p.evaluate(() => {
    const res = {};
    document.querySelectorAll('.scene').forEach((sc, i) => {
      const o = sc.getBoundingClientRect(), k = o.width / 1920, items = [];
      for (const el of sc.querySelectorAll('[data-k]')) {
        const kind = el.dataset.k; if (kind === 'bg') continue;
        let r = (kind === 'arrow' ? el.querySelector(':scope > path') : el).getBoundingClientRect();
        if (kind === 'text' && r.width >= 1500 * k) { const rg = document.createRange(); let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; const tw = document.createTreeWalker(el, NodeFilter.SHOW_TEXT); for (let n = tw.nextNode(); n; n = tw.nextNode()) { rg.selectNodeContents(n); for (const q of rg.getClientRects()) { x0 = Math.min(x0, q.left); y0 = Math.min(y0, q.top); x1 = Math.max(x1, q.right); y1 = Math.max(y1, q.bottom); } } if (x1 > x0) r = new DOMRect(x0, y0, x1 - x0, y1 - y0); }
        const name = (el.textContent || '').trim().slice(0, 30) || (el.getAttribute('src') || el.style.backgroundImage || kind).split('/').pop().slice(0, 30);
        items.push({name, kind: kind === 'photo' ? 'photo' : kind, over: !!el.dataset.over, crop: !!el.dataset.crop, x: (r.left - o.left) / k, y: (r.top - o.top) / k, w: r.width / k, h: r.height / k});
        // text spilling out of its own box
        const fsz = parseFloat(getComputedStyle(el).fontSize) || 16;
        if (kind === 'text' && el.clientWidth && (el.scrollWidth > el.clientWidth + 2 || el.scrollHeight > el.clientHeight + fsz * 0.3)) items.push({name, kind: 'spill', x: 0, y: 0, w: 0, h: 0});
        if (kind === 'text' && getComputedStyle(el).borderRadius.includes('50%')) { const rg = document.createRange(); rg.selectNodeContents(el); const t = rg.getBoundingClientRect(); if (t.width > r.width * 0.82 || t.height > r.height * 0.95) items.push({name, kind: 'spill', x: 0, y: 0, w: 0, h: 0}); }
      }
      res[i + 1] = items;
    });
    return res;
  });
  require('fs').writeFileSync(out, JSON.stringify({fps: 1, frames})); await b.close();
})();
