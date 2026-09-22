import type { StatusField } from "@/features/status/schemas/status-field";

export interface StatusRow {
  label: StatusField;
  value: string;
}

export interface StatusCardProps {
  fields: readonly StatusField[];
}
