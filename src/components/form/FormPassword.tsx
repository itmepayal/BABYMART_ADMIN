import { useState, forwardRef, type ComponentType } from "react";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface FormPasswordFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: LucideIcon | ComponentType<{ className?: string }>;
  error?: string;
  placeholder?: string;
}

export const FormPasswordField = forwardRef<
  HTMLInputElement,
  FormPasswordFieldProps
>(
  (
    {
      label = "Password",
      icon: Icon,
      error,
      className,
      placeholder = "********",
      ...props
    },
    ref,
  ) => {
    const [show, setShow] = useState(false);

    return (
      <div className="space-y-1.5">
        {label && (
          <label className="text-xs font-medium text-gray-500 pl-1">
            {label}
          </label>
        )}

        <div className="relative">
          {Icon && (
            <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          )}

          <Input
            ref={ref}
            {...props}
            type={show ? "text" : "password"}
            placeholder={placeholder}
            className={`
            h-11 rounded-xl border bg-white text-sm pr-10 outline-none transition

            ${Icon ? "pl-10" : ""}

            ${
              error
                ? "border-2 border-red-400 focus:!border-red-500 focus:!ring-2 focus:!ring-red-100"
                : "border-2 border-gray-200 focus:!border-emerald-500 focus:!ring-2 focus:!ring-emerald-100"
            }

            ${className || ""}
          `}
          />

          <button
            type="button"
            onClick={() => setShow((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
          >
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-1.5 rounded-lg"
          >
            {/* animated dot */}
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
            </span>

            {error}
          </motion.p>
        )}
      </div>
    );
  },
);
