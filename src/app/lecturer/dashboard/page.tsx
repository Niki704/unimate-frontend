// ============================================================
// Minimal placeholder — same reasoning as the admin one above.
// ============================================================

import { getSessionUser } from "@/lib/session";

export default async function LecturerDashboardPage() {
  const user = await getSessionUser();

  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold text-gray-900">Lecturer Dashboard</h1>
      <p className="mt-2 text-gray-600">
        Signed in as {user?.email}. Full dashboard arrives in Phase 8.
      </p>
    </main>
  );
}
