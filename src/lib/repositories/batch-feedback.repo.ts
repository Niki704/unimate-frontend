// ============================================================
// One function per BatchFeedbackController endpoint. Same
// ownership-filtering caveat as student-feedback.repo.ts.
// ============================================================

import { apiFetch } from "@/lib/api-client";
import type {
  BatchFeedbackRequestDTO,
  BatchFeedbackResponseDTO,
} from "@/types/feedback";

export const batchFeedbackRepo = {
  create: (dto: BatchFeedbackRequestDTO) =>
    apiFetch<BatchFeedbackResponseDTO>("/api/v1/batch-feedback", {
      method: "POST",
      body: dto,
    }),

  getByBatch: (batchId: number) =>
    apiFetch<BatchFeedbackResponseDTO[]>(`/api/v1/batch-feedback?batchId=${batchId}`),

  getByLecturer: (lecturerId: number) =>
    apiFetch<BatchFeedbackResponseDTO[]>(
      `/api/v1/batch-feedback?lecturerId=${lecturerId}`
    ),
};