import { useActionData, redirect } from "react-router";
import CreateNote from "../components/CreateNote.jsx";
import { apiFetch } from "../library/apiFetch.js";

import "../app.css";
import "../components/noteCard.css";

export async function clientAction({ request }) {
  const formData = await request.formData();
  const title = formData.get("title");
  const content = formData.get("content");
  const mediaUrl = formData.get("mediaUrl");
  const tags = formData.get("tags");

  /* Validate input pls (length and content) */

  if (!title || !title.trim()) {
    return { error: "Title cannot be empty" };
  }

  try {
    const response = await apiFetch("/api/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
        content: content.trim(),
        mediaUrl: mediaUrl,
        tagId: tags,
      }),
    });

    if (response.status === 400) {
      const error = await response.json();
      return { error: error.error || "Invalid note data" };
    }

    if (!response.ok) {
      return { error: `Failed to create note: ${response.status}` };
    }

    const data = await response.json();

    return redirect("/");
  } catch (error) {
    return { error: error.message };
  }
}

export default function createNote() {
  const actionData = useActionData();

  return (
    <>
      {/* maybe make it changeable for user vs business? */}
      {/* nav for different type of note - note, story, request */}
      <section className="create-note__container">
        {/* change component depending on what nav is active */}
        <CreateNote />
        {actionData?.error && (
          <div className="error-message">{actionData.error}</div>
        )}
      </section>
    </>
  );
}
