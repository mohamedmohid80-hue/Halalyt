"""Three alternative design concepts for the channel character Hadi.

    python3 tools/hadi_concepts.py

Writes brand/concepts/<concept>-<pose>.svg (3 concepts x 3 poses).
All concepts are faceless.
"""
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "brand" / "concepts"

INK = "#17201B"
GREEN = "#1E7B4F"
GREEN_DARK = "#145C3A"
GOLD = "#E8A92E"
GOLD_DARK = "#B9801A"
SKIN = "#D9A57B"
WHITE = "#FFFFFF"
GLASS = "#FFD978"


def wrap(name, body):
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 480" width="400" height="480">'
        f"<title>{name}</title>{body}</svg>\n"
    )


def bubble(sym, color=GREEN):
    return (
        f'<path d="M318,104 L298,128 L334,110 Z" fill="{WHITE}" stroke="{INK}" stroke-width="6" stroke-linejoin="round"/>'
        f'<circle cx="340" cy="70" r="42" fill="{WHITE}" stroke="{INK}" stroke-width="6"/>'
        f'<text x="340" y="91" text-anchor="middle" font-family="DejaVu Sans, Arial, sans-serif" font-weight="bold" '
        f'font-size="58" fill="{color}" stroke="{INK}" stroke-width="3">{sym}</text>'
    )


def outlined_limb(pts, fill, width, outline=6):
    d = "M" + " L".join(f"{x},{y}" for x, y in pts)
    return (
        f'<path d="{d}" fill="none" stroke="{INK}" stroke-width="{width + outline * 2}" stroke-linecap="round" stroke-linejoin="round"/>'
        f'<path d="{d}" fill="none" stroke="{fill}" stroke-width="{width}" stroke-linecap="round" stroke-linejoin="round"/>'
    )


def dot(p, r, fill, outline=6):
    return f'<circle cx="{p[0]}" cy="{p[1]}" r="{r}" fill="{fill}" stroke="{INK}" stroke-width="{outline}"/>'


# --------------------------------------------------------------------------
# Concept A: chibi creator. Big head, green hoodie, headphones round the neck.
# --------------------------------------------------------------------------
A_POSES = {
    "neutral": [((112, 322), (118, 372)), ((288, 322), (282, 372))],
    "point": [((112, 322), (118, 372)), ((326, 262), (366, 250))],
    "think": [((112, 322), (118, 372)), ((296, 332), (238, 248))],
}


def concept_a(pose):
    (l_el, l_h), (r_el, r_h) = A_POSES[pose]
    s = f'<ellipse cx="200" cy="462" rx="90" ry="11" fill="{INK}" opacity="0.12"/>'
    # legs + sneakers
    s += outlined_limb([(176, 400), (174, 440)], "#2B3440", 26)
    s += outlined_limb([(224, 400), (226, 440)], "#2B3440", 26)
    s += f'<ellipse cx="168" cy="448" rx="26" ry="13" fill="{WHITE}" stroke="{INK}" stroke-width="6"/>'
    s += f'<ellipse cx="232" cy="448" rx="26" ry="13" fill="{WHITE}" stroke="{INK}" stroke-width="6"/>'
    # hoodie body
    s += (
        f'<path d="M140,262 C140,242 160,232 200,232 C240,232 260,242 260,262 L270,398 C270,410 262,414 250,414 '
        f'L150,414 C138,414 130,410 130,398 Z" fill="{GREEN}" stroke="{INK}" stroke-width="6" stroke-linejoin="round"/>'
    )
    s += f'<path d="M160,372 L240,372 L234,404 L166,404 Z" fill="{GREEN_DARK}" stroke="{INK}" stroke-width="5" stroke-linejoin="round"/>'
    s += f'<line x1="186" y1="250" x2="182" y2="300" stroke="{WHITE}" stroke-width="5" stroke-linecap="round"/>'
    s += f'<line x1="214" y1="250" x2="218" y2="300" stroke="{WHITE}" stroke-width="5" stroke-linecap="round"/>'
    # hood behind the neck
    s += f'<path d="M136,244 C150,214 250,214 264,244 C240,232 160,232 136,244 Z" fill="{GREEN_DARK}" stroke="{INK}" stroke-width="6" stroke-linejoin="round"/>'
    # head (faceless) + white kufi with stitch dots
    s += dot((200, 150), 86, SKIN, 7)
    s += f'<path d="M116,134 C118,52 282,52 284,134 Z" fill="{WHITE}" stroke="{INK}" stroke-width="7" stroke-linejoin="round"/>'
    for i, x in enumerate(range(138, 270, 18)):
        y = 112 if i % 2 else 98
        s += f'<circle cx="{x}" cy="{y}" r="3.5" fill="{GREEN}"/>'
    # headphones round the neck
    s += f'<path d="M150,250 C160,276 240,276 250,250" fill="none" stroke="{INK}" stroke-width="9" stroke-linecap="round"/>'
    s += f'<rect x="132" y="236" width="28" height="36" rx="10" fill="#2B3440" stroke="{INK}" stroke-width="5"/>'
    s += f'<rect x="240" y="236" width="28" height="36" rx="10" fill="#2B3440" stroke="{INK}" stroke-width="5"/>'
    # arms
    s += outlined_limb([(146, 272), l_el, l_h], GREEN, 26)
    s += outlined_limb([(254, 272), r_el, r_h], GREEN, 26)
    s += dot(l_h, 15, SKIN) + dot(r_h, 15, SKIN)
    if pose == "point":
        s += f'<line x1="{r_h[0]}" y1="{r_h[1]}" x2="{r_h[0] + 26}" y2="{r_h[1] - 4}" stroke="{INK}" stroke-width="9" stroke-linecap="round"/>'
    if pose == "think":
        s += bubble("?")
    return s


