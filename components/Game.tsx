"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import {
  createInitialState,
  gameReducer,
  INITIAL_LIVES,
  type GameAction,
} from "@/lib/game";
import {
  getHighScoreServerSnapshot,
  getHighScoreSnapshot,
  subscribeHighScore,
} from "@/lib/storage";
import { Board } from "./Board";
import { GameOverScreen } from "./GameOverScreen";
import { Hud } from "./Hud";
import { MenuScreen } from "./MenuScreen";
import { PauseScreen } from "./PauseScreen";
import styles from "./Game.module.css";

const FEEDBACK_MS = 220;

export function Game() {
  const [state, setState] = useState(createInitialState);
  const [now, setNow] = useState(() => Date.now());
  const [feedback, setFeedback] = useState<Record<number, "hit" | "miss">>({});
  const [bestAtStart, setBestAtStart] = useState(0);
  const highScore = useSyncExternalStore(
    subscribeHighScore,
    getHighScoreSnapshot,
    getHighScoreServerSnapshot,
  );

  const applyAction = useCallback((action: GameAction) => {
    setState((current) => gameReducer(current, action));
  }, []);

  useEffect(() => {
    if (state.phase !== "playing") return;

    const id = window.setInterval(() => {
      const timestamp = Date.now();
      setNow(timestamp);
      applyAction({ type: "TICK", now: timestamp });
    }, 50);

    return () => window.clearInterval(id);
  }, [applyAction, state.phase]);

  const start = useCallback(() => {
    const timestamp = Date.now();
    setBestAtStart(getHighScoreSnapshot());
    setFeedback({});
    setNow(timestamp);
    applyAction({ type: "START", now: timestamp });
  }, [applyAction]);

  const tap = useCallback(
    (index: number) => {
      if (state.phase !== "playing") return;

      const wasActive = state.activeTiles.some((tile) => tile.index === index);
      setFeedback((current) => ({
        ...current,
        [index]: wasActive ? "hit" : "miss",
      }));
      window.setTimeout(() => {
        setFeedback((current) => {
          const next = { ...current };
          delete next[index];
          return next;
        });
      }, FEEDBACK_MS);

      applyAction({ type: "TAP", index, now: Date.now() });
    },
    [applyAction, state.activeTiles, state.phase],
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " ") {
        if (state.phase === "menu" || state.phase === "gameover") {
          event.preventDefault();
          start();
        } else if (state.phase === "paused") {
          event.preventDefault();
          applyAction({ type: "RESUME", now: Date.now() });
        }
      }

      if (event.key === "Escape") {
        if (state.phase === "playing") {
          applyAction({ type: "PAUSE", now: Date.now() });
        } else if (state.phase === "paused") {
          applyAction({ type: "RESUME", now: Date.now() });
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [applyAction, start, state.phase]);

  const isNewBest =
    state.phase === "gameover" && state.score > bestAtStart && state.score > 0;

  return (
    <section className={styles.shell}>
      <div className={styles.glowA} />
      <div className={styles.glowB} />

      <Hud
        score={state.score}
        lives={state.lives}
        combo={state.combo}
        highScore={Math.max(highScore, state.score)}
      />

      <Board
        activeTiles={
          state.phase === "playing" || state.phase === "paused"
            ? state.activeTiles
            : []
        }
        feedback={feedback}
        now={now}
        disabled={state.phase !== "playing"}
        hitsTaken={INITIAL_LIVES - state.lives}
        onTap={tap}
      />

      {state.phase === "playing" ? (
        <button
          type="button"
          className={styles.pauseBtn}
          onClick={() => applyAction({ type: "PAUSE", now: Date.now() })}
        >
          Jeda
        </button>
      ) : (
        <div className={styles.pauseBtnSpacer} />
      )}

      {state.phase === "menu" ? (
        <MenuScreen highScore={highScore} onStart={start} />
      ) : null}

      {state.phase === "paused" ? (
        <PauseScreen
          onResume={() => applyAction({ type: "RESUME", now: Date.now() })}
          onMenu={() => applyAction({ type: "TO_MENU" })}
        />
      ) : null}

      {state.phase === "gameover" ? (
        <GameOverScreen
          score={state.score}
          highScore={Math.max(highScore, state.score)}
          maxCombo={state.maxCombo}
          isNewBest={isNewBest}
          onRetry={start}
          onMenu={() => applyAction({ type: "TO_MENU" })}
        />
      ) : null}
    </section>
  );
}
