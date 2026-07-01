import { useEffect, useRef, useState } from "react";
import { buildStudyOrder, type Flashcard } from "@/domain";

/** Membership signature — changes only when cards are added or removed. */
function signatureOf(cards: Flashcard[]): string {
  return cards.map((c) => c.id).join("|");
}

export interface StudySession {
  card: Flashcard | null;
  position: number;
  total: number;
  revealed: boolean;
  canPrev: boolean;
  reveal: () => void;
  prev: () => void;
  next: () => void;
  answer: (knew: boolean) => void;
}

/**
 * Drives the study flow: a stable, weighted-shuffled order of the deck plus a
 * cursor. The order is only rebuilt when the deck's membership changes, so
 * Previous/Next and the "Card N / total" position stay coherent mid-session.
 */
export function useStudySession(
  cards: Flashcard[],
  onAnswer: (id: string, knew: boolean) => void,
): StudySession {
  const [order, setOrder] = useState<string[]>(() => buildStudyOrder(cards));
  const [pos, setPos] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const sig = useRef(signatureOf(cards));

  useEffect(() => {
    const next = signatureOf(cards);
    if (next !== sig.current) {
      sig.current = next;
      setOrder(buildStudyOrder(cards));
      setPos(0);
      setRevealed(false);
    }
  }, [cards]);

  const total = order.length;
  const safePos = total > 0 ? Math.min(pos, total - 1) : 0;
  const card =
    total > 0
      ? (cards.find((c) => c.id === order[safePos]) ?? cards[0] ?? null)
      : null;

  const reveal = () => setRevealed(true);
  const prev = () => {
    setPos((p) => Math.max(0, p - 1));
    setRevealed(false);
  };
  const next = () => {
    setPos((p) => (total > 0 ? (p + 1) % total : 0));
    setRevealed(false);
  };
  const answer = (knew: boolean) => {
    if (!card) return;
    onAnswer(card.id, knew);
    next();
  };

  return {
    card,
    position: safePos + 1,
    total,
    revealed,
    canPrev: safePos > 0,
    reveal,
    prev,
    next,
    answer,
  };
}
