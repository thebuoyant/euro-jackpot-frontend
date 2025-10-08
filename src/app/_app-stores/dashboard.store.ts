import { create } from "zustand";
import { DrawRecord } from "../_app-types/record.types";

export const useDashboardStore = create((set) => ({
  isLoadingLastDrawDate: false as boolean,
  setIsLoadingLastDrawDate: (receivedValue: boolean) =>
    set(() => ({ isLoadingLastDrawDate: receivedValue })),

  lastDrawRecord: null as DrawRecord | null,
  setLastDrawRecord: (receivedValue: DrawRecord | null) =>
    set(() => ({ lastDrawRecord: receivedValue })),
}));
