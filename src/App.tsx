import { useCallback, useEffect, useMemo, useState } from "react";
import type { AppState, Flashcard } from "./types";
import { loadState, saveState } from "./storage";
import { reviewCard } from "./srs";
import { AddCard } from "./components/AddCard";
import { StudyMode } from "./components/StudyMode";
import { Stats } from "./components/Stats";

type Tab = "study" | "add" | "stats";

function makeId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function App() {
  const [state, setState] = useState<AppState>(() => loadState());
  const [tab, setTab] = useState<Tab>("study");

  // Persist on every change.
  useEffect(() => {
    saveState(state);
  }, [state]);

  const addCard = useCallback(
    (data: { german: string; english: string; examples: string[] }) => {
      const now = Date.now();
      const card: Flashcard = {
        id: makeId(),
        german: data.german.trim(),
        english: data.english.trim(),
        examples: data.examples.map((e) => e.trim()).filter(Boolean),
        level: 1,
        timesSeen: 0,
        timesKnown: 0,
        createdAt: now,
        lastReviewedAt: null,
        lastKnownAt: null,
      };
      setState((s) => ({ ...s, cards: [...s.cards, card] }));
    },
    [],
  );

  const deleteCard = useCallback((id: string) => {
    setState((s) => ({ ...s, cards: s.cards.filter((c) => c.id !== id) }));
  }, []);

  const answerCard = useCallback((id: string, knew: boolean) => {
    const now = Date.now();
    setState((s) => ({
      cards: s.cards.map((c) => (c.id === id ? reviewCard(c, knew, now) : c)),
      reviews: [...s.reviews, { cardId: id, knew, at: now }],
    }));
  }, []);

  const tabs: { key: Tab; label: string }[] = useMemo(
    () => [
      { key: "study", label: "Study" },
      { key: "add", label: "Add card" },
      { key: "stats", label: "Statistics" },
    ],
    [],
  );

  return (
    <div className="app">
      <header className="header">
        <h1>
          Deutsch<span className="accent"> Flashcards</span>
        </h1>
        <nav className="tabs">
          {tabs.map((t) => (
            <button
              key={t.key}
              className={`tab ${tab === t.key ? "tab--active" : ""}`}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="content">
        {tab === "study" && (
          <StudyMode
            cards={state.cards}
            onAnswer={answerCard}
            goToAdd={() => setTab("add")}
          />
        )}
        {tab === "add" && (
          <AddCard
            onAdd={addCard}
            cards={state.cards}
            onDelete={deleteCard}
          />
        )}
        {tab === "stats" && <Stats state={state} />}
      </main>
    </div>
  );
}
