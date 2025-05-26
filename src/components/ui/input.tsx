import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, startContent, endContent, ...props }, ref) => {
  return (
    <div className="relative flex items-center">
      {startContent && <div className="text-muted-foreground pointer-events-none absolute left-3 flex size-4 items-center">{startContent}</div>}
      <input
        type={type}
        className={cn(
          "border-input text-custom-gray file:text-foreground placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-full border bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          startContent && "pl-8",
          endContent && "pr-8",
          className,
        )}
        ref={ref}
        {...props}
      />
      {endContent && <div className="text-muted-foreground absolute right-3 flex h-4 w-4 items-center">{endContent}</div>}
    </div>
  );
});
Input.displayName = "Input";

export { Input };
