/* eslint-disable  @typescript-eslint/no-explicit-any */

import { TRecord } from "../_app-types/record.types";
import { handleReadJsonData } from "./handleReadJsonData";

export type TClassNumbersPoint = {
  datum: string; // z. B. "23.03.2012"
  valueAsNumber: number; // z. B. 123456
  valueAsString: string; // z. B. "123.456"
};

/** Parst Ganzzahlen aus Strings wie "123.456" → 123456 */
function toInt(v: unknown): number {
  if (typeof v === "number") return Number.isFinite(v) ? Math.trunc(v) : 0;
  if (typeof v === "string") {
    // nur Ziffern/- behalten, Punkte/Leerzeichen entfernen
    const cleaned = v.replace(/[^\d-]/g, "");
    const n = Number(cleaned);
    return Number.isFinite(n) ? Math.trunc(n) : 0;
  }
  return 0;
}

/** Formatiert eine Zahl deutsch mit 0 Nachkommastellen */
function toIntString(n: number): string {
  const val = Number.isFinite(n) ? Math.trunc(n) : 0;
  return val.toLocaleString("de-DE", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

/**
 * Liefert für die angegebene Gewinnklasse (1..12) die ANZAHLEN aller Ziehungen.
 * numbersClass = 1 → nimmt `anzahlKlasse1`.
 * Reihenfolge: wie in handleReadJsonData (ASC).
 */
export function handleGetClassNumbers(
  numbersClass: number
): TClassNumbersPoint[] {
  if (
    !Number.isInteger(numbersClass) ||
    numbersClass < 1 ||
    numbersClass > 12
  ) {
    throw new Error("numbersClass must be an integer between 1 and 12.");
  }

  const data: TRecord[] = handleReadJsonData(0);
  if (!data.length) throw new Error("No data available.");

  const key = `anzahlKlasse${numbersClass}` as keyof TRecord;

  return data.map((row) => {
    const raw = (row as any)[key];
    const valueAsNumber = toInt(raw);
    const valueAsString = toIntString(valueAsNumber);
    return { datum: row.datum, valueAsNumber, valueAsString };
  });
}
