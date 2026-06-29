import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { dashboardPathForRole } from "@/lib/routes";
import { lecturerRepo } from "@/lib/repositories/lecturer.repo";
import { DashboardShell } from "@/components/layout/dashboard-shell";

export default async function LecturerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();

  if (!user) redirect("/login");
  if (user.role !== "LECTURER") redirect(dashboardPathForRole(user.role));

  const lecturer = await lecturerRepo.getById(user.userId);

  return (
    <DashboardShell
      role="LECTURER"
      firstName={lecturer.firstName}
      lastName={lecturer.lastName}
      email={user.email}
    >
      {children}
    </DashboardShell>
  );
}
