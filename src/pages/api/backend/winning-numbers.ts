import type { NextApiRequest, NextApiResponse } from "next";
import { handleCountWinningNumbers } from "src/app/_app-handlers/handleCountWinningNumbers";

export type WinningNumbersCount = Map<number, number>;
export type WinningNumbersItem = { key: number; value: number };

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const raw = req.query["sortedValues"];
    const sorted =
      typeof raw === "string"
        ? ["true", "1", "yes", "on"].includes(raw.toLowerCase())
        : false;

    const records: WinningNumbersCount = handleCountWinningNumbers(sorted);

    // Map -> Array<{ key, value }>
    const data: WinningNumbersItem[] = Array.from(records, ([key, value]) => ({
      key,
      value,
    }));

    return res.status(200).json({ data }); // nicht doppelt stringifien
  } catch (err) {
    if (process.env.NODE_ENV !== "production") console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
