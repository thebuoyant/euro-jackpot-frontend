import { create } from "zustand";
import { TWinningNumbersCountsResponse } from "../_app-types/record.types";

export type WinningNumbersItem = { number: number; count: number };

type State = {
  isLoadingWinningNumbers: boolean;
  setIsLoadingWinningNumbers: (receivedValue: boolean) => void;

  winningNumbersCounts: TWinningNumbersCountsResponse[];
  setWinningNumbersCounts: (
    receivedValue: TWinningNumbersCountsResponse[]
  ) => void;

  showSortedValues: boolean;
  setShowSortedValues: (receivedValue: boolean) => void;
};

export const useWinningNumbersStore = create<State>((set) => ({
  isLoadingWinningNumbers: false,
  setIsLoadingWinningNumbers: (receivedValue) =>
    set({ isLoadingWinningNumbers: receivedValue }),

  winningNumbersCounts: [],
  setWinningNumbersCounts: (receivedValue) =>
    set({ winningNumbersCounts: receivedValue }),

  showSortedValues: false,
  setShowSortedValues: (receivedValue) =>
    set({ showSortedValues: receivedValue }),
}));
