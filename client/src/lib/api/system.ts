import { useQuery } from "@tanstack/react-query";
import { apiGet } from "./client";

/** Cheap connectivity probe for the "● Live" indicator in the app header. */
export function useHealthCheck() {
  return useQuery({
    queryKey: ["health"],
    queryFn: () => apiGet<{ ok: boolean }>("/health"),
    refetchInterval: 30000,
    retry: 1,
    staleTime: 15000,
  });
}
