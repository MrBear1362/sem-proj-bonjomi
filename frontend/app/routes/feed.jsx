import React from "react";
import NoteCard from "../components/NoteCard.jsx";
import { apiFetch } from "../library/apiFetch.js";
/* import { supabase } from "../library/supabase.js"; */
import { useLoaderData, useActionData } from "react-router";

export async function clientLoader() {
  const response = await apiFetch("/api/notes/feed");

  if (!response.ok) {
    throw new Error(`Failed to fetch notes: ${response.status}`);
  }

  const notes = await response.json();

  return { notes };
}

export async function clientAction({ params, request }) {
  const formData = await request.formData();
  const noteId = formData.get("noteId");
  const isLiked = formData.get("isLiked") === "true";
  try {
    if (isLiked) {
      await apiFetch(`/api/notes/${noteId}/note-likes`, { method: "DELETE" });
      if (response.status === 400) {
        const error = await response.json();
        return { error: error.error || "Can't unlike" };
      }

      if (!response.ok) {
        return { error: `Failed to unlike note: ${response.status}` };
      }
      return { success: true };
    } else {
      await apiFetch(`/api/notes/${noteId}/note-likes`, { method: "POST" });
      if (response.status === 400) {
        const error = await response.json();
        return { error: error.error || "Can't like" };
      }

      if (!response.ok) {
        return { error: `Failed to like note: ${response.status}` };
      }
      return { success: true };
    }
  } catch (error) {
    return { error: error.message };
  }
}

export default function Feed() {
  const { notes } = useLoaderData();

  const actionData = useActionData();

  return (
    <div className="note-card">
      {/* Using .map() to render each message - this is DYNAMIC RENDERING! */}
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} />
      ))}
    </div>
  );
}
