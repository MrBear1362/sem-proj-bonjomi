import React from "react";
import NoteCard from "../components/NoteCard.jsx";
import { apiFetch } from "../library/apiFetch.js";
import Navigation from "../components/Navigation.jsx";
import { useLoaderData, useActionData } from "react-router";

import "../app.css";
import "../components/NoteCard.jsx";

export async function clientLoader() {
  const response = await apiFetch("/api/notes/feed");

  if (!response.ok) {
    throw new Error(`Failed to fetch notes: ${response.status}`);
  }

  const notes = await response.json();

  return { notes };
}

export async function clientAction({ params, request }) {
  const formData = await request.formData();
  const type = formData.get("type");
  const noteId = formData.get("noteId");
  const commentId = formData.get("commentId");
  const isLiked = formData.get("isLiked") === "true";

  try {
    let response;

    if (type === "note") {
      response = await apiFetch(`/api/notes/${noteId}/likes`, {
        method: isLiked ? "DELETE" : "POST",
      });
    } else if (type === "comment") {
      response = await apiFetch(`/api/note-comments/${commentId}/likes`, {
        method: isLiked ? "DELETE" : "POST",
      });
    } else {
      return { error: "Unknown type" };
    }

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return { error: err.error || `Request failed: ${response.status}` };
    }

    return { success: true };
  } catch (error) {
    return { error: error.message };
  }
}

export default function Feed() {
  const { notes } = useLoaderData();

  const actionData = useActionData();

  return (
    <>
      <Navigation />
      <section className="collab__container">
        <h3>Collab Requests</h3>
        <article className="collab__card wrapper">
          <div className="flex collab__card--nav">
            <img
              src="https://images.unsplash.com/photo-1635927895729-5ac66f9e3669?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt=""
              className="note__nav--pic"
            />
            <p>
              <span className="bold">Peter</span> is looking for a #guitarist
            </p>
          </div>
          <p className="extra-bold">Need a guitarist for my next concert</p>
          <p className="s-text">
            I need someone who can learn a few song very fast. There is not much
            time left. We play mostly heavy stuff so it would be amazing if you
            have a 7 string.
          </p>
          <div className="flex-space">
            <p className="xs-text bold">read more</p>
            <p>Aarhus - 9h ago</p>
          </div>
        </article>
        <button className="placeholder">See more collabs</button>
      </section>
      <div className="feed--container wrapper">
        {/* Using .map() to render each message - this is DYNAMIC RENDERING! */}
        {notes.map((note) => (
          <NoteCard key={note.id} note={note} />
        ))}
      </div>
    </>
  );
}
