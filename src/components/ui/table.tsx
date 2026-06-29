import { clsx } from "clsx";

interface TableProps {
  className?: string;
  children?: React.ReactNode;
}

export function Table({ className, children }: TableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table className={clsx("w-full border-collapse text-sm", className)}>
        {children}
      </table>
    </div>
  );
}

export function TableHead({ className, children }: TableProps) {
  return (
    <thead className={clsx("bg-slate-50 border-b border-slate-200", className)}>
      {children}
    </thead>
  );
}

export function TableBody({ className, children }: TableProps) {
  return (
    <tbody className={clsx("bg-white divide-y divide-slate-100", className)}>
      {children}
    </tbody>
  );
}

export function TableRow({
  className,
  children,
  ...props
}: TableProps & React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={clsx("hover:bg-slate-50 transition-colors", className)}
      {...props}
    >
      {children}
    </tr>
  );
}

export function TableHeaderCell({ className, children }: TableProps) {
  return (
    <th
      className={clsx(
        "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500",
        className,
      )}
    >
      {children}
    </th>
  );
}

export function TableCell({
  className,
  children,
  ...props
}: TableProps & React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={clsx("px-4 py-3 text-slate-700 whitespace-nowrap", className)}
      {...props}
    >
      {children}
    </td>
  );
}
