import { useCallback, useEffect, useMemo, useReducer } from "react";
import {
  computeStats,
  type AppState,
  type NewCardInput,
  type Stats,
} from "@/domain";
import { loadState, saveState } from "@/services";
import { flashcardsReducer } from "@/state";
import { makeId } from "@/lib";

export interface UseFlashcards {
  state: AppState;
  stats: Stats;
  addCard: (input: NewCardInput) => void;
  deleteCard: (id: string) => void;
  answerCard: (id: string, knew: boolean) => void;
}

/**
 * The app's single source of truth. Wraps the pure reducer with persistence
 * and injects non-deterministic values (ids, timestamps) at dispatch time.
 */
export function useFlashcards(): UseFlashcards {
  const [state, dispatch] = useReducer(flashcardsReducer, undefined, loadState);

  // Persist the whole deck on every change.
  useEffect(() => {
    saveState(state);
  }, [state]);

  const addCard = useCallback((input: NewCardInput) => {
    dispatch({ type: "ADD_CARD", input, id: makeId(), now: Date.now() });
  }, []);

  const deleteCard = useCallback((id: string) => {
    dispatch({ type: "DELETE_CARD", id });
  }, []);

  const answerCard = useCallback((id: string, knew: boolean) => {
    dispatch({ type: "ANSWER_CARD", id, knew, now: Date.now() });
  }, []);

  const stats = useMemo(() => computeStats(state, Date.now()), [state]);

  return { state, stats, addCard, deleteCard, answerCard };
}
