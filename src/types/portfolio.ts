// ============================================================
// Mirrors PortfolioRequestDTO / PortfolioResponseDTO.
// ============================================================

export interface PortfolioRequestDTO {
  skills?: string[];
  attachments?: string[];
  projectLinks?: string[];
}

export interface PortfolioResponseDTO {
  id: number;
  studentId: number;
  skills: string[];
  attachments: string[];
  projectLinks: string[];
  createdDate: string; // LocalDateTime
  lastUpdated: string; // LocalDateTime
}