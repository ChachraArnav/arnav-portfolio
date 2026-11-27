import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Small, quiet technology label. Square-ish so it doesn't read as a pill badge. */
export function Tag({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[4px] border border-line px-2 py-0.5 text-2xs text-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function TagList({ items, label }: { items: readonly string[]; label: string }) {
  return (
    <ul className="flex flex-wrap gap-1.5" aria-label={label}>
      {items.map((item) => (
        <li key={item}>
          <Tag>{item}</Tag>
        </li>
      ))}
    </ul>
  );
}
