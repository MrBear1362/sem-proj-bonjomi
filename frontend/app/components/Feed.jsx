import React from "react";
import NoteCard from "../components/NoteCard.jsx";
import { useLoaderData } from "react-router";

export default function Feed({ notes: notesProp }) {
  const loaderData = useLoaderData();
  const notes = notesProp ?? loaderData?.notes;
  return (
    <section className="feed--container wrapper">
      {/* Using .map() to render each message - this is DYNAMIC RENDERING! */}
      {notes?.length > 0 ? (
        notes.map((note) => <NoteCard key={note.id} note={note} />)
      ) : (
        <p>No notes yet</p>
      )}
    </section>
  );
}
