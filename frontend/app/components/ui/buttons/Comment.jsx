import "./comment.css";

export default function Comment({ commentCount = 0, isOpen, onClick }) {
  return (
    <div className="comment-container">
      <button
        onClick={onClick}
        className={`comment-btn ${isOpen ? "comment-btn--active" : ""}`}
        aria-label={isOpen ? "Hide comments" : "Show comments"}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={isOpen ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          width="20"
          height="20"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </button>
      <span className="comment-count">{commentCount}</span>
    </div>
  );
}
