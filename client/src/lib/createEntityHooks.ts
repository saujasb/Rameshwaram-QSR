import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiDelete, apiGet, apiPost, apiPut } from "./api/client";
import type { BaseRecord } from "@shared/entities";

export function createEntityHooks<T extends BaseRecord>(resource: string) {
  const listKey = [resource] as const;

  function useList() {
    return useQuery({ queryKey: listKey, queryFn: () => apiGet<T[]>(`/${resource}`) });
  }

  function useOne(id: string | undefined) {
    return useQuery({
      queryKey: [resource, id],
      queryFn: () => apiGet<T>(`/${resource}/${id}`),
      enabled: Boolean(id),
    });
  }

  function useCreate() {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: (data: Omit<T, keyof BaseRecord>) => apiPost<T>(`/${resource}`, data),
      onSuccess: () => qc.invalidateQueries({ queryKey: listKey }),
    });
  }

  function useUpdate() {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: ({ id, patch }: { id: string; patch: Partial<Omit<T, keyof BaseRecord>> }) =>
        apiPut<T>(`/${resource}/${id}`, patch),
      onSuccess: (_data, vars) => {
        qc.invalidateQueries({ queryKey: listKey });
        qc.invalidateQueries({ queryKey: [resource, vars.id] });
      },
    });
  }

  function useRemove() {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: (id: string) => apiDelete(`/${resource}/${id}`),
      onSuccess: () => qc.invalidateQueries({ queryKey: listKey }),
    });
  }

  function useAction<R = T>(action: string) {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: ({ id, body }: { id: string; body?: unknown }) =>
        apiPost<R>(`/${resource}/${id}/${action}`, body),
      onSuccess: () => qc.invalidateQueries({ queryKey: listKey }),
    });
  }

  return { listKey, useList, useOne, useCreate, useUpdate, useRemove, useAction };
}
