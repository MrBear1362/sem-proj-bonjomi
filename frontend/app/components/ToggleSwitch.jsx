import { useState } from "react";
import styles from "./ToggleSwitch.module.css";

export default function ToggleSwitch() {
  const [isToggled, setIsToggled] = useState(false);

  return (
    <button
      className={`${styles.toggle} ${isToggled ? styles.toggleActive : ""}`}
      onClick={() => setIsToggled(!isToggled)}
      role="switch"
      aria-checked={isToggled}
    >
      <span className={styles.toggleCircle} />
    </button>
  );
}
