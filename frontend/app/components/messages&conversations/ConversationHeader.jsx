import { Link } from "react-router";

export function ConversationHeader({ conversation }) {
  return (
    <header className="conversation-header">
      <Link to="/messages" className="back-btn">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path
            d="M19 12H5M12 19l-7-7 7-7"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </Link>
      <img
        src={conversation.avatar}
        alt={conversation.name}
        className="conversation-header-avatar"
      />
      <h2 className="conversation-header-name">{conversation.name}</h2>
      <button className="menu-btn" aria-label="Menu">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="5" r="2" />
          <circle cx="12" cy="12" r="2" />
          <circle cx="12" cy="19" r="2" />
        </svg>
      </button>
    </header>
  );
}
