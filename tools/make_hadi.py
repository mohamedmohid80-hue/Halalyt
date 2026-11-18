"""Generate the channel character "Hadi" as SVG poses.

Hadi is a young Muslim creator: white kufi, green hoodie, headphones round
his neck. He is deliberately faceless (no eyes, nose or mouth) and shows
emotion through pose, head tilt, props and a symbol bubble.

    python3 tools/make_hadi.py

Writes one SVG per pose to brand/hadi/.
"""
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "brand" / "hadi"

INK = "#17201B"
SKIN = "#D9A57B"
GREEN = "#1E7B4F"
GREEN_DARK = "#145C3A"
PANTS = "#2B3440"
WHITE = "#FFFFFF"
GOLD = "#E8A92E"
RED = "#E5484D"
LINE = 7

NECK = (200, 194)
SHOULDER_L = (152, 238)
SHOULDER_R = (248, 238)
ARM_DOWN_L = ((132, 312), (136, 384))
ARM_DOWN_R = ((268, 312), (264, 384))

# Each pose: left arm (elbow, hand), right arm (elbow, hand), head tilt,
# optional bubble and optional extra drawing.
POSES = {
    "neutral": dict(l=ARM_DOWN_L, r=ARM_DOWN_R),
    "point": dict(l=ARM_DOWN_L, r=((318, 244), (372, 234)), extra="point"),
    "think": dict(l=ARM_DOWN_L, r=((300, 322), (230, 206)), tilt=6, bubble="?"),
    "shock": dict(l=((108, 200), (94, 136)), r=((292, 200), (306, 136)), bubble="!", bubble_color=RED),
    "facepalm": dict(l=ARM_DOWN_L, r=((292, 292), (214, 128)), tilt=-9),
    "thumbsup": dict(l=ARM_DOWN_L, r=((306, 304), (326, 240)), extra="thumb"),
    "phone": dict(l=((150, 334), (186, 302)), r=((250, 334), (214, 302)), tilt=-8, extra="phone"),
    "wave": dict(l=ARM_DOWN_L, r=((316, 198), (330, 124)), extra="wave"),
    "idea": dict(l=ARM_DOWN_L, r=((306, 216), (306, 146)), bubble="lamp", bubble_color=GOLD),
}


def limb(points, fill, width):
    d = "M" + " L".join(f"{x},{y}" for x, y in points)
    return (
        f'<path d="{d}" fill="none" stroke="{INK}" stroke-width="{width + 2 * LINE}" stroke-linecap="round" stroke-linejoin="round"/>'
        f'<path d="{d}" fill="none" stroke="{fill}" stroke-width="{width}" stroke-linecap="round" stroke-linejoin="round"/>'
    )


def hand(p):
    return f'<circle cx="{p[0]}" cy="{p[1]}" r="15" fill="{SKIN}" stroke="{INK}" stroke-width="{LINE}"/>'


def legs():
    return (
        f'<ellipse cx="200" cy="572" rx="96" ry="12" fill="{INK}" opacity="0.12"/>'
        + limb([(178, 410), (176, 538)], PANTS, 30)
        + limb([(222, 410), (224, 538)], PANTS, 30)
        + f'<path d="M140,560 C140,536 196,534 198,560 Z" fill="{WHITE}" stroke="{INK}" stroke-width="{LINE}" stroke-linejoin="round"/>'
        + f'<path d="M202,560 C204,534 260,536 260,560 Z" fill="{WHITE}" stroke="{INK}" stroke-width="{LINE}" stroke-linejoin="round"/>'
        + f'<line x1="140" y1="560" x2="198" y2="560" stroke="{GREEN}" stroke-width="5" stroke-linecap="round"/>'
        + f'<line x1="202" y1="560" x2="260" y2="560" stroke="{GREEN}" stroke-width="5" stroke-linecap="round"/>'
    )


