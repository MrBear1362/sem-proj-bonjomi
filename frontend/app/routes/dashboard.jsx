import { useNavigate, NavLink } from "react-router";
import { useEffect } from "react";
import ProtectedRoute from "../components/ProtectedRoute";
import { supabase } from "../library/supabase";
import { apiFetch } from "../library/apiFetch";
import { useLoaderData, useActionData } from "react-router";
import Button from "../components/ui/buttons/Button";
import Feed from "../components/Feed";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import CollabFeed from "../components/CollabFeed";

export async function clientLoader() {
  const responseNote = await apiFetch("/api/notes/feed");

  if (!responseNote.ok) {
    throw new Error(`Failed to fetch notes: ${response.status}`);
  }

  const notes = await responseNote.json();

  const responseCollab = await apiFetch("/api/collab-requests");

  if (!responseCollab.ok) {
    throw new Error(`Failed to fetch collabs: ${response.status}`);
  }

  const collabs = await responseCollab.json();

  return { notes, collabs };
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

export function meta({}) {
  return [
    { title: "LineUp - Find your place in the LineUp" },
    { name: "description", content: "Welcome to LineUp!" },
  ];
}

export default function DashboardPage() {
  const navigate = useNavigate();

  const { notes, collabs } = useLoaderData();

  const actionData = useActionData();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((e) => {
      if (e === "SIGNED_OUT") {
        navigate("/auth?step=login");
      }
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <ProtectedRoute>
      <section className="stories-container">There are stories here</section>

      <section className="collab-requests-container flex">
        {/* <h5>Collaboration requests</h5>
        <section className="collab-feed"></section> */}
        <CollabFeed collabs={collabs} />
      </section>

      <Feed notes={notes} />
    </ProtectedRoute>
  );
}
