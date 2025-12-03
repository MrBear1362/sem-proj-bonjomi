import React from "react";

function Note({ children }) {
  return (
    <div className="note">
      <div className="grid">
        <img>{notes.img_url}</img>
        <p>{notes.first_name}</p>
        <Tag type="static" label={notes.name} />
        <Menu />
      </div>
      <h2 className="element-l">{notes.title}</h2>
      <img>{notes.media_url}</img>
      <p className="element-m"> {notes.content}</p>
      <div className="grid">
        <Like />
        <Comment />
        <Repost />
      </div>
    </div>
  );
}

function NoteCard({ notes = [] }) {
  return (
    <div className="note-card">
      {/* Using .map() to render each message - this is DYNAMIC RENDERING! */}
      {notes.map((notes) => (
        <NoteCard key={notes.id}>{notes.content}</NoteCard>
      ))}
    </div>
  );
}

export { Note, NoteCard };
