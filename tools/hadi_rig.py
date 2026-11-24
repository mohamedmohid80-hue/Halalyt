"""Hadi rig: a fully poseable version of the channel character.

Every pose is described by joint positions (in Hadi's own 420x600 space):
  arms: (shoulder ->) elbow -> hand, for left and right
  legs: hip -> knee -> foot, for left and right
  body: dx/dy offset of torso+head, lean (deg), head tilt (deg)
plus optional props drawn behind or in front of the hands.

    python3 tools/hadi_rig.py      -> brand/hadi-rig/*.svg + *.png + brand/hadi-rig-sheet.png
    import hadi_rig; hadi_rig.svg("walk1")   (for use in other tools)
"""
from pathlib import Path

import cairosvg

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "brand" / "hadi-rig"

INK, SKIN, GREEN, GREEN_D, PANTS, WHITE, GOLD, RED, BLUE = (
    "#17201B", "#D9A57B", "#1E7B4F", "#145C3A", "#2B3440", "#FFFFFF", "#E8A92E", "#E5484D", "#2F80ED")
LW = 7


def limb(pts, fill, width):
    d = "M" + " L".join(f"{x:.1f},{y:.1f}" for x, y in pts)
    return (f'<path d="{d}" fill="none" stroke="{INK}" stroke-width="{width + 2 * LW}" stroke-linecap="round" stroke-linejoin="round"/>'
            f'<path d="{d}" fill="none" stroke="{fill}" stroke-width="{width}" stroke-linecap="round" stroke-linejoin="round"/>')


def hand(p, fist=False):
    r = 16 if fist else 15
    return f'<circle cx="{p[0]:.1f}" cy="{p[1]:.1f}" r="{r}" fill="{SKIN}" stroke="{INK}" stroke-width="{LW}"/>'


def shoe(p, facing=0):
    """facing: 0 = front, -1 = pointing left, 1 = pointing right."""
    x, y = p
    if facing == 0:
        return (f'<path d="M{x - 30},{y + 22} C{x - 30},{y - 4} {x + 30},{y - 4} {x + 30},{y + 22} Z" fill="{WHITE}" stroke="{INK}" stroke-width="{LW}" stroke-linejoin="round"/>'
                f'<line x1="{x - 30}" y1="{y + 22}" x2="{x + 30}" y2="{y + 22}" stroke="{GREEN}" stroke-width="5" stroke-linecap="round"/>')
    s = facing
    return (f'<path d="M{x - 18 * s},{y + 22} C{x - 18 * s},{y - 6} {x + 44 * s},{y + 2} {x + 46 * s},{y + 22} Z" fill="{WHITE}" stroke="{INK}" stroke-width="{LW}" stroke-linejoin="round"/>'
            f'<line x1="{x - 18 * s}" y1="{y + 22}" x2="{x + 46 * s}" y2="{y + 22}" stroke="{GREEN}" stroke-width="5" stroke-linecap="round"/>')


def torso():
    return (f'<path d="M146,224 C146,206 166,198 200,198 C234,198 254,206 254,224 L266,408 C266,420 258,424 246,424 L154,424 C142,424 134,420 134,408 Z" fill="{GREEN}" stroke="{INK}" stroke-width="{LW}" stroke-linejoin="round"/>'
            f'<path d="M136,404 L264,404" stroke="{GREEN_D}" stroke-width="5"/>'
            f'<path d="M160,346 L240,346 L234,384 L166,384 Z" fill="{GREEN_D}" stroke="{INK}" stroke-width="5" stroke-linejoin="round"/>'
            f'<path d="M188,214 L184,268" stroke="{WHITE}" stroke-width="5" stroke-linecap="round"/><path d="M212,214 L216,268" stroke="{WHITE}" stroke-width="5" stroke-linecap="round"/>'
            f'<circle cx="184" cy="270" r="4" fill="{WHITE}"/><circle cx="216" cy="270" r="4" fill="{WHITE}"/>'
            f'<path d="M140,212 C154,180 246,180 260,212 C236,198 164,198 140,212 Z" fill="{GREEN_D}" stroke="{INK}" stroke-width="{LW}" stroke-linejoin="round"/>'
            f'<path d="M154,218 C164,246 236,246 246,218" fill="none" stroke="{INK}" stroke-width="9" stroke-linecap="round"/>'
            f'<rect x="136" y="202" width="28" height="38" rx="10" fill="{PANTS}" stroke="{INK}" stroke-width="5"/><rect x="236" y="202" width="28" height="38" rx="10" fill="{PANTS}" stroke="{INK}" stroke-width="5"/>')


