import {
  useSubmit,
  useNavigation,
  redirect,
  useLoaderData,
} from "react-router";
import { useState } from "react";
import { apiFetch } from "../../library/apiFetch";
import { supabase } from "../../library/supabase";

// component import
import Button from "../../components/ui/buttons/Button";
import InputField from "../../components/ui/inputs/InputField";
import LoadingSpinner from "../../components/ui/bits/LoadingSpinner";
import TextareaField from "../../components/ui/inputs/TextareaField";
import {
  UserPreview,
  UserIdentifier,
} from "../../components/ui/bits/UserIdentifier";

export async function clientLoader() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.error("Error loading user:", error);
    return { user: null, profile: null };
  }

  try {
    // user data fetch based on collab req user id
    const profile = await apiFetch(`/api/users/${user.id}`).then((r) =>
      r.ok ? r.json() : null
    );

    return { profile };
  } catch (error) {
    console.error("Error loading user:", error);
    throw error;
  }
}

export async function clientAction({ request }) {
  const formData = await request.formData();

  const title = formData.get("title");
  const description = formData.get("description");
  const tagId = formData.get("tag_id");

  // validate title
  if (!title?.trim()) {
    return { error: "Title cannot be empty" };
  }

  try {
    const response = await apiFetch("/api/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title.trim(),
        content: description?.trim() || "",
        mediaUrl: "",
        tagId: "05000b25-6f72-4495-977c-7c046f5cd197",
      }),
    });

    // check for validation errors (400)
    if (response.status === 400) {
      const error = await response.json();
      return { error: error.error || "Invalid request data" };
    }

    // check for other errors
    if (!response.ok) {
      const errorMessage = await response.text();
      console.error("API error: ", errorMessage);
      return { error: `Failed to create note: ${response.status}` };
    }

    // get created request data
    const requestData = await response.json();

    // redirect to new post
    return redirect("/");
  } catch (error) {
    return { error: error.message || "Failed to create note" };
  }
}

export default function CreateNote() {
  const submit = useSubmit();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const { profile } = useLoaderData();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    // submit to this route's clientAction
    submit(formData, { method: "post" });
  };

  return (
    <section className="post-content">
      <header className="post-content-header flex-row">
        <UserIdentifier user={profile} />
        <button className="btn-primary">+ Add people</button>
      </header>

      <form onSubmit={handleSubmit} className="post-form flex-clm">
        <button type="button" className="btn-text">
          + Add tags
        </button>

        <InputField
          type="text"
          id="title"
          name="title"
          label="Title"
          required
          placeholder="Write a title..."
          autoComplete="off"
          className="text-input"
        />

        <button type="button" className="btn-outline">
          + Add Media
        </button>

        <TextareaField
          id="description"
          name="description"
          placeholder="Write a description..."
          rows={6}
          className="text-input"
        />

        <Button type="submit" className="btn-primary" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              Posting <LoadingSpinner />
            </>
          ) : (
            "Post"
          )}
        </Button>
      </form>
    </section>
  );
}
