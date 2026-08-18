import { Game } from "@/components/Game";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Game />
      </main>
    </div>
  );
}
