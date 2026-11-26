# Halal YT: Video Style Guide

The house style for every Halal YT video. It draws on two reference channels I studied frame by frame (a commentary video and a meme-breakdown video, both faceless, both for a Muslim audience). The ideas are borrowed; the look is our own.

**In one line:** plain white screen, a real internet image for every few words, simple keyframed motion, and Hadi as the narrator. Playful when we set up the story, still when we quote Allah or His Messenger ﷺ.


## Hard rules from channel feedback (these override anything below)

- **No images of women** in any video, even covered or seen from behind. Check every photo with people in it, crowds included; crop or replace it.
- **Prophets (and the People of the Cave) can be shown only as a figure in a thobe and Arab turban (or head cloth), with a soft light in place of the face and no facial features.** Use `tools/figure_prophet.py`. Never a face, never a voice acted as them.
- **No black silhouette figures.** Wherever a "person" is needed, use Hadi.
- **No emojis as the main visuals.** Narrate with small real photos, Hadi, and drawn diagrams (arrows, labels, highlight boxes, stamps).
- **No numbered section cards.** The script flows on; scene changes follow the script with straight cuts, not "1 / 2 / 3" chapter titles.
- **Pace:** a new beat about every 1.5–2 s, and nothing held for more than 3 s without a change.
- **Every scene passes the layout check** (`tools/audit_board.js` / `tools/audit_layout.mjs` + `tools/audit_layout.py`): no overlaps, nothing off-frame, no text spilling out of its box. Then check the frames by eye.

---

## 1. What I learned from the references

| | Reference A (commentary) | Reference B (meme breakdown) |
|---|---|---|
| Canvas | Pure white void, 16:9 | Pure white void, 16:9 |
| Character | Black pictogram stick figure | Hand-drawn bearded man in a kufi and thobe |
| Pace | Few hard cuts (4 in 3:14), but something moves every 2–4 s | 31 shots in 1:47, median shot **2.4 s** |
| Narration | Calm, ~125 words/min, true silence between phrases | Calm, slightly faster, constant background bed |
| First 3 s | Character points → whips off-screen at 1.0 s → subject slides in | Character whips in with motion blur at frame 1, caption appears at 1.2 s |
| Images | Centered "cards" that slide in, overshoot and slowly push in | Images cascade in from the right and stack on top of each other |
| Text | Small handwritten-style sentence lines; key words as colorful bubble-font stickers | 1–3-word stickers around the character, in different colors |
| Emphasis | Giant red ✕ that slams down from full screen onto a face; 3D emoji pop in | Arrow ↓ from slur to translation; red censor bars; colored karaoke highlight on the ayah |
| Sound | Almost dry: voice only, emphasis comes from visuals | Small dings on word pops, clicks on UI, a scribble on the red ✕ |
| Religious text | Hadith shown as a clean card **with source and grading** | Ayah shown full-screen with phrase-by-phrase color highlight and surah:ayah reference |
| Ending | Dua → "Ameen" → subscribe button + subscriber goal + wobbling meme GIF | Subscriber goal + meme GIF |

**What we keep:** the simple white world, a recurring character, image cards instead of footage, short stickers instead of full subtitles, censoring offensive text, and always citing sources.
**What we change:** our own palette and paper color, a faceless character, a fixed meaning for each color, stricter rules for religious content, and more motion design.

---

## 2. Canvas and color

- **Long form:** 1920×1080, 30 fps. **Shorts:** 1080×1920, 30 fps (same rules, everything stacked vertically).
- **Background:** plain white `#FFFFFF` (see §5.3).

| Token | Hex | Meaning (always the same) |
|---|---|---|
| `ink` | `#17201B` | Outlines, neutral text |
| `paper` | `#FAF6EE` | Background |
| `deen` (green) | `#1E7B4F` | Islamic, correct, halal, "do this" |
| `gold` | `#E8A92E` | Key fact, number, name, "remember this" |
| `warn` (red) | `#E5484D` | Wrong, haram, danger, censor bars |
| `sky` | `#2F80ED` | UI, links, "click here", platforms |

Viewers learn the code: **green = deen, red = warning, gold = the fact to remember.**

---

