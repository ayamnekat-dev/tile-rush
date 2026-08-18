"use client";

import { useEffect } from "react";
import { saveHighScore } from "@/lib/storage";
import styles from "./Overlay.module.css";

type GameOverScreenProps = {
  score: number;
  highScore: number;
  maxCombo: number;
  isNewBest: boolean;
  onRetry: () => void;
  onMenu: () => void;
};

export function GameOverScreen({
  score,
  highScore,
  maxCombo,
  isNewBest,
  onRetry,
  onMenu,
}: GameOverScreenProps) {
  useEffect(() => {
    saveHighScore(score);
  }, [score]);

  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        <p className={styles.kicker}>Sesi berakhir</p>
        <h1 className={styles.title}>GAME OVER</h1>
        {isNewBest ? (
          <p className={styles.badge}>Rekor baru</p>
        ) : null}

        <div className={styles.stats}>
          <div>
            <span>Skor</span>
            <strong>{score}</strong>
          </div>
          <div>
            <span>Terbaik</span>
            <strong>{highScore}</strong>
          </div>
          <div>
            <span>Combo max</span>
            <strong>{maxCombo}</strong>
          </div>
        </div>

        <div className={styles.actions}>
          <button type="button" className={styles.primary} onClick={onRetry}>
            Main lagi
          </button>
          <button type="button" className={styles.ghost} onClick={onMenu}>
            Menu
          </button>
        </div>
      </div>
    </div>
  );
}
