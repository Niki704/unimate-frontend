"use client";

import { useActionState, useEffect, useRef, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { handleActionState } from "@/lib/toast-utils";
import {
  approveStudentAction,
  rejectStudentAction,
} from "@/actions/student.actions";
import type { BatchResponseDTO } from "@/types/batch";

interface ApproveStudentFormProps {
  studentId: number;
  studentName: string;
  batches: BatchResponseDTO[];
  onSuccess?: () => void;
}

const initial = { error: null };

export function ApproveStudentForm({
  studentId,
  studentName,
  batches,
  onSuccess,
}: ApproveStudentFormProps) {
  const { addToast } = useToast();
  const [state, formAction, isPending] = useActionState(
    approveStudentAction,
    initial,
  );
  const [rejectPending, startRejectTransition] = useTransition();
  const prevPending = useRef(false);

  useEffect(() => {
    if (prevPending.current && !isPending) {
      const wasError = handleActionState(
        state,
        addToast,
        "Student approved successfully.",
      );
      if (!wasError) onSuccess?.();
    }
    prevPending.current = isPending;
  }, [isPending, state, addToast, onSuccess]);

  async function handleReject() {
    startRejectTransition(async () => {
      const result = await rejectStudentAction(studentId);
      handleActionState(result, addToast, "Student rejected.");
      if (!result.error) onSuccess?.();
    });
  }

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="studentId" value={studentId} />

      <p className="text-sm text-slate-500">
        Approving{" "}
        <span className="font-medium text-slate-900">{studentName}</span>.
        Assign them to a batch and provide their student ID.
      </p>

      <Select
        label="Batch"
        name="batchId"
        required
        placeholder="Select a batch"
        defaultValue=""
      >
        {batches.map((b) => (
          <option key={b.id} value={b.id}>
            {b.batchCode} — {b.name}
          </option>
        ))}
      </Select>

      <Input
        label="Student ID Number"
        name="studentIdNumber"
        required
        placeholder="e.g. ST-2024-001"
      />

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <div className="flex gap-2 pt-1">
        <Button
          type="button"
          variant="danger"
          className="flex-1"
          onClick={handleReject}
          isLoading={rejectPending}
          disabled={isPending}
        >
          Reject
        </Button>
        <Button
          type="submit"
          variant="primary"
          className="flex-1"
          isLoading={isPending}
          disabled={rejectPending}
        >
          Approve
        </Button>
      </div>
    </form>
  );
}
