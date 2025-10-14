/* eslint-disable  @typescript-eslint/no-explicit-any */

import { TRecord } from "../_app-types/record.types";
import { handleReadJsonData } from "./handleReadJsonData";

export type PrizeClassSpec = {
  class: number; // 1..12
  mainHits: number; // benötigte Gewinnzahlen
  euroHits: number; // benötigte Eurozahlen
};

export type PrizeClassSummaryItem = {
  class: number;
  mainHits: number;
  euroHits: number;
  minValue: number; // als Zahl (€)
  minValueStr: string; // "1.234,56 €"
  minLastDate: string | null;
  maxValue: number;
  maxValueStr: string;
  maxLastDate: string | null;
};

export type PrizeClassesSummary = {
  items: PrizeClassSummaryItem[];
};

/** "1.234,56 €" → 1234.56 */
function toEuroNumber(v: unknown): number {
  if (typeof v === "number") return Number.isFinite(v) ? v : 0;
  if (typeof v === "string") {
    const cleaned = v.replace(/[^\d.,-]/g, "");
    const normalized = cleaned.replace(/\./g, "").replace(",", ".");
    const n = Number(normalized);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}

/** 1234.56 → "1.234,56 €" */
function toEuroString(n: number): string {
  const val = Number.isFinite(n) ? n : 0;
  return `${val.toLocaleString("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} €`;
}

/** Eurojackpot-Klassen: benötigte Treffer (übliches Schema) */
const PRIZE_CLASSES: PrizeClassSpec[] = [
  { class: 1, mainHits: 5, euroHits: 2 },
  { class: 2, mainHits: 5, euroHits: 1 },
  { class: 3, mainHits: 5, euroHits: 0 },
  { class: 4, mainHits: 4, euroHits: 2 },
  { class: 5, mainHits: 4, euroHits: 1 },
  { class: 6, mainHits: 4, euroHits: 0 },
  { class: 7, mainHits: 3, euroHits: 2 },
  { class: 8, mainHits: 3, euroHits: 1 },
  { class: 9, mainHits: 3, euroHits: 0 },
  { class: 10, mainHits: 2, euroHits: 2 },
  { class: 11, mainHits: 2, euroHits: 1 },
  { class: 12, mainHits: 1, euroHits: 2 },
];

/**
 * Für Klassen 1..12: min/max Quote + letztes Auftreten dieser Extremwerte.
 * Reihenfolge wie handleReadJsonData (aufsteigend), letztes Auftreten ermitteln wir
 * durch rückwärts iterieren.
 */
export function handleGetPrizeClassesSummary(): PrizeClassesSummary {
  const data: TRecord[] = handleReadJsonData(0);

  if (!data.length) {
    return {
      items: PRIZE_CLASSES.map((c) => ({
        class: c.class,
        mainHits: c.mainHits,
        euroHits: c.euroHits,
        minValue: 0,
        minValueStr: toEuroString(0),
        minLastDate: null,
        maxValue: 0,
        maxValueStr: toEuroString(0),
        maxLastDate: null,
      })),
    };
  }

  const items: PrizeClassSummaryItem[] = PRIZE_CLASSES.map(
    ({ class: k, mainHits, euroHits }) => {
      const key = `quoteKlasse${k}` as keyof TRecord;

      const rows = data.map((row) => ({
        date: row.datum,
        val: toEuroNumber((row as any)[key]),
      }));

      let min = Infinity;
      let max = -Infinity;
      for (const r of rows) {
        if (r.val < min) min = r.val;
        if (r.val > max) max = r.val;
      }
      if (!Number.isFinite(min)) min = 0;
      if (!Number.isFinite(max)) max = 0;

      let minLastDate: string | null = null;
      let maxLastDate: string | null = null;
      for (let i = rows.length - 1; i >= 0; i--) {
        if (minLastDate == null && rows[i].val === min)
          minLastDate = rows[i].date;
        if (maxLastDate == null && rows[i].val === max)
          maxLastDate = rows[i].date;
        if (minLastDate && maxLastDate) break;
      }

      return {
        class: k,
        mainHits,
        euroHits,
        minValue: min,
        minValueStr: toEuroString(min),
        minLastDate,
        maxValue: max,
        maxValueStr: toEuroString(max),
        maxLastDate,
      };
    }
  );

  return { items };
}
