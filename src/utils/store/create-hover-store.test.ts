import { describe, expect, it } from "vitest";
import { createHoverStore } from "@/utils/store/create-hover-store";

describe("createHoverStore", () => {
  it("starts with null and transitions through setHovered", () => {
    const useStore = createHoverStore<string>();
    const { setHovered } = useStore.getState();

    expect(useStore.getState().hovered).toBeNull();

    setHovered("alpha");
    expect(useStore.getState().hovered).toBe("alpha");

    setHovered(null);
    expect(useStore.getState().hovered).toBeNull();
  });

  it("creates independent stores per instance", () => {
    const a = createHoverStore<number>();
    const b = createHoverStore<number>();

    a.getState().setHovered(1);
    b.getState().setHovered(2);

    expect(a.getState().hovered).toBe(1);
    expect(b.getState().hovered).toBe(2);
  });
});
