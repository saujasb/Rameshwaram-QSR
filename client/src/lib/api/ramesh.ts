import { useMutation, useQuery } from "@tanstack/react-query";
import { apiGet, apiPost } from "./client";
import type { RameshAnswer, RameshQuery } from "@shared/ramesh";

export function useAskRamesh() {
  return useMutation({
    mutationFn: (query: RameshQuery) => apiPost<RameshAnswer>("/ramesh/ask", query),
  });
}

/** Starter questions Ramesh can actually answer from the data currently loaded. */
export function useRameshSuggestions() {
  return useQuery({
    queryKey: ["ramesh-suggestions"],
    queryFn: () => apiGet<{ suggestions: string[]; hasData: boolean }>("/ramesh/suggestions"),
  });
}
