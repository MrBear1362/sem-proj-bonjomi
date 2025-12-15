import React, { useState } from "react";
import Tag from "./ui/buttons/Tag";
/* import Menu from "./UI/Menu"; */
import Like from "./ui/buttons/Like";
import Comment from "./ui/buttons/Comment";
import CommentSection from "./CommentSection";
/* import Repost from "./ui/Repost"; */

import "../app.css";
import "./noteCard.css";

export default function NoteCard({ note }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="note__card">
      <div className="flex note__nav">
        <img
          src={note.image_url}
          alt={note.first_name}
          className="note__nav--pic"
        />
        <p className="s-text">{note.first_name}</p>
        {note.tags && <Tag type="static" withBorder="true" label={note.tags} />}
        {/* <Menu /> */}
      </div>
      <div>
        <h2 className="xxl-heading">{note.title}</h2>
        {note.media_url && (
          <img
            src={note.media_url}
            alt={note.title}
            className="note__content--img"
          />
        )}
        <p className="m-text"> {note.content}</p>
      </div>
      <div className="flex">
        <Like
          type="note"
          noteId={note.id}
          likeCount={note.number_of_likes}
          isLiked={note.is_liked}
        />
        <Comment
          noteId={note.id}
          commentCount={note.number_of_comments}
          isOpen={isOpen}
          onClick={() => setIsOpen((v) => !v)}
        />
        {/* <Repost /> */}
      </div>
      {isOpen && <CommentSection noteId={note.id} />}
    </div>
  );
}
