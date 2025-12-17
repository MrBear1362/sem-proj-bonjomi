import { Link } from "react-router";

export function ConversationItem({ conversation, onDelete }) {
  return (
    <Link to={`/messages/${conversation.id}`} className="conversation-item">
      <img
        src={conversation.avatar}
        alt={conversation.name}
        className="conversation-avatar"
      />
      <div className="conversation-content">
        <div className="conversation-item-header">
          <span className="conversation-name">{conversation.name}</span>
          <span className="conversation-time">{conversation.timestamp}</span>
        </div>
        <div className="conversation-preview">{conversation.lastMessage}</div>
      </div>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (confirm("Delete this conversation?")) {
            onDelete(conversation.id);
          }
        }}
        className="conversation-delete-btn"
        aria-label="Delete conversation"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 3h6" />
          <path d="M5 6h14" />
          <path d="M7 6v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V6" />
          <line x1="10" y1="11" x2="10" y2="17" />
          <line x1="14" y1="11" x2="14" y2="17" />
        </svg>
      </button>
    </Link>
  );
}
