import { TRecord } from "../_app-types/record.types";
import { handleReadJsonData } from "./handleReadJsonData";

export type TSpecialData = {
  decades: {
    decade1: number; // 1–10
    decade2: number; // 11–20
    decade3: number; // 21–30
    decade4: number; // 31–40
    decade5: number; // 41–50
  };
  highLow: {
    high: number; // 26–50
    low: number; // 1–25
  };
};

export function handleGetSpecialData(limit = 0): TSpecialData {
  const data: TRecord[] = handleReadJsonData(limit);

  if (!data.length) {
    throw new Error("No data available.");
  }

  const result: TSpecialData = {
    decades: {
      decade1: 0,
      decade2: 0,
      decade3: 0,
      decade4: 0,
      decade5: 0,
    },
    highLow: {
      high: 0,
      low: 0,
    },
  };

  const bumpDecade = (n: number) => {
    if (n >= 1 && n <= 10) result.decades.decade1++;
    else if (n <= 20) result.decades.decade2++;
    else if (n <= 30) result.decades.decade3++;
    else if (n <= 40) result.decades.decade4++;
    else if (n <= 50) result.decades.decade5++;
  };

  const bumpHighLow = (n: number) => {
    if (n >= 1 && n <= 25) result.highLow.low++;
    else if (n >= 26 && n <= 50) result.highLow.high++;
  };

  for (const row of data) {
    const numbers = [
      row.nummer1,
      row.nummer2,
      row.nummer3,
      row.nummer4,
      row.nummer5,
    ];

    for (const number of numbers) {
      bumpDecade(number);
      bumpHighLow(number);
    }
  }

  return result;
}
