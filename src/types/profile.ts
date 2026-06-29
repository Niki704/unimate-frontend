// ============================================================
// Mirrors ProfileRequestDTO / ProfileResponseDTO. firstName/
// lastName on the response are resolved convenience fields
// composed from the linked User — not stored on Profile itself.
// ============================================================

export interface ProfileRequestDTO {
  bio?: string;
  profilePictureUrl?: string;
  address?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  facebookUrl?: string;
  xUrl?: string;
  youtubeUrl?: string;
}

export interface ProfileResponseDTO {
  userId: number;
  firstName: string;
  lastName: string;
  bio: string | null;
  profilePictureUrl: string | null;
  address: string | null;
  githubUrl: string | null;
  linkedinUrl: string | null;
  facebookUrl: string | null;
  xUrl: string | null;
  youtubeUrl: string | null;
}