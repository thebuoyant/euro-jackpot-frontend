import type { NextApiRequest, NextApiResponse } from "next";
import { handleGetSpecialData } from "src/app/_app-handlers/handleGetSpecialData";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const specialData = handleGetSpecialData();

  return res.status(200).json({ specialData });
}
