# KAVOX — AI Feature Teaser · Master Prompt for Claude Code

> Paste everything below the line into Claude Code, opened in an empty folder that contains an `assets/` folder with your logo files.
> Required assets (rename yours to match):
> - `assets/kavox-mark-white.png` (the K mark, white, transparent background)
> - `assets/kavox-wordmark-white.png` (K mark + "AVOX", white, transparent background)
> - `assets/kavox-mark-black.png`, `assets/kavox-wordmark-black.png` (optional, for light variants)
> - Optional: an SVG of the K mark (`assets/kavox-mark.svg`). If you have one, Claude Code can draw it on stroke by stroke. With a PNG it can only fade/mask it in.

---

## ROLE
You are a senior motion designer and Remotion engineer. Build a 13-second product-teaser video for **Kavox**, an offline quoting and invoicing software (Angebote & Rechnungen) for German tradespeople (Handwerker) and SMEs. The video announces a new **AI feature, coming soon: "KI-Angebot"**. You type a few keywords, and Kavox builds a complete, priced quote from the user's own service catalog.

Work in phases. After each phase, render a preview still or short clip and stop for my OK before moving on.

## TECH STACK
- **Remotion** (latest, TypeScript, React). Init with `npx create-video@latest` (blank template).
- 30 fps. All motion is code-driven with `spring()` / `interpolate()` and custom easings. No stock footage.
- Font: **Plus Jakarta Sans** (via `@remotion/google-fonts`), `font-variant-numeric: tabular-nums` for every price.
- Two compositions from the same scenes:
  1. `KavoxTeaser-Screen`: **1920×1080**. Meant to play full-screen on a MacBook and be filmed with a phone (see "Filming" at the end).
  2. `KavoxTeaser-Vertical`: **1080×1920**. Native vertical for TikTok/Reels/Shorts. Same scenes placed in a centered 16:10 "screen" panel with a slight 3D tilt (rotateX 8°, perspective 1600px), soft screen glare, and the purple ambient gradient (see palette) behind it. Keep all key content inside the 9:16 safe zone (top 220px and bottom 380px stay clear for platform UI).
- Render with `npx remotion render`: H.264, CRF 16, yuv420p. Output to `out/`.

## VISUAL STYLE (reference analysis, replicate this feel)
The reference is a dark, premium "AI-agent at work" UI teaser:
- Near-black background with **deep blue/violet radial glows** that breathe slowly.
- One continuous flow with **no hard cuts**. Transitions are light blooms, whip-zooms with heavy directional motion blur, and objects morphing into the next scene.
- Glassy, rounded UI cards (macOS-like window chrome with 3 dots), thin borders at 8% white, soft inner glow.
- Text **streams in line by line** like an agent working, with small colored status tags and checkmarks.
- The camera is never static: slow drift + scale 1.00→1.04 on every scene, plus occasional fast push-ins.
- Glowing **light-stroke arcs** draw across the screen and converge into a UI element.
- A cursor clicks an option and a small **sparkle burst** appears.
- Ends on a bright **bloom flash** that resolves into the logo.

## COLOR PALETTE (derived from the Kavox logo)
| Token | Hex | Use |
|---|---|---|
| `bg` | `#07060F` | base background |
| `night` | `#120D2E` | panels, window fills |
| `indigo` | `#2A1B6E` | radial glow core, selected rows |
| `violet` | `#6D4AFF` | primary accent, highlights, buttons |
| `lavender` | `#A98BFF` | glows, light strokes, cursor trail |
| `blush` | `#E6A6C8` | secondary accent (top-left glow corner, like the logo background) |
| `white` | `#FFFFFF` | text, logo |
| `muted` | `rgba(255,255,255,0.55)` | secondary text |
| `success` | `#4ADE9B` | checkmarks / "fertig" tags (use sparingly) |

Signature background: diagonal gradient with `blush` → `violet` glow in the top-left corner, `lavender` glow in the bottom-right corner, black in the center (exactly like the Kavox logo wallpaper). Add subtle film grain (2–3% noise overlay) and a slight vignette.

## TIMELINE (390 frames ≈ 13.0 s @ 30 fps)
Sync accents to the frames marked ⚡ (these match the whoosh accents of the reference sound).

**S1 · Ignition (0–30f, 0.0–1.0s)**
Black screen. A tiny `lavender` light point appears at center, pulses twice, then ⚡(f15) explodes into a large soft violet bloom that fills ~70% of the frame.

**S2 · App icon (30–75f, 1.0–2.5s)**
The bloom collapses into a rounded-square glass app icon (radius 28%, `violet`→`indigo` gradient, inner glow) with the white Kavox K mark inside. Icon scales 0.6→1.0 with spring overshoot. A thin glowing ring expands outward from it once.

**S3 · Agent window (75–165f, 2.5–5.5s)**
The icon flies to the top-left and becomes the icon of an app window (3-dot chrome). Window header: **"KI-Angebot · Badsanierung Müller"**, small tag **"IN ARBEIT 1"**.
Input field types character by character:
`Bad 8 m², alte Fliesen raus, neu fliesen, bodengleiche Dusche`
Then agent steps stream in one by one (each line with a spinner → check):
- `Leistungskatalog durchsucht · 14 Positionen gefunden`
- `Materialmengen berechnet · 9,2 m² inkl. Verschnitt`
- `Arbeitszeit geschätzt · 26 Std.`
- `Preise aus deinem Katalog übernommen`
Meanwhile a right-side column fills with line items, each with a colored tag (`Abbruch`, `Fliesen`, `Sanitär`, `Material`) that glows when it appears ⚡(f120).

