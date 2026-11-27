import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button-link";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col justify-center py-24">
      <p className="font-mono text-sm text-accent">404</p>
      <h1 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-text">
        There&apos;s no page at this address.
      </h1>
      <p className="mt-4 max-w-[48ch] text-base text-muted">
        The link may be out of date or mistyped. You can head back to the home page, or press{" "}
        <kbd className="font-mono text-text">Ctrl K</kbd> to search projects and sections.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonLink href="/" variant="primary">
          Go to home page
        </ButtonLink>
        <ButtonLink href="/#projects">View projects</ButtonLink>
      </div>
    </div>
  );
}
