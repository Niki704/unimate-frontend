import { getSessionUser } from "@/lib/session";
import { lecturerRepo } from "@/lib/repositories/lecturer.repo";
import { batchRepo } from "@/lib/repositories/batch.repo";
import { announcementRepo } from "@/lib/repositories/announcement.repo";
import { PageHeader } from "@/components/layout/dashboard-shell";
import { AnnouncementsClient } from "./_client";

export default async function LecturerAnnouncementsPage() {
  const user = await getSessionUser();
  const lecturer = await lecturerRepo.getById(user!.userId);

  const myBatches =
    lecturer.batchIds.length > 0
      ? await Promise.all(lecturer.batchIds.map((id) => batchRepo.getById(id)))
      : [];

  const announcements = await announcementRepo.getAll();

  return (
    <div>
      <PageHeader
        title="Announcements"
        description="Post and manage announcements for your batches."
      />
      <AnnouncementsClient
        announcements={announcements}
        availableBatches={myBatches}
      />
    </div>
  );
}
