// ============================================================
// skills/attachments/projectLinks are Set<String> on the
// backend — parseTagList() below assumes a plain comma-
// separated text input ("React, TypeScript, SQL") as the
// simplest default. If a nicer tag-input widget is built later
// that submits multiple values under the same field name
// instead, swap this for formData.getAll(...).
// ============================================================

"use server";

import { revalidatePath } from "next/cache";
import { portfolioRepo } from "@/lib/repositories/portfolio.repo";
import { getSessionUser } from "@/lib/session";
import { ApiError } from "@/lib/api-client";

export interface ActionState {
  error: string | null;
}

function parseTagList(raw: FormDataEntryValue | null): string[] | undefined {
  if (typeof raw !== "string" || !raw.trim()) return undefined;
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function createPortfolioAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await getSessionUser();
  if (!user) {
    return { error: "You must be signed in to do this." };
  }

  try {
    await portfolioRepo.create({
      skills: parseTagList(formData.get("skills")),
      attachments: parseTagList(formData.get("attachments")),
      projectLinks: parseTagList(formData.get("projectLinks")),
    });
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Something went wrong." };
  }

  revalidatePath("/student/portfolio");
  return { error: null };
}

export async function updatePortfolioAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await getSessionUser();
  if (!user) {
    return { error: "You must be signed in to do this." };
  }

  try {
    await portfolioRepo.update(user.userId, {
      skills: parseTagList(formData.get("skills")),
      attachments: parseTagList(formData.get("attachments")),
      projectLinks: parseTagList(formData.get("projectLinks")),
    });
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Something went wrong." };
  }

  revalidatePath("/student/portfolio");
  return { error: null };
}