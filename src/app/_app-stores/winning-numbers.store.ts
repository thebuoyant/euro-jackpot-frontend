import { create } from "zustand";

export type WinningNumbersItem = { number: number; count: number };

type State = {
  isLoadingWinningNumbers: boolean;
  setIsLoadingWinningNumbers: (receivedValue: boolean) => void;

  winningNumbersCounts: WinningNumbersItem[];
  setWinningNumbersCounts: (receivedValues: WinningNumbersItem[]) => void;
};

export const useWinningNumbersStore = create<State>((set) => ({
  isLoadingWinningNumbers: false,
  setIsLoadingWinningNumbers: (receivedValue) =>
    set({ isLoadingWinningNumbers: receivedValue }),

  winningNumbersCounts: [],
  setWinningNumbersCounts: (receivedValues) =>
    set({ winningNumbersCounts: receivedValues }),
}));
