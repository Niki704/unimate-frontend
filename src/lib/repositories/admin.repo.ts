// ============================================================
// One function per AdminController endpoint. Every one of these
// requires ADMIN role on the backend (class-level @PreAuthorize)
// — calling these as a non-admin returns a 403 ApiError.
// ============================================================

import { apiFetch } from "@/lib/api-client";
import type { AdminResponseDTO, PendingApprovalsResponseDTO } from "@/types/admin";

export const adminRepo = {
  getById: (id: number) => apiFetch<AdminResponseDTO>(`/api/v1/admins/${id}`),

  getAll: () => apiFetch<AdminResponseDTO[]>("/api/v1/admins"),

  getPendingApprovals: () =>
    apiFetch<PendingApprovalsResponseDTO>("/api/v1/admins/pending-approvals"),
};