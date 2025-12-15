export function Message({ message, conversationAvatar }) {
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
