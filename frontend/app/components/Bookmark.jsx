import { useState } from "react";
import styles from "./Bookmark.module.css";

export default function Bookmark() {
  const [isBookmarked, setIsBookmarked] = useState(false);

  return (
    <button
      className={`${styles.bookmark} ${isBookmarked ? styles.bookmarkActive : ""}`}
      onClick={() => setIsBookmarked(!isBookmarked)}
      aria-label="Toggle bookmark"
    />
  );
}
