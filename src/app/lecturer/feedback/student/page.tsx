import { getSessionUser } from "@/lib/session";
import { lecturerRepo } from "@/lib/repositories/lecturer.repo";
import { batchRepo } from "@/lib/repositories/batch.repo";
import { studentFeedbackRepo } from "@/lib/repositories/student-feedback.repo";
import { PageHeader } from "@/components/layout/dashboard-shell";
import { StudentFeedbackClient } from "./_client";

interface Props {
  searchParams: Promise<{ batchId?: string }>;
}

export default async function StudentFeedbackPage({ searchParams }: Props) {
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

  const students = selectedBatchId
    ? await batchRepo.getStudents(selectedBatchId)
    : [];

  const feedbackByStudent: Record<
    number,
    Awaited<ReturnType<typeof studentFeedbackRepo.getByStudent>>
  > = {};
  for (const s of students) {
    feedbackByStudent[s.id] = await studentFeedbackRepo.getByStudent(s.id);
  }

  return (
    <div>
      <PageHeader
        title="Student Feedback"
        description="Submit feedback for individual students in your batches."
      />
      <StudentFeedbackClient
        myBatches={myBatches}
        selectedBatchId={selectedBatchId}
        students={students}
        feedbackByStudent={feedbackByStudent}
      />
    </div>
  );
}
