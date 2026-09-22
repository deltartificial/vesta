import { create } from "zustand";

interface CounterState {
  count: number;
  increment: (step: number) => void;
  decrement: (step: number) => void;
  reset: () => void;
}

export const useCounterStore = create<CounterState>((set) => ({
  count: 0,
  increment: (step) => set((s) => ({ count: s.count + step })),
  decrement: (step) => set((s) => ({ count: s.count - step })),
  reset: () => set({ count: 0 }),
}));
