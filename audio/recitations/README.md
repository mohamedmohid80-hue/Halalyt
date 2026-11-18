# Recitations (episode 1)

Source: verse-by-verse audio by Mishary Rashid Alafasy from the alquran.cloud audio CDN
(`https://cdn.islamic.network/quran/audio/128/ar.alafasy/<ayah number>.mp3`).

| File | Ayah |
|---|---|
| a1300.mp3 | At-Tawbah 9:65 |
| a1301.mp3 | At-Tawbah 9:66 |
| a4624.mp3 | Al-Hujurat 49:12 |

The trimmed clips used in the video (`public/audio/r1-tawbah.wav`, `public/audio/r2-hujurat.wav`) are rebuilt with:

```bash
ffmpeg -y -i a1300.mp3 -i a1301.mp3 -filter_complex "[1:a]atrim=0:6.9,afade=t=out:st=6.5:d=0.4[b];[0:a]afade=t=in:d=0.05[a];[a][b]concat=n=2:v=0:a=1,aresample=44100" ../../public/audio/r1-tawbah.wav
ffmpeg -y -i a4624.mp3 -af "atrim=14.6:32.45,asetpts=PTS-STARTPTS,afade=t=in:d=0.15,afade=t=out:st=17.45:d=0.4,aresample=44100" ../../public/audio/r2-hujurat.wav
```

R1 = all of 9:65 + 9:66 up to "بَعْدَ إِيمَٰنِكُمْ". R2 = 49:12 from "وَلَا تَجَسَّسُوا۟" to "فَكَرِهْتُمُوهُ".
