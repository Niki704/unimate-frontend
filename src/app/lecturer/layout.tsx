// ============================================================
// Same pattern as admin/layout.tsx, for the LECTURER role.
// ============================================================

import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { dashboardPathForRole } from "@/lib/routes";

export default async function LecturerLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "LECTURER") {
    redirect(dashboardPathForRole(user.role));
  }

  return <>{children}</>;
}
