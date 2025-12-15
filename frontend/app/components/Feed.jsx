import React from "react";
import NoteCard from "../components/NoteCard.jsx";
import { useLoaderData } from "react-router";

import "../app.css";
import "../components/noteCard.css";

export default function Feed({ notes: notesProp }) {
  const loaderData = useLoaderData();
  const notes = notesProp ?? loaderData?.notes;
  return (
    <div className="feed--container wrapper">
      {/* Using .map() to render each message - this is DYNAMIC RENDERING! */}
      {notes?.length > 0 ? (
        notes.map((note) => <NoteCard key={note.id} note={note} />)
      ) : (
        <p>No notes yet</p>
      )}
    </div>
  );
}