def head(tilt=0, back=False):
    dots = "".join(f'<circle cx="{x}" cy="{84 if i % 2 else 72}" r="3.5" fill="{GREEN}"/>' for i, x in enumerate(range(150, 256, 15)))
    face = (f'<circle cx="200" cy="122" r="70" fill="{SKIN}" stroke="{INK}" stroke-width="{LW}"/>'
            f'<path d="M131,108 C133,40 267,40 269,108 Z" fill="{WHITE}" stroke="{INK}" stroke-width="{LW}" stroke-linejoin="round"/>{dots}')
    return f'<g transform="rotate({tilt} 200 194)">{face}</g>'


SHOULDER_L, SHOULDER_R, HIP_L, HIP_R = (152, 238), (248, 238), (178, 410), (222, 410)
LEGS_STAND = dict(ll=((176, 474), (176, 538), 0), rl=((224, 474), (224, 538), 0))
ARMS_DOWN = dict(la=((132, 312), (136, 384)), ra=((268, 312), (264, 384)))


def figure(p):
    dx, dy = p.get("dx", 0), p.get("dy", 0)
    lean = p.get("lean", 0)
    la, ra = p.get("la", ARMS_DOWN["la"]), p.get("ra", ARMS_DOWN["ra"])
    ll, rl = p.get("ll", LEGS_STAND["ll"]), p.get("rl", LEGS_STAND["rl"])
    behind, front, over = p.get("behind", ""), p.get("front", ""), p.get("over", "")
    legs = (limb([HIP_L, ll[0], ll[1]], PANTS, 30) + limb([HIP_R, rl[0], rl[1]], PANTS, 30)
            + shoe(ll[1], ll[2]) + shoe(rl[1], rl[2]))
    upper = (torso() + head(p.get("tilt", 0))
             + limb([SHOULDER_L, la[0], la[1]], GREEN, 26) + limb([SHOULDER_R, ra[0], ra[1]], GREEN, 26)
             + front + hand(la[1]) + hand(ra[1]))
    shadow = f'<ellipse cx="{200 + dx}" cy="{max(ll[1][1], rl[1][1]) + 30}" rx="100" ry="12" fill="{INK}" opacity=".12"/>' if p.get("shadow", True) else ""
    return (shadow + p.get("under", "") + behind
            + f'<g transform="translate({dx} {dy}) rotate({lean} 200 420)">{legs}{upper}</g>' + over)


def bubble(sym, color=GREEN, x=342, y=66):
    return (f'<path d="M{x - 24},{y + 38} L{x - 44},{y + 62} L{x - 8},{y + 44} Z" fill="{WHITE}" stroke="{INK}" stroke-width="{LW}" stroke-linejoin="round"/>'
            f'<circle cx="{x}" cy="{y}" r="44" fill="{WHITE}" stroke="{INK}" stroke-width="{LW}"/>'
            f'<text x="{x}" y="{y + 22}" text-anchor="middle" font-family="DejaVu Sans" font-weight="bold" font-size="60" fill="{color}" stroke="{INK}" stroke-width="3">{sym}</text>')


def motion_lines(x, y, n=3, s=-1):
    return "".join(f'<path d="M{x + s * 10 * i},{y + 26 * i} l{-s * 46},0" stroke="{INK}" stroke-width="6" stroke-linecap="round" opacity=".55"/>' for i in range(n))


