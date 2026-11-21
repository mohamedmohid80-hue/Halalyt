"""Two more GTA scenes for episode 2: buying GTA VI, and Hadi's room with older GTA games.

    python3 tools/make_gta_scenes2.py  ->  images/gta-scenes/6-buying-gta6.png, 7-hadis-room.png
"""
import sys
from pathlib import Path

import cairosvg

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tools"))
import make_hadi as H  # noqa: E402
from make_gta_scenes import hadi, OUT, W, HGT  # noqa: E402

INK = H.INK
DEFS = ('<defs>'
        '<linearGradient id="vi" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFD36E"/><stop offset=".5" stop-color="#FF6FA0"/><stop offset="1" stop-color="#A64DFF"/></linearGradient>'
        '<linearGradient id="art6" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3A1460"/><stop offset=".55" stop-color="#B23A8F"/><stop offset="1" stop-color="#FF8A6B"/></linearGradient>'
        '<linearGradient id="art5" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1F3A2A"/><stop offset="1" stop-color="#6FA36A"/></linearGradient>'
        '<linearGradient id="art4" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2A2A30"/><stop offset="1" stop-color="#8A8F9A"/></linearGradient>'
        '<linearGradient id="artsa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5A3A1A"/><stop offset="1" stop-color="#E0A040"/></linearGradient>'
        '</defs>')


def game_case(x, y, w, label, art, band="#0B5FD7", band_text="PS5", rot=0, big=True):
    h = w * 1.25
    lab = (f'<text x="{w / 2}" y="{h * .62}" text-anchor="middle" font-family="DejaVu Sans" font-weight="bold" font-size="{w * .26}" fill="#fff" stroke="#000" stroke-width="{w * .012}" paint-order="stroke">GTA</text>'
           f'<text x="{w / 2}" y="{h * .86}" text-anchor="middle" font-family="DejaVu Serif" font-weight="bold" font-size="{w * .34}" fill="{"url(#vi)" if label == "VI" else "#fff"}" stroke="#000" stroke-width="{w * .012}" paint-order="stroke">{label}</text>')
    return (f'<g transform="translate({x} {y}) rotate({rot})">'
            f'<rect width="{w}" height="{h}" rx="{w * .05}" fill="url(#{art})" stroke="{INK}" stroke-width="{max(4, w * .03)}"/>'
            f'<rect width="{w}" height="{h * .14}" rx="{w * .05}" fill="{band}"/>'
            f'<text x="{w * .08}" y="{h * .105}" font-family="DejaVu Sans" font-weight="bold" font-size="{w * .1}" fill="#fff">{band_text}</text>'
            f'{lab}</g>')


def scene_buying():
    s = f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{HGT}" viewBox="0 0 {W} {HGT}">{DEFS}'
    s += '<rect width="1920" height="1080" fill="#E9EEF5"/><rect y="800" width="1920" height="280" fill="#B9C2CF"/>'
    s += f'<rect x="60" y="60" width="560" height="110" rx="14" fill="#0B5FD7" stroke="{INK}" stroke-width="6"/>'
    s += '<text x="340" y="135" text-anchor="middle" font-family="DejaVu Sans" font-weight="bold" font-size="58" fill="#fff">GAME STORE</text>'
    # shelves of game cases (generic colours)
    cols = ["#3A6EA5", "#C0392B", "#27AE60", "#8E44AD", "#D35400", "#2C3E50"]
    for r, yy in enumerate((260, 470)):
        s += f'<rect x="1080" y="{yy + 160}" width="780" height="18" fill="#8A6A4A"/>'
        for k in range(9):
            c = cols[(k + r) % len(cols)]
            s += f'<rect x="{1100 + k * 84}" y="{yy}" width="70" height="160" rx="6" fill="{c}" stroke="{INK}" stroke-width="4"/><rect x="{1100 + k * 84}" y="{yy}" width="70" height="22" rx="6" fill="#0B5FD7"/>'
    # "NEW RELEASE" stand with GTA VI copies
    s += f'<rect x="1150" y="700" width="560" height="120" fill="#2B1F45" stroke="{INK}" stroke-width="6"/>'
    s += '<text x="1430" y="775" text-anchor="middle" font-family="DejaVu Sans" font-weight="bold" font-size="52" fill="#FFD36E">NEW RELEASE</text>'
    for i in range(4):
        s += game_case(1180 + i * 130, 560, 110, "VI", "art6")
    # counter
    s += f'<rect x="60" y="640" width="820" height="280" fill="#3A4252" stroke="{INK}" stroke-width="8"/><rect x="60" y="620" width="820" height="40" fill="#4C5668" stroke="{INK}" stroke-width="8"/>'
    s += f'<rect x="120" y="500" width="200" height="125" rx="10" fill="#22262E" stroke="{INK}" stroke-width="6"/><rect x="138" y="516" width="164" height="70" fill="#7CFF8A"/>'
    s += '<text x="220" y="565" text-anchor="middle" font-family="DejaVu Sans" font-weight="bold" font-size="34" fill="#14421E">$69.99</text>'
    # Hadi holding up GTA VI proudly
    case = game_case(296, 120, 150, "VI", "art6", rot=-6)
    s += hadi((130, 312), (136, 384), (316, 220), (330, 290), 760, 300, 1.0, tilt=-4, extra=case)
    s += '<g fill="#FFD23F">' + ''.join(f'<path transform="translate({x} {y})" d="M0,-22 L6,-6 L22,0 L6,6 L0,22 L-6,6 L-22,0 L-6,-6 Z"/>' for x, y in ((1150, 360), (1240, 300), (1210, 520))) + '</g>'
    return s + '</svg>'


