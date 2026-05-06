import { create } from "zustand";

interface HoverStoreState<T> {
  hovered: T | null;
  setHovered: (value: T | null) => void;
}

export function createHoverStore<T>() {
  return create<HoverStoreState<T>>((set) => ({
    hovered: null,
    setHovered: (value) => set({ hovered: value }),
  }));
}
