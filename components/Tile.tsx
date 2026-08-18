import type { ActiveTile } from "@/lib/game";
import { remainingMs } from "@/lib/game";
import styles from "./Tile.module.css";

type TileFeedback = "hit" | "miss" | null;

type TileProps = {
  index: number;
  activeTile: ActiveTile | undefined;
  feedback: TileFeedback;
  now: number;
  disabled: boolean;
  onTap: (index: number) => void;
};

export function Tile({
  index,
  activeTile,
  feedback,
  now,
  disabled,
  onTap,
}: TileProps) {
  const isActive = Boolean(activeTile);
  const ratio = activeTile
    ? remainingMs(activeTile, now) / activeTile.timeout
    : 0;
  const urgent = isActive && ratio < 0.32;

  const className = [
    styles.tile,
    isActive && activeTile ? styles[activeTile.hue] : "",
    urgent ? styles.urgent : "",
    feedback === "hit" ? styles.hit : "",
    feedback === "miss" ? styles.miss : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      className={className}
      disabled={disabled}
      aria-label={
        isActive ? `Tile ${index + 1} menyala, ketuk sekarang` : `Tile ${index + 1}`
      }
      onPointerDown={(event) => {
        event.preventDefault();
        if (!disabled) onTap(index);
      }}
    >
      {isActive ? (
        <span
          className={styles.timer}
          style={{ transform: `scaleX(${ratio})` }}
        />
      ) : null}
    </button>
  );
}
