// ============================================================
// One function per StudentFeedbackController endpoint.
// Known gap: getByStudent/getByLecturer have no ownership
// filtering on the backend yet — any authenticated user can
// call either. Not fixed here; calling the endpoint exactly as
// it exists today.
// ============================================================

import { apiFetch } from "@/lib/api-client";
import type {
  StudentFeedbackRequestDTO,
  StudentFeedbackResponseDTO,
} from "@/types/feedback";

export const studentFeedbackRepo = {
  create: (dto: StudentFeedbackRequestDTO) =>
    apiFetch<StudentFeedbackResponseDTO>("/api/v1/student-feedback", {
      method: "POST",
      body: dto,
    }),

  getByStudent: (studentId: number) =>
    apiFetch<StudentFeedbackResponseDTO[]>(
      `/api/v1/student-feedback?studentId=${studentId}`
    ),

  getByLecturer: (lecturerId: number) =>
    apiFetch<StudentFeedbackResponseDTO[]>(
      `/api/v1/student-feedback?lecturerId=${lecturerId}`
    ),
};