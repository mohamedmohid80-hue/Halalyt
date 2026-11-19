# Halal YT: Script Structure and Voice

## 1. How the reference videos are scripted

### Reference A: commentary on a YouTuber controversy (3:14)

| Time | Beat | Line (paraphrased) |
|---|---|---|
| 0:00 | **"You know this"** opener | "Many of you probably know who this is…" |
| 0:05 | Inciting event | "…and recently, this clip of him went viral." |
| 0:07–0:27 | **Show, don't tell** | The clip plays with its own audio, no narration |
| 0:28 | Plain recap | What happened, in neutral words |
| 0:52–1:20 | Other side | His response clip plays |
| 1:20 | Fair take | "I can understand why people questioned his explanation." |
| 1:36 | Humble disclaimer | "I'm not here to defend him… Allah knows what's in his heart." |
| 1:45 (~55%) | **The pivot** | "But regardless… there's a bigger issue we need to talk about." |
| 1:47 | The real lesson | Fandom shouldn't come before your deen |
| 2:12 | **Evidence card** | Hadith with source and grading |
| 2:20 | Turn to the viewer | "We should be careful about what we laugh at…" |
| 2:28 | Dua | "May Allah guide us… Ameen." |
| 2:35 | CTA | Subscriber goal, socials |

### Reference B: meme breakdown (1:47)

| Time | Beat | Line (paraphrased) |
|---|---|---|
| 0:00 | **"You've seen this"** opener | "A lot of you have probably seen these viral memes." |
| 0:03–0:10 | Show it | The memes play |
| 0:11 | **Hook question + promise** | "What if I told you they're directly mocking Islam? Let me explain." |
| 0:16 | **Voice the objection** | "You might be thinking, what does this have to do with Islam?" |
| 0:19 | Evidence #1, revealed step by step | Translate the lyrics → the shocking meaning |
| 0:39 | **Escalate** | "But wait, there's more." → Evidence #2 |
| 0:51 | Widen the scale | "This wasn't a one-time thing… millions of views." |
| 1:01 | **Stakes for the viewer** | "Many Muslims are sharing these without realizing…" |
| 1:13 | Ruling + Quran card | 9:65 with reference |
| 1:31 | **Mercy and relief** | "Allah doesn't hold us accountable for what we didn't know. But now that you know…" |
| 1:39 | Salam out | |

### What both do (and what we copy as a method, not as words)

1. **The first line assumes the viewer already knows the topic** ("you've probably seen…"). No intro, no "welcome back".
2. **A hook question by ~10 s**, then a promise: "Let me explain."
3. **Show first, then explain.** Every claim is followed by proof on screen.
4. **Each point is a mini-cycle: signpost → example → meaning.** Each new point arrives every 10–20 s in B and every 20–30 s in A.
5. **Escalation phrases** move things along: "But wait, there's more", "Now…", "But regardless…".
6. **Voice the viewer's objection** before answering it.
7. **The pivot to the lesson happens at 55–70%** of the video, not at the start.
8. **One strong evidence card** (Quran or hadith, with reference) near 70–85%.
9. **End soft:** mercy, hope, a dua, never fear alone.
10. **Short, spoken sentences.** "Guys", "now", "let me explain". Humble ("Allah knows best"), never preachy.

## 2. Our script formula (7–13 min list video)

| % of runtime | Beat |
|---|---|
| 0–3% | **"You've done this" opener** + hook question by 10 s ("What if your video is haram and you don't even know it?") + "Let me explain." |
| 3–8% | **Why it matters**: stakes in one sentence, and voice the objection ("It's just YouTube, right?") |
| 8–80% | **The points.** Each 45–90 s: **signpost** ("Number three.") → **relatable example** on screen → **why** (evidence card if needed) → **the halal fix**. Use "But wait, there's more" style escalation before the biggest point. |
| ~70% | **The pivot**: from "rules" to the heart of it (intention, accountability) |
| 80–90% | **Mercy and relief**: "Allah doesn't hold us accountable for what we didn't know… but now you know." |
| 90–95% | **Dua** → "Ameen." |
| 95–100% | **CTA**: subscribe + goal |

Writing rules: max ~18 words per sentence, about 160–170 words per minute of video (a 10-minute video is about 1,600 words). Write numbers as words when they should be spoken ("number three", "two thousand").

