// ============================================================
// login/logout as Server Actions, not Route Handlers — see
// FRONTEND_BUILD_PLAN.md Section 3 for why no Route Handler is
// needed. IMPORTANT: redirect() throws internally as part of how
// it works, so it's deliberately called OUTSIDE any try/catch
// below — calling it inside one would let the catch block
// swallow the redirect and misreport it as a failure.
// ============================================================

"use server";

import { redirect } from "next/navigation";
import { authRepo } from "@/lib/repositories/auth.repo";
import { setSessionCookie, clearSessionCookie } from "@/lib/session";
import { ApiError } from "@/lib/api-client";
import { dashboardPathForRole } from "@/lib/routes";

export interface LoginActionState {
  error: string | null;
}

export async function loginAction(
  _prevState: LoginActionState,
  formData: FormData
): Promise<LoginActionState> {
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || !email || typeof password !== "string" || !password) {
    return { error: "Email and password are required" };
  }

  let redirectPath: string;

  try {
    const result = await authRepo.login({ email, password });
    await setSessionCookie(result.token);
    redirectPath = dashboardPathForRole(result.role);
  } catch (err) {
    if (err instanceof ApiError) {
      return { error: err.message };
    }
    return { error: "Something went wrong. Please try again." };
  }

  redirect(redirectPath);
}

export async function logoutAction(): Promise<void> {
  await clearSessionCookie();
  redirect("/login");
}
