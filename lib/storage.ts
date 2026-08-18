const HIGH_SCORE_KEY = "tile-rush-high-score";
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

export function loadHighScore(): number {
  if (typeof window === "undefined") return 0;

  const raw = window.localStorage.getItem(HIGH_SCORE_KEY);
  const value = Number(raw);

  if (!Number.isFinite(value) || value < 0) return 0;
  return Math.floor(value);
}

export function saveHighScore(score: number): number {
  const next = Math.max(loadHighScore(), Math.max(0, Math.floor(score)));
  window.localStorage.setItem(HIGH_SCORE_KEY, String(next));
  emit();
  return next;
}

export function subscribeHighScore(onStoreChange: () => void) {
  listeners.add(onStoreChange);

  if (typeof window !== "undefined") {
    window.addEventListener("storage", onStoreChange);
  }

  return () => {
    listeners.delete(onStoreChange);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", onStoreChange);
    }
  };
}

export function getHighScoreSnapshot() {
  return loadHighScore();
}

export function getHighScoreServerSnapshot() {
  return 0;
}
