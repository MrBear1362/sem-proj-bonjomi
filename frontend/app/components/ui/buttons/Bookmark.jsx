import { useState } from "react";
import "./Bookmark.css";

export default function Bookmark() {
	const [isBookmarked, setIsBookmarked] = useState(false);

	return (
		<button
			className={`bookmark ${isBookmarked ? "bookmarkActive" : ""}`}
			onClick={() => setIsBookmarked(!isBookmarked)}
			aria-label="Toggle bookmark"
		/>
	);
}
