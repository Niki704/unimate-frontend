import { clsx } from "clsx";

interface CardProps {
  className?: string;
  children: React.ReactNode;
}

export function Card({ className, children }: CardProps) {
  return (
    <div
      className={clsx(
        "bg-white rounded-xl border border-slate-200 shadow-sm",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children }: CardProps) {
  return (
    <div
      className={clsx("px-5 pt-5 pb-4 border-b border-slate-100", className)}
    >
      {children}
    </div>
  );
}

export function CardTitle({ className, children }: CardProps) {
  return (
    <h2 className={clsx("text-base font-semibold text-slate-900", className)}>
      {children}
    </h2>
  );
}

export function CardDescription({ className, children }: CardProps) {
  return (
    <p className={clsx("mt-0.5 text-sm text-slate-500", className)}>
      {children}
    </p>
  );
}

export function CardContent({ className, children }: CardProps) {
  return <div className={clsx("px-5 py-4", className)}>{children}</div>;
}

export function CardFooter({ className, children }: CardProps) {
  return (
    <div
      className={clsx(
        "px-5 pb-5 pt-3 border-t border-slate-100 flex items-center gap-2",
        className,
      )}
    >
      {children}
    </div>
  );
}

// Stat card — convenience wrapper for dashboard metric tiles
interface StatCardProps {
  label: string;
  value: number | string;
  icon?: React.ReactNode;
  className?: string;
}

export function StatCard({ label, value, icon, className }: StatCardProps) {
  return (
    <Card className={clsx("flex items-center gap-4 p-5", className)}>
      {icon && (
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600 shrink-0">
          {icon}
        </span>
      )}
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
          {label}
        </p>
        <p className="text-2xl font-bold text-slate-900 mt-0.5">{value}</p>
      </div>
    </Card>
  );
}
