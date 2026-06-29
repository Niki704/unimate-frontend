import { getSessionUser } from "@/lib/session";
import { lecturerRepo } from "@/lib/repositories/lecturer.repo";
import { batchRepo } from "@/lib/repositories/batch.repo";
import { batchFeedbackRepo } from "@/lib/repositories/batch-feedback.repo";
import { PageHeader } from "@/components/layout/dashboard-shell";
import { BatchFeedbackClient } from "./_client";

interface Props {
  searchParams: Promise<{ batchId?: string }>;
}

export default async function BatchFeedbackPage({ searchParams }: Props) {
  const params = await searchParams;
  const user = await getSessionUser();
  const lecturer = await lecturerRepo.getById(user!.userId);

  const selectedBatchId = params.batchId
    ? Number(params.batchId)
    : lecturer.batchIds[0];

  const myBatches =
    lecturer.batchIds.length > 0
      ? await Promise.all(lecturer.batchIds.map((id) => batchRepo.getById(id)))
      : [];

  const existingFeedback = selectedBatchId
    ? await batchFeedbackRepo.getByBatch(selectedBatchId)
    : [];

  const selectedBatch = myBatches.find((b) => b.id === selectedBatchId);

  return (
    <div>
      <PageHeader
        title="Batch Feedback"
        description="Submit feedback for a batch."
      />
      <BatchFeedbackClient
        myBatches={myBatches}
        selectedBatch={selectedBatch ?? null}
        existingFeedback={existingFeedback}
      />
    </div>
  );
}
