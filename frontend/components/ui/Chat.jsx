import React from "react";
import { Form } from "react-router";

function Message({ type = "user", children, avatar, userName, timestamp }) {
  return (
    <div className={`message ${type}-message`}>
      {type === "other" && avatar && (
        <img src={avatar} alt={userName} className="message-avatar" />
      )}
      <div className="message-wrapper">
        {type === "other" && userName && (
          <div className="message-sender">{userName}</div>
        )}
        <div className="message-content">{children}</div>
        {timestamp && <div className="message-time">{timestamp}</div>}
      </div>
    </div>
  );
}

/**
 * ChatMessages Component
 *
 * Now uses DESTRUCTURING WITH DEFAULT VALUES for safety! Key concepts:
 * 1. DESTRUCTURING: Extract messages directly from props object
 * 2. DEFAULT VALUES: messages = [] prevents errors if prop is undefined
 * 3. ERROR PREVENTION: No more "Cannot read property 'map' of undefined"
 * 4. GRACEFUL DEGRADATION: Component renders empty list if no messages provided
 * 5. CLEANER CODE: Direct access to messages instead of props.messages
 */
function ChatMessages({ messages = [] }) {
  return (
    <div className="chat-messages">
      {/* Using destructured messages with safe default! */}
      {messages.map((message) => (
        <Message key={message.id} type={message.type}>
          {message.content}
        </Message>
      ))}
    </div>
  );
}

/**
 * ChatInput Component
 *
 * Form component that handles user input for sending messages.
 * Now uses React Router Form for data mutations:
 * 1. FORM COMPONENT: React Router's Form for seamless data mutations
 * 2. METHOD="POST": Triggers the route's clientAction when submitted
 * 3. AUTOMATIC REVALIDATION: Data refreshes after successful submission
 * 4. NO STATE NEEDED: Form clears and data reloads automatically
 * 5. DECLARATIVE: Just render the form, React Router handles the rest
 */
function ChatInput() {
  return (
    <div className="chat-input-container">
      <Form method="post" className="chat-input-wrapper">
        <textarea
          name="message"
          className="chat-input"
          placeholder="Type your message here..."
          rows="1"
          required
        />
        <button className="send-button" type="submit">
          Send
        </button>
      </Form>
    </div>
  );
}

/**
 * Named Exports
 *
 * We export each component individually so they can be imported separately
 * if needed. This provides flexibility in how components are used.
 */
export { Message, ChatMessages, ChatInput };
