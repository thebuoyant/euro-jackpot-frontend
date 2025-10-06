import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const raw = Array.isArray(req.query.numberOfResults)
    ? req.query.numberOfResults[0]
    : req.query.numberOfResults;

  let numberOfResults = Number.parseInt(raw ?? "5", 10);
  if (Number.isNaN(numberOfResults)) numberOfResults = 5;
  numberOfResults = Math.min(Math.max(numberOfResults, 1), 100);

  const items = Array.from({ length: numberOfResults }, (_, i) => ({
    id: i + 1,
    title: `Item ${i + 1}`,
  }));

  return res.status(200).json({ count: items.length, items });
}
