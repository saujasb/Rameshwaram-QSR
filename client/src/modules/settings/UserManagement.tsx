import { useState, type FormEvent } from "react";
import {
  ROLE_DESCRIPTIONS,
  ROLE_LABELS,
  ROLES,
  type ManagedUser,
  type Role,
} from "@shared/auth";
import { Modal } from "../../components/Modal";
import { useAuth } from "../../lib/auth/AuthContext";
import { useCreateUser, useManagedUsers, useResetUserPassword, useSendPasswordLink, useUpdateUser } from "../../lib/api/users";

const MUTED = { color: "var(--muted)", fontSize: 12.5 } as const;

function formatWhen(iso: string | null): string {
  if (!iso) return "Never";
  return new Date(iso).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

/** Fallback only (e.g. email not working): a readable random temporary password; the user must change it at first sign-in. */
function generateTempPassword(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  const bytes = new Uint32Array(14);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
}

function RoleSelect({ value, onChange, disabled, id }: { value: Role; onChange: (r: Role) => void; disabled?: boolean; id: string }) {
  return (
    <>
      <select id={id} value={value} disabled={disabled} onChange={(e) => onChange(e.target.value as Role)}>
        {ROLES.map((r) => (
          <option key={r} value={r}>
            {ROLE_LABELS[r]}
          </option>
        ))}
      </select>
      <span style={MUTED}>{ROLE_DESCRIPTIONS[value]}</span>
    </>
  );
}

function UserForm({ user, onDone }: { user?: ManagedUser; onDone: () => void }) {
  const { user: me } = useAuth();
  const create = useCreateUser();
  const update = useUpdateUser();
  const isSelf = user?.id === me?.id;

  const [username, setUsername] = useState(user?.username ?? "");
  const [fullName, setFullName] = useState(user?.fullName ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [role, setRole] = useState<Role>(user?.role ?? "staff");
  const [created, setCreated] = useState<{ username: string; email: string; tempPassword: string | null } | null>(null);
  // Fallback when email delivery isn't working: an admin-issued temporary password.
  const [useTemp, setUseTemp] = useState(false);
  const [tempPassword] = useState(generateTempPassword);

  const mutation = user ? update : create;

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (user) {
      await update.mutateAsync({ id: user.id, fullName, email: email.trim(), phone: phone.trim() || null, ...(isSelf ? {} : { role }) });
      onDone();
    } else {
      const u = await create.mutateAsync({
        username: username.trim().toLowerCase(),
        fullName,
        email: email.trim(),
        phone: phone.trim() || null,
        role,
        ...(useTemp ? { temporaryPassword: tempPassword } : {}),
      });
      setCreated({ username: u.username, email: u.email ?? email.trim(), tempPassword: useTemp ? tempPassword : null });
    }
  }

  if (created?.tempPassword) {
    return (
      <div>
        <p>
          <b>{created.username}</b> can now sign in. Share this temporary password with them privately — it is not shown again and was not
          emailed. They'll be asked to choose their own at first sign-in.
        </p>
        <pre style={{ fontSize: 16, padding: 12, background: "var(--line)", borderRadius: 8, userSelect: "all" }}>{created.tempPassword}</pre>
        <div className="btn-row">
          <button className="btn primary" onClick={onDone}>
            Done
          </button>
        </div>
      </div>
    );
  }
  if (created) {
    return (
      <div>
        <p>
          <b>{created.username}</b> was added. An account-setup link was emailed to <b>{created.email}</b>. They open it, create their
          own password, and can then sign in with their username or email.
        </p>
        <p style={MUTED}>No password is emailed. If the email doesn't arrive, use “Password” on their row to send a new link.</p>
        <div className="btn-row">
          <button className="btn primary" onClick={onDone}>
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={(e) => void submit(e).catch(() => {})} noValidate>
      <div className="form-grid">
        <div className="field">
          <label htmlFor="um-username">Username</label>
          <input
            id="um-username"
            value={username}
            disabled={Boolean(user)}
            autoCapitalize="none"
            spellCheck={false}
            onChange={(e) => setUsername(e.target.value.toLowerCase())}
            placeholder="e.g. ravi.k"
          />
          {!user && <span style={MUTED}>3–32 characters: a–z, 0–9, dot, dash, underscore. Can't be changed later.</span>}
        </div>
        <div className="field">
          <label htmlFor="um-name">Name</label>
          <input id="um-name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="um-email">Email</label>
          <input id="um-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" required />
          <span style={MUTED}>{user ? "Used for sign-in and password recovery." : "Their account-setup link is sent here. Also used for sign-in and password recovery."}</span>
        </div>
        <div className="field">
          <label htmlFor="um-phone">Mobile / WhatsApp (optional)</label>
          <input id="um-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+919876543210" />
        </div>
        <div className="field">
          <label htmlFor="um-role">Role</label>
          <RoleSelect id="um-role" value={role} onChange={setRole} disabled={isSelf} />
          {isSelf && <span style={MUTED}>You can't change your own role.</span>}
        </div>
      </div>
      {!user && (
        <label style={{ ...MUTED, display: "flex", gap: 6, alignItems: "flex-start", marginTop: 10 }}>
          <input type="checkbox" checked={useTemp} onChange={(e) => setUseTemp(e.target.checked)} />
          <span>Email not working? Don't send a setup email — show me a temporary password to pass on instead (they must change it at first sign-in).</span>
        </label>
      )}
      {mutation.isError && (
        <p role="alert" style={{ color: "var(--critical)", fontSize: 13 }}>
          {(mutation.error as Error).message}
        </p>
      )}
      <div className="btn-row">
        <button className="btn primary" type="submit" disabled={mutation.isPending || !fullName.trim() || !email.trim() || (!user && !username.trim())}>
          {mutation.isPending ? "Saving…" : user ? "Save changes" : useTemp ? "Add user" : "Add user & send setup email"}
        </button>
        <button className="btn" type="button" onClick={onDone}>
          Cancel
        </button>
      </div>
    </form>
  );
}

function PasswordActions({ user, onDone }: { user: ManagedUser; onDone: () => void }) {
  const sendLink = useSendPasswordLink();
  const reset = useResetUserPassword();
  const [showTemp, setShowTemp] = useState(false);
  const [password] = useState(generateTempPassword);
  const hasEmail = Boolean(user.email);

  if (sendLink.isSuccess) {
    return (
      <div>
        <p>
          {sendLink.data.kind === "invite" ? "A new account-setup link" : "A password-reset link"} was emailed to <b>{user.email}</b>. Their
          current password keeps working until they set a new one.
        </p>
        <div className="btn-row">
          <button className="btn primary" onClick={onDone}>
            Done
          </button>
        </div>
      </div>
    );
  }
  if (reset.isSuccess) {
    return (
      <div>
        <p>
          New temporary password for <b>{user.username}</b>. Their other sessions were signed out; they'll choose a new password at
          next sign-in.
        </p>
        <pre style={{ fontSize: 16, padding: 12, background: "var(--line)", borderRadius: 8, userSelect: "all" }}>{password}</pre>
        <div className="btn-row">
          <button className="btn primary" onClick={onDone}>
            Done
          </button>
        </div>
      </div>
    );
  }
  return (
    <div>
      {hasEmail ? (
        <p>
          Email <b>{user.fullName || user.username}</b> a secure link to {user.passwordSet ? "create a new password" : "finish setting up their account"}?
          It goes to <b>{user.email}</b>. No password is sent.
        </p>
      ) : (
        <p role="alert" style={{ color: "var(--critical)" }}>
          This user has no email address. Add one with “Edit” so they can receive setup and reset links.
        </p>
      )}
      {sendLink.isError && <p role="alert" style={{ color: "var(--critical)", fontSize: 13 }}>{(sendLink.error as Error).message}</p>}
      <div className="btn-row">
        <button className="btn primary" disabled={!hasEmail || sendLink.isPending} onClick={() => sendLink.mutate({ id: user.id })}>
          {sendLink.isPending ? "Sending…" : user.passwordSet ? "Email reset link" : "Resend setup email"}
        </button>
        <button className="btn" onClick={onDone}>
          Cancel
        </button>
      </div>

      <details style={{ marginTop: 14 }} open={showTemp} onToggle={(e) => setShowTemp((e.target as HTMLDetailsElement).open)}>
        <summary style={MUTED}>Email not working? Set a temporary password instead</summary>
        <p style={{ ...MUTED, marginTop: 8 }}>
          You'll see a temporary password to pass on privately; they must replace it at next sign-in, and they're signed out everywhere now.
        </p>
        {reset.isError && <p role="alert" style={{ color: "var(--critical)", fontSize: 13 }}>{(reset.error as Error).message}</p>}
        <button className="btn" disabled={reset.isPending} onClick={() => reset.mutate({ id: user.id, password })}>
          {reset.isPending ? "Resetting…" : "Set temporary password"}
        </button>
      </details>
    </div>
  );
}

export function UserManagement() {
  const { user: me } = useAuth();
  const { data: users, isLoading, isError, error } = useManagedUsers();
  const update = useUpdateUser();
  const [editing, setEditing] = useState<ManagedUser | "new" | null>(null);
  const [resetting, setResetting] = useState<ManagedUser | null>(null);
  const missingEmail = users?.filter((u) => u.isActive && !u.email) ?? [];

  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
        <div>
          <h3>User Management</h3>
          <p className="h3sub">Who can sign in to the dashboard, and what each person can see and change.</p>
        </div>
        <button className="btn primary" onClick={() => setEditing("new")}>
          Add user
        </button>
      </div>

      {isLoading && <p style={MUTED}>Loading users…</p>}
      {isError && <p role="alert" style={{ color: "var(--critical)" }}>{(error as Error).message}</p>}
      {update.isError && <p role="alert" style={{ color: "var(--critical)", fontSize: 13 }}>{(update.error as Error).message}</p>}

      {missingEmail.length > 0 && (
        <p className="callout" role="alert" style={{ marginTop: 10 }}>
          <b>Email needed.</b> {missingEmail.map((u) => u.username).join(", ")} {missingEmail.length === 1 ? "has" : "have"} no email address, so they can't recover a forgotten password. Use “Edit” to add one.
        </p>
      )}

      {users && (
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Username</th>
                <th>Email</th>
                <th>Mobile / WhatsApp</th>
                <th>Role</th>
                <th>Status</th>
                <th>Last login</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const isSelf = u.id === me?.id;
                return (
                  <tr key={u.id} style={u.isActive ? undefined : { opacity: 0.6 }}>
                    <td>
                      {u.fullName || "—"}
                      {isSelf && <span style={{ ...MUTED, marginLeft: 6 }}>(you)</span>}
                    </td>
                    <td>{u.username}</td>
                    <td>{u.email ?? <span style={{ color: "var(--critical)" }}>Missing</span>}</td>
                    <td>{u.phone ?? "—"}</td>
                    <td>{ROLE_LABELS[u.role]}</td>
                    <td>
                      <span className={`pill ${u.isActive ? "good" : "notconn"}`} style={{ marginTop: 0 }}>
                        {!u.isActive
                          ? "Deactivated"
                          : !u.passwordSet
                            ? "Setup email sent"
                            : u.mustChangePassword
                              ? "Active · temp password"
                              : "Active"}
                      </span>
                    </td>
                    <td>{formatWhen(u.lastLoginAt)}</td>
                    <td style={{ whiteSpace: "nowrap" }}>
                      <button className="btn small" onClick={() => setEditing(u)}>
                        Edit
                      </button>{" "}
                      <button className="btn small" onClick={() => setResetting(u)}>
                        Password
                      </button>{" "}
                      {!isSelf && (
                        <button
                          className="btn small"
                          disabled={update.isPending}
                          onClick={() => update.mutate({ id: u.id, isActive: !u.isActive })}
                        >
                          {u.isActive ? "Deactivate" : "Activate"}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="callout" style={{ marginTop: 14 }}>
        <b>Roles.</b>{" "}
        {ROLES.map((r) => (
          <span key={r} style={{ display: "block", marginTop: 4 }}>
            <b>{ROLE_LABELS[r]}</b> — {ROLE_DESCRIPTIONS[r]}
          </span>
        ))}
      </div>

      {editing && (
        <Modal title={editing === "new" ? "Add user" : `Edit ${editing.username}`} onClose={() => setEditing(null)}>
          <UserForm user={editing === "new" ? undefined : editing} onDone={() => setEditing(null)} />
        </Modal>
      )}
      {resetting && (
        <Modal title={resetting.passwordSet ? "Reset password" : "Account setup"} onClose={() => setResetting(null)}>
          <PasswordActions user={resetting} onDone={() => setResetting(null)} />
        </Modal>
      )}
    </div>
  );
}
