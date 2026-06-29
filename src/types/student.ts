// ============================================================
// Mirrors StudentRegisterRequestDTO / StudentApproveRequestDTO /
// StudentResponseDTO / StudentUpdateRequestDTO.
// ============================================================

import type { AccountStatus, Role } from "./enums";

export interface StudentRegisterRequestDTO {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  enrollmentYear: number;
}

export interface StudentApproveRequestDTO {
  batchId: number;
  studentIdNumber: string;
}

export interface StudentUpdateRequestDTO {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  enrollmentYear: number;
}

export interface StudentResponseDTO {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: Role;
  accountStatus: AccountStatus;
  enrollmentYear: number;
  batchId: number | null;
  batchCode: string | null;
  studentIdNumber: string | null;
  verifiedByName: string | null;
  createdDate: string; // LocalDateTime
  lastLogin: string | null; // LocalDateTime
}