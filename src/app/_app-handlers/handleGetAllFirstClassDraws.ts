import { TRecord } from "../_app-types/record.types";
import { handleReadJsonData } from "./handleReadJsonData";

export function handleGetAllFirstClassDraws(limit = 0): TRecord[] {
  const data = handleReadJsonData(0);
  const filtered = data.filter((record) => Number(record.anzahlKlasse1) > 0);

  return limit > 0 ? filtered.slice(0, limit) : filtered;
}
