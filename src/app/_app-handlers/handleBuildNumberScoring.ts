"use client";

import { handleComputePopularityNumbers } from "./handleComputePopularity";
import { handleGetNumberGaps } from "./handleGetNumberGaps";
// JSON-Daten – Pfad ggf. anpassen. Voraussetzung: tsconfig -> "resolveJsonModule": true
import draws from "../_app-data/data.json" assert { type: "json" };

/**
 * Kriterien:
 * 1) Top-5 Gewinnzahlen (gesamt)
 * 2) Top-Dekade (häufigste 10er-Gruppe)
 * 3) Top Hoch/Tief (dominante Hälfte 1–25 oder 26–50)
 * 4) Top-5 überfällige Zahlen (größte Gaps)
 * 5) Top-5 beliebte Zahlen (derzeit Alias zu 1 – separater Tag/Farbe)
 * 6) Top-5 Gewinnzahlen innerhalb der Klassen 1–3 (aus data.json ermittelt)
 */

export type NumberHit = {
  key: string;
  label: string;
  color: string; // Hex
};

export type NumberScore = {
  n: number;
  score: number; // 0..6
  hits: NumberHit[]; // getroffene Kriterien
  barColor: string; // gemischte/abgeleitete Farbe für den Status-Balken
};

export type ScoringData = {
  top5Overall: Set<number>;
  topDecade: Set<number>;
  topHalf: "low" | "high";
  top5Overdue: Set<number>;
  top5Popular: Set<number>;
  top5TopClasses123: Set<number>;
};

// Basisfarben je Kriterium (bewusst kontrastreich)
const COLOR = {
  topOverall: "#1976d2", // Blau (MUI primary)
  topDecade: "#6d28d9", // Violett
  topHalf: "#009688", // Türkis
  overdue: "#ef6c00", // Orange
  popular: "#2e7d32", // Grün (dunkler als Eurozahlen-Grün)
  topClass: "#b32800", // Rotbraun (Klasse 1–3)
  bad: "#c62828", // Schlecht (0 Treffer)
  best: "#2e7d32", // Top (6 Treffer) – sattes Grün
};

// ---------- Helpers

function topNFromCountMap(map: Map<number, number>, n: number): number[] {
  return Array.from(map.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([k]) => k);
}

function decadeStart(n: number) {
  const d = Math.floor((n - 1) / 10); // 0..4
  return d * 10 + 1; // 1,11,21,31,41
}

/** Popularität -> Map<number,count> */
function normalizePopularity(pop: unknown): Map<number, number> {
  const countMap = new Map<number, number>();
  if (Array.isArray(pop)) {
    for (const row of pop) {
      const n = Number((row as any)?.n ?? (row as any)?.number);
      const c = Number(
        (row as any)?.count ?? (row as any)?.cnt ?? (row as any)?.value ?? 0
      );
      if (Number.isInteger(n) && Number.isFinite(c)) countMap.set(n, c);
    }
  } else if (pop && typeof pop === "object") {
    const entries =
      pop instanceof Map
        ? pop.entries()
        : Object.entries(pop as Record<string, number>);
    for (const [k, v] of entries as Iterable<[string | number, number]>) {
      const n = Number(k);
      const c = Number(v);
      if (Number.isInteger(n) && Number.isFinite(c)) countMap.set(n, c);
    }
  }
  return countMap;
}

/** Gaps -> Array<{ n, gap }> */
function normalizeGaps(gaps: unknown): Array<{ n: number; gap: number }> {
  const out: Array<{ n: number; gap: number }> = [];
  if (Array.isArray(gaps)) {
    for (const row of gaps) {
      const n = Number((row as any)?.n ?? (row as any)?.number);
      const g = Number((row as any)?.gap ?? (row as any)?.value ?? 0);
      if (Number.isInteger(n) && Number.isFinite(g)) out.push({ n, gap: g });
    }
  } else if (gaps && typeof gaps === "object") {
    const entries =
      gaps instanceof Map
        ? gaps.entries()
        : Object.entries(gaps as Record<string, number>);
    for (const [k, v] of entries as Iterable<[string | number, number]>) {
      const n = Number(k);
      const g = Number(v);
      if (Number.isInteger(n) && Number.isFinite(g)) out.push({ n, gap: g });
    }
  }
  return out;
}

/** Klasse I–III Gewinner? (heuristisch) */
function hadTopClassWinner(row: Record<string, unknown>): boolean {
  const keys = Object.keys(row);
  const has = (idx: 1 | 2 | 3, roman: "i" | "ii" | "iii") =>
    keys.some((k) => {
      const lk = k.toLowerCase();
      return (
        (lk.includes(`klasse${idx}`) ||
          lk.includes(`kl${idx}`) ||
          lk === roman ||
          lk.includes(`klasse ${roman}`)) &&
        Number(row[k]) > 0
      );
    });
  return has(1, "i") || has(2, "ii") || has(3, "iii");
}

/** Top-5 Klasse 1–3 aus data.json */
function computeTop5Classes123FromData(): Set<number> {
  const acc = new Map<number, number>();
  const arr = Array.isArray(draws) ? (draws as any[]) : [];
  for (const row of arr) {
    const o = row as Record<string, unknown>;
    if (!hadTopClassWinner(o)) continue;
    const nums = [o.nummer1, o.nummer2, o.nummer3, o.nummer4, o.nummer5]
      .map((v) => Number(v))
      .filter((v) => Number.isInteger(v) && v >= 1 && v <= 50);
    for (const n of nums) acc.set(n, (acc.get(n) ?? 0) + 1);
  }
  return new Set(topNFromCountMap(acc, 5));
}

