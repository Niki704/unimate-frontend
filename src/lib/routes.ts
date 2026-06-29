// ============================================================
// Single shared source for "which dashboard does this role go
// to" — used by auth.actions.ts and all three role layouts, so
// this mapping only ever exists in one place.
// ============================================================

import type { Role } from "@/types/enums";

export function dashboardPathForRole(role: Role): string {
  switch (role) {
    case "ADMIN":
      return "/admin/dashboard";
    case "LECTURER":
      return "/lecturer/dashboard";
    case "STUDENT":
      return "/student/dashboard";
  }
}
