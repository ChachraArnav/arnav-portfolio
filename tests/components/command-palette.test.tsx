import { routerMock } from "../setup/next-navigation";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  CommandPaletteProvider,
  useCommandPalette,
} from "@/components/command/command-palette-provider";
import { siteConfig } from "@/config/site";

function Opener() {
  const { setOpen } = useCommandPalette();
  return (
    <button type="button" onClick={() => setOpen(true)}>
      Open palette
    </button>
  );
}

function renderPalette() {
  return render(
    <CommandPaletteProvider>
      <Opener />
    </CommandPaletteProvider>,
  );
}

describe("Command palette", () => {
  beforeEach(() => {
    routerMock.push.mockClear();
  });

  it("opens with Ctrl+K and Cmd+K, and focuses the search field", async () => {
    const user = userEvent.setup();
    renderPalette();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.keyboard("{Control>}k{/Control}");
    const dialog = await screen.findByRole("dialog", { name: "Command palette" });
    expect(dialog).toHaveAttribute("aria-modal", "true");
    await waitFor(() => expect(screen.getByRole("combobox")).toHaveFocus());

    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());

    await user.keyboard("{Meta>}k{/Meta}");
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
  });

  it("closes with Escape and returns focus to the element that opened it", async () => {
    const user = userEvent.setup();
    renderPalette();
    const opener = screen.getByRole("button", { name: "Open palette" });
    await user.click(opener);
    await screen.findByRole("dialog");
    await waitFor(() => expect(screen.getByRole("combobox")).toHaveFocus());

    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    await waitFor(() => expect(opener).toHaveFocus());
  });

  it("searches projects by technology and opens the result with Enter", async () => {
    const user = userEvent.setup();
    renderPalette();
    await user.keyboard("{Control>}k{/Control}");
    const input = await screen.findByRole("combobox");

    await user.type(input, "postgresql");
    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(1);
    expect(options[0]).toHaveTextContent("EMAK Solutions");
    expect(options[0]).toHaveAttribute("aria-selected", "true");
    expect(input).toHaveAttribute("aria-activedescendant", options[0]?.id);

    await user.keyboard("{Enter}");
    expect(routerMock.push).toHaveBeenCalledWith("/projects/emak-solutions");
  });

  it("moves the active option with arrow keys and wraps around", async () => {
    const user = userEvent.setup();
    renderPalette();
    await user.keyboard("{Control>}k{/Control}");
    await waitFor(() => expect(screen.getByRole("combobox")).toHaveFocus());

    const options = screen.getAllByRole("option");
    expect(options[0]).toHaveAttribute("aria-selected", "true");
    await user.keyboard("{ArrowDown}");
    expect(screen.getAllByRole("option")[1]).toHaveAttribute("aria-selected", "true");
    await user.keyboard("{ArrowUp}{ArrowUp}");
    const all = screen.getAllByRole("option");
    expect(all[all.length - 1]).toHaveAttribute("aria-selected", "true");
  });

  it("navigates to sections and contact", async () => {
    const user = userEvent.setup();
    renderPalette();
    await user.keyboard("{Control>}k{/Control}");
    const input = await screen.findByRole("combobox");
    await user.type(input, "contact information");
    await user.keyboard("{Enter}");
    expect(routerMock.push).toHaveBeenCalledWith("/#contact");
  });

  it("opens GitHub and LinkedIn in a new tab with safe options", async () => {
    const open = vi.spyOn(window, "open").mockReturnValue(null);
    const user = userEvent.setup();
    renderPalette();
    await user.keyboard("{Control>}k{/Control}");
    const input = await screen.findByRole("combobox");

    await user.type(input, "github");
    await user.keyboard("{Enter}");
    expect(open).toHaveBeenCalledWith(siteConfig.links.github, "_blank", "noopener,noreferrer");
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());

    await user.keyboard("{Control>}k{/Control}");
    await user.type(await screen.findByRole("combobox"), "linkedin");
    await user.keyboard("{Enter}");
    expect(open).toHaveBeenCalledWith(siteConfig.links.linkedin, "_blank", "noopener,noreferrer");
    open.mockRestore();
  });

  it("toggles animated effects and remembers the choice", async () => {
    document.documentElement.dataset.motion = "reduce";
    const user = userEvent.setup();
    renderPalette();
    await user.keyboard("{Control>}k{/Control}");
    await user.type(await screen.findByRole("combobox"), "animated effects");
    await user.keyboard("{Enter}");

    expect(document.documentElement.dataset.motion).toBe("full");
    expect(localStorage.getItem("motion")).toBe("full");
    expect(await screen.findByText("Animated effects on")).toBeInTheDocument();
  });

  it("does not offer a resume download", async () => {
    const user = userEvent.setup();
    renderPalette();
    await user.keyboard("{Control>}k{/Control}");
    await user.type(await screen.findByRole("combobox"), "resume");
    expect(screen.queryAllByRole("option")).toHaveLength(0);
  });

  it("shows a helpful empty state", async () => {
    const user = userEvent.setup();
    renderPalette();
    await user.keyboard("{Control>}k{/Control}");
    await user.type(await screen.findByRole("combobox"), "zzzz-no-match");
    expect(screen.queryAllByRole("option")).toHaveLength(0);
    expect(screen.getByText(/Nothing matches/)).toBeInTheDocument();
  });
});

describe("Command palette ordering", () => {
  it("highlights the first option shown, whatever the ranking", async () => {
    const user = userEvent.setup();
    renderPalette();
    await user.keyboard("{Control>}k{/Control}");
    await user.type(await screen.findByRole("combobox"), "py");
    const options = screen.getAllByRole("option");
    expect(options[0]).toHaveAttribute("aria-selected", "true");
    expect(options[0]).toHaveTextContent("Copy email address");
    expect(options.map((o) => o.textContent).join(" ")).toContain("MarketLens");
  });
});
