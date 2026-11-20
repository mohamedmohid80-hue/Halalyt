"""Five illustrations of Hadi "inside the game" for the GTA VI video.

Each scene uses a game-style HUD (wanted stars, money, minimap) so it reads as gameplay.
Non-graphic on purpose: no victims, no blood, no drugs shown (just an unmarked package).

    python3 tools/make_gta_scenes.py   ->  images/gta-scenes/*.png
"""
import sys
from pathlib import Path

import cairosvg

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tools"))
import make_hadi as H  # noqa: E402

OUT = ROOT / "images" / "gta-scenes"
INK = H.INK
W, HGT = 1920, 1080


def hadi(l_el, l_h, r_el, r_h, x, y, s=1.0, tilt=0, extra=""):
    """Hadi with custom arm positions (in his own 420x600 coordinate space)."""
    inner = (
        H.legs() + H.torso() + H.head(tilt)
        + H.limb([H.SHOULDER_L, l_el, l_h], H.GREEN, 26)
        + H.limb([H.SHOULDER_R, r_el, r_h], H.GREEN, 26)
        + extra + H.hand(l_h) + H.hand(r_h)
    )
    return f'<g transform="translate({x} {y}) scale({s})">{inner}</g>'


def hud(stars, money, mission=None):
    st = "".join(
        f'<text x="{1880 - i * 62}" y="92" text-anchor="end" font-family="DejaVu Sans" font-size="58" '
        f'fill="{"#FFD23F" if (4 - i) < stars else "rgba(255,255,255,.3)"}" stroke="#000" stroke-width="3">★</text>'
        for i in range(5)
    )
    st = '<rect x="1540" y="30" width="360" height="160" rx="18" fill="rgba(10,10,20,.55)"/>' + st
    m = (f'<text x="1880" y="170" text-anchor="end" font-family="DejaVu Sans" font-weight="bold" font-size="56" '
         f'fill="#7CFF8A" stroke="#000" stroke-width="5" paint-order="stroke">${money:,}</text>')
    radar = ('<g transform="translate(150 930)"><circle r="110" fill="rgba(20,20,30,.75)" stroke="#000" stroke-width="6"/>'
             '<path d="M-110,0 H110 M0,-110 V110" stroke="rgba(255,255,255,.15)" stroke-width="4"/>'
             '<path d="M0,-18 L13,14 L0,6 L-13,14 Z" fill="#fff"/>'
             '<circle cx="55" cy="-40" r="10" fill="#FF4D4D"/></g>')
    txt = ""
    if mission:
        txt = (f'<text x="960" y="1010" text-anchor="middle" font-family="DejaVu Sans" font-weight="bold" font-size="44" '
               f'fill="#fff" stroke="#000" stroke-width="6" paint-order="stroke">{mission}</text>')
    return st + m + radar + txt


def frame(bg, body, stars, money, mission):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{HGT}" viewBox="0 0 {W} {HGT}">'
            f'{bg}{body}{hud(stars, money, mission)}</svg>')


def night_sky(top="#1A1435", bottom="#5A2A6E"):
    return (f'<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{top}"/>'
            f'<stop offset="1" stop-color="{bottom}"/></linearGradient></defs><rect width="{W}" height="{HGT}" fill="url(#sky)"/>')


def palms(xs, y0, col="#140F26"):
    out = f'<g fill="{col}">'
    for x in xs:
        out += f'<path d="M{x - 8},{y0} C{x - 4},{y0 - 160} {x + 8},{y0 - 260} {x + 20},{y0 - 330} C{x + 22},{y0 - 250} {x + 14},{y0 - 120} {x + 10},{y0} Z"/>'
        cx, cy = x + 20, y0 - 330
        for dx, dy in ((-120, 40), (120, 40), (-90, -30), (90, -30), (0, -70)):
            out += f'<path d="M{cx},{cy} Q{cx + dx * .5},{cy + dy - 30} {cx + dx},{cy + dy} Q{cx + dx * .5},{cy + dy - 10} {cx},{cy + 8} Z"/>'
    return out + "</g>"


