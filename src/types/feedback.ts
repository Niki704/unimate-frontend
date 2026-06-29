// ============================================================
// Mirrors StudentFeedbackRequestDTO/ResponseDTO and
// BatchFeedbackRequestDTO/ResponseDTO. Both request DTOs
// deliberately omit a lecturer field — resolved server-side
// from the authenticated Lecturer principal, same reasoning as
// Announcement's creator field.
// ============================================================

import type { Badge, StudentRating } from "./enums";

export interface StudentFeedbackRequestDTO {
  date: string; // LocalDate
  content: string;
  studentRating: StudentRating;
  studentId: number;
}

export interface StudentFeedbackResponseDTO {
  id: number;
  date: string; // LocalDate
  content: string;
  studentRating: StudentRating;
  lecturerId: number;
  lecturerName: string;
  studentId: number;
  studentName: string;
}

export interface BatchFeedbackRequestDTO {
  date: string; // LocalDate
  content: string;
  badges?: Badge[];
  batchId: number;
}

export interface BatchFeedbackResponseDTO {
  id: number;
  date: string; // LocalDate
  content: string;
  badges: Badge[];
  lecturerId: number;
  lecturerName: string;
  batchId: number;
  batchCode: string;
}