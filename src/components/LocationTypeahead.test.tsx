import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { describe, expect, it, vi } from "vitest";
import { LocationTypeahead } from "@/components/LocationTypeahead";
import { lagos, nairobi } from "@/test/fixtures";

function renderTypeahead(
  overrides: Partial<ComponentProps<typeof LocationTypeahead>> = {},
) {
  const props = {
    query: "la",
    onQueryChange: vi.fn(),
    results: [lagos, nairobi],
    status: "success" as const,
    error: null,
    onSelect: vi.fn(),
    ...overrides,
  };

  render(<LocationTypeahead {...props} />);
  return props;
}

describe("LocationTypeahead", () => {
  it("shows a loading state", async () => {
    const user = userEvent.setup();
    renderTypeahead({ results: [], status: "loading" });

    await user.click(screen.getByRole("combobox"));

    expect(screen.getByRole("combobox")).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Searching…")).toBeInTheDocument();
  });

  it("shows an empty state", async () => {
    const user = userEvent.setup();
    renderTypeahead({ results: [], status: "empty", query: "zzzz" });

    await user.click(screen.getByRole("combobox"));

    expect(screen.getByText(/no places match/i)).toBeInTheDocument();
  });

  it("shows an error state", async () => {
    const user = userEvent.setup();
    renderTypeahead({
      results: [],
      status: "error",
      error: "The location service is unavailable.",
    });

    await user.click(screen.getByRole("combobox"));

    expect(screen.getByRole("alert")).toHaveTextContent(/unavailable/i);
  });

  it("selects the highlighted location with the keyboard", async () => {
    const user = userEvent.setup();
    const { onSelect } = renderTypeahead();
    const input = screen.getByRole("combobox");

    await user.click(input);
    await user.keyboard("{ArrowDown}{Enter}");

    expect(onSelect).toHaveBeenCalledWith(nairobi);
  });

  it("closes the list on Escape", async () => {
    const user = userEvent.setup();
    renderTypeahead();

    await user.click(screen.getByRole("combobox"));
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });
});
