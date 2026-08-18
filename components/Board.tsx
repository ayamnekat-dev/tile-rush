import type { ActiveTile } from "@/lib/game";
import { GRID_SIZE, TILE_COUNT } from "@/lib/game";
import { Tile } from "./Tile";
import styles from "./Board.module.css";

type BoardProps = {
  activeTiles: ActiveTile[];
  feedback: Record<number, "hit" | "miss">;
  now: number;
  disabled: boolean;
  hitsTaken: number;
  onTap: (index: number) => void;
};

export function Board({
  activeTiles,
  feedback,
  now,
  disabled,
  hitsTaken,
  onTap,
}: BoardProps) {
  const activeByIndex = new Map(activeTiles.map((tile) => [tile.index, tile]));

  return (
    <div
      className={styles.board}
      data-hits={hitsTaken}
      style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}
      role="grid"
      aria-label="Papan Tile Rush"
    >
      {Array.from({ length: TILE_COUNT }, (_, index) => (
        <Tile
          key={index}
          index={index}
          activeTile={activeByIndex.get(index)}
          feedback={feedback[index] ?? null}
          now={now}
          disabled={disabled}
          onTap={onTap}
        />
      ))}
    </div>
  );
}
