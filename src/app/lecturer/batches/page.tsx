import Link from "next/link";
import { getSessionUser } from "@/lib/session";
import { lecturerRepo } from "@/lib/repositories/lecturer.repo";
import { batchRepo } from "@/lib/repositories/batch.repo";
import { PageHeader } from "@/components/layout/dashboard-shell";
import { Card, CardContent } from "@/components/ui/card";
import { BatchTypeBadge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { MessageSquare, Users } from "lucide-react";

export default async function LecturerBatchesPage() {
  const user = await getSessionUser();
  const lecturer = await lecturerRepo.getById(user!.userId);

  const myBatches =
    lecturer.batchIds.length > 0
      ? await Promise.all(lecturer.batchIds.map((id) => batchRepo.getById(id)))
      : [];

  return (
    <div>
      <PageHeader
        title="My Batches"
        description={`${myBatches.length} batch${myBatches.length !== 1 ? "es" : ""} assigned to you`}
      />
      {myBatches.length === 0 ? (
        <EmptyState
          title="No batches assigned"
          description="Contact an admin to be assigned to a batch."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {myBatches.map((b) => (
            <Card key={b.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-base font-semibold text-slate-900">
                      {b.batchCode}
                    </p>
                    <p className="text-sm text-slate-500 mt-0.5">{b.name}</p>
                  </div>
                  <BatchTypeBadge type={b.batchType} />
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  {b.startYear}–{b.endYear} · {b.studentCount} students
                </p>
                <div className="flex gap-2">
                  <Link
                    href={`/lecturer/feedback/student?batchId=${b.id}`}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <Users className="h-3.5 w-3.5" /> Student Feedback
                  </Link>
                  <Link
                    href={`/lecturer/feedback/batch?batchId=${b.id}`}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <MessageSquare className="h-3.5 w-3.5" /> Batch Feedback
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
