import React from "react";
import NoteCard from "../components/NoteCard.jsx";
import { useLoaderData } from "react-router";

import "../app.css";
import "../components/NoteCard.jsx";

export default function Feed() {
  const { notes } = useLoaderData();
  return (
    <div className="feed--container wrapper">
      {/* Using .map() to render each message - this is DYNAMIC RENDERING! */}
      {notes?.map((note) => <NoteCard key={note.id} note={note} />) || (
        <p>No notes yet</p>
      )}
    </div>
  );
}
