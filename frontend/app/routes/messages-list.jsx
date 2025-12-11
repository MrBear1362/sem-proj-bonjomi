import { useState } from "react";
import { Link, useLoaderData } from "react-router";
import { apiFetch } from "../lib/apiFetch.js";

// This function runs BEFORE the MessagesList component renders
// It fetches conversation data and returns it
export async function clientLoader() {
  try {
    const conversations = await apiFetch("/api/conversations");

    // Mapping backend fields to frontend shape
    return {
      conversations: conversations.map((conv) => ({
        id: conv.id,
        name: conv.title,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(conv.title)}&background=0D8ABC&color=fff`,
        lastMessage: conv.last_message_content || "No messages yet",
        timestamp: new Date(
          conv.last_message_time || conv.created_at
        ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        unread: false,
      })),
    };
  } catch (error) {
    console.error("Failed to load conversations:", error);
    throw error;
  }
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
