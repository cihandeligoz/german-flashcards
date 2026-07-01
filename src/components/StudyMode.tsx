import { useEffect, useRef, useState } from "react";
import type { Flashcard } from "../types";
import { buildStudyOrder } from "../srs";

interface Props {
  cards: Flashcard[];
  onAnswer: (id: string, knew: boolean) => void;
  goToAdd: () => void;
}

/** Membership signature — changes only when cards are added or removed. */
function signatureOf(cards: Flashcard[]): string {
  return cards.map((c) => c.id).join("|");
}

export function StudyMode({ cards, onAnswer, goToAdd }: Props) {
  // A stable, weighted-shuffled order of the deck for this session. We only
  // rebuild it when the deck's membership changes, so Previous/Next and the
  // "Card N / total" position stay coherent while studying.
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

  if (cards.length === 0) {
    return (
      <div className="panel empty">
        <p>No cards to study yet.</p>
        <button className="btn btn--primary" onClick={goToAdd}>
          Add your first card
        </button>
      </div>
    );
  }

  // Clamp in case the deck shrank before the effect re-ran this render.
  const safePos = Math.min(pos, order.length - 1);
  const card = cards.find((c) => c.id === order[safePos]) ?? cards[0];

  const goPrev = () => {
    setPos((p) => Math.max(0, p - 1));
    setRevealed(false);
  };
  const goNext = () => {
    setPos((p) => (p + 1) % order.length);
    setRevealed(false);
  };
  const answer = (knew: boolean) => {
    onAnswer(card.id, knew);
    goNext();
  };

  return (
    <div className="panel study">
      <div className="study__progress">
        Card {safePos + 1} / {order.length}
      </div>

      <div className="flashcard">
        <span className="flashcard__label">German</span>
        <p className="flashcard__word">{card.german}</p>

        {revealed ? (
          <div className="flashcard__back">
            <span className="flashcard__label">English</span>
            <p className="flashcard__answer">{card.english}</p>
            {card.examples.length > 0 && (
              <ul className="examples">
                {card.examples.map((ex, i) => (
                  <li key={i}>{ex}</li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <p className="hint">Think of the translation…</p>
        )}
      </div>

      {revealed ? (
        <div className="row row--center">
          <button className="btn btn--danger" onClick={() => answer(false)}>
            ✗ Didn't know
          </button>
          <button className="btn btn--success" onClick={() => answer(true)}>
            ✓ Knew it
          </button>
        </div>
      ) : (
        <div className="row row--center">
          <button className="btn btn--primary" onClick={() => setRevealed(true)}>
            Reveal answer
          </button>
        </div>
      )}

      <div className="study__nav">
        <button
          className="btn btn--ghost"
          onClick={goPrev}
          disabled={safePos === 0}
        >
          ◀ Previous
        </button>
        <button className="btn btn--ghost" onClick={goNext}>
          Skip ▶
        </button>
      </div>
    </div>
  );
}
