import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StudyMode } from "./StudyMode";
import type { CefrLevel, Flashcard } from "@/domain";

function makeCard(overrides: Partial<Flashcard> = {}): Flashcard {
  return {
    id: "a",
    german: "das Haus",
    english: "the house",
    examples: ["Das Haus ist groß. (The house is big.)"],
    cefr: "A1",
    level: 1,
    timesSeen: 0,
    timesKnown: 0,
    createdAt: 0,
    lastReviewedAt: null,
    lastKnownAt: null,
    ...overrides,
  };
}

/** Render helper defaulting the level-filter props (All selected). */
function renderStudy(
  props: {
    cards: Flashcard[];
    onAnswer?: (id: string, knew: boolean) => void;
    selectedLevels?: CefrLevel[];
    onLevelsChange?: (next: CefrLevel[]) => void;
  } = { cards: [] },
) {
  return render(
    <StudyMode
      cards={props.cards}
      onAnswer={props.onAnswer ?? vi.fn()}
      goToAdd={vi.fn()}
      selectedLevels={props.selectedLevels ?? []}
      onLevelsChange={props.onLevelsChange ?? vi.fn()}
    />,
  );
}

describe("StudyMode", () => {
  it("shows an empty state when there are no cards", () => {
    renderStudy({ cards: [] });
    expect(screen.getByText(/no cards to study/i)).toBeInTheDocument();
    // The level filter is not shown for a truly empty deck.
    expect(
      screen.queryByRole("group", { name: /filter by level/i }),
    ).not.toBeInTheDocument();
  });

  it("shows the position and disables Previous on the first card", () => {
    renderStudy({
      cards: [makeCard({ id: "a" }), makeCard({ id: "b", german: "der Hund" })],
    });
    expect(screen.getByText("Card 1 / 2")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /previous/i })).toBeDisabled();
  });

  it("shows the CEFR level badge for the current card", () => {
    renderStudy({ cards: [makeCard({ cefr: "A2" })] });
    // Scope to the chip so it isn't confused with the "A2" filter button.
    expect(screen.getByText("A2", { selector: ".cefr-chip" })).toBeVisible();
  });

  it("reveals the answer and records a correct response", async () => {
    const user = userEvent.setup();
    const onAnswer = vi.fn();
    renderStudy({ cards: [makeCard()], onAnswer });

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
    renderStudy({
      cards: [makeCard({ id: "a" }), makeCard({ id: "b" })],
      onAnswer,
    });

    await user.click(screen.getByRole("button", { name: /skip/i }));
    expect(screen.getByText("Card 2 / 2")).toBeInTheDocument();
    expect(onAnswer).not.toHaveBeenCalled();
  });

  it("narrows the deck and total to the selected level", () => {
    renderStudy({
      cards: [
        makeCard({ id: "a", cefr: "A1" }),
        makeCard({ id: "b", cefr: "A1" }),
        makeCard({ id: "c", cefr: "A2", german: "der Hund" }),
      ],
      selectedLevels: ["A2"],
    });
    expect(screen.getByText("Card 1 / 1")).toBeInTheDocument();
    expect(screen.getByText("der Hund")).toBeInTheDocument();
  });

  it("shows the filter-empty message but keeps the selector when a level has no cards", () => {
    renderStudy({
      cards: [makeCard({ id: "a", cefr: "A1" })],
      selectedLevels: ["B2"],
    });
    expect(
      screen.getByText(/no cards at the selected level/i),
    ).toBeInTheDocument();
    // Selector stays visible so the user can change the selection.
    expect(
      screen.getByRole("group", { name: /filter by level/i }),
    ).toBeInTheDocument();
    // This is distinct from the empty-deck prompt.
    expect(screen.queryByText(/add your first card/i)).not.toBeInTheDocument();
  });
});
