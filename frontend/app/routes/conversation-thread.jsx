import { Link, useLoaderData } from "react-router";

// ===== CLIENTLOADER =====
// This runs BEFORE the component renders
// It fetches the conversation data and messages
export async function clientLoader({ params }) {
  const { conversationId } = params; // Get the ID from the URL like /messages/1

  // TODO: Replace with real API call later
  // For now, return mock data
  return {
    conversation: {
      id: conversationId,
      name: "Jonas Jacobsen",
      avatar:
        "https://ui-avatars.com/api/?name=Jonas+Jacobsen&background=random",
    },
    messages: [
      {
        id: "1",
        senderId: "other",
        content: "guitar over it and see if we can make it a full track",
        timestamp: "3:14 PM",
      },
      {
        id: "2",
        senderId: "me",
        content: "ok, so that was cool!",
        timestamp: "3:15 PM",
      },
      {
        id: "3",
        senderId: "other",
        content: "yo that jam was fire 🔥",
        timestamp: "3:16 PM",
      },
      {
        id: "4",
        senderId: "me",
        content: "omg i know right? crazy vibes",
        timestamp: "3:17 PM",
      },
      {
        id: "5",
        senderId: "other",
        content: "we def gotta record that version",
        timestamp: "3:18 PM",
      },
      {
        id: "6",
        senderId: "other",
        content: "the one after the second chorus",
        timestamp: "3:18 PM",
      },
      {
        id: "7",
        senderId: "me",
        content:
          "yep! I'll clean up the synth line tonight and send you the file",
        timestamp: "3:19 PM",
      },
      {
        id: "8",
        senderId: "other",
        content:
          "perfect. I'll layer some guitar over it and see if we can make it a full track",
        timestamp: "3:20 PM",
        unread: true,
      },
    ],
  };
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

function ConversationHeader() {
  return (
    <header className="conversation-header">
      {/* Back button, avatar, name, menu */}
    </header>
  );
}

function Message({ message, conversationAvatar }) {
  const isMe = message.senderId === "me";
  return (
    <div
      className={`message-row ${isMe ? "message-row-me" : "message-row-other"}`}
    >
      {/* Show avatar only for other user */}
      {/* Message bubble */}
    </div>
  );
}

function MessageInput() {
  return (
    <div className="message-input-container">
      <Form method="post" className="message-input-form">
        {/* Add button, input, voice button */}
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
