import { create } from "zustand";
import {
  DrawRecord,
  TWinningNumbersCountsResponse,
} from "../_app-types/record.types";

export const useDashboardStore = create((set) => ({
  isLoadingLastDrawData: false as boolean,
  setIsLoadingLastDrawData: (receivedValue: boolean) =>
    set(() => ({ isLoadingLastDrawData: receivedValue })),

  lastDrawRecord: null as DrawRecord | null,
  setLastDrawRecord: (receivedValue: DrawRecord | null) =>
    set(() => ({ lastDrawRecord: receivedValue })),

  isLoadingFirstDrawData: false as boolean,
  setIsLoadingFirstDrawData: (receivedValue: boolean) =>
    set(() => ({ isLoadingFirstDrawData: receivedValue })),

  firstDrawRecord: null as DrawRecord | null,
  setFirstDrawRecord: (receivedValue: DrawRecord | null) =>
    set(() => ({ firstDrawRecord: receivedValue })),

  records: [] as DrawRecord[],
  setRecords: (receivedValue: DrawRecord[]) =>
    set(() => ({ records: receivedValue })),

  isLoadingStakeData: false as boolean,
  setIsLoadingStakeData: (receivedValue: boolean) =>
    set(() => ({ isLoadingStakeData: receivedValue })),

  topWinningNumbersCounts: [] as TWinningNumbersCountsResponse[],
  setTopWinningNumbersCounts: (
    receivedValue: TWinningNumbersCountsResponse[]
  ) => set({ topWinningNumbersCounts: receivedValue }),
}));
