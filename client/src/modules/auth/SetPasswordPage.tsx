import { useState, type FormEvent } from "react";
import { MIN_PASSWORD_LENGTH } from "@shared/auth";
import { BASE } from "../../lib/api/client";
import { useAuth } from "../../lib/auth/AuthContext";
import type { PasswordLink } from "../../lib/auth/passwordLink";
import { AuthCard } from "./LoginPage";

const EXPIRED = "This link is invalid or has expired. Links work once and only for a limited time.";

/**
 * "Create your password" / "Create a new password", opened from an emailed
 * setup or reset link. The server checks the link and sets the password; the
 * user then signs in normally.
 */
export function SetPasswordPage({ link, onDone }: { link: PasswordLink; onDone: (next: "login" | "forgot") => void }) {
  const { logout } = useAuth();
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(link.failed ? EXPIRED : null);
  const [dead, setDead] = useState(Boolean(link.failed));
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  const isSetup = link.type === "invite";
  const mismatch = confirm.length > 0 && next !== confirm;
  const tooShort = next.length > 0 && next.length < MIN_PASSWORD_LENGTH;

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (mismatch || tooShort) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`${BASE}/auth/password/complete`, {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken: link.accessToken, tokenHash: link.tokenHash, type: link.type, password: next }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (body.code === "link_invalid") setDead(true);
        setError(body.code === "link_invalid" ? EXPIRED : body.error ?? "Could not save the password.");
        return;
      }
      // Any session this browser held has been ended server-side; clear its cookies too.
      await logout();
      setDone(true);
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <AuthCard title={isSetup ? "Your account is ready" : "Password changed"} subtitle="Sign in with your username or email and your new password.">
        <button className="btn primary auth-submit" onClick={() => onDone("login")}>
          Go to sign in
        </button>
      </AuthCard>
    );
  }

  if (dead) {
    return (
      <AuthCard title="Link not valid" subtitle={error ?? EXPIRED}>
        <div className="auth-form">
          <button className="btn primary auth-submit" onClick={() => onDone("forgot")}>
            Request a new link
          </button>
          <button className="btn auth-secondary" onClick={() => onDone("login")}>
            Back to sign in
          </button>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title={isSetup ? "Create your password" : "Create a new password"}
      subtitle={isSetup ? "Welcome! Choose the password you'll use to sign in to the dashboard." : "Choose a new password for your account."}
    >
      <form className="auth-form" onSubmit={submit} noValidate>
        <div className="field">
          <label htmlFor="sp-new">New password</label>
          <input id="sp-new" type="password" autoComplete="new-password" value={next} onChange={(e) => setNext(e.target.value)} autoFocus />
          <span className="auth-hint">At least {MIN_PASSWORD_LENGTH} characters.</span>
        </div>
        <div className="field">
          <label htmlFor="sp-confirm">Confirm new password</label>
          <input id="sp-confirm" type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        </div>
        {(mismatch || tooShort) && (
          <p className="auth-error" role="alert">
            {tooShort ? `Use at least ${MIN_PASSWORD_LENGTH} characters.` : "The two passwords don't match."}
          </p>
        )}
        {error && <p className="auth-error" role="alert">{error}</p>}
        <button className="btn primary auth-submit" type="submit" disabled={busy || !next || next !== confirm || tooShort}>
          {busy ? "Saving…" : "Save password"}
        </button>
      </form>
    </AuthCard>
  );
}
