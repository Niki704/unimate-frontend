// ============================================================
// One function per ProfileController endpoint.
// ============================================================

import { apiFetch } from "@/lib/api-client";
import type { ProfileRequestDTO, ProfileResponseDTO } from "@/types/profile";

export const profileRepo = {
  getByUserId: (userId: number) =>
    apiFetch<ProfileResponseDTO>(`/api/v1/profiles/${userId}`),

  upsert: (userId: number, dto: ProfileRequestDTO) =>
    apiFetch<ProfileResponseDTO>(`/api/v1/profiles/${userId}`, {
      method: "PUT",
      body: dto,
    }),
};