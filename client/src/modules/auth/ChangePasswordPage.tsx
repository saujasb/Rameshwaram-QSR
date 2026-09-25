import { useState, type FormEvent } from "react";
import { MIN_PASSWORD_LENGTH, USERNAME_PATTERN } from "@shared/auth";
import { apiPost } from "../../lib/api/client";
import { useAuth } from "../../lib/auth/AuthContext";
import { AuthCard } from "./LoginPage";

/** Shown instead of the dashboard while the account still has an admin-issued temporary password. */
export function ChangePasswordPage() {
  const { user, reload, logout } = useAuth();
  // Admins may pick their own username at this first-login step (server-enforced).
  const canRename = user?.role === "admin";
  const [username, setUsername] = useState(user?.username ?? "");
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const mismatch = confirm.length > 0 && next !== confirm;
  const tooShort = next.length > 0 && next.length < MIN_PASSWORD_LENGTH;
  const badUsername = canRename && !USERNAME_PATTERN.test(username.trim().toLowerCase());

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (mismatch || tooShort || badUsername) return;
    setBusy(true);
    setError(null);
    try {
      await apiPost("/auth/change-password", {
        currentPassword: current,
        newPassword: next,
        ...(canRename ? { newUsername: username.trim().toLowerCase() } : {}),
      });
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not change the password.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthCard
      title="Set your password"
      subtitle={`Hi ${user?.fullName || user?.username}. You signed in with a temporary password — choose your own to continue.`}
    >
      <form className="auth-form" onSubmit={submit} noValidate>
        {canRename && (
          <div className="field">
            <label htmlFor="cp-username">Username</label>
            <input
              id="cp-username"
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase())}
            />
            <span className="auth-hint">
              You can choose your own username now; it can't be changed later. 3–32 characters: a–z, 0–9, dot, dash, underscore.
            </span>
          </div>
        )}
        <div className="field">
          <label htmlFor="cp-current">Temporary password</label>
          <input id="cp-current" type="password" autoComplete="current-password" value={current} onChange={(e) => setCurrent(e.target.value)} autoFocus />
        </div>
        <div className="field">
          <label htmlFor="cp-new">New password</label>
          <input id="cp-new" type="password" autoComplete="new-password" value={next} onChange={(e) => setNext(e.target.value)} />
          <span className="auth-hint">At least {MIN_PASSWORD_LENGTH} characters.</span>
        </div>
        <div className="field">
          <label htmlFor="cp-confirm">Confirm new password</label>
          <input id="cp-confirm" type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        </div>
        {(mismatch || tooShort) && (
          <p className="auth-error" role="alert">
            {tooShort ? `Use at least ${MIN_PASSWORD_LENGTH} characters.` : "The two new passwords don't match."}
          </p>
        )}
        {badUsername && username.length > 0 && (
          <p className="auth-error" role="alert">
            Username must be 3–32 characters: lowercase letters, numbers, dot, dash or underscore.
          </p>
        )}
        {error && <p className="auth-error" role="alert">{error}</p>}
        <button className="btn primary auth-submit" type="submit" disabled={busy || !current || !next || next !== confirm || tooShort || badUsername}>
          {busy ? "Saving…" : "Save password"}
        </button>
        <button type="button" className="btn auth-secondary" onClick={() => void logout()}>
          Sign out
        </button>
      </form>
    </AuthCard>
  );
}