# --------------------------------------------------------------------------
# Concept B: a lantern (fanoos). "Hadi" = the one who guides, a guiding light.
# --------------------------------------------------------------------------
B_POSES = {
    "neutral": [((108, 292), (104, 338)), ((292, 292), (296, 338))],
    "point": [((108, 292), (104, 338)), ((316, 232), (360, 222))],
    "think": [((108, 292), (104, 338)), ((306, 290), (262, 196))],
}


def star(cx, cy, r, color, width):
    sq = lambda rot: (
        f'<rect x="{cx - r}" y="{cy - r}" width="{2 * r}" height="{2 * r}" fill="none" stroke="{color}" '
        f'stroke-width="{width}" stroke-linejoin="round" transform="rotate({rot} {cx} {cy})"/>'
    )
    return sq(0) + sq(45)


def concept_b(pose):
    (l_el, l_h), (r_el, r_h) = B_POSES[pose]
    s = (
        '<defs><radialGradient id="glow"><stop offset="0" stop-color="#FFE7A3" stop-opacity="0.9"/>'
        '<stop offset="1" stop-color="#FFE7A3" stop-opacity="0"/></radialGradient>'
        '<linearGradient id="glass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF1BF"/>'
        f'<stop offset="1" stop-color="{GLASS}"/></linearGradient></defs>'
    )
    s += '<circle cx="200" cy="258" r="170" fill="url(#glow)"/>'
    s += f'<ellipse cx="200" cy="462" rx="80" ry="10" fill="{INK}" opacity="0.12"/>'
    # legs
    for x0, x1 in ((178, 172), (222, 228)):
        s += f'<line x1="{x0}" y1="388" x2="{x1}" y2="440" stroke="{INK}" stroke-width="10" stroke-linecap="round"/>'
    s += f'<ellipse cx="164" cy="446" rx="20" ry="10" fill="{INK}"/><ellipse cx="236" cy="446" rx="20" ry="10" fill="{INK}"/>'
    # arms (thin ink limbs) drawn behind the body
    for sh, el, h in (((140, 240), l_el, l_h), ((260, 240), r_el, r_h)):
        s += f'<path d="M{sh[0]},{sh[1]} L{el[0]},{el[1]} L{h[0]},{h[1]}" fill="none" stroke="{INK}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>'
    # ring + dome
    s += f'<circle cx="200" cy="58" r="15" fill="none" stroke="{INK}" stroke-width="7"/>'
    s += f'<circle cx="200" cy="58" r="15" fill="none" stroke="{GOLD}" stroke-width="3"/>'
    s += f'<path d="M146,140 C148,104 176,82 200,74 C224,82 252,104 254,140 Z" fill="{GOLD}" stroke="{INK}" stroke-width="7" stroke-linejoin="round"/>'
    s += f'<path d="M172,138 C174,112 188,96 200,90 C212,96 226,112 228,138" fill="none" stroke="{GOLD_DARK}" stroke-width="5"/>'
    s += f'<rect x="136" y="138" width="128" height="20" rx="6" fill="{GOLD_DARK}" stroke="{INK}" stroke-width="6"/>'
    # glass body
    s += f'<path d="M146,158 L254,158 L270,258 L254,358 L146,358 L130,258 Z" fill="url(#glass)" stroke="{INK}" stroke-width="7" stroke-linejoin="round"/>'
    s += f'<path d="M172,158 L164,258 L172,358 M228,158 L236,258 L228,358" fill="none" stroke="{GOLD_DARK}" stroke-width="5"/>'
    s += star(200, 258, 26, GOLD_DARK, 5)
    s += f'<circle cx="200" cy="258" r="10" fill="#FFFFFF" opacity="0.9"/>'
    # base
    s += f'<path d="M146,358 L254,358 L266,390 L134,390 Z" fill="{GOLD}" stroke="{INK}" stroke-width="7" stroke-linejoin="round"/>'
    # hands on top
    s += dot(l_h, 13, GOLD) + dot(r_h, 13, GOLD)
    if pose == "point":
        s += f'<line x1="{r_h[0]}" y1="{r_h[1]}" x2="{r_h[0] + 24}" y2="{r_h[1] - 3}" stroke="{INK}" stroke-width="8" stroke-linecap="round"/>'
    if pose == "think":
        s += bubble("?", GOLD_DARK)
    return s


