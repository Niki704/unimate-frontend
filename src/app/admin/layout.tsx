// ============================================================
// The real protection for everything under /admin: must have a
// session AND that session's role must be ADMIN. A logged-in
// Lecturer/Student hitting this gets sent to their OWN dashboard,
// not bounced to /login — they're not unauthenticated, just in
// the wrong section.
// ============================================================

import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { dashboardPathForRole } from "@/lib/routes";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "ADMIN") {
    redirect(dashboardPathForRole(user.role));
  }

  return <>{children}</>;
}
