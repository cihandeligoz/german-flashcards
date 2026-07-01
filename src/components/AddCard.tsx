import { useState } from "react";
import type { CefrLevel, Flashcard, NewCardInput } from "@/domain";
import { generateExamples } from "@/services";

interface Props {
  onAdd: (data: NewCardInput) => void;
  onDelete: (id: string) => void;
  cards: Flashcard[];
}

export function AddCard({ onAdd, onDelete, cards }: Props) {
  const [german, setGerman] = useState("");
  const [english, setEnglish] = useState("");
  const [examplesText, setExamplesText] = useState("");
  const [cefr, setCefr] = useState<CefrLevel>("A1");
  const [generating, setGenerating] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const canSubmit = german.trim().length > 0 && english.trim().length > 0;

  async function handleGenerate() {
    if (!german.trim() || !english.trim()) {
      setAiError("Enter a German word and its translation first.");
      return;
    }
    setGenerating(true);
    setAiError(null);
    try {
      const examples = await generateExamples(german.trim(), english.trim());
      setExamplesText((prev) => {
        const existing = prev.trim();
        return existing
          ? `${existing}\n${examples.join("\n")}`
          : examples.join("\n");
      });
    } catch (err) {
      setAiError(
        err instanceof Error ? err.message : "Failed to generate examples.",
      );
    } finally {
      setGenerating(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    onAdd({
      german,
      english,
      cefr,
      examples: examplesText
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean),
    });
    setGerman("");
    setEnglish("");
    setExamplesText("");
    setCefr("A1");
    setAiError(null);
  }

  return (
    <div className="stack">
      <form className="card panel" onSubmit={handleSubmit}>
        <h2>New flashcard</h2>

        <label className="field">
          <span>German word</span>
          <input
            value={german}
            onChange={(e) => setGerman(e.target.value)}
            placeholder="z. B. das Haus"
            autoFocus
          />
        </label>

        <label className="field">
          <span>English translation</span>
          <input
            value={english}
            onChange={(e) => setEnglish(e.target.value)}
            placeholder="e.g. the house"
          />
        </label>

        <label className="field">
          <span>Level</span>
          <select
            value={cefr}
            onChange={(e) => setCefr(e.target.value as CefrLevel)}
          >
            <option value="A1">A1</option>
            <option value="A2">A2</option>
          </select>
        </label>

        <label className="field">
          <span>Example sentences (one per line)</span>
          <textarea
            value={examplesText}
            onChange={(e) => setExamplesText(e.target.value)}
            rows={4}
            placeholder="Add your own, or generate with AI…"
          />
        </label>

        <div className="row">
          <button
            type="button"
            className="btn btn--ghost"
            onClick={handleGenerate}
            disabled={generating}
          >
            {generating ? "Generating…" : "✨ Generate examples with AI"}
          </button>
          <button
            type="submit"
            className="btn btn--primary"
            disabled={!canSubmit}
          >
            Add card
          </button>
        </div>

        {aiError && <p className="error">{aiError}</p>}
      </form>

      <section className="panel">
        <h2>
          Your cards <span className="muted">({cards.length})</span>
        </h2>
        {cards.length === 0 ? (
          <p className="muted">No cards yet. Add your first one above.</p>
        ) : (
          <ul className="card-list">
            {cards.map((c) => (
              <li key={c.id} className="card-list__item">
                <div>
                  <span className={`cefr-chip cefr-chip--${c.cefr}`}>
                    {c.cefr}
                  </span>
                  <strong>{c.german}</strong>
                  <span className="muted"> — {c.english}</span>
                  <span className={`pill pill--lvl${c.level}`}>
                    lvl {c.level}
                  </span>
                </div>
                <button
                  className="btn btn--danger btn--small"
                  onClick={() => onDelete(c.id)}
                  aria-label={`Delete ${c.german}`}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
