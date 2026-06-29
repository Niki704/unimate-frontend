// ============================================================
// userId always comes from the signed-in session, never a form
// field — there's no "edit someone else's profile" path on the
// frontend to begin with, on top of ProfileService's own
// ownership check on the backend.
//
// NOTE: only revalidates /student/profile — the original Phase 8
// plan didn't list lecturer/admin profile pages even though the
// backend supports any role. Add more revalidatePath calls here
// if/when those pages get built.
// ============================================================

"use server";

import { revalidatePath } from "next/cache";
import { profileRepo } from "@/lib/repositories/profile.repo";
import { getSessionUser } from "@/lib/session";
import { ApiError } from "@/lib/api-client";

export interface ActionState {
  error: string | null;
}

export async function upsertProfileAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await getSessionUser();
  if (!user) {
    return { error: "You must be signed in to do this." };
  }

  const bio = formData.get("bio");
  const profilePictureUrl = formData.get("profilePictureUrl");
  const address = formData.get("address");
  const githubUrl = formData.get("githubUrl");
  const linkedinUrl = formData.get("linkedinUrl");
  const facebookUrl = formData.get("facebookUrl");
  const xUrl = formData.get("xUrl");
  const youtubeUrl = formData.get("youtubeUrl");

  const asOptionalString = (v: FormDataEntryValue | null): string | undefined =>
    typeof v === "string" && v ? v : undefined;

  try {
    await profileRepo.upsert(user.userId, {
      bio: asOptionalString(bio),
      profilePictureUrl: asOptionalString(profilePictureUrl),
      address: asOptionalString(address),
      githubUrl: asOptionalString(githubUrl),
      linkedinUrl: asOptionalString(linkedinUrl),
      facebookUrl: asOptionalString(facebookUrl),
      xUrl: asOptionalString(xUrl),
      youtubeUrl: asOptionalString(youtubeUrl),
    });
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Something went wrong." };
  }

  revalidatePath("/student/profile");
  return { error: null };
}