## 3. Typography

| Use | Font (Google Fonts, free) | Treatment |
|---|---|---|
| Stickers (1–3 words) | **Lilita One** | Color fill + 8 px `ink` outline + hard 6 px down-right shadow in `ink` at 25% |
| Sentence lines | **Nunito** ExtraBold | `ink` on paper, max 7 words per line, centered |
| Arabic (Quran, hadith, terms) | **Amiri** | `ink`, large, never outlined, never animated with bounce |
| UI/labels (handles, sources) | **Nunito** Bold | Small, `ink` at 70% |

Rules:
- **No always-on subtitles.** Text appears only when it adds something: a key word, a number, a quote, a translation.
- Stickers sit **around Hadi** (left/right/above), never covering him.
- At most **3 stickers on screen** at once. Clear them all together on a cut.
- Sentence lines are used for the **message section** (the moral), and they reveal word by word in sync with the narration from faster-whisper timestamps.

---

## 4. Meet Hadi (the channel character)

![Hadi poses](brand/hadi-poses.png)

**Hadi** (هادي, "one who guides") is a calm young Muslim creator who has been through the YouTube grind and now guides others through it.

- **Faceless by design.** No eyes, nose or mouth. That matches the channel (faceless), sidesteps the discomfort some Muslims feel about drawn faces, and makes him instantly recognizable. Emotion comes from **pose, head tilt, props and a symbol bubble**.
- **Look:** a modern young creator. White crochet kufi with green stitch dots, deep-green hoodie with white drawstrings and a front pocket, headphones resting round his neck, dark trousers, white sneakers with a green sole line. Tall proportions (about 4 heads tall), thick dark outlines, flat colors.
- **Height on screen:** about 75% of the frame height in long form, about 35% in Shorts.
- **Poses** (in `brand/hadi/`, generated by `tools/make_hadi.py`):
  `neutral` · `point` · `think` (?) · `shock` (!) · `facepalm` · `thumbsup` · `phone` · `wave` · `idea` (💡)
- **Personality:** friendly older brother. Curious, honest about mistakes, never preachy, never mocking.
- **Placement:** usually left third of the frame, feet at the bottom 10%. Evidence appears on the right two-thirds.
- **Idle life:** never fully still. Gentle 2 px up-down "breathing" bob (2.5 s loop) and a pose change roughly every 4–8 s.
- **Signature moves:**
  - *The hand-off:* Hadi points → he whips out to the left → the subject whips in from the right (his "here, look at this").
  - *The phone check:* Hadi looks at his phone when we show YouTube Studio, analytics or comments.
  - *The bubble:* `?` when asking the viewer something, `!` for a twist, 💡 for the takeaway.
- **Hadi never appears** on the same screen as a Quran ayah or hadith card. He steps aside.

---

## 5. The visual language (v2, from the frame-by-frame study)

This section replaces my first attempt, which used drawn mock-ups (fake UI cards, pastel placeholders, a "design system" look). That's what made it feel AI-generated. Measured from the references, the method is simpler and more human:

**Every few words, the narration is illustrated by a real image from the internet, placed on plain white, moved with simple keyframes.**

### 5.1 How words become pictures

The references illustrate the *literal word* being said, often as a pun. A new picture arrives roughly **every 0.5–1 s** while the narrator talks (median gap between visual changes: 0.6 s in A, 0.5 s in B).

