import { useState, type FormEvent } from "react";
import { MIN_PASSWORD_LENGTH } from "@shared/auth";
import { apiPost } from "../../lib/api/client";
import { useAuth } from "../../lib/auth/AuthContext";
import { AuthCard } from "./LoginPage";

/** Shown instead of the dashboard while the account still has an admin-issued temporary password. */
export function ChangePasswordPage() {
  const { user, reload, logout } = useAuth();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const mismatch = confirm.length > 0 && next !== confirm;
  const tooShort = next.length > 0 && next.length < MIN_PASSWORD_LENGTH;

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (mismatch || tooShort) return;
    setBusy(true);
    setError(null);
    try {
      await apiPost("/auth/change-password", { currentPassword: current, newPassword: next });
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
        {error && <p className="auth-error" role="alert">{error}</p>}
        <button className="btn primary auth-submit" type="submit" disabled={busy || !current || !next || next !== confirm || tooShort}>
          {busy ? "Saving…" : "Save password"}
        </button>
        <button type="button" className="btn auth-secondary" onClick={() => void logout()}>
          Sign out
        </button>
      </form>
    </AuthCard>
  );
}
