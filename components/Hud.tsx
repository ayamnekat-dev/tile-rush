import { comboMultiplier, INITIAL_LIVES } from "@/lib/game";
import styles from "./Hud.module.css";

type HudProps = {
  score: number;
  lives: number;
  combo: number;
  highScore: number;
};

export function Hud({ score, lives, combo, highScore }: HudProps) {
  const multiplier = comboMultiplier(combo);

  return (
    <header className={styles.hud}>
      <div className={styles.cluster}>
        <span className={styles.label}>Skor</span>
        <strong className={styles.score}>{score}</strong>
        <span className={styles.sub}>Terbaik {highScore}</span>
      </div>

      <div className={styles.lives} aria-label={`${lives} nyawa tersisa`}>
        {Array.from({ length: INITIAL_LIVES }, (_, index) => (
          <span
            key={index}
            className={`${styles.life} ${index < lives ? styles.lifeOn : ""}`}
          />
        ))}
      </div>

      <div className={styles.cluster}>
        <span className={styles.label}>Combo</span>
        <strong className={styles.combo}>
          {combo}
          {multiplier > 1 ? <em> ×{multiplier}</em> : null}
        </strong>
        <span className={styles.sub}>Streak</span>
      </div>
    </header>
  );
}
