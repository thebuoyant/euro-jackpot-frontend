/**
 * Parse "DD.MM.YYYY" into a UTC Date (00:00:00).
 * Kept for backwards compatibility.
 */
export function parseGermanDate(dateStr: string): Date {
  // expects "DD.MM.YYYY"
  const [dd, mm, yyyy] = dateStr.split(".").map((p) => parseInt(p, 10));
  return new Date(Date.UTC(yyyy, mm - 1, dd));
}

/** True if a Date instance is valid. */
export function isValidDate(d: Date | null | undefined): d is Date {
  return !!d && !isNaN(d.getTime());
}

/**
 * Parse ISO "yyyy-MM-dd" into a UTC Date (00:00:00).
 */
export function parseIsoDate(iso: string): Date | null {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return null;
  const [, y, mm, dd] = m;
  const d = new Date(Date.UTC(Number(y), Number(mm) - 1, Number(dd)));
  return isValidDate(d) ? d : null;
}

/**
 * Parse "dd.MM.yy" into a UTC Date (00:00:00) assuming 20yy.
 */
export function parseGermanShortYear(dateStr: string): Date | null {
  const m = dateStr.match(/^(\d{2})\.(\d{2})\.(\d{2})$/);
  if (!m) return null;
  const [, dd, mm, yy] = m;
  const y = 2000 + Number(yy);
  const d = new Date(Date.UTC(y, Number(mm) - 1, Number(dd)));
  return isValidDate(d) ? d : null;
}

/**
 * Normalize any of: "yyyy-MM-dd", "dd.MM.yyyy", "dd.MM.yy" to a comparable UTC timestamp.
 * We set time to 12:00 UTC to avoid TZ/DST edge cases when only dates matter.
 */
export function toComparableUtcNoon(dateStr: string): number | null {
  if (!dateStr) return null;

  // Try ISO first
  const iso = parseIsoDate(dateStr);
  if (iso) {
    return Date.UTC(
      iso.getUTCFullYear(),
      iso.getUTCMonth(),
      iso.getUTCDate(),
      12,
      0,
      0,
      0
    );
  }

  // Try dd.MM.yyyy
  const fullDe = parseGermanDateMaybe(dateStr);
  if (fullDe) {
    return Date.UTC(
      fullDe.getUTCFullYear(),
      fullDe.getUTCMonth(),
      fullDe.getUTCDate(),
      12,
      0,
      0,
      0
    );
  }

  // Try dd.MM.yy
  const shortDe = parseGermanShortYear(dateStr);
  if (shortDe) {
    return Date.UTC(
      shortDe.getUTCFullYear(),
      shortDe.getUTCMonth(),
      shortDe.getUTCDate(),
      12,
      0,
      0,
      0
    );
  }

  return null;
}

/** Safe wrapper around parseGermanDate that returns null on bad input. */
export function parseGermanDateMaybe(dateStr: string): Date | null {
  try {
    const d = parseGermanDate(dateStr);
    return isValidDate(d) ? d : null;
  } catch {
    return null;
  }
}

/**
 * Convert a comparable "UTC noon" timestamp to the inclusive end-of-day timestamp.
 * We go from 12:00 -> ~23:00 to include the end date while staying TZ-neutral.
 */
export function toEndOfDayComparable(tsNoonUtc: number | null): number | null {
  if (tsNoonUtc == null) return null;
  return tsNoonUtc + 11 * 60 * 60 * 1000;
}