| Spoken word / idea | What they showed |
|---|---|
| "Many of you probably **know who this is**" | The channel character pointing |
| "a famous Roblox **YouTuber**" | A real photo of him |
| "his account had been **hacked**" | A stock "hacker in a hoodie with a laptop" photo |
| "big **fans** of certain YouTubers" | **A photo of an electric fan** (pun) |
| "that's **dangerous**" | ⚠️ warning sign, then the word in a pink bubbly font |
| "**YouTuber**, celebrity…" | The YouTube logo |
| "a harmless **joke**" | A 3D laughing emoji |
| "these **viral memes**" | The memes themselves |
| "**directly mocking Islam and Allah**" | Word stickers "DIRECTLY" (red), "mocking" (cyan), an "Islam" calligraphy logo, an "Allah" seal, scattered around the character |
| "**you might be thinking**" | A red wipe, then the "thinking" cartoon face |
| "what does this have to do with Islam?" | A famous movie still of a crowd staring, captioned "WELL…" |
| "if you **translated** the lyrics" | A **real screen recording** of typing "google translate" into Google |
| "But wait, there's **more**" | Reaction meme photos (thinking kid, shocked cat) |
| "**liking, reposting, sharing**" | Like, repost and share icons popping in one per word |
| "**spreading** mockery" | A flat "network of people" icon + the word "mockery!" in red |
| "like **bruh**" | Facepalm meme + caption "bruh" |
| "is **disbelief**" | The Arabic word كفر in black calligraphy |
| "Surah **At-Tawbah**" | "TAWBA" in big green letters |
| "**now that you know**" | "THAT YOU KNOW.." sticker, then a cat meme captioned "you know :)" |
| "**Assalamu alaikum**" | A cut-out meme of a man waving, with a white sticker border |

### 5.2 Types of images (the mix is what makes it feel real)

1. **Real photos:** stock photos, news photos, objects (the fan), people.
2. **Screenshots and screen recordings:** Google, YouTube, TikTok, Google Translate, typed live with the cursor.
3. **Memes and reaction images:** well-known reaction photos, cartoon faces, movie stills, captioned in meme style.
4. **3D emoji** (laughing, thinking, pointing).
5. **Flat icons** (like, share, repost, network, warning).
6. **Logos** (YouTube, Instagram, TikTok, Islamic calligraphy).
7. **Cut-outs:** PNGs with the background removed, sometimes with a white sticker border.
8. **Text-only beats:** when no image fits, a short line of text alone on white.

Rules for us:
- **Never a drawn mock-up when a real image exists.** Real UI = a real screenshot or screen recording. A "hacker" = a real stock photo.
- Look for the **pun or the most literal picture** of the word.
- Mixed styles are fine and intended (a photo, then an emoji, then a screenshot).
- **Hadi is the narrator character**, like the cartoon in B and the pictogram in A. He appears at the start, at reactions and at the end, not in every shot.
- Where an image comes from matters: prefer free-licence sources (Pexels, Unsplash, Wikimedia Commons, Microsoft Fluent 3D emoji, Google Noto emoji, Flaticon with credit). Memes and screenshots are used as commentary. Never use imagery that mocks Islam, and blur any offensive content.

### 5.3 How images are placed

- Plain **white** background (`#FFFFFF`), nothing else. (This replaces the paper colour in §2.)
- One image at a time, usually **centred**, about 35–65% of the frame width.
- Photos and screenshots: plain rectangle, optionally a thin dark border or a soft drop shadow. **No** heavy rounded "cards".
- Cut-outs and emoji float directly on white.
- Screenshots can fill the whole frame (screen-recording beats).
- Key words sit **next to** the image or character, not over it.

### 5.4 Keyframed motion (measured)

| Move | Measured in the references | Our spec (30 fps) |
|---|---|---|
| **Slide-in** | Image enters from the right edge and lands in ~8 frames at 30 fps. Big steps first, tiny steps at the end. **No overshoot, no bounce.** | Position keyframes: off-screen right → target over **0.25 s**, *ease-out (expo)*. |
| **Settle drift** | After landing, the image keeps drifting a few pixels for another ~0.3 s | Continue 1–2% further over 0.3 s, linear |
| **Slow zoom** | Everything that stays on screen keeps growing: ~2%/s (10% over 5 s on the phone shot, ~3%/s on the red ✕ shot) | Scale keyframes 100% → 104–110% over the shot's length, **linear** |
| **Cut-in** | Icons (like, share, repost) appear **instantly** on the word, one per word | Hard cut on the word's timestamp, no animation |
| **Quick pop** | Word stickers ("mockery!") scale up from small in ~0.1 s, no overshoot | Scale 30% → 100% in **3 frames**, ease-out |
| **Stamp** | Big red ✕ starts larger than the screen and shrinks onto the subject in ~0.3 s | Scale 400% → 100% in 0.3 s, ease-in, then slow zoom continues |
| **Punch-in** | Cut to a tighter crop of the same image (full-frame) for emphasis | Instant scale jump to 140–180% on a key word |
| **Red wipe** | A solid red shape sweeps across the screen between ideas | Red rectangle or circle wipe, 0.3–0.4 s, at section changes |
| **Fly-out** | An image exits sideways with motion blur | 0.15 s to off-screen left, motion blur |
| **Beat pump (outro only)** | The end screen pulses every 0.4 s, alternating small and big, the GIF tilting a new angle each time | Scale 92% ↔ 108% and rotation ±6° every 0.4 s |

