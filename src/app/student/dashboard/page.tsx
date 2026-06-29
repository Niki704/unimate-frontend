import Link from "next/link";
import { getSessionUser } from "@/lib/session";
import { studentRepo } from "@/lib/repositories/student.repo";
import { announcementRepo } from "@/lib/repositories/announcement.repo";
import { PageHeader } from "@/components/layout/dashboard-shell";
import { Card, CardContent, StatCard } from "@/components/ui/card";
import { AccountStatusBadge } from "@/components/ui/badge";
import { Briefcase, User, Megaphone, BookOpen } from "lucide-react";
import { format, parseISO } from "date-fns";

export default async function StudentDashboardPage() {
  const user = await getSessionUser();
  const student = await studentRepo.getById(user!.userId);
  const announcements = await announcementRepo.getAll(
    student.batchId ?? undefined,
  );
  const recentAnnouncements = announcements.slice(0, 4);

  return (
    <div>
      <PageHeader
        title={`Welcome, ${student.firstName}!`}
        description={
          student.batchCode
            ? `Batch: ${student.batchCode}`
            : "Not yet assigned to a batch"
        }
      />

      {/* Status cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 mb-8">
        <StatCard
          label="Batch"
          value={student.batchCode ?? "—"}
          icon={<BookOpen className="h-5 w-5" />}
        />
        <StatCard
          label="Status"
          value={student.accountStatus}
          icon={<AccountStatusBadge status={student.accountStatus} />}
        />
        <StatCard
          label="Enrolled"
          value={student.enrollmentYear}
          icon={<User className="h-5 w-5" />}
        />
        <StatCard
          label="Announcements"
          value={recentAnnouncements.length}
          icon={<Megaphone className="h-5 w-5" />}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Quick links */}
        <Card>
          <CardContent className="pt-5">
            <h2 className="text-sm font-semibold text-slate-900 mb-4">
              Quick Links
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  href: "/student/portfolio",
                  label: "My Portfolio",
                  icon: Briefcase,
                },
                { href: "/student/profile", label: "My Profile", icon: User },
                {
                  href: "/student/announcements",
                  label: "Announcements",
                  icon: Megaphone,
                },
              ].map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 p-4 hover:bg-slate-50 transition-colors text-center"
                >
                  <Icon className="h-6 w-6 text-slate-500" />
                  <span className="text-sm font-medium text-slate-700">
                    {label}
                  </span>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent announcements */}
        <Card>
          <CardContent className="p-0">
            <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-slate-100">
              <h2 className="text-sm font-semibold text-slate-900">
                Announcements
              </h2>
              <Link
                href="/student/announcements"
                className="text-xs text-slate-500 hover:text-slate-900"
              >
                View all →
              </Link>
            </div>
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
