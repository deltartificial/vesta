import { memo, useCallback } from "react";
import { useShallow } from "zustand/react/shallow";
import { Button } from "@/components/ui/button";
import { useCounterStore } from "@/features/counter/store/counter-store";
import type { CounterProps } from "@/features/counter/types/counter";

export const Counter = memo(function Counter({ step }: CounterProps) {
  const { count, increment, decrement, reset } = useCounterStore(
    useShallow((s) => ({
      count: s.count,
      increment: s.increment,
      decrement: s.decrement,
      reset: s.reset,
    })),
  );

  const onIncrement = useCallback(() => increment(step), [increment, step]);
  const onDecrement = useCallback(() => decrement(step), [decrement, step]);

  return (
    <div className="flex items-center gap-2 font-mono">
      <Button onClick={onDecrement} aria-label="decrement">
        −
      </Button>
      <span className="min-w-[3ch] text-center text-base tabular-nums text-neutral-100">
        {count}
      </span>
      <Button onClick={onIncrement} aria-label="increment">
        +
      </Button>
      <Button onClick={reset} className="ml-2 text-xs text-neutral-500" aria-label="reset">
        reset
      </Button>
    </div>
  );
});
