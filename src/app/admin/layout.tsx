import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { dashboardPathForRole } from "@/lib/routes";
import { adminRepo } from "@/lib/repositories/admin.repo";
import { DashboardShell } from "@/components/layout/dashboard-shell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();

  if (!user) redirect("/login");
  if (user.role !== "ADMIN") redirect(dashboardPathForRole(user.role));

  const admin = await adminRepo.getById(user.userId);

  return (
    <DashboardShell
      role="ADMIN"
      firstName={admin.firstName}
      lastName={admin.lastName}
      email={user.email}
    >
      {children}
    </DashboardShell>
  );
}
