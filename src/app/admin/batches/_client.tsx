"use client";

import { useState } from "react";
import { Plus, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeaderCell,
  TableCell,
} from "@/components/ui/table";
import { BatchTypeBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { EmptyState } from "@/components/ui/empty-state";
import { BatchForm } from "@/components/forms/batch-form";
import { PageHeader } from "@/components/layout/dashboard-shell";
import type { BatchResponseDTO } from "@/types/batch";

interface Props {
  batches: BatchResponseDTO[];
}

export function BatchesClient({ batches }: Props) {
  const router = useRouter();
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<BatchResponseDTO | null>(null);

  return (
    <>
      <PageHeader
        title="Batches"
        description={`${batches.length} batch${batches.length !== 1 ? "es" : ""} configured`}
        actions={
          <Button
            variant="primary"
            size="sm"
            onClick={() => setCreateOpen(true)}
          >
            <Plus className="h-4 w-4" /> New Batch
          </Button>
        }
      />

      {batches.length === 0 ? (
        <EmptyState
          title="No batches yet"
          description="Create the first batch to get started."
          action={{ label: "Create Batch", onClick: () => setCreateOpen(true) }}
        />
      ) : (
        <Table>
          <TableHead>
            <tr>
              <TableHeaderCell>Code</TableHeaderCell>
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell>Type</TableHeaderCell>
              <TableHeaderCell>Years</TableHeaderCell>
              <TableHeaderCell>Lecturers</TableHeaderCell>
              <TableHeaderCell>Students</TableHeaderCell>
              <TableHeaderCell>Actions</TableHeaderCell>
            </tr>
          </TableHead>
          <TableBody>
            {batches.map((b) => (
              <TableRow key={b.id}>
                <TableCell className="font-medium text-slate-900">
                  {b.batchCode}
                </TableCell>
                <TableCell>{b.name}</TableCell>
                <TableCell>
                  <BatchTypeBadge type={b.batchType} />
                </TableCell>
                <TableCell>
                  {b.startYear}–{b.endYear}
                </TableCell>
                <TableCell>
                  {b.lecturerNames.length > 0 ? (
                    b.lecturerNames.join(", ")
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </TableCell>
                <TableCell>{b.studentCount}</TableCell>
                <TableCell>
                  <Button
                    variant="icon"
                    size="sm"
                    onClick={() => setEditing(b)}
                    aria-label="Edit batch"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Create modal */}
      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create Batch"
        size="sm"
      >
        <BatchForm
          onSuccess={() => {
            setCreateOpen(false);
            router.refresh();
          }}
        />
      </Modal>

      {/* Edit modal */}
      {editing && (
        <Modal
          open={!!editing}
          onClose={() => setEditing(null)}
          title="Edit Batch"
          size="sm"
        >
          <BatchForm
            existing={editing}
            onSuccess={() => {
              setEditing(null);
              router.refresh();
            }}
          />
        </Modal>
      )}
    </>
  );
}
