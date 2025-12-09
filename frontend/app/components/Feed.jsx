import React from "react";
import NoteCard from "./NoteCard.jsx";
import { apiFetch } from "../lib/apiFetch.js";
import { supabase } from "../lib/supabase.js";
import { useLoaderData } from "react-router";

import "../feed.css";

export async function clientLoader() {
  const response = await apiFetch("/api/notes/feed");

  if (!response.ok) {
    throw new Error(`Failed to fetch notes: ${response.status}`);
  }

  const notes = await response.json();

  return { notes };
}

export default function Feed() {
  const { notes } = useLoaderData();

  return (
    <div className="note-card">
      {/* Using .map() to render each message - this is DYNAMIC RENDERING! */}
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} />
      ))}
    </div>
  );
}
