import { create } from "zustand";
import { WinningNumbersCount } from "../_app-handlers/handleCountWinningNumbers";

export type WinningNumbersItem = { number: number; count: number };

type State = {
  isLoadingWinningNumbers: boolean;
  setIsLoadingWinningNumbers: (receivedValue: boolean) => void;

  winningNumbersCounts: WinningNumbersCount[];
  setWinningNumbersCounts: (receivedValue: WinningNumbersCount[]) => void;
};

export const useWinningNumbersStore = create<State>((set) => ({
  isLoadingWinningNumbers: false,
  setIsLoadingWinningNumbers: (receivedValue) =>
    set({ isLoadingWinningNumbers: receivedValue }),

  winningNumbersCounts: [],
  setWinningNumbersCounts: (receivedValues) =>
    set({ winningNumbersCounts: receivedValues }),
}));