**S4 · Whip-zoom positions (165–210f, 5.5–7.0s)**
⚡(f168) Fast push-in with strong horizontal motion blur onto the generated position list:
- `01 Demontage Altfliesen · 8,0 m² · 296,00 €`
- `02 Estrich ausgleichen · 8,0 m² · 384,00 €`
- `03 Bodengleiche Dusche · 1 Stk · 1.450,00 €`
- `04 Wandfliesen verlegen · 18,5 m² · 1.295,00 €`
Rows highlight one after another with a `violet` bar sweeping left→right.

**S5 · Quote ready (210–255f, 7.0–8.5s)**
A clean A4 quote preview (white paper, Kavox header, positions table) slides up from the bottom with a soft shadow. The total counts up from 0 to **"4.860,00 €"** (tabular-nums, no jitter). A pill badge pops in: **"Angebot bereit · 28 Sek."** ⚡(f231).

**S6 · Light arcs (255–285f, 8.5–9.5s)**
Background shifts to deep blue-violet. Two `lavender` light strokes (SVG paths with glow, animated `strokeDashoffset`) draw in from the top corners, curve toward each other and converge onto an empty, glassy command bar in the center.

**S7 · Command bar (285–345f, 9.5–11.5s)**
The command bar fills: **"Badsanierung Müller – Angebot in 30 Sekunden"**. A dropdown opens above it:
- `✓ Angebot erstellen`
- `Nachkalkulieren`
- `In Rechnung umwandeln`
- `Per E-Mail senden`
The cursor moves smoothly (bezier path) down to "Per E-Mail senden", the row highlights, click ⚡(f327) → small sparkle burst (6–8 lavender particles) + the bar gets a `violet` send button pulse.

**S8 · Bloom → Logo (345–390f, 11.5–13.0s)**
The command bar stretches horizontally and flares into a bright white-violet bloom ⚡(f348). The bloom fades into the signature logo wallpaper background, and the **white Kavox wordmark** resolves in the center (blur 20px→0, scale 1.08→1.0, letter tracking tightens slightly). Below it, staggered:
- `KI-Angebot` (`lavender`, semi-bold)
- `Bald verfügbar.` (white 70%)
Hold the last 20 frames still so the logo stays readable (and the platform end-card does not cut it).

## AUDIO
- Do **not** bake a copyrighted track into the final render. Add `public/sound.mp3` as an optional `<Audio>` behind a prop `withMusic` (default `false`), for preview and sync only.
- Add subtle **SFX** with royalty-free / self-generated sounds: soft whoosh on every ⚡ frame, typing ticks in S3 (very quiet), a click + shimmer at f327, and a low "riser → impact" leading into f348. Keep SFX at ~-18 dB so the platform sound can sit on top.
- Export two versions: `kavox-teaser-sfx.mp4` (SFX only) and `kavox-teaser-silent.mp4`.

## QUALITY BAR
- Every element eases. No linear motion, and nothing pops in without a spring or fade.
- Motion blur: use `@remotion/motion-blur` (CameraMotionBlur, 6–10 samples) on S4 and S8.
- Text stays crisp and readable on a phone: minimum 28px on 1080-wide output for body, 44px+ for headlines.
- German copy exactly as written above (umlauts, `€` after the amount, German number format `4.860,00 €`).
- No Streamlit, no fake company names or reviews, no third-party logos.
- Keep every scene in its own component (`src/scenes/S1Ignition.tsx` … `S8Logo.tsx`), with the palette in `src/theme.ts` and the timings in one `src/timeline.ts`, so I can retime it later.

## PHASES
1. **Setup**: init Remotion, fonts, theme, timeline constants, load logo assets. Render a still of the S8 logo frame for approval.
2. **S1–S3**: render a preview clip.
3. **S4–S5**: render a preview clip.
4. **S6–S8 + transitions**: full rough cut, 1920×1080.
5. **Vertical composition + SFX + polish** (grain, vignette, motion blur). Final renders of both compositions into `out/`.

At the end, print the exact render commands and the file paths of all outputs.

---

## After rendering: posting checklist (for me, not for Claude Code)
1. **Authentic look (recommended, like the reference):** play `KavoxTeaser-Screen` full-screen on the MacBook in a dark room with purple LED/ambient light. Film it with the phone at a slight angle, keyboard visible at the bottom, 4K 30fps, exposure locked on the screen. This "phone filming a laptop" look reads as organic and performs better than a clean ad.
2. **Clean look:** upload `KavoxTeaser-Vertical` directly.
3. **Same sound:** in TikTok/Instagram, open the reference video's sound → "Use this sound" and add it to your upload in the app. That keeps it licensed and counts toward the sound's trend.
4. Add on-screen hook text in the app (top area), e.g.:
   - "Angebot schreiben dauert bei dir 45 Minuten?"
   - "Kavox macht's bald in 30 Sekunden. 🤫"
   - Bottom: "Folg mir, Launch kommt bald"
