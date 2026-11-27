"use client";

import {
  ArrowUpRight,
  Copy,
  CornerDownLeft,
  FolderGit2,
  Hash,
  Search,
  SunMoon,
  UserRound,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useReduceMotion } from "@/lib/motion-pref";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { siteConfig } from "@/config/site";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { buildCommands, searchCommands, type Command, type CommandGroup } from "@/lib/commands";
import { toggleMotionPref } from "@/lib/motion-pref";
import { toggleTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

const groupOrder: CommandGroup[] = ["Navigate", "Projects", "Links", "Actions"];

function CommandIcon({ command }: { command: Command }) {
  const props = { size: 15, "aria-hidden": true } as const;
  switch (command.action.type) {
    case "external":
      return <ArrowUpRight {...props} />;
    case "copy-email":
      return <Copy {...props} />;
    case "toggle-theme":
      return <SunMoon {...props} />;
    case "toggle-motion":
      return <Zap {...props} />;
    case "navigate":
      if (command.group === "Projects") return <FolderGit2 {...props} />;
      if (command.id === "quick-view") return <UserRound {...props} />;
      return <Hash {...props} />;
  }
}

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const [announcement, setAnnouncement] = useState("");
  return (
    <>
      <span role="status" aria-live="polite" className="sr-only">
        {announcement}
      </span>
      <AnimatePresence>
        {open ? <PaletteDialog key="palette" onClose={onClose} announce={setAnnouncement} /> : null}
      </AnimatePresence>
    </>
  );
}

interface PaletteDialogProps {
  onClose: () => void;
  announce: (message: string) => void;
}

