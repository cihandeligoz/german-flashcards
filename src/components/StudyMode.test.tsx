import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StudyMode } from "./StudyMode";
import type { Flashcard } from "@/domain";

function makeCard(overrides: Partial<Flashcard> = {}): Flashcard {
  return {
    id: "a",
    german: "das Haus",
    english: "the house",
    examples: ["Das Haus ist groß. (The house is big.)"],
    level: 1,
    timesSeen: 0,
    timesKnown: 0,
    createdAt: 0,
    lastReviewedAt: null,
    lastKnownAt: null,
    ...overrides,
  };
}

describe("StudyMode", () => {
  it("shows an empty state when there are no cards", () => {
    render(<StudyMode cards={[]} onAnswer={vi.fn()} goToAdd={vi.fn()} />);
    expect(screen.getByText(/no cards to study/i)).toBeInTheDocument();
  });

  it("shows the position and disables Previous on the first card", () => {
    render(
      <StudyMode
        cards={[
          makeCard({ id: "a" }),
          makeCard({ id: "b", german: "der Hund" }),
        ]}
        onAnswer={vi.fn()}
        goToAdd={vi.fn()}
      />,
    );
    expect(screen.getByText("Card 1 / 2")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /previous/i })).toBeDisabled();
  });

  it("reveals the answer and records a correct response", async () => {
    const user = userEvent.setup();
    const onAnswer = vi.fn();
    render(
      <StudyMode cards={[makeCard()]} onAnswer={onAnswer} goToAdd={vi.fn()} />,
    );

    // Answer is hidden until revealed.
    expect(screen.queryByText("the house")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /reveal answer/i }));
    expect(screen.getByText("the house")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /knew it/i }));
    expect(onAnswer).toHaveBeenCalledWith("a", true);
  });

  it("skips to the next card without recording an answer", async () => {
    const user = userEvent.setup();
    const onAnswer = vi.fn();
    render(
      <StudyMode
        cards={[makeCard({ id: "a" }), makeCard({ id: "b" })]}
        onAnswer={onAnswer}
        goToAdd={vi.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: /skip/i }));
    expect(screen.getByText("Card 2 / 2")).toBeInTheDocument();
    expect(onAnswer).not.toHaveBeenCalled();
  });
});
