import { useQuery } from "@tanstack/react-query";
import { apiGet } from "./client";
import type { ActionCenterItem } from "@shared/entities";

export function useActionCenter() {
  return useQuery({
    queryKey: ["action-center"],
    queryFn: () => apiGet<ActionCenterItem[]>("/action-center"),
    refetchInterval: 30000,
  });
}
