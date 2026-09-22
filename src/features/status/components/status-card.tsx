import { memo } from "react";
import { useStatus } from "@/features/status/hooks/use-status";
import type { StatusCardProps, StatusRow } from "@/features/status/types/status";
import { formatVersion } from "@/utils/format/format-version";

export const StatusCard = memo(function StatusCard({ fields }: StatusCardProps) {
  const { data, isLoading, isError } = useStatus();

  const rows: StatusRow[] =
    data == null
      ? []
      : fields.map((field) => ({
          label: field,
          value: field === "version" ? formatVersion(data.version) : data.status,
        }));

  return (
    <div className="w-full max-w-sm rounded-sm border border-neutral-800 bg-neutral-900/40 p-4 font-mono text-sm">
      {isLoading ? <div className="text-neutral-500">loading…</div> : null}
      {isError ? <div className="text-red-400">unavailable</div> : null}
      {!isLoading && !isError ? (
        <ul className="space-y-1.5">
          {rows.map((row) => (
            <li key={row.label} className="flex items-baseline justify-between gap-4">
              <span className="text-neutral-500">{row.label}</span>
              <span className="text-neutral-100">{row.value}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
});
