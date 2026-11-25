"""Assemble remotion/Ep04Full.tsx from the board helpers + remotion/ep4/{scenes-body.js,engine.js}.
    python3 tools/build_ep04.py
"""
import re
from pathlib import Path
R = Path(__file__).resolve().parent.parent
board = (R / "storyboards/04-salah-v4/index.html").read_text()
helpers = board[board.index("let _id=0;"):board.index("// ---------- scenes ----------")]
helpers = (helpers.replace("url(bg-", "url(${A}bg-").replace("url(photos/", "url(${A}photos/").replace('src="hadi/', 'src="${A}hadi/')
           .replace("'bg-'+f+'.png':'photos/'+f+'.jpg'", "A+'bg-'+f+'.png':A+'photos/'+f+'.jpg'"))
css = board[board.index("/* scene elements"):board.index("</style>")].replace("`", "\\`")
head = (R / "remotion/ep4/header.tsx").read_text()
out = head.replace("/*CSS*/", css) + helpers + (R / "remotion/ep4/scenes-body.js").read_text() + (R / "remotion/ep4/timemap.js").read_text() + (R / "remotion/ep4/engine.js").read_text()
(R / "remotion/Ep04Full.tsx").write_text(out)
print("wrote remotion/Ep04Full.tsx")
