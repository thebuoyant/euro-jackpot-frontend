import type { NextApiRequest, NextApiResponse } from "next";
import { handleCountWinningNumbers } from "src/app/_app-handlers/handleCountWinningNumbers";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const raw = Array.isArray(req.query.sort)
      ? req.query.sort[0]
      : req.query.sort;

    const sorted: boolean =
      typeof raw === "string"
        ? ["true", "1", "yes", "on"].includes(raw.toLowerCase())
        : false;

    const records = handleCountWinningNumbers(sorted);
    return res.status(200).json({ records });
  } catch (err) {
    if (process.env.NODE_ENV !== "production") console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
