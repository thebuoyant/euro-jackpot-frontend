import type { NextApiRequest, NextApiResponse } from "next";
import { handleGetPrizeClassesSummary } from "src/app/_app-handlers/handleGetPrizeClassesSummary";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const summary = handleGetPrizeClassesSummary();
    return res.status(200).json({ summary });
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.error(err);
    }
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
