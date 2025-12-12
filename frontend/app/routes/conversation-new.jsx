import { Form, Link, redirect, useActionData } from "react-router";
import { apiFetch } from "../lib/apiFetch.js";

export async function clientAction({ request }) {
  const formData = await request.formData();
  const title = formData.get("title");
  const participantEmail = formData.get("participantEmail");

  try {
    const conversation = await apiFetch("/api/conversations", {
      method: "POST",
      body: JSON.stringify({
        title,
        // Add participant logic based on your backend requirements
      }),
    });

    return redirect(`/messages/${conversation.id}`);
  } catch (error) {
    return { error: error.message };
  }
}

export default function ConversationNew() {
  const actionData = useActionData();

  return (
    <div className="conversation-new-page">
      <div className="conversation-new-container">
        <h1>New Conversation</h1>

        <Form method="post" className="conversation-form">
          <div className="form-group">
            <label htmlFor="title">Conversation Title</label>
            <input
              type="text"
              id="title"
              name="title"
              required
              placeholder="Enter conversation title"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="participantEmail">Add Participant (Email)</label>
            <input
              type="email"
              id="participantEmail"
              name="participantEmail"
              placeholder="user@example.com"
              className="form-input"
            />
            <small>Optional: Add another user to this conversation</small>
          </div>

          {actionData?.error && (
            <div className="error-message">{actionData.error}</div>
          )}

          <div className="form-actions">
            <button type="submit" className="btn-primary">
              Create Conversation
            </button>
            <Link to="/messages" className="btn-secondary">
              Cancel
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
}
