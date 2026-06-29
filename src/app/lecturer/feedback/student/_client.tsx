"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Modal } from "@/components/ui/modal";
import { StudentFeedbackForm } from "@/components/forms/feedback-form";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare } from "lucide-react";
import { format, parseISO } from "date-fns";
import type { BatchResponseDTO } from "@/types/batch";
import type { StudentResponseDTO } from "@/types/student";
import type { StudentFeedbackResponseDTO } from "@/types/feedback";

interface Props {
  myBatches: BatchResponseDTO[];
  selectedBatchId: number | undefined;
  students: StudentResponseDTO[];
  feedbackByStudent: Record<number, StudentFeedbackResponseDTO[]>;
}

const ratingVariant = {
  EXCELLENT: "success",
  GOOD: "info",
  MODERATE: "warning",
  LOW: "error",
} as const;

export function StudentFeedbackClient({
  myBatches,
  selectedBatchId,
  students,
  feedbackByStudent,
}: Props) {
  const router = useRouter();
  const [selectedStudent, setSelectedStudent] =
    useState<StudentResponseDTO | null>(null);

  function handleBatchChange(e: React.ChangeEvent<HTMLSelectElement>) {
    router.push(`/lecturer/feedback/student?batchId=${e.target.value}`);
  }

  return (
    <div className="space-y-6">
      {myBatches.length > 1 && (
        <select
          defaultValue={selectedBatchId ?? ""}
          onChange={handleBatchChange}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400"
        >
          {myBatches.map((b) => (
            <option key={b.id} value={b.id}>
              {b.batchCode} — {b.name}
            </option>
          ))}
        </select>
      )}

      {students.length === 0 ? (
        <EmptyState
          title="No students in this batch"
          description="This batch has no students assigned yet."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {students.map((s) => {
            const feedback = feedbackByStudent[s.id] ?? [];
            return (
              <Card key={s.id}>
                <CardHeader>
                  <CardTitle>
                    {s.firstName} {s.lastName}
                  </CardTitle>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {s.studentIdNumber ?? s.email}
                  </p>
                </CardHeader>
                <CardContent>
                  {feedback.length === 0 ? (
                    <p className="text-xs text-slate-400 mb-3">
                      No feedback given yet.
                    </p>
                  ) : (
                    <div className="space-y-2 mb-3 max-h-32 overflow-y-auto">
                      {feedback.slice(-2).map((f) => (
                        <div
                          key={f.id}
                          className="rounded-md bg-slate-50 p-2 text-xs"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-slate-500">
                              {format(parseISO(f.date), "MMM d, yyyy")}
                            </span>
                            <Badge variant={ratingVariant[f.studentRating]}>
                              {f.studentRating}
                            </Badge>
                          </div>
                          <p className="text-slate-700 line-clamp-2">
                            {f.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full gap-1.5"
                    onClick={() => setSelectedStudent(s)}
                  >
                    <MessageSquare className="h-3.5 w-3.5" /> Give Feedback
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {selectedStudent && (
        <Modal
          open={!!selectedStudent}
          onClose={() => setSelectedStudent(null)}
          title="Student Feedback"
          size="sm"
        >
          <StudentFeedbackForm
            student={selectedStudent}
            onSuccess={() => {
              setSelectedStudent(null);
              router.refresh();
            }}
          />
        </Modal>
      )}
    </div>
  );
}
