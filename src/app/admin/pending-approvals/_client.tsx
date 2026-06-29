"use client";

import { useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { EmptyState } from "@/components/ui/empty-state";
import { ApproveStudentForm } from "@/components/forms/approve-student-form";
import { useToast } from "@/components/ui/toast";
import { handleActionState } from "@/lib/toast-utils";
import {
  approveLecturerAction,
  rejectLecturerAction,
} from "@/actions/lecturer.actions";
import type { StudentResponseDTO } from "@/types/student";
import type { LecturerResponseDTO } from "@/types/lecturer";
import type { BatchResponseDTO } from "@/types/batch";
import { useRouter } from "next/navigation";

interface Props {
  pendingStudents: StudentResponseDTO[];
  pendingLecturers: LecturerResponseDTO[];
  batches: BatchResponseDTO[];
}

export function PendingApprovalsClient({
  pendingStudents,
  pendingLecturers,
  batches,
}: Props) {
  const router = useRouter();

  function refresh() {
    router.refresh();
  }

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-3">
          Pending Students{" "}
          <span className="ml-1 text-sm font-normal text-slate-500">
            ({pendingStudents.length})
          </span>
        </h2>
        {pendingStudents.length === 0 ? (
          <EmptyState
            title="No pending students"
            description="All student registrations have been reviewed."
          />
        ) : (
          <div className="space-y-2">
            {pendingStudents.map((s) => (
              <StudentApprovalRow
                key={s.id}
                student={s}
                batches={batches}
                onSuccess={refresh}
              />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-base font-semibold text-slate-900 mb-3">
          Pending Lecturers{" "}
          <span className="ml-1 text-sm font-normal text-slate-500">
            ({pendingLecturers.length})
          </span>
        </h2>
        {pendingLecturers.length === 0 ? (
          <EmptyState
            title="No pending lecturers"
            description="All lecturer registrations have been reviewed."
          />
        ) : (
          <div className="space-y-2">
            {pendingLecturers.map((l) => (
              <LecturerApprovalRow
                key={l.id}
                lecturer={l}
                onSuccess={refresh}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

// ─── Student Row ──────────────────────────────────────────────────────────────

function StudentApprovalRow({
  student,
  batches,
  onSuccess,
}: {
  student: StudentResponseDTO;
  batches: BatchResponseDTO[];
  onSuccess: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
        <div>
          <p className="text-sm font-medium text-slate-900">
            {student.firstName} {student.lastName}
          </p>
          <p className="text-xs text-slate-500">
            {student.email} · Enrolled {student.enrollmentYear}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
          Review
        </Button>
      </div>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Approve Student"
        size="sm"
      >
        <ApproveStudentForm
          studentId={student.id}
          studentName={`${student.firstName} ${student.lastName}`}
          batches={batches}
          onSuccess={() => {
            setOpen(false);
            onSuccess();
          }}
        />
      </Modal>
    </>
  );
}

// ─── Lecturer Row ─────────────────────────────────────────────────────────────

function LecturerApprovalRow({
  lecturer,
  onSuccess,
}: {
  lecturer: LecturerResponseDTO;
  onSuccess: () => void;
}) {
  const { addToast } = useToast();
  const [isPending, startTransition] = useTransition();

  function handle(approve: boolean) {
    startTransition(async () => {
      const result = approve
        ? await approveLecturerAction(lecturer.id)
        : await rejectLecturerAction(lecturer.id);
      handleActionState(
        result,
        addToast,
        approve ? "Lecturer approved." : "Lecturer rejected.",
      );
      if (!result.error) onSuccess();
    });
  }

  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <div>
        <p className="text-sm font-medium text-slate-900">
          {lecturer.firstName} {lecturer.lastName}
        </p>
        <p className="text-xs text-slate-500">
          {lecturer.email} · {lecturer.department}
        </p>
      </div>
      <div className="flex gap-2">
        <Button
          variant="danger"
          size="sm"
          disabled={isPending}
          onClick={() => handle(false)}
        >
          <XCircle className="h-3.5 w-3.5" /> Reject
        </Button>
        <Button
          variant="primary"
          size="sm"
          isLoading={isPending}
          onClick={() => handle(true)}
        >
          <CheckCircle className="h-3.5 w-3.5" /> Approve
        </Button>
      </div>
    </div>
  );
}
