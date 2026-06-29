// ============================================================
// NOT in the original Section 3 folder list — added because the
// Phase 4 login Route Handler needs to call Spring's login
// endpoint through apiFetch too, for consistent ApiError handling
// on bad credentials.
// ============================================================

import { apiFetch } from "@/lib/api-client";
import type { LoginRequestDTO, LoginResponseDTO } from "@/types/auth";

export const authRepo = {
  login: (dto: LoginRequestDTO) =>
    apiFetch<LoginResponseDTO>("/api/v1/auth/login", {
      method: "POST",
      body: dto,
      skipAuth: true,
    }),
};