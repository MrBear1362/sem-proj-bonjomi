import { useSubmit, useNavigation, redirect } from "react-router";
import { useState } from "react";
import { apiFetch } from "../../library/apiFetch";
import { supabase } from "../../library/supabase";
import { useLoaderData } from "react-router";

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
  const location = formData.get("location");
  const isRemote = formData.get("remote") === "true";
  const isPaid = formData.get("paid") === "true";
  const tagId = formData.get("tag_id");
  const dueDate = formData.get("due_date");

  // validate title
  if (!title?.trim()) {
    return { error: "Title cannot be empty" };
  }

  // if remote is checked, use "remote" in location field, otherwise require location
  const finalDestination = isRemote ? "remote" : location?.trim();

  if (!finalDestination) {
    return { error: "Location is required (or check remote)" };
  }

  try {
    const response = await apiFetch("/api/collab-requests", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title.trim(),
        content: description?.trim() || "",
        location: finalDestination,
        is_paid: isPaid,
        tag_id: "05000b25-6f72-4495-977c-7c046f5cd197",
        due_date: dueDate,
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
      return { error: `Failed to create request: ${response.status}` };
    }

    // get created request data
    const requestData = await response.json();

    // redirect to new post
    return redirect(
      `/posts/${requestData.id || requestData.collab_request?.id}`
    );
  } catch (error) {
    return { error: error.message || "Failed to create request" };
  }
}

export default function CreateRequest() {
  const submit = useSubmit();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [isRemote, setIsRemote] = useState(false);
  const [location, setLocation] = useState("");
  const [savedLocation, setSavedLocation] = useState("");
  const { profile } = useLoaderData();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    // submit to this route's clientAction
    submit(formData, { method: "post" });
  };

  function onRemoteToggle(checked) {
    if (checked) {
      setSavedLocation(location);
      setLocation("Remote");
    } else {
      setLocation(savedLocation);
    }
  }

  return (
    <section className="post-content">
      <header className="post-content-header flex-row">
        <UserIdentifier user={profile} />
        <button className="btn-primary">+ Add people</button>
      </header>

      <form onSubmit={handleSubmit} className="post-form flex-clm">
        {/* hidden field for due_date */}
        <input
          type="hidden"
          name="due_date"
          value={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()}
        />

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

        {/* hidden field for tag_id */}
        <input type="hidden" name="tag_id" value="1" />
        <button type="button" className="btn-text">
          + Add genres
        </button>

        <InputField
          type="text"
          id="location"
          name="location"
          label="Location"
          placeholder="Add location"
          autoComplete="address-level2"
          className={`text-input ${isRemote ? "input-disabled" : ""}`}
          value={location}
          disabled={isRemote}
          onChange={(e) => setLocation(e.target.value)}
        />

        <div className="toggle flex-clm">
          <div className="container">
            <input
              type="checkbox"
              className="checkbox"
              id="remote"
              name="remote"
              value="true"
              checked={isRemote}
              onChange={(e) => {
                const checked = e.target.checked;
                setIsRemote(checked);
                onRemoteToggle(checked);
              }}
            />
            <label className="switch" htmlFor="remote">
              <span className="slider"></span>
            </label>
          </div>
          <p className="toggle-text">Remote</p>
        </div>

        <div className="toggle flex-clm">
          <div className="container">
            <input
              type="checkbox"
              className="checkbox"
              id="paid"
              name="paid"
              value="true"
            />
            <label className="switch" htmlFor="paid">
              <span className="slider"></span>
            </label>
          </div>
          <p className="toggle-text">Paid opportunity</p>
        </div>

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
