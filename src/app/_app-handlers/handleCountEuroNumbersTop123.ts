import { handleReadJsonData } from "./handleReadJsonData";

export function handleCountEuroNumbersTop123(
  sorted = false
): Map<number, number> {
  const draws = handleReadJsonData();

  const elig = draws.filter(
    (draw) =>
      draw.anzahlKlasse1 > 0 && draw.anzahlKlasse2 > 0 && draw.anzahlKlasse3 > 0
  );

  const counts = new Map<number, number>();
  for (let number = 1; number <= 12; number++) counts.set(number, 0);

  for (const draw of elig) {
    counts.set(draw.zz1, (counts.get(draw.zz1) ?? 0) + 1);
    counts.set(draw.zz2, (counts.get(draw.zz2) ?? 0) + 1);
  }

  if (!sorted) return counts;
  return new Map([...counts.entries()].sort((a, b) => b[1] - a[1]));
}
