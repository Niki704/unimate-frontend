// ============================================================
// Cookie + JWT-payload helpers. Signature is deliberately NOT
// verified here — see FRONTEND_BUILD_PLAN.md Section 2 for why
// (Spring is the real trust boundary; this file is UX-only).
// getToken()/getSessionUser() work in Server Components, Server
// Actions, and Route Handlers. setSessionCookie()/
// clearSessionCookie() ONLY work in Server Actions and Route
// Handlers — Next.js disallows cookie writes during a plain
// Server Component render.
// ============================================================

import { cookies } from "next/headers";
import type { Role } from "@/types/enums";

const COOKIE_NAME = process.env.COOKIE_NAME ?? "unimate_token";

export interface SessionTokenPayload {
  sub: string; // email — matches JwtService's subject(principal.getEmail())
  userId: number;
  role: Role;
  iat: number;
  exp: number;
}

export interface SessionUser {
  userId: number;
  email: string;
  role: Role;
}

/**
 * Reads the raw JWT string from the cookie, or null if absent.
 */
export async function getToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(COOKIE_NAME)?.value ?? null;
}

/**
 * Decodes the JWT's payload segment WITHOUT verifying its
 * signature. Returns null on any malformed/missing token —
 * deliberate, see file header.
 */
export function decodeToken(token: string): SessionTokenPayload | null {
  try {
    const payloadSegment = token.split(".")[1];
    if (!payloadSegment) return null;

    const json = Buffer.from(payloadSegment, "base64url").toString("utf-8");
    const payload = JSON.parse(json) as SessionTokenPayload;

    if (typeof payload.exp !== "number" || typeof payload.role !== "string") {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

/**
 * Convenience: reads the cookie AND decodes it in one call.
 * Returns null if there's no cookie, the token is malformed, or
 * it's expired by its own `exp` claim. This is a purely local,
 * unverified check — Spring still independently re-validates on
 * every real request regardless of what this function decides.
 */
export async function getSessionUser(): Promise<SessionUser | null> {
  const token = await getToken();
  if (!token) return null;

  const payload = decodeToken(token);
  if (!payload) return null;

  const nowInSeconds = Math.floor(Date.now() / 1000);
  if (payload.exp < nowInSeconds) return null;

  return { userId: payload.userId, email: payload.sub, role: payload.role };
}

/**
 * Sets the httpOnly session cookie. Call only from a Server
 * Action or Route Handler (e.g. the login route in Phase 4).
 */
export async function setSessionCookie(token: string): Promise<void> {
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    // No explicit maxAge/expires — the cookie naturally stops being
    // useful once the JWT itself expires (24h, per jwt.expiration-ms
    // in the backend). Spring rejects an expired token regardless of
    // how long the cookie itself sticks around.
  });
}

/**
 * Clears the session cookie. Call only from a Server Action or
 * Route Handler (e.g. the logout route in Phase 4).
 */
export async function clearSessionCookie(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}