// ============================================================
// Mirrors AnnouncementRequestDTO / AnnouncementResponseDTO.
// Note: the request DTO deliberately has no creator field — the
// creator is resolved server-side (Spring) from the
// authenticated principal, never client-supplied. Don't add a
// creatorId field here — Spring would ignore it anyway.
// ============================================================

import type { Role } from "./enums";

export interface AnnouncementRequestDTO {
  title: string;
  content: string;
  date: string; // LocalDate, "yyyy-MM-dd"
  expiryDate?: string; // LocalDate
  batchIds?: number[];
  studentIds?: number[];
}

export interface AnnouncementResponseDTO {
  id: number;
  title: string;
  content: string;
  date: string; // LocalDate
  expiryDate: string | null; // LocalDate
  createdByName: string;
  createdByRole: Role;
  targetBatchCodes: string[];
  targetStudentIds: number[];
}