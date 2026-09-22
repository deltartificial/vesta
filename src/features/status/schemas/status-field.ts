import { z } from "zod";

export const StatusField = z.enum(["status", "version"]);

export type StatusField = z.infer<typeof StatusField>;

export const StatusFieldParams = z.object({
  field: StatusField,
});
