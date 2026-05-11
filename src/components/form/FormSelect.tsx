import { forwardRef, type ComponentType } from "react";
import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface SelectOption {
  label: string;
  value: string;
}

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  icon?: LucideIcon | ComponentType<{ className?: string }>;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  (
    {
      label,
      icon: Icon,
      error,
      className,
      options,
      placeholder = "Select option",
      ...props
    },
    ref,
  ) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="pl-1 text-xs font-medium text-gray-500">
            {label}
          </label>
        )}

        <div className="relative">
          {Icon && (
            <Icon className="absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-gray-400" />
          )}

          <select
            ref={ref}
            {...props}
            className={`
              w-full h-11 appearance-none rounded-xl border bg-white px-4 text-sm outline-none transition
              ${Icon ? "pl-10" : ""}
              ${
                error
                  ? "border-2 border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                  : "border-2 border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              }
              ${className || ""}
            `}
          >
            <option value="" className="capitalize">
              {placeholder}
            </option>

            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                className="capitalize"
              >
                {option.label}
              </option>
            ))}
          </select>

          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs text-red-600"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
            </span>
            {error}
          </motion.p>
        )}
      </div>
    );
  },
);

SelectField.displayName = "SelectField";