def car(x, y, col="#E2475B", flip=False):
    t = f'translate({x} {y})' + (' scale(-1 1)' if flip else '')
    return (f'<g transform="{t}" stroke="{INK}" stroke-width="8" stroke-linejoin="round">'
            f'<path d="M0,120 L20,60 Q30,40 60,40 L170,40 L230,-20 Q245,-35 270,-35 L430,-35 Q455,-35 470,-20 L530,40 L600,48 Q640,55 645,90 L650,120 Z" fill="{col}"/>'
            f'<path d="M190,40 L245,-12 L340,-12 L340,40 Z" fill="#9FD3F2"/><path d="M356,40 L356,-12 L455,-12 L505,40 Z" fill="#9FD3F2"/>'
            f'<line x1="348" y1="-30" x2="348" y2="118" />'
            f'<circle cx="140" cy="125" r="48" fill="#222"/><circle cx="140" cy="125" r="20" fill="#bbb"/>'
            f'<circle cx="520" cy="125" r="48" fill="#222"/><circle cx="520" cy="125" r="20" fill="#bbb"/>'
            f'<rect x="608" y="70" width="34" height="18" rx="6" fill="#FFF3B0"/></g>')


def pistol(x, y, ang=0, flash=False):
    f = ('<path d="M120,-14 L175,-40 L160,-8 L200,0 L160,8 L175,40 L120,14 Z" fill="#FFD23F" stroke="#FF8A00" stroke-width="5"/>'
         if flash else "")
    return (f'<g transform="translate({x} {y}) rotate({ang})">{f}<path d="M0,-16 L110,-16 L110,10 L34,10 L28,46 L4,46 L8,10 L0,10 Z" '
            f'fill="#2B2B33" stroke="{INK}" stroke-width="6" stroke-linejoin="round"/></g>')


# ---------------- scenes ----------------

def scene_car():
    bg = night_sky() + palms([120, 1700], 760) + '<rect y="760" width="1920" height="320" fill="#2A2238"/>'
    bg += '<rect y="900" width="1920" height="14" fill="#F2C94C" opacity=".5"/>'
    for x in (520, 1450):
        bg += f'<rect x="{x}" y="380" width="14" height="380" fill="#120E20"/><path d="M{x - 30},380 H{x + 60}" stroke="#120E20" stroke-width="12"/>'
        bg += f'<circle cx="{x + 58}" cy="392" r="16" fill="#FFE6A8"/><path d="M{x + 58},400 L{x - 60},760 L{x + 180},760 Z" fill="#FFE6A8" opacity=".12"/>'
    body = car(640, 640, "#E2475B").replace("translate(640 640)", "translate(640 640) scale(1.5)")
    # Hadi at the driver's door, prying with a crowbar
    crowbar = f'<path d="M370,360 L430,300 L438,282" fill="none" stroke="#C8CCD4" stroke-width="12" stroke-linecap="round"/><path d="M370,360 L430,300 L438,282" fill="none" stroke="{INK}" stroke-width="3"/>'
    body += hadi((140, 312), (150, 300), (300, 310), (370, 360), 560, 360, 0.95, tilt=8, extra=crowbar)
    body += '<g transform="translate(1000 590)"><path d="M0,0 L30,-30 M-10,-40 L5,-75 M40,-10 L80,-20" stroke="#FFF" stroke-width="6" stroke-linecap="round"/></g>'
    return frame(bg, body, 1, 2_000, "STEAL A CAR")


