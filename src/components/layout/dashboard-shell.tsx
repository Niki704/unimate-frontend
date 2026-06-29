import { Sidebar } from "@/components/layout/sidebar";
import { Navbar } from "@/components/layout/navbar";
import type { Role } from "@/types/enums";

interface DashboardShellProps {
  role: Role;
  firstName: string;
  lastName: string;
  email: string;
  children: React.ReactNode;
}

export function DashboardShell({
  role,
  firstName,
  lastName,
  email,
  children,
}: DashboardShellProps) {
  const userName = email;

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Fixed sidebar */}
      <Sidebar role={role} userName={userName} />

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar firstName={firstName} lastName={lastName} role={role} />

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}

// Page-level header — title + optional actions
interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="mb-6 flex items-start justify-between gap-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
        {description && (
          <p className="mt-0.5 text-sm text-slate-500">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2 shrink-0">{actions}</div>
      )}
    </div>
  );
}
