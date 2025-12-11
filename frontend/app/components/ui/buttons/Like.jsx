import { useState } from "react";
import styles from "./Like.module.css";

export default function Like() {
	const [likeCount, setLikeCount] = useState(2);
	const [isLiked, setIsLiked] = useState(false);

	const toggleLike = () => {
		setIsLiked(!isLiked);
		setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
	};

	return (
		<div className={styles.container}>
			<button
				className={`${styles.heart} ${isLiked ? styles.heartActive : ""}`}
				onClick={toggleLike}
				aria-label="Toggle like"
			/>
			<span className={styles.likeCount}>{likeCount}</span>
		</div>
	);
}
