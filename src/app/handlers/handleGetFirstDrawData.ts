import { TRecord } from "../types/record.types";
import { handleReadJsonData } from "./handleReadJsonData";

export function handleGetFirstDrawData(): TRecord {
  const data = handleReadJsonData();
  if (!data.length) {
    throw new Error("No data available.");
  }
  return data[0];
}
