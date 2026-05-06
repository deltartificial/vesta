import { beforeEach, describe, expect, it } from "vitest";
import { useCounterStore } from "@/store/counter/counter-store";

describe("counterStore", () => {
  beforeEach(() => {
    useCounterStore.setState({ count: 0 });
  });

  it("starts at 0", () => {
    expect(useCounterStore.getState().count).toBe(0);
  });

  it("increments and decrements", () => {
    const { increment, decrement } = useCounterStore.getState();
    increment();
    increment();
    expect(useCounterStore.getState().count).toBe(2);
    decrement();
    expect(useCounterStore.getState().count).toBe(1);
  });

  it("resets to 0", () => {
    const { increment, reset } = useCounterStore.getState();
    increment();
    increment();
    increment();
    reset();
    expect(useCounterStore.getState().count).toBe(0);
  });
});
