// ============================================================
// Mirrors LecturerRegisterRequestDTO / LecturerResponseDTO /
// LecturerUpdateRequestDTO. No LecturerApproveRequestDTO exists
// — approval needs no client-supplied data beyond the path id.
// ============================================================

import type { AccountStatus, Department, Role } from "./enums";

export interface LecturerRegisterRequestDTO {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  department: Department;
}

export interface LecturerUpdateRequestDTO {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  department: Department;
}

export interface LecturerResponseDTO {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: Role;
  accountStatus: AccountStatus;
  department: Department;
  batchIds: number[];
  batchCodes: string[];
  verifiedByName: string | null;
  createdDate: string; // LocalDateTime
  lastLogin: string | null; // LocalDateTime
}