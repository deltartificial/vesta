import { useQuery } from "@tanstack/react-query";
import { getStatus } from "@/features/status/services/status";

export function useStatus() {
  return useQuery({
    queryKey: ["status"],
    queryFn: getStatus,
  });
}
