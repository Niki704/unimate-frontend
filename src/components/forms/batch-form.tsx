"use client";

import { useActionState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { handleActionState } from "@/lib/toast-utils";
import { createBatchAction, updateBatchAction } from "@/actions/batch.actions";
import type { BatchResponseDTO } from "@/types/batch";

interface BatchFormProps {
  /** Pass existing batch to switch into edit mode */
  existing?: BatchResponseDTO;
  onSuccess?: () => void;
}

const initial = { error: null };

export function BatchForm({ existing, onSuccess }: BatchFormProps) {
  const { addToast } = useToast();
  const action = existing ? updateBatchAction : createBatchAction;
  const [state, formAction, isPending] = useActionState(action, initial);
  const prevPending = useRef(false);

  useEffect(() => {
    if (prevPending.current && !isPending) {
      const wasError = handleActionState(
        state,
        addToast,
        existing
          ? "Batch updated successfully."
          : "Batch created successfully.",
      );
      if (!wasError) onSuccess?.();
    }
    prevPending.current = isPending;
  }, [isPending, state, addToast, existing, onSuccess]);

  return (
    <form action={formAction} className="space-y-4">
      {existing && <input type="hidden" name="batchId" value={existing.id} />}

      <Input
        label="Batch Code"
        name="batchCode"
        required
        placeholder="e.g. SOC-2024-A"
        defaultValue={existing?.batchCode}
      />

      <Input
        label="Name"
        name="name"
        required
        placeholder="e.g. Software Computing Cohort A"
        defaultValue={existing?.name}
      />

      <Select
        label="Batch Type"
        name="batchType"
        required
        placeholder="Select batch type"
        defaultValue={existing?.batchType ?? ""}
      >
        <option value="SOC">SOC — Software Computing</option>
        <option value="SOL">SOL — Software Logistics</option>
        <option value="SOB">SOB — Software Business</option>
      </Select>

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Start Year"
          name="startYear"
          type="number"
          required
          placeholder="2024"
          min={2000}
          max={2100}
          defaultValue={existing?.startYear}
        />
        <Input
          label="End Year"
          name="endYear"
          type="number"
          required
          placeholder="2026"
          min={2000}
          max={2100}
          defaultValue={existing?.endYear}
        />
      </div>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <Button
        type="submit"
        variant="primary"
        className="w-full"
        isLoading={isPending}
      >
        {existing ? "Update Batch" : "Create Batch"}
      </Button>
    </form>
  );
}
