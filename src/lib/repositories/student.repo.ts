// ============================================================
// One function per StudentController endpoint, same order as
// the Controller. register() is the only skipAuth call here.
// ============================================================

import { apiFetch } from "@/lib/api-client";
import type {
  StudentRegisterRequestDTO,
  StudentApproveRequestDTO,
  StudentUpdateRequestDTO,
  StudentResponseDTO,
} from "@/types/student";

export const studentRepo = {
  register: (dto: StudentRegisterRequestDTO) =>
    apiFetch<StudentResponseDTO>("/api/v1/students/register", {
      method: "POST",
      body: dto,
      skipAuth: true,
    }),

  getById: (id: number) => apiFetch<StudentResponseDTO>(`/api/v1/students/${id}`),

  getAll: () => apiFetch<StudentResponseDTO[]>("/api/v1/students"),

  approve: (id: number, dto: StudentApproveRequestDTO) =>
    apiFetch<StudentResponseDTO>(`/api/v1/students/${id}/approve`, {
      method: "PATCH",
      body: dto,
    }),

  reject: (id: number) =>
    apiFetch<StudentResponseDTO>(`/api/v1/students/${id}/reject`, {
      method: "POST",
    }),

  update: (id: number, dto: StudentUpdateRequestDTO) =>
    apiFetch<StudentResponseDTO>(`/api/v1/students/${id}`, {
      method: "PUT",
      body: dto,
    }),
};