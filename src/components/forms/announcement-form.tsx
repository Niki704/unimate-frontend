"use client";

import { useActionState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { handleActionState } from "@/lib/toast-utils";
import { createAnnouncementAction } from "@/actions/announcement.actions";
import type { BatchResponseDTO } from "@/types/batch";

interface AnnouncementFormProps {
  /** Batches the lecturer is assigned to — used to populate the batch checkboxes */
  availableBatches?: BatchResponseDTO[];
  onSuccess?: () => void;
}

const initial = { error: null };

export function AnnouncementForm({
  availableBatches = [],
  onSuccess,
}: AnnouncementFormProps) {
  const { addToast } = useToast();
  const [state, formAction, isPending] = useActionState(
    createAnnouncementAction,
    initial,
  );
  const prevPending = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (prevPending.current && !isPending) {
      const wasError = handleActionState(
        state,
        addToast,
        "Announcement created.",
      );
      if (!wasError) {
        formRef.current?.reset();
        onSuccess?.();
      }
    }
    prevPending.current = isPending;
  }, [isPending, state, addToast, onSuccess]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <Input
        label="Title"
        name="title"
        required
        placeholder="Announcement title"
      />

      <Textarea
        label="Content"
        name="content"
        required
        placeholder="Write the announcement body…"
        className="min-h-25"
      />

      <div className="grid grid-cols-2 gap-3">
        <Input label="Date" name="date" type="date" required />
        <Input
          label="Expiry Date"
          name="expiryDate"
          type="date"
          hint="Optional"
        />
      </div>

      {availableBatches.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-700">Target Batches</p>
          <div className="space-y-1.5 max-h-40 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50 p-3">
            {availableBatches.map((b) => (
              <label
                key={b.id}
                className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer"
              >
                <input
                  type="checkbox"
                  name="batchIds"
                  value={b.id}
                  className="rounded border-slate-300 text-slate-900 focus:ring-slate-400"
                />
                <span className="font-medium">{b.batchCode}</span>
                <span className="text-slate-500">— {b.name}</span>
              </label>
            ))}
          </div>
          <p className="text-xs text-slate-400">
            Leave unchecked to broadcast to all.
          </p>
        </div>
      )}

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <Button
        type="submit"
        variant="primary"
        className="w-full"
        isLoading={isPending}
      >
        Post Announcement
      </Button>
    </form>
  );
}
