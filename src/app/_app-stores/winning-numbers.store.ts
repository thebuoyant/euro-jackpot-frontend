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

  isLoadingWinningNumbers123: boolean;
  setIsLoadingWinningNumbers123: (receivedValue: boolean) => void;

  winningNumbersCounts123: TWinningNumbersCountsResponse[];
  setWinningNumbersCounts123: (
    receivedValue: TWinningNumbersCountsResponse[]
  ) => void;

  showSortedValues123: boolean;
  setShowSortedValues123: (receivedValue: boolean) => void;
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

  isLoadingWinningNumbers123: false,
  setIsLoadingWinningNumbers123: (receivedValue) =>
    set({ isLoadingWinningNumbers123: receivedValue }),

  winningNumbersCounts123: [],
  setWinningNumbersCounts123: (receivedValue) =>
    set({ winningNumbersCounts123: receivedValue }),

  showSortedValues123: false,
  setShowSortedValues123: (receivedValue) =>
    set({ showSortedValues123: receivedValue }),
}));