## 3. The voice

### What the references sound like (measured)

Both narrators sound like the same type of voice (B credits A as its inspiration).

| Measurement | A | B | What it means |
|---|---|---|---|
| Pitch (median) | 119 Hz | 125 Hz | Young adult male, light baritone: low-mid, **not deep or booming** |
| Pitch movement (std) | 4.7 semitones | 4.9 semitones | **Very lively intonation.** A flat narrator moves ~2 st. These voices rise and fall a lot. |
| Pitch range (5–95%) | 14 st | 15 st | Big rises on questions, clear drops at sentence ends |
| "R" sounds (F3 in words like *her, heart, never*) | ~2,350 Hz low point | ~2,760 Hz low point | **No R-colouring → non-rhotic accent, most likely British.** (American voices drop to ~1,700 Hz.) This is an estimate from acoustics, not a certainty. |
| Brightness (spectral centroid) | 1,240 Hz | 1,440 Hz | Clear and present, neither bassy nor airy |
| Voicing clarity | 0.72 | 0.60 (music under it) | Clean, not breathy or whispery |
| Pace while talking | ~165–175 wpm | ~160 wpm | Brisk conversational |
| Pauses | short (~0.4–0.6 s) | short | Pauses at commas and before reveals, never long dramatic gaps |

**In plain words:** a young British guy in his twenties, light-baritone, talking to you like he's explaining something on a call: animated, rising on questions, stressing key words, sincere. Not a deep "movie trailer" voice, not a soft meditation voice, not hype.

**Why my earlier prompts missed:**
- v1 said *calm, warm, smooth, relaxed* → it flattened the intonation (the refs are very lively).
- v2 said *solid full chest voice, firm, confident* → it made the voice deeper and harder (the refs are light baritone and friendly).
- Both said *neutral international accent* → the refs are most likely British.

### ElevenLabs Voice Design prompt (v3: matched to the references)

Paste into **Voices → Create a voice → Voice Design → Prompt**:

> Young British man in his early twenties, natural Southern English accent, narrating a YouTube commentary video. Light baritone voice, mid-low pitch but not deep, clear and present, not breathy. Conversational and casual, like explaining something to a friend on a call. Very lively, natural intonation: rises on questions, drops firmly at the end of statements, gently stresses key words. Sincere and engaged with a little emotion, not hyped, not dramatic, not sleepy. Brisk natural pace with short pauses at commas. Clean close-mic recording, dry, no reverb, no background noise.

**Preview text** (written in the same rhythm as the references):

> A lot of you have probably seen this video by now. But what if I told you that it's actually mocking Islam? Now, I know what you're thinking. It's just a joke, right? Well, not exactly. Let me explain.

Generate 3 previews, pick the closest one and save it as **"Hadi"**. If it still sounds off, change only one thing at a time:
- Too deep → change *light baritone, mid-low pitch* to *mid pitch*.
- Too flat → add *animated* before *conversational*.
- Too posh → change *Southern English* to *London*.
- Wrong accent entirely → regenerate. Voice Design varies a lot between previews.

**Don't clone the reference narrators' voices** (Instant Voice Clone from their videos). Their voice belongs to them. Designing a similar *type* of voice is fine.

### Recommended generation settings

| Setting | Value | Why |
|---|---|---|
| Model | **Eleven v3** (or Multilingual v2 if v3 sounds unstable) | Best expressiveness and handles Arabic terms |
| Stability | 40–50% (v3: "Natural") | Keeps the lively intonation without drifting |
| Similarity | 75–80% | Stays on the designed voice |
| Style exaggeration | 10–20% | A little emotion, no theatre |
| Speaker boost | On | Clarity |
| Speed | 1.0–1.05 | Lands around 160–170 words/min |

### Script formatting tips for ElevenLabs

