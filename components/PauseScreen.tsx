import styles from "./Overlay.module.css";

type PauseScreenProps = {
  onResume: () => void;
  onMenu: () => void;
};

export function PauseScreen({ onResume, onMenu }: PauseScreenProps) {
  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        <p className={styles.kicker}>Berhenti sejenak</p>
        <h1 className={styles.title}>PAUSE</h1>
        <p className={styles.lead}>Waktu tile dibekukan sampai kamu lanjut.</p>
        <div className={styles.actions}>
          <button type="button" className={styles.primary} onClick={onResume}>
            Lanjutkan
          </button>
          <button type="button" className={styles.ghost} onClick={onMenu}>
            Menu
          </button>
        </div>
      </div>
    </div>
  );
}
