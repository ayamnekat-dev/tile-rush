"use client";

import styles from "./AudioToggle.module.css";

type AudioToggleProps = {
  isMuted: boolean;
  onToggle: () => void;
};

export function AudioToggle({ isMuted, onToggle }: AudioToggleProps) {
  return (
    <button
      type="button"
      className={styles.toggleBtn}
      onClick={onToggle}
      aria-label={isMuted ? "Aktifkan Musik" : "Matikan Musik"}
      title={isMuted ? "Aktifkan Musik" : "Matikan Musik"}
    >
      {isMuted ? (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      ) : (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
        </svg>
      )}
    </button>
  );
}
