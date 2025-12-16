import { useState } from "react";

export default function Bookmark() {
	const [isBookmarked, setIsBookmarked] = useState(false);

	const handleToggle = () => {
		setIsBookmarked(!isBookmarked);
	}

	return (
		<button
			className={`bookmark ${isBookmarked ? "bookmarkActive" : ""}`}
			onClick={handleToggle}
			aria-label="Toggle bookmark"
		/>
	);
}
