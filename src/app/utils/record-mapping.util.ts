import { DayTag, RawRecord, DrawRecord } from "../types/record.types";

function toDayTag(value: string): DayTag {
  return value === "Di" || value === "Fr" ? value : "Fr";
}

function parseEuroAmount(value: string): number {
  if (!value) return 0;
  const cleaned = value
    .replace(/\s/g, "") // Leerzeichen entfernen
    .replace("€", "") // Euro-Zeichen entfernen
    .replace(/\./g, "") // Tausenderpunkte entfernen
    .replace(",", "."); // Komma -> Punkt
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
}

function parseGermanInt(value: string): number {
  if (!value) return 0;
  const cleaned = value.replace(/\./g, "").trim();
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
}

function parseSimpleInt(value: string): number {
  const n = Number(String(value || "").trim());
  return Number.isFinite(n) ? n : 0;
}

export function handleRecordMapping(input: RawRecord[]): DrawRecord[] {
  return input.map((r) => ({
    datum: r.datum,
    tag: toDayTag(r.tag),

    nummer1: parseSimpleInt(r.nummer1),
    nummer2: parseSimpleInt(r.nummer2),
    nummer3: parseSimpleInt(r.nummer3),
    nummer4: parseSimpleInt(r.nummer4),
    nummer5: parseSimpleInt(r.nummer5),
    zz1: parseSimpleInt(r.zz1),
    zz2: parseSimpleInt(r.zz2),

    spielEinsatz: parseEuroAmount(r.spielEinsatz),

    anzahlKlasse1: parseGermanInt(r.anzahlKlasse1),
    quoteKlasse1: parseEuroAmount(r.quoteKlasse1),
    anzahlKlasse2: parseGermanInt(r.anzahlKlasse2),
    quoteKlasse2: parseEuroAmount(r.quoteKlasse2),
    anzahlKlasse3: parseGermanInt(r.anzahlKlasse3),
    quoteKlasse3: parseEuroAmount(r.quoteKlasse3),
    anzahlKlasse4: parseGermanInt(r.anzahlKlasse4),
    quoteKlasse4: parseEuroAmount(r.quoteKlasse4),
    anzahlKlasse5: parseGermanInt(r.anzahlKlasse5),
    quoteKlasse5: parseEuroAmount(r.quoteKlasse5),
    anzahlKlasse6: parseGermanInt(r.anzahlKlasse6),
    quoteKlasse6: parseEuroAmount(r.quoteKlasse6),
    anzahlKlasse7: parseGermanInt(r.anzahlKlasse7),
    quoteKlasse7: parseEuroAmount(r.quoteKlasse7),
    anzahlKlasse8: parseGermanInt(r.anzahlKlasse8),
    quoteKlasse8: parseEuroAmount(r.quoteKlasse8),
    anzahlKlasse9: parseGermanInt(r.anzahlKlasse9),
    quoteKlasse9: parseEuroAmount(r.quoteKlasse9),
    anzahlKlasse10: parseGermanInt(r.anzahlKlasse10),
    quoteKlasse10: parseEuroAmount(r.quoteKlasse10),
    anzahlKlasse11: parseGermanInt(r.anzahlKlasse11),
    quoteKlasse11: parseEuroAmount(r.quoteKlasse11),
    anzahlKlasse12: parseGermanInt(r.anzahlKlasse12),
    quoteKlasse12: parseEuroAmount(r.quoteKlasse12),
  }));
}
