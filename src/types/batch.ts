// ============================================================
// Mirrors BatchRequestDTO / BatchResponseDTO.
// ============================================================

import type { BatchType } from "./enums";

export interface BatchRequestDTO {
  batchCode: string;
  name: string;
  batchType: BatchType;
  startYear: number;
  endYear: number;
}

export interface BatchResponseDTO {
  id: number;
  batchCode: string;
  name: string;
  batchType: BatchType;
  startYear: number;
  endYear: number;
  lecturerNames: string[];
  studentCount: number;
}