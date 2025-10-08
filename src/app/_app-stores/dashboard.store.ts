import { create } from "zustand";
import { DrawRecord } from "../_app-types/record.types";

export const useDashboardStore = create((set) => ({
  isLoadingLastDrawData: false as boolean,
  setIsLoadingLastDrawData: (receivedValue: boolean) =>
    set(() => ({ isLoadingLastDrawData: receivedValue })),

  lastDrawRecord: null as DrawRecord | null,
  setLastDrawRecord: (receivedValue: DrawRecord | null) =>
    set(() => ({ lastDrawRecord: receivedValue })),
}));