PHONE = lambda x, y: f'<rect x="{x - 22}" y="{y - 36}" width="44" height="72" rx="8" fill="{INK}"/><rect x="{x - 16}" y="{y - 28}" width="32" height="54" rx="4" fill="{GOLD}"/>'
WATCH = lambda x, y: f'<rect x="{x - 14}" y="{y - 10}" width="28" height="20" rx="5" fill="{WHITE}" stroke="{INK}" stroke-width="5"/>'
BOOK = lambda x, y, c=BLUE: f'<rect x="{x - 40}" y="{y - 52}" width="80" height="104" rx="6" fill="{c}" stroke="{INK}" stroke-width="6"/><line x1="{x - 28}" y1="{y - 52}" x2="{x - 28}" y2="{y + 52}" stroke="{INK}" stroke-width="4"/>'
BAG = f'<path d="M150,236 Q120,300 132,400" fill="none" stroke="{INK}" stroke-width="10"/><rect x="250" y="250" width="70" height="120" rx="18" fill="#3A6EA5" stroke="{INK}" stroke-width="6" />'
CHAIR = f'<rect x="120" y="300" width="160" height="150" rx="14" fill="#6E5236" stroke="{INK}" stroke-width="7"/><rect x="110" y="430" width="180" height="26" rx="8" fill="#8A6A4A" stroke="{INK}" stroke-width="7"/><line x1="125" y1="456" x2="125" y2="560" stroke="{INK}" stroke-width="9"/><line x1="275" y1="456" x2="275" y2="560" stroke="{INK}" stroke-width="9"/>'
DESK = f'<rect x="20" y="420" width="380" height="30" rx="6" fill="#B98A5B" stroke="{INK}" stroke-width="7"/><rect x="40" y="450" width="340" height="110" fill="#9A6E44" stroke="{INK}" stroke-width="7"/>'
ZZZ = f'<text x="300" y="80" font-family="DejaVu Sans" font-weight="bold" font-size="54" fill="{BLUE}" stroke="{INK}" stroke-width="2">Z</text><text x="340" y="40" font-family="DejaVu Sans" font-weight="bold" font-size="40" fill="{BLUE}" stroke="{INK}" stroke-width="2">z</text>'
SWEAT = f'<path d="M282,120 q-14,22 0,30 q14,-8 0,-30 Z" fill="#7CC4FF" stroke="{INK}" stroke-width="4"/>'
TAP = f'<path d="M300,250 L360,250 L360,270" fill="none" stroke="#9AA0A6" stroke-width="14" stroke-linecap="round"/><path d="M360,282 q-6,14 0,20 q6,-6 0,-20" fill="#7CC4FF"/><path d="M356,320 q-6,14 0,20 q6,-6 0,-20" fill="#7CC4FF"/>'

