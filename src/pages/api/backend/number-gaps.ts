import type { NextApiRequest, NextApiResponse } from "next";
import { handleGetNumberGaps } from "src/app/_app-handlers/handleGetNumberGaps";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const data = handleGetNumberGaps(); // immer alles
  return res.status(200).json({ data });
}
