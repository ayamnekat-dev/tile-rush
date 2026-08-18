export const GRID_SIZE = 4;
export const TILE_COUNT = GRID_SIZE * GRID_SIZE;
export const INITIAL_LIVES = 3;
export const INITIAL_TIMEOUT_MS = 1400;
export const MIN_TIMEOUT_MS = 480;
export const SPAWN_DELAY_MS = 160;
export const DUAL_SPAWN_SCORE = 150;

export type Hue = "cyan" | "magenta" | "lime";
export type Phase = "menu" | "playing" | "paused" | "gameover";

export type ActiveTile = {
  index: number;
  spawnedAt: number;
  timeout: number;
  hue: Hue;
};

export type GameState = {
  phase: Phase;
  score: number;
  lives: number;
  combo: number;
  maxCombo: number;
  activeTiles: ActiveTile[];
  nextSpawnAt: number;
  pauseStartedAt: number | null;
};

export type GameAction =
  | { type: "START"; now: number }
  | { type: "PAUSE"; now: number }
  | { type: "RESUME"; now: number }
  | { type: "TAP"; index: number; now: number }
  | { type: "TICK"; now: number }
  | { type: "TO_MENU" };

const HUES: Hue[] = ["cyan", "magenta", "lime"];

export function createInitialState(): GameState {
  return {
    phase: "menu",
    score: 0,
    lives: INITIAL_LIVES,
    combo: 0,
    maxCombo: 0,
    activeTiles: [],
    nextSpawnAt: 0,
    pauseStartedAt: null,
  };
}

export function comboMultiplier(combo: number): number {
  if (combo >= 10) return 3;
  if (combo >= 5) return 2;
  return 1;
}

export function timeoutForScore(score: number): number {
  const steps = Math.floor(score / 40);
  return Math.max(MIN_TIMEOUT_MS, INITIAL_TIMEOUT_MS - steps * 70);
}

export function spawnCountForScore(score: number): number {
  return score >= DUAL_SPAWN_SCORE ? 2 : 1;
}

export function remainingMs(tile: ActiveTile, now: number): number {
  return Math.max(0, tile.timeout - (now - tile.spawnedAt));
}

function pickHue(): Hue {
  return HUES[Math.floor(Math.random() * HUES.length)]!;
}

function spawnTiles(
  count: number,
  timeout: number,
  now: number,
  exclude: number[] = [],
): ActiveTile[] {
  const pool = Array.from({ length: TILE_COUNT }, (_, index) => index).filter(
    (index) => !exclude.includes(index),
  );
  const tiles: ActiveTile[] = [];

  for (let n = 0; n < count && pool.length > 0; n += 1) {
    const pick = Math.floor(Math.random() * pool.length);
    const index = pool.splice(pick, 1)[0]!;
    tiles.push({
      index,
      spawnedAt: now,
      timeout,
      hue: pickHue(),
    });
  }

  return tiles;
}

function spawnWave(score: number, now: number): ActiveTile[] {
  return spawnTiles(spawnCountForScore(score), timeoutForScore(score), now);
}

function withGameOver(state: GameState): GameState {
  return {
    ...state,
    phase: "gameover",
    lives: 0,
    combo: 0,
    activeTiles: [],
    pauseStartedAt: null,
  };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "START": {
      return {
        ...createInitialState(),
        phase: "playing",
        activeTiles: spawnWave(0, action.now),
      };
    }
    case "TO_MENU": {
      return createInitialState();
    }
    case "PAUSE": {
      if (state.phase !== "playing") return state;
      return { ...state, phase: "paused", pauseStartedAt: action.now };
    }
    case "RESUME": {
      if (state.phase !== "paused" || state.pauseStartedAt === null) {
        return state;
      }
      const delta = action.now - state.pauseStartedAt;
      return {
        ...state,
        phase: "playing",
        pauseStartedAt: null,
        activeTiles: state.activeTiles.map((tile) => ({
          ...tile,
          spawnedAt: tile.spawnedAt + delta,
        })),
        nextSpawnAt: state.nextSpawnAt + delta,
      };
    }
    case "TAP": {
      if (state.phase !== "playing") return state;

      const hit = state.activeTiles.find((tile) => tile.index === action.index);
      if (!hit) {
        const lives = state.lives - 1;
        if (lives <= 0) return withGameOver(state);
        return {
          ...state,
          lives,
          combo: 0,
          activeTiles: spawnWave(state.score, action.now),
        };
      }

      const timeRatio = remainingMs(hit, action.now) / hit.timeout;
      const nextCombo = state.combo + 1;
      const points = Math.max(
        10,
        Math.round((10 + timeRatio * 15) * comboMultiplier(nextCombo)),
      );
      const remainingTiles = state.activeTiles.filter(
        (tile) => tile.index !== action.index,
      );
      const score = state.score + points;

      if (remainingTiles.length === 0) {
        return {
          ...state,
          score,
          combo: nextCombo,
          maxCombo: Math.max(state.maxCombo, nextCombo),
          activeTiles: [],
          nextSpawnAt: action.now + SPAWN_DELAY_MS,
        };
      }

      return {
        ...state,
        score,
        combo: nextCombo,
        maxCombo: Math.max(state.maxCombo, nextCombo),
        activeTiles: remainingTiles,
      };
    }
    case "TICK": {
      if (state.phase !== "playing") return state;

      const timedOut = state.activeTiles.some(
        (tile) => action.now - tile.spawnedAt >= tile.timeout,
      );

      if (timedOut) {
        const lives = state.lives - 1;
        if (lives <= 0) return withGameOver(state);
        return {
          ...state,
          lives,
          combo: 0,
          activeTiles: spawnWave(state.score, action.now),
        };
      }

      if (state.activeTiles.length === 0 && action.now >= state.nextSpawnAt) {
        return {
          ...state,
          activeTiles: spawnWave(state.score, action.now),
        };
      }

      return state;
    }
    default: {
      return state;
    }
  }
}