What they *don't* do: springy bounces, wobble loops, glow, gradients, 3D camera moves, constant screen shake.

### 5.5 Text on screen

| Type | Look | When |
|---|---|---|
| **Keyword sticker** | Very bold rounded sans (e.g. *Poppins Black* / *Montserrat Black*), coloured fill (yellow, red, green, cyan), thick dark outline, soft drop shadow | 1–3 key words of the sentence |
| **Plain line** | Small, casual handwritten-style font (e.g. *Comic Neue*), black, centred | When no image fits a sentence |
| **Meme caption** | Bold white text with black outline, above the image | Reaction memes ("bruh") |
| **Quote / translation** | Bold white-outlined text in quotes, a yellow ↓ arrow to the meaning | Showing what something really says |
| **Ayah karaoke** | The whole ayah in bold outlined text; the phrase being read turns a colour (red / orange / green / yellow), reference ("9:65") underneath | Quran translations (with §9 rules) |
| **Arabic word** | Large black Arabic calligraphy | Islamic terms (كفر, توبة) |
| **Censor box** | Solid red rectangle | Offensive words: always |

### 5.6 The first 3 seconds and pacing

- Frame 1 = the narrator character or the subject, already on screen. No intro.
- Hook question by ~10 s.
- A new visual every **0.5–1 s** during narration. Hold an image longer (2–5 s) only for screenshots the viewer needs to read, or for clips with their own audio.
- Clips from other videos play in a centred frame with their own audio while the narration pauses.

### 5.7 Explain, don't just illustrate (our addition)

The references show a picture of each word. We go one step further: **when the voiceover explains something, the screen explains it too**, with a diagram that builds up as the words are spoken. Emoji and memes are seasoning, not the main course.

| When the voiceover… | Animate it as |
|---|---|
| describes a process or "what happens next" | **Branch / flow diagram**: nodes pop in, arrows draw on, paths split (expected vs reality) |
| describes a trick or a technique | **Breakdown with callouts**: the real example (a title, thumbnail, comment) with labelled arrows pointing at each part |
| compares two things | **Split-screen comparison**: left vs right, built one side at a time |
| talks about scale ("millions") | **Multiplier / grid**: one icon becomes a grid of hundreds, with a counter |
| gives a rule or checklist | **Gates / pipeline**: the item passes through each check, which ticks green |
| says something doesn't match | **Bars / meters**: promise vs delivery, with the gap highlighted |
| tells a story over time | **Timeline**: points appear along a line as the story moves |

Diagram style: white background, thick dark outlines (8 px), rounded nodes, Poppins Black labels, colour by meaning (red = wrong, green = right, gold = key number, grey = "what you expected"). Every part draws on in sync with its word (line draw 0.25 s, node pop 0.1 s), and the whole diagram keeps the slow zoom. Quran and hadith stay on clean cards with no diagrams (§9).

### 5.8 v3 upgrade: real images + teaching clarity (from our GTA edit and the 400k "Is Art Haram?" video)

Full analysis: `analysis/03-reference-videos-gta-and-art.md`. In short:
- **Real images of the actual thing** (posts, posters, screenshots, products, places, blurred where needed). Illustrations and diagrams only for abstract ideas.
- **Calligraphy seals** for the Prophet ﷺ, Sahaba and scholars when quoting them. **Book cover + reference + grade** on every hadith card.
- **Word-by-word key sentences** (next word fading in from grey, key words in red or green) for the 3–5 most important lines.
- **Arrows that draw on to 1–3 short labels** to show *why*.
- **Hadi acts every turn of the argument** (explain/whiteboard, confused ?, raised finger "but…", shock, thumbs up).
- **Two speeds:** ~1 s per visual in hooks and lists, ~2 s with more stillness for explanation and evidence.
- **Red lower-third chapter title** at each section start.
- **Script shape:** scenario or "many of you have seen" hook, then shock, then "before you panic", then roadmap, then points, then a practical checklist, then a short close.

