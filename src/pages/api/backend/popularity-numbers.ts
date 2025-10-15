import type { NextApiRequest, NextApiResponse } from "next";
import { handleComputePopularityNumbers } from "src/app/_app-handlers/handleComputePopularity";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const raw = Array.isArray(req.query.ticketPrice)
    ? req.query.ticketPrice[0]
    : req.query.ticketPrice;

  const ticketPrice = Number.parseFloat(raw ?? "2.0");
  const { mainScores, euroScores } = handleComputePopularityNumbers(
    Number.isFinite(ticketPrice) && ticketPrice > 0 ? ticketPrice : 2.0
  );

  return res.status(200).json({ mainScores, euroScores });
}
