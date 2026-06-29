import { getSessionUser } from "@/lib/session";
import { profileRepo } from "@/lib/repositories/profile.repo";
import { PageHeader } from "@/components/layout/dashboard-shell";
import { ProfileClient } from "./_client";
import type { ProfileResponseDTO } from "@/types/profile";

export default async function StudentProfilePage() {
  const user = await getSessionUser();

  let profile: ProfileResponseDTO | null = null;
  try {
    profile = await profileRepo.getByUserId(user!.userId);
  } catch {
    // 404 = profile not created yet
  }

  return (
    <div>
      <PageHeader
        title="My Profile"
        description="Manage your public profile information."
      />
      <ProfileClient existing={profile} />
    </div>
  );
}
