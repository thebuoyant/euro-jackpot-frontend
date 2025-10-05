import { handleReadJsonData } from "./handleReadJsonData";

export type WinningNumbersCount = Map<number, number>;

export function handleCountWinningNumbers(sorted = false): WinningNumbersCount {
  const draws = handleReadJsonData();

  const counts = new Map<number, number>();
  for (let winningNumber = 1; winningNumber <= 50; winningNumber++) {
    counts.set(winningNumber, 0);
  }

  for (const draw of draws) {
    const numbersArray = [
      draw.nummer1,
      draw.nummer2,
      draw.nummer3,
      draw.nummer4,
      draw.nummer5,
    ];
    for (const number of numbersArray) {
      const readNumber = Number(number);
      if (Number.isFinite(readNumber) && readNumber >= 1 && readNumber <= 50) {
        counts.set(readNumber, (counts.get(readNumber) ?? 0) + 1);
      }
    }
  }

  if (!sorted) return counts;

  const sortedEntries = Array.from(counts.entries()).sort((a, b) => {
    if (b[1] !== a[1]) return b[1] - a[1];
    return a[0] - b[0];
  });

  return new Map(sortedEntries);
}
