import { TRecord, RawRecord } from "../_app-types/record.types";
import { handleRecordMapping } from "../_app-utils/record-mapping.util";
import { sortByDateAsc } from "../_app-utils/sort-by-date.util";
import JsonDataFromCsv from "../_app-data/data.json";

export function handleReadJsonData(limit = 0): TRecord[] {
  const src = (
    Array.isArray(JsonDataFromCsv) ? JsonDataFromCsv : []
  ) as RawRecord[];

  const ordered = sortByDateAsc(src);
  const data = handleRecordMapping(ordered);

  return limit > 0 ? data.slice(0, limit) : data;
}
