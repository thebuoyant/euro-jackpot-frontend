import { TRecord } from "../_app-types/record.types";
import { handleReadJsonData } from "./handleReadJsonData";

export type TNumberGap = {
  number: number; // 1..50
  gap: number; // Ziehungen seit letztem Auftreten
  lastDate: string | null; // z. B. "23.03.2012" oder null (nie gesehen)
  lastDrawIndex: number | null; // 0-basierter Index der letzten Ziehung
};

/**
 * Gap-/Overdue-Analyse für Hauptzahlen (1..50).
 * Reihenfolge der Verarbeitung: wie in handleReadJsonData (aufsteigend nach Datum).
 */
export function handleGetNumberGaps(): TNumberGap[] {
  const data: TRecord[] = handleReadJsonData(0);
  const total = data.length;

  // lastSeenIndex/-Date: init mit „nie gesehen“
  const lastSeenIndex = new Array<number>(51).fill(-1); // 0 ignoriert, wir nutzen 1..50
  const lastSeenDate = new Array<string | null>(51).fill(null);

  // Durch alle Ziehungen gehen (aufsteigend)
  for (let i = 0; i < total; i++) {
    const row = data[i];
    const nums = [
      row.nummer1,
      row.nummer2,
      row.nummer3,
      row.nummer4,
      row.nummer5,
    ];
    for (const n of nums) {
      if (Number.isInteger(n) && n >= 1 && n <= 50) {
        lastSeenIndex[n] = i;
        lastSeenDate[n] = row.datum ?? null;
      }
    }
  }

  const currentIndex = total - 1;
  const result: TNumberGap[] = [];

  for (let n = 1; n <= 50; n++) {
    const idx = lastSeenIndex[n];
    const gap = idx >= 0 ? currentIndex - idx : total; // nie gesehen => total
    result.push({
      number: n,
      gap,
      lastDate: lastSeenDate[n],
      lastDrawIndex: idx >= 0 ? idx : null,
    });
  }

  // Du kannst später im UI sortieren; hier optional DESC nach gap:
  result.sort((a, b) => b.gap - a.gap || a.number - b.number);

  return result;
}
