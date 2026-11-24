"""Check an audited render (from tools/audit_layout.mjs) for layout mistakes.

    python3 tools/audit_layout.py audit.json [--still 2.5]

Reports:
  OVERLAP    two elements' visible boxes intersect (transparent padding trimmed)
  OFF-FRAME  an element sticks out of the 1920x1080 frame
  SPILL      text runs outside its box or bubble
  STILL      nothing new appears on screen for longer than --still seconds
Exit code 1 if anything is found.
"""
import json
import sys

W, H = 1920, 1080
# trim transparent padding so we compare the visible ink, not the image box
TRIM = {"hadi": (0.20, 0.03), "icon": (0.06, 0.06), "text": (0.0, 0.16), "arrow": (-0.0, -0.0)}
PAD_ARROW = 12  # arrowhead + stroke beyond the path's bbox
GAP = 6  # elements closer than this count as touching


def box(e):
    tx, ty = TRIM.get(e["kind"], (0, 0))
    x, y, w, h = e["x"], e["y"], e["w"], e["h"]
    x0, y0, x1, y1 = x + w * tx, y + h * ty, x + w * (1 - tx), y + h * (1 - ty)
    if e["kind"] == "arrow":
        x0, y0, x1, y1 = x0 - PAD_ARROW, y0 - PAD_ARROW, x1 + PAD_ARROW, y1 + PAD_ARROW
    return x0 - GAP / 2, y0 - GAP / 2, x1 + GAP / 2, y1 + GAP / 2


def inter(a, b):
    w = min(a[2], b[2]) - max(a[0], b[0])
    h = min(a[3], b[3]) - max(a[1], b[1])
    return w * h if w > 0 and h > 0 else 0


def main():
    path = sys.argv[1]
    still = float(sys.argv[sys.argv.index("--still") + 1]) if "--still" in sys.argv else 2.5
    data = json.load(open(path))
    fps = data["fps"]
    frames = sorted((int(k), v) for k, v in data["frames"].items())
    found = {}

    def add(kind, key, t):
        r = found.setdefault((kind, key), [t, t])
        r[1] = t

    last_sig, last_change = None, 0.0
    for f, items in frames:
        t = f / fps
        for e in items:
            if e["kind"] == "spill":
                add("SPILL", f"text runs outside its box: {e['name']!r}", t)
        items = [e for e in items if e["kind"] != "spill"]
        bs = [(e, box(e)) for e in items]
        for i in range(len(bs)):
            for j in range(i + 1, len(bs)):
                a, b = bs[i], bs[j]
                if inter(a[1], b[1]) > 0:
                    add("OVERLAP", f"{a[0]['name']!r} x {b[0]['name']!r}", t)
            e, (x0, y0, x1, y1) = bs[i]
            if x0 < -4 or y0 < -4 or x1 > W + 4 or y1 > H + 4:
                add("OFF-FRAME", f"{e['name']!r}", t)
        sig = tuple(sorted(e["name"] for e in items))
        if sig != last_sig:
            if last_sig is not None and t - last_change > still:
                add("STILL", f"nothing new from {last_change:.1f}s to {t:.1f}s ({t - last_change:.1f}s)", last_change)
            last_sig, last_change = sig, t
    end = frames[-1][0] / fps
    if end - last_change > still:
        add("STILL", f"nothing new from {last_change:.1f}s to the end ({end - last_change:.1f}s)", last_change)

    # an element sliding or dropping in may cross the edge or another item for a moment; only report what lasts
    step = (frames[1][0] - frames[0][0]) / fps if len(frames) > 1 else 0
    found = {k: v for k, v in found.items() if k[0] == "STILL" or v[1] - v[0] + step >= 0.3}
    for (kind, key), (a, b) in sorted(found.items(), key=lambda kv: kv[1][0]):
        print(f"{kind:9} {a:5.1f}-{b:5.1f}s  {key}")
    print(f"{len(found)} problem(s)")
    sys.exit(1 if found else 0)


if __name__ == "__main__":
    main()