- Break every point into its own paragraph. Generate **one section at a time** (hook, each point, ending) so you can redo just one part.
- Use `...` or a line break for a short pause before a reveal.
- **No emotion tags** (like `[serious]`) in scripts. The voice carries the delivery on its own; punctuation and short sentences shape it.
- Write the words you want stressed in CAPS sparingly ("this is WAY more common"). v3 stresses them.
- Write ﷺ out in full as **"sallallahu alayhi wa sallam"** (the voice can't read the symbol).
- Spell Islamic terms the way they should sound if it mispronounces them: *Insha'Allah, Assalamu alaikum, Subhan'Allah, ayah, hadith (ha-deeth), deen*. Add a pronunciation dictionary for repeat offenders.
- **Never have the AI voice recite the Quran in Arabic.** Read the English translation only, and use a real reciter's recording (with permission) for any Arabic recitation. That's our channel rule (see `style.md` §9).
- Export as **WAV 44.1 kHz**. faster-whisper then generates word timestamps for captions and animation sync.

---

## 4. Voice Design prompt v4: "serious reminder" narrator (similar type, not a copy)

Same family as the references (young British male, light baritone, lively but grounded), shifted so it's its own voice: a few years older, slightly warmer and lower, with more weight for serious topics.

> Young British man in his mid-to-late twenties with a natural, neutral London accent, narrating a serious Islamic reminder video on YouTube. Warm light-baritone voice, a little lower and calmer than a typical commentary YouTuber, clear and present, not breathy and not booming. Speaks like an older brother warning a friend about something that genuinely matters: sincere, grounded and slightly grave, with controlled emotion. Natural intonation that rises on questions and drops firmly on key statements, with real emphasis on important words. Never hyped, never cheerful, never dramatic or theatrical. Measured, steady pace with short deliberate pauses before reveals. Clean close-mic recording, dry, no reverb, no background noise.

**Preview text:**

> Many of you probably know that GTA 6 just got released. The game is honestly disgusting, but people are going crazy over it. Many Muslims think it's just a normal game... until they open it and see the truth.

**Settings:** Eleven v3 · Stability 45–55% · Similarity 75–80% · Style 5–15% · Speaker boost on · Speed 0.95–1.0

### v5: calm educational (no emotional rollercoaster)

v4 gave too much drama on words like "disgusting" and "crazy". This version asks for even, matter-of-fact delivery and pairs it with higher stability.

> Young British man in his mid-to-late twenties with a natural, neutral London accent, calmly explaining an Islamic topic on an educational YouTube channel. Warm light-baritone voice, clear and present. Calm, steady and matter-of-fact, like a knowledgeable teacher explaining something important to a student. Even, consistent energy from start to finish. Natural conversational intonation with gentle, subtle variation only. Does not dramatize or over-emphasize individual words, no exaggerated expressions, no suspense voice, no excitement, no sadness, never theatrical. Sincere and serious through calmness, not through emotion. Moderate, unhurried pace. Clean close-mic recording, dry, no reverb, no background noise.

**Settings:** **Eleven Multilingual v2** (steadier than v3) · Stability 65–75% · Similarity 75–80% · **Style 0%** · Speaker boost on · Speed 1.0
If staying on v3: choose "Robust" (most stable) instead of "Natural" or "Creative".

**Script tips:** ellipses (…), question-heavy phrasing and strong adjectives pull the voice into drama. Use full stops instead of "…", and keep loaded words plain.

### v6: no London accent

**A: neutral American**
> Young man in his mid-twenties with a neutral, general American accent, calmly explaining an Islamic topic on an educational YouTube channel. Warm, smooth mid-low voice, clear and present. Calm, steady and matter-of-fact, like a friend who knows the topic well explaining it plainly. Even energy from start to finish, natural conversational intonation with only subtle variation. Does not dramatize or over-emphasize words, no suspense voice, no excitement, never theatrical. Moderate, unhurried pace. Clean close-mic recording, dry, no reverb, no background noise.

**B: neutral international (no strong regional accent)**
> Young man in his mid-twenties speaking clear, neutral international English with no strong regional accent, calmly explaining an Islamic topic on an educational YouTube channel. Warm, smooth mid-low voice, clear and present. Calm, steady and matter-of-fact, like a friend who knows the topic well explaining it plainly. Even energy from start to finish, natural conversational intonation with only subtle variation. Does not dramatize or over-emphasize words, no suspense voice, no excitement, never theatrical. Moderate, unhurried pace. Clean close-mic recording, dry, no reverb, no background noise.

Settings as v5: Multilingual v2 · Stability 65–75% · Style 0% · Similarity 75–80% · Speaker boost on · Speed 1.0

### v7: not an announcer (everyday YouTuber talking normally)

> An ordinary young guy in his early-to-mid twenties talking to the camera on his own small YouTube channel, explaining something about Islam to his viewers. Natural, everyday speaking voice, mid pitch, not deep, not smooth, not polished. Sounds like a real person, not a voice actor, not a narrator, not a radio or TV announcer. Casual and relaxed but sincere, like talking to a friend on a voice call. Plain, conversational delivery with normal small pauses, no projection, no dramatic emphasis, no performance. Calm and genuine. Recorded on a decent USB microphone in a quiet room, dry and clear.

Settings: Multilingual v2 · Stability 50–60% · Similarity 75% · Style 0% · Speaker boost off · Speed 1.0–1.05
(Speaker boost off and slightly lower stability make it sound less "produced".)

---

## 5. Deep analysis of the reference narrators (Praat) and the matching prompt (v8)

Measured on narration-only audio (Reference A is clean; B has music underneath, so its texture numbers are less reliable).

| Measure | A | B | What it means |
|---|---|---|---|
| Median pitch | 118 Hz | 118 Hz | Mid-low male, **not deep** |
| Pitch range (10–90%) | 104–169 Hz | 81–169 Hz | Moderate range |
| Pitch movement | 3.6 semitones | 4.7 semitones | Lively but controlled, not sing-song |
| **Pitch change at the end of statements** | **+0.0 st (level)** | −4.8 st | **A keeps sentence endings level**: no big announcer "drop" |
| Voice texture (HNR) | 16 dB | (music) | Slightly textured, a little rough. Not a smooth, polished voice |
| Jitter / shimmer | 2.3% / 7.8% | (music) | Natural, slightly raspy, light vocal fry |
| Vocal-tract size (from formants) | ~16 cm | ~17 cm | **Average-sized** male voice, not a big chesty voice |
| Loudness range | 12 dB | 7 dB | Fairly even volume, no shouting or whispering |
| Speed while talking | ~7 syllables/s | ~6 syllables/s | **Quick** within phrases |
| Pauses | 20/min, ~0.6 s | 10/min, ~0.4 s | **Short phrases separated by frequent short pauses** |
| Breaths | Audible in most pauses | n/a | Sounds like a real person recording, not studio-cleaned |

**Why it doesn't sound like an announcer:** an announcer has a deep, smooth, resonant voice, big pitch drops at the end of every sentence and long dramatic pauses. These narrators are the opposite: an average-sized, slightly rough voice, level sentence endings, quick short phrases and natural breaths.

### v8 prompt (matched to the measurements)

> A young man in his twenties with an average, everyday male voice, mid-low pitch, not deep. His voice has a slightly rough, natural texture with a hint of vocal fry, not smooth or polished. He talks in quick, short phrases with brief natural pauses and audible breaths between them, keeping the end of his sentences fairly level instead of dropping dramatically. Calm, sincere and matter-of-fact, explaining an Islamic topic to his viewers like a normal person talking, not a narrator, voice actor or announcer. Even volume, moderate pitch movement, no dramatic emphasis. Recorded at home on a decent microphone, dry, with no reverb.

Settings: Multilingual v2 · Stability 50–55% · Similarity 75% · Style 0% · Speaker boost off · Speed 1.05
Script tip: short sentences and frequent full stops recreate the "short phrases + pauses" rhythm.

### v9: final (natural flow)

v8's "quick, short phrases with pauses" made the voice break at commas and leave long AI-sounding gaps. This version describes smooth, connected speech instead.

> A young British man in his twenties with a light, natural British accent and an average, mid-low male voice with a slightly textured, real-sounding tone. He speaks in a natural, flowing, conversational way, connecting his words smoothly and moving through commas without stopping, only pausing briefly at the end of sentences. Calm, sincere and confident, like a thoughtful young Muslim explaining something important to his viewers. Natural, moderate intonation with gentle emphasis, steady energy and no drama. Clear, dry, close recording with no reverb or background noise.

Settings: Multilingual v2 · Stability 55% · Similarity 75% · Style 0% · Speaker boost on · Speed 1.05 · Voice Design guidance scale ~40%
