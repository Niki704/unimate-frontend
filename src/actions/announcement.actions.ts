// ============================================================
// NOTE: the backend allows ADMIN to create announcements too
// (hasAnyRole('LECTURER','ADMIN')), but the original Phase 8
// plan only listed a lecturer/announcements page. This action
// doesn't care which page calls it — just flagging the same gap
// as ProfileController above.
// ============================================================

"use server";

import { revalidatePath } from "next/cache";
import { announcementRepo } from "@/lib/repositories/announcement.repo";
import { getSessionUser } from "@/lib/session";
import { ApiError } from "@/lib/api-client";

export interface ActionState {
  error: string | null;
}

function parseIdList(raw: FormDataEntryValue | null): number[] | undefined {
  if (typeof raw !== "string" || !raw.trim()) return undefined;
  return raw
    .split(",")
    .map((s) => Number(s.trim()))
    .filter((n) => !Number.isNaN(n));
}

export async function createAnnouncementAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await getSessionUser();
  if (!user) {
    return { error: "You must be signed in to do this." };
  }

  const title = formData.get("title");
  const content = formData.get("content");
  const date = formData.get("date");
  const expiryDate = formData.get("expiryDate");

  if (
    typeof title !== "string" || !title ||
    typeof content !== "string" || !content ||
    typeof date !== "string" || !date
  ) {
    return { error: "Title, content, and date are required" };
  }

  try {
    await announcementRepo.create({
      title,
      content,
      date,
      expiryDate: typeof expiryDate === "string" && expiryDate ? expiryDate : undefined,
      batchIds: parseIdList(formData.get("batchIds")),
      studentIds: parseIdList(formData.get("studentIds")),
    });
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Something went wrong." };
  }

  revalidatePath("/lecturer/announcements");
  revalidatePath("/student/announcements");
  return { error: null };
}

export async function deleteAnnouncementAction(announcementId: number): Promise<ActionState> {
  try {
    await announcementRepo.remove(announcementId);
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Something went wrong." };
  }

  revalidatePath("/lecturer/announcements");
  revalidatePath("/student/announcements");
  return { error: null };
}