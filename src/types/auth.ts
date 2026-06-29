// ============================================================
// Mirrors LoginRequestDTO / LoginResponseDTO.
// ============================================================

import type { Role } from "./enums";

export interface LoginRequestDTO {
  email: string;
  password: string;
}

export interface LoginResponseDTO {
  token: string;
  userId: number;
  firstName: string;
  lastName: string;
  role: Role;
}