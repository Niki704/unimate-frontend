"use client";

import { useTransition } from "react";
import { Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { handleActionState } from "@/lib/toast-utils";
import {
  assignLecturerBatchAction,
  unassignLecturerBatchAction,
} from "@/actions/lecturer.actions";
import type { BatchResponseDTO } from "@/types/batch";

interface LecturerAssignFormProps {
  lecturerId: number;
  lecturerName: string;
  allBatches: BatchResponseDTO[];
  /** batchIds already assigned to this lecturer */
  assignedBatchIds: number[];
  onSuccess?: () => void;
}

export function LecturerAssignForm({
  lecturerId,
  lecturerName,
  allBatches,
  assignedBatchIds,
  onSuccess,
}: LecturerAssignFormProps) {
  const { addToast } = useToast();
  const [isPending, startTransition] = useTransition();

  async function handleAssign(batchId: number, assign: boolean) {
    startTransition(async () => {
      const result = assign
        ? await assignLecturerBatchAction(lecturerId, batchId)
        : await unassignLecturerBatchAction(lecturerId, batchId);
      handleActionState(
        result,
        addToast,
        assign ? "Batch assigned." : "Batch unassigned.",
      );
      if (!result.error) onSuccess?.();
    });
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-500">
        Manage batch assignments for{" "}
        <span className="font-medium text-slate-900">{lecturerName}</span>.
      </p>
      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
        {allBatches.map((batch) => {
          const assigned = assignedBatchIds.includes(batch.id);
          return (
            <div
              key={batch.id}
              className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
            >
              <div>
                <p className="text-sm font-medium text-slate-900">
                  {batch.batchCode}
                </p>
                <p className="text-xs text-slate-500">
                  {batch.name} · {batch.startYear}–{batch.endYear}
                </p>
              </div>
              <Button
                variant={assigned ? "danger" : "outline"}
                size="sm"
                disabled={isPending}
                onClick={() => handleAssign(batch.id, !assigned)}
                className="gap-1"
              >
                {assigned ? (
                  <>
                    <Minus className="h-3 w-3" /> Unassign
                  </>
                ) : (
                  <>
                    <Plus className="h-3 w-3" /> Assign
                  </>
                )}
              </Button>
            </div>
          );
        })}
        {allBatches.length === 0 && (
          <p className="py-4 text-center text-sm text-slate-400">
            No batches available.
          </p>
        )}
      </div>
    </div>
  );
}
