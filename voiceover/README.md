# Kavox Showreel: Voiceover (ElevenLabs)

Script: [`kavox_voiceover_elevenlabs.txt`](kavox_voiceover_elevenlabs.txt). Paste it unchanged: the
tags in square brackets are audio tags for Eleven v3.

## Recommended settings

| Setting | Value |
|---|---|
| Model | **Eleven v3** |
| Language | German |
| Voice | German male narrator ("Erzähler / Narrator"), warm and deep, around 35–45 years old |
| Stability | **Natural** |
| Target length | about 70–75 s in total |
| Export | MP3, 44.1 kHz |
| Save as | `public/voiceover.mp3` |

If v3 struggles with the full text in one go, generate it in 2–3 blocks and join
them in an audio editor (keep the pauses between blocks natural, about 0.4 s):

1. *Kennst du das?* … *Kein Rätselraten mehr.*
2. *Die Summe steht* … *und was diese Woche reinkommt.*
3. *Steuerkreuz?* … *Angebote, die sich selbst schreiben.*

## Syncing the film to the voice

The film does not need the audio to render. Without `public/voiceover.mp3` it
renders silent, and every timing marker stays where it is.

When the MP3 is in place:

1. `npm run dev` and open **KavoxShowreel-16x9** in the Studio.
2. Open `src/showreel/timeline.ts`. `VO_CUES` lists where each line is
   expected to start. `SHOTS` holds the cut times in seconds.
3. Scrub to the start of each voice line and set the matching shot's `at`
   to that time. A shot ends where the next one begins, so changing one value
   moves exactly one cut.
4. Fine-tune in-shot beats in `BEATS` (seconds from the shot's start), for
   example `sagen.fertig` for the moment "Fertig." lands.
5. If the voice runs past 75 s, raise `END`.

`public/music.mp3` is optional. If it exists, it plays under the voice and
ducks automatically while a line from `VO_CUES` is running.
