import { useState } from "react";
import { useLoaderData } from "react-router";
import { apiFetch } from "../lib/apiFetch.js";
import { MessagesHeader } from "../components/messages&conversations/MessagesHeader.jsx";
import { MessagesTabs } from "../components/messages&conversations/MessagesTabs.jsx";
import { ConversationItem } from "../components/messages&conversations/ConversationItem.jsx";

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
        ).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
        unread: false,
        participantCount: Number(conv.participant_count),
      })),
    };
  } catch (error) {
    console.error("Failed to load conversations:", error);
    throw error;
  }
}

export default function MessagesList() {
  const data = useLoaderData();
  const [conversations, setConversations] = useState(data.conversations);
  const [activeTab, setActiveTab] = useState("chats");

  const handleDeleteConversation = async (conversationId) => {
    try {
      await apiFetch(`/api/conversations/${conversationId}`, {
        method: "DELETE",
      });
      setConversations(conversations.filter((c) => c.id !== conversationId));
    } catch (error) {
      console.error("Failed to delete conversations:", error);
    }
  };

  return (
    <div className="messages-page">
      <MessagesHeader />
      <MessagesTabs activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="conversations-list">
        {conversations
          .filter((conversation) => {
            if (activeTab === "chats") {
              return conversation.participantCount === 2;
            } else if (activeTab === "groups") {
              return conversation.participantCount > 2;
            }
            return true;
          })
          .map((conversation) => (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
              onDelete={handleDeleteConversation}
            />
          ))}
      </div>
    </div>
  );
}