POSES = {
    # walking cycle (4 frames), legs + arms swing in opposition
    "walk1": dict(dy=-4, ll=((168, 470), (150, 534), 1), rl=((236, 474), (258, 538), 1), la=((150, 312), (172, 376)), ra=((262, 308), (238, 372)), tilt=2),
    "walk2": dict(dy=-10, ll=((182, 468), (176, 530), 1), rl=((224, 464), (232, 520), 1), la=((140, 312), (148, 382)), ra=((262, 312), (254, 382))),
    "walk3": dict(dy=-4, ll=((168, 474), (150, 538), 1), rl=((236, 470), (258, 534), 1), la=((134, 308), (112, 372)), ra=((262, 312), (286, 376)), tilt=-2),
    "walk4": dict(dy=-10, ll=((174, 464), (168, 520), 1), rl=((218, 468), (224, 530), 1), la=((140, 312), (148, 382)), ra=((262, 312), (254, 382))),
    "run": dict(dy=-14, lean=8, tilt=6, ll=((158, 478), (118, 528), 1), rl=((246, 456), (292, 512), 1), la=((122, 300), (104, 364)), ra=((280, 290), (318, 248)), over=motion_lines(40, 250)),
    "walk-phone": dict(ll=((168, 470), (150, 534), 1), rl=((236, 474), (258, 538), 1), la=((150, 334), (186, 302)), ra=((250, 334), (214, 302)), tilt=-10, front=PHONE(200, 290)),
    "check-watch": dict(la=((150, 330), (210, 300)), ra=((262, 312), (264, 384)), tilt=-12, front=WATCH(210, 300), over=bubble("!", RED)),
    "raise-hand": dict(la=((132, 312), (136, 384)), ra=((300, 180), (306, 100)), tilt=4),
    "ask": dict(la=((132, 312), (136, 384)), ra=((300, 260), (350, 220)), tilt=-6, over=f'<path d="M300,40 h120 a24,24 0 0 1 24,24 v50 a24,24 0 0 1 -24,24 h-70 l-30,28 v-28 h-20 a24,24 0 0 1 -24,-24 v-50 a24,24 0 0 1 24,-24 z" fill="{WHITE}" stroke="{INK}" stroke-width="{LW}"/><text x="360" y="112" text-anchor="middle" font-family="DejaVu Sans" font-weight="bold" font-size="56" fill="{GREEN}">?</text>'),
    "sit-desk": dict(dy=60, ll=((176, 520), (176, 560), 0), rl=((224, 520), (224, 560), 0), la=((140, 340), (170, 420)), ra=((260, 340), (230, 420)), behind="", under=CHAIR, over=DESK),
    "sit-bored": dict(dy=60, tilt=-14, ll=((176, 520), (176, 560), 0), rl=((224, 520), (224, 560), 0), la=((150, 330), (176, 220)), ra=((260, 340), (230, 420)), under=CHAIR, over=DESK + SWEAT),
    "sit-phone": dict(dy=60, tilt=-12, ll=((176, 520), (176, 560), 0), rl=((224, 520), (224, 560), 0), la=((150, 360), (186, 330)), ra=((250, 360), (214, 330)), front=PHONE(200, 318), under=CHAIR, over=DESK),
    "sit-floor": dict(dy=100, ll=((110, 470), (196, 500), 1), rl=((290, 470), (204, 500), -1), la=((150, 330), (186, 400)), ra=((250, 330), (214, 400)), shadow=False),
    "pray-stand": dict(la=((150, 320), (190, 300)), ra=((250, 320), (210, 300)), tilt=6),
    "pray-hands-up": dict(la=((120, 240), (140, 150)), ra=((280, 240), (260, 150))),
    "dua": dict(la=((150, 330), (176, 290)), ra=((250, 330), (224, 290)), tilt=4, front=f'<path d="M168,290 Q200,330 232,290" fill="{SKIN}" stroke="{INK}" stroke-width="5"/>'),
    "read-book": dict(la=((140, 330), (170, 300)), ra=((260, 330), (230, 300)), tilt=10, front=BOOK(200, 290, "#8B3A2E")),
    "carry-bag": dict(la=((132, 312), (136, 384)), ra=((268, 312), (264, 384)), behind=BAG),
    "wudu": dict(la=((150, 320), (230, 270)), ra=((270, 300), (300, 262)), tilt=8, over=TAP),
    "sleep": dict(dy=60, tilt=-24, ll=((176, 520), (176, 560), 0), rl=((224, 520), (224, 560), 0), la=((150, 340), (176, 300)), ra=((250, 340), (220, 300)), under=CHAIR, over=DESK + ZZZ),
    "shrug": dict(la=((112, 300), (80, 250)), ra=((288, 300), (320, 250)), tilt=6, over=bubble("?", GREEN)),
    "panic": dict(la=((110, 230), (150, 120)), ra=((290, 230), (250, 120)), over=SWEAT + bubble("!", RED)),
    "sad": dict(dy=10, tilt=-14, la=((140, 320), (150, 392)), ra=((260, 320), (250, 392))),
    "explain": dict(la=((100, 270), (60, 300)), ra=((268, 312), (264, 384)), tilt=4, front=f'<line x1="60" y1="300" x2="-40" y2="240" stroke="#6E5236" stroke-width="10" stroke-linecap="round"/><circle cx="-40" cy="240" r="6" fill="#E9E1D0"/>'),
    "point-left": dict(la=((96, 262), (40, 238)), ra=((268, 312), (264, 384)), tilt=4),
    "point-up": dict(la=((132, 312), (136, 384)), ra=((300, 200), (300, 130)), front=f'<line x1="300" y1="130" x2="300" y2="96" stroke="{INK}" stroke-width="9" stroke-linecap="round"/>'),
    "stop": dict(la=((132, 312), (136, 384)), ra=((300, 260), (350, 250)), front=f'<rect x="336" y="200" width="34" height="60" rx="12" fill="{SKIN}" stroke="{INK}" stroke-width="6"/>'),
    "open-door": dict(lean=-4, la=((132, 312), (136, 384)), ra=((300, 300), (340, 320)), behind=f'<rect x="300" y="40" width="160" height="520" fill="#B07A47" stroke="{INK}" stroke-width="8"/><circle cx="330" cy="320" r="12" fill="{GOLD}" stroke="{INK}" stroke-width="4"/>'),
    "celebrate": dict(dy=-24, la=((108, 196), (98, 120)), ra=((292, 196), (302, 120)), ll=((168, 460), (156, 512), 0), rl=((232, 460), (244, 512), 0)),
}


def svg(name, pose=None, vb="-60 -20 540 640"):
    p = POSES[name] if pose is None else pose
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" width="540" height="640"><title>Hadi {name}</title>{figure(p)}</svg>\n'


if __name__ == "__main__":
    from PIL import Image, ImageDraw, ImageFont
    OUT.mkdir(parents=True, exist_ok=True)
    names = list(POSES)
    for n in names:
        s = svg(n)
        (OUT / f"{n}.svg").write_text(s)
        cairosvg.svg2png(bytestring=s.encode(), write_to=str(OUT / f"{n}.png"), output_width=1080, output_height=1280)
    cols = 7
    rows = (len(names) + cols - 1) // cols
    sheet = Image.new("RGB", (cols * 270, rows * 340), "#F4F1EA")
    d = ImageDraw.Draw(sheet)
    font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 18)
    for i, n in enumerate(names):
        im = Image.open(OUT / f"{n}.png").convert("RGBA").resize((270, 320))
        x, y = (i % cols) * 270, (i // cols) * 340
        sheet.paste(im, (x, y), im)
        d.text((x + 135, y + 322), n, fill="#17201B", font=font, anchor="mt")
    sheet.save(ROOT / "brand" / "hadi-rig-sheet.png")
    print(len(names), "poses")
