"use client";

import { useState } from "react";
import { Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeaderCell,
  TableCell,
} from "@/components/ui/table";
import { AccountStatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { EmptyState } from "@/components/ui/empty-state";
import { LecturerAssignForm } from "@/components/forms/lecturer-assign-form";
import { format, parseISO } from "date-fns";
import type { LecturerResponseDTO } from "@/types/lecturer";
import type { BatchResponseDTO } from "@/types/batch";

interface Props {
  lecturers: LecturerResponseDTO[];
  allBatches: BatchResponseDTO[];
}

export function LecturersClient({ lecturers, allBatches }: Props) {
  const router = useRouter();
  const [selected, setSelected] = useState<LecturerResponseDTO | null>(null);

  if (lecturers.length === 0) {
    return (
      <EmptyState
        title="No lecturers yet"
        description="Lecturers will appear here once they register."
      />
    );
  }

  return (
    <>
      <Table>
        <TableHead>
          <tr>
            <TableHeaderCell>Name</TableHeaderCell>
            <TableHeaderCell>Email</TableHeaderCell>
            <TableHeaderCell>Department</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
            <TableHeaderCell>Batches</TableHeaderCell>
            <TableHeaderCell>Verified By</TableHeaderCell>
            <TableHeaderCell>Registered</TableHeaderCell>
            <TableHeaderCell>Assign</TableHeaderCell>
          </tr>
        </TableHead>
        <TableBody>
          {lecturers.map((l) => (
            <TableRow key={l.id}>
              <TableCell className="font-medium text-slate-900">
                {l.firstName} {l.lastName}
              </TableCell>
              <TableCell>{l.email}</TableCell>
              <TableCell>{l.department}</TableCell>
              <TableCell>
                <AccountStatusBadge status={l.accountStatus} />
              </TableCell>
              <TableCell>
                {l.batchCodes.length > 0 ? (
                  l.batchCodes.join(", ")
                ) : (
                  <span className="text-slate-400">—</span>
                )}
              </TableCell>
              <TableCell>
                {l.verifiedByName ?? <span className="text-slate-400">—</span>}
              </TableCell>
              <TableCell className="text-slate-500">
                {format(parseISO(l.createdDate), "MMM d, yyyy")}
              </TableCell>
              <TableCell>
                <Button
                  variant="icon"
                  size="sm"
                  onClick={() => setSelected(l)}
                  aria-label="Manage batches"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selected && (
        <Modal
          open={!!selected}
          onClose={() => setSelected(null)}
          title="Manage Batch Assignments"
          size="md"
        >
          <LecturerAssignForm
            lecturerId={selected.id}
            lecturerName={`${selected.firstName} ${selected.lastName}`}
            allBatches={allBatches}
            assignedBatchIds={selected.batchIds}
            onSuccess={() => {
              setSelected(null);
              router.refresh();
            }}
          />
        </Modal>
      )}
    </>
  );
}
