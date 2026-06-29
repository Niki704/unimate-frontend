// ============================================================
// Mirrors com.unimate.enums — exact value sets, nothing added
// or removed. Kept as string literal unions rather than TS
// `enum` so they serialize/compare identically to plain JSON
// strings coming back from Spring (no extra runtime object).
// ============================================================

export type Role = "ADMIN" | "STUDENT" | "LECTURER";

export type AccountStatus = "PENDING" | "ACTIVE" | "REJECTED";

export type Department = "COMPUTING" | "MANAGEMENT" | "COMMUNICATION" | "PO";

export type BatchType = "SOC" | "SOL" | "SOB";

export type StudentRating = "EXCELLENT" | "GOOD" | "MODERATE" | "LOW";

export type Badge = "TEAM_WORK" | "AGILE" | "COLLABORATIVE" | "SUPPORTIVE" | "ON_TIME";