/** Hex -> {r,g,b} */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!m) return null;
  return {
    r: parseInt(m[1], 16),
    g: parseInt(m[2], 16),
    b: parseInt(m[3], 16),
  };
}
/** {r,g,b} -> Hex */
function rgbToHex({ r, g, b }: { r: number; g: number; b: number }): string {
  const h = (n: number) =>
    Math.max(0, Math.min(255, Math.round(n)))
      .toString(16)
      .padStart(2, "0");
  return `#${h(r)}${h(g)}${h(b)}`;
}

/** mischt mehrere Hex-Farben (einfaches RGB-Mittel) */
function mixColors(hexColors: string[]): string {
  if (!hexColors.length) return COLOR.bad;
  let R = 0,
    G = 0,
    B = 0;
  let k = 0;
  for (const h of hexColors) {
    const rgb = hexToRgb(h);
    if (!rgb) continue;
    R += rgb.r;
    G += rgb.g;
    B += rgb.b;
    k++;
  }
  if (k === 0) return COLOR.bad;
  return rgbToHex({ r: R / k, g: G / k, b: B / k });
}

/** Score (0..6) -> Balkenfarbe; 0 = rot, 6 = best; dazwischen Mischung der getroffenen Kriterien */
function deriveBarColor(hits: NumberHit[]): string {
  const score = hits.length;
  if (score <= 0) return COLOR.bad;
  if (score >= 6) return COLOR.best;
  // Farbmischung aus den tatsächlich getroffenen Kriterien
  const mixed = mixColors(hits.map((h) => h.color));
  return mixed;
}

// ---------- Kernaufbau

export function buildNumberScoringData(): ScoringData {
  // Popularität gesamt
  const countMap = normalizePopularity(handleComputePopularityNumbers());

  // 1) Top-5 gesamt
  const top5OverallArr = topNFromCountMap(countMap, 5);
  const top5Overall = new Set<number>(top5OverallArr);

  // 2) Top-Dekade
  const decadeTotals = new Map<number, number>();
  for (let n = 1; n <= 50; n++) {
    const d = decadeStart(n);
    decadeTotals.set(d, (decadeTotals.get(d) ?? 0) + (countMap.get(n) ?? 0));
  }
  const bestDecadeStart =
    Array.from(decadeTotals.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 1;
  const topDecade = new Set<number>(
    Array.from({ length: 10 }, (_, i) => bestDecadeStart + i)
  );

  // 3) Top Hoch/Tief
  let lowSum = 0,
    highSum = 0;
  for (let n = 1; n <= 25; n++) lowSum += countMap.get(n) ?? 0;
  for (let n = 26; n <= 50; n++) highSum += countMap.get(n) ?? 0;
  const topHalf: "low" | "high" = highSum >= lowSum ? "high" : "low";

  // 4) Top-5 überfällig
  const gaps = normalizeGaps(handleGetNumberGaps());
  const top5Overdue = new Set<number>(
    gaps
      .sort((a, b) => b.gap - a.gap)
      .slice(0, 5)
      .map((r) => r.n)
  );

  // 5) Beliebte Zahlen – aktuell alias zu overall (eigene Farbe)
  const top5Popular = new Set<number>(top5OverallArr);

  // 6) Top-5 aus Klassen 1–3
  const top5TopClasses123 = computeTop5Classes123FromData();

  return {
    top5Overall,
    topDecade,
    topHalf,
    top5Overdue,
    top5Popular,
    top5TopClasses123,
  };
}

/** Bewertung einer Hauptzahl (1..50) – Score = Anzahl erfüllter Kriterien (0..6) */
export function scoreMainNumber(n: number, data: ScoringData): NumberScore {
  const hits: NumberHit[] = [];

  if (data.top5Overall.has(n)) {
    hits.push({
      key: "top5Overall",
      label: "Top-5 Gewinnzahlen (gesamt)",
      color: COLOR.topOverall,
    });
  }
  if (data.topDecade.has(n)) {
    hits.push({
      key: "topDecade",
      label: "Top-Dekade",
      color: COLOR.topDecade,
    });
  }
  const inHigh = n >= 26;
  if (
    (data.topHalf === "high" && inHigh) ||
    (data.topHalf === "low" && !inHigh)
  ) {
    hits.push({
      key: "topHalf",
      label: data.topHalf === "high" ? "Top Hoch-Zahlen" : "Top Tief-Zahlen",
      color: COLOR.topHalf,
    });
  }
  if (data.top5Overdue.has(n)) {
    hits.push({
      key: "overdue",
      label: "Top-5 überfällig",
      color: COLOR.overdue,
    });
  }
  if (data.top5Popular.has(n)) {
    hits.push({
      key: "popular",
      label: "Top-5 beliebte Zahlen",
      color: COLOR.popular,
    });
  }
  if (data.top5TopClasses123.has(n)) {
    hits.push({
      key: "topClass123",
      label: "Top-5 (Klassen 1–3)",
      color: COLOR.topClass,
    });
  }

  const barColor = deriveBarColor(hits);
  return { n, score: hits.length, hits, barColor };
}
