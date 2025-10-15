/* eslint-disable  @typescript-eslint/no-explicit-any */

import { TRecord } from "../_app-types/record.types";
import { handleReadJsonData } from "./handleReadJsonData";

export type PopularityItem = { key: number; value: number };

/**
 * Heuristik: Ziehungen mit "ungewöhnlich vielen" Gewinnern in oberen Klassen
 * deuten auf "beliebte" Kombinationen hin. Wir nutzen Klassen 1–3 als Signal.
 * signal = (w1*5 + w2*3 + w3*2) / sqrt(N_est), N_est ~ spieleinsatz / ticketPrice
 * Das Signal verteilen wir gleichmäßig auf gezogene Zahlen:
 *  - jede der 5 Hauptzahlen bekommt signal/5
 *  - jede der 2 Eurozahlen bekommt signal/2
 */

export type PopularityScores = {
  mainScores: { key: number; value: number }[]; // 1..50
  euroScores: { key: number; value: number }[]; // 1..12
};

export function handleComputePopularityNumbers(
  ticketPrice = 2.0
): PopularityScores {
  const rows: TRecord[] = handleReadJsonData(0);
  if (!rows?.length) {
    return { mainScores: [], euroScores: [] };
  }

  // Akkus
  const main = new Array(50).fill(0); // index 0 => Zahl 1
  const euro = new Array(12).fill(0); // index 0 => Zahl 1

  for (const r of rows) {
    // N schätzen
    const einsatz = Number((r as any)?.spielEinsatz ?? 0) || 0;
    const N = Math.max(1, einsatz / Math.max(0.5, ticketPrice)); // safety

    const w1 = Number((r as any)?.anzahlKlasse1 ?? 0) || 0;
    const w2 = Number((r as any)?.anzahlKlasse2 ?? 0) || 0;
    const w3 = Number((r as any)?.anzahlKlasse3 ?? 0) || 0;

    // gewichtetes Winners-Signal
    const rawSignal = w1 * 5 + w2 * 3 + w3 * 2;
    const signal = rawSignal / Math.sqrt(N);

    // auf Zahlen verteilen (gleichmäßig)
    const addMain = signal / 5;
    const addEuro = signal / 2;

    const n1 = Number((r as any)?.nummer1 ?? 0);
    const n2 = Number((r as any)?.nummer2 ?? 0);
    const n3 = Number((r as any)?.nummer3 ?? 0);
    const n4 = Number((r as any)?.nummer4 ?? 0);
    const n5 = Number((r as any)?.nummer5 ?? 0);
    const e1 = Number((r as any)?.zz1 ?? 0);
    const e2 = Number((r as any)?.zz2 ?? 0);

    // guard
    const mains = [n1, n2, n3, n4, n5].filter(
      (x) => Number.isFinite(x) && x >= 1 && x <= 50
    );
    const euros = [e1, e2].filter(
      (x) => Number.isFinite(x) && x >= 1 && x <= 12
    );

    for (const m of mains) main[m - 1] += addMain;
    for (const z of euros) euro[z - 1] += addEuro;
  }

  const mainScores = main.map((v, i) => ({
    key: i + 1,
    value: Number(v.toFixed(6)),
  }));
  const euroScores = euro.map((v, i) => ({
    key: i + 1,
    value: Number(v.toFixed(6)),
  }));

  // absteigend sortiert (populärste zuerst)
  mainScores.sort((a, b) => b.value - a.value);
  euroScores.sort((a, b) => b.value - a.value);

  return { mainScores, euroScores };
}
