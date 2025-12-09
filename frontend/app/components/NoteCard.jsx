import React from "react";
import Tag from "./Tag";
import Menu from "./Menu";
import Like from "./Like";
import Comment from "./Comment";
import Repost from "./Repost";

export default function NoteCard({ note }) {
  return (
    <div className="note">
      <div className="grid note__nav">
        <img
          src={note.image_url}
          alt={note.first_name}
          className="note__nav--pic"
        />
        <p className="xs-text">{note.first_name}</p>
        <Tag type="static" label={note.tags} />
        <Menu />
      </div>
      <div>
        <h2 className="xxl-heading">{note.title}</h2>
        {note.media_url && <img src={note.media_url} alt={note.title} />}
        <p className="m-text"> {note.content}</p>
      </div>
      <div className="grid">
        <Like noteId={note.id} likeCount={note.number_of_likes} />
        <Comment noteId={note.id} />
        <Repost />
      </div>
    </div>
  );
}
