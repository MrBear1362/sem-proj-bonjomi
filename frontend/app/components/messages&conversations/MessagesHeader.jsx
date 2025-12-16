import { Link } from "react-router";

export function MessagesHeader() {
  return (
    <header className="messages-header">
      <h1 className="messages-title">Messages</h1>
      <div className="messages-actions">
        <button className="icon-btn" aria-label="Search">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <circle cx="11" cy="11" r="8" strokeWidth="2" />
            <path d="m21 21-4.35-4.35" strokeWidth="2" />
          </svg>
        </button>
        <Link
          to="/messages/new"
          className="icon-btn"
          aria-label="New Conversation"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
              strokeWidth="2"
            />
            <path
              d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
              strokeWidth="2"
            />
          </svg>
        </Link>
      </div>
    </header>
  );
}
