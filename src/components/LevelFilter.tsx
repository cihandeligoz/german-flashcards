import { CEFR_LEVELS, type CefrLevel } from "@/domain";

interface Props {
  selected: CefrLevel[];
  onChange: (next: CefrLevel[]) => void;
}

/**
 * Multi-select CEFR level picker for Study mode. The selection array is the
 * single source of truth: `[]` means "All". Toggling a level here keeps that
 * representation, so there is never a redundant "every level selected" state.
 */
export function LevelFilter({ selected, onChange }: Props) {
  const allActive = selected.length === 0;

  function toggle(level: CefrLevel) {
    onChange(
      selected.includes(level)
        ? selected.filter((l) => l !== level)
        : [...selected, level],
    );
  }

  return (
    <div className="level-filter" role="group" aria-label="Filter by level">
      <button
        type="button"
        className={`level-chip ${allActive ? "level-chip--active" : ""}`}
        aria-pressed={allActive}
        onClick={() => onChange([])}
      >
        All
      </button>
      {CEFR_LEVELS.map((level) => {
        const active = selected.includes(level);
        return (
          <button
            key={level}
            type="button"
            className={`level-chip ${active ? "level-chip--active" : ""}`}
            aria-pressed={active}
            onClick={() => toggle(level)}
          >
            {level}
          </button>
        );
      })}
    </div>
  );
}
