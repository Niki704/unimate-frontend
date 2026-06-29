// ============================================================
// Combines StudentFeedback + BatchFeedback actions, matching
// how types/feedback.ts already combines both. Badges use
// formData.getAll("badges") (multiple checkboxes sharing one
// name) since it's a closed enum set — a more natural UI fit
// than the comma-separated text pattern used for portfolio's
// free-text skills/attachments.
// ============================================================

"use server";

import { revalidatePath } from "next/cache";
import { studentFeedbackRepo } from "@/lib/repositories/student-feedback.repo";
import { batchFeedbackRepo } from "@/lib/repositories/batch-feedback.repo";
import { getSessionUser } from "@/lib/session";
import { ApiError } from "@/lib/api-client";
import type { StudentRating, Badge } from "@/types/enums";

export interface ActionState {
  error: string | null;
}

const VALID_RATINGS: StudentRating[] = ["EXCELLENT", "GOOD", "MODERATE", "LOW"];
const VALID_BADGES: Badge[] = ["TEAM_WORK", "AGILE", "COLLABORATIVE", "SUPPORTIVE", "ON_TIME"];

export async function createStudentFeedbackAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await getSessionUser();
  if (!user) {
    return { error: "You must be signed in to do this." };
  }

  const date = formData.get("date");
  const content = formData.get("content");
  const studentRating = formData.get("studentRating");
  const studentId = formData.get("studentId");

  if (
    typeof date !== "string" || !date ||
    typeof content !== "string" || !content ||
    typeof studentRating !== "string" || !VALID_RATINGS.includes(studentRating as StudentRating) ||
    typeof studentId !== "string" || !studentId
  ) {
    return { error: "All fields are required, and rating must be valid" };
  }

  try {
    await studentFeedbackRepo.create({
      date,
      content,
      studentRating: studentRating as StudentRating,
      studentId: Number(studentId),
    });
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Something went wrong." };
  }

  revalidatePath("/lecturer/feedback/student");
  return { error: null };
}

export async function createBatchFeedbackAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await getSessionUser();
  if (!user) {
    return { error: "You must be signed in to do this." };
  }

  const date = formData.get("date");
  const content = formData.get("content");
  const batchId = formData.get("batchId");
  const badgesRaw = formData.getAll("badges"); // multiple checkboxes, same name="badges"

  if (
    typeof date !== "string" || !date ||
    typeof content !== "string" || !content ||
    typeof batchId !== "string" || !batchId
  ) {
    return { error: "Date, content, and batch are required" };
  }

  const badges = badgesRaw
    .filter((b): b is string => typeof b === "string" && VALID_BADGES.includes(b as Badge))
    .map((b) => b as Badge);

  try {
    await batchFeedbackRepo.create({
      date,
      content,
      badges: badges.length > 0 ? badges : undefined,
      batchId: Number(batchId),
    });
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Something went wrong." };
  }

  revalidatePath("/lecturer/feedback/batch");
  return { error: null };
}