import { create } from "zustand";
import { DrawRecord } from "../_app-types/record.types";

export const useDrawDetailsStore = create((set) => ({
  isOpen: false as boolean,
  setIsOpen: (receivedValue: boolean) => set(() => ({ isOpen: receivedValue })),

  drawRecord: null as DrawRecord | null,
  setDrawRecord: (receivedValue: DrawRecord | null) =>
    set(() => ({ drawRecord: receivedValue })),
}));
