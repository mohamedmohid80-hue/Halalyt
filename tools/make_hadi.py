"""Generate the channel character "Hadi" as SVG poses.

Hadi is deliberately faceless: no eyes, nose or mouth. He shows emotion only
through pose, head tilt, props and a symbol bubble. Run:

    python3 tools/make_hadi.py

Writes one SVG per pose to brand/hadi/.
"""
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "brand" / "hadi"

INK = "#17201B"
SKIN = "#D9A57B"
THOBE = "#FFFFFF"
KUFI = "#1E7B4F"
GOLD = "#E8A92E"
RED = "#E5484D"
STROKE = 7

SHOULDER_L = (150, 228)
SHOULDER_R = (250, 228)

# Each pose: left arm (elbow, hand), right arm (elbow, hand), head tilt in
# degrees, optional bubble symbol, optional extra drawing (props, motion lines).
POSES = {
    "neutral": dict(l=((128, 300), (134, 372)), r=((272, 300), (266, 372))),
    "point": dict(l=((128, 300), (134, 372)), r=((318, 232), (372, 222)), extra="point"),
    "think": dict(l=((128, 300), (134, 372)), r=((292, 292), (232, 206)), tilt=6, bubble="?"),
    "shock": dict(l=((104, 196), (98, 124)), r=((296, 196), (302, 124)), bubble="!", bubble_color=RED),
    "facepalm": dict(l=((128, 300), (134, 372)), r=((290, 270), (214, 142)), tilt=-10),
    "thumbsup": dict(l=((128, 300), (134, 372)), r=((304, 292), (322, 232)), extra="thumb"),
    "phone": dict(l=((140, 316), (184, 292)), r=((260, 316), (216, 292)), tilt=-8, extra="phone"),
    "wave": dict(l=((128, 300), (134, 372)), r=((310, 200), (324, 126)), extra="wave"),
    "idea": dict(l=((128, 300), (134, 372)), r=((300, 210), (300, 140)), bubble="lamp", bubble_color=GOLD),
}


def arm(elbow, hand, shoulder):
    pts = f"M{shoulder[0]},{shoulder[1]} L{elbow[0]},{elbow[1]} L{hand[0]},{hand[1]}"
    return (
        f'<path d="{pts}" fill="none" stroke="{INK}" stroke-width="34" stroke-linecap="round" stroke-linejoin="round"/>'
        f'<path d="{pts}" fill="none" stroke="{THOBE}" stroke-width="20" stroke-linecap="round" stroke-linejoin="round"/>'
    )


def hand(p):
    return f'<circle cx="{p[0]}" cy="{p[1]}" r="15" fill="{SKIN}" stroke="{INK}" stroke-width="{STROKE}"/>'


def head(tilt):
    # Faceless head with a kufi. Rotates around the neck.
    return f"""
  <g transform="rotate({tilt} 200 196)">
    <circle cx="200" cy="128" r="64" fill="{SKIN}" stroke="{INK}" stroke-width="{STROKE}"/>
    <path d="M134,116 C136,58 264,58 266,116 Z" fill="{KUFI}" stroke="{INK}" stroke-width="{STROKE}" stroke-linejoin="round"/>
    <path d="M140,104 C160,96 240,96 260,104" fill="none" stroke="{GOLD}" stroke-width="6" stroke-linecap="round"/>
  </g>"""


def body():
    return f"""
  <ellipse cx="200" cy="462" rx="96" ry="12" fill="{INK}" opacity="0.12"/>
  <ellipse cx="172" cy="450" rx="22" ry="11" fill="{INK}"/>
  <ellipse cx="228" cy="450" rx="22" ry="11" fill="{INK}"/>
  <path d="M178,190 C150,196 140,210 138,236 L122,432 C122,442 130,446 140,446 L260,446 C270,446 278,442 278,432 L262,236 C260,210 250,196 222,190 Z"
        fill="{THOBE}" stroke="{INK}" stroke-width="{STROKE}" stroke-linejoin="round"/>
  <path d="M186,198 L200,226 L214,198" fill="none" stroke="{INK}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
  <line x1="200" y1="226" x2="200" y2="262" stroke="{INK}" stroke-width="4" stroke-linecap="round"/>"""


def bubble(symbol, color):
    base = (
        f'<path d="M318,96 L300,122 L334,104 Z" fill="#FFFFFF" stroke="{INK}" stroke-width="{STROKE}" stroke-linejoin="round"/>'
        f'<circle cx="340" cy="66" r="44" fill="#FFFFFF" stroke="{INK}" stroke-width="{STROKE}"/>'
    )
    if symbol == "lamp":
        glyph = (
            f'<circle cx="340" cy="58" r="18" fill="{color}" stroke="{INK}" stroke-width="5"/>'
            f'<rect x="331" y="74" width="18" height="12" rx="3" fill="{INK}"/>'
        )
    else:
        glyph = (
            f'<text x="340" y="88" text-anchor="middle" font-family="DejaVu Sans, Arial, sans-serif" '
            f'font-weight="bold" font-size="60" fill="{color}" stroke="{INK}" stroke-width="3">{symbol}</text>'
        )
    return base + glyph


def extra(kind, pose):
    if kind == "point":
        hx, hy = pose["r"][1]
        return f'<line x1="{hx}" y1="{hy}" x2="{hx + 26}" y2="{hy - 2}" stroke="{INK}" stroke-width="9" stroke-linecap="round"/>'
    if kind == "thumb":
        hx, hy = pose["r"][1]
        return f'<line x1="{hx}" y1="{hy - 8}" x2="{hx}" y2="{hy - 34}" stroke="{INK}" stroke-width="10" stroke-linecap="round"/>'
    if kind == "phone":
        return (
            f'<rect x="178" y="250" width="44" height="72" rx="8" fill="{INK}"/>'
            f'<rect x="184" y="258" width="32" height="54" rx="4" fill="{GOLD}" opacity="0.9"/>'
        )
    if kind == "wave":
        return "".join(
            f'<path d="M{350 + i * 12},{100 + i * 14} q10,10 0,22" fill="none" stroke="{INK}" stroke-width="5" stroke-linecap="round"/>'
            for i in range(2)
        )
    return ""


def svg(name, pose):
    l_el, l_hand = pose["l"]
    r_el, r_hand = pose["r"]
    parts = [body(), head(pose.get("tilt", 0)), arm(l_el, l_hand, SHOULDER_L), arm(r_el, r_hand, SHOULDER_R)]
    if pose.get("extra") == "phone":
        parts.append(extra("phone", pose))
    parts += [hand(l_hand), hand(r_hand)]
    if pose.get("extra") and pose["extra"] != "phone":
        parts.append(extra(pose["extra"], pose))
    if pose.get("bubble"):
        parts.append(bubble(pose["bubble"], pose.get("bubble_color", KUFI)))
    inner = "\n  ".join(parts)
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 480" width="400" height="480">\n'
        f"  <title>Hadi - {name}</title>\n  {inner}\n</svg>\n"
    )


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    for name, pose in POSES.items():
        (OUT / f"hadi-{name}.svg").write_text(svg(name, pose))
    print(f"Wrote {len(POSES)} poses to {OUT}")
