"""Assemble remotion/Ep08Full.tsx from the board helpers + remotion/ep6/{helpers6.js,scenes-body.js} + the ep4 engine.
    python3 tools/build_ep08.py
"""
from pathlib import Path
R = Path(__file__).resolve().parent.parent
head = (R / "remotion/ep4/header.tsx").read_text().replace("staticFile('ep4v/x')", "staticFile('ep8v/x')").replace('Ep04 "Delaying Salah": full video, built from storyboards/04-salah-v4', 'Ep08 "Thousands of good deeds": full video, built from storyboards/08-good-deeds')
board = (R / "storyboards/08-good-deeds/index.html").read_text()
helpers = board[board.index("let _id=0;"):board.index("const M=")]
helpers = helpers.replace("url(img/", "url(${A}img/").replace("url(bg-", "url(${A}bg-").replace("url(photos/", "url(${A}photos/").replace('src="hadi/', 'src="${A}hadi/')
css = board[board.index("/* scene elements"):board.index("</style>")].replace("`", "\\`") + ".hlbox,.hlbox *{color:transparent!important;background:transparent!important;border-color:transparent!important;text-shadow:none!important}.hlbox{box-shadow:0 0 0 8px var(--hl),0 0 28px var(--hl)!important}"
eng = (R / "remotion/ep8/engine.js").read_text()
for a, b in [("EP04F_", "EP08F_"), ("Ep04Full", "Ep08Full"), ("u.includes('ep4v')", "u.includes('ep8v')"), ("ep4 assets", "ep6 assets"), ("staticFile(`ep4v/sfx/", "staticFile(`ep8v/sfx/"), ("staticFile(`ep4v/${f}`)", "staticFile(`ep8v/${f}`)")]:
    eng = eng.replace(a, b)
out = head.replace("/*CSS*/", css) + helpers + "const SCRIPT = " + (R / "remotion/ep8/script.json").read_text() + ";\n" + (R / "remotion/ep8/scenes-body.js").read_text() + (R / "remotion/ep8/timemap.js").read_text() + eng
(R / "remotion/Ep08Full.tsx").write_text(out)
print("wrote remotion/Ep08Full.tsx")
