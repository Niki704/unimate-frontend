import { getSessionUser } from "@/lib/session";
import { studentRepo } from "@/lib/repositories/student.repo";
import { announcementRepo } from "@/lib/repositories/announcement.repo";
import { PageHeader } from "@/components/layout/dashboard-shell";
import { Card, CardContent } from "@/components/ui/card";
import { RoleBadge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { format, parseISO } from "date-fns";

export default async function StudentAnnouncementsPage() {
  const user = await getSessionUser();
  const student = await studentRepo.getById(user!.userId);
  const announcements = await announcementRepo.getAll(
    student.batchId ?? undefined,
  );

  return (
    <div>
      <PageHeader
        title="Announcements"
        description={`${announcements.length} announcement${announcements.length !== 1 ? "s" : ""}`}
      />
      {announcements.length === 0 ? (
        <EmptyState
          title="No announcements"
          description="Check back later for updates from your lecturers."
        />
      ) : (
        <div className="space-y-3">
          {announcements.map((a) => (
            <Card key={a.id}>
              <CardContent className="pt-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-slate-900">
                        {a.title}
                      </h3>
                      <RoleBadge role={a.createdByRole} />
                    </div>
                    <p className="text-sm text-slate-600 mb-3">{a.content}</p>
                    <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                      <span>{format(parseISO(a.date), "MMM d, yyyy")}</span>
                      {a.expiryDate && (
                        <span>
                          Expires{" "}
                          {format(parseISO(a.expiryDate), "MMM d, yyyy")}
                        </span>
                      )}
                      <span>Posted by {a.createdByName}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