# --------------------------------------------------------------------------
# Concept C: modern silhouette. One solid green figure, white kufi, sneakers.
# --------------------------------------------------------------------------
C_POSES = {
    "neutral": [((136, 262), (140, 326)), ((264, 262), (260, 326))],
    "point": [((136, 262), (140, 326)), ((300, 186), (352, 180))],
    "think": [((136, 262), (140, 326)), ((272, 262), (226, 166))],
}


def concept_c(pose):
    (l_el, l_h), (r_el, r_h) = C_POSES[pose]
    s = f'<ellipse cx="200" cy="462" rx="80" ry="10" fill="{INK}" opacity="0.12"/>'
    # legs + sneakers
    for x0, x1 in ((182, 178), (218, 222)):
        s += f'<line x1="{x0}" y1="330" x2="{x1}" y2="436" stroke="{GREEN_DARK}" stroke-width="32" stroke-linecap="round"/>'
    s += f'<path d="M150,446 C150,430 196,430 196,446 Z" fill="{WHITE}" stroke="{INK}" stroke-width="5"/>'
    s += f'<path d="M204,446 C204,430 250,430 250,446 Z" fill="{WHITE}" stroke="{INK}" stroke-width="5"/>'
    # arms behind torso
    for sh, el, h in (((156, 190), l_el, l_h), ((244, 190), r_el, r_h)):
        s += f'<path d="M{sh[0]},{sh[1]} L{el[0]},{el[1]} L{h[0]},{h[1]}" fill="none" stroke="{GREEN}" stroke-width="30" stroke-linecap="round" stroke-linejoin="round"/>'
    # hoodie torso with gold rim
    s += f'<path d="M150,186 C150,172 170,166 200,166 C230,166 250,172 250,186 L244,340 L156,340 Z" fill="{GREEN}" stroke="{GOLD}" stroke-width="4" stroke-linejoin="round"/>'
    s += f'<path d="M176,300 L224,300 L220,326 L180,326 Z" fill="{GREEN_DARK}"/>'
    # head (solid, faceless) + white kufi with gold band
    s += f'<circle cx="200" cy="112" r="48" fill="{GREEN}" stroke="{GOLD}" stroke-width="4"/>'
    s += f'<path d="M150,104 C152,50 248,50 250,104 Z" fill="{WHITE}"/>'
    s += f'<path d="M152,98 C176,92 224,92 248,98" fill="none" stroke="{GOLD}" stroke-width="6" stroke-linecap="round"/>'
    # hands (same green, slightly darker)
    s += f'<circle cx="{l_h[0]}" cy="{l_h[1]}" r="17" fill="{GREEN_DARK}"/><circle cx="{r_h[0]}" cy="{r_h[1]}" r="17" fill="{GREEN_DARK}"/>'
    if pose == "point":
        s += f'<line x1="{r_h[0]}" y1="{r_h[1]}" x2="{r_h[0] + 26}" y2="{r_h[1] - 3}" stroke="{GREEN_DARK}" stroke-width="11" stroke-linecap="round"/>'
    if pose == "think":
        s += bubble("?")
    return s


CONCEPTS = {"a-creator": concept_a, "b-lantern": concept_b, "c-silhouette": concept_c}

if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    for cname, fn in CONCEPTS.items():
        for pose in ("neutral", "point", "think"):
            (OUT / f"{cname}-{pose}.svg").write_text(wrap(f"Hadi {cname} {pose}", fn(pose)))
    print("Wrote concepts to", OUT)