function PaletteDialog({ onClose, announce }: PaletteDialogProps) {
  const router = useRouter();
  const reduceMotion = useReduceMotion();
  const commands = useMemo(() => buildCommands(), []);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const { copy } = useCopyToClipboard();
  const baseId = useId();
  const listId = `${baseId}-list`;
  const optionId = (index: number) => `${baseId}-option-${index}`;

  // Ranked within each group, then laid out group by group, so the flat index used
  // for keyboard navigation always matches the order the options are displayed in.
  // While searching, the group holding the best match comes first, so "github"
  // opens GitHub rather than a project that merely lists GitHub Actions.
  const { results, order } = useMemo(() => {
    const ranked = searchCommands(commands, query);
    const order = query.trim()
      ? [...new Set(ranked.map((command) => command.group))]
      : [...groupOrder];
    return {
      order,
      results: order.flatMap((group) => ranked.filter((command) => command.group === group)),
    };
  }, [commands, query]);

  const grouped = useMemo(() => {
    const indexed = results.map((command, index) => ({ command, index }));
    return order
      .map((group) => ({
        group,
        items: indexed.filter((r) => r.command.group === group),
      }))
      .filter((g) => g.items.length > 0);
  }, [results, order]);

  // Mount: remember focus and lock scroll. Unmount: restore both.
  useEffect(() => {
    restoreFocusRef.current = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    const frame = requestAnimationFrame(() => inputRef.current?.focus());
    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = overflow;
      restoreFocusRef.current?.focus?.();
    };
  }, []);

  // Keep the active option visible while arrowing through a long list.
  useEffect(() => {
    const el = document.getElementById(`${baseId}-option-${activeIndex}`);
    el?.scrollIntoView?.({ block: "nearest" });
  }, [activeIndex, baseId]);

  const run = useCallback(
    async (command: Command) => {
      const { action } = command;
      switch (action.type) {
        case "navigate":
          onClose();
          router.push(action.href);
          break;
        case "external":
          onClose();
          window.open(action.href, "_blank", "noopener,noreferrer");
          break;
        case "copy-email": {
          const ok = await copy(siteConfig.email);
          announce(ok ? "Email address copied" : `Copy failed. Email is ${siteConfig.email}`);
          onClose();
          break;
        }
        case "toggle-motion": {
          const pref = toggleMotionPref();
          announce(`Animated effects ${pref === "full" ? "on" : "off"}`);
          onClose();
          break;
        }
        case "toggle-theme": {
          const theme = toggleTheme();
          announce(`Switched to ${theme} theme`);
          onClose();
          break;
        }
      }
    },
    [announce, copy, onClose, router],
  );

  const onKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (results.length) setActiveIndex((i) => (i + 1) % results.length);
        break;
      case "ArrowUp":
        event.preventDefault();
        if (results.length) setActiveIndex((i) => (i - 1 + results.length) % results.length);
        break;
      case "Home":
        if (event.ctrlKey) {
          event.preventDefault();
          setActiveIndex(0);
        }
        break;
      case "End":
        if (event.ctrlKey) {
          event.preventDefault();
          setActiveIndex(Math.max(results.length - 1, 0));
        }
        break;
      case "Enter": {
        event.preventDefault();
        const command = results[activeIndex];
        if (command) void run(command);
        break;
      }
      case "Escape":
        event.preventDefault();
        event.stopPropagation();
        onClose();
        break;
      case "Tab":
        // Focus stays in the search field; options are reached with arrow keys.
        event.preventDefault();
        inputRef.current?.focus();
        break;
    }
  };

  const activeCommand = results[activeIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[12vh]">
      <motion.div
        className="absolute inset-0 bg-overlay backdrop-blur-[2px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.15 }}
        onClick={onClose}
        aria-hidden="true"
      />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onKeyDown={onKeyDown}
        className="relative w-full max-w-xl overflow-hidden rounded-[var(--radius-panel)] border border-line-strong bg-surface shadow-[0_24px_60px_-20px_rgb(0_0_0/0.5)]"
        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -4, scale: 0.99 }}
        transition={{
          duration: reduceMotion ? 0 : 0.16,
          ease: [0.25, 1, 0.5, 1],
        }}
      >
        <div className="flex items-center gap-3 border-b border-line px-4">
          <Search size={16} aria-hidden className="shrink-0 text-subtle" />
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={activeCommand ? optionId(activeIndex) : undefined}
            aria-label="Search commands and projects"
            placeholder="Search sections, projects, links…"
            autoComplete="off"
            spellCheck={false}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            className="h-14 w-full bg-transparent text-base text-text placeholder:text-subtle focus:outline-none"
          />
          <kbd className="hidden shrink-0 rounded-[4px] border border-line px-1.5 py-0.5 font-mono text-2xs text-subtle sm:inline">
            Esc
          </kbd>
        </div>

        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          aria-label="Results"
          className="max-h-[min(60vh,26rem)] overflow-y-auto overscroll-contain p-2"
        >
          {results.length === 0 ? (
            <li role="presentation" className="px-3 py-8 text-center text-sm text-muted">
              Nothing matches “{query}”. Try a project name or a technology like “Python”.
            </li>
          ) : (
            grouped.map(({ group, items }) => (
              <li key={group} role="presentation">
                <div
                  className="px-3 pt-3 pb-1.5 text-2xs font-medium text-subtle"
                  aria-hidden="true"
                >
                  {group}
                </div>
                <ul role="group" aria-label={group}>
                  {items.map(({ command, index }) => {
                    const active = index === activeIndex;
                    return (
                      <li
                        key={command.id}
                        id={optionId(index)}
                        role="option"
                        aria-selected={active}
                        onMouseMove={() => setActiveIndex(index)}
                        onClick={() => void run(command)}
                        className={cn(
                          "flex min-h-11 cursor-pointer items-center gap-3 rounded-[var(--radius-control)] px-3 text-sm",
                          active ? "bg-surface-raised text-text" : "text-muted",
                        )}
                      >
                        <span className={active ? "text-accent" : "text-subtle"}>
                          <CommandIcon command={command} />
                        </span>
                        <span className="truncate">{command.label}</span>
                        {command.hint ? (
                          <span className="ml-auto hidden truncate text-2xs text-subtle sm:block">
                            {command.hint}
                          </span>
                        ) : null}
                        {active ? (
                          <CornerDownLeft
                            size={13}
                            aria-hidden
                            className={cn("shrink-0 text-subtle", !command.hint && "ml-auto")}
                          />
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))
          )}
        </ul>

        <div className="hidden items-center gap-4 border-t border-line px-4 py-2.5 text-2xs text-subtle sm:flex">
          <span>
            <kbd className="font-mono">↑ ↓</kbd> to move
          </span>
          <span>
            <kbd className="font-mono">Enter</kbd> to open
          </span>
          <span>
            <kbd className="font-mono">Esc</kbd> to close
          </span>
        </div>
      </motion.div>
    </div>
  );
}
