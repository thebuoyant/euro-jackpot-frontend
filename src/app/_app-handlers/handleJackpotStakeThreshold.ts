"use client";

import type { DrawRecord } from "src/app/_app-types/record.types";

/**
 * Idee:
 * - Wir „binnen“ historische Ziehungen nach spielEinsatz (z. B. in 10 Quantilen).
 * - Für jedes Bin berechnen wir P(Klasse1>=1).
 * - Danach glätten wir leicht (moving average), um Ausreißer zu dämpfen.
 * - Der Threshold ist der kleinste Stake, ab dem P >= targetProb (z. B. 0.5).
 *
 * Vorteile:
 * - Robust, schnell, ohne externe ML-Libs.
 * - Nicht-linear (erkennt Knicke), besser als naive lineare Regression hier.
 */

export type ThresholdResult = {
  threshold: number | null; // € – ab hier "hohe Chance"
  targetProb: number; // z. B. 0.5
  bins: Array<{
    stakeMin: number;
    stakeMax: number;
    prob: number; // Anteil der Ziehungen mit anzahlKlasse1 > 0
    n: number; // Stützstellen pro Bin
  }>;
  sampleSize: number;
};

/** Hilfsfunktion: Quantile-Grenzen berechnen */
function quantileCuts(values: number[], bins: number): number[] {
  const sorted = [...values].sort((a, b) => a - b);
  const cuts: number[] = [];
  for (let i = 1; i < bins; i++) {
    const p = i / bins;
    const idx = Math.min(
      sorted.length - 1,
      Math.max(0, Math.round(p * (sorted.length - 1)))
    );
    cuts.push(sorted[idx]);
  }
  return Array.from(new Set(cuts)); // doppelte schneiden weg
}

/** Moving Average glätten (Fenster=3) */
function smooth(arr: number[]): number[] {
  if (arr.length <= 2) return arr.slice();
  const out = arr.slice();
  for (let i = 1; i < arr.length - 1; i++) {
    out[i] = (arr[i - 1] + arr[i] + arr[i + 1]) / 3;
  }
  return out;
}

/** Hauptfunktion */
export function handleJackpotStakeThreshold(
  records: DrawRecord[],
  opts?: { binCount?: number; minPerBin?: number; targetProb?: number }
): ThresholdResult {
  const binCount = opts?.binCount ?? 10;
  const minPerBin = opts?.minPerBin ?? 8; // zu kleine Bins sind instabil
  const targetProb = opts?.targetProb ?? 0.5;

  const rows = (records ?? [])
    .map((r) => ({
      stake: Number((r as any)?.spielEinsatz),
      hasK1: Number((r as any)?.anzahlKlasse1) > 0,
    }))
    .filter((r) => Number.isFinite(r.stake) && r.stake > 0);

  const sampleSize = rows.length;
  if (sampleSize === 0) {
    return { threshold: null, targetProb, bins: [], sampleSize };
  }

  // Quantile-Grenzen
  const stakes = rows.map((r) => r.stake);
  const cuts = quantileCuts(stakes, binCount);
  const edges = [Number.NEGATIVE_INFINITY, ...cuts, Number.POSITIVE_INFINITY];

  // Bins bauen
  const bins: {
    stakeMin: number;
    stakeMax: number;
    prob: number;
    n: number;
  }[] = [];
  for (let i = 0; i < edges.length - 1; i++) {
    const lo = edges[i],
      hi = edges[i + 1];
    const inBin = rows.filter((r) => r.stake > lo && r.stake <= hi);
    if (inBin.length < minPerBin) continue;
    const n = inBin.length;
    const k = inBin.reduce((acc, r) => acc + (r.hasK1 ? 1 : 0), 0);
    bins.push({
      stakeMin: Math.max(
        0,
        lo === Number.NEGATIVE_INFINITY
          ? Math.min(...inBin.map((x) => x.stake))
          : lo
      ),
      stakeMax:
        hi === Number.POSITIVE_INFINITY
          ? Math.max(...inBin.map((x) => x.stake))
          : hi,
      prob: n > 0 ? k / n : 0,
      n,
    });
  }

  if (bins.length === 0) {
    return { threshold: null, targetProb, bins: [], sampleSize };
  }

  // sanft glätten
  const smoothed = smooth(bins.map((b) => b.prob));
  for (let i = 0; i < bins.length; i++) bins[i].prob = smoothed[i];

  // Threshold: kleinster stakeMin, bei dem P >= targetProb
  let threshold: number | null = null;
  for (const b of bins) {
    if (b.prob >= targetProb) {
      threshold = Math.round(b.stakeMin);
      break;
    }
  }

  return { threshold, targetProb, bins, sampleSize };
}
