import { create } from "zustand";
import { WinningNumbersCount } from "../_app-handlers/handleCountWinningNumbers";
import { TWinningNumbersCountsResponse } from "../_app-types/record.types";

export type WinningNumbersItem = { number: number; count: number };

type State = {
  isLoadingWinningNumbers: boolean;
  setIsLoadingWinningNumbers: (receivedValue: boolean) => void;

  winningNumbersCounts: TWinningNumbersCountsResponse[];
  setWinningNumbersCounts: (
    receivedValue: TWinningNumbersCountsResponse[]
  ) => void;
};

export const useWinningNumbersStore = create<State>((set) => ({
  isLoadingWinningNumbers: false,
  setIsLoadingWinningNumbers: (receivedValue) =>
    set({ isLoadingWinningNumbers: receivedValue }),

  winningNumbersCounts: [],
  setWinningNumbersCounts: (receivedValues) =>
    set({ winningNumbersCounts: receivedValues }),
}));
