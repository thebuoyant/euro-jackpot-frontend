import type { NextApiRequest, NextApiResponse } from "next";
import { handleReadJsonData } from "src/app/_app-handlers/handleReadJsonData";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const raw = Array.isArray(req.query.numberOfResults)
    ? req.query.numberOfResults[0]
    : req.query.numberOfResults;
  const numberOfResults = Number.parseInt(raw ?? "0", 10);
  const records = handleReadJsonData(numberOfResults).reverse();

  return res.status(200).json({ records });
}
