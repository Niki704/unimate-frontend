import { batchRepo } from "@/lib/repositories/batch.repo";
import { PageHeader } from "@/components/layout/dashboard-shell";
import { BatchesClient } from "./_client";

export default async function AdminBatchesPage() {
  const batches = await batchRepo.getAll();

  return (
    <div>
      <PageHeader title="Batches" description="Manage your batches" />
      <BatchesClient batches={batches} />
    </div>
  );
}
