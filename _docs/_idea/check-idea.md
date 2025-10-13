1. Rolling Hot/Cold (bewegte Fenster)

Warum: „Gerade auffällige“ Zahlen sehen – ohne totale Historie zu verwässern.

Wie: Handler handleGetRollingFrequencies(window=50) → Häufigkeiten der 5 Gewinnzahlen innerhalb der letzten N Ziehungen.

UI: Horizontaler Bar-Chart (Top 10 hot & cold), Tab „50/100/250“.
Bonus: Heatmap (Zahl 1–50 vs. Fenstergröße).

2. Gap-/Overdue-Analyse

Warum: Spaß-Feature – wann wurde eine Zahl zuletzt gezogen?

Wie: Für jede Zahl lastSeenDrawIndex & gap = drawsSinceLastSeen.
Handler: handleGetNumberGaps() → [{number, gap, lastDate}].

UI: Bar-Chart „Overdue Ranking“, Tooltip mit letztem Datum.

3. Paar- & Tripel-Ko­-Occurrence

Warum: Kombis, die häufig zusammen auftauchen (reiner Spaß, keine Prognose).

Wie: handleGetCooccurrence(k=2|3) zählt Kombinationen (unordered sets).

UI: Tabelle Top-20, daneben chord-ähnliche Mini-Visual: 1–50 an X&Y, Heatmap (Matrix) für Paare.

4. Verteilung nach Dekaden & High/Low (zeitlich)

Warum: Eure Dekaden- & High/Low-Logik über die Zeit sichtbar machen.

Wie: Pro Ziehung countInDecade1..5, rollierende Mittelwerte je Dekade.

UI: Area-Stacked pro Dekade (letzte 200 Ziehungen), zweite Ansicht „1–25 vs. 26–50“.

5. Dienstag vs. Freitag (Signifikanz-Spielerei)

Warum: Ob Unterschiede zwischen Di/Fr bestehen (nur des Spaßes wegen).

Wie: Splitte eure existierenden Analysen nach tag.
Handler-Option byDay=true.

UI: Side-by-Side-Bars (Di vs. Fr) für Häufigkeiten, Gaps, Co-Occurrence.

6. Serien & Muster (Consecutives & Streuung)

Warum: Muster, die Nutzer gern ansehen (z. B. aufeinanderfolgende Zahlen).

Wie: Für jede Ziehung: #consecutive pairs, Range (max–min), Spread.

UI: Histogramm der Range, Lollipop-Chart für „Anzahl Consecutives“.

7. Klassen-Quoten: Boxplots & Ausreißer

Warum: Eure Quoten-Seite ist top. Als Add-on: Streuung/Outlier je Klasse.

Wie: handleGetClassStats(k) → min/median/mean/p75/p90/max.

UI: „Pseudo-Boxplot“ (Recharts: CustomShape/ComposedChart) + Outlier-Punkte, Filter Zeitfenster.

8. Gewinnklassen-Anzahlen: Saisonale Wellen

Warum: Spieler:innen lieben Trends – „Warum waren Klasse-3-Anzahlen zuletzt höher?“

Wie: handleGetClassNumbers(k) zeitlich, plus rollierende Mittelwerte.

UI: Area + Ø-Referenzlinie (du hast die Mean-Line schon elegant gelöst), Umschalter Median/Mean.

9. Normierung historischer Eurozahl-Regeländerung

Warum: Fairere Vergleiche (früher 1–10, später 1–12).

Wie: Zwei Modi: „Historisch“ vs. „Normalisiert“ (prozentuale Trefferquote relativ zur verfügbaren Menge).

UI: Toggle „Normalisieren (zz: 1–10↔1–12)“ in Eurozahlen-Dashboards.

10. Quick-Picker-Assistent (Number Builder)

Warum: Interaktiver Spaß – Nutzer bauen ihr Tippfeld mit Live-Feedback.

Wie: Client-only: Beim Klicken auf Zahlen Vorschau-Statistiken (Hot/Cold/Gaps/Co-Occ).

UI: Grid 1–50 & 1–12, rechts live Stat-Panel, „Balance-Score“ (z. B. gleichmäßig über Dekaden, keine Duplikate, nicht zu viele Consecutives).

11. Simulations-„Spielwiese“ (Just for Fun)

Warum: „Was wäre wenn ich 10 Ziehungen spiele?“ – Motivation & Gamification.

Wie: Pseudo-Monte-Carlo (Client) mit realistisch gewichtetem Zufall (gleichverteilt!), Rückblick: gegen echte Historie „gespielt“.

UI: Kleine Simulation-Card: Input (#Tippfelder, #Ziehungen), Output: Häufigkeiten, „Hypothetischer Gewinn“ (nur Spaß).

12. Jackpot-/Einsatz-Korrelation (Storytelling)

Warum: Kontext – wenn verfügbar: zeigt, ob hohe Jackpots mit Einsätzen/Anzahlen korrelieren.

Wie: Wenn ihr Jackpot-Historie habt: Scatter/Line, Korrelation r berechnen.

UI: ComposedChart: Einsatz (Bar) + Jackpot (Line), Tooltip mit Datum/Klasse-1-Treffer.

Umsetzungstipps (nah an deinem Code)

Handler-Namen & Shapes

handleGetRollingFrequencies(window: number): Array<{number: 1..50, count: number}>

handleGetNumberGaps(): Array<{ number: number, gap: number, lastDate: string }>

handleGetCooccurrence(k: 2|3): Array<{ combo: number[], count: number }>

handleGetDecadeTimeline(): Array<{ datum: string, d1: number, d2: number, ... }>

handleGetConsecutiveStats(): Array<{ datum: string, consecutivePairs: number, range: number }>

handleGetClassStats(k: number): { min:number, p25:number, median:number, mean:number, p75:number, p90:number, max:number }

API-Routen

/api/backend/rolling-frequencies?window=50

/api/backend/number-gaps

/api/backend/cooccurrence?k=2

/api/backend/decade-timeline

/api/backend/consecutive-stats

/api/backend/class-stats?class=1

Zustand-Slices

rollingFrequencies, numberGaps, cooccurrencePairs, decadeTimeline, consecutiveStats, classStats.

Reuse deines „erster Request“-Patterns mit hasFetchedRef.

Charts

Bar/Area/Composed – Y-Headroom & „nice ticks“ (makeNiceScale) wiederverwenden.

Labels innerhalb des Grids halten (du hast die Domain-Strategie bereits etabliert).

A11y & UX

Tooltips immer mit Datum, Formatierung (de-DE).

Tabs für Varianten (Di/Fr, Fenstergrößen, Klasse).

Skeletons exakt auf Chart-Höhen abgestimmt (deine Reuse-Komponenten).
