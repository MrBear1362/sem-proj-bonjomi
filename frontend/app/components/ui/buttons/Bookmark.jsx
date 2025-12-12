import { useState } from "react";
import styles from "./Bookmark.module.css";

export default function Bookmark() {
	const [isBookmarked, setIsBookmarked] = useState(false);

	return (
		<button
			className={styles.bookmark}
			onClick={() => setIsBookmarked(!isBookmarked)}
			aria-label="Toggle bookmark"
		>
			<svg
				width="24"
				height="32"
				viewBox="0 0 24 32"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M4 2C4 0.895431 4.89543 0 6 0H18C19.1046 0 20 0.895431 20 2V24L12 20L4 24V2Z"
					fill={isBookmarked ? "#ffc966" : "none"}
					stroke={isBookmarked ? "#ffc966" : "#333"}
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
		</button>
	);
}
