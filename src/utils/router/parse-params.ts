import { notFound } from "@tanstack/react-router";
import type { z } from "zod";

export function parseParams<T extends z.ZodType>(schema: T) {
  return (raw: Record<string, string>): z.output<T> => {
    const result = schema.safeParse(raw);
    if (!result.success) throw notFound();
    return result.data;
  };
}
