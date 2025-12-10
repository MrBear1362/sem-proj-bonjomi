import { useState } from "react";
import { Link, useLoaderData } from "react-router";

// This function runs BEFORE the MessagesList component renders
// It fetches conversation data and returns it
export async function clientLoader() {
  // TODO: Replace this with a real API call later
  // For now, return mock data that matches the UI mockup

  return {
    conversations: [
      {
        id: "1",
        name: "Jonas Jacobsen",
        avatar:
          "https://ui-avatars.com/api/?name=Jonas+Jacobsen&background=0D8ABC&color=fff",
        lastMessage: "perfect. I'll layer some gui...",
        timestamp: "22:34",
        unread: false,
      },
      {
        id: "2",
        name: "LunaVisuals",
        avatar:
          "https://ui-avatars.com/api/?name=Luna+Visuals&background=0D8ABC&color=fff",
        lastMessage: "absolutely, i can do that fo...",
        timestamp: "20:11",
        unread: false,
      },
      {
        id: "3",
        name: "Lina Kozyrieva",
        avatar:
          "https://ui-avatars.com/api/?name=Lina+Kozyrieva&background=0D8ABC&color=fff",
        lastMessage: "Hey, I'm interested in joini...",
        timestamp: "18:23",
        unread: false,
      },
      {
        id: "4",
        name: "Victor Cretu",
        avatar:
          "https://ui-avatars.com/api/?name=Victor+Cretu&background=0D8ABC&color=fff",
        lastMessage: "You: Thank you for your fee...",
        timestamp: "10:23",
        unread: false,
      },
      {
        id: "5",
        name: "Sveta Borisova",
        avatar:
          "https://ui-avatars.com/api/?name=Sveta+Borisova&background=0D8ABC&color=fff",
        lastMessage: "Sounds like a plan!",
        timestamp: "08:14",
        unread: false,
      },
    ],
  };
}

function MessagesHeader() {
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
        <button className="icon-btn" aria-label="Edit">
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
        </button>
      </div>
    </header>
  );
}

function MessagesTabs({ activeTab, onTabChange }) {
  return (
    <div className="messages-tabs">
      <button
        className={`tab ${activeTab === "chats" ? "tab-active" : ""}`}
        onClick={() => onTabChange("chats")}
      >
        Chats
      </button>
      <button
        className={`tab ${activeTab === "groups" ? "tab-active" : ""}`}
        onClick={() => onTabChange("groups")}
      >
        Groups
      </button>
    </div>
  );
}

function ConversationItem({ conversation }) {
  return (
    <Link to={`/messages/${conversation.id}`} className="conversation-item">
      <img
        src={conversation.avatar}
        alt={conversation.name}
        className="conversation-avatar"
      />
      <div className="conversation-content">
        <div className="conversation-header">
          <span className="conversation-name">{conversation.name}</span>
          <span className="conversation-time">{conversation.timestamp}</span>
        </div>
        <div className="conversation-preview">{conversation.lastMessage}</div>
      </div>
    </Link>
  );
}

export default function MessagesList() {
  const { conversations } = useLoaderData();
  const [activeTab, setActiveTab] = useState("chats");

  return (
    <div className="messages-page">
      <MessagesHeader />
      <MessagesTabs activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="conversations-list">
        {conversations.map((conversation) => (
          <ConversationItem key={conversation.id} conversation={conversation} />
        ))}
      </div>
    </div>
  );
}
