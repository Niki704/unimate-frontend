import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { dashboardPathForRole } from "@/lib/routes";
import { studentRepo } from "@/lib/repositories/student.repo";
import { DashboardShell } from "@/components/layout/dashboard-shell";

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();

  if (!user) redirect("/login");
  if (user.role !== "STUDENT") redirect(dashboardPathForRole(user.role));

  const student = await studentRepo.getById(user.userId);

  return (
    <DashboardShell
      role="STUDENT"
      firstName={student.firstName}
      lastName={student.lastName}
      email={user.email}
    >
      {children}
    </DashboardShell>
  );
}
