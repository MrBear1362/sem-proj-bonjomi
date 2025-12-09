import React, { useState, useEffect } from "react";
import { apiFetch } from "../library/apiFetch";
import Like from "./UI/Like";
import Comment from "./UI/Comment";
import InputField from "./UI/InputField";

export default function CommentSection({ noteId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
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

  return (
    <div className="comment-section">
      <InputField />
      {comments.map((comment) => (
        <div key={comment.id} className="comment">
          <p>
            {comment.first_name}: {comment.content}
          </p>
          <div className="grid">
            <Like />
            <p>reply</p>
          </div>
        </div>
      ))}
    </div>
  );
}
