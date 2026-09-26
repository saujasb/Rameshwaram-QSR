import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { AuthUser, LoginMethods, Permission } from "@shared/auth";
import { ApiError, BASE, onSessionEnded } from "../api/client";

type Status = "loading" | "signed-out" | "signed-in";

interface AuthState {
  status: Status;
  user: AuthUser | null;
  /** UI convenience only -- the server enforces every permission independently. */
  can: (permission: Permission) => boolean;
  /** `identifier` is a username or a registered email address. */
  login: (identifier: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  reload: () => Promise<void>;
  /** Set when the session ended on its own (expiry / deactivation), to explain the login screen. */
  notice: string | null;
}

const AuthContext = createContext<AuthState | null>(null);

async function readJson(res: Response): Promise<Record<string, unknown>> {
  return res.json().catch(() => ({}));
}

async function fetchMe(): Promise<AuthUser | null> {
  const res = await fetch(`${BASE}/auth/me`, { credentials: "same-origin" });
  if (res.status === 401) {
    // Access token missing/expired: one refresh attempt before giving up.
    const refreshed = await fetch(`${BASE}/auth/refresh`, { method: "POST", credentials: "same-origin" });
    if (!refreshed.ok) return null;
    const body = await readJson(refreshed);
    return (body.user as AuthUser) ?? null;
  }
  if (res.status === 403) return null;
  if (!res.ok) throw new ApiError("Could not reach the server.", res.status);
  const body = await readJson(res);
  return (body.user as AuthUser) ?? null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<Status>("loading");
  const [user, setUser] = useState<AuthUser | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const signedOut = useCallback(
    (message: string | null) => {
      setUser(null);
      setStatus("signed-out");
      setNotice(message);
      // Drop every cached API response so nothing from the previous session lingers.
      queryClient.clear();
    },
    [queryClient]
  );

  const reload = useCallback(async () => {
    try {
      const me = await fetchMe();
      if (me) {
        setUser(me);
        setStatus("signed-in");
      } else {
        signedOut(null);
      }
    } catch {
      // Server unreachable: show login rather than a half-loaded dashboard.
      signedOut("Couldn't reach the server. Check your connection and sign in again.");
    }
  }, [signedOut]);

  useEffect(() => {
    void reload();
  }, [reload]);

  useEffect(
    () =>
      onSessionEnded(() => {
        if (status === "signed-in") signedOut("Your session ended. Please sign in again.");
      }),
    [status, signedOut]
  );

  const login = useCallback(async (identifier: string, password: string) => {
    const res = await fetch(`${BASE}/auth/login`, {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, password }),
    });
    const body = await readJson(res);
    if (!res.ok) throw new ApiError((body.error as string) ?? "Sign-in failed.", res.status);
    queryClient.clear();
    setUser(body.user as AuthUser);
    setNotice(null);
    setStatus("signed-in");
  }, [queryClient]);

  const logout = useCallback(async () => {
    await fetch(`${BASE}/auth/logout`, { method: "POST", credentials: "same-origin" }).catch(() => {});
    signedOut(null);
  }, [signedOut]);

  const value = useMemo<AuthState>(
    () => ({
      status,
      user,
      notice,
      can: (permission) => Boolean(user?.permissions.includes(permission)),
      login,
      logout,
      reload,
    }),
    [status, user, notice, login, logout, reload]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

export async function fetchLoginMethods(): Promise<LoginMethods> {
  const res = await fetch(`${BASE}/auth/methods`, { credentials: "same-origin" });
  if (!res.ok) return { password: true, emailOtp: false, phoneOtp: false, phoneOtpChannel: "whatsapp" };
  return res.json();
}
