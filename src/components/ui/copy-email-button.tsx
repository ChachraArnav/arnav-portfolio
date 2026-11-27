"use client";

import { Check, Copy } from "lucide-react";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { cn } from "@/lib/utils";
import { buttonClasses } from "./button-link";

interface CopyEmailButtonProps {
  email: string;
  className?: string;
}

/** Copies the email address and announces the result to screen readers. */
export function CopyEmailButton({ email, className }: CopyEmailButtonProps) {
  const { state, copy } = useCopyToClipboard();

  const label = state === "copied" ? "Copied" : state === "failed" ? "Copy failed" : "Copy email";

  return (
    <>
      <button
        type="button"
        onClick={() => void copy(email)}
        className={cn(buttonClasses("secondary"), className)}
        aria-label={state === "idle" ? `Copy email address ${email}` : undefined}
      >
        {state === "copied" ? (
          <Check size={16} aria-hidden className="text-positive" />
        ) : (
          <Copy size={16} aria-hidden />
        )}
        <span>{label}</span>
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {state === "copied"
          ? "Email address copied to clipboard"
          : state === "failed"
            ? `Couldn't copy automatically. The address is ${email}`
            : ""}
      </span>
    </>
  );
}
