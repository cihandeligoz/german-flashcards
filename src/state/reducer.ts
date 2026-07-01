import {
  reviewCard,
  type AppState,
  type Flashcard,
  type NewCardInput,
} from "@/domain";

/**
 * Actions for the flashcard store. Non-deterministic inputs (id, timestamps)
 * are passed in by the caller so the reducer stays pure and unit-testable.
 */
export type FlashcardAction =
  | { type: "ADD_CARD"; input: NewCardInput; id: string; now: number }
  | { type: "DELETE_CARD"; id: string }
  | { type: "ANSWER_CARD"; id: string; knew: boolean; now: number };

export function flashcardsReducer(
  state: AppState,
  action: FlashcardAction,
): AppState {
  switch (action.type) {
    case "ADD_CARD": {
      const card: Flashcard = {
        id: action.id,
        german: action.input.german.trim(),
        english: action.input.english.trim(),
        examples: action.input.examples.map((e) => e.trim()).filter(Boolean),
        level: 1,
        timesSeen: 0,
        timesKnown: 0,
        createdAt: action.now,
        lastReviewedAt: null,
        lastKnownAt: null,
      };
      return { ...state, cards: [...state.cards, card] };
    }
    case "DELETE_CARD":
      return { ...state, cards: state.cards.filter((c) => c.id !== action.id) };
    case "ANSWER_CARD":
      return {
        ...state,
        cards: state.cards.map((c) =>
          c.id === action.id ? reviewCard(c, action.knew, action.now) : c,
        ),
        reviews: [
          ...state.reviews,
          { cardId: action.id, knew: action.knew, at: action.now },
        ],
      };
    default:
      return state;
  }
}
