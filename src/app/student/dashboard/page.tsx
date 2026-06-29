// ============================================================
// Minimal placeholder — same reasoning as the other two.
// ============================================================

import { getSessionUser } from "@/lib/session";

export default async function StudentDashboardPage() {
  const user = await getSessionUser();

  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold text-gray-900">Student Dashboard</h1>
      <p className="mt-2 text-gray-600">
        Signed in as {user?.email}. Full dashboard arrives in Phase 8.
      </p>
    </main>
  );
}
