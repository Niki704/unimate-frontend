import Link from "next/link";
import { Users, GraduationCap, Clock, BookOpen } from "lucide-react";
import { adminRepo } from "@/lib/repositories/admin.repo";
import { batchRepo } from "@/lib/repositories/batch.repo";
import { getSessionUser } from "@/lib/session";
import { StatCard } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/dashboard-shell";
import { AccountStatusBadge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";

export default async function AdminDashboardPage() {
  const user = await getSessionUser();
  const [{ pendingStudents, pendingLecturers }, batches] = await Promise.all([
    adminRepo.getPendingApprovals(),
    batchRepo.getAll(),
  ]);

  const recentStudents = pendingStudents.slice(0, 5);
  const recentLecturers = pendingLecturers.slice(0, 5);

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${user?.email}`}
        description="Here's what needs your attention today."
      />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 mb-8">
        <StatCard
          label="Pending Students"
          value={pendingStudents.length}
          icon={<GraduationCap className="h-5 w-5" />}
        />
        <StatCard
          label="Pending Lecturers"
          value={pendingLecturers.length}
          icon={<Users className="h-5 w-5" />}
        />
        <StatCard
          label="Total Batches"
          value={batches.length}
          icon={<BookOpen className="h-5 w-5" />}
        />
        <StatCard
          label="Pending Total"
          value={pendingStudents.length + pendingLecturers.length}
          icon={<Clock className="h-5 w-5" />}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Pending students preview */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-slate-900">
              Pending Students
            </h2>
            <Link
              href="/admin/pending-approvals"
              className="text-xs text-slate-500 hover:text-slate-900"
            >
              View all →
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {recentStudents.length === 0 && (
              <p className="px-5 py-6 text-sm text-slate-400 text-center">
                No pending students.
              </p>
            )}
            {recentStudents.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between px-5 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {s.firstName} {s.lastName}
                  </p>
                  <p className="text-xs text-slate-500">{s.email}</p>
                </div>
                <AccountStatusBadge status={s.accountStatus} />
              </div>
            ))}
          </div>
        </div>

        {/* Pending lecturers preview */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-slate-900">
              Pending Lecturers
            </h2>
            <Link
              href="/admin/pending-approvals"
              className="text-xs text-slate-500 hover:text-slate-900"
            >
              View all →
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {recentLecturers.length === 0 && (
              <p className="px-5 py-6 text-sm text-slate-400 text-center">
                No pending lecturers.
              </p>
            )}
            {recentLecturers.map((l) => (
              <div
                key={l.id}
                className="flex items-center justify-between px-5 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {l.firstName} {l.lastName}
                  </p>
                  <p className="text-xs text-slate-500">{l.department}</p>
                </div>
                <AccountStatusBadge status={l.accountStatus} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
