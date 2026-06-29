"use client";

import { useActionState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { handleActionState } from "@/lib/toast-utils";
import { createStudentFeedbackAction } from "@/actions/feedback.actions";
import { createBatchFeedbackAction } from "@/actions/feedback.actions";
import type { StudentResponseDTO } from "@/types/student";
import type { BatchResponseDTO } from "@/types/batch";

const BADGES = [
  { value: "TEAM_WORK", label: "Team Work" },
  { value: "AGILE", label: "Agile" },
  { value: "COLLABORATIVE", label: "Collaborative" },
  { value: "SUPPORTIVE", label: "Supportive" },
  { value: "ON_TIME", label: "On Time" },
] as const;

const initial = { error: null };

// ─── Student Feedback Form ────────────────────────────────────────────────────

interface StudentFeedbackFormProps {
  student: StudentResponseDTO;
  onSuccess?: () => void;
}

export function StudentFeedbackForm({
  student,
  onSuccess,
}: StudentFeedbackFormProps) {
  const { addToast } = useToast();
  const [state, formAction, isPending] = useActionState(
    createStudentFeedbackAction,
    initial,
  );
  const prevPending = useRef(false);

  useEffect(() => {
    if (prevPending.current && !isPending) {
      const wasError = handleActionState(
        state,
        addToast,
        "Feedback submitted.",
      );
      if (!wasError) onSuccess?.();
    }
    prevPending.current = isPending;
  }, [isPending, state, addToast, onSuccess]);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="studentId" value={student.id} />

      <p className="text-sm font-medium text-slate-700">
        {student.firstName} {student.lastName}
        <span className="ml-2 text-xs font-normal text-slate-500">
          {student.studentIdNumber}
        </span>
      </p>

      <Input label="Date" name="date" type="date" required />

      <Select
        label="Rating"
        name="studentRating"
        required
        placeholder="Select rating"
      >
        <option value="EXCELLENT">Excellent</option>
        <option value="GOOD">Good</option>
        <option value="MODERATE">Moderate</option>
        <option value="LOW">Low</option>
      </Select>

      <Textarea
        label="Feedback"
        name="content"
        required
        placeholder="Write feedback…"
      />

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <Button
        type="submit"
        variant="primary"
        className="w-full"
        isLoading={isPending}
      >
        Submit Feedback
      </Button>
    </form>
  );
}

// ─── Batch Feedback Form ──────────────────────────────────────────────────────

interface BatchFeedbackFormProps {
  batch: BatchResponseDTO;
  onSuccess?: () => void;
}

export function BatchFeedbackForm({
  batch,
  onSuccess,
}: BatchFeedbackFormProps) {
  const { addToast } = useToast();
  const [state, formAction, isPending] = useActionState(
    createBatchFeedbackAction,
    initial,
  );
  const prevPending = useRef(false);

  useEffect(() => {
    if (prevPending.current && !isPending) {
      const wasError = handleActionState(
        state,
        addToast,
        "Batch feedback submitted.",
      );
      if (!wasError) onSuccess?.();
    }
    prevPending.current = isPending;
  }, [isPending, state, addToast, onSuccess]);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="batchId" value={batch.id} />

      <p className="text-sm font-medium text-slate-700">
        {batch.batchCode} — {batch.name}
      </p>

      <Input label="Date" name="date" type="date" required />

      <Textarea
        label="Feedback"
        name="content"
        required
        placeholder="Write batch feedback…"
      />

      <div className="space-y-2">
        <p className="text-sm font-medium text-slate-700">
          Badges <span className="font-normal text-slate-500">(optional)</span>
        </p>
        <div className="grid grid-cols-2 gap-2">
          {BADGES.map((b) => (
            <label
              key={b.value}
              className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer"
            >
              <input
                type="checkbox"
                name="badges"
                value={b.value}
                className="rounded border-slate-300 text-slate-900 focus:ring-slate-400"
              />
              {b.label}
            </label>
          ))}
        </div>
      </div>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <Button
        type="submit"
        variant="primary"
        className="w-full"
        isLoading={isPending}
      >
        Submit Batch Feedback
      </Button>
    </form>
  );
}
