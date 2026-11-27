"use client";

import { Command, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useCommandPalette } from "@/components/command/command-palette-provider";
import { MotionToggle } from "@/components/ui/motion-toggle";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { sections, siteConfig } from "@/config/site";
import { useActiveSection } from "@/hooks/use-active-section";
import { cn } from "@/lib/utils";

const navSections = sections.filter((s) => s.id !== "top");
const sectionIds = sections.map((s) => s.id);

export function SiteHeader() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const activeSection = useActiveSection(sectionIds, onHome);
  const { setOpen: setPaletteOpen } = useCommandPalette();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [lastPath, setLastPath] = useState(pathname);

  // Close the mobile menu after navigating (adjusting state during render, per React docs).
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMenuOpen(false);
  }

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    const onResize = () => {
      if (window.matchMedia("(min-width: 768px)").matches) setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    menuRef.current?.querySelector<HTMLElement>("a, button")?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [menuOpen]);

  const isActive = (id: string) => {
    if (id === "projects" && pathname.startsWith("/projects")) return true;
    return onHome && activeSection === id;
  };

  return (
    <header className="no-print sticky top-0 z-40 border-b border-line/70 bg-bg/85 backdrop-blur-md supports-[backdrop-filter]:bg-bg/70">
      <span
        aria-hidden="true"
        className="scroll-progress pointer-events-none absolute inset-x-0 -bottom-px h-px bg-accent"
      />
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <div className="container-page flex h-[var(--header-h)] items-center gap-4">
        <Link
          href="/"
          className="mr-auto flex items-center gap-2.5 text-sm font-semibold tracking-tight text-text"
          aria-label={`${siteConfig.name}, home`}
        >
          <span
            aria-hidden="true"
            className="grid size-7 place-items-center rounded-[5px] border border-line-strong font-mono text-[11px] text-accent"
          >
            {siteConfig.initials}
          </span>
          <span className="hidden xs:inline">{siteConfig.name}</span>
        </Link>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {navSections.map((section) => {
              const active = isActive(section.id);
              return (
                <li key={section.id}>
                  <Link
                    href={`/#${section.id}`}
                    aria-current={active ? "location" : undefined}
                    className={cn(
                      "relative inline-flex h-9 items-center rounded-[var(--radius-control)] px-3 text-sm transition-colors",
                      active ? "text-text" : "text-muted hover:text-text",
                    )}
                  >
                    {section.label}
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute inset-x-3 -bottom-[11px] h-px bg-accent transition-opacity duration-200",
                        active ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </Link>
                </li>
              );
            })}
            <li>
              <Link
                href="/quick-view"
                aria-current={pathname === "/quick-view" ? "page" : undefined}
                className={cn(
                  "inline-flex h-9 items-center rounded-[var(--radius-control)] px-3 text-sm transition-colors",
                  pathname === "/quick-view" ? "text-text" : "text-muted hover:text-text",
                )}
              >
                Quick view
              </Link>
            </li>
          </ul>
        </nav>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setPaletteOpen(true)}
            className="hidden h-9 items-center gap-2 rounded-[var(--radius-control)] border border-line px-2.5 text-xs text-muted transition-colors hover:border-line-strong hover:text-text sm:inline-flex"
            aria-label="Open command palette (Control or Command plus K)"
            aria-keyshortcuts="Control+K Meta+K"
          >
            <Command size={13} aria-hidden />
            <span className="font-mono">K</span>
          </button>
          <MotionToggle />
          <ThemeToggle />
          <button
            ref={menuButtonRef}
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-[var(--radius-control)] text-muted hover:bg-surface-raised hover:text-text md:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X size={20} aria-hidden /> : <Menu size={20} aria-hidden />}
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        ref={menuRef}
        hidden={!menuOpen}
        className="border-t border-line bg-bg md:hidden"
      >
        <nav aria-label="Mobile" className="container-page py-3">
          <ul className="flex flex-col">
            {navSections.map((section) => (
              <li key={section.id}>
                <Link
                  href={`/#${section.id}`}
                  onClick={() => setMenuOpen(false)}
                  aria-current={isActive(section.id) ? "location" : undefined}
                  className={cn(
                    "flex min-h-12 items-center border-b border-line/60 text-base",
                    isActive(section.id) ? "text-text" : "text-muted",
                  )}
                >
                  {section.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/quick-view"
                onClick={() => setMenuOpen(false)}
                className="flex min-h-12 items-center border-b border-line/60 text-base text-muted"
              >
                Recruiter quick view
              </Link>
            </li>
            <li className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  setPaletteOpen(true);
                }}
                className="flex min-h-12 w-full items-center gap-2 text-base text-muted"
              >
                <Command size={15} aria-hidden />
                Search and commands
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
