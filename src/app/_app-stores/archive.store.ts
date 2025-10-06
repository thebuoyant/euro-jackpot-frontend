import { create } from "zustand";
import { DrawRecord } from "../_app-types/record.types";

export const useArchiveStore = create((set) => ({
  isLoading: false as boolean,
  setIsLoading: (receivedValue: boolean) =>
    set(() => ({ isLoading: receivedValue })),

  records: [] as DrawRecord[],
  setRecords: (receivedValue: DrawRecord[]) =>
    set(() => ({ records: receivedValue })),

  numberOfResults: 0 as number,
  setNumberOfResults: (receivedValue: number) =>
    set(() => ({ numberOfResults: receivedValue })),
}));
