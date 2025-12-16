import React, { useState, useRef } from "react";
import { Form, useActionData } from "react-router";

export function MessageInput() {
  const [isInputFocused, setIsInputFocused] = useState(false);
  const formRef = useRef(null);
  const actionData = useActionData();
  const prevActionDataRef = useRef(actionData);

  React.useEffect(() => {
    // Reset form when actionData changes and success is true
    if (actionData?.success && actionData !== prevActionDataRef.current) {
      formRef.current?.reset();
      const input = formRef.current?.querySelector('[name="message"]');
      if (input) input.focus();
    }
    prevActionDataRef.current = actionData;
  }, [actionData]);
  
  return (
    <div className="message-input-container">
      <Form method="post" className="message-input-form" ref={formRef}>
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
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => {
            setTimeout(() => setIsInputFocused(false), 200);
          }}
          className="message-input"
          required
        />
        {isInputFocused ? (
          <button
            type="submit"
            className="send-btn"
            aria-label="Send message"
            onMouseDown={(e) => e.preventDefault()}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path d="M16.6915026,12.4744748 L3.50612381,13.2599618 C3.19218622,13.2599618 3.03521743,13.4170592 3.03521743,13.5741566 L1.15159189,20.0151496 C0.8376543,20.8006365 0.99,21.89 1.77946707,22.52 C2.41,22.99 3.50612381,23.1 4.13399899,22.8429026 L21.714504,14.0454487 C22.6563168,13.5741566 23.1272231,12.6315722 22.9702544,11.6889879 L4.13399899,1.16398622 C3.50612381,-0.1 2.40987166,-0.1 1.77946707,0.52 C0.994623095,1.16398622 0.837654326,2.25333925 1.15159189,3.0388262 L3.03521743,9.4798192 C3.03521743,9.6369166 3.34915502,9.63691662 3.50612381,9.63691662 L16.6915026,10.4224035 C16.6915026,10.4224035 17.1624089,10.4224035 17.1624089,10.9936957 L17.1624089,11.8791827 C17.1624089,12.4744748 16.6915026,12.4744748 16.6915026,12.4744748 Z" />
            </svg>
          </button>
        ) : (
          <button
            type="button"
            className="voice-btn"
            aria-label="Voice message"
          >
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
        )}
      </Form>
    </div>
  );
}
