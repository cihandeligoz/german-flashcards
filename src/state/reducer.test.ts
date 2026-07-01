import { describe, it, expect } from "vitest";
import { flashcardsReducer } from "./reducer";
import type { AppState } from "@/domain";

const empty: AppState = { cards: [], reviews: [], seedVersion: 2 };

describe("flashcardsReducer", () => {
  it("adds a trimmed card with sensible defaults (immutably)", () => {
    const next = flashcardsReducer(empty, {
      type: "ADD_CARD",
      input: {
        german: "  das Haus  ",
        english: " the house ",
        cefr: "A2",
        examples: ["  Ein Satz.  ", "", "Zwei."],
      },
      id: "id1",
      now: 1234,
    });

    expect(next.cards).toHaveLength(1);
    const c = next.cards[0]!;
    expect(c.german).toBe("das Haus");
    expect(c.english).toBe("the house");
    expect(c.examples).toEqual(["Ein Satz.", "Zwei."]); // trimmed, blanks dropped
    expect(c.cefr).toBe("A2");
    expect(c.level).toBe(1);
    expect(c.id).toBe("id1");
    expect(c.createdAt).toBe(1234);
    expect(empty.cards).toHaveLength(0); // source untouched
  });

  it("deletes a card by id", () => {
    const withCard = flashcardsReducer(empty, {
      type: "ADD_CARD",
      input: { german: "a", english: "a", cefr: "A1", examples: [] },
      id: "x",
      now: 0,
    });
    const next = flashcardsReducer(withCard, { type: "DELETE_CARD", id: "x" });
    expect(next.cards).toHaveLength(0);
  });

  it("records a review and updates the card on answer", () => {
    const withCard = flashcardsReducer(empty, {
      type: "ADD_CARD",
      input: { german: "a", english: "a", cefr: "A1", examples: [] },
      id: "x",
      now: 0,
    });
    const next = flashcardsReducer(withCard, {
      type: "ANSWER_CARD",
      id: "x",
      knew: true,
      now: 5000,
    });

    expect(next.reviews).toEqual([{ cardId: "x", knew: true, at: 5000 }]);
    expect(next.cards[0]!.level).toBe(2);
    expect(next.cards[0]!.timesKnown).toBe(1);
  });
});
