import { adminRepo } from "@/lib/repositories/admin.repo";
import { batchRepo } from "@/lib/repositories/batch.repo";
import { PageHeader } from "@/components/layout/dashboard-shell";
import { PendingApprovalsClient } from "./_client";

export default async function PendingApprovalsPage() {
  const [{ pendingStudents, pendingLecturers }, batches] = await Promise.all([
    adminRepo.getPendingApprovals(),
    batchRepo.getAll(),
  ]);

  return (
    <div>
      <PageHeader
        title="Pending Approvals"
        description="Review and approve or reject pending registrations."
      />
      <PendingApprovalsClient
        pendingStudents={pendingStudents}
        pendingLecturers={pendingLecturers}
        batches={batches}
      />
    </div>
  );
}
