import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AddCard } from "./AddCard";
import { generateExamples } from "@/services";

// Isolate the component from the network by mocking the AI service.
vi.mock("@/services", () => ({
  generateExamples: vi.fn(),
}));

const german = () => screen.getByPlaceholderText(/z\. B\./);
const english = () => screen.getByPlaceholderText(/the house/i);

describe("AddCard", () => {
  beforeEach(() => {
    vi.mocked(generateExamples).mockReset();
  });

  it("adds a trimmed card from the form", async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<AddCard cards={[]} onAdd={onAdd} onDelete={vi.fn()} />);

    await user.type(german(), "die Katze");
    await user.type(english(), "the cat");
    await user.click(screen.getByRole("button", { name: /add card/i }));

    expect(onAdd).toHaveBeenCalledWith({
      german: "die Katze",
      english: "the cat",
      examples: [],
    });
  });

  it("fills the examples field from the AI generator", async () => {
    const user = userEvent.setup();
    vi.mocked(generateExamples).mockResolvedValue([
      "Die Katze schläft. (The cat sleeps.)",
    ]);
    render(<AddCard cards={[]} onAdd={vi.fn()} onDelete={vi.fn()} />);

    await user.type(german(), "die Katze");
    await user.type(english(), "the cat");
    await user.click(
      screen.getByRole("button", { name: /generate examples/i }),
    );

    expect(
      await screen.findByDisplayValue(/Die Katze schläft/),
    ).toBeInTheDocument();
    expect(generateExamples).toHaveBeenCalledWith("die Katze", "the cat");
  });

  it("surfaces an error when generation fails", async () => {
    const user = userEvent.setup();
    vi.mocked(generateExamples).mockRejectedValue(new Error("boom"));
    render(<AddCard cards={[]} onAdd={vi.fn()} onDelete={vi.fn()} />);

    await user.type(german(), "die Katze");
    await user.type(english(), "the cat");
    await user.click(
      screen.getByRole("button", { name: /generate examples/i }),
    );

    expect(await screen.findByText("boom")).toBeInTheDocument();
  });
});
