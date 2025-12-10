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
          "https://ui-avatars.com/api/?name=Jonas+Jacobsen&background=random",
        lastMessage: "perfect. I'll layer some gui...",
        timestamp: "22:34",
        unread: false,
      },
      {
        id: "2",
        name: "LunaVisuals",
        avatar:
          "https://ui-avatars.com/api/?name=Luna+Visuals&background=random",
        lastMessage: "absolutely, i can do that fo...",
        timestamp: "20:11",
        unread: false,
      },
      {
        id: "3",
        name: "Lina Kozyrieva",
        avatar:
          "https://ui-avatars.com/api/?name=Lina+Kozyrieva&background=random",
        lastMessage: "Hey, I'm interested in joini...",
        timestamp: "18:23",
        unread: false,
      },
      {
        id: "4",
        name: "Victor Cretu",
        avatar:
          "https://ui-avatars.com/api/?name=Victor+Cretu&background=random",
        lastMessage: "You: Thank you for your fee...",
        timestamp: "10:23",
        unread: false,
      },
      {
        id: "5",
        name: "Sveta Borisova",
        avatar:
          "https://ui-avatars.com/api/?name=Sveta+Borisova&background=random",
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
        {/* Search and Edit icon buttons */}
      </div>
    </header>
  );
}

function MessagesTabs({ activeTab, onTabChange }) {
  return <div className="messages-tabs">{/* Chats and Groups buttons */}</div>;
}

function ConversationItem({ conversation }) {
  return (
    <Link to={`/messages/${conversation.id}`} className="conversation-item">
      {/* Avatar, name, timestamp, preview */}
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
