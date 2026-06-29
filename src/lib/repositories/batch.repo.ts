// ============================================================
// One function per BatchController endpoint.
// ============================================================

import { apiFetch } from "@/lib/api-client";
import type { BatchRequestDTO, BatchResponseDTO } from "@/types/batch";
import type { StudentResponseDTO } from "@/types/student";
import type { LecturerResponseDTO } from "@/types/lecturer";

export const batchRepo = {
  create: (dto: BatchRequestDTO) =>
    apiFetch<BatchResponseDTO>("/api/v1/batches", {
      method: "POST",
      body: dto,
    }),

  getById: (id: number) => apiFetch<BatchResponseDTO>(`/api/v1/batches/${id}`),

  getAll: () => apiFetch<BatchResponseDTO[]>("/api/v1/batches"),

  update: (id: number, dto: BatchRequestDTO) =>
    apiFetch<BatchResponseDTO>(`/api/v1/batches/${id}`, {
      method: "PUT",
      body: dto,
    }),

  getStudents: (id: number) =>
    apiFetch<StudentResponseDTO[]>(`/api/v1/batches/${id}/students`),

  getLecturers: (id: number) =>
    apiFetch<LecturerResponseDTO[]>(`/api/v1/batches/${id}/lecturers`),
};