import type { NextApiRequest, NextApiResponse } from "next";
import { handleGetClassQuota } from "src/app/_app-handlers/handleGetClassQuota";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const raw = Array.isArray(req.query.quotaClass)
    ? req.query.quotaClass[0]
    : req.query.quotaClass;

  const quotaClass = Number.parseInt(raw ?? "", 10);

  if (!Number.isInteger(quotaClass) || quotaClass < 1 || quotaClass > 12) {
    return res
      .status(400)
      .json({ error: "Invalid 'quotaClass'. Expected integer 1..12." });
  }

  try {
    const data = handleGetClassQuota(quotaClass);
    return res.status(200).json({ data });
  } catch (err) {
    if (process.env.NODE_ENV !== "production") console.error(err);
    return res.status(500).json({ error: "Failed to load class quota." });
  }
}