## 9. Quran and hadith (the respect rules)

These override every other rule.

1. **Dedicated card, full screen, paper background.** Hadi leaves the frame.
2. **Layout:** Arabic in Amiri at the top → English translation below → a source line at the bottom:
   - Quran: `Surah At-Tawbah 9:65`
   - Hadith: `Sahih al-Bukhari 6477 · Grade: Sahih` (**grading is mandatory**, never quote a weak hadith as if it's authentic)
3. **Motion:** fade in over 12 frames, very slow push-in (100% → 103%). **No** whip, pop, stamp, shake, wobble, emoji or stickers.
4. **Highlight in sync:** while the translation is read, the current phrase turns `deen` green (karaoke-style, timed from faster-whisper word timestamps). Arabic stays still.
5. **Sound:** no sound effects on the card at all. Silence + narration only.
6. **Recitation audio:** only from a real reciter, with permission or a license that allows it. **No AI-generated recitation of the Quran on this channel.**
7. Hold the card at least 1 s after the narration finishes.

---

## 10. Sound effects

Voice and sound effects only. Sound effects sit 18–22 dB below the voice and are short (under 0.5 s), so they punctuate and don't distract.

| Sound | Paired with |
|---|---|
| Soft airy **whoosh** | Whip-in / whip-out / hand-off |
| Light **pop** (bubble or cork-like) | Sticker or icon pop |
| Deep **thud** | Stamp (✕, ✓, verdict) |
| **Mouse click** | Cursor clicks in UI screenshots |
| **Keyboard typing** | Typing into a search bar or translator |
| Pencil **scribble** | Arrow drawing, hand-drawn ✕ |
| Single soft **ding** | 💡 idea bubble, the key takeaway |
| Record **scratch** | "Wait…" twist moment (max once per video) |

Rules: one sound per visual event. Never stack two on the same frame. No sounds on Quran/hadith cards or during the dua.

---

## 11. Voice and tone

- Calm, warm, conversational, 130–150 words/min. Short sentences.
- Pattern for every video: **Hook → context (what happened) → the twist or problem → evidence → what Islam says → what you should do → dua → CTA.**
- Humor lives in the setup sections (memes, Hadi's facepalm). It stops completely at the religious evidence.
- Humble framing: "Scholars say…", "Allah knows best." Never issue our own fatwa.
- Correct terms: "the Prophet ﷺ" (show ﷺ on screen), "Allah" (never "God" as a substitute in quotes from Islamic sources).

---

## 12. Ending

1. **Takeaway line** as a sentence-line reveal (green key word).
2. **Short dua** (sentence lines, no sound effects) → "Ameen."
3. **CTA:** Hadi `wave` pose on the left. On the right, a subscribe button pops in, a `sky` cursor clicks it (click + pop), then a goal line: `Goal: 1,000 subscribers` with a counter.
4. End screen: 10–15 s, with two video slots that whip in from the right.

---

## 13. Shorts adaptation (1080×1920)

- Hadi at the bottom-left, smaller (35% of height). Evidence card in the top 60%.
- Stickers bigger (Lilita One at 110 px+), centered above the card.
- Hand-off happens at 0.5 s instead of 1.0 s.
- One idea per Short. End on the key line, not a long CTA. The last frame should loop cleanly into the first.

---

## 14. Production checklist

- [ ] Hook visual on frame 1, topic clear by 3 s
- [ ] Something new every 1.5–3 s, nothing static over 4 s
- [ ] Colors used with their fixed meaning
- [ ] Max 3 stickers on screen
- [ ] Every Quran/hadith quote has a reference (and hadith grading), on a clean card, no sound effects
- [ ] Offensive words censored with red bars
- [ ] Every clip trimmed, labeled with its source
- [ ] One sound per visual event, voice always on top
- [ ] Dua + CTA at the end
