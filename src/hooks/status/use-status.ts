import { useQuery } from "@tanstack/react-query";
import { getStatus } from "@/services/status";

export function useStatus() {
  return useQuery({
    queryKey: ["status"],
    queryFn: getStatus,
  });
}
