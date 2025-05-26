import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, startContent, endContent, ...props }, ref) => {
  return (
    <div className="relative flex items-center">
      {startContent && <div className="text-muted-foreground pointer-events-none absolute top-2.5 left-3">{startContent}</div>}
      <textarea
        ref={ref}
        className={cn(
          "border-input placeholder:text-muted-foreground focus-visible:ring-ring flex w-full resize-none rounded-md border bg-transparent px-3 py-2 text-base shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          startContent && "pl-8",
          endContent && "pr-8",
          className,
        )}
        {...props}
      />
      {endContent && <div className="text-muted-foreground pointer-events-none absolute top-2.5 right-3">{endContent}</div>}
    </div>
  );
});

Textarea.displayName = "Textarea";

export { Textarea };
