// ============================================================
// Mirrors AdminResponseDTO. No request DTO exists — Admin has
// no self-registration or approval flow in the backend.
// PendingApprovalsResponseDTO lives here too since it's
// exclusively used by AdminService/AdminController.
// ============================================================

import type { AccountStatus, Role } from "./enums";
import type { StudentResponseDTO } from "./student";
import type { LecturerResponseDTO } from "./lecturer";

export interface AdminResponseDTO {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: Role;
  accountStatus: AccountStatus;
  createdDate: string; // LocalDateTime
}

export interface PendingApprovalsResponseDTO {
  pendingStudents: StudentResponseDTO[];
  pendingLecturers: LecturerResponseDTO[];
}