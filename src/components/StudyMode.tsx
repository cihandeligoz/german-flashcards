import { useMemo } from "react";
import { filterByLevels, type CefrLevel, type Flashcard } from "@/domain";
import { useStudySession } from "@/hooks";
import { LevelFilter } from "./LevelFilter";

interface Props {
  cards: Flashcard[];
  onAnswer: (id: string, knew: boolean) => void;
  goToAdd: () => void;
  selectedLevels: CefrLevel[];
  onLevelsChange: (next: CefrLevel[]) => void;
}

export function StudyMode({
  cards,
  onAnswer,
  goToAdd,
  selectedLevels,
  onLevelsChange,
}: Props) {
  const shown = useMemo(
    () => filterByLevels(cards, selectedLevels),
    [cards, selectedLevels],
  );

  const {
    card,
    position,
    total,
    revealed,
    canPrev,
    reveal,
    prev,
    next,
    answer,
  } = useStudySession(shown, onAnswer);

  // The whole deck is empty — nudge the user to add their first card. No filter
  // could help here, so the selector is not shown.
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

  return (
    <div className="panel study">
      <LevelFilter selected={selectedLevels} onChange={onLevelsChange} />

      {card ? (
        <>
          <div className="study__progress">
            Card {position} / {total}
          </div>

          <div className="flashcard">
            <span
              className={`cefr-chip cefr-chip--corner cefr-chip--${card.cefr}`}
            >
              {card.cefr}
            </span>
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
              <button className="btn btn--primary" onClick={reveal}>
                Reveal answer
              </button>
            </div>
          )}

          <div className="study__nav">
            <button
              className="btn btn--ghost"
              onClick={prev}
              disabled={!canPrev}
            >
              ◀ Previous
            </button>
            <button className="btn btn--ghost" onClick={next}>
              Skip ▶
            </button>
          </div>
        </>
      ) : (
        // Deck is non-empty but the current filter matches nothing.
        <p className="empty__hint">
          No cards at the selected level(s). Add some in the Add tab, or pick
          another level above.
        </p>
      )}
    </div>
  );
}
