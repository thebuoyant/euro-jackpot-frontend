/* eslint-disable  @typescript-eslint/no-explicit-any */

import { TRecord } from "../_app-types/record.types";
import { handleReadJsonData } from "./handleReadJsonData";

export type TClassQuotaPoint = {
  datum: string; // z. B. "23.03.2012"
  valueAsNumber: number; // z. B. 1234.56
  valueAsString: string; // z. B. "1.234,56 €"
};

/** Parst deutsche Währungs-/Zahlstrings wie "1.234,56 €" → 1234.56 */
function toEuroNumber(v: unknown): number {
  if (typeof v === "number") return Number.isFinite(v) ? v : 0;
  if (typeof v === "string") {
    const cleaned = v.replace(/[^\d.,-]/g, ""); // nur Ziffern/.,- behalten
    const normalized = cleaned.replace(/\./g, "").replace(",", ".");
    const n = Number(normalized);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}

/** Formatiert eine Zahl als deutschen Euro-String mit 2 Nachkommastellen, inkl. " €" */
function toEuroString(n: number): string {
  const val = Number.isFinite(n) ? n : 0;
  return `${val.toLocaleString("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} €`;
}

/**
 * Liefert für die angegebene Gewinnklasse (1..12) die Quoten aller Ziehungen.
 * Beispiel: quotaClass = 1 → nimmt `quoteKlasse1`.
 * Reihenfolge: wie in handleReadJsonData (aufsteigend nach Datum).
 */
export function handleGetClassQuota(quotaClass: number): TClassQuotaPoint[] {
  if (!Number.isInteger(quotaClass) || quotaClass < 1 || quotaClass > 12) {
    throw new Error("quotaClass must be an integer between 1 and 12.");
  }

  const data: TRecord[] = handleReadJsonData(0);
  if (!data.length) {
    throw new Error("No data available.");
  }

  const key = `quoteKlasse${quotaClass}` as keyof TRecord;

  return data.map((row) => {
    const raw = (row as any)[key];
    const valueAsNumber = toEuroNumber(raw);
    const valueAsString = toEuroString(valueAsNumber);
    return {
      datum: row.datum,
      valueAsNumber,
      valueAsString,
    };
  });
}
