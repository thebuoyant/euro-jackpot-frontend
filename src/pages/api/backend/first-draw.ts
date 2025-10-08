import type { NextApiRequest, NextApiResponse } from "next";
import { handleGetFirstDrawData } from "src/app/_app-handlers/handleGetFirstDrawData";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const firstDrawRecord = handleGetFirstDrawData();

  return res.status(200).json({ firstDrawRecord });
}
