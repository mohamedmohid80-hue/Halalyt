"""Respectful figures for prophet stories: thobe, Arab turban, and a soft light in place of the face
(no facial features, ever). Same line style as the Hadi rig.

    python3 tools/figure_prophet.py      -> brand/figures/*.svg + brand/figures-sheet.png
"""
from pathlib import Path

import cairosvg

import hadi_rig as rig

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "brand" / "figures"
INK, LW = rig.INK, rig.LW
THOBE, THOBE_SH, TURBAN, TURBAN_SH, SANDAL = "#FBF8F1", "#E7E0D2", "#F4EEE2", "#D9CFBE", "#8A6A4A"
CLOAKS = {"olive": ("#6F7A4A", "#59633A"), "brown": ("#8B5E3C", "#6E4A2E"), "sand": ("#C9A97A", "#AE8F62")}

DEFS = """<defs>
<radialGradient id="lightFace" cx="50%" cy="45%" r="55%"><stop offset="0%" stop-color="#FFFFFF"/><stop offset="55%" stop-color="#FFF6D8"/><stop offset="100%" stop-color="#FFE29A"/></radialGradient>
<radialGradient id="halo" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#FFE9A8" stop-opacity=".85"/><stop offset="60%" stop-color="#FFE9A8" stop-opacity=".35"/><stop offset="100%" stop-color="#FFE9A8" stop-opacity="0"/></radialGradient>
</defs>"""


def light_head(head="turban", cloth=("#E9DDC6", "#CDBB98")):
    """Face = soft light, no features. head: 'turban' (prophets) or 'shemagh' (other believers)."""
    halo = '<circle cx="200" cy="124" r="118" fill="url(#halo)"/>'
    face = f'<circle cx="200" cy="128" r="64" fill="url(#lightFace)" stroke="{INK}" stroke-width="{LW}"/>'
    if head == "turban":
        wrap = (f'<path d="M128,120 C116,66 148,28 200,26 C252,28 284,66 272,120 C244,104 156,104 128,120 Z" fill="{TURBAN}" stroke="{INK}" stroke-width="{LW}" stroke-linejoin="round"/>'
                f'<path d="M136,104 C160,62 214,48 262,72" fill="none" stroke="{TURBAN_SH}" stroke-width="8" stroke-linecap="round"/>'
                f'<path d="M144,80 C176,44 226,40 256,56" fill="none" stroke="{TURBAN_SH}" stroke-width="8" stroke-linecap="round"/>'
                f'<path d="M134,114 C172,92 232,90 268,108" fill="none" stroke="{TURBAN_SH}" stroke-width="7" stroke-linecap="round"/>'
                f'<path d="M170,40 C190,34 214,34 232,40" fill="none" stroke="{TURBAN_SH}" stroke-width="6" stroke-linecap="round"/>')
        tail = f'<path d="M140,104 C120,140 118,190 132,232 L156,228 C146,192 148,150 160,112 Z" fill="{TURBAN}" stroke="{INK}" stroke-width="{LW}" stroke-linejoin="round"/>'
        return tail + halo + face + wrap
    c, cs = cloth
    drape = (f'<path d="M128,122 C120,44 280,44 272,122 L272,218 C246,206 154,206 128,218 Z" fill="{c}" stroke="{INK}" stroke-width="{LW}" stroke-linejoin="round"/>'
             f'<path d="M150,76 C180,62 220,62 250,76" fill="none" stroke="{cs}" stroke-width="7" stroke-linecap="round"/>')
    band = f'<path d="M132,100 C170,86 230,86 268,100" fill="none" stroke="{INK}" stroke-width="10" stroke-linecap="round"/>'
    return drape + halo + face + band


def robe(color=THOBE, shade=THOBE_SH):
    return (f'<path d="M150,214 C150,200 170,194 200,194 C230,194 250,200 250,214 L284,548 C284,560 276,564 264,564 L136,564 C124,564 116,560 116,548 Z" fill="{color}" stroke="{INK}" stroke-width="{LW}" stroke-linejoin="round"/>'
            f'<path d="M200,214 L200,330" stroke="{shade}" stroke-width="6" stroke-linecap="round"/>'
            f'<path d="M168,300 L156,540" stroke="{shade}" stroke-width="5" stroke-linecap="round"/><path d="M232,300 L244,540" stroke="{shade}" stroke-width="5" stroke-linecap="round"/>')


def sandals(x1=170, x2=230, y=572):
    return "".join(f'<rect x="{x - 26}" y="{y - 10}" width="52" height="18" rx="9" fill="{SANDAL}" stroke="{INK}" stroke-width="6"/>' for x in (x1, x2))


SH_L, SH_R = (156, 236), (244, 236)


def arms(la, ra, color=THOBE):
    def hand(p):
        return f'<circle cx="{p[0]:.1f}" cy="{p[1]:.1f}" r="15" fill="{rig.SKIN}" stroke="{INK}" stroke-width="{LW}"/>'
    return rig.limb([SH_L, *la], color, 30) + rig.limb([SH_R, *ra], color, 30) + hand(la[-1]) + hand(ra[-1])


POSES = {
    "stand": dict(la=[(134, 320), (138, 400)], ra=[(266, 320), (262, 400)]),
    "dua": dict(la=[(150, 330), (174, 286)], ra=[(250, 330), (226, 286)]),
    "point": dict(la=[(134, 320), (138, 400)], ra=[(300, 270), (360, 236)]),
    "calm-hands": dict(la=[(150, 330), (190, 330)], ra=[(250, 330), (210, 330)]),
}


def figure(pose="stand", kind="prophet", cloak="olive"):
    p = POSES[pose]
    if kind == "prophet":
        body = robe() + arms(p["la"], p["ra"]) + light_head("turban")
    else:
        c, cs = CLOAKS[cloak]
        body = robe(c, cs) + arms(p["la"], p["ra"], c) + light_head("shemagh", (rig.WHITE, "#D9D2C4") if cloak != "sand" else ("#F1E6D0", "#D6C3A0"))
    shadow = f'<ellipse cx="200" cy="588" rx="104" ry="12" fill="{INK}" opacity=".12"/>'
    return shadow + sandals() + body


def svg(pose="stand", kind="prophet", cloak="olive"):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="-60 -20 540 640" width="540" height="640">{DEFS}{figure(pose, kind, cloak)}</svg>\n'


if __name__ == "__main__":
    from PIL import Image, ImageDraw, ImageFont
    OUT.mkdir(parents=True, exist_ok=True)
    items = [("prophet", p, None) for p in POSES] + [("youth", "stand", "olive"), ("youth", "dua", "brown"), ("youth", "calm-hands", "sand")]
    sheet = Image.new("RGB", (len(items) * 270, 360), "#F4F1EA")
    d = ImageDraw.Draw(sheet)
    font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 16)
    for i, (kind, pose, cloak) in enumerate(items):
        name = f"{kind}-{pose}" + (f"-{cloak}" if cloak else "")
        s = svg(pose, kind, cloak or "olive")
        (OUT / f"{name}.svg").write_text(s)
        cairosvg.svg2png(bytestring=s.encode(), write_to=str(OUT / f"{name}.png"), output_width=540, output_height=640)
        im = Image.open(OUT / f"{name}.png").convert("RGBA").resize((270, 320))
        sheet.paste(im, (i * 270, 0), im)
        d.text((i * 270 + 135, 330), name, fill="#17201B", font=font, anchor="mt")
    sheet.save(ROOT / "brand" / "figures-sheet.png")
    print(len(items), "figures")
