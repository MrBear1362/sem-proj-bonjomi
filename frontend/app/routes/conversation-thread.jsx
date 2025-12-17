import { useLoaderData, useActionData } from "react-router";
import { apiFetch } from "../library/apiFetch.js";
import { supabase } from "../library/supabase.js";
import { ConversationHeader } from "../components/messages&conversations/ConversationHeader.jsx";
import { Message } from "../components/messages&conversations/Message.jsx";
import { MessageInput } from "../components/messages&conversations/MessageInput.jsx";

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

  try {
    await apiFetch("/api/messages", {
      method: "POST",
      body: JSON.stringify({
        content: message.trim(),
        conversationid: conversationId,
      }),
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to send messge:", error);
    return { error: error.message || "Failed to send message" };
  }
}

export default function ConversationThread() {
  const { conversation, messages } = useLoaderData();
  const actionData = useActionData();

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
      <MessageInput shouldReset={Boolean(actionData?.success)} />

      {actionData?.error && (
        <div
          className="error-message"
          style={{ color: "red", padding: "10px" }}
        >
          {actionData.error}
        </div>
      )}
    </div>
  );
}
