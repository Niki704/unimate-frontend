// ============================================================
// One function per LecturerController endpoint. approve() takes
// no body — matches the backend's deliberate lack of a
// LecturerApproveRequestDTO.
// ============================================================

import { apiFetch } from "@/lib/api-client";
import type {
  LecturerRegisterRequestDTO,
  LecturerUpdateRequestDTO,
  LecturerResponseDTO,
} from "@/types/lecturer";

export const lecturerRepo = {
  register: (dto: LecturerRegisterRequestDTO) =>
    apiFetch<LecturerResponseDTO>("/api/v1/lecturers/register", {
      method: "POST",
      body: dto,
      skipAuth: true,
    }),

  getById: (id: number) => apiFetch<LecturerResponseDTO>(`/api/v1/lecturers/${id}`),

  getAll: () => apiFetch<LecturerResponseDTO[]>("/api/v1/lecturers"),

  approve: (id: number) =>
    apiFetch<LecturerResponseDTO>(`/api/v1/lecturers/${id}/approve`, {
      method: "PATCH",
    }),

  reject: (id: number) =>
    apiFetch<LecturerResponseDTO>(`/api/v1/lecturers/${id}/reject`, {
      method: "POST",
    }),

  update: (id: number, dto: LecturerUpdateRequestDTO) =>
    apiFetch<LecturerResponseDTO>(`/api/v1/lecturers/${id}`, {
      method: "PUT",
      body: dto,
    }),

  assignBatch: (id: number, batchId: number) =>
    apiFetch<LecturerResponseDTO>(`/api/v1/lecturers/${id}/batches/${batchId}`, {
      method: "POST",
    }),

  unassignBatch: (id: number, batchId: number) =>
    apiFetch<LecturerResponseDTO>(`/api/v1/lecturers/${id}/batches/${batchId}`, {
      method: "DELETE",
    }),
};