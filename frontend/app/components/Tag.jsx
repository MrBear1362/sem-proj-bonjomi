import { useState } from "react";
import styles from "./Tag.module.css";

export default function Tag({
  label = "Tag",
  type = "toggle",
  isActive = false,
  onClick,
}) {
  const [internalActive, setInternalActive] = useState(false);

  const isTagActive = type === "static" ? isActive : internalActive;

  const handleClick = () => {
    if (type === "toggle") {
      setInternalActive(!internalActive);
    } else if (type === "controlled" && onClick) {
      onClick();
    }
  };

  const displayLabel = type === "static" ? `#${label}` : label;

  return (
    <button
      className={`${styles.tag} ${isTagActive ? styles.tagActive : ""}`}
      disabled={type === "static"}
      onClick={handleClick}
    >
      {displayLabel}
    </button>
  );
}
