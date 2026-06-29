"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { CheckCircle, XCircle, AlertTriangle, X } from "lucide-react";
import { clsx } from "clsx";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ToastType = "success" | "error" | "exception";

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number; // ms — defaults: success 3000, error 4000, exception 4000
}

interface ToastContextValue {
  toasts: (Toast & { exiting: boolean })[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<(Toast & { exiting: boolean })[]>([]);

  const removeToast = useCallback((id: string) => {
    // Mark as exiting first (triggers CSS exit animation), then remove after delay
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)),
    );
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 220);
  }, []);

  const addToast = useCallback(
    (toast: Omit<Toast, "id">) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const duration =
        toast.duration ?? (toast.type === "success" ? 3000 : 4000);
      setToasts((prev) => [
        ...prev,
        { ...toast, id, duration, exiting: false },
      ]);
      setTimeout(() => removeToast(id), duration);
    },
    [removeToast],
  );

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
}

// ─── Container ────────────────────────────────────────────────────────────────

function ToastContainer() {
  const { toasts, removeToast } = useContext(ToastContext)!;

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-80 pointer-events-none"
    >
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}

// ─── Individual Toast ─────────────────────────────────────────────────────────

function ToastItem({
  toast,
  onClose,
}: {
  toast: Toast & { exiting: boolean; duration?: number };
  onClose: () => void;
}) {
  const duration = toast.duration ?? 4000;

  const config: Record<
    ToastType,
    {
      bg: string;
      border: string;
      iconColor: string;
      titleColor: string;
      msgColor: string;
      Icon: React.ElementType;
      animClass: string;
    }
  > = {
    success: {
      bg: "bg-white",
      border: "border-l-4 border-l-green-500 border border-slate-200",
      iconColor: "text-green-600",
      titleColor: "text-slate-900",
      msgColor: "text-slate-500",
      Icon: CheckCircle,
      animClass: "toast-enter",
    },
    error: {
      bg: "bg-white",
      border: "border-l-4 border-l-red-500 border border-slate-200",
      iconColor: "text-red-600",
      titleColor: "text-slate-900",
      msgColor: "text-slate-500",
      Icon: XCircle,
      animClass: "toast-shake",
    },
    exception: {
      bg: "bg-white",
      border: "border-l-4 border-l-amber-400 border border-slate-200",
      iconColor: "text-amber-600",
      titleColor: "text-slate-900",
      msgColor: "text-slate-500",
      Icon: AlertTriangle,
      animClass: "toast-enter",
    },
  };

  const c = config[toast.type];

  return (
    <div
      className={clsx(
        "relative rounded-lg shadow-lg pointer-events-auto overflow-hidden",
        c.bg,
        c.border,
        toast.exiting ? "toast-exit" : c.animClass,
      )}
    >
      <div className="flex items-start gap-3 p-4">
        <c.Icon
          className={clsx(
            "mt-0.5 h-5 w-5 shrink-0",
            c.iconColor,
            toast.type === "success" && !toast.exiting && "toast-icon-pop",
          )}
        />
        <div className="flex-1 min-w-0">
          <p
            className={clsx("text-sm font-medium leading-tight", c.titleColor)}
          >
            {toast.title}
          </p>
          {toast.message && (
            <p className={clsx("mt-0.5 text-xs leading-snug", c.msgColor)}>
              {toast.message}
            </p>
          )}
        </div>
        <button
          onClick={onClose}
          className="shrink-0 text-slate-400 hover:text-slate-600 transition-colors"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Exception progress bar */}
      {toast.type === "exception" && !toast.exiting && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-100">
          <div
            className="h-full bg-amber-400 toast-progress"
            style={
              { "--toast-duration": `${duration}ms` } as React.CSSProperties
            }
          />
        </div>
      )}
    </div>
  );
}
