import React, { useState } from "react";
import Like from "./ui/buttons/Like";
import InputField from "./ui/inputs/InputField";

import "../app.css";
import "./commentSection.css";
import "./ui/buttons/comment.css";

export default function CommentItem({
  comment,
  noteId,
  repliesMap,
  isNested = false,
}) {
  const [replyTo, setReplyTo] = useState(null);
  const replies = repliesMap[comment.id] || [];

  return (
    <div className="comment">
      <div className="comment__user flex">
        <img
          src={comment.image_url}
          alt={comment.first_name}
          className="profile--pic"
        />
        <p>{comment.first_name}</p>
      </div>
      <p>{comment.content}</p>
      <div className="flex align-right">
        <Like
          type="comment"
          commentId={comment.id}
          likeCount={comment.number_of_likes}
          isLiked={comment.is_liked}
        />
        <button
          className="btn--reply"
          aria-label="Reply"
          onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
        >
          {isNested ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              width="16"
              height="16"
            >
              <path d="M9 14L4 9l5-5" />
              <path d="M20 20v-7a4 4 0 0 0-4-4H4" />
            </svg>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                width="16"
                height="16"
              >
                <path d="M9 14L4 9l5-5" />
                <path d="M20 20v-7a4 4 0 0 0-4-4H4" />
              </svg>
              <span>Reply</span>
            </>
          )}
        </button>
      </div>
      {replyTo === comment.id && (
        <InputField
          commentId={comment.id}
          noteId={noteId}
          placeholder="Leave a comment"
        />
      )}

      {replies.length > 0 && (
        <div className="replies">
          {replies.map((r) => (
            <CommentItem
              key={r.id}
              comment={r}
              noteId={noteId}
              repliesMap={repliesMap}
              isNested={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}
