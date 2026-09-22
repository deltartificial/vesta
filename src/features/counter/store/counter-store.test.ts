import { beforeEach, describe, expect, it } from "vitest";
import { useCounterStore } from "@/features/counter/store/counter-store";

describe("counterStore", () => {
  beforeEach(() => {
    useCounterStore.setState({ count: 0 });
  });

  it("starts at 0", () => {
    expect(useCounterStore.getState().count).toBe(0);
  });

  it("increments and decrements by the given step", () => {
    const { increment, decrement } = useCounterStore.getState();
    increment(1);
    increment(3);
    expect(useCounterStore.getState().count).toBe(4);
    decrement(2);
    expect(useCounterStore.getState().count).toBe(2);
  });

  it("resets to 0", () => {
    const { increment, reset } = useCounterStore.getState();
    increment(5);
    reset();
    expect(useCounterStore.getState().count).toBe(0);
  });
});
