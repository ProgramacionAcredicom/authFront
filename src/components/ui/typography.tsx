import { cn } from "@/lib/utils";

export function TypographyH1({ text, className }: { text: string; className?: string }) {
  return (
    <h1 className={cn("scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl", className)}>
      {text}
    </h1>
  );
}

export function TypographyH2({ text, className }: { text: string; className?: string }) {
  return (
    <h2
      className={cn(
        "text-custom-gray scroll-m-20 pb-2 text-3xl font-bold tracking-tight first:mt-0",
        className,
      )}
    >
      {text}
    </h2>
  );
}
export function TypographyH3({ text, className }: { text: string; className?: string }) {
  return (
    <h3
      className={cn(
        "text-custom-foreground scroll-m-20 text-2xl font-bold tracking-tight",
        className,
      )}
    >
      {text}
    </h3>
  );
}

export function TypographyH4({ text, className }: { text: string; className?: string }) {
  return (
    <h4
      className={cn(
        "text-custom-foreground scroll-m-20 text-xl font-semibold tracking-tight",
        className,
      )}
    >
      {text}
    </h4>
  );
}

export function TypographyP({ text, className }: { text: string; className?: string }) {
  return <p className={cn(className)}>{text}</p>;
}

export function TypographyBlockquote({ text, className }: { text: string; className?: string }) {
  return <blockquote className={cn("mt-6 border-l-2 pl-6 italic", className)}>{text}</blockquote>;
}

export function TypographyList({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <ul className={cn("my-6 ml-6 list-disc [&>li]:mt-2", className)}>{children}</ul>;
}

export function TypographySmall({ text, className }: { text: string; className?: string }) {
  return <small className={cn("text-sm leading-none font-medium", className)}>{text}</small>;
}

export function TypographyMuted({ text, className }: { text: string; className?: string }) {
  return <p className={cn("text-muted-foreground text-sm", className)}>{text}</p>;
}
