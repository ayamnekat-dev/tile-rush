import styles from "./Overlay.module.css";

type MenuScreenProps = {
  highScore: number;
  onStart: () => void;
};

export function MenuScreen({ highScore, onStart }: MenuScreenProps) {
  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        <p className={styles.kicker}>Dark Glow Arcade</p>
        <h1 className={styles.title}>TILE RUSH</h1>
        <p className={styles.lead}>
          Ketuk tile yang menyala sebelum cahayanya padam. Semakin cepat,
          semakin besar skornya.
        </p>

        <ul className={styles.rules}>
          <li>Hanya ketuk tile yang ber-glow</li>
          <li>Salah ketuk atau terlambat = kehilangan nyawa</li>
          <li>Combo 5× dan 10× menggandakan poin</li>
          <li>Skor 150+ memunculkan dua tile sekaligus</li>
        </ul>

        <p className={styles.highScore}>
          High score: <strong>{highScore}</strong>
        </p>

        <button type="button" className={styles.primary} onClick={onStart}>
          Mainkan
        </button>
        <p className={styles.hint}>Enter untuk mulai · Esc untuk jeda</p>
      </div>
    </div>
  );
}
