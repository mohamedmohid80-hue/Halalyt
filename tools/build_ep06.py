"""Assemble remotion/Ep06Full.tsx from the board helpers + remotion/ep6/{helpers6.js,scenes-body.js} + the ep4 engine.
    python3 tools/build_ep06.py
"""
from pathlib import Path
R = Path(__file__).resolve().parent.parent
head = (R / "remotion/ep4/header.tsx").read_text().replace("staticFile('ep4v/x')", "staticFile('ep6v/x')").replace('Ep04 "Delaying Salah": full video, built from storyboards/04-salah-v4', 'Ep06 "Photo poses": full video, built from storyboards/06-poses')
board = (R / "storyboards/06-poses/index.html").read_text()
helpers = board[board.index("let _id=0;"):board.index("// ---------- ep6 helpers ----------")]
helpers = helpers.replace("url(bg-", "url(${A}bg-").replace("url(photos/", "url(${A}photos/").replace('src="hadi/', 'src="${A}hadi/')
css = board[board.index("/* scene elements"):board.index("</style>")].replace("`", "\\`") + ".hlbox,.hlbox *{color:transparent!important;background:transparent!important;border-color:transparent!important;text-shadow:none!important}.hlbox{box-shadow:0 0 0 8px var(--hl),0 0 28px var(--hl)!important}"
eng = (R / "remotion/ep4/engine.js").read_text()
for a, b in [("EP04F_", "EP06F_"), ("Ep04Full", "Ep06Full"), ("u.includes('ep4v')", "u.includes('ep6v')"), ("ep4 assets", "ep6 assets"), ("staticFile(`ep4v/sfx/", "staticFile(`ep6v/sfx/"), ("staticFile(`ep4v/${f}`)", "staticFile(`ep6v/${f}`)")]:
    eng = eng.replace(a, b)
out = head.replace("/*CSS*/", css) + helpers + (R / "remotion/ep6/helpers6.js").read_text() + (R / "remotion/ep6/scenes-body.js").read_text() + eng
(R / "remotion/Ep06Full.tsx").write_text(out)
print("wrote remotion/Ep06Full.tsx")
