// ============================================================
// Root route — sends visitors to the right place immediately.
// ============================================================

import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { dashboardPathForRole } from "@/lib/routes";

export default async function RootPage() {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  redirect(dashboardPathForRole(user.role));
}
