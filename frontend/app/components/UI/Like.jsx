import { useFetcher } from "react-router";
import { useState, useEffect } from "react";
import "./Like.css";

export default function Like({ type, noteId, commentId, likeCount, isLiked }) {
  const fetcher = useFetcher();
  const [optimisticLiked, setOptimisticLiked] = useState(isLiked);
  const [optimisticCount, setOptimisticCount] = useState(likeCount);

  useEffect(() => {
    setOptimisticLiked(isLiked);
    setOptimisticCount(likeCount);
  }, [isLiked, likeCount]);

  const handleLike = () => {
    setOptimisticLiked(!optimisticLiked);
    setOptimisticCount((prev) => (optimisticLiked ? prev - 1 : prev + 1));

    if (type === "note") {
      fetcher.submit(
        { type: "note", noteId, isLiked: optimisticLiked.toString() },
        { method: "post" }
      );
    } else if (type === "comment") {
      fetcher.submit(
        { type: "comment", commentId, isLiked: optimisticLiked.toString() },
        { method: "post" }
      );
    }
  };

  const isComment = type === "comment";
  const size = isComment ? 16 : 20;

  return (
    <div className={`container ? ${isComment ? "container--comment" : ""}`}>
      <button
        onClick={handleLike}
        className={`heart ${isComment ? "heart--comment" : ""} ${optimisticLiked ? "active" : ""}`}
        disabled={fetcher.state !== "idle"}
        aria-label={optimisticLiked ? "Unlike" : "Like"}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={optimisticLiked ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          width="20"
          height="20"
          width={size}
          height={size}
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </button>
      <span className={`likeCount ${isComment ? "likeCount--comment" : ""}`}>
        {optimisticCount || 0}
      </span>
    </div>
  );
}
