import React from "react";
import Navigation from "../components/Navigation.jsx";
import NoteCard from "../components/NoteCard.jsx";
import { apiFetch } from "../lib/apiFetch.js";
import { supabase } from "../lib/supabase.js";
import { useLoaderData } from "react-router";

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
    <section>
      <NoteCards notes={notes} />
    </section>
  );
}