def scene_store():
    bg = '<rect width="1920" height="1080" fill="#F4EBD9"/><rect y="760" width="1920" height="320" fill="#C9B79C"/>'
    for i, yy in enumerate((330, 490, 650)):
        bg += f'<rect x="1150" y="{yy}" width="700" height="18" fill="#8A6A4A"/>'
        for k in range(10):
            c = ["#E2475B", "#2F80ED", "#F2C94C", "#27AE60", "#9B51E0"][(k + i) % 5]
            bg += f'<rect x="{1170 + k * 66}" y="{yy - 90}" width="50" height="90" rx="6" fill="{c}" stroke="{INK}" stroke-width="4"/>'
    bg += '<rect x="80" y="150" width="380" height="120" rx="12" fill="#2F80ED" stroke="#17201B" stroke-width="6"/>'
    bg += '<text x="270" y="230" text-anchor="middle" font-family="DejaVu Sans" font-weight="bold" font-size="56" fill="#fff">24/7</text>'
    # counter + register
    body = f'<rect x="80" y="620" width="760" height="300" fill="#8A6A4A" stroke="{INK}" stroke-width="8"/><rect x="80" y="600" width="760" height="40" fill="#A98560" stroke="{INK}" stroke-width="8"/>'
    body += f'<rect x="330" y="470" width="260" height="140" rx="12" fill="#3A3F4B" stroke="{INK}" stroke-width="8"/><rect x="355" y="490" width="210" height="50" fill="#7CFF8A"/>'
    body += f'<rect x="300" y="600" width="320" height="50" fill="#555" stroke="{INK}" stroke-width="6"/>'
    body += '<text x="460" y="530" text-anchor="middle" font-family="DejaVu Sans" font-weight="bold" font-size="36" fill="#1B4D24">OPEN</text>'
    # Hadi grabbing cash into a bag
    bag = (f'<path d="M300,330 Q270,300 300,280 L360,280 Q390,300 360,330 Q400,360 390,430 Q330,470 270,430 Q260,360 300,330 Z" fill="#B08D57" stroke="{INK}" stroke-width="7"/>'
           f'<text x="330" y="410" text-anchor="middle" font-family="DejaVu Sans" font-weight="bold" font-size="70" fill="#1E7B4F">$</text>')
    body += hadi((120, 300), (60, 250), (300, 300), (326, 286), 880, 420, 0.95, tilt=-5, extra=bag)
    for i, (x, y) in enumerate(((800, 560), (860, 500), (760, 470))):
        body += f'<g transform="translate({x} {y}) rotate({-20 + i * 18})"><rect x="-40" y="-20" width="80" height="40" rx="4" fill="#7FBF6A" stroke="{INK}" stroke-width="4"/><text y="12" text-anchor="middle" font-family="DejaVu Sans" font-weight="bold" font-size="28" fill="#1E5A2A">$</text></g>'
    return frame(bg, body, 2, 7_000, "ROB THE STORE")


def scene_shoot():
    bg = night_sky("#2A1035", "#B23A5A") + palms([1650], 760) + '<rect y="760" width="1920" height="320" fill="#2A2238"/>'
    bg += car(1250, 690, "#4A5A7A", flip=False).replace('translate(1250 690)', 'translate(1250 690) scale(.8)')
    body = ""
    # Hadi aiming right with both hands
    gun = pistol(370, 250, 0, flash=True)
    body += hadi((300, 250), (360, 250), (310, 230), (370, 250), 600, 430, 0.95, tilt=4, extra=gun)
    # bullet impacts on the parked car (no people)
    for x, y in ((1390, 700), (1460, 680), (1520, 720)):
        body += f'<g transform="translate({x} {y})"><circle r="9" fill="#111"/><path d="M-18,0 H18 M0,-18 V18 M-12,-12 L12,12 M12,-12 L-12,12" stroke="#fff" stroke-width="3"/></g>'
    return frame(bg, body, 3, 12_000, "")


