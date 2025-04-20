// components/ui/Toggle.tsx
import * as React from "react";
import { cn } from "@/lib/utils";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  id?: string;
  className?: string;
}

export const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  id,
  className,
}) => (
  <button
    id={id}
    type="button"
    aria-pressed={checked}
    onClick={() => onChange(!checked)}
    className={cn(
      "relative inline-flex items-center h-6 w-11 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
      // gray when off, green when on
      checked ? "bg-green-500" : "bg-gray-300",
      className
    )}
  >
    <span
      className={cn(
        "inline-block h-4 w-4 bg-white rounded-full transform transition-transform",
        // slide right when on, left when off
        checked ? "translate-x-5" : "translate-x-1"
      )}
    />
  </button>
);
