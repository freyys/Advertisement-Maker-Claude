# Kavox — KI-Angebot Teaser (Remotion)

A 13-second teaser (390 frames @ 30 fps) for the upcoming **KI-Angebot** feature,
built per [`docs/KAVOX_SHOWREEL_MASTER_PROMPT.md`](docs/KAVOX_SHOWREEL_MASTER_PROMPT.md).

**No screenshots are used.** The Kavox app UI is rebuilt in code: the
*Assistent* chat, the *Entwurf zum Prüfen* card, the *Aufmaß* position cards and
the *Summe vor Ort* card, with colors sampled from the real app (sky-blue accent
`#79C2E3`, charcoal surfaces) and Plus Jakarta Sans. The only image asset is
the Kavox wordmark SVG, which is drawn as vector paths (the K mark strokes on).

## Compositions

| ID | Size | Use |
|---|---|---|
| `KavoxTeaser-Screen` | 1920×1080 | Play full-screen on the MacBook and film it with a phone |
| `KavoxTeaser-Vertical` | 1080×1920 | Upload directly to TikTok, Reels or Shorts. Same scenes on a tilted 16:10 screen panel; the end card goes full-frame. Key content stays out of the top 220 px and bottom 380 px. |

Props: `withSfx` (default `true`), `withMusic` (default `false`).
`withMusic` plays `public/sound.mp3`. That file is for previewing sync only. It is
git-ignored and must never be baked into a delivery render.

## Story (real Kavox example: Familie Becker)

| Scene | Frames | What happens |
|---|---|---|
| S1 Ignition | 0–30 | Light point pulses twice, then ⚡15 violet bloom |
| S2 App icon | 30–75 | Bloom collapses into the glass app icon; K mark draws on; ring |
| S3 Agent | 75–165 | Icon becomes the window icon. *Assistent* screen: dictation → ⚡120 send → agent steps → draft card fills (4 positions, Netto 1.291,62 €) |
| S4 Positions | 165–210 | ⚡168 whip-zoom onto the Aufmaß positions; wall-area calculation; violet sweep per row |
| S5 Quote | 210–255 | A4 Angebot slides up; totals count to 1.537,03 €; ⚡231 "Angebot bereit · 28 Sek." |
| S6 Light arcs | 255–285 | Two lavender strokes converge into the empty command bar |
| S7 Command bar | 285–345 | Typing, dropdown, cursor → "Per E-Mail senden", ⚡327 click + sparkles |
| S8 Logo | 345–390 | Bar stretches → ⚡348 bloom → wallpaper + wordmark, "KI-Angebot · Bald verfügbar."; last 20 frames hold still |

The numbers add up: (5+4)×2×2,60 − 2×1,25×1,2 − 1×2 = 41,8 m², priced at
8,90 / 10,20 / 3,80 / 8,00 €/m² → 1.291,62 € netto, 245,41 € MwSt, 1.537,03 € brutto.

## Second cut: `KavoxStory` (slower, step by step)

This is a separate ~31 s video (930 frames) and does not replace the teaser above.
It is built for reading: each step gets a numbered caption that holds for 4–6 s,
and the UI shows the real phone flow from start to finish. There are no blur
whips. Every transition is a container-transform morph, so one element turns
into the next:

| Step | Frames | Morph |
|---|---|---|
| Intro "Das Angebot – einfach gesagt." | 0–96 | App icon grows into the phone |
| 01 — SAGEN | 96–282 | Dictation in the input → the input becomes the chat bubble → agent steps |
| 02 — RECHNEN | 282–432 | Status block becomes the reply bubble; draft card grows out (4 positions, 1.291,62 €) |
| 03 — ÄNDERN | 432–570 | „Die Decke auch streichen.“ flies out of the input and turns into the new row (+20,0 m², 1.451,62 €) |
| 04 — PRÜFEN | 570–738 | "Prüfen & als Aufmaß übernehmen" expands into the Aufmaß screen, which scrolls through |
| 05 — ÜBERGEBEN | 738–852 | "An den Rechner übergeben" shrinks to a document, flies out and unfolds into the A4 Angebot (1.727,43 € brutto) |
| End | 852–930 | Angebot folds into the app icon; the K leaves it and A·V·O·X slide out from behind it |

The vertical version (`KavoxStory-Vertical`) uses its own native 9:16 layout, not a
panel. The caption sits at the top and the phone below it, both inside the safe zone.
Body text is ≥ 28 px.

Files: `src/story/` (`timeline.ts`, `copy.ts`, `layout.ts`, `Story.tsx`, views).

```bash
npx remotion render KavoxStory-Screen   out/kavox-story-screen-sfx.mp4
npx remotion render KavoxStory-Screen   out/kavox-story-screen-silent.mp4   --muted
npx remotion render KavoxStory-Vertical out/kavox-story-vertical-sfx.mp4
npx remotion render KavoxStory-Vertical out/kavox-story-vertical-silent.mp4 --muted
# or all four:
npm run render:story
```

## Where to change things

- `src/timeline.ts`: every scene slot, ⚡ hit and scene-internal beat (retime here)
- `src/copy.ts`: every on-screen string and number (customer, positions, prices)
- `src/theme.ts`: brand palette and app UI tokens
- `src/scenes/S1Ignition.tsx` … `S8Logo.tsx`: one component per scene
- `src/components/app/KavoxUI.tsx`: the rebuilt Kavox UI components
- `scripts/make-sfx.mjs`: the SFX synthesiser (writes `public/sfx/*.wav`)

