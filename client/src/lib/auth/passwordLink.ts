import type { PasswordLinkType } from "@shared/auth";

export const SET_PASSWORD_PATH = "/set-password";

/** What an emailed account-setup / password-reset link brought to the page. */
export interface PasswordLink {
  type: PasswordLinkType | null;
  /** Session token from a default Supabase link (#access_token=...). Held in memory only. */
  accessToken?: string;
  /** From a custom-template link (?token_hash=...), verified by the server. */
  tokenHash?: string;
  /** Set when Supabase already rejected the link (expired / used / invalid). */
  failed?: boolean;
}

function linkType(v: string | null): PasswordLinkType | null {
  return v === "invite" || v === "recovery" ? v : null;
}

/**
 * Reads an emailed link out of the current URL, once, at startup -- then
 * wipes it from the address bar and history so the one-time token doesn't
 * linger (back button, shoulder-surfing, copy-paste). Supabase lands on
 * /set-password, or on the Site URL root if the redirect isn't allow-listed;
 * both are handled. Returns null for ordinary page loads.
 */
export function takePasswordLinkFromUrl(): PasswordLink | null {
  const { pathname, search, hash } = window.location;
  const fragment = new URLSearchParams(hash.replace(/^#/, ""));
  const query = new URLSearchParams(search);

  let link: PasswordLink | null = null;
  const fragmentType = linkType(fragment.get("type"));
  if (fragment.get("access_token") && fragmentType) {
    link = { type: fragmentType, accessToken: fragment.get("access_token")! };
  } else if (query.get("token_hash") && linkType(query.get("type"))) {
    link = { type: linkType(query.get("type")), tokenHash: query.get("token_hash")! };
  } else if (fragment.get("error") || fragment.get("error_code") || query.get("error_code")) {
    link = { type: null, failed: true };
  } else if (pathname === SET_PASSWORD_PATH) {
    link = { type: null, failed: true };
  }

  if (link) window.history.replaceState(null, "", SET_PASSWORD_PATH);
  return link;
}
