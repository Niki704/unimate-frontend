import Link from "next/link";
import { getSessionUser } from "@/lib/session";
import { lecturerRepo } from "@/lib/repositories/lecturer.repo";
import { batchRepo } from "@/lib/repositories/batch.repo";
import { announcementRepo } from "@/lib/repositories/announcement.repo";
import { PageHeader } from "@/components/layout/dashboard-shell";
import {
  StatCard,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { BatchTypeBadge } from "@/components/ui/badge";
import { BookOpen, Megaphone, MessageSquare } from "lucide-react";
import { format, parseISO } from "date-fns";

export default async function LecturerDashboardPage() {
  const user = await getSessionUser();
  const [lecturer, announcements] = await Promise.all([
    lecturerRepo.getById(user!.userId),
    announcementRepo.getAll(),
  ]);

  const myBatches =
    lecturer.batchIds.length > 0
      ? await Promise.all(lecturer.batchIds.map((id) => batchRepo.getById(id)))
      : [];

  const recentAnnouncements = announcements.slice(0, 4);

  return (
    <div>
      <PageHeader
        title={`Welcome, ${lecturer.firstName}!`}
        description={`${lecturer.department} Department`}
      />

      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard
          label="My Batches"
          value={myBatches.length}
          icon={<BookOpen className="h-5 w-5" />}
        />
        <StatCard
          label="Announcements"
          value={recentAnnouncements.length}
          icon={<Megaphone className="h-5 w-5" />}
        />
        <StatCard
          label="Feedback Actions"
          value={myBatches.length}
          icon={<MessageSquare className="h-5 w-5" />}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>My Batches</CardTitle>
              <Link
                href="/lecturer/batches"
                className="text-xs text-slate-500 hover:text-slate-900"
              >
                View all →
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {myBatches.length === 0 ? (
              <p className="px-5 py-6 text-sm text-slate-400 text-center">
                No batches assigned yet.
              </p>
            ) : (
              <div className="divide-y divide-slate-50">
                {myBatches.slice(0, 4).map((b) => (
                  <div
                    key={b.id}
                    className="flex items-center justify-between px-5 py-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {b.batchCode}
                      </p>
                      <p className="text-xs text-slate-500">
                        {b.name} · {b.studentCount} students
                      </p>
                    </div>
                    <BatchTypeBadge type={b.batchType} />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Announcements</CardTitle>
              <Link
                href="/lecturer/announcements"
                className="text-xs text-slate-500 hover:text-slate-900"
              >
                View all →
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {recentAnnouncements.length === 0 ? (
              <p className="px-5 py-6 text-sm text-slate-400 text-center">
                No announcements yet.
              </p>
            ) : (
              <div className="divide-y divide-slate-50">
                {recentAnnouncements.map((a) => (
                  <div key={a.id} className="px-5 py-3">
                    <p className="text-sm font-medium text-slate-900">
                      {a.title}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {format(parseISO(a.date), "MMM d, yyyy")}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
