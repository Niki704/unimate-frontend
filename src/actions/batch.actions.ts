// ============================================================
// Only create/update — reads (getById, getAll, getStudents,
// getLecturers) are called directly from Server Components via
// batchRepo, per the architecture's read/write split. No
// admin-only check inside these — Spring's own
// @PreAuthorize("hasRole('ADMIN')") is the real enforcement.
// ============================================================

"use server";

import { revalidatePath } from "next/cache";
import { batchRepo } from "@/lib/repositories/batch.repo";
import { ApiError } from "@/lib/api-client";
import type { BatchType } from "@/types/enums";

export interface ActionState {
  error: string | null;
}

const VALID_BATCH_TYPES: BatchType[] = ["SOC", "SOL", "SOB"];

export async function createBatchAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const batchCode = formData.get("batchCode");
  const name = formData.get("name");
  const batchType = formData.get("batchType");
  const startYear = formData.get("startYear");
  const endYear = formData.get("endYear");

  if (
    typeof batchCode !== "string" || !batchCode ||
    typeof name !== "string" || !name ||
    typeof batchType !== "string" || !VALID_BATCH_TYPES.includes(batchType as BatchType) ||
    typeof startYear !== "string" || !startYear ||
    typeof endYear !== "string" || !endYear
  ) {
    return { error: "All fields are required, and batch type must be valid" };
  }

  try {
    await batchRepo.create({
      batchCode,
      name,
      batchType: batchType as BatchType,
      startYear: Number(startYear),
      endYear: Number(endYear),
    });
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Something went wrong." };
  }

  revalidatePath("/admin/batches");
  return { error: null };
}

export async function updateBatchAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  // Expects a hidden batchId field alongside the visible fields.
  const batchId = formData.get("batchId");
  const batchCode = formData.get("batchCode");
  const name = formData.get("name");
  const batchType = formData.get("batchType");
  const startYear = formData.get("startYear");
  const endYear = formData.get("endYear");

  if (
    typeof batchId !== "string" || !batchId ||
    typeof batchCode !== "string" || !batchCode ||
    typeof name !== "string" || !name ||
    typeof batchType !== "string" || !VALID_BATCH_TYPES.includes(batchType as BatchType) ||
    typeof startYear !== "string" || !startYear ||
    typeof endYear !== "string" || !endYear
  ) {
    return { error: "All fields are required, and batch type must be valid" };
  }

  try {
    await batchRepo.update(Number(batchId), {
      batchCode,
      name,
      batchType: batchType as BatchType,
      startYear: Number(startYear),
      endYear: Number(endYear),
    });
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Something went wrong." };
  }

  revalidatePath("/admin/batches");
  return { error: null };
}