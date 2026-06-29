import { clsx } from "clsx";
import type { AccountStatus, Role, BatchType } from "@/types/enums";

// ─── Generic Badge ────────────────────────────────────────────────────────────

type BadgeVariant =
  | "default"
  | "success"
  | "warning"
  | "error"
  | "info"
  | "purple";

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-slate-100 text-slate-700",
  success: "bg-green-50 text-green-700 border border-green-200",
  warning: "bg-yellow-50 text-yellow-700 border border-yellow-200",
  error: "bg-red-50 text-red-700 border border-red-200",
  info: "bg-blue-50 text-blue-700 border border-blue-200",
  purple: "bg-purple-50 text-purple-700 border border-purple-200",
};

interface BadgeProps {
  variant?: BadgeVariant;
  className?: string;
  children: React.ReactNode;
}

export function Badge({
  variant = "default",
  className,
  children,
}: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}

// ─── AccountStatus Badge ──────────────────────────────────────────────────────

const statusVariant: Record<AccountStatus, BadgeVariant> = {
  PENDING: "warning",
  ACTIVE: "success",
  REJECTED: "error",
};

export function AccountStatusBadge({ status }: { status: AccountStatus }) {
  return (
    <Badge variant={statusVariant[status]}>
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </Badge>
  );
}

// ─── Role Badge ───────────────────────────────────────────────────────────────

const roleVariant: Record<Role, BadgeVariant> = {
  ADMIN: "info",
  LECTURER: "purple",
  STUDENT: "default",
};

export function RoleBadge({ role }: { role: Role }) {
  return (
    <Badge variant={roleVariant[role]}>
      {role.charAt(0) + role.slice(1).toLowerCase()}
    </Badge>
  );
}

// ─── BatchType Badge ──────────────────────────────────────────────────────────

const batchTypeVariant: Record<BatchType, BadgeVariant> = {
  SOC: "info",
  SOL: "purple",
  SOB: "success",
};

export function BatchTypeBadge({ type }: { type: BatchType }) {
  return <Badge variant={batchTypeVariant[type]}>{type}</Badge>;
}