def scene_alley():
    bg = '<rect width="1920" height="1080" fill="#1B1626"/>'
    for side, x0 in (("l", 0), ("r", 1400)):
        bg += f'<rect x="{x0}" y="0" width="520" height="1080" fill="#5A2E2E"/>'
        for r in range(0, 1080, 44):
            off = 0 if (r // 44) % 2 else 40
            for c in range(x0 - off, x0 + 520, 80):
                bg += f'<rect x="{c}" y="{r}" width="76" height="40" fill="#6E3838" stroke="#3A1E1E" stroke-width="3"/>'
    bg += '<rect x="520" y="0" width="880" height="1080" fill="#2A2238"/><rect x="520" y="820" width="880" height="260" fill="#1F1A2A"/>'
    bg += '<circle cx="960" cy="120" r="26" fill="#FFE6A8"/><path d="M960,130 L640,820 L1280,820 Z" fill="#FFE6A8" opacity=".10"/>'
    bg += f'<rect x="1180" y="640" width="200" height="180" rx="10" fill="#2F6B4F" stroke="{INK}" stroke-width="8"/><rect x="1170" y="620" width="220" height="30" fill="#24543E" stroke="{INK}" stroke-width="8"/>'
    body = ""
    # shadowy buyer (silhouette)
    body += ('<g fill="#0B0912"><circle cx="1180" cy="430" r="62"/><path d="M1090,820 L1100,540 Q1110,490 1180,490 Q1250,490 1260,540 L1270,820 Z"/>'
             '<path d="M1110,420 Q1180,330 1250,420 L1250,440 L1110,440 Z"/>'
             '<path d="M1110,560 Q1060,600 1040,640" stroke="#0B0912" stroke-width="40" stroke-linecap="round" fill="none"/></g>')
    # Hadi handing over an unmarked package
    pkg = f'<rect x="352" y="250" width="70" height="50" rx="6" fill="#9C8A6E" stroke="{INK}" stroke-width="6"/><path d="M352,275 H422" stroke="{INK}" stroke-width="4"/>'
    body += hadi((140, 312), (150, 300), (310, 260), (360, 268), 560, 410, 0.95, tilt=-6, extra=pkg)
    body += '<text x="1180" y="300" text-anchor="middle" font-family="DejaVu Sans" font-weight="bold" font-size="90" fill="#FFD23F" stroke="#000" stroke-width="4">?</text>'
    return frame(bg, body, 4, 18_000, "MAKE A DEAL")


def scene_reward():
    s = (f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{HGT}" viewBox="0 0 {W} {HGT}">'
         '<defs><linearGradient id="room" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1A1430"/><stop offset="1" stop-color="#2B1F45"/></linearGradient>'
         '<linearGradient id="scr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2A0E44"/><stop offset=".6" stop-color="#7A2E7A"/><stop offset="1" stop-color="#E86A7A"/></linearGradient>'
         '<linearGradient id="vi" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFD36E"/><stop offset=".5" stop-color="#FF6FA0"/><stop offset="1" stop-color="#A64DFF"/></linearGradient>'
         '<radialGradient id="glow" cx=".5" cy=".45" r=".6"><stop offset="0" stop-color="#C77DFF" stop-opacity=".45"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient></defs>'
         '<rect width="1920" height="1080" fill="url(#room)"/><ellipse cx="960" cy="480" rx="1100" ry="620" fill="url(#glow)"/>'
         '<rect x="190" y="70" width="1540" height="880" rx="24" fill="#08080C" stroke="#000" stroke-width="8"/>'
         '<rect x="215" y="95" width="1490" height="830" rx="8" fill="url(#scr)"/>'
         '<rect x="860" y="950" width="200" height="60" fill="#0B0912"/><rect x="700" y="1005" width="520" height="30" rx="10" fill="#0B0912"/>')
    s += ('<text x="960" y="250" text-anchor="middle" font-family="DejaVu Sans" font-weight="bold" font-size="110" fill="#FFD23F" stroke="#000" stroke-width="8" paint-order="stroke">MISSION PASSED</text>'
          '<text x="960" y="330" text-anchor="middle" font-family="DejaVu Sans" font-weight="bold" font-size="54" fill="#fff" stroke="#000" stroke-width="5" paint-order="stroke">RESPECT +100</text>')
    rows = [("Car stolen", "+$2,000"), ("Store robbed", "+$5,000"), ("Shots fired", "+$5,000"), ("Deal completed", "+$6,000")]
    for i, (a, b) in enumerate(rows):
        y = 440 + i * 95
        s += f'<rect x="430" y="{y - 62}" width="1060" height="78" rx="12" fill="rgba(0,0,0,.45)"/>'
        s += f'<text x="470" y="{y}" font-family="DejaVu Sans" font-weight="bold" font-size="48" fill="#fff">{a}</text>'
        s += f'<text x="1450" y="{y}" text-anchor="end" font-family="DejaVu Sans" font-weight="bold" font-size="48" fill="#7CFF8A">{b}</text>'
    s += ('<text x="960" y="870" text-anchor="middle" font-family="DejaVu Sans" font-weight="bold" font-size="76" fill="#7CFF8A" stroke="#000" stroke-width="7" paint-order="stroke">TOTAL  +$18,000</text>')
    # "GTA VI" corner badge (stylised text, not the official logo)
    s += ('<g transform="translate(1500 120)"><rect width="180" height="120" rx="14" fill="rgba(0,0,0,.55)"/>'
          '<text x="90" y="52" text-anchor="middle" font-family="DejaVu Sans" font-weight="bold" font-size="40" fill="#fff">GTA</text>'
          '<text x="90" y="104" text-anchor="middle" font-family="DejaVu Serif" font-weight="bold" font-size="58" fill="url(#vi)">VI</text></g>')
    s += ''.join(f'<text x="{300 + i * 56}" y="160" font-family="DejaVu Sans" font-size="50" fill="#FFD23F" stroke="#000" stroke-width="3">★</text>' for i in range(4))
    return s + "</svg>"


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    scenes = {"1-steal-car": scene_car(), "2-rob-store": scene_store(), "3-shoot": scene_shoot(),
              "4-alley-deal": scene_alley(), "5-mission-reward": scene_reward()}
    for name, svg in scenes.items():
        cairosvg.svg2png(bytestring=svg.encode(), write_to=str(OUT / f"{name}.png"), output_width=W, output_height=HGT)
        print("wrote", name)
