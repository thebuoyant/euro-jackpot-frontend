export type DayTag = "Di" | "Fr";

export interface RawRecord {
  datum: string;
  nummer1: string;
  nummer2: string;
  nummer3: string;
  nummer4: string;
  nummer5: string;
  zz1: string;
  zz2: string;
  spielEinsatz: string;
  anzahlKlasse1: string;
  quoteKlasse1: string;
  anzahlKlasse2: string;
  quoteKlasse2: string;
  anzahlKlasse3: string;
  quoteKlasse3: string;
  anzahlKlasse4: string;
  quoteKlasse4: string;
  anzahlKlasse5: string;
  quoteKlasse5: string;
  anzahlKlasse6: string;
  quoteKlasse6: string;
  anzahlKlasse7: string;
  quoteKlasse7: string;
  anzahlKlasse8: string;
  quoteKlasse8: string;
  anzahlKlasse9: string;
  quoteKlasse9: string;
  anzahlKlasse10: string;
  quoteKlasse10: string;
  anzahlKlasse11: string;
  quoteKlasse11: string;
  anzahlKlasse12: string;
  quoteKlasse12: string;

  tag: string; // noch “frei”
}

export interface DrawRecord {
  datum: string;
  tag: DayTag;
  nummer1: number;
  nummer2: number;
  nummer3: number;
  nummer4: number;
  nummer5: number;
  zz1: number;
  zz2: number;
  spielEinsatz: number;
  anzahlKlasse1: number;
  quoteKlasse1: number;
  anzahlKlasse2: number;
  quoteKlasse2: number;
  anzahlKlasse3: number;
  quoteKlasse3: number;
  anzahlKlasse4: number;
  quoteKlasse4: number;
  anzahlKlasse5: number;
  quoteKlasse5: number;
  anzahlKlasse6: number;
  quoteKlasse6: number;
  anzahlKlasse7: number;
  quoteKlasse7: number;
  anzahlKlasse8: number;
  quoteKlasse8: number;
  anzahlKlasse9: number;
  quoteKlasse9: number;
  anzahlKlasse10: number;
  quoteKlasse10: number;
  anzahlKlasse11: number;
  quoteKlasse11: number;
  anzahlKlasse12: number;
  quoteKlasse12: number;
}

export type TRecord = DrawRecord;

export type TWinningNumbersCountsResponse = {
  key: number;
  value: number;
};

export type TEuroNumbersCountsResponse = {
  key: number;
  value: number;
};