## Commands

```bash
npm install
npm run dev                      # Remotion Studio
npm run sfx                      # regenerate SFX (deterministic)

# final renders (H.264, CRF 16, yuv420p BT.709)
npx remotion render KavoxTeaser-Screen   out/kavox-teaser-screen-sfx.mp4
npx remotion render KavoxTeaser-Screen   out/kavox-teaser-screen-silent.mp4   --muted
npx remotion render KavoxTeaser-Vertical out/kavox-teaser-vertical-sfx.mp4
npx remotion render KavoxTeaser-Vertical out/kavox-teaser-vertical-silent.mp4 --muted
# or all four:
npm run render:all

# preview stills from one bundle (SCALE=1 for full size)
node scripts/stills.mjs KavoxTeaser-Screen 120 231 389
```

Render settings live in `remotion.config.ts`. If a headless Chromium exists at the
Playwright path (or `REMOTION_BROWSER` is set), it is used. Otherwise Remotion
downloads its own.

## Audio

All SFX are synthesised in code, so they are royalty-free. There is a whoosh on
every ⚡ frame, quiet ticks for dictation and typing, a click + shimmer at f327,
and a riser into the impact at f348. Peaks are baked at about −32 to −11 dBFS, so the
bus sits around −18 dB and the platform sound can play on top. Add the trending
sound inside TikTok or Instagram ("Use this sound").

## Third cut: `KavoxReel` (9:16 feature showreel for Instagram + TikTok)

A 60-second native vertical showreel (1080×1920, 1800 frames @ 30 fps) of the whole
product, split into 13 phases. **No screenshots are used.** The UI from both screenshot
sets (desktop at 2880×1800, phone at 780×1688) is rebuilt in code: sidebar, Cockpit,
Cashflow-Radar, Befehlspalette, Dokumente, Angebot with live PDF preview, the A4 PDF itself,
Auswertung, and on the phone the KI-Assistent, Aufmaß with Rechenweg, Summe vor Ort and
Baustellen-Modus. All colours are sampled from the screenshots (desktop accent `#5CC4E4`,
phone accent `#79C2E3`). The desktop app renders at its logical 1440×900 size through CSS
`zoom: 2` with a 3D camera, so text stays sharp when the camera pushes in.

| # | Composition | Frames (global) | Feature |
|---|---|---|---|
| 01 | `KavoxReel-P01-Intro` | 0–120 | K draws on · „Weniger Büro. Mehr Baustelle.“ |
| 02 | `KavoxReel-P02-Cockpit` | 120–300 | KPI cards count up, Als nächstes / Schnellstart |
| 03 | `KavoxReel-P03-Cashflow` | 300–420 | Cashflow-Radar draws to 7.648,61 €, overdue hint |
| 04 | `KavoxReel-P04-KI-Assistent` | 420–600 | dictation → reply → Entwurf, Netto 1.463,62 € |
| 05 | `KavoxReel-P05-Aufmass` | 600–720 | position cards + Rechenweg callout = 41,8 m² |
| 06 | `KavoxReel-P06-Vor-Ort` | 720–840 | Summe vor Ort 1.741,71 €, customer signs |
| 07 | `KavoxReel-P07-Angebot-Live-PDF` | 840–1020 | typing, stepper, live preview, „Angebot generieren“ |
| 08 | `KavoxReel-P08-PDF` | 1020–1140 | finished A4 Angebot, Zwischensumme 1.543,20 € |
| 09 | `KavoxReel-P09-Strg-K` | 1140–1260 | Strg + K, „Rech“, results |
| 10 | `KavoxReel-P10-Dokumente` | 1260–1380 | status flips to Bezahlt, Excel export |
| 11 | `KavoxReel-P11-Auswertung` | 1380–1500 | KPIs + 12-month revenue bars |
| 12 | `KavoxReel-P12-Baustellen-Modus` | 1500–1620 | circular reveal to high contrast, sun glare |
| 13 | `KavoxReel-P13-Outro` | 1620–1800 | Offline trust beat → wordmark, CTA „Link in Bio“ |

`KavoxReel-Full` plays all 13 back to back. Each phase enters and leaves with a vertical
whip (stretch + blur + light bloom), so the cuts read as one continuous swipe. Captions sit
in the top safe zone (below 220 px), and key UI stays above the bottom 380 px.

**Music:** `scripts/make-music.mjs` synthesises a royalty-free 120 BPM bed
(`public/reel/music.wav`). One bar is 60 frames, so every phase cut lands on a downbeat.
The drums drop at the first cut, the arrangement lifts at 20 s and 36 s, and the impact
lands on the logo at frame 1710. SFX reuse `public/sfx`. Props: `withMusic`, `withSfx`
(both default `true`).

Files: `src/reel/` (`timeline.ts`, `copy.ts`, `tokens.ts`, `kit/`, `pages/`, `phases/`, `Reel.tsx`).

```bash
npm run music                    # regenerate the music bed (deterministic)
npm run render:reel              # out/reel/kavox-reel-full.mp4 (music + SFX)
npm run render:reel:sfx-only     # out/reel/kavox-reel-full-sfx-only.mp4 (add a trending sound in-app)
npm run render:reel:phases       # cuts the master into out/reel/phases/kavox-reel-P01-Intro.mp4 …
npm run render:reel:all          # all of the above
# or render a single phase directly:
npx remotion render KavoxReel-P04-KI-Assistent out/reel/p04.mp4
```

The PDF uses Arial, falling back to Liberation Sans on Linux.
