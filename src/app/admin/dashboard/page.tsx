// ============================================================
// Minimal placeholder so the auth flow is testable end-to-end
// right now — the real dashboard gets built in Phase 8.
// ============================================================

import { getSessionUser } from "@/lib/session";

export default async function AdminDashboardPage() {
  const user = await getSessionUser();

  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
      <p className="mt-2 text-gray-600">
        Signed in as {user?.email}. Full dashboard arrives in Phase 8.
      </p>
    </main>
  );
}
