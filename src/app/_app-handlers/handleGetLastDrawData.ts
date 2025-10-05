import { TRecord } from "../_app-types/record.types";
import { handleReadJsonData } from "./handleReadJsonData";

export function handleGetLastDrawData(): TRecord {
  const data = handleReadJsonData();
  if (!data.length) {
    throw new Error("No data available.");
  }
  return data[data.length - 1];
}
