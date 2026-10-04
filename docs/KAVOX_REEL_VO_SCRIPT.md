# KavoxReel – Voiceover-Skript (Deutsch, für ElevenLabs)

60 s, 13 Zeilen, eine pro Phase. Jede Zeile passt in ihr Zeitfenster (ca. 2,4 Wörter/s,
ruhig gesprochen). Zahlen sind bewusst ausgeschrieben bzw. weggelassen, damit die
Stimme sie nicht falsch liest. „Strg + K“ wird als „Steuerung K“ gesprochen.

| Datei | Zeit | Phase | Text |
|---|---|---|---|
| `P01.mp3` | 0:00–0:04 | Intro | Weniger Büro. Mehr Baustelle. Das ist Kavox. |
| `P02.mp3` | 0:04–0:10 | Cockpit | Im Cockpit siehst du sofort: offene Rechnungen, Überfälliges und deinen Umsatz. |
| `P03.mp3` | 0:10–0:14 | Cashflow | Der Cashflow-Radar zeigt dir, wann das Geld kommt. |
| `P04.mp3` | 0:14–0:20 | KI-Assistent | Einfach sagen, was zu tun ist. Die KI baut das Angebot – mit deinen Preisen. |
| `P05.mp3` | 0:20–0:24 | Aufmaß | Jeder Quadratmeter mit Rechenweg. Nachvollziehbar. |
| `P06.mp3` | 0:24–0:28 | Vor Ort | Summe zeigen, unterschreiben lassen – direkt beim Kunden. |
| `P07.mp3` | 0:28–0:34 | Angebot | Am Rechner landet jede Eingabe sofort im PDF. Live. |
| `P08.mp3` | 0:34–0:38 | PDF | Ein Klick – und dein Profi-Angebot ist fertig. |
| `P09.mp3` | 0:38–0:42 | Strg + K | Steuerung K – und alles ist sofort da. |
| `P10.mp3` | 0:42–0:46 | Archiv | Jedes Dokument, jeder Status. Export als Excel inklusive. |
| `P11.mp3` | 0:46–0:50 | Auswertung | Deine Zahlen – klar und auf einen Blick. |
| `P12.mp3` | 0:50–0:54 | Baustellen-Modus | Und draußen? Baustellen-Modus an. Lesbar, auch in der Sonne. |
| `P13.mp3` | 0:54–1:00 | Outro | Läuft offline – deine Daten bleiben bei dir. Kavox. Jetzt testen. |

## ElevenLabs-Einstellungen

- Modell: **Eleven Multilingual v2** (bestes Deutsch)
- Stimme: native deutsche Stimme, warm und selbstsicher, eher ruhig als „Werbe-Schreier“
- Stability ~45 %, Similarity ~75 %, Style ~20 %, Speaker Boost an, Speed 1.0
- Jede Zeile **einzeln** generieren und als `P01.mp3` … `P13.mp3` speichern
  (alternativ eine Datei mit allen Zeilen; dann je Zeile einen Absatz und
  `<break time="1.0s" />` dazwischen)
- Export: MP3 44,1 kHz / 192 kbps oder WAV

## Mischung im Video

Jede Zeile startet ca. 0,3 s nach Beginn ihrer Phase. Die Musik wird unter der Stimme
um etwa 9 dB abgesenkt (Ducking), die SFX leicht. Ist eine Zeile zu lang, wird sie
um höchstens 8 % gestrafft. Danach werden das ganze Video und die 13 Phasen-Clips
neu gerendert.
