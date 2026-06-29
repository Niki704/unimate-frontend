// ============================================================
// One function per AnnouncementController endpoint. getAll()
// takes an optional batchId, matching the Controller's single
// GET method with an optional query param rather than two routes.
// ============================================================

import { apiFetch } from "@/lib/api-client";
import type { AnnouncementRequestDTO, AnnouncementResponseDTO } from "@/types/announcement";

export const announcementRepo = {
  create: (dto: AnnouncementRequestDTO) =>
    apiFetch<AnnouncementResponseDTO>("/api/v1/announcements", {
      method: "POST",
      body: dto,
    }),

  getById: (id: number) =>
    apiFetch<AnnouncementResponseDTO>(`/api/v1/announcements/${id}`),

  getAll: (batchId?: number) =>
    apiFetch<AnnouncementResponseDTO[]>(
      batchId ? `/api/v1/announcements?batchId=${batchId}` : "/api/v1/announcements"
    ),

  remove: (id: number) =>
    apiFetch<void>(`/api/v1/announcements/${id}`, {
      method: "DELETE",
    }),
};