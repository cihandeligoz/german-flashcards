import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LevelFilter } from "./LevelFilter";

describe("LevelFilter", () => {
  it("adds a level to the selection when clicked", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<LevelFilter selected={[]} onChange={onChange} />);

    await user.click(screen.getByRole("button", { name: "A2" }));
    expect(onChange).toHaveBeenCalledWith(["A2"]);
  });

  it("removes a level that is already selected", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<LevelFilter selected={["A1", "A2"]} onChange={onChange} />);

    await user.click(screen.getByRole("button", { name: "A1" }));
    expect(onChange).toHaveBeenCalledWith(["A2"]);
  });

  it("clears the selection when All is clicked", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<LevelFilter selected={["B1"]} onChange={onChange} />);

    await user.click(screen.getByRole("button", { name: "All" }));
    expect(onChange).toHaveBeenCalledWith([]);
  });

  it("marks All active on an empty selection and levels active when included", () => {
    const { rerender } = render(
      <LevelFilter selected={[]} onChange={vi.fn()} />,
    );
    expect(screen.getByRole("button", { name: "All" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "A1" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );

    rerender(<LevelFilter selected={["A1"]} onChange={vi.fn()} />);
    expect(screen.getByRole("button", { name: "All" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    expect(screen.getByRole("button", { name: "A1" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });
});
