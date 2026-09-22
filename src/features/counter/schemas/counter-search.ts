import { z } from "zod";
import { COUNTER_STEP } from "@/features/counter/constants/counter";

export const CounterSearch = z.object({
  step: z
    .number()
    .int()
    .min(COUNTER_STEP.min)
    .max(COUNTER_STEP.max)
    .default(COUNTER_STEP.default)
    .catch(COUNTER_STEP.default),
});

export type CounterSearch = z.infer<typeof CounterSearch>;
