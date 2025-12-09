import { useState } from "react";
import "./Like.css";

export default function Like() {
	const [likeCount, setLikeCount] = useState(2);
	const [isLiked, setIsLiked] = useState(false);

	const toggleLike = () => {
		setIsLiked(!isLiked);
		setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
	};

	return (
		<div className="container">
			<button
				className={`heart ${isLiked ? "heartActive" : ""}`}
				onClick={toggleLike}
				aria-label="Toggle like"
			/>
			<span className="likeCount">{likeCount}</span>
		</div>
	);
}
