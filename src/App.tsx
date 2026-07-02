import { useMemo, useState } from "react";
import { useFlashcards } from "@/hooks";
import { AddCard, Stats, StudyMode } from "@/components";

type Tab = "study" | "add" | "stats";

export function App() {
  const { state, stats, addCard, deleteCard, answerCard, setStudyLevels } =
    useFlashcards();
  const [tab, setTab] = useState<Tab>("study");

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
            selectedLevels={state.studyLevels ?? []}
            onLevelsChange={setStudyLevels}
          />
        )}
        {tab === "add" && (
          <AddCard onAdd={addCard} cards={state.cards} onDelete={deleteCard} />
        )}
        {tab === "stats" && <Stats stats={stats} />}
      </main>
    </div>
  );
}
