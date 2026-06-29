// ============================================================
// Same pattern again, for the STUDENT role.
// ============================================================

import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { dashboardPathForRole } from "@/lib/routes";

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "STUDENT") {
    redirect(dashboardPathForRole(user.role));
  }

  return <>{children}</>;
}
