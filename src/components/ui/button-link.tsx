import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn, externalRel } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";

const base =
  "inline-flex items-center justify-center gap-2 rounded-[var(--radius-control)] text-sm font-medium transition-colors duration-150 select-none min-h-11 px-4 whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary: "bg-text text-bg hover:bg-accent-strong",
  secondary: "border border-line-strong text-text hover:border-accent hover:bg-accent-soft",
  ghost: "text-muted hover:text-text hover:bg-surface-raised",
};

export function buttonClasses(variant: Variant = "secondary", className?: string): string {
  return cn(base, variants[variant], className);
}

interface ButtonLinkProps extends Omit<ComponentProps<"a">, "href"> {
  href: string;
  variant?: Variant;
  children: ReactNode;
  /** Opens in a new tab with safe rel attributes. */
  external?: boolean;
  /** Triggers a file download. Pass a filename to suggest one. */
  download?: string | boolean;
}

/** A link styled as a button. Internal links use next/link; external and downloads use <a>. */
export function ButtonLink({
  href,
  variant = "secondary",
  className,
  children,
  external,
  download,
  ...rest
}: ButtonLinkProps) {
  const classes = buttonClasses(variant, className);

  if (external || download || href.startsWith("mailto:")) {
    return (
      <a
        href={href}
        className={classes}
        {...(external ? { target: "_blank", rel: externalRel } : {})}
        {...(download ? { download: typeof download === "string" ? download : "" } : {})}
        {...rest}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...rest}>
      {children}
    </Link>
  );
}
