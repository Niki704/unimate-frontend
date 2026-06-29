"use client";

import { useState } from "react";
import { clsx } from "clsx";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";

type AlertVariant = "success" | "error" | "warning" | "info";

const config: Record<
  AlertVariant,
  { container: string; icon: string; Icon: React.ElementType }
> = {
  success: {
    container: "bg-green-50 border-green-200 text-green-800",
    icon: "text-green-600",
    Icon: CheckCircle,
  },
  error: {
    container: "bg-red-50 border-red-200 text-red-800",
    icon: "text-red-600",
    Icon: XCircle,
  },
  warning: {
    container: "bg-yellow-50 border-yellow-200 text-yellow-800",
    icon: "text-yellow-600",
    Icon: AlertTriangle,
  },
  info: {
    container: "bg-blue-50 border-blue-200 text-blue-800",
    icon: "text-blue-600",
    Icon: Info,
  },
};

interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children: React.ReactNode;
  dismissible?: boolean;
  className?: string;
}

export function Alert({
  variant = "info",
  title,
  children,
  dismissible = false,
  className,
}: AlertProps) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  const c = config[variant];

  return (
    <div
      role="alert"
      className={clsx(
        "flex gap-3 rounded-lg border p-4 text-sm",
        c.container,
        className,
      )}
    >
      <c.Icon className={clsx("mt-0.5 h-4 w-4 shrink-0", c.icon)} />
      <div className="flex-1 min-w-0">
        {title && <p className="font-semibold mb-0.5">{title}</p>}
        <p className="leading-snug">{children}</p>
      </div>
      {dismissible && (
        <button
          onClick={() => setDismissed(true)}
          className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
