import { handleReadJsonData } from "./handleReadJsonData";

export function handleCountEuroNumbers(sorted = false): Map<number, number> {
  const draws = handleReadJsonData();

  const counts = new Map<number, number>();

  for (const draw of draws) {
    for (const n of [draw.zz1, draw.zz2]) {
      counts.set(n, (counts.get(n) ?? 0) + 1);
    }
  }

  if (!sorted) return counts;

  const sortedEntries = [...counts.entries()].sort((a, b) => {
    if (b[1] !== a[1]) return b[1] - a[1];
    return a[0] - b[0];
  });

  return new Map(sortedEntries);
}
