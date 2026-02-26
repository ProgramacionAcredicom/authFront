import { type ReactNode } from "react";

import { cn } from "@/lib/utils";

type PageShellProps = {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  animated?: boolean;
};

export function PageShell({
  children,
  className,
  contentClassName,
  animated = true,
}: PageShellProps) {
  return (
    <section
      className={cn(
        "flex min-h-0 flex-1 flex-col min-w-0",
        animated && "animate-in fade-in-0 duration-500",
        className,
      )}
    >
      <div className={cn("mx-auto flex min-h-0 w-full flex-1 min-w-0 flex-col gap-4 sm:gap-6", contentClassName)}>
        {children}
      </div>
    </section>
  );
}

type PageIntroProps = {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
};

export function PageIntro({ title, description, actions, className }: PageIntroProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/60 bg-gradient-to-b from-muted/30 to-transparent p-4 sm:p-5 md:p-6",
        className,
      )}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="min-w-0">{title}</div>
          {description ? (
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
      </div>
    </div>
  );
}
