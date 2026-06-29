"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Modal, ConfirmModal } from "@/components/ui/modal";
import { EmptyState } from "@/components/ui/empty-state";
import { RoleBadge } from "@/components/ui/badge";
import { AnnouncementForm } from "@/components/forms/announcement-form";
import { useToast } from "@/components/ui/toast";
import { handleActionState } from "@/lib/toast-utils";
import { deleteAnnouncementAction } from "@/actions/announcement.actions";
import { format, parseISO } from "date-fns";
import type { AnnouncementResponseDTO } from "@/types/announcement";
import type { BatchResponseDTO } from "@/types/batch";

interface Props {
  announcements: AnnouncementResponseDTO[];
  availableBatches: BatchResponseDTO[];
}

export function AnnouncementsClient({
  announcements,
  availableBatches,
}: Props) {
  const router = useRouter();
  const { addToast } = useToast();
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (deleteTarget === null) return;
    startTransition(async () => {
      const result = await deleteAnnouncementAction(deleteTarget);
      handleActionState(result, addToast, "Announcement deleted.");
      setDeleteTarget(null);
      if (!result.error) router.refresh();
    });
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button variant="primary" size="sm" onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4" /> New Announcement
        </Button>
      </div>

      {announcements.length === 0 ? (
        <EmptyState
          title="No announcements yet"
          description="Post the first announcement for your batches."
          action={{
            label: "Create Announcement",
            onClick: () => setCreateOpen(true),
          }}
        />
      ) : (
        <div className="space-y-3">
          {announcements.map((a) => (
            <Card key={a.id}>
              <CardContent className="pt-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-slate-900 truncate">
                        {a.title}
                      </h3>
                      <RoleBadge role={a.createdByRole} />
                    </div>
                    <p className="text-sm text-slate-600 line-clamp-2 mb-2">
                      {a.content}
                    </p>
                    <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                      <span>{format(parseISO(a.date), "MMM d, yyyy")}</span>
                      {a.expiryDate && (
                        <span>
                          Expires{" "}
                          {format(parseISO(a.expiryDate), "MMM d, yyyy")}
                        </span>
                      )}
                      <span>By {a.createdByName}</span>
                      {a.targetBatchCodes.length > 0 && (
                        <span>Batches: {a.targetBatchCodes.join(", ")}</span>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="icon"
                    size="sm"
                    onClick={() => setDeleteTarget(a.id)}
                    className="text-red-500 hover:text-red-700 border-red-200 hover:bg-red-50"
                    aria-label="Delete announcement"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="New Announcement"
        size="md"
      >
        <AnnouncementForm
          availableBatches={availableBatches}
          onSuccess={() => {
            setCreateOpen(false);
            router.refresh();
          }}
        />
      </Modal>

      <ConfirmModal
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Announcement"
        description="This announcement will be permanently removed."
        confirmLabel="Delete"
        isDestructive
        isPending={isPending}
      />
    </>
  );
}
