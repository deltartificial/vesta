import { memo } from "react";
import { useShallow } from "zustand/react/shallow";
import { Button } from "@/components/ui/button";
import { useCounterStore } from "@/store/counter/counter-store";

export const Counter = memo(function Counter() {
  const { count, increment, decrement, reset } = useCounterStore(
    useShallow((s) => ({
      count: s.count,
      increment: s.increment,
      decrement: s.decrement,
      reset: s.reset,
    })),
  );

  return (
    <div className="flex items-center gap-2 font-mono">
      <Button onClick={decrement} aria-label="decrement">
        −
      </Button>
      <span className="min-w-[3ch] text-center text-base tabular-nums text-neutral-100">
        {count}
      </span>
      <Button onClick={increment} aria-label="increment">
        +
      </Button>
      <Button onClick={reset} className="ml-2 text-xs text-neutral-500" aria-label="reset">
        reset
      </Button>
    </div>
  );
});
