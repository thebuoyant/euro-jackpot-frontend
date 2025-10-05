import { handleReadJsonData } from "./handleReadJsonData";

export function handleCountWinningNumbersTop123(
  sorted = false
): Map<number, number> {
  const draws = handleReadJsonData();

  const filtered = draws.filter(
    (draw) =>
      draw.anzahlKlasse1 > 0 && draw.anzahlKlasse2 > 0 && draw.anzahlKlasse3 > 0
  );

  const counts = new Map<number, number>();
  for (const draw of filtered) {
    for (const number of [
      draw.nummer1,
      draw.nummer2,
      draw.nummer3,
      draw.nummer4,
      draw.nummer5,
    ]) {
      counts.set(number, (counts.get(number) ?? 0) + 1);
    }
  }

  if (!sorted) return counts;

  const sortedEntries = [...counts.entries()].sort((a, b) => {
    if (b[1] !== a[1]) return b[1] - a[1];
    return a[0] - b[0];
  });

  return new Map(sortedEntries);
}
