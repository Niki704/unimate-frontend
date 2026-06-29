// ============================================================
// The single low-level fetch wrapper. Every repository function
// goes through this — nothing else should call fetch() against
// the Spring backend directly.
// ============================================================

import { getToken } from "@/lib/session";
import type { ErrorResponse } from "@/types/error";

const BASE_URL = process.env.SPRING_API_BASE_URL;

if (!BASE_URL) {
  throw new Error("SPRING_API_BASE_URL is not set — check .env.local");
}

/**
 * Thrown whenever Spring returns a non-2xx response. Carries the
 * exact ErrorResponse shape GlobalExceptionHandler sends, plus the
 * HTTP status, so callers can branch on errorCode or status (e.g.
 * redirect to login on a 401).
 */
export class ApiError extends Error {
  readonly status: number;
  readonly errorCode: string;

  constructor(status: number, body: ErrorResponse) {
    super(body.message);
    this.name = "ApiError";
    this.status = status;
    this.errorCode = body.errorCode;
  }
}

interface ApiRequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown; // pass a plain object — this wrapper JSON.stringifies it
  /** Set true only for endpoints SecurityConfig marks permitAll (login, register). */
  skipAuth?: boolean;
}

/**
 * Calls one Spring endpoint. `path` should start with /api/v1/...
 * Attaches the bearer token automatically unless skipAuth is true.
 * Throws ApiError on any non-2xx response. Returns parsed JSON, or
 * undefined for a 204 No Content response (e.g. delete endpoints).
 *
 * cache: "no-store" is hardcoded — always fresh, since this data
 * changes constantly (approvals, registrations) and Spring is the
 * source of truth, not Next's fetch cache. Revisit per-call later
 * if a specific read-heavy page needs different caching.
 */
export async function apiFetch<TResponse>(
  path: string,
  options: ApiRequestOptions = {}
): Promise<TResponse> {
  const { body, skipAuth, headers, ...rest } = options;

  const finalHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(headers as Record<string, string> | undefined),
  };

  if (!skipAuth) {
    const token = await getToken();
    if (token) {
      finalHeaders["Authorization"] = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers: finalHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  if (response.status === 204) {
    return undefined as TResponse;
  }

  const text = await response.text();
  const data = text ? JSON.parse(text) : undefined;

  if (!response.ok) {
    throw new ApiError(response.status, data as ErrorResponse);
  }

  return data as TResponse;
}