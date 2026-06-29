import { lecturerRepo } from "@/lib/repositories/lecturer.repo";
import { batchRepo } from "@/lib/repositories/batch.repo";
import { PageHeader } from "@/components/layout/dashboard-shell";
import { LecturersClient } from "./_client";

export default async function AdminLecturersPage() {
  const [lecturers, batches] = await Promise.all([
    lecturerRepo.getAll(),
    batchRepo.getAll(),
  ]);

  return (
    <div>
      <PageHeader
        title="Lecturers"
        description={`${lecturers.length} registered lecturer${lecturers.length !== 1 ? "s" : ""}`}
      />
      <LecturersClient lecturers={lecturers} allBatches={batches} />
    </div>
  );
}
