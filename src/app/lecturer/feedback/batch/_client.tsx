"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Modal } from "@/components/ui/modal";
import { BatchFeedbackForm } from "@/components/forms/feedback-form";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { format, parseISO } from "date-fns";
import type { BatchResponseDTO } from "@/types/batch";
import type { BatchFeedbackResponseDTO } from "@/types/feedback";

interface Props {
  myBatches: BatchResponseDTO[];
  selectedBatch: BatchResponseDTO | null;
  existingFeedback: BatchFeedbackResponseDTO[];
}

export function BatchFeedbackClient({
  myBatches,
  selectedBatch,
  existingFeedback,
}: Props) {
  const router = useRouter();
  const [formOpen, setFormOpen] = useState(false);

  function handleBatchChange(e: React.ChangeEvent<HTMLSelectElement>) {
    router.push(`/lecturer/feedback/batch?batchId=${e.target.value}`);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 flex-wrap">
        {myBatches.length > 0 && (
          <select
            defaultValue={selectedBatch?.id ?? ""}
            onChange={handleBatchChange}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400"
          >
            <option value="" disabled>
              Select a batch
            </option>
            {myBatches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.batchCode} — {b.name}
              </option>
            ))}
          </select>
        )}
        {selectedBatch && (
          <Button variant="primary" size="sm" onClick={() => setFormOpen(true)}>
            <Plus className="h-4 w-4" /> New Feedback
          </Button>
        )}
      </div>

      {!selectedBatch ? (
        <EmptyState
          title="Select a batch"
          description="Choose a batch above to view and submit feedback."
        />
      ) : existingFeedback.length === 0 ? (
        <EmptyState
          title="No feedback yet"
          description={`No batch feedback submitted for ${selectedBatch.batchCode}.`}
          action={{
            label: "Add First Feedback",
            onClick: () => setFormOpen(true),
          }}
        />
      ) : (
        <div className="space-y-3">
          {existingFeedback.map((f) => (
            <Card key={f.id}>
              <CardContent className="pt-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <p className="text-xs text-slate-500">
                    {format(parseISO(f.date), "MMM d, yyyy")} · {f.lecturerName}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {f.badges.map((b) => (
                      <Badge key={b} variant="info">
                        {b.replace(/_/g, " ")}
                      </Badge>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-slate-700">{f.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {selectedBatch && (
        <Modal
          open={formOpen}
          onClose={() => setFormOpen(false)}
          title="Batch Feedback"
          size="sm"
        >
          <BatchFeedbackForm
            batch={selectedBatch}
            onSuccess={() => {
              setFormOpen(false);
              router.refresh();
            }}
          />
        </Modal>
      )}
    </div>
  );
}
