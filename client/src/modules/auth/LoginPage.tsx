import { useEffect, useState, type FormEvent } from "react";
import { PASSWORD_RESET_REQUESTED_MESSAGE, type LoginMethods } from "@shared/auth";
import { fetchLoginMethods, useAuth } from "../../lib/auth/AuthContext";
import { BASE } from "../../lib/api/client";
import "./auth.css";

export function AuthCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="auth-screen">
      <div className="auth-card card">
        <img className="auth-logo" src="/branding/brand-lockup.png" alt="The Rameshwaram Café" />
        <div className="auth-product">Master Tracking</div>
        <h1 className="auth-title">{title}</h1>
        {subtitle && <p className="auth-sub">{subtitle}</p>}
        {children}
      </div>
    </div>
  );
}

function PasswordLogin({ onForgot }: { onForgot: () => void }) {
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await login(identifier.trim(), password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed.");
      setPassword("");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={submit} noValidate>
      <div className="field">
        <label htmlFor="login-username">Username or email</label>
        <input
          id="login-username"
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          required
          autoFocus
        />
      </div>
      <div className="field">
        <label htmlFor="login-password">Password</label>
        <input
          id="login-password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      {error && (
        <p className="auth-error" role="alert">
          {error}
        </p>
      )}
      <button className="btn primary auth-submit" type="submit" disabled={busy || !identifier.trim() || !password}>
        {busy ? "Signing in…" : "Log in"}
      </button>
      <button type="button" className="auth-link" onClick={onForgot}>
        Forgot password?
      </button>
    </form>
  );
}

/** Emails a password-reset link. The answer never says whether the address has an account. */
function ForgotPassword({ onBack }: { onBack: () => void }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await fetch(`${BASE}/auth/password/forgot`, {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error ?? "Something went wrong.");
      setMessage(body.message ?? PASSWORD_RESET_REQUESTED_MESSAGE);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={submit} noValidate>
      {message ? (
        <p className="auth-notice" role="status">
          {message} The link works once and expires after a while; check your spam folder if it doesn't arrive.
        </p>
      ) : (
        <>
          <div className="field">
            <label htmlFor="forgot-email">Registered email</label>
            <input
              id="forgot-email"
              type="email"
              autoComplete="email"
              autoCapitalize="none"
              spellCheck={false}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
            />
          </div>
          {error && <p className="auth-error" role="alert">{error}</p>}
          <button className="btn primary auth-submit" type="submit" disabled={busy || !email.trim()}>
            {busy ? "Sending…" : "Send reset link"}
          </button>
        </>
      )}
      <button type="button" className="btn auth-secondary" onClick={onBack}>
        Back to sign in
      </button>
    </form>
  );
}

/**
 * One-time-code sign-in (email or phone/WhatsApp). Only rendered when the
 * server reports the method as enabled (GET /api/auth/methods), which it
 * doesn't until AUTH_EMAIL_OTP_ENABLED / AUTH_PHONE_OTP_ENABLED are set.
 */
function OtpLogin({ channel, phoneChannel }: { channel: "email" | "phone"; phoneChannel: "sms" | "whatsapp" }) {
  const { reload } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [code, setCode] = useState("");
  const [sent, setSent] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function post(path: string, body: unknown) {
    const res = await fetch(`${BASE}/auth/otp/${path}`, {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json.error ?? "Something went wrong.");
    return json;
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (!sent) {
        const r = await post("request", { channel, identifier: identifier.trim() });
        setMessage(r.message ?? null);
        setSent(true);
      } else {
        await post("verify", { channel, identifier: identifier.trim(), code: code.trim() });
        await reload();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  const label = channel === "email" ? "Email" : phoneChannel === "whatsapp" ? "WhatsApp number" : "Mobile number";
  return (
    <form className="auth-form" onSubmit={submit} noValidate>
      <div className="field">
        <label htmlFor={`otp-${channel}`}>{label}</label>
        <input
          id={`otp-${channel}`}
          type={channel === "email" ? "email" : "tel"}
          placeholder={channel === "email" ? "you@example.com" : "+919876543210"}
          value={identifier}
          disabled={sent}
          onChange={(e) => setIdentifier(e.target.value)}
        />
      </div>
      {sent && (
        <div className="field">
          <label htmlFor={`otp-code-${channel}`}>Code</label>
          <input id={`otp-code-${channel}`} inputMode="numeric" autoComplete="one-time-code" value={code} onChange={(e) => setCode(e.target.value)} />
        </div>
      )}
      {message && <p className="auth-sub">{message}</p>}
      {error && <p className="auth-error" role="alert">{error}</p>}
      <button className="btn primary auth-submit" type="submit" disabled={busy || !identifier.trim() || (sent && !code.trim())}>
        {busy ? "Please wait…" : sent ? "Verify code" : "Send code"}
      </button>
    </form>
  );
}

export function LoginPage({ initialView = "signin" }: { initialView?: "signin" | "forgot" }) {
  const { notice } = useAuth();
  const [methods, setMethods] = useState<LoginMethods | null>(null);
  const [mode, setMode] = useState<"password" | "email" | "phone">("password");
  const [view, setView] = useState(initialView);

  useEffect(() => {
    void fetchLoginMethods().then(setMethods);
  }, []);

  const otpModes = [methods?.emailOtp && "email", methods?.phoneOtp && "phone"].filter(Boolean) as ("email" | "phone")[];

  if (view === "forgot") {
    return (
      <AuthCard title="Reset your password" subtitle="Enter the email address registered to your account and we'll email you a link to create a new password.">
        <ForgotPassword onBack={() => setView("signin")} />
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Sign in" subtitle="Use your username or registered email, and your password.">
      {notice && <p className="auth-notice" role="status">{notice}</p>}
      {otpModes.length > 0 && (
        <div className="auth-tabs" role="tablist">
          {(["password", ...otpModes] as const).map((m) => (
            <button key={m} role="tab" aria-selected={mode === m} className={`auth-tab${mode === m ? " active" : ""}`} onClick={() => setMode(m)}>
              {m === "password" ? "Password" : m === "email" ? "Email code" : methods?.phoneOtpChannel === "whatsapp" ? "WhatsApp code" : "SMS code"}
            </button>
          ))}
        </div>
      )}
      {mode === "password" ? <PasswordLogin onForgot={() => setView("forgot")} /> : <OtpLogin channel={mode} phoneChannel={methods?.phoneOtpChannel ?? "whatsapp"} />}
    </AuthCard>
  );
}
