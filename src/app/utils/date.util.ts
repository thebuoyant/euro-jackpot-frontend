export function parseGermanDate(dateStr: string): Date {
  // erwartet "DD.MM.YYYY"
  const [dd, mm, yyyy] = dateStr.split(".").map((p) => parseInt(p, 10));
  // UTC, damit keine lokalen TZ/DST-Effekte die Sortierung stören
  return new Date(Date.UTC(yyyy, mm - 1, dd));
}
