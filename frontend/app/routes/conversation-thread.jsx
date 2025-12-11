import { Link, useLoaderData, Form } from "react-router";
import { apiFetch } from "../lib/apiFetch.js";
import { supabase } from "../lib/supabase.js";

// ===== CLIENTLOADER =====
// This runs BEFORE the component renders
// It fetches the conversation data and messages
export async function clientLoader({ params }) {
  const { conversationId } = params; // Get the ID from the URL like /messages/1
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const currentUserId = session?.user?.id;

  try {
    const [conversation, messages] = await Promise.all([
      apiFetch(`/api/conversations/${conversationId}`),
      apiFetch(`/api/conversations/${conversationId}/messages`),
    ]);

    return {
      conversation: {
        id: conversation.id,
        name: conversation.title,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(conversation.title)}&background=0D8ABC&color=fff`,
      },
      messages: messages.map((msg) => ({
        id: msg.id,
        senderId: msg.user_id === currentUserId ? "me" : "other",
        content: msg.content,
        timestamp: new Date(msg.created_at).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      })),
    };
  } catch (error) {
    console.error("Failed to load conversation:", error);
    throw error;
  }
}

// ===== CLIENTACTION =====
// This runs when a FORM is submitted (method="post")
// It sends the new message to the server
export async function clientAction({ params, request }) {
  const { conversationId } = params; // Get conversation ID from URL

  // Extract the message text from the form
  const formData = await request.formData();
  const message = formData.get("message");

  // Validate the message isn't empty
  if (!message || !message.trim()) {
    return { error: "Message cannot be empty" };
  }

  // TODO: Replace with real API call later
  // Example of what it would look like:
  // const response = await fetch(`/api/conversations/${conversationId}/messages`, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ content: message.trim() }),
  // });

  // For now, just return success (React Router will auto-refresh data)
  return { success: true };
}

function ConversationHeader({ conversation }) {
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

function Message({ message, conversationAvatar }) {
  const isMe = message.senderId === "me";
  return (
    <div
      className={`message-row ${isMe ? "message-row-me" : "message-row-other"}`}
    >
      {!isMe && (
        <img src={conversationAvatar} alt="User" className="message-avatar" />
      )}
      <div
        className={`message-bubble ${
          isMe ? "message-bubble-me" : "message-bubble-other"
        }`}
      >
        {message.content}
      </div>
    </div>
  );
}

function MessageInput() {
  return (
    <div className="message-input-container">
      <Form method="post" className="message-input-form">
        <button type="button" className="add-btn" aria-label="Add attachment">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="10" fill="#4A5568" />
            <path
              d="M12 8v8M8 12h8"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <input
          type="text"
          name="message"
          placeholder="Aa"
          className="message-input"
          required
        />
        <button type="button" className="voice-btn" aria-label="Voice message">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="10" fill="#4A5568" />
            <path
              d="M12 14a3 3 0 0 0 3-3V7a3 3 0 0 0-6 0v4a3 3 0 0 0 3 3z"
              fill="white"
            />
            <path
              d="M8 11a4 4 0 0 0 8 0M12 14v3"
              stroke="white"
              strokeWidth="2"
            />
          </svg>
        </button>
      </Form>
    </div>
  );
}

export default function ConversationThread() {
  const { conversation, messages } = useLoaderData();

  return (
    <div className="conversation-page">
      <ConversationHeader conversation={conversation} />
      <div className="messages-container">
        {messages.map((msg) => (
          <Message
            key={msg.id}
            message={msg}
            conversationAvatar={conversation.avatar}
          />
        ))}
      </div>
      <MessageInput />
    </div>
  );
}
