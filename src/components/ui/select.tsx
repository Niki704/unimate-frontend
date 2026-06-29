import { clsx } from "clsx";
import { ChevronDown } from "lucide-react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  placeholder?: string;
  containerClassName?: string;
}

export function Select({
  label,
  error,
  hint,
  placeholder,
  containerClassName,
  className,
  id,
  children,
  ...props
}: SelectProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className={clsx("flex flex-col gap-1", containerClassName)}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-slate-700 select-none"
        >
          {label}
          {props.required && <span className="ml-0.5 text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          id={inputId}
          className={clsx(
            "w-full appearance-none rounded-lg border bg-white text-sm text-slate-900",
            "pl-3 pr-8 py-2 transition-colors cursor-pointer",
            "focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-0 focus:border-slate-400",
            error
              ? "border-red-400 focus:ring-red-400"
              : "border-slate-300 hover:border-slate-400",
            className,
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
      {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
    </div>
  );
}
