// ============================================================
// One function per PortfolioController endpoint. create() takes
// no studentId argument — the backend resolves the owner from
// the authenticated principal, never a client-supplied id.
// ============================================================

import { apiFetch } from "@/lib/api-client";
import type { PortfolioRequestDTO, PortfolioResponseDTO } from "@/types/portfolio";

export const portfolioRepo = {
  create: (dto: PortfolioRequestDTO) =>
    apiFetch<PortfolioResponseDTO>("/api/v1/portfolios", {
      method: "POST",
      body: dto,
    }),

  getByStudentId: (studentId: number) =>
    apiFetch<PortfolioResponseDTO>(`/api/v1/portfolios/${studentId}`),

  update: (studentId: number, dto: PortfolioRequestDTO) =>
    apiFetch<PortfolioResponseDTO>(`/api/v1/portfolios/${studentId}`, {
      method: "PUT",
      body: dto,
    }),
};