def scene_room():
    s = f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{HGT}" viewBox="0 0 {W} {HGT}">{DEFS}'
    s += '<rect width="1920" height="1080" fill="#3B4A6B"/><rect y="820" width="1920" height="260" fill="#6B5240"/>'
    # window at night
    s += f'<rect x="140" y="140" width="420" height="320" fill="#141A33" stroke="#E8E2D4" stroke-width="18"/><line x1="350" y1="140" x2="350" y2="460" stroke="#E8E2D4" stroke-width="12"/>'
    s += '<path d="M480,190 a32,32 0 1,0 22,56 a26,26 0 1,1 -22,-56 Z" fill="#FFF3D6"/>'
    # bed
    s += f'<rect x="80" y="640" width="560" height="200" rx="20" fill="#2E6F9E" stroke="{INK}" stroke-width="8"/><rect x="80" y="600" width="170" height="90" rx="20" fill="#F4F1EA" stroke="{INK}" stroke-width="8"/><rect x="60" y="520" width="40" height="330" fill="#5A4030" stroke="{INK}" stroke-width="6"/>'
    # poster
    s += f'<rect x="760" y="120" width="230" height="300" fill="url(#art5)" stroke="{INK}" stroke-width="8"/>'
    s += '<text x="875" y="300" text-anchor="middle" font-family="DejaVu Sans" font-weight="bold" font-size="64" fill="#fff" stroke="#000" stroke-width="3" paint-order="stroke">GTA</text><text x="875" y="380" text-anchor="middle" font-family="DejaVu Serif" font-weight="bold" font-size="72" fill="#fff" stroke="#000" stroke-width="3" paint-order="stroke">V</text>'
    # desk + monitor + console
    s += f'<rect x="1060" y="600" width="780" height="40" fill="#8A6A4A" stroke="{INK}" stroke-width="8"/><rect x="1090" y="640" width="30" height="200" fill="#6E5236" stroke="{INK}" stroke-width="6"/><rect x="1780" y="640" width="30" height="200" fill="#6E5236" stroke="{INK}" stroke-width="6"/>'
    s += f'<rect x="1380" y="300" width="420" height="250" rx="12" fill="#0B0B10" stroke="{INK}" stroke-width="8"/><rect x="1398" y="318" width="384" height="214" fill="#1E2A44"/><rect x="1570" y="550" width="40" height="50" fill="#0B0B10"/>'
    s += '<text x="1590" y="440" text-anchor="middle" font-family="DejaVu Sans" font-weight="bold" font-size="40" fill="#5C7BB0">PRESS START</text>'
    s += f'<path d="M1300,600 L1300,420 Q1300,400 1320,400 L1350,400 Q1370,400 1370,420 L1370,600 Z" fill="#F4F4F6" stroke="{INK}" stroke-width="6"/>'
    s += f'<g transform="translate(1520 575)"><path d="M-60,0 Q-70,-28 -40,-30 L40,-30 Q70,-28 60,0 Q50,22 25,10 L-25,10 Q-50,22 -60,0 Z" fill="#2B2B33" stroke="{INK}" stroke-width="5"/></g>'
    # older GTA games on the desk: a stack and two standing cases
    s += game_case(1090, 445, 110, "V", "art5", band="#1A1A1A", band_text="PS4")
    s += game_case(1210, 470, 90, "IV", "art4", band="#1A1A1A", band_text="PS3", rot=8)
    for i, (lab, art) in enumerate((("SA", "artsa"), ("IV", "art4"), ("V", "art5"))):
        s += f'<rect x="1640" y="{580 - i * 18}" width="150" height="18" rx="3" fill="url(#{art})" stroke="{INK}" stroke-width="4"/>'
    # Hadi standing by his desk, thinking
    s += hadi((140, 312), (150, 300), (300, 322), (230, 206), 560, 330, 0.95, tilt=6,
              extra=H.bubble("?", H.GREEN))
    return s + '</svg>'


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    for name, svg in (("6-buying-gta6", scene_buying()), ("7-hadis-room", scene_room())):
        cairosvg.svg2png(bytestring=svg.encode(), write_to=str(OUT / f"{name}.png"), output_width=W, output_height=HGT)
        print("wrote", name)