def torso():
    return (
        # hoodie
        f'<path d="M146,224 C146,206 166,198 200,198 C234,198 254,206 254,224 L266,408 C266,420 258,424 246,424 '
        f'L154,424 C142,424 134,420 134,408 Z" fill="{GREEN}" stroke="{INK}" stroke-width="{LINE}" stroke-linejoin="round"/>'
        # ribbed hem
        f'<path d="M136,404 L264,404" stroke="{GREEN_DARK}" stroke-width="5"/>'
        # front pocket
        f'<path d="M160,346 L240,346 L234,384 L166,384 Z" fill="{GREEN_DARK}" stroke="{INK}" stroke-width="5" stroke-linejoin="round"/>'
        # drawstrings
        f'<path d="M188,214 L184,268" stroke="{WHITE}" stroke-width="5" stroke-linecap="round"/>'
        f'<path d="M212,214 L216,268" stroke="{WHITE}" stroke-width="5" stroke-linecap="round"/>'
        f'<circle cx="184" cy="270" r="4" fill="{WHITE}"/><circle cx="216" cy="270" r="4" fill="{WHITE}"/>'
        # hood resting behind the neck
        f'<path d="M140,212 C154,180 246,180 260,212 C236,198 164,198 140,212 Z" fill="{GREEN_DARK}" '
        f'stroke="{INK}" stroke-width="{LINE}" stroke-linejoin="round"/>'
        # headphones round the neck
        f'<path d="M154,218 C164,246 236,246 246,218" fill="none" stroke="{INK}" stroke-width="9" stroke-linecap="round"/>'
        f'<rect x="136" y="202" width="28" height="38" rx="10" fill="{PANTS}" stroke="{INK}" stroke-width="5"/>'
        f'<rect x="236" y="202" width="28" height="38" rx="10" fill="{PANTS}" stroke="{INK}" stroke-width="5"/>'
    )


def head(tilt):
    dots = "".join(
        f'<circle cx="{x}" cy="{84 if i % 2 else 72}" r="3.5" fill="{GREEN}"/>'
        for i, x in enumerate(range(150, 256, 15))
    )
    return (
        f'<g transform="rotate({tilt} {NECK[0]} {NECK[1]})">'
        f'<circle cx="200" cy="122" r="70" fill="{SKIN}" stroke="{INK}" stroke-width="{LINE}"/>'
        f'<path d="M131,108 C133,40 267,40 269,108 Z" fill="{WHITE}" stroke="{INK}" stroke-width="{LINE}" stroke-linejoin="round"/>'
        f"{dots}</g>"
    )


def bubble(symbol, color):
    base = (
        f'<path d="M318,104 L298,128 L334,110 Z" fill="{WHITE}" stroke="{INK}" stroke-width="{LINE}" stroke-linejoin="round"/>'
        f'<circle cx="342" cy="66" r="44" fill="{WHITE}" stroke="{INK}" stroke-width="{LINE}"/>'
    )
    if symbol == "lamp":
        glyph = (
            f'<circle cx="342" cy="58" r="18" fill="{color}" stroke="{INK}" stroke-width="5"/>'
            f'<rect x="333" y="74" width="18" height="12" rx="3" fill="{INK}"/>'
        )
    else:
        glyph = (
            f'<text x="342" y="88" text-anchor="middle" font-family="DejaVu Sans, Arial, sans-serif" '
            f'font-weight="bold" font-size="60" fill="{color}" stroke="{INK}" stroke-width="3">{symbol}</text>'
        )
    return base + glyph


def extra(kind, pose):
    hx, hy = pose["r"][1]
    if kind == "point":
        return f'<line x1="{hx}" y1="{hy}" x2="{hx + 28}" y2="{hy - 3}" stroke="{INK}" stroke-width="9" stroke-linecap="round"/>'
    if kind == "thumb":
        return f'<line x1="{hx}" y1="{hy - 8}" x2="{hx}" y2="{hy - 34}" stroke="{INK}" stroke-width="10" stroke-linecap="round"/>'
    if kind == "wave":
        return "".join(
            f'<path d="M{356 + i * 13},{100 + i * 15} q11,11 0,24" fill="none" stroke="{INK}" stroke-width="5" stroke-linecap="round"/>'
            for i in range(2)
        )
    return ""


PHONE = (
    f'<rect x="178" y="262" width="44" height="74" rx="8" fill="{INK}"/>'
    f'<rect x="184" y="270" width="32" height="56" rx="4" fill="{GOLD}" opacity="0.9"/>'
)


def svg(name, pose):
    l_el, l_hand = pose["l"]
    r_el, r_hand = pose["r"]
    parts = [
        legs(),
        torso(),
        head(pose.get("tilt", 0)),
        limb([SHOULDER_L, l_el, l_hand], GREEN, 26),
        limb([SHOULDER_R, r_el, r_hand], GREEN, 26),
    ]
    if pose.get("extra") == "phone":
        parts.append(PHONE)
    parts += [hand(l_hand), hand(r_hand)]
    if pose.get("extra") in ("point", "thumb", "wave"):
        parts.append(extra(pose["extra"], pose))
    if pose.get("bubble"):
        parts.append(bubble(pose["bubble"], pose.get("bubble_color", GREEN)))
    inner = "\n  ".join(parts)
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 600" width="420" height="600">\n'
        f"  <title>Hadi - {name}</title>\n  {inner}\n</svg>\n"
    )


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    for old in OUT.glob("hadi-*.svg"):
        old.unlink()
    for name, pose in POSES.items():
        (OUT / f"hadi-{name}.svg").write_text(svg(name, pose))
    print(f"Wrote {len(POSES)} poses to {OUT}")
