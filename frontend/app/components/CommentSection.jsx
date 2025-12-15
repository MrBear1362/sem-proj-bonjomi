import React, { useState, useEffect } from "react";
import { apiFetch } from "../library/apiFetch";
import CommentItem from "./CommentItem";
import InputField from "./ui/inputs/InputField";

import "../app.css";
import "./commentSection.css";

export default function CommentSection({ noteId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const response = await apiFetch(`/api/notes/${noteId}/note-comments`);
        if (!response.ok)
          throw new Error(`Failed to fetch: ${response.status}`);
        const data = await response.json();
        setComments(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [noteId]);

  if (loading) return <p>Loading comments...</p>;
  if (error) return <p>Error: {error}</p>;

  const topLevel = comments
    .filter((c) => !c.parent_comment_id)
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

  const byParent = comments.reduce((acc, c) => {
    if (c.parent_comment_id) {
      (acc[c.parent_comment_id] ||= []).push(c);
    }
    return acc;
  }, {});

  Object.values(byParent).forEach((replies) =>
    replies.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
  );

  return (
    <div className="comment-section">
      <InputField
        noteId={noteId}
        placeholder="Leave a comment"
        className="input"
      />
      {comments.length === 0 ? (
        <p>No comments yet. Be the first to comment!</p>
      ) : (
        topLevel.map((c) => (
          <CommentItem
            key={c.id}
            comment={c}
            noteId={noteId}
            repliesMap={byParent}
          />
        ))
      )}
    </div>
  );
}
