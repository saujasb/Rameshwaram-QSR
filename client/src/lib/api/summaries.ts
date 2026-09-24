import { useMutation, useQuery } from "@tanstack/react-query";
import type { SummaryChannel, SummaryChannelStatus, SummaryDeliveryResult, SummaryPreview, SummaryScope } from "@shared/summary";
import { ApiError, apiGet, apiPost } from "./client";

export function useSummaryChannels(enabled: boolean) {
  return useQuery({
    queryKey: ["summary-channels"],
    queryFn: () => apiGet<SummaryChannelStatus[]>("/summaries/channels"),
    enabled,
  });
}

export function useSummaryPreview(scope: SummaryScope, enabled: boolean) {
  return useQuery({
    queryKey: ["summary-preview", scope.from, scope.to],
    queryFn: () => apiPost<SummaryPreview>("/summaries/preview", scope),
    enabled,
  });
}

/** The server answers 409 for "not configured" / "no destination" -- those are results to show, not crashes. */
export function useDeliverSummary() {
  return useMutation({
    mutationFn: async (input: SummaryScope & { channel: SummaryChannel }): Promise<SummaryDeliveryResult> => {
      try {
        return await apiPost<SummaryDeliveryResult>("/summaries/deliver", input);
      } catch (err) {
        if (err instanceof ApiError && (err.status === 409 || err.status === 502)) {
          return { status: err.status === 409 ? "not_configured" : "failed", message: err.message };
        }
        throw err;
      }
    },
  });
}
