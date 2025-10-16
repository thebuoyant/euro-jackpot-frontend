"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Tip = {
  id: number;
  numbers: number[]; // 5 aus 1..50
  euroNumbers: number[]; // 2 aus 1..12
};

export const MAX_TIPS = 12;
export const N_MAIN = 5;
export const N_EURO = 2;
export const MAIN_MIN = 1;
export const MAIN_MAX = 50;
export const EURO_MIN = 1;
export const EURO_MAX = 12;
export const LS_KEY = "eurojackpot.tips.v1";

function emptyTip(id: number): Tip {
  return { id, numbers: [], euroNumbers: [] };
}

function uniqueRandomSet(count: number, min: number, max: number): number[] {
  const out: number[] = [];
  while (out.length < count) {
    const n = Math.floor(Math.random() * (max - min + 1)) + min;
    if (!out.includes(n)) out.push(n);
  }
  out.sort((a, b) => a - b);
  return out;
}

function randomTip(id: number): Tip {
  const numbers = uniqueRandomSet(N_MAIN, MAIN_MIN, MAIN_MAX);
  const euroNumbers = uniqueRandomSet(N_EURO, EURO_MIN, EURO_MAX);
  return { id, numbers, euroNumbers };
}

type State = {
  tips: Tip[];
  setTip: (
    id: number,
    next: { numbers: number[]; euroNumbers: number[] }
  ) => void;
  randomizeTip: (id: number) => void;
  resetTip: (id: number) => void;
  replaceAll: (tips: Tip[]) => void;
};

export const useTipsStore = create<State>()(
  persist(
    (set, get) => ({
      tips: Array.from({ length: MAX_TIPS }, (_, i) => emptyTip(i + 1)),
      setTip: (id, next) => {
        set((s) => {
          const idx = id - 1;
          const clone = [...s.tips];
          const nums = Array.from(new Set(next.numbers))
            .filter(
              (n) => Number.isInteger(n) && n >= MAIN_MIN && n <= MAIN_MAX
            )
            .slice(0, N_MAIN)
            .sort((a, b) => a - b);
          const euros = Array.from(new Set(next.euroNumbers))
            .filter(
              (n) => Number.isInteger(n) && n >= EURO_MIN && n <= EURO_MAX
            )
            .slice(0, N_EURO)
            .sort((a, b) => a - b);
          clone[idx] = { ...clone[idx], numbers: nums, euroNumbers: euros };
          return { tips: clone };
        });
      },
      randomizeTip: (id) => {
        set((s) => {
          const idx = id - 1;
          const clone = [...s.tips];
          clone[idx] = randomTip(id);
          return { tips: clone };
        });
      },
      resetTip: (id) => {
        set((s) => {
          const idx = id - 1;
          const clone = [...s.tips];
          clone[idx] = emptyTip(id);
          return { tips: clone };
        });
      },
      replaceAll: (tips) => set({ tips }),
    }),
    { name: LS_KEY }
  )
);
