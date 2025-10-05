import { parseGermanDate } from "./date.util";

export function sortByDateAsc<T extends { datum: string }>(arr: T[]): T[] {
  return [...arr].sort(
    (a, b) =>
      parseGermanDate(a.datum).getTime() - parseGermanDate(b.datum).getTime()
  );
}
