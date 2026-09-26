import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateUserInput, ManagedUser, UpdateUserInput } from "@shared/auth";
import { apiGet, apiPatch, apiPost } from "./client";

const KEY = ["managed-users"];

export function useManagedUsers() {
  return useQuery({ queryKey: KEY, queryFn: () => apiGet<ManagedUser[]>("/users") });
}

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateUserInput) => apiPost<ManagedUser>("/users", input),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...patch }: UpdateUserInput & { id: string }) => apiPatch<ManagedUser>(`/users/${id}`, patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useResetUserPassword() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, password }: { id: string; password: string }) => apiPost<{ ok: true }>(`/users/${id}/reset-password`, { password }),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

/** Emails the user a one-time link to set their password (setup link if never accepted, otherwise a reset link). */
export function useSendPasswordLink() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: string }) => apiPost<{ ok: true; kind: "invite" | "recovery" }>(`/users/${id}/send-password-link`),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}
