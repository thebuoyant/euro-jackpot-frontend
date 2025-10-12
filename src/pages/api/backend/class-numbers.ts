import type { NextApiRequest, NextApiResponse } from "next";
import { handleGetClassNumbers } from "src/app/_app-handlers/handleGetClassNumbers";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const raw = Array.isArray(req.query.numbersClass)
    ? req.query.numbersClass[0]
    : req.query.numbersClass;

  const numbersClass = Number.parseInt(raw ?? "", 10);

  if (
    !Number.isInteger(numbersClass) ||
    numbersClass < 1 ||
    numbersClass > 12
  ) {
    return res
      .status(400)
      .json({ error: "Invalid 'numbersClass'. Expected integer 1..12." });
  }

  try {
    const data = handleGetClassNumbers(numbersClass);
    return res.status(200).json({ data });
  } catch (err) {
    if (process.env.NODE_ENV !== "production") console.error(err);
    return res.status(500).json({ error: "Failed to load class numbers." });
  }